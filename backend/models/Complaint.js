const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // REAL LOCATION
    // ==========================================

    location: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      required: false,
    },

    longitude: {
      type: Number,
      required: false,
    },

    landmark: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // COMPLAINT CATEGORY
    // ==========================================

    category: {
      type: String,
      enum: [
        "Garbage Collection",
        "Waste Dumping",
        "Dirty Area",
        "Blocked Drain",
        "Other",
      ],
      default: "Other",
    },

    // ==========================================
    // COMPLAINT STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },

    // ==========================================
    // IMAGE
    // ==========================================

    image: {
      type: String,
      default: "",
    },

    // ==========================================
    // AI IMAGE VERIFICATION
    // ==========================================

    aiVerification: {
      // Did AI detect waste in the image?
      isWaste: {
        type: Boolean,
        default: false,
      },

      // AI confidence from 0 to 1
      confidence: {
        type: Number,
        default: 0,
        min: 0,
        max: 1,
      },

      // Waste category detected by AI
      category: {
        type: String,
        default: "",
        trim: true,
      },

      // AI explanation
      explanation: {
        type: String,
        default: "",
        trim: true,
      },

      // AI decision
      status: {
        type: String,
        enum: ["Approved", "Review", "Rejected"],
        default: "Review",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);