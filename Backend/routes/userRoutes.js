const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// Public routes
router.get("/public/:userId", userController.getUserById);

// Protect all routes after this middleware
router.use(authController.protect);

// Profile management
router.get("/profile", userController.getUserProfile);
router.put("/profile", userController.updateUserProfile);
router.delete("/profile", userController.deleteUserProfile);

// Profile photo management
router.post(
  "/profile-photo",
  userController.uploadProfilePhoto,
  userController.saveProfilePhoto
);

// Settings management
router.post("/consent", userController.updateConsent);
router.put("/profile-settings", userController.updateProfileSettings);
router.patch("/availability", userController.updateAvailability);

module.exports = router;