import axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ProfileImage from './ProfileImage'
import TrimText from './TrimText'
import { IoMdClose } from "react-icons/io"
import { FaCheck } from "react-icons/fa"

const FriendRequest = ({ friend, onFilterFriend }) => {
  const token = useSelector(state => state.user.currentUser.token)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const followUser = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/${friend?._id}/follow-unfollow`, 
        {},
        {
          withCredentials: true, 
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      onFilterFriend(friend?._id) // close friend badge
    } catch (error) {
      console.error(error)
      setError('Failed to accept friend request')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <article className="friendRequest">
      <div className="friendRequest__info">
        <Link to={`/users/${friend?._id}`}>
          <ProfileImage image={friend?.profilePhoto} />
        </Link>
        <div className="friendRequest__details">
          <Link to={`/users/${friend?._id}`}>
            <h5>{friend?.fullName}</h5>
          </Link>
          <small>
            <TrimText item={friend?.email} maxLength={20} />
          </small>
        </div>
      </div>  
      {error && <p className="error-message">{error}</p>}
      <div className="friendRequest__buttons">
        <button 
          className="friendRequest__action-approve" 
          onClick={followUser}
          disabled={isLoading}
        >
          {isLoading ? '...' : <FaCheck />}
        </button>
        <button 
          className="friendRequest__action-decline" 
          onClick={() => onFilterFriend(friend?._id)}
          disabled={isLoading}
        >
          <IoMdClose />
        </button>
      </div>
    </article>
  )
}

export default FriendRequest