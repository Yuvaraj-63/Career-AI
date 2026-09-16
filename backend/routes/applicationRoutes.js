// ============================================================
// CareerAI - Application Routes
// ============================================================

const express = require("express");

const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationStats,
} = require("../controllers/applicationController");

const router = express.Router();

// ============================================================
// APPLICATION ROUTES
// ============================================================

// Get all applications
router.get("/", getApplications);

// Get application statistics
// IMPORTANT: This route must come before /:id
router.get("/stats", getApplicationStats);

// Create a new application
router.post("/", createApplication);

// Get one application
router.get("/:id", getApplicationById);

// Update one application
router.patch("/:id", updateApplication);

// Delete one application
router.delete("/:id", deleteApplication);

module.exports = router;