const adminModel = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const pendingUserModel = require("../models/pendingUser.model");
const userModel = require("../models/user.model");

// Admin Register
const adminRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new adminModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin registered successfully",
      admin: newAdmin,
    });
  } catch (error) {
    console.log("Error while registering admin : ", error);
    res
      .status(500)
      .json({ message: "Error registering admin", error: error.message });
  }
};

//Admin login
const adminLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("adminToken", token, {
      httpOnly: true, // Prevents access from JavaScript
      // secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
    });

    res.status(200).json({
      message: "Logged in successfully",
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// get all pending users
const getAllPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await pendingUserModel.find();
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ message: "Failed to retrieve pending users" });
  }
};

// admin registering pending user
const approvePendingUser = async (req, res) => {
  const { id } = req.params;

  try {
    const pendingUser = await pendingUserModel.findById(id);
    if (!pendingUser)
      return res.status(404).json({ message: "Pending user not found" });

    // Check if user already exists
    const existingUser = await userModel.findOne({ phone: pendingUser.phone });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new userModel({
      name: pendingUser.name,
      phone: pendingUser.phone,
      password: pendingUser.password,
    });

    await newUser.save();
    await pendingUserModel.findByIdAndDelete(id);

    // Optionally send SMS or email here to notify user
    res.status(200).json({ message: "User approved and created successfully" });
  } catch (err) {
    console.error("Error approving user:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password"); // exclude password
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

// admin verifying payments

// admin approving loans

// admin generating reports

// admin tracking expenses

// admin managing events

// admin managing users

// admin managing loans

// admin managing payments

// admin managing chit fund events

// admin managing notifications

module.exports = {
  adminRegister,
  adminLogin,
  getAllPendingUsers,
  approvePendingUser,
  getAllUsers,
};
