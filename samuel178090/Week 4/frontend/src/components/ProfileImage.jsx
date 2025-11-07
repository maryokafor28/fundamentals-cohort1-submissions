import React, { useState } from 'react'

const ProfileImage = ({ image, className = '', alt = 'Profile' }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const defaultImage = "https://res.cloudinary.com/deew4s53w/image/upload/v1760441163/Sample_User_Icon_breopx.png"
  
  const imageSrc = hasError || !image ? defaultImage : image

  return (
    <div className={`profileImage ${className} ${isLoading ? 'loading' : ''}`}>
      <img 
        src={imageSrc} 
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
      />
    </div>
  )
}

export default ProfileImage