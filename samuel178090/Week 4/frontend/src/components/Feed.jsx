import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import ProfileImage from './ProfileImage'
import TimeAgo from 'react-timeago'
import axios from 'axios'
import { FaRegCommentDots } from 'react-icons/fa'
import { IoMdShare } from 'react-icons/io'
import LikeDislikePost from './LikeDislikePost'
import TrimText from '../helpers/TrimText'
import BookmarksPost from './BookmarksPost'
import { HiDotsHorizontal } from 'react-icons/hi'
import { uiSliceActions } from '../store/ui-slice'

const Feed = ({ post, onDeletePost }) => {
  const token = useSelector(state => state?.user?.currentUser?.token)
  const userId = useSelector(state => state?.user?.currentUser?.id)
  const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()

  // Use populated creator data or fallback to creator ID
  const creator = post?.creator?.fullName ? post.creator : { _id: post?.creator }

  const closeFeedHeaderMenu = () => {
    setShowFeedHeaderMenu(false)
  }

  const showEditPostModal = () => {
    dispatch(uiSliceActions.openEditPostModal(post?._id))
    closeFeedHeaderMenu()
  }

  const deletePost = () => {
    closeFeedHeaderMenu()
    onDeletePost(post?._id)
  }

  return (
    <article className="feed">
      <header className="feed__header">
        <Link to={`/users/${creator?._id || post?.creator}`} className='feed__header-profile'>
          <ProfileImage image={creator?.profilePhoto} />
          <div className="feed__header-details">
            <h4>{creator?.fullName || 'Unknown User'}</h4>
            <small><TimeAgo date={post?.createdAt} /></small>
          </div>
        </Link>
        {userId === (creator?._id || post?.creator) && location.pathname.includes('/users') && (
          <button onClick={() => setShowFeedHeaderMenu(!showFeedHeaderMenu)}>
            <HiDotsHorizontal />
          </button>
        )}
        {showFeedHeaderMenu && userId === (creator?._id || post?.creator) && location.pathname.includes('/users') && (
          <menu className="feed__header-menu">
            <button onClick={showEditPostModal}>Edit</button>
            <button onClick={deletePost}>Delete</button>
          </menu>
        )}
      </header>
      <Link to={`/posts/${post?._id}`} className='feed__body'>
        {post?.body && <p><TrimText item={post?.body} maxLength={160} /></p>}
        {post?.image && <div><img src={post?.image} alt="Post content" /></div>}
      </Link>
      <footer className="feed__footer">
        <div>
          <LikeDislikePost post={post} />
          <button className="feed__footer-comments">
            <Link to={`/posts/${post?._id}`}>
              <FaRegCommentDots />
            </Link>
            <small>{post?.comments?.length || 0}</small>
          </button>
          <button className="feed__footer-share" onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${creator?.fullName || 'User'}'s post`,
                text: post?.body || 'Check out this post!',
                url: `${window.location.origin}/posts/${post?._id}`
              })
            } else {
              navigator.clipboard.writeText(`${window.location.origin}/posts/${post?._id}`)
              alert('Post link copied to clipboard!')
            }
          }}>
            <IoMdShare />
          </button>
        </div>
        <BookmarksPost post={post} />
      </footer>
    </article>
  )
}

export default Feed