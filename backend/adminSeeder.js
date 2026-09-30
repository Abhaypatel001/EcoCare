const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

const createOrUpdateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");

    const adminEmail = "admin@ecocare.gov";
    const adminPassword = "Admin@123456";

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      existingAdmin.name = "Municipal Officer";
      existingAdmin.phone = "9999999999";
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";

      await existingAdmin.save();

      console.log("=================================");
      console.log("Admin Updated Successfully ✅");
      console.log("Email:", adminEmail);
      console.log("Password:", adminPassword);
      console.log("Role:", existingAdmin.role);
      console.log("=================================");

      process.exit(0);
    }

    const admin = await User.create({
      name: "Municipal Officer",
      email: adminEmail,
      phone: "9999999999",
      password: hashedPassword,
      role: "admin",
    });

    console.log("=================================");
    console.log("Admin Created Successfully ✅");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("Role:", admin.role);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("Admin Setup Failed ❌");
    console.error(error.message);
    process.exit(1);
  }
};

createOrUpdateAdmin();