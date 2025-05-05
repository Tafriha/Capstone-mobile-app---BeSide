const User = require("../models/userModel");
const Trip = require("../models/tripModel");
const TripRequest = require("../models/tripRequestModel");

const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.createTripReq = catchAsync(async (req, res, next) => {
  const { user, destination, destinationType, date, time, genderPreference } = req.body;

    const tripReqId = user.username.slice(0, 3).toUpperCase() + Date.now(); // Generate a unique trip request ID

  // Check if the user exists
  const existingUser = await User.findById(user.userId);
  if (!existingUser) {
    return next(new AppError("User not found", 404));
  }

  // Create a new trip request
  const newTripRequest = await TripRequest.create({
    tripReqId,
    user,
    destination,
    destinationType,
    date,
    time,
    genderPreference,
  });

  res.status(201).json({
    status: "success",
    data: {
      tripRequest: newTripRequest,
    },
  });
}
);

exports.createTrip = catchAsync(async (req, res, next) => {
    const { user, companion, consent, distanceMaintained, distancePreferred, genderPreference } = req.body;

    const tripId = user.username.slice(0, 3).toUpperCase() + companion.username.slice(0, 3).toUpperCase() + Date.now(); // Generate a unique trip ID

    // Check if the user exists
    const existingUser = await User.findById(user.userId);
    if (!existingUser) {
        return next(new AppError("User not found", 404));
    }

    // Check if the companion exists
    const existingCompanion = await User.findById(companion.userId);
    if (!existingCompanion) {
        return next(new AppError("Companion not found", 404));
    }

    // Create a new trip
    const newTrip = await Trip.create({
        tripId,
        user,
        companion,
        consent,
        distanceMaintained,
        distancePreferred,
        genderPreference,
    });

    res.status(201).json({
        status: "success",
        data: {
            trip: newTrip,
        },
    });
}
);

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
