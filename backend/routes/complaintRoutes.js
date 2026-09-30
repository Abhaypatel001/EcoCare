const express = require("express");

const {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CITIZEN ROUTES
// ==========================================

// Create complaint
router.post("/", protect, createComplaint);

// Get logged-in citizen's complaints
router.get("/my", protect, getMyComplaints);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all complaints
router.get("/", protect, adminOnly, getAllComplaints);

// Update complaint status
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateComplaintStatus
);

module.exports = router;