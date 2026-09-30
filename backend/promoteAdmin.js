const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

const promoteUserToAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected ✅");

    const email = "kurmiabhay320@gmail.com";

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      console.log("User not found ❌");
      process.exit(1);
    }

    user.role = "admin";

    await user.save();

    console.log("=================================");
    console.log("User Promoted to Admin Successfully ✅");
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("Failed to promote user ❌");
    console.error(error.message);
    process.exit(1);
  }
};

promoteUserToAdmin();