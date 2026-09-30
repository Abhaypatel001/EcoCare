const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookingId: {
      type: String,
      required: true,
      unique: true,
    },

    wasteType: {
      type: String,
      enum: [
        "Organic Waste",
        "Dry Recyclables",
        "E-Waste",
        "Bulk Waste",
      ],
      required: true,
    },

    quantity: {
      type: String,
      required: true,
      trim: true,
    },

    pickupDate: {
      type: String,
      required: true,
    },

    pickupTime: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      required: true,
    },

    addressType: {
      type: String,
      enum: [
        "Home",
        "Society / Apartment",
        "Office / Commercial",
      ],
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    instructions: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Scheduled",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pickup", pickupSchema);