const express = require("express");
const authController = require("../controllers/authController");
console.log("Loaded methods:", Object.keys(authController));

const router = express.Router();

router.post("/login", authController.login);
router.post("/verify", authController.protect, authController.verifyUser);
router.get("/logout", authController.logout);
router.get("/current-user", authController.protect, authController.currentUser);
router.post("/register", authController.registerUser);
router.post("/verify-email/:token", authController.verifyEmail);
router.post("/send-verification-email", authController.sendVerificationEmail);
router.post("/send-otp", authController.sendOTPForReset);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword); // OTP-based reset

module.exports = router;
