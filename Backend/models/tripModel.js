const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./userModel"); // Assuming you have a user model
const TripsSchema = new Schema(
  {
    tripId: {
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

    companion: {
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

    consent: {
        tapOn: {
            type: Boolean,
            required: [true, "Tap on is required"],
          },
        consentofConversation: {
            type: Boolean,
            required: [true, "Consent is required"],
          },
        distanceMaintained: {
            type: Boolean,
            required: [true, "Distance is required"],
          },
        distancePreferred: {
            type: Number,
            required: [true, "Distance is required"],
          },
        genderPreference: {
            type: String,
            enum: ["Woman", "Man", "LGBTQ+", "Other"],
            required: [true, "Gender is required"],
        },
        },
    
    imageVerification: {
        type: Boolean,
        default: false,
        required: [true, "Image verification is required"],
      },
    }

);
module.exports = mongoose.model("Trip", TripsSchema);
