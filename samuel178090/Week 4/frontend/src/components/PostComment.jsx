import React from 'react'
import { useSelector } from 'react-redux'
import TimeAgo from 'react-timeago'
import { FaRegTrashAlt } from 'react-icons/fa'
import ProfileImage from './ProfileImage'

const PostComment = ({ comment, onDeleteComment }) => {
  const token = useSelector(state => state?.user?.currentUser?.token)
  const userId = useSelector(state => state?.user?.currentUser?.id)

  // DELETE COMMENT FUNCTION
  const deleteComment = () => {
    if (onDeleteComment) {
      onDeleteComment(comment?._id)
    }
  }

  // Handle different possible creator structures
  const creator = comment?.creator
  const creatorId = creator?._id || creator?.id
  const creatorName = creator?.fullName || creator?.creatorName || 'Unknown User'
  const creatorPhoto = creator?.profilePhoto || creator?.creatorPhoto
  
  const isOwner = userId === creatorId

  return (
    <li className="singlePost__comment">
      <div className="singlePost__comment-wrapper">
        <div className="singlePost__comment-author">
          <ProfileImage image={creatorPhoto} alt={creatorName} />
        </div>
        <div className="singlePost__comment-body">
          <div className="singlePost__comment-header">
            <h5>{creatorName}</h5>
            <small>
              <TimeAgo date={comment?.createdAt} />
            </small>
          </div>
          <p>{comment?.comment || comment?.text || comment?.body}</p>
        </div>
      </div>
      {isOwner && (
        <button 
          className="singlePost__comment-delete-btn" 
          onClick={deleteComment}
          title="Delete comment"
        >
          <FaRegTrashAlt />
        </button>
      )}
    </li>
  )
}

export default PostComment