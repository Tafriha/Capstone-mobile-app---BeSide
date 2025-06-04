const express = require("express");
const router = express.Router();

const tripController = require("../controllers/tripController");
const { model } = require("mongoose");
const { uploadSingle } = require("../utils/fileUpload");
const authController = require("../controllers/authController");

// Protect all routes
router.use(authController.protect);

router.post(
  "/createTripReq",
  tripController.createTripReq
);
router.post(
  "/createTrip",
  tripController.createTrip
);
router.get(
  "/getTripReq",
  tripController.getTripReq
);
router.get(
  "/getTrip",
  tripController.getTrip
);

router.post(
  "/upload-photo/:tripReqId",
  uploadSingle,
  tripController.uploadTripPhoto
);

router.put(
  "/:tripReqId",
  tripController.updateTripRequest
);

module.exports = router;