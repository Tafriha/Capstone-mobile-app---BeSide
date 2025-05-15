const express = require("express");
const router = express.Router();

const tripController = require("../controllers/tripController");
const { model } = require("mongoose");

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

module.exports = router;