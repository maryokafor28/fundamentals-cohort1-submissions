import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { userActions } from '../store/user-slice'

const TestAvatarUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState('')
  const token = useSelector(state => state?.user?.currentUser?.token)
  const currentUser = useSelector(state => state?.user?.currentUser)
  const dispatch = useDispatch()

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setResult('❌ Error: File must be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setResult('❌ Error: Please select an image file')
      return
    }

    setSelectedFile(file)
    setResult('')
    
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.onerror = () => setResult('❌ Error reading file')
    reader.readAsDataURL(file)
  }

  const testUpload = async () => {
    if (!selectedFile || !token) return
    
    setUploading(true)
    setResult('')
    
    try {
      const formData = new FormData()
      formData.append('avatar', selectedFile)
      
      console.log('📤 Uploading file:', {
        name: selectedFile.name,
        size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
        type: selectedFile.type
      })
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/avatar`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - let browser set it with boundary
          }
        }
      )
      
      console.log('✅ Upload response:', response.data)
      
      // Update Redux and localStorage with new profile photo
      const updatedUser = {
        ...currentUser,
        profilePhoto: response.data.profilePhoto
      }
      dispatch(userActions.changeCurrentUser(updatedUser))
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      
      setResult(`✅ Success! Avatar updated. New URL: ${response.data.profilePhoto}`)
      
      // Clear preview after successful upload
      setTimeout(() => {
        setPreview('')
        setSelectedFile(null)
      }, 2000)
      
    } catch (error) {
      console.error('❌ Upload error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed'
      setResult(`❌ Error: ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ 
      padding: '2rem', 
      background: 'white', 
      borderRadius: '8px', 
      margin: '1rem',
      border: '2px solid #3385ff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3>🧪 Avatar Upload Test</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <input 
          type="file" 
          accept="image/png, image/jpeg, image/jpg, image/gif, image/webp" 
          onChange={handleFileSelect}
          style={{ marginBottom: '1rem', display: 'block' }}
        />
        
        {selectedFile && (
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </p>
        )}
        
        {preview && (
          <div style={{ marginBottom: '1rem' }}>
            <p><strong>Preview:</strong></p>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ 
                width: '100px', 
                height: '100px', 
                objectFit: 'cover', 
                borderRadius: '50%',
                border: '3px solid #3385ff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} 
            />
          </div>
        )}
        
        <button 
          onClick={testUpload}
          disabled={!selectedFile || uploading || !token}
          style={{
            padding: '0.75rem 1.5rem',
            background: (!selectedFile || uploading || !token) ? '#ccc' : '#3385ff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: (!selectedFile || uploading || !token) ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'background 0.2s'
          }}
        >
          {uploading ? '⏳ Uploading...' : '🚀 Test Upload'}
        </button>
      </div>
      
      {result && (
        <div style={{ 
          padding: '1rem', 
          background: result.includes('✅') ? '#d4edda' : '#f8d7da',
          color: result.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '6px',
          marginTop: '1rem',
          border: result.includes('✅') ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
        }}>
          <strong>{result}</strong>
        </div>
      )}
      
      {!token && (
        <div style={{ 
          padding: '1rem', 
          background: '#fff3cd',
          color: '#856404',
          borderRadius: '6px',
          marginTop: '1rem',
          border: '1px solid #ffeaa7'
        }}>
          ⚠️ Please login to test avatar upload
        </div>
      )}
    </div>
  )
}

export default TestAvatarUpload