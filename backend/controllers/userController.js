const User = require("../models/User");
const Complaint = require("../models/Complaint");
const Pickup = require("../models/Pickup");

const getAllCitizens = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    const citizens = await Promise.all(
      users.map(async (user) => {
        const complaintCount =
          await Complaint.countDocuments({
            user: user._id,
          });

        const pickupCount =
          await Pickup.countDocuments({
            user: user._id,
          });

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          complaintCount,
          pickupCount,
          createdAt: user.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: citizens.length,
      citizens,
    });
  } catch (error) {
    console.error("Get All Citizens Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getAllCitizens,
};