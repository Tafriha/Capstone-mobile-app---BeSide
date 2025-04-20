const user = require("../models/userModel");
//   // Check if userName and password are provided
//   if (!userName || !password) {
//     return next(new AppError("Please provide userName and password", 400));
//   }
//

const authController = require("./authController");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

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

