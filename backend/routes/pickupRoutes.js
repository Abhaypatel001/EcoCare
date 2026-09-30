const express = require("express");

const {
  createPickup,
  getMyPickups,
  getAllPickups,
  updatePickupStatus,
} = require("../controllers/pickupController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CITIZEN
// ==========================================

router.post("/", protect, createPickup);

router.get("/my", protect, getMyPickups);

// ==========================================
// ADMIN
// ==========================================

router.get("/", protect, adminOnly, getAllPickups);

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updatePickupStatus
);

module.exports = router;