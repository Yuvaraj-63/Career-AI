// ============================================================
// CareerAI - Application Controller
// ============================================================

const applications = [];

// ============================================================
// CONSTANTS
// ============================================================

const VALID_STATUSES = [
  "Applied",
  "Under Review",
  "Interview",
  "Offer",
  "Rejected",
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const generateApplicationId = () => {
  return `application-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}`;
};

const normalizeString = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
};

const normalizeStatus = (status) => {
  const value = normalizeString(status);

  if (!value) {
    return "Applied";
  }

  const matchedStatus = VALID_STATUSES.find(
    (item) => item.toLowerCase() === value.toLowerCase()
  );

  return matchedStatus || null;
};

const normalizeMatchScore = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(number)));
};

const createApplicationObject = (data) => {
  const now = new Date().toISOString();

  return {
    id: generateApplicationId(),

    jobId: normalizeString(
      data.jobId ||
        data.job_id ||
        data.jobID
    ),

    jobTitle: normalizeString(
      data.jobTitle ||
        data.title ||
        data.role
    ),

    company: normalizeString(
      data.company ||
        data.companyName
    ),

    location: normalizeString(
      data.location
    ),

    applicationUrl: normalizeString(
      data.applicationUrl ||
        data.applyLink ||
        data.apply_link ||
        data.applyUrl ||
        data.apply_url
    ),

    matchScore: normalizeMatchScore(
      data.matchScore
    ),

    status: "Applied",

    appliedDate:
      normalizeString(
        data.appliedDate ||
          data.applied_date
      ) || now,

    notes: normalizeString(
      data.notes
    ),

    createdAt: now,

    updatedAt: now,
  };
};

// ============================================================
// CREATE APPLICATION
// POST /api/applications
// ============================================================

const createApplication = (req, res) => {
  try {
    const body = req.body || {};

    const jobTitle = normalizeString(
      body.jobTitle ||
        body.title ||
        body.role
    );

    const company = normalizeString(
      body.company ||
        body.companyName
    );

    // --------------------------------------------------------
    // REQUIRED FIELDS
    // --------------------------------------------------------

    if (!jobTitle) {
      return res.status(400).json({
        success: false,
        message: "Job title is required.",
      });
    }

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company name is required.",
      });
    }

    // --------------------------------------------------------
    // PREVENT DUPLICATE APPLICATIONS
    // --------------------------------------------------------

    const jobId = normalizeString(
      body.jobId ||
        body.job_id ||
        body.jobID
    );

    const existingApplication = applications.find(
      (application) =>
        jobId &&
        application.jobId === jobId
    );

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already added this job to your applications.",
        data: existingApplication,
      });
    }

    // --------------------------------------------------------
    // CREATE APPLICATION
    // --------------------------------------------------------

    const application = createApplicationObject({
      ...body,
      jobTitle,
      company,
    });

    applications.unshift(application);

    return res.status(201).json({
      success: true,
      message: "Application added successfully.",
      data: application,
    });
  } catch (error) {
    console.error(
      "Create application error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create application.",
    });
  }
};

// ============================================================
// GET ALL APPLICATIONS
// GET /api/applications
// ============================================================

const getApplications = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error(
      "Get applications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load applications.",
    });
  }
};

// ============================================================
// GET APPLICATION BY ID
// GET /api/applications/:id
// ============================================================

const getApplicationById = (req, res) => {
  try {
    const { id } = req.params;

    const application = applications.find(
      (item) => item.id === id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error(
      "Get application error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load application.",
    });
  }
};

// ============================================================
// UPDATE APPLICATION
// PATCH /api/applications/:id
// ============================================================

const updateApplication = (req, res) => {
  try {
    const { id } = req.params;

    const applicationIndex = applications.findIndex(
      (item) => item.id === id
    );

    if (applicationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const body = req.body || {};

    const application =
      applications[applicationIndex];

    // --------------------------------------------------------
    // UPDATE JOB TITLE
    // --------------------------------------------------------

    if (
      body.jobTitle !== undefined ||
      body.title !== undefined ||
      body.role !== undefined
    ) {
      const jobTitle = normalizeString(
        body.jobTitle ||
          body.title ||
          body.role
      );

      if (!jobTitle) {
        return res.status(400).json({
          success: false,
          message: "Job title cannot be empty.",
        });
      }

      application.jobTitle = jobTitle;
    }

    // --------------------------------------------------------
    // UPDATE COMPANY
    // --------------------------------------------------------

    if (
      body.company !== undefined ||
      body.companyName !== undefined
    ) {
      const company = normalizeString(
        body.company ||
          body.companyName
      );

      if (!company) {
        return res.status(400).json({
          success: false,
          message: "Company name cannot be empty.",
        });
      }

      application.company = company;
    }

    // --------------------------------------------------------
    // UPDATE LOCATION
    // --------------------------------------------------------

    if (body.location !== undefined) {
      application.location =
        normalizeString(body.location);
    }

    // --------------------------------------------------------
    // UPDATE APPLICATION URL
    // --------------------------------------------------------

    if (
      body.applicationUrl !== undefined ||
      body.applyLink !== undefined ||
      body.apply_link !== undefined ||
      body.applyUrl !== undefined ||
      body.apply_url !== undefined
    ) {
      application.applicationUrl =
        normalizeString(
          body.applicationUrl ||
            body.applyLink ||
            body.apply_link ||
            body.applyUrl ||
            body.apply_url
        );
    }

    // --------------------------------------------------------
    // UPDATE MATCH SCORE
    // --------------------------------------------------------

    if (body.matchScore !== undefined) {
      application.matchScore =
        normalizeMatchScore(
          body.matchScore
        );
    }

    // --------------------------------------------------------
    // UPDATE STATUS
    // --------------------------------------------------------

    if (body.status !== undefined) {
      const status = normalizeStatus(
        body.status
      );

      if (!status) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status. Valid statuses are: Applied, Under Review, Interview, Offer, Rejected.",
        });
      }

      application.status = status;
    }

    // --------------------------------------------------------
    // UPDATE APPLIED DATE
    // --------------------------------------------------------

    if (
      body.appliedDate !== undefined ||
      body.applied_date !== undefined
    ) {
      const appliedDate =
        normalizeString(
          body.appliedDate ||
            body.applied_date
        );

      if (appliedDate) {
        application.appliedDate =
          appliedDate;
      }
    }

    // --------------------------------------------------------
    // UPDATE NOTES
    // --------------------------------------------------------

    if (body.notes !== undefined) {
      application.notes =
        normalizeString(body.notes);
    }

    application.updatedAt =
      new Date().toISOString();

    applications[applicationIndex] =
      application;

    return res.status(200).json({
      success: true,
      message:
        "Application updated successfully.",
      data: application,
    });
  } catch (error) {
    console.error(
      "Update application error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update application.",
    });
  }
};

// ============================================================
// DELETE APPLICATION
// DELETE /api/applications/:id
// ============================================================

const deleteApplication = (req, res) => {
  try {
    const { id } = req.params;

    const applicationIndex =
      applications.findIndex(
        (item) => item.id === id
      );

    if (applicationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const deletedApplication =
      applications.splice(
        applicationIndex,
        1
      )[0];

    return res.status(200).json({
      success: true,
      message:
        "Application deleted successfully.",
      data: deletedApplication,
    });
  } catch (error) {
    console.error(
      "Delete application error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete application.",
    });
  }
};

// ============================================================
// GET APPLICATION STATISTICS
// GET /api/applications/stats
// ============================================================

const getApplicationStats = (req, res) => {
  try {
    const stats = {
      total: applications.length,
      applied: 0,
      underReview: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };

    applications.forEach(
      (application) => {
        switch (application.status) {
          case "Applied":
            stats.applied += 1;
            break;

          case "Under Review":
            stats.underReview += 1;
            break;

          case "Interview":
            stats.interview += 1;
            break;

          case "Offer":
            stats.offer += 1;
            break;

          case "Rejected":
            stats.rejected += 1;
            break;

          default:
            break;
        }
      }
    );

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(
      "Get application stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load application statistics.",
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationStats,
};