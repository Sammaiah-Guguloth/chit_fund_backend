const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const adminController = require("../controllers/admin.controller");
const authMiddleWare = require("../middlewares/auth.middleware");

router.post(
  "/register",
  [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  adminController.adminRegister
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  adminController.adminLogin
);

// get all pending users
router.get(
  "/pending-users",
  authMiddleWare.adminAuth,
  adminController.getAllPendingUsers
);

// accept the pending user
router.post(
  "/approve-registration/:id",
  authMiddleWare.adminAuth,
  adminController.approvePendingUser
);

// Get all registered users
router.get("/all-users", authMiddleWare.adminAuth, adminController.getAllUsers);

module.exports = router;
