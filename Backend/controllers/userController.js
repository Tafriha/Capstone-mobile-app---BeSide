const { uploadToCloudinary, deleteFromCloudinary, uploadSingle } = require("../utils/fileUpload");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const generateUserId = require("../utils/generateUserId");

// Update user profile and generate userId if missing
exports.updateUserProfile = catchAsync(async (req, res, next) => {
  const { userName, email, mobileNo, firstName, lastName, bio, address } = req.body;

  const updateData = {};
  if (userName) updateData.userName = userName;
  if (email) updateData.email = email;
  if (mobileNo) updateData.mobileNo = mobileNo;
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (bio !== undefined) updateData.bio = bio;

  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));

  if (address) {
    updateData.address = { ...user.address, ...address };
    const { countryCode, state, postalCode } = updateData.address;

    if (!user.userId && countryCode && state && postalCode) {
      updateData.userId = generateUserId({ address: updateData.address });
      console.log("Generated userId:", updateData.userId);
    }
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true
  }).select("-password -__v");

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: { user: updatedUser }
  });
});

// Save profile photo and upload to Cloudinary
exports.saveProfilePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError("No file uploaded", 400));

  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));

  if (user.profilePhoto?.publicId) {
    await deleteFromCloudinary(user.profilePhoto.publicId);
  }

  const uploadResult = await uploadToCloudinary(req.file, "profile-photos", user._id.toString());

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { profilePhoto: uploadResult },
    { new: true, runValidators: true }
  ).select("-password -__v");

  res.status(200).json({
    status: "success",
    message: "Profile photo updated successfully",
    data: { user: updatedUser },
  });
});

// Update profile visibility and shared information
exports.updateProfileSettings = catchAsync(async (req, res, next) => {
  const { public, sharedInfo } = req.body;
  const update = {};

  if (typeof public === "boolean") update["profileSettings.public"] = public;
  if (Array.isArray(sharedInfo)) update["profileSettings.sharedInfo"] = sharedInfo;

  if (Object.keys(update).length === 0) {
    return next(new AppError("No profile settings to update", 400));
  }

  const user = await User.findByIdAndUpdate(req.user._id, update, {
    new: true,
    runValidators: true,
  }).select("-password -__v");

  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    status: "success",
    message: "Profile settings updated successfully",
    data: { user },
  });
});

// Update availability
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

  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    status: "success",
    message: "Availability updated successfully",
    data: { user },
  });
});

// View current user profile
exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password -__v");
  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({ status: "success", data: { user } });
});

// Delete user profile and remove image from Cloudinary
exports.deleteUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));

  if (user.profilePhoto?.publicId) {
    try {
      await deleteFromCloudinary(user.profilePhoto.publicId);
    } catch (err) {
      console.error("Error deleting Cloudinary image:", err);
    }
  }

  await User.findByIdAndDelete(req.user._id);
  res.status(204).json({ status: "success", message: "User deleted successfully", data: null });
});

// Update user consent
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

  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    status: "success",
    message: "Consent updated successfully",
    data: { user },
  });
});

// Public view of another user's profile
exports.getUserById = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findOne({ userId }).select(
    "userId firstName lastName profilePhoto bio profileSettings availability"
  );

  if (!user) return next(new AppError("User not found", 404));
  if (!user.profileSettings?.public) {
    return next(new AppError("This profile is not public", 403));
  }

  res.status(200).json({ status: "success", data: { user } });
});

// Test Cloudinary config
exports.testCloudinaryConnection = catchAsync(async (req, res, next) => {
  const { cloudinary, isConfigured } = require('../config/cloudinary');

  if (!isConfigured) {
    return res.status(500).json({ status: 'error', message: 'Cloudinary misconfigured' });
  }

  try {
    const result = await cloudinary.api.ping();
    res.status(200).json({ status: 'success', message: 'Cloudinary is OK', details: { status: result.status } });
  } catch (error) {
    console.error("Cloudinary test error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Upload middleware for profile photo (should be declared after all imports)
exports.uploadProfilePhoto = uploadSingle;
