import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CreatePost from '../components/CreatePost'
import Feed from '../components/Feed'
import FeedSkeleton from '../components/FeedSkeleton'
import axios from 'axios'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [feedType, setFeedType] = useState('following')
  const currentUser = useSelector(state => state?.user?.currentUser)
  const navigate = useNavigate()

  // Get token from currentUser
  const token = currentUser?.token

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser || !token) {
      navigate('/login')
    }
  }, [currentUser, token, navigate])

  // Function to create post
  const createPost = async (data) => {
    setError("")
    try {
      console.log('Creating post with data:', data)
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        data,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log('Post created successfully:', response.data)
      const newPost = response.data
      setPosts([newPost, ...posts])
      setError("")
    } catch (err) {
      console.error('Post creation error:', err)
      console.error('Error response:', err.response?.data)
      setError(err?.response?.data?.message || 'Failed to create post')
      throw err
    }
  }

  // FUNCTION TO GET POSTS (Following)
  const getPosts = async () => {
    if (!token) return

    setIsLoading(true)
    setError("")

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/following`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setPosts(response.data || [])
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError(err?.response?.data?.message || 'Failed to load posts')
    } finally {
      setIsLoading(false)
    }
  }

  // FUNCTION TO GET ALL POSTS (Explore)
  const getAllPosts = async () => {
    if (!token) return

    setIsLoading(true)
    setError("")

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setPosts(response.data || [])
    } catch (err) {
      console.error('Error fetching all posts:', err)
      setError(err?.response?.data?.message || 'Failed to load posts')
    } finally {
      setIsLoading(false)
    }
  }

  // FUNCTION TO DELETE POST
  const deletePost = (postId) => {
    setPosts(posts.filter(post => post._id !== postId))
  }

  useEffect(() => {
    if (token) {
      if (feedType === 'following') {
        getPosts()
      } else {
        getAllPosts()
      }
    }
  }, [token, feedType])

  // Don't render if not authenticated
  if (!currentUser || !token) {
    return null
  }

  return (
    <section className="mainArea">
      <CreatePost onCreatePost={createPost} error={error} />

      <div className="feed-tabs">
        <button
          className={`tab ${feedType === 'following' ? 'active' : ''}`}
          onClick={() => setFeedType('following')}
        >
          Following
        </button>
        <button
          className={`tab ${feedType === 'explore' ? 'active' : ''}`}
          onClick={() => setFeedType('explore')}
        >
          Explore
        </button>
      </div>

      <div className="posts-container">
        {isLoading ? (
          <FeedSkeleton count={3} />
        ) : error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button 
              onClick={() => feedType === 'following' ? getPosts() : getAllPosts()}
              className="btn primary"
            >
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>
              {feedType === 'following'
                ? 'Follow users to see their posts!'
                : 'No posts yet. Create your first post!'}
            </p>
          </div>
        ) : (
          posts.map(post => (
            <Feed key={post._id} post={post} onDeletePost={deletePost} />
          ))
        )}
      </div>
    </section>
  )
}

export default Home