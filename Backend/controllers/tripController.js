const User = require("../models/userModel");
const Trip = require("../models/tripModel");
const TripRequest = require("../models/tripRequestModel");

const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

  exports.createTripReq = catchAsync(async (req, res, next) => {
    const { user, destination, destinationType, date, time, genderPreference } = req.body;
  
    if (!user || !user.userName) {
      return next(new AppError("User name is required", 400));
    }
  
    // Find user by userName
    const existingUser = await User.findOne({ userName: user.userName });
    if (!existingUser) {
      return next(new AppError("User not found", 404));
    }
  
    // Generate trip request ID
    const tripReqId = existingUser.userName.slice(0, 3).toUpperCase() + Date.now();
  
    // Create new TripRequest using full user data
    const newTripRequest = await TripRequest.create({
      tripReqId,
      user: {
        userId: existingUser._id.toString(), // Inject required field
        userName: existingUser.userName,
        userImage: existingUser.profilePhoto || "default.jpg"
      },
      destination,
      destinationType,
      date,
      time,
      genderPreference
    });
  
    res.status(201).json({
      status: "success",
      data: {
        tripRequest: newTripRequest,
      },
    });
  });  

  
exports.createTrip = catchAsync(async (req, res, next) => {
  const { user, companion, consent, distanceMaintained, distancePreferred, genderPreference, imageVerification } = req.body;

  if (!user?.userName || !companion?.userName) {
    return next(new AppError("Both user and companion usernames are required", 400));
  }

  // Find user and companion by username
  const existingUser = await User.findOne({ userName: user.userName });
  if (!existingUser) return next(new AppError("User not found", 404));

  const existingCompanion = await User.findOne({ userName: companion.userName });
  if (!existingCompanion) return next(new AppError("Companion not found", 404));

  // Generate unique trip ID
  const tripId = existingUser.userName.slice(0, 3).toUpperCase() + existingCompanion.userName.slice(0, 3).toUpperCase() + Date.now();

  // Create trip
  const newTrip = await Trip.create({
    tripId,
    user: {
      userId: existingUser._id.toString(),
      userName: existingUser.userName,
      userImage: existingUser.profilePhoto || "default.jpg"
    },
    companion: {
      userId: existingCompanion._id.toString(),
      userName: existingCompanion.userName,
      userImage: existingCompanion.profilePhoto || "default.jpg"
    },
    consent,
    distanceMaintained,
    distancePreferred,
    genderPreference,
    imageVerification
  });

  res.status(201).json({
    status: "success",
    data: {
      trip: newTrip
    }
  });
});

exports.getTripReq = catchAsync(async (req, res, next) => {
    const { tripReqId } = req.body;

    if (!tripReqId) {
        return next(new AppError("Trip Request ID is required", 400));
    }

    const tripRequest = await TripRequest.findOne({ tripReqId });

    if (!tripRequest) {
        return next(new AppError("Trip Request not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            tripRequest,
        },
    });
});

exports.getTrip = catchAsync(async (req, res, next) => {
    const { tripId } = req.body;

    if (!tripId) {
        return next(new AppError("Trip ID is required", 400));
    }

    const trip = await Trip.findOne({ tripId });

    if (!trip) {
        return next(new AppError("Trip not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            trip,
        },
    });
});
