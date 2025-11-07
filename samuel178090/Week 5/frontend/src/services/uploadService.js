import api from './api';

export const uploadService = {
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    return api.post('/upload/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};