import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Feed from '../components/Feed'
import FeedSkeleton from '../components/FeedSkeleton'
import HeaderInfo from '../components/HeaderInfo'

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const token = useSelector(state => state?.user?.currentUser?.token)

  // GET BOOKMARKS OF LOGGED IN USER
  const getBookmarks = async () => {
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/bookmarks`,
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      setBookmarks(response?.data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      setError(error.response?.data?.message || 'Failed to load bookmarks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBookmarks()
  }, [token])

  return (
    <section className="mainArea">
      <HeaderInfo text="My Bookmarks" />
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={getBookmarks} className="btn primary">
            Retry
          </button>
        </div>
      )}
      
      {loading ? (
        <FeedSkeleton />
      ) : bookmarks?.length < 1 ? (
        <div className="empty-state">
          <p className="center">No posts bookmarked yet</p>
          <small className="center">Bookmark posts to see them here</small>
        </div>
      ) : (
        bookmarks?.map(bookmark => (
          <Feed key={bookmark?._id} post={bookmark} />
        ))
      )}
    </section>
  )
}

export default Bookmarks