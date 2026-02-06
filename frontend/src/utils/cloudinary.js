// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  cloudName: 'daxdjob49',
  uploadPreset: 'rmbgfv9i',
};

// Upload video to Cloudinary
export const uploadVideoToCloudinary = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('resource_type', 'video');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/video/upload`);
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          success: true,
          url: response.secure_url,
          publicId: response.public_id,
          duration: response.duration,
          format: response.format,
        });
      } else {
        reject({
          success: false,
          error: 'Upload failed',
        });
      }
    };
    
    xhr.onerror = () => {
      reject({
        success: false,
        error: 'Network error',
      });
    };
    
    xhr.send(formData);
  });
};

// Upload image to Cloudinary (for thumbnails)
export const uploadImageToCloudinary = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`);
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          success: true,
          url: response.secure_url,
          publicId: response.public_id,
        });
      } else {
        reject({
          success: false,
          error: 'Upload failed',
        });
      }
    };
    
    xhr.onerror = () => {
      reject({
        success: false,
        error: 'Network error',
      });
    };
    
    xhr.send(formData);
  });
};
