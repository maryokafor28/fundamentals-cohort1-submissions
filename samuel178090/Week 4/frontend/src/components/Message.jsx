import React from 'react'
import { useSelector } from 'react-redux'
import ProfileImage from './ProfileImage'
import TimeAgo from 'react-timeago'
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5'

const Message = ({ message }) => {
  const currentUserId = useSelector(state => state?.user?.currentUser?.id)
  const isOwnMessage = message?.sender === currentUserId || message?.senderId === currentUserId

  return (
    <li className={`message ${isOwnMessage ? 'message--own' : 'message--other'}`}>
      {!isOwnMessage && (
        <div className="message__avatar">
          <ProfileImage image={message?.senderProfilePhoto} />
        </div>
      )}
      <div className="message__content">
        <div className="message__bubble">
          <p>{message?.text || message?.messageBody || message?.body}</p>
        </div>
        <div className="message__footer">
          <small className="message__time">
            <TimeAgo date={message?.createdAt} />
          </small>
          {isOwnMessage && (
            <span className="message__status">
              {message?.seen ? (
                <IoCheckmarkDone className="message__status--read" />
              ) : (
                <IoCheckmark className="message__status--sent" />
              )}
            </span>
          )}
        </div>
      </div>
    </li>
  )
}

export default Message