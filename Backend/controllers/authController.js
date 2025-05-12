const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("../utils/AppError");
const { promisify } = require("util");
const passwordHash = require("../utils/passwordHash");
const generateUserId = require("../utils/generateUserId");
const { default: mongoose } = require("mongoose");

// Create a dummy verification model for testing
const tokenUtils = require("../utils/tokenUtils");
const emailService = require("../services/emailService");

const dummyVerification =
  mongoose.models.dummyVerification ||
  mongoose.model(
    "dummyVerification",
    new mongoose.Schema({
      firstName: String,
      lastName: String,
      wwcc: {
        number: String,
        expiryDate: String,
      },
      license: {
        number: String,
        expiryDate: String,
      },
      dob: String,
    })
  );

/**
 * Generate JWT token
 * @param {string} id - User ID to include in the token
 * @returns {string} JWT token
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Create and send JWT token
 * @param {Object} user - User object
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Set secure cookies in production
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

/**
 * Login user and send JWT token
 */
exports.login = catchAsync(async (req, res, next) => {
  const { userName, password } = req.body;

  // Check if username and password exist
  if (!userName || !password) {
    return next(new AppError("Please provide username and password", 400));
  }

  // Find user by username
  const user = await User.findOne({ userName }).select("+password");

  // Check if user exists and password is correct
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Incorrect username or password", 401));
  }

  // Send token
  createSendToken(user, 200, res);
});

/**
 * Get current user info
 */
exports.currentUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

/**
 * Logout user
 */
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Successfully logged out",
  });
});

/**
 * Verify user ID
 */
exports.verifyUser = catchAsync(async (req, res, next) => {
  const {
    userName,
    verificationIdType,
    firstName,
    lastName,
    number,
    expiry,
    dob,
  } = req.body;

  if (
    !userName ||
    !verificationIdType ||
    !firstName ||
    !lastName ||
    !number ||
    !expiry ||
    !dob
  ) {
    return next(new AppError("All verification fields are required", 400));
  }

  const query = {
    firstName: new RegExp(`^${firstName.trim()}$`, "i"),
    lastName: new RegExp(`^${lastName.trim()}$`, "i"),
    dob: dob.trim(),
    [`${verificationIdType}.number`]: number.trim(),
    [`${verificationIdType}.expiryDate`]: expiry.trim()
  };

  const record = await dummyVerification.findOne(query);

  if (!record) {
    return next(new AppError("Verification failed", 401));
  }

  const user = await User.findOne({ userName });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.isVerified = true;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});


/**
 * Register a new user
 * @route POST /api/v1/auth/register
 */
exports.registerUser = catchAsync(async (req, res, next) => {
  const {
    userName,
    email,
    mobileNo,
    password,
    firstName,
    lastName,
    address = {},
  } = req.body;

  // Check required fields
  if (
    !userName ||
    !email ||
    !mobileNo ||
    !password ||
    !firstName ||
    !lastName
  ) {
    return next(new AppError("Please provide all required fields", 400));
  }

  // Check if country and country code are provided
  if (!address.country || !address.countryCode) {
    return next(new AppError("Country and country code are required", 400));
  }

  // Check if user already exists
  const userExists = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (userExists) {
    return next(
      new AppError("User with this email or username already exists", 400)
    );
  }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return next(
        new AppError(
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
          400
        )
      );
    }
  

  // Hash password
  const hashedPassword = await passwordHash(password);

  // Prepare user data including location information
  const userData = {
    userName,
    email,
    password: hashedPassword,
    mobileNo,
    firstName,
    lastName,
    address: {
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country,
      countryCode: address.countryCode,
    },
  };

  // Generate unique user ID
  userData.userId = generateUserId(userData);

  // Create user
  const user = await User.create(userData);

  // Generate and send JWT token
  createSendToken(user, 201, res);
});

/**
 * Protect routes - Authentication middleware
 */
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // Get token from authorization header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("Please log in to access this resource", 401));
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError("User belonging to this token no longer exists", 401)
    );
  }

  // Grant access to protected route
  req.user = user;
  next();
});

/**
 * Restrict access to specific roles
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

/**
 * Send password reset email
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please provide an email address", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("No user found with this email address", 404));
  }
  const resetToken = tokenUtils.generateToken();
  const hashedToken = tokenUtils.hashToken(resetToken);
  const tokenExpiry= Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  try {
    await emailService.sendPasswordResetEmail(
      user.email,
      resetToken,
      user.userName
    );
  }

  catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending the email. Try again later.", 500)
    );
  }


  res.status(200).json({
    status: "success",
    message: "Password has been reset successfully",
  });
});


function createTokenResponse(user) {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  user.password = undefined; // Remove password from user object

  return { token, cookieOptions, user };
};

exports.resetPassword = catchAsync(async (req, res, next) => {
  const {token}= req.params;
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    return next(new AppError("Please provide a password and confirm password", 400));
  }
  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }
  const hashedToken = tokenUtils.hashToken(token);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = passwordHash(password);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  
  const tokenResponse = createTokenResponse(user);
  res.cookie("jwt", tokenResponse.token, tokenResponse.cookieOptions);
  res.status(200).json({
    status: "success",
    token: tokenResponse.token,
    data: {
      user: tokenResponse.user,
    },
  });
}
);

/**
 * Verify email address
 */
exports.sendVerificationEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please provide an email address", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("No user found with this email address", 404));
  }
  const verificationToken = tokenUtils.generateToken();
  const hashedToken = tokenUtils.hashToken(verificationToken);
  const tokenExpiry = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = tokenExpiry;
  await user.save({ validateBeforeSave: false });
  try {
    await emailService.sendVerificationEmail(
      user.email,
      verificationToken,
      user.userName
    );
  } catch (error) {
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending the email. Try again later.", 500)
    );
  }
  res.status(200).json({
    status: "success",
    message: "Verification email sent",
  });
}
);

/**
 * Verify email address using token
 */
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const hashedToken = tokenUtils.hashToken(token);
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Email verified successfully",
  });
}
);

