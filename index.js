const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDb = require("./config/connectToDb");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
// app.use(fileUpload());

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);

app.use(express.urlencoded({ extended: true }));

connectToDb();

app.listen(port, () => {
  console.log("app is listening on port : ", port);
});

app.get("/", (req, res) => {
  res.send("<center> <h1> Welcome to Chit Fund  </h1> </center>");
});

module.exports = app;
