import React from 'react'
import { NavLink } from 'react-router-dom'
import { AiOutlineHome } from 'react-icons/ai'
import { GoMail } from 'react-icons/go'
import { FaRegBookmark } from 'react-icons/fa'
import { PiPaintBrushBold } from 'react-icons/pi'
import { FaRegUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'      
import { uiSliceActions } from '../store/ui-slice'

const Sidebar = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state?.user?.currentUser)

  const openThemeModal = () => {
    dispatch(uiSliceActions.openThemeModal())
  }

  return (
    <menu className="sidebar">
      <NavLink 
        to="/" 
        className={({ isActive }) => `sidebar__item ${isActive ? "active" : ""}`}
      >
        <i className="sidebar__icon"><AiOutlineHome /></i>
        <p>Home</p>
      </NavLink>
      
      <NavLink 
        to="/messages" 
        className={({ isActive }) => `sidebar__item ${isActive ? "active" : ""}`}
      >
        <i className="sidebar__icon"><GoMail /></i>
        <p>Messages</p>
      </NavLink>
      
      <NavLink 
        to="/bookmarks" 
        className={({ isActive }) => `sidebar__item ${isActive ? "active" : ""}`}
      >
        <i className="sidebar__icon"><FaRegBookmark /></i>
        <p>Bookmarks</p>
      </NavLink>
      
      {currentUser && (
        <NavLink 
          to={`/users/${currentUser.id}`} 
          className={({ isActive }) => `sidebar__item ${isActive ? "active" : ""}`}
        >
          <i className="sidebar__icon"><FaRegUser /></i>
          <p>Profile</p>
        </NavLink>
      )}
      
      <button 
        className="sidebar__item" 
        onClick={openThemeModal}
        type="button"
      >
        <i className="sidebar__icon"><PiPaintBrushBold /></i>
        <p>Themes</p>
      </button>
    </menu>
  )
}

export default Sidebar