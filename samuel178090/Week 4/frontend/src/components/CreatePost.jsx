import React, { useState } from 'react'
import ProfileImage from './ProfileImage'
import { useSelector } from 'react-redux'
import { SlPicture } from 'react-icons/sl'

const CreatePost = ({ onCreatePost, error }) => {
  const [body, setBody] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const profilePhoto = useSelector(state => state?.user?.currentUser?.profilePhoto)

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB')
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      setImage(file)
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  // Remove image
  const removeImage = () => {
    setImage(null)
    setImagePreview('')
    const fileInput = document.getElementById('image')
    if (fileInput) fileInput.value = ''
  }

  // Function to create post
  const createPost = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    
    setIsSubmitting(true)
    const postData = new FormData();
    postData.set('body', body.trim());
    if (image) postData.set('image', image);
    
    try {
      await onCreatePost(postData);
      // Clear form on success
      setBody("");
      setImage(null);
      setImagePreview('');
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Post creation failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="createPost" encType='multipart/form-data' onSubmit={createPost}>
      {error && <p className="createPost__error-message">{error}</p>}
      <div className="createPost__top">
        <ProfileImage image={profilePhoto} />
        <textarea 
          value={body} 
          onChange={e => setBody(e.target.value)}
          placeholder="What's on your mind?"
          disabled={isSubmitting}
          rows={3}
          maxLength={1000}
        />
      </div>
      {imagePreview && (
        <div className="createPost__image-preview">
          <img src={imagePreview} alt="Preview" />
          <button 
            type="button" 
            onClick={removeImage} 
            className="remove-image"
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}
      <div className="createPost__bottom">
        <div className="createPost__actions">
          <label htmlFor="image" className="image-upload-btn">
            <SlPicture /> Photo
          </label>
          <input 
            type="file" 
            id="image" 
            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <button 
            type="submit" 
            disabled={!body.trim() || isSubmitting}
            className={`btn primary ${isSubmitting ? 'loading' : ''}`}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
        {body.length > 0 && (
          <small className="character-count">
            {body.length}/1000 characters
          </small>
        )}
      </div>
    </form>    
  )
}

export default CreatePost