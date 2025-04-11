const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin.model");

const adminAuth = async (req, res, next) => {
  try {
    let token =
      req.cookies.adminToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    }

    const admin = await adminModel.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.log("Errror while auth admin : ", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { adminAuth };
