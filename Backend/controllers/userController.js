const User = require("../models/userModel");

//const authController = require("./authController");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const{uploadToCloudinary, deleteFromCloudinary, uploadSingle} = require("../utils/fileUpload");

exports.saveProfilePhoto = catchAsync(async (req, res, next) => {
  console.log('Profile photo upload request received');
  
  // Check if multer middleware processed a file
  if (!req.file) {
    console.error('No file in request');
    return next(new AppError("Please provide a profile photo", 400));
  }
  
  console.log(`File received: ${req.file.originalname} (${req.file.mimetype}, ${req.file.size} bytes)`);
  
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      console.error(`User not found: ${req.user._id}`);
      return next(new AppError("User not found", 404));
    }
    
    console.log(`User found: ${user.userName} (${user.userId})`);

    // If user already has a profile photo, delete it from Cloudinary
    if (user.profilePhoto && user.profilePhoto.publicId) {
      try {
        console.log(`Deleting old profile photo: ${user.profilePhoto.publicId}`);
        await deleteFromCloudinary(user.profilePhoto.publicId);
        console.log('Old profile photo deleted');
      } catch (err) {
        // Log error but continue with new upload
        console.error("Error deleting old profile photo:", err);
      }
    }

    console.log('Uploading new photo to Cloudinary...');
    
    // Upload new photo to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file, 
      'profile-photos', 
      user.userId
    );
    
    console.log(`Photo uploaded successfully: ${uploadResult.url}`);

    // Update user with new profile photo information
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        profilePhoto: {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          filename: uploadResult.filename
        },
      },
      { new: true, runValidators: true }
    ).select("-password -__v");
    
    console.log('User profile updated with new photo');

    res.status(200).json({
      status: "success",
      message: "Profile photo updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error('Error in profile photo upload:', error);
    return next(new AppError(`Profile photo upload failed: ${error.message}`, 500));
  }
});

exports.updateProfileSettings = catchAsync(async (req, res, next) => {
  const { public, sharedInfo } = req.body;

  // Build update object
  const profileSettings = {};

  if (typeof public === "boolean") {
    profileSettings["profileSettings.public"] = public;
  }

  if (Array.isArray(sharedInfo)) {
    profileSettings["profileSettings.sharedInfo"] = sharedInfo;
  }

  if (Object.keys(profileSettings).length === 0) {
    return next(new AppError("No profile settings to update", 400));
  }

  const user = await User.findByIdAndUpdate(req.user._id, profileSettings, {
    new: true,
    runValidators: true,
  }).select("-password -__v");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Profile settings updated successfully",
    data: {
      user,
    },
  });
});

exports.uploadProfilePhoto = uploadSingle;

/**
 * Update user's availability
 */
exports.updateAvailability = catchAsync(async (req, res, next) => {
  const { availability } = req.body;

  if (typeof availability !== "boolean") {
    return next(new AppError("Availability must be true or false", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { availability },
    { new: true, runValidators: true }
  ).select("-password -__v");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Availability updated successfully",
    data: {
      user,
    },
  });
});

exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password -__v");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

/**
 * Update current user's profile
 */
exports.updateUserProfile = catchAsync(async (req, res, next) => {
  const { userName, email, mobileNo, firstName, lastName, bio, address } =
    req.body;

  // Build update object with fields that are provided
  const updateData = {};

  if (userName) updateData.userName = userName;
  if (email) updateData.email = email;
  if (mobileNo) updateData.mobileNo = mobileNo;
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (bio !== undefined) updateData.bio = bio;

  // Handle address fields if they exist
  if (address) {
    // Initialize address object if it doesn't exist in updateData
    if (!updateData.address) updateData.address = {};

    // Only update provided address fields
    if (address.street !== undefined)
      updateData.address.street = address.street;
    if (address.city !== undefined) updateData.address.city = address.city;
    if (address.state !== undefined) updateData.address.state = address.state;
    if (address.postalCode !== undefined)
      updateData.address.postalCode = address.postalCode;
    if (address.country !== undefined)
      updateData.address.country = address.country;
    if (address.countryCode !== undefined)
      updateData.address.countryCode = address.countryCode;
  }

  // Update the user with validation
  const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password -__v");

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: {
      user: updatedUser,
    },
  });
});

/**
 * Delete current user's profile
 */
exports.deleteUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // If user has a profile photo, delete it from Firebase
  if (user.profilePhoto && user.profilePhoto.filename) {
    try {
      await deleteFromFirebase(user.profilePhoto.filename, "profile-photos");
    } catch (err) {
      // Log error but continue with user deletion
      console.error("Error deleting profile photo:", err);
    }
  }

  // Delete the user
  await User.findByIdAndDelete(req.user._id);

  res.status(204).json({
    status: "success",
    message: "User deleted successfully",
    data: null,
  });
});

/**
 * Update user's consent
 */
exports.updateConsent = catchAsync(async (req, res, next) => {
  const { consentGiven } = req.body;

  if (typeof consentGiven !== "boolean") {
    return next(new AppError("Consent must be true or false", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { consentGiven },
    { new: true, runValidators: true }
  ).select("-password -__v");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Consent updated successfully",
    data: {
      user,
    },
  });
});



/**
 * Get user by ID (for public profiles)
 */
exports.getUserById = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  // Find user and exclude private data
  const user = await User.findOne({ userId }).select(
    "userId firstName lastName profilePhoto bio profileSettings availability"
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Check if profile is public
  if (!user.profileSettings.public) {
    return next(new AppError("This profile is not public", 403));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

/**
 * Test Cloudinary connection
 */
exports.testCloudinaryConnection = catchAsync(async (req, res, next) => {
  const { cloudinary, isConfigured } = require('../config/cloudinary');
  
  console.log('Testing Cloudinary connection...');
  console.log('Cloudinary configured:', isConfigured);
  
  if (!isConfigured) {
    console.log('Cloudinary is not configured correctly');
    return res.status(500).json({
      status: 'error',
      message: 'Cloudinary is not configured correctly',
      details: 'Check server logs for more information'
    });
  }
  
  try {
    // Test by getting account info
    const result = await cloudinary.api.ping();
    
    console.log('Successfully connected to Cloudinary:', result);
    
    return res.status(200).json({
      status: 'success',
      message: 'Cloudinary is configured correctly',
      details: {
        status: result.status
      }
    });
  } catch (error) {
    console.error('Error connecting to Cloudinary:', error);
    
    return res.status(500).json({
      status: 'error',
      message: 'Error connecting to Cloudinary',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Delete user profile with Cloudinary cleanup
 */
exports.deleteUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // If user has a profile photo, delete it from Cloudinary
  if (user.profilePhoto && user.profilePhoto.publicId) {
    try {
      await deleteFromCloudinary(user.profilePhoto.publicId);
    } catch (err) {
      // Log error but continue with user deletion
      console.error("Error deleting profile photo:", err);
    }
  }

  // Delete the user
  await User.findByIdAndDelete(req.user._id);

  res.status(204).json({
    status: "success",
    message: "User deleted successfully",
    data: null,
  });
});

exports.getUserprofile = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("-password -__v");
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
    
});

