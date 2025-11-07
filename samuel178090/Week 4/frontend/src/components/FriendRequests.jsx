import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import ProfileImage from './ProfileImage'
import { Link } from 'react-router-dom'

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([])
  const token = useSelector(state => state?.user?.currentUser?.token)
  const currentUserId = useSelector(state => state?.user?.currentUser?.id)

  // Get friend requests (users who are not being followed back)
  const getFriendRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      // Filter users who are not the current user and limit to 5
      const suggestedUsers = response.data
        .filter(user => user._id !== currentUserId)
        .slice(0, 5)
      
      setFriendRequests(suggestedUsers)
    } catch (error) {
      console.error('Error fetching friend requests:', error)
    }
  }

  useEffect(() => {
    if (token && currentUserId) {
      getFriendRequests()
    }
  }, [token, currentUserId])

  if (friendRequests.length === 0) {
    return null
  }

  return (
    <div className="friend-requests">
      <h3>Suggested for you</h3>
      <div className="friend-requests__list">
        {friendRequests.map(user => (
          <div key={user._id} className="friend-request">
            <Link to={`/users/${user._id}`} className="friend-request__profile">
              <ProfileImage image={user.profilePhoto} />
              <div className="friend-request__info">
                <h4>{user.fullName}</h4>
                <small>{user.followers?.length || 0} followers</small>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FriendRequests