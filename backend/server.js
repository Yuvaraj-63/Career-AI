const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

/*
==================================================
ROUTES
==================================================
*/

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

/*
==================================================
APP
==================================================
*/

const app = express();

const PORT = process.env.PORT || 5000;

/*
==================================================
MIDDLEWARE
==================================================
*/

app.use(cors());

app.use(express.json());

/*
==================================================
ROOT
==================================================
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CareerAI backend is running 🚀",
  });
});

/*
==================================================
API ROUTES
==================================================
*/

app.use("/api/auth", authRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/interview", interviewRoutes);

/*
==================================================
ERROR HANDLER
==================================================
*/

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/*
==================================================
START SERVER
==================================================
*/

app.listen(PORT, () => {
  console.log(
    `CareerAI backend running on http://localhost:${PORT}`
  );
});