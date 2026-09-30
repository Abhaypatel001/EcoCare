const User = require("../models/User");
const Complaint = require("../models/Complaint");
const Pickup = require("../models/Pickup");

const getAnalytics = async (req, res) => {
  try {
    const [
      totalCitizens,
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      totalPickups,
      scheduledPickups,
      pickupInProgress,
      completedPickups,
      cancelledPickups,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),

      Complaint.countDocuments(),

      Complaint.countDocuments({
        status: "Pending",
      }),

      Complaint.countDocuments({
        status: "In Progress",
      }),

      Complaint.countDocuments({
        status: "Resolved",
      }),

      Complaint.countDocuments({
        status: "Rejected",
      }),

      Pickup.countDocuments(),

      Pickup.countDocuments({
        status: "Scheduled",
      }),

      Pickup.countDocuments({
        status: "In Progress",
      }),

      Pickup.countDocuments({
        status: "Completed",
      }),

      Pickup.countDocuments({
        status: "Cancelled",
      }),
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        citizens: {
          total: totalCitizens,
        },

        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          inProgress: inProgressComplaints,
          resolved: resolvedComplaints,
          rejected: rejectedComplaints,
        },

        pickups: {
          total: totalPickups,
          scheduled: scheduledPickups,
          inProgress: pickupInProgress,
          completed: completedPickups,
          cancelled: cancelledPickups,
        },
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getAnalytics,
};