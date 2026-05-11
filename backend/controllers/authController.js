const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, idNumber, password, role } = req.body;

    if (!name || !email || !idNumber || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { idNumber }]
    });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      idNumber,
      password: hashedPassword,
      role
    });

    res.status(201).json({ msg: "Registered successfully" });
  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ msg: "Email, password and role are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Wrong Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong Email or Password" });
    }

    if (user.role !== role) {
      return res.status(400).json({
        msg: `This account is registered as ${user.role}, not ${role}`
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        idNumber: user.idNumber
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        idNumber: user.idNumber,
        role: user.role
      }
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ msg: "New password is required" });
    }

    if (newPassword.trim().length < 4) {
      return res.status(400).json({ msg: "Password must be at least 4 characters" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.log("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};