const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  uploadResume,
  getResume,
  deleteResume,
} = require("../controllers/resumeController");

const {
  analyzeResume,
} = require("../controllers/resumeAnalysisController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Normal Resume Upload
|--------------------------------------------------------------------------
*/

const upload = multer({
  dest: path.join(
    __dirname,
    "../uploads"
  ),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const extension =
      path
        .extname(file.originalname)
        .toLowerCase();

    const allowed = [
      ".pdf",
      ".docx",
    ];

    if (allowed.includes(extension)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF and DOCX files are allowed."
        )
      );
    }
  },
});

/*
|--------------------------------------------------------------------------
| Analysis Upload
|--------------------------------------------------------------------------
|
| memoryStorage is important here because the analysis controller
| reads req.file.buffer.
|
|--------------------------------------------------------------------------
*/

const analysisUpload =
  multer({
    storage: multer.memoryStorage(),

    limits: {
      fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
      const extension =
        path
          .extname(file.originalname)
          .toLowerCase();

      const allowed = [
        ".pdf",
        ".docx",
      ];

      if (allowed.includes(extension)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Only PDF and DOCX files are allowed."
          )
        );
      }
    },
  });

/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

/*
 * Analyze resume + optional job description
 */
router.post(
  "/analyze",
  analysisUpload.single("resume"),
  analyzeResume
);

/*
 * Existing resume upload
 */
router.post(
  "/upload",
  upload.single("resume"),
  uploadResume
);

/*
 * Get stored resume
 */
router.get(
  "/",
  getResume
);

/*
 * Delete stored resume
 */
router.delete(
  "/",
  deleteResume
);

module.exports = router;