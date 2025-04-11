const mongoose = require("mongoose");

const connectToDb = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((error) => {
      console.log("❌ Error while connecting to DB:", error);
    });
};

module.exports = connectToDb;
