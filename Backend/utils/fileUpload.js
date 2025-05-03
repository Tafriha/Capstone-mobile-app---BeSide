const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { cloudinary, isConfigured } = require('../config/cloudinary');
const AppError = require('./AppError');

// Configure multer for temporary storage
const multerStorage = multer.memoryStorage();

// Filter files to only allow images
const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
  
  // Log successful file validation
  console.log(`✅ File validated: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/**
 * Upload a file to Cloudinary
 * @param {Object} file - The file to upload (from multer)
 * @param {String} folder - The folder to upload to
 * @param {String} userId - The user ID to associate with the file
 * @returns {Promise<Object>} - The uploaded file information
 */
const uploadToCloudinary = async (file, folder, userId) => {
  try {
    console.log('Starting file upload to Cloudinary...');
    console.log(`- File: ${file.originalname} (${file.size} bytes)`);
    console.log(`- Folder: ${folder}`);
    console.log(`- User ID: ${userId}`);
    
    if (!isConfigured) {
      console.error('❌ Cloudinary is not configured!');
      throw new AppError('Cloudinary is not configured. File cannot be uploaded.', 500);
    }

    if (!file) {
      console.error('❌ No file provided for upload');
      throw new AppError('No file provided', 400);
    }

    // Convert buffer to base64 string for Cloudinary
    const fileStr = Buffer.from(file.buffer).toString('base64');
    const fileUri = `data:${file.mimetype};base64,${fileStr}`;
    
    // Create a unique public_id for the image
    const uniqueFilename = `${userId}_${uuidv4()}`;
    
    console.log(`- Generated unique filename: ${uniqueFilename}`);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: folder,
      public_id: uniqueFilename,
      overwrite: true,
      resource_type: 'auto',
      tags: ['profile_photo', userId],
    });
    
    console.log(`✅ File uploaded to Cloudinary: ${result.secure_url}`);
    
    return {
      filename: uniqueFilename,
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      format: result.format,
      resourceType: result.resource_type,
      originalName: file.originalname
    };
  } catch (error) {
    console.error(`❌ File upload failed: ${error.message}`);
    if (error.stack) console.error(error.stack);
    throw new AppError(`File upload failed: ${error.message}`, 500);
  }
};

/**
 * Delete a file from Cloudinary
 * @param {String} publicId - The public ID of the file to delete
 * @returns {Promise<Boolean>} - True if deletion was successful
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    console.log(`Attempting to delete file with public ID: ${publicId}`);
    
    if (!isConfigured) {
      console.warn('Cloudinary is not configured. File cannot be deleted.');
      return true;
    }

    if (!publicId) {
      console.warn('No public ID provided for deletion');
      return true;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok' || result.result === 'not found') {
      console.log(`✅ File deleted from Cloudinary: ${publicId}`);
      return true;
    } else {
      console.error(`❌ Failed to delete file: ${publicId}, result: ${result.result}`);
      throw new AppError(`Failed to delete file: ${result.result}`, 500);
    }
  } catch (error) {
    console.error(`❌ File deletion failed: ${error.message}`);
    // Don't throw error if it's just a deletion issue
    return false;
  }
};

module.exports = {
  uploadSingle: upload.single('photo'),
  uploadToCloudinary,
  deleteFromCloudinary
};