const Pickup = require("../models/Pickup");

// ==========================================
// GENERATE UNIQUE BOOKING ID
// ==========================================
const generateBookingId = async () => {
  let bookingId;
  let exists = true;

  while (exists) {
    bookingId = `PK${Math.floor(100000 + Math.random() * 900000)}`;

    exists = await Pickup.exists({
      bookingId,
    });
  }

  return bookingId;
};

// ==========================================
// CREATE PICKUP — CITIZEN
// ==========================================
const createPickup = async (req, res) => {
  try {
    const {
      wasteType,
      quantity,
      pickupDate,
      pickupTime,
      addressType,
      fullName,
      phone,
      address,
      instructions,
    } = req.body;

    // Required fields
    if (
      !wasteType ||
      !quantity ||
      !pickupDate ||
      !pickupTime ||
      !addressType ||
      !fullName ||
      !phone ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill all required pickup details",
      });
    }

    // Generate booking ID
    const bookingId = await generateBookingId();

    // Create pickup
    const pickup = await Pickup.create({
      user: req.user.id,

      bookingId,

      wasteType,

      quantity,

      pickupDate,

      pickupTime,

      addressType,

      fullName,

      phone,

      address,

      instructions: instructions || "",

      status: "Scheduled",
    });

    // Populate user information
    const populatedPickup = await pickup.populate(
      "user",
      "name email phone"
    );

    res.status(201).json({
      success: true,
      message:
        "Pickup request scheduled successfully",
      pickup: populatedPickup,
    });
  } catch (error) {
    console.error(
      "Create Pickup Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET MY PICKUPS — CITIZEN
// ==========================================
const getMyPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({
      user: req.user.id,
    })
      .populate(
        "user",
        "name email phone"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: pickups.length,
      pickups,
    });
  } catch (error) {
    console.error(
      "Get My Pickups Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET ALL PICKUPS — ADMIN
// ==========================================
const getAllPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find()
      .populate(
        "user",
        "name email phone"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: pickups.length,
      pickups,
    });
  } catch (error) {
    console.error(
      "Get All Pickups Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE PICKUP STATUS — ADMIN
// ==========================================
const updatePickupStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Scheduled",
      "In Progress",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup status",
      });
    }

    const pickup =
      await Pickup.findByIdAndUpdate(
        req.params.id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "user",
        "name email phone"
      );

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup request not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Pickup status updated successfully",
      pickup,
    });
  } catch (error) {
    console.error(
      "Update Pickup Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createPickup,
  getMyPickups,
  getAllPickups,
  updatePickupStatus,
};