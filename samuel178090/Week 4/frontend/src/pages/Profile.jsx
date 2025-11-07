import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import UserProfile from '../components/UserProfile'
import HeaderInfo from '../components/HeaderInfo'
import Feed from '../components/Feed'
import FeedSkeleton from '../components/FeedSkeleton'
import EditPostModal from '../components/EditPostModal'
import EditProfileModal from '../components/EditProfileModal'

const Profile = () => {
  const [user, setUser] = useState({})
  const [userPosts, setUserPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { id: userId } = useParams()
  const token = useSelector(state => state?.user?.currentUser?.token)
  const editPostModalOpen = useSelector(state => state?.ui?.editPostModalIsOpen)
  const editProfileModalOpen = useSelector(state => state?.ui?.editProfileModalIsOpen)
  const navigate = useNavigate()

  // GET USER
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
    } catch (error) {
      console.error('Error fetching user:', error)
      if (error.response?.status === 404) {
        navigate('/404')
      }
    }
  }

  // GET USER POSTS
  const getUserPosts = async () => {
    if (!userId || !token) return

    setIsLoading(true)
    setError('')

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/posts`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setUserPosts(response?.data?.posts || response?.data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Failed to load posts')
    } finally {
      setIsLoading(false)
    }
  }

  // DELETE POST
  const deletePost = async (postId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${postId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setUserPosts(userPosts.filter(post => post._id !== postId))
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  // UPDATE POST
  const updatePost = async (data, postId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/${postId}`,
        data,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response?.status === 200) {
        const updatedPost = response?.data
        setUserPosts(userPosts.map(post => {
          if (updatedPost?._id === post?._id) {
            return { ...post, ...updatedPost }
          }
          return post
        }))
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post')
    }
  }

  useEffect(() => {
    getUser()
    getUserPosts()
  }, [userId, token])

  return (
    <section className="mainArea">
      <UserProfile />
      <HeaderInfo text={`${user?.fullName || 'User'}'s posts`} />
      <section className="profile__post">
        {isLoading ? (
          <FeedSkeleton count={3} />
        ) : error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button onClick={getUserPosts} className="btn primary">
              Retry
            </button>
          </div>
        ) : userPosts?.length < 1 ? (
          <div className="empty-state">
            <p>No posts found</p>
          </div>
        ) : (
          userPosts?.map(post => (
            <Feed key={post._id} post={post} onDeletePost={deletePost} />
          ))
        )}
      </section>
      {editPostModalOpen && <EditPostModal onUpdatePost={updatePost} />}
      {editProfileModalOpen && <EditProfileModal />}
    </section>
  )
}

export default Profile