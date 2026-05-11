require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const existing = await User.findOne({ email: "admin@gmail.com" });
    if (existing) {
      await User.deleteOne({ email: "admin@gmail.com" });
      console.log("Old admin deleted");
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
      idNumber: "ADM-GLOBAL"
    });

    console.log("Admin created successfully");
    console.log("Email: admin@gmail.com");
    console.log("Password: admin123");
    process.exit();
  } catch (err) {
    console.log("CREATE ADMIN ERROR:", err);
    process.exit(1);
  }
}

createAdmin();