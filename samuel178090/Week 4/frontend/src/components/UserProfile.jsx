import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { LuUpload } from "react-icons/lu"
import { FaCheck } from "react-icons/fa"
import { userActions } from '../store/user-slice'
import { uiSliceActions } from '../store/ui-slice'

const UserProfile = () => {
    const token = useSelector((state) => state?.user?.currentUser?.token)
    const loggedInUserId = useSelector((state) => state?.user?.currentUser?._id || state?.user?.currentUser?.id)
    const currentUser = useSelector((state) => state?.user?.currentUser)

    const [user, setUser] = useState({})
    const [followsUser, setFollowsUser] = useState(false)
    const [avatar, setAvatar] = useState(null)
    const [isFollowLoading, setIsFollowLoading] = useState(false)
    const [isAvatarLoading, setIsAvatarLoading] = useState(false)
    const [avatarTouched, setAvatarTouched] = useState(false)
    const { id: userId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // GET USER FROM DB
    const getUser = async () => {
        if (!userId || !token) return
        
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/${userId}`,
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            setUser(response?.data)
            setFollowsUser(response?.data?.followers?.includes(loggedInUserId))
        } catch (error) {
            console.error('Error fetching user:', error)
            if (error.response?.status === 404) {
                navigate('/404')
            }
        }
    }

    // FUNCTION TO CHANGE AVATAR/PROFILE PHOTO
    const changeAvatarHandler = async (e) => {
        e.preventDefault()
        if (!avatar || isAvatarLoading) return
        
        // Validate file size (5MB)
        if (avatar.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB')
            return
        }
        
        console.log('Starting avatar upload...', avatar.name)
        setIsAvatarLoading(true)
        
        try {
            const postData = new FormData()
            postData.append('avatar', avatar)
            
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/avatar`,
                postData,
                {
                    withCredentials: true,
                    headers: { 
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            
            console.log('Avatar upload response:', response.data)
            
            const newProfilePhoto = response?.data?.profilePhoto || response?.data?.user?.profilePhoto
            
            if (newProfilePhoto) {
                // Update Redux state
                const updatedUser = {
                    ...currentUser,
                    profilePhoto: newProfilePhoto
                }
                dispatch(userActions.changeCurrentUser(updatedUser))
                localStorage.setItem('currentUser', JSON.stringify(updatedUser))
                
                // Update local user state
                setUser(prev => ({ ...prev, profilePhoto: newProfilePhoto }))
                
                // Reset form
                setAvatarTouched(false)
                setAvatar(null)
                
                // Reset file input
                const fileInput = document.getElementById('avatar')
                if (fileInput) fileInput.value = ''
                
                console.log('Profile photo updated successfully!')
            }
        } catch (error) {
            console.error('Avatar upload error:', error)
            alert('Failed to upload avatar: ' + (error.response?.data?.message || error.message))
        } finally {
            setIsAvatarLoading(false)
        }
    }

    // FUNCTION TO OPEN "EDIT USER" MODAL
    const openEditProfileModal = () => {
        dispatch(uiSliceActions.openEditProfileModal())
    }

    // FUNCTION TO FOLLOW/UNFOLLOW USER
    const followUserHandler = async () => {
        if (isFollowLoading) return
        
        setIsFollowLoading(true)
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/${userId}/follow`,
                {},
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            
            const updatedUser = response?.data?.user
            const isNowFollowing = updatedUser?.followers?.includes(loggedInUserId)
            
            setFollowsUser(isNowFollowing)
            setUser(prev => ({
                ...prev,
                followers: updatedUser?.followers || prev.followers,
                following: updatedUser?.following || prev.following
            }))
            
            console.log(isNowFollowing ? 'User followed successfully' : 'User unfollowed successfully')
        } catch (error) {
            console.error('Follow/unfollow error:', error)
            alert('Failed to follow/unfollow user')
        } finally {
            setIsFollowLoading(false)
        }
    }

    useEffect(() => {
        getUser()
    }, [userId, token])

    const isOwnProfile = user?._id === loggedInUserId
    const defaultAvatar = 'https://res.cloudinary.com/deew4s53w/image/upload/v1760441163/Sample_User_Icon_breopx.png'

    return (
        <section className="user-profile">
            <div className="profile__container">
                <form
                    className="profile__image"
                    onSubmit={changeAvatarHandler}
                    encType='multipart/form-data'
                >
                    <img 
                        src={user?.profilePhoto || defaultAvatar} 
                        alt={user?.fullName || 'Profile'} 
                        onError={(e) => {
                            e.target.src = defaultAvatar
                        }}
                    />
                    {isOwnProfile && (
                        !avatarTouched ? (
                            <label htmlFor="avatar" className='profile__image-edit' title="Change profile photo">
                                <span><LuUpload /></span>
                            </label>
                        ) : (
                            <button 
                                type='submit' 
                                className={`profile__image-btn ${isAvatarLoading ? 'loading' : ''}`}
                                disabled={isAvatarLoading}
                                title="Save new profile photo"
                            >
                                {isAvatarLoading ? <span className="spinner"></span> : <FaCheck />}
                            </button>
                        )
                    )}
                    {isOwnProfile && (
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            onChange={e => {
                                const file = e.target.files[0]
                                if (file) {
                                    setAvatar(file)
                                    setAvatarTouched(true)
                                }
                            }}
                            accept='image/png, image/jpg, image/jpeg, image/webp'
                            style={{ display: 'none' }}
                        />
                    )}
                </form>
                <div className="profile__info">
                    <h4>{user?.fullName || 'Loading...'}</h4>
                    <small>{user?.email}</small>
                    {user?.bio && user?.bio !== "No bio yet" && (
                        <p className="profile__bio">{user?.bio}</p>
                    )}
                </div>
                <ul className="profile__follows">
                    <li>
                        <h4>{user?.followers?.length || 0}</h4>
                        <small>Followers</small>
                    </li>
                    <li>
                        <h4>{user?.following?.length || 0}</h4>
                        <small>Following</small>
                    </li>
                    <li>
                        <h4>{user?.posts?.length || 0}</h4>
                        <small>Posts</small>
                    </li>
                </ul>
                <div className="profile__actions-wrapper">
                    {isOwnProfile ? (
                        <button className='btn primary' onClick={openEditProfileModal}>
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button 
                                onClick={followUserHandler} 
                                className={`btn ${followsUser ? 'outline' : 'primary'} ${isFollowLoading ? 'loading' : ''}`}
                                disabled={isFollowLoading}
                            >
                                {isFollowLoading ? <span className="spinner"></span> : (followsUser ? 'Unfollow' : 'Follow')}
                            </button>
                            <Link to={`/messages/${user?._id}`} className='btn dark'>
                                Message
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

export default UserProfile