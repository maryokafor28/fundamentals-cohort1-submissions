import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ProfileImage from './ProfileImage'
import TrimText from '../helpers/TrimText'
import TimeAgo from 'react-timeago'

const MessageListItem = ({ conversation }) => {
    const onlineUsers = useSelector(state => state?.user?.onlineUsers)
    const currentUserId = useSelector(state => state?.user?.currentUser?.id)
    
    // Get the other participant (not the current user)
    const otherParticipant = conversation?.participants?.find(
        participant => participant?._id !== currentUserId
    ) || conversation?.participants?.[0]
    
    const isOnline = onlineUsers?.includes(otherParticipant?._id)

    return (
        <Link 
            to={`/messages/${otherParticipant?._id}`} 
            className='messageList__item'
        >
            <ProfileImage 
                image={otherParticipant?.profilePhoto} 
                className={isOnline ? "active" : ""} 
            />
            <div className="messageList__item__text">
                <h5>{otherParticipant?.fullName || 'Unknown User'}</h5>
                <p>
                    <TrimText 
                        item={conversation?.lastMessage?.text || conversation?.lastMessage?.messageBody || 'No messages yet'} 
                        maxLength={16} 
                    />
                </p>
                <small>
                    {conversation?.lastMessage?.createdAt ? (
                        <TimeAgo date={conversation?.lastMessage?.createdAt} />
                    ) : (
                        'Just now'
                    )}
                </small>
            </div>
        </Link>
    )
}

export default MessageListItem