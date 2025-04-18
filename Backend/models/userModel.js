const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false, // Don't include password in query results by default
    },
    mobileNo: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    profilePhoto: {
      type: String,
      default: "default.jpg",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    consentGiven: {
      type: Boolean,
      default: false,
    },
    profileSettings: {
      public: {
        type: Boolean,
        default: false,
      },
      sharedInfo: {
        type: [String],
        default: [],
      },
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
