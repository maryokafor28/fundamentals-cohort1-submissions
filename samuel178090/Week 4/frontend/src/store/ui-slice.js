import { createSlice } from '@reduxjs/toolkit'

// Safely get theme from localStorage
const getStoredTheme = () => {
    try {
        const storedTheme = localStorage.getItem("theme")
        return storedTheme ? JSON.parse(storedTheme) : { primaryColor: "", backgroundColor: "" }
    } catch (error) {
        console.error('Error parsing theme from localStorage:', error)
        return { primaryColor: "", backgroundColor: "" }
    }
}

const initialState = {
    themeModalIsOpen: false,
    editProfileModalIsOpen: false,
    editPostModalIsOpen: false,
    editPostId: "",
    theme: getStoredTheme()
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openThemeModal: state => {
            state.themeModalIsOpen = true
        },
        closeThemeModal: state => {
            state.themeModalIsOpen = false
        },
        changeTheme: (state, action) => {
            state.theme = action.payload
        },
        openEditProfileModal: state => {
            state.editProfileModalIsOpen = true
        },
        closeEditProfileModal: state => {
            state.editProfileModalIsOpen = false
        },
        openEditPostModal: (state, action) => {
            state.editPostModalIsOpen = true
            state.editPostId = action.payload
        },
        closeEditPostModal: state => {
            state.editPostModalIsOpen = false
        }
    }
})

export const uiSliceActions = uiSlice.actions

export default uiSlice.reducer