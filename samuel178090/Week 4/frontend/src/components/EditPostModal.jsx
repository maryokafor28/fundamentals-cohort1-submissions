import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { uiSliceActions } from '../store/ui-slice'

const EditPostModal = ({ onUpdatePost }) => {
    const editPostID = useSelector(state => state?.ui?.editPostId)
    const token = useSelector(state => state?.user?.currentUser?.token)
    const [body, setBody] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const dispatch = useDispatch()

    // Get post to update
    const getPost = async () => {
        if (!editPostID || !token) return
        
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/posts/${editPostID}`,
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            setBody(response?.data?.body || "")
        } catch (error) {
            console.error('Error fetching post:', error)
            setError('Failed to load post')
        }
    }

    useEffect(() => {
        getPost()
    }, [editPostID])

    const updatePost = async (e) => {
        e.preventDefault()
        setError("")
        
        if (!body?.trim()) {
            setError("Post body cannot be empty")
            return
        }
        
        setIsLoading(true)
        
        try {
            const postData = new FormData()
            postData.set("body", body.trim())
            
            await onUpdatePost(postData, editPostID)
            dispatch(uiSliceActions.closeEditPostModal())
        } catch (error) {
            console.error('Error updating post:', error)
            setError('Failed to update post')
        } finally {
            setIsLoading(false)
        }
    }

    const closeEditPostModal = (e) => {
        if (e.target.classList.contains('editPost')) {
            dispatch(uiSliceActions.closeEditPostModal())
        }
    }

    return (
        <form className="editPost" onSubmit={updatePost} onClick={closeEditPostModal}>
            <div className="editPost__container">
                <h3>Edit Post</h3>
                {error && <p className="error-message">{error}</p>}
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="What's on your mind?"
                    autoFocus
                    disabled={isLoading}
                    rows={5}
                />
                <small>{body?.length || 0} characters</small>
                <button 
                    type="submit" 
                    className='btn primary'
                    disabled={isLoading || !body?.trim()}
                >
                    {isLoading ? 'Updating...' : 'Update Post'}
                </button>
            </div>
        </form>
    )
}

export default EditPostModal