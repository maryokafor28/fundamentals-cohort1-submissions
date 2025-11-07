import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import MessageListItem from './MessageListItem'

const MessagesList = () => {
    const [conversations, setConversations] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const token = useSelector((state) => state?.user?.currentUser?.token)
    const socket = useSelector((state) => state?.user?.socket)

    // GET CHATS FROM DB
    const getConversations = async () => {
        if (!token) return
        
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/conversations`,
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            setConversations(response?.data || [])
        } catch (error) {
            console.error('Error fetching conversations:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getConversations()
    }, [token])

    // Listen for new messages via socket
    useEffect(() => {
        if (!socket) return

        socket.on('newMessage', (message) => {
            // Update conversations when new message arrives
            getConversations()
        })

        return () => {
            socket.off('newMessage')
        }
    }, [socket])

    return (
        <menu className="messageList">
            <h3>Recent Messages</h3>
            {isLoading ? (
                <p className="messageList__loading">Loading...</p>
            ) : conversations?.length === 0 ? (
                <p className="messageList__empty">No conversations yet</p>
            ) : (
                conversations?.map(conversation => (
                    <MessageListItem 
                        key={conversation._id} 
                        conversation={conversation} 
                    />
                ))
            )}
        </menu>
    )
}

export default MessagesList