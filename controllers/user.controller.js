const bcrypt = require("bcryptjs");
const pendingUserModel = require("../models/pendingUser.model");

const createPendingUser = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // Check if all fields are provided
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already requested
    const existingPending = await pendingUserModel.findOne({ phone });
    if (existingPending) {
      return res.status(400).json({
        message: "A request is already pending with this phone number",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create pending user
    const pendingUser = new pendingUserModel({
      name,
      phone,
      password: hashedPassword,
    });

    await pendingUser.save();

    // You can trigger email or SMS to admin here if needed

    res.status(201).json({
      message: "User request submitted. Await admin approval.",
    });
  } catch (error) {
    console.error("Error creating pending user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPendingUser,
};
