import React from 'react'
import { useSelector } from 'react-redux'
import TimeAgo from 'react-timeago'

const MessageItem = ({ message }) => {
    const userId = useSelector(state => state?.user?.currentUser?.id)
    const isSent = message?.senderId === userId
    
    return (
        <li className={`messageBox__message ${isSent ? "sent" : "received"}`}>
            <div className="messageBox__message-content">
                <p>{message?.text || message?.messageBody || message?.body}</p>
                {message?.createdAt && (
                    <small className="messageBox__message-time">
                        <TimeAgo date={message?.createdAt} />
                    </small>
                )}
            </div>
        </li>
    )
}

export default MessageItem