import { createSlice } from '@reduxjs/toolkit'

// Safely get user from localStorage
const getStoredUser = () => {
    try {
        const storedUser = localStorage.getItem("currentUser")
        return storedUser ? JSON.parse(storedUser) : null
    } catch (error) {
        console.error('Error parsing user from localStorage:', error)
        localStorage.removeItem("currentUser") // Remove corrupted data
        return null
    }
}

const initialState = {
    currentUser: getStoredUser(),
    socket: null,
    onlineUsers: [],
    conversations: []
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        changeCurrentUser: (state, action) => {
            state.currentUser = action.payload
        },
        setSocket: (state, action) => {
            state.socket = action.payload
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload
        },
        setConversations: (state, action) => {
            state.conversations = action.payload
        },
        logout: (state) => {
            state.currentUser = null
            state.socket = null
            state.onlineUsers = []
            state.conversations = []
            localStorage.removeItem("currentUser")
        }
    }
})

export const userActions = userSlice.actions

export default userSlice.reducer