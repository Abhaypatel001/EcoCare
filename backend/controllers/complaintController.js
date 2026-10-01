const Complaint = require("../models/Complaint");

// ==========================================
// CREATE COMPLAINT — CITIZEN
// ==========================================
const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      latitude,
      longitude,
      landmark,
      category,
      image,
    } = req.body;

    // Basic validation
    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, description and location are required",
      });
    }

    // Validate coordinates when provided
    if (
      latitude !== undefined &&
      latitude !== null &&
      (typeof latitude !== "number" || latitude < -90 || latitude > 90)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude",
      });
    }

    if (
      longitude !== undefined &&
      longitude !== null &&
      (typeof longitude !== "number" ||
        longitude < -180 ||
        longitude > 180)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude",
      });
    }

    const complaint = await Complaint.create({
      user: req.user.id,
      title,
      description,
      location,
      latitude:
        latitude !== undefined && latitude !== null
          ? Number(latitude)
          : undefined,
      longitude:
        longitude !== undefined && longitude !== null
          ? Number(longitude)
          : undefined,
      landmark: landmark || "",
      category: category || "Other",
      image: image || "",
    });

    const populatedComplaint = await complaint.populate(
      "user",
      "name email phone"
    );

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint: populatedComplaint,
    });
  } catch (error) {
    console.error("Create Complaint Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET ALL COMPLAINTS — ADMIN
// ==========================================
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get Complaints Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET MY COMPLAINTS — CITIZEN
// ==========================================
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user.id,
    })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get My Complaints Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE COMPLAINT STATUS — ADMIN
// ==========================================
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status",
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email phone");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Update Complaint Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================
module.exports = {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaintStatus,
};