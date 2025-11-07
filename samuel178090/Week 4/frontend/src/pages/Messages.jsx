import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { IoMdSend } from "react-icons/io"
import Message from '../components/Message'
import ProfileImage from '../components/ProfileImage'
import { userActions } from '../store/user-slice'

const Messages = () => {
  const { receiverId } = useParams()
  const [messages, setMessages] = useState([])
  const [otherMessager, setOtherMessager] = useState({})
  const [messageBody, setMessageBody] = useState("")
  const [conversationId, setConversationId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messageEndRef = useRef()

  const token = useSelector((state) => state?.user?.currentUser?.token)
  const socket = useSelector((state) => state?.user?.socket)
  const conversations = useSelector((state) => state?.user?.conversations)
  const dispatch = useDispatch()

  // Get other participant
  const getOtherMessager = async () => {
    if (!receiverId || !token) return

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${receiverId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setOtherMessager(response.data)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  // GET MESSAGES
  const getMessages = async () => {
    if (!receiverId || !token) return

    setIsLoading(true)

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/messages/${receiverId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setMessages(response?.data?.data || response?.data || [])
      setConversationId(response?.data?.[0]?.conversationId)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // SEND A MESSAGE
  const sendMessage = async (e) => {
    e.preventDefault()
    if (!messageBody.trim() || isSending) return

    setIsSending(true)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/messages/${receiverId}`,
        { messageBody: messageBody.trim() },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setMessages(prevMessages => [...prevMessages, response?.data])
      setMessageBody("")
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (message) => {
      // Only add message if it's for this conversation
      if (message.sender === receiverId || message.receiver === receiverId) {
        setMessages(prevMessages => [...prevMessages, message])
      }
    }

    socket.on('newMessage', handleNewMessage)

    if (conversationId && conversations) {
      dispatch(userActions.setConversations(
        conversations.map(conversation => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true
              }
            }
          }
          return conversation
        })
      ))
    }

    return () => socket.off('newMessage', handleNewMessage)
  }, [socket, conversationId, receiverId, conversations, dispatch])

  useEffect(() => {
    getMessages()
    getOtherMessager()
  }, [receiverId, token])

  return (
    <section className="mainArea">
      <div className="messagesBox">
        <header className="messagesBox__header">
          <ProfileImage image={otherMessager?.profilePhoto} />
          <div className="messagesBox__header__info">
            <h4>{otherMessager?.fullName || 'Loading...'}</h4>
            <small>Active now</small>
          </div>
        </header>

        <ul className="messagesBox__messages">
          {isLoading ? (
            <li className="center">Loading messages...</li>
          ) : messages?.length === 0 ? (
            <li className="center">No messages yet. Start the conversation!</li>
          ) : (
            messages?.map(message => (
              <Message key={message._id} message={message} />
            ))
          )}
        </ul>

        <div ref={messageEndRef}></div>

        <form onSubmit={sendMessage} className="messagesBox__form">
          <input
            type="text"
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            autoFocus
          />
          <button 
            type="submit"
            disabled={!messageBody.trim() || isSending}
          >
            {isSending ? '...' : <IoMdSend />}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Messages