/**
 * Helper functions for uploading images to Firebase Storage
 */

import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload image file to Firebase Storage
 * @param {File} file - Image file to upload
 * @param {string} userId - User ID for organizing uploads
 * @param {string} folder - Optional folder path (e.g., 'photos', 'captions')
 * @returns {Promise<string>} Download URL of uploaded image
 */
export async function uploadImageToStorage(file, userId, folder = 'photos') {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const fileName = `${folder}/${userId}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Convert file to base64 string
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 string
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Delete image from Firebase Storage
 * @param {string} filePath - Full path to file in storage
 * @returns {Promise<void>}
 */
export async function deleteImageFromStorage(filePath) {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

