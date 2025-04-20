const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
router.use(authController.protect);
router.get(
  "/profile",
  userController.getUserprofile,
);

// router.put(
//     "/profile",
//     userController.updateUserProfile,
// )

// router.delete(
//     "/profile",
//     userController.deleteUserProfile,
// )

// router.post(
//     "/consent",
//     userController.updateConsent,

// )

// router.post(
//     "/profilePhoto",
//     userController.uploadProfilePhoto,
// )
module.exports = router;
