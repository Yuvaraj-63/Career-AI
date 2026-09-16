const express = require("express");

const {
  getJobs,
  getJobById,
  toggleSaveJob,
  getSavedJobs,
  closeJobApplication,
} = require("../controllers/jobController");

const router =
  express.Router();

/*
==================================================
LIVE JOBS
==================================================
*/

router.get(
  "/",
  getJobs
);

/*
==================================================
SAVED JOBS

IMPORTANT:
This must come before /:id
==================================================
*/

router.get(
  "/saved",
  getSavedJobs
);

/*
==================================================
SINGLE JOB
==================================================
*/

router.get(
  "/:id",
  getJobById
);

/*
==================================================
SAVE / UNSAVE
==================================================
*/

router.patch(
  "/:id/save",
  toggleSaveJob
);

/*
==================================================
CLOSE JOB REGISTRATION & REMOVE FROM MODULE
==================================================
*/

router.post(
  "/:id/close",
  closeJobApplication
);

module.exports =
  router;