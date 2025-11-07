import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { uiSliceActions } from '../store/ui-slice'

const EditProfileModal = () => {
    const [userData, setUserData] = useState({ fullName: "", bio: "" })
    const dispatch = useDispatch()
    const token = useSelector(state => state?.user?.currentUser?.token)
    const id = useSelector(state => state?.user?.currentUser?.id)

    // GET USER FROM DB
    const getUser = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/${id}`,
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            setUserData({
                fullName: response?.data?.fullName || "",
                bio: response?.data?.bio || ""
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    const closeModal = (e) => {
        if (e.target.classList.contains('editProfile')) {
            dispatch(uiSliceActions.closeEditProfileModal())
        }
    }

    const updateUser = async (e) => {
        e.preventDefault()
        if (!userData.fullName?.trim()) return
        
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/edit`,
                userData,
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            
            // Update Redux state with new user data
            const currentUser = JSON.parse(localStorage.getItem('currentUser'))
            const updatedUser = {
                ...currentUser,
                fullName: response.data.fullName,
                bio: response.data.bio
            }
            
            localStorage.setItem('currentUser', JSON.stringify(updatedUser))
            dispatch(uiSliceActions.closeEditProfileModal())
            
            // Refresh page to show updated data
            window.location.reload()
        } catch (error) {
            console.error('Profile update error:', error)
        }
    }

    const changeUserData = (e) => {
        setUserData(prevState => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        })
    }

    return (
        <section className="editProfile" onClick={closeModal}>
            <div className="editProfile__container">
                <h3>Edit Profile</h3>
                <form onSubmit={updateUser}>
                    <input
                        type="text"
                        name="fullName"
                        value={userData?.fullName}
                        onChange={changeUserData}
                        placeholder="Full Name"
                    />
                    <textarea
                        name="bio"
                        value={userData?.bio}
                        onChange={changeUserData}
                        placeholder="Bio (emojis supported! 😊🚀💻)"
                        maxLength={500}
                        rows={4}
                    />
                    <small>{userData?.bio?.length || 0}/500 characters</small>
                    <button type='submit' className='btn primary'>
                        Update
                    </button>
                </form>
            </div>
        </section>
    )
}

export default EditProfileModal