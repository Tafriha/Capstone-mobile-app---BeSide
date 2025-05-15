const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./userModel"); // Assuming you have a user model
const TripReqSchema = new Schema(
    {
    tripReqId: {
      type: String,
      required: [true, "Trip ID is required"],
      unique: true,
    },
    user: {
        userId: {
          type: String,
          required: [true, "User ID is required"],
        },
        userName: {
          type: String,
          required: [true, "User name is required"],
        },
        userImage: {
          type: String,
          default: "default.jpg",
        },
    },

    destination: {
        type: String,
        required: [true, "Destination is required"],
      },

    destinationType: {
        type: String,
        enum: ["By Bus", "By Tram", "By Train", "By Car", "By Bike", "By Walk", "Other"],
        required: [true, "Destination type is required"],
      },

    date: {
        type: Date,
        required: [true, "Date is required"],
      },

    time: {
        type: String,
        required: [true, "Time is required"],
      },

    genderPreference: {
        type: String,
        enum: ["Male", "Female", "LGBTQ+", "Other"],
        required: [true, "Gender preference is required"],
    },
}
);
module.exports = mongoose.model("TripRequest", TripReqSchema);
