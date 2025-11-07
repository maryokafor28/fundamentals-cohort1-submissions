import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import FriendRequest from './FriendRequest'

const FriendRequests = () => {
    const [friends, setFriends] = useState([])
    const token = useSelector(state => state.user?.currentUser?.token)
    const userId = useSelector(state => state.user?.currentUser?.id)

    // GET PEOPLE FROM DB
    const getFriends = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users`,
                {
                    withCredentials: true, 
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            const people = response?.data?.filter(person => {
                return !person?.followers?.includes(userId) && person?._id !== userId
            })
            setFriends(people)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getFriends()
    }, [])

    const closeFriendBadge = (id) => {
        setFriends(friends?.filter(friend => friend?._id !== id))
    }

    return (
        <menu className='friendRequests'>
            <h3>People you may know</h3>
            {friends?.map(friend => (
                <FriendRequest 
                    key={friend?._id} 
                    friend={friend}
                    onFilterFriend={closeFriendBadge}
                />
            ))}
        </menu>
    )
}

export default FriendRequests