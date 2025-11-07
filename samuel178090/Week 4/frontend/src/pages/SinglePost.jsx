import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import TimeAgo from 'react-timeago'
import ProfileImage from '../components/ProfileImage'
import LikeDislikePost from '../components/LikeDislikePost'
import BookmarksPost from '../components/BookmarksPost'
import { FaRegCommentDots } from 'react-icons/fa'
import { IoMdShare, IoMdSend } from 'react-icons/io'

const SinglePost = () => {
  const { id } = useParams()
  const [post, setPost] = useState({})
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const token = useSelector(state => state?.user?.currentUser?.token)
  const userId = useSelector(state => state?.user?.currentUser?.id)

  // GET POST FROM DB
  const getPost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setPost(response.data)
    } catch (error) {
      console.error('Error fetching post:', error)
    }
  }

  // FUNCTION TO DELETE A COMMENT
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setPost(prev => ({
        ...prev,
        comments: prev.comments?.filter(c => c._id !== commentId)
      }))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  // FUNCTION TO CREATE COMMENT
  const createComment = async (e) => {
    e.preventDefault()
    if (!comment.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${id}`,
        { comment: comment.trim() },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const newComment = response?.data
      setPost(prev => ({
        ...prev,
        comments: [newComment, ...(prev.comments || [])]
      }))
      setComment("")
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    getPost()
  }, [id])

  return (
    <section className="singlePost">
      <header className="feed__header">
        <ProfileImage image={post?.creator?.profilePhoto} />
        <div className="feed__header-details">
          <h4>{post?.creator?.fullName}</h4>
          <small>
            <TimeAgo date={post?.createdAt} />
          </small>
        </div>
      </header>

      <div className="feed__body">
        <p>{post?.body}</p>
        {post?.image && (
          <div className="feed__images">
            <img src={post?.image} alt="" />
          </div>
        )}
      </div>

      <footer className="feed__footer">
        <div>
          {post?.likes && <LikeDislikePost post={post} />}
          <button className="feed__footer-comments">
            <FaRegCommentDots />
            <small>{post?.comments?.length || 0}</small>
          </button>
          <button className="feed__footer-comments">
            <IoMdShare />
          </button>
        </div>
        <BookmarksPost post={post} />
      </footer>

      <ul className="singlePost__comment">
        <form className="singlePost__comment-form" onSubmit={createComment}>
          <textarea
            placeholder="Enter your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="singlePost__comments-btn"
            disabled={isSubmitting || !comment.trim()}
          >
            <IoMdSend />
          </button>
        </form>

        {post?.comments?.map(singleComment => (
          <li key={singleComment._id} className="comment">
            <div className="comment__header">
              <ProfileImage image={singleComment?.creator?.profilePhoto} />
              <div>
                <h5>{singleComment?.creator?.fullName}</h5>
                <small>
                  <TimeAgo date={singleComment?.createdAt} />
                </small>
              </div>
              {userId === singleComment?.creator?._id && (
                <button
                  onClick={() => deleteComment(singleComment._id)}
                  className="comment__delete"
                  title="Delete comment"
                >
                  ×
                </button>
              )}
            </div>
            <p>{singleComment?.comment}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default SinglePost