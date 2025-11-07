import React from 'react'

const TimeAgo = ({ date }) => {
  if (!date) return <span>Unknown time</span>

  const now = new Date()
  const postDate = new Date(date)
  const diffInSeconds = Math.floor((now - postDate) / 1000)

  if (diffInSeconds < 60) {
    return <span>Just now</span>
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return <span>{diffInMinutes}m ago</span>
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return <span>{diffInHours}h ago</span>
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return <span>{diffInDays}d ago</span>
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return <span>{diffInWeeks}w ago</span>
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return <span>{diffInMonths}mo ago</span>
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return <span>{diffInYears}y ago</span>
}

export default TimeAgo