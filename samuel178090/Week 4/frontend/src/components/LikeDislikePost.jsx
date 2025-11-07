import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { FaRegHeart } from 'react-icons/fa'
import { FcLike } from 'react-icons/fc'

const LikeDislikePost = (props) => {
    const [post, setPost] = useState(props.post)
    const userId = useSelector(state => state?.user?.currentUser?.id)
    const token = useSelector(state => state?.user?.currentUser?.token)
    const [postLike, setPostLike] = useState(post?.likes?.includes(userId))

    const handleLikeDislikePost = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/posts/${post?._id}/like`, 
                {}, 
                {
                    withCredentials: true, 
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            setPost(response?.data)
        } catch (error) {
            console.error('Like error:', error)
        }
    }

    // FUNCTION TO CHECK IF POST IS LIKED/UNLIKED
    const handleCheckIfUserLikedPost = () => {
        if (post?.likes?.includes(userId)) {
            setPostLike(true)
        } else {
            setPostLike(false)
        }
    }

    useEffect(() => {
        handleCheckIfUserLikedPost()
    }, [post, userId]) // Added userId to dependency array

    // Update post when props change
    useEffect(() => {
        setPost(props.post)
    }, [props.post])

    return (
        <button className="feed__footer-likes" onClick={handleLikeDislikePost}>
            {postLike ? <FcLike /> : <FaRegHeart />}
            <small>{post?.likes?.length || 0}</small>
        </button>
    )
}

export default LikeDislikePost