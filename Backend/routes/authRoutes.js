const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/login", authController.login);
router.post("/verify", authController.protect, authController.verifyUser);
router.post("/forgotPassword", authController.forgotPassword);
router.get("/logout", authController.logout);
router.get("/current-user", authController.protect, authController.currentUser);
router.post("/register", authController.registerUser);

module.exports = router;