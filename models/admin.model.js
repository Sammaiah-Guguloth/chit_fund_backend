const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },

    // List of payments to be verified
    pendingPayments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        transactionId: { type: String, required: true },
        amount: { type: Number, required: true },
        status: {
          type: String,
          enum: ["pending", "verified", "rejected"],
          default: "pending",
        },
        submittedAt: { type: Date, default: Date.now },
      },
    ],

    // List of loans to approve
    pendingLoans: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amount: { type: Number, required: true },
        loanType: {
          type: String,
          enum: ["general", "special"],
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        requestedAt: { type: Date, default: Date.now },
      },
    ],

    // Chit fund financial tracking
    reports: {
      monthlyIncome: { type: Number, default: 0 },
      yearlyIncome: { type: Number, default: 0 },
      generalLoanInterestEarnings: { type: Number, default: 0 },
      specialLoanInterestEarnings: { type: Number, default: 0 },
    },

    // Expense tracking for chit fund events
    eventExpenses: [
      {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;
