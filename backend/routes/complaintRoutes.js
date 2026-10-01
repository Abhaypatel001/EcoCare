const express = require("express");
const multer = require("multer");

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
// IMAGE UPLOAD CONFIGURATION
// ==========================================

// Image ko temporarily memory me rakhenge
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum 5 MB
  },

  fileFilter: (req, file, cb) => {
    // Sirf image files allow hongi
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// ==========================================
// CITIZEN ROUTES
// ==========================================

// Create complaint
// Image -> Multer -> AI verification -> Controller
router.post(
  "/",
  protect,
  upload.single("image"),
  createComplaint
);

// Get logged-in citizen's complaints
router.get(
  "/my",
  protect,
  getMyComplaints
);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all complaints
router.get(
  "/",
  protect,
  adminOnly,
  getAllComplaints
);

// Update complaint status
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateComplaintStatus
);

module.exports = router;