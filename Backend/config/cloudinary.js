const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

/**
 * Initialize Cloudinary
 * 
 * Note: You need to add the following variables to your .env file:
 * CLOUDINARY_CLOUD_NAME - Your Cloudinary cloud name
 * CLOUDINARY_API_KEY - Your Cloudinary API key
 * CLOUDINARY_API_SECRET - Your Cloudinary API secret
 */

// Configuration
let isConfigured = false;

try {
  console.log('Initializing Cloudinary with the following config:');
  console.log('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? ' Found' : 'Missing');
  console.log('- API Key:', process.env.CLOUDINARY_API_KEY ? 'Found' : ' Missing');
  console.log('- API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Found' : ' Missing');

  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    
    console.log('Cloudinary initialized successfully');
    isConfigured = true;
  } else {
    console.warn('Cloudinary credentials not found. Image upload functionality will not work.');
    console.warn('Please provide CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file');
  }
} catch (error) {
  console.error(' Error initializing Cloudinary:', error.message);
  console.error(error.stack);
}

module.exports = {
  cloudinary,
  isConfigured
};