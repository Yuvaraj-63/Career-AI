import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  MoreVertical,
  X,
  LoaderCircle,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

// ============================================================
// STATUS MAPPING
// ============================================================
//
// Frontend terminology:
// Screening
// Selected
//
// Backend terminology:
// Under Review
// Offer
//
// This keeps your existing UI while sending the correct
// values to the backend.
// ============================================================

const frontendToBackendStatus = {
  Applied: "Applied",
  Screening: "Under Review",
  Interview: "Interview",
  Selected: "Offer",
  Rejected: "Rejected",
};

const backendToFrontendStatus = {
  Applied: "Applied",
  "Under Review": "Screening",
  Interview: "Interview",
  Offer: "Selected",
  Rejected: "Rejected",
};

// ============================================================
// FILTER STATUSES
// ============================================================

const statuses = [
  "All",
  "Applied",
  "Screening",
  "Interview",
  "Selected",
  "Rejected",
];

// ============================================================
// EMPTY FORM
// ============================================================

const emptyForm = {
  jobId: "",
  jobTitle: "",
  company: "",
  location: "",
  applicationUrl: "",
  matchScore: "",
  appliedDate: "",
  notes: "",
};

// ============================================================
// DATE FORMATTER
// ============================================================

const formatDate = (value) => {
  if (!value) {
    return "Not specified";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

// ============================================================
// APPLICATIONS PAGE
// ============================================================

function Applications() {
  const navigate = useNavigate();

  // ==========================================================
  // STATE
  // ==========================================================

  const [applications, setApplications] = useState([]);

  const [activeStatus, setActiveStatus] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [form, setForm] =
    useState(emptyForm);

  const [addingApplication, setAddingApplication] =
    useState(false);

  // ==========================================================
  // FETCH APPLICATIONS
  // ==========================================================

  const fetchApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/applications`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load applications."
        );
      }

      const receivedApplications =
        Array.isArray(data.data)
          ? data.data
          : [];

      setApplications(
        receivedApplications
      );
    } catch (err) {
      console.error(
        "Fetch applications error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to the CareerAI backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchApplications();
  }, []);

  // ==========================================================
  // FILTER APPLICATIONS
  // ==========================================================

  const filteredApplications =
    useMemo(() => {
      if (activeStatus === "All") {
        return applications;
      }

      return applications.filter(
        (application) => {
          const frontendStatus =
            backendToFrontendStatus[
              application.status
            ] ||
            application.status;

          return (
            frontendStatus ===
            activeStatus
          );
        }
      );
    }, [
      applications,
      activeStatus,
    ]);

  // ==========================================================
  // APPLICATION COUNTS
  // ==========================================================

  const counts = useMemo(() => {
    const result = {
      All: applications.length,
      Applied: 0,
      Screening: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0,
    };

    applications.forEach(
      (application) => {
        const frontendStatus =
          backendToFrontendStatus[
            application.status
          ] ||
          application.status;

        if (
          Object.prototype.hasOwnProperty.call(
            result,
            frontendStatus
          )
        ) {
          result[frontendStatus] += 1;
        }
      }
    );

    return result;
  }, [applications]);

  // ==========================================================
  // HANDLE FORM INPUT
  // ==========================================================

  const handleFormChange = (event) => {
    const { name, value } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ==========================================================
  // OPEN ADD FORM
  // ==========================================================

  const openAddForm = () => {
    setError("");
    setSuccessMessage("");

    setForm({
      ...emptyForm,
      appliedDate:
        new Date()
          .toISOString()
          .split("T")[0],
    });

    setShowAddForm(true);
  };

  // ==========================================================
  // CLOSE ADD FORM
  // ==========================================================

  const closeAddForm = () => {
    if (addingApplication) {
      return;
    }

    setShowAddForm(false);

    setForm(emptyForm);
  };

  // ==========================================================
  // ADD APPLICATION
  // ==========================================================

  const handleAddApplication = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const jobTitle =
      form.jobTitle.trim();

    const company =
      form.company.trim();

    if (!jobTitle) {
      setError(
        "Please enter the job title."
      );
      return;
    }

    if (!company) {
      setError(
        "Please enter the company name."
      );
      return;
    }

    setAddingApplication(true);

    try {
      const payload = {
        jobId:
          form.jobId.trim(),

        jobTitle,

        company,

        location:
          form.location.trim(),

        applicationUrl:
          form.applicationUrl.trim(),

        matchScore:
          form.matchScore === ""
            ? null
            : Number(form.matchScore),

        appliedDate:
          form.appliedDate
            ? new Date(
                `${form.appliedDate}T00:00:00`
              ).toISOString()
            : new Date().toISOString(),

        notes:
          form.notes.trim(),
      };

      const response = await fetch(
        `${API_URL}/applications`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to add application."
        );
      }

      if (data.data) {
        setApplications(
          (current) => [
            data.data,
            ...current,
          ]
        );
      }

      setSuccessMessage(
        "Application added successfully."
      );

      setShowAddForm(false);

      setForm(emptyForm);

      setActiveStatus("All");
    } catch (err) {
      console.error(
        "Add application error:",
        err
      );

      setError(
        err.message ||
          "Unable to add application."
      );
    } finally {
      setAddingApplication(false);
    }
  };

  // ==========================================================
  // UPDATE APPLICATION STATUS
  // ==========================================================

  const updateStatus = async (
    id,
    newFrontendStatus
  ) => {
    const newBackendStatus =
      frontendToBackendStatus[
        newFrontendStatus
      ];

    if (!newBackendStatus) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setUpdatingId(id);

    try {
      const response = await fetch(
        `${API_URL}/applications/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status:
              newBackendStatus,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to update application status."
        );
      }

      if (data.data) {
        setApplications(
          (current) =>
            current.map(
              (application) =>
                application.id === id
                  ? data.data
                  : application
            )
        );
      }

      setSuccessMessage(
        "Application status updated."
      );
    } catch (err) {
      console.error(
        "Update status error:",
        err
      );

      setError(
        err.message ||
          "Unable to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================================
  // DELETE APPLICATION
  // ==========================================================

  const deleteApplication = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this application?"
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setDeletingId(id);

    try {
      const response = await fetch(
        `${API_URL}/applications/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to delete application."
        );
      }

      setApplications(
        (current) =>
          current.filter(
            (application) =>
              application.id !== id
          )
      );

      setSuccessMessage(
        "Application deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete application error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete application."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================================
  // OPEN APPLICATION LINK
  // ==========================================================

  const openApplicationLink = (
    application
  ) => {
    const rawUrl =
      application.applicationUrl ||
      application.applyLink ||
      application.apply_link ||
      "";

    const url = String(
      rawUrl
    ).trim();

    if (!url) {
      setError(
        "Application link is not available for this application."
      );
      return;
    }

    const finalUrl =
      url.startsWith("http://") ||
      url.startsWith("https://")
        ? url
        : `https://${url}`;

    window.open(
      finalUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================================
  // CLEAR MESSAGES
  // ==========================================================

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="applications-page">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <header className="applications-header">

        <div>

          <button
            className="applications-back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <ArrowLeft size={18} />

            Back to Dashboard
          </button>

          <h1>
            Application Tracker
          </h1>

          <p>
            Keep track of every opportunity
            throughout your job search.
          </p>

        </div>

        <button
          className="add-application-button"
          onClick={openAddForm}
        >
          <Plus size={18} />

          Add Application
        </button>

      </header>

      {/* ======================================================
          MESSAGES
      ======================================================= */}

      {(error || successMessage) && (
        <div
          className={
            error
              ? "application-message application-message-error"
              : "application-message application-message-success"
          }
        >

          {error ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}

          <span>
            {error || successMessage}
          </span>

          <button
            onClick={clearMessages}
            aria-label="Close message"
          >
            <X size={16} />
          </button>

        </div>
      )}

      {/* ======================================================
          ADD APPLICATION MODAL
      ======================================================= */}

      {showAddForm && (
        <div
          className="application-modal-overlay"
          onClick={closeAddForm}
        >

          <div
            className="application-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="application-modal-header">

              <div>
                <span>
                  NEW APPLICATION
                </span>

                <h2>
                  Add Application
                </h2>

                <p>
                  Add a job you have applied
                  for and start tracking it.
                </p>
              </div>

              <button
                className="application-modal-close"
                onClick={closeAddForm}
                disabled={
                  addingApplication
                }
              >
                <X size={20} />
              </button>

            </div>

            <form
              className="application-form"
              onSubmit={
                handleAddApplication
              }
            >

              {/* JOB TITLE */}

              <div className="application-form-group">

                <label htmlFor="jobTitle">
                  Job Title *
                </label>

                <input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  placeholder="e.g. Software Engineer"
                  value={
                    form.jobTitle
                  }
                  onChange={
                    handleFormChange
                  }
                  required
                />

              </div>

              {/* COMPANY */}

              <div className="application-form-group">

                <label htmlFor="company">
                  Company *
                </label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="e.g. Amazon"
                  value={
                    form.company
                  }
                  onChange={
                    handleFormChange
                  }
                  required
                />

              </div>

              {/* LOCATION */}

              <div className="application-form-group">

                <label htmlFor="location">
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g. Chennai"
                  value={
                    form.location
                  }
                  onChange={
                    handleFormChange
                  }
                />

              </div>

              {/* APPLICATION URL */}

              <div className="application-form-group">

                <label htmlFor="applicationUrl">
                  Application URL
                </label>

                <input
                  id="applicationUrl"
                  name="applicationUrl"
                  type="url"
                  placeholder="https://company.com/jobs/..."
                  value={
                    form.applicationUrl
                  }
                  onChange={
                    handleFormChange
                  }
                />

              </div>

              {/* MATCH SCORE */}

              <div className="application-form-group">

                <label htmlFor="matchScore">
                  Resume Match Score
                </label>

                <input
                  id="matchScore"
                  name="matchScore"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 85"
                  value={
                    form.matchScore
                  }
                  onChange={
                    handleFormChange
                  }
                />

              </div>

              {/* APPLIED DATE */}

              <div className="application-form-group">

                <label htmlFor="appliedDate">
                  Applied Date
                </label>

                <input
                  id="appliedDate"
                  name="appliedDate"
                  type="date"
                  value={
                    form.appliedDate
                  }
                  onChange={
                    handleFormChange
                  }
                />

              </div>

              {/* NOTES */}

              <div className="application-form-group application-form-full">

                <label htmlFor="notes">
                  Notes
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  placeholder="Add notes about this application..."
                  value={
                    form.notes
                  }
                  onChange={
                    handleFormChange
                  }
                />

              </div>

              {/* FORM ACTIONS */}

              <div className="application-form-actions">

                <button
                  type="button"
                  className="application-cancel-button"
                  onClick={
                    closeAddForm
                  }
                  disabled={
                    addingApplication
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="application-submit-button"
                  disabled={
                    addingApplication
                  }
                >

                  {addingApplication ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="application-spinner"
                      />

                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />

                      Add Application
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ======================================================
          MAIN CONTENT
      ======================================================= */}

      <main className="applications-content">

        {/* ====================================================
            OVERVIEW CARDS
        ===================================================== */}

        <section className="application-stats">

          <div className="application-stat-card">

            <span>
              Total Applications
            </span>

            <strong>
              {counts.All}
            </strong>

          </div>

          <div className="application-stat-card">

            <span>
              In Progress
            </span>

            <strong>
              {
                counts.Applied +
                counts.Screening +
                counts.Interview
              }
            </strong>

          </div>

          <div className="application-stat-card">

            <span>
              Interviews
            </span>

            <strong>
              {counts.Interview}
            </strong>

          </div>

          <div className="application-stat-card">

            <span>
              Selected
            </span>

            <strong>
              {counts.Selected}
            </strong>

          </div>

        </section>

        {/* ====================================================
            FILTERS
        ===================================================== */}

        <section className="application-filter-card">

          <div>

            <h2>
              Your Applications
            </h2>

            <p>
              Track and update your
              application progress.
            </p>

          </div>

          <div className="application-tabs">

            {statuses.map(
              (status) => (
                <button
                  key={status}
                  className={
                    activeStatus ===
                    status
                      ? "application-tab active"
                      : "application-tab"
                  }
                  onClick={() =>
                    setActiveStatus(
                      status
                    )
                  }
                >
                  {status}

                  <span>
                    {counts[status]}
                  </span>

                </button>
              )
            )}

          </div>

        </section>

        {/* ====================================================
            APPLICATIONS
        ===================================================== */}

        <section className="applications-list">

          {/* LOADING */}

          {loading ? (
            <div className="applications-empty">

              <LoaderCircle
                size={32}
                className="application-spinner"
              />

              <h3>
                Loading applications...
              </h3>

              <p>
                Fetching your application
                tracker data.
              </p>

            </div>
          ) : filteredApplications.length ===
            0 ? (

            /* EMPTY STATE */

            <div className="applications-empty">

              <BriefcaseBusiness
                size={32}
              />

              <h3>
                {applications.length ===
                0
                  ? "No applications yet"
                  : "No applications found"}
              </h3>

              <p>
                {applications.length ===
                0
                  ? "Start tracking your job applications by adding your first application."
                  : "There are no applications in this category yet."}
              </p>

              {applications.length ===
                0 && (
                <button
                  className="add-application-button"
                  onClick={
                    openAddForm
                  }
                >
                  <Plus size={18} />

                  Add Application
                </button>
              )}

            </div>

          ) : (

            /* APPLICATION CARDS */

            filteredApplications.map(
              (application) => {

                const frontendStatus =
                  backendToFrontendStatus[
                    application.status
                  ] ||
                  application.status ||
                  "Applied";

                const isUpdating =
                  updatingId ===
                  application.id;

                const isDeleting =
                  deletingId ===
                  application.id;

                return (
                  <article
                    className="application-card"
                    key={
                      application.id
                    }
                  >

                    {/* COMPANY LOGO */}

                    <div className="application-company-logo">

                      {(
                        application.company ||
                        "C"
                      )
                        .charAt(0)
                        .toUpperCase()}

                    </div>

                    {/* MAIN INFO */}

                    <div className="application-main">

                      <div className="application-title">

                        <h3>
                          {
                            application.jobTitle ||
                            application.role ||
                            "Untitled Position"
                          }
                        </h3>

                        <p>
                          {
                            application.company ||
                            "Company"
                          }
                        </p>

                      </div>

                      <div className="application-meta">

                        <span>

                          <BriefcaseBusiness
                            size={14}
                          />

                          {
                            application.location ||
                            "Location not specified"
                          }

                        </span>

                        <span>

                          <CalendarDays
                            size={14}
                          />

                          Applied{" "}
                          {formatDate(
                            application.appliedDate
                          )}

                        </span>

                        {typeof application.matchScore ===
                          "number" && (
                          <span>
                            <CheckCircle2
                              size={14}
                            />

                            {
                              application.matchScore
                            }
                            % Match
                          </span>
                        )}

                      </div>

                    </div>

                    {/* STATUS */}

                    <div className="application-status-area">

                      {isUpdating ? (
                        <div className="application-status-loading">

                          <LoaderCircle
                            size={16}
                            className="application-spinner"
                          />

                          Updating...

                        </div>
                      ) : (
                        <select
                          value={
                            frontendStatus
                          }
                          onChange={(
                            event
                          ) =>
                            updateStatus(
                              application.id,
                              event.target
                                .value
                            )
                          }
                          className={`application-status-select status-${frontendStatus
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )}`}
                        >

                          <option value="Applied">
                            Applied
                          </option>

                          <option value="Screening">
                            Screening
                          </option>

                          <option value="Interview">
                            Interview
                          </option>

                          <option value="Selected">
                            Selected
                          </option>

                          <option value="Rejected">
                            Rejected
                          </option>

                        </select>
                      )}

                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="application-actions">

                      {(
                        application.applicationUrl ||
                        application.applyLink ||
                        application.apply_link
                      ) && (
                        <button
                          className="application-more-button"
                          title="Open application"
                          onClick={() =>
                            openApplicationLink(
                              application
                            )
                          }
                        >
                          <ExternalLink
                            size={17}
                          />
                        </button>
                      )}

                      <button
                        className="application-more-button"
                        title="Application details"
                        onClick={() => {
                          if (
                            application.notes
                          ) {
                            alert(
                              `Notes:\n\n${application.notes}`
                            );
                          } else {
                            alert(
                              `${application.jobTitle || application.role} at ${application.company}`
                            );
                          }
                        }}
                      >
                        <MoreVertical
                          size={18}
                        />
                      </button>

                      <button
                        className="application-more-button application-delete-button"
                        title="Delete application"
                        onClick={() =>
                          deleteApplication(
                            application.id
                          )
                        }
                        disabled={
                          isDeleting
                        }
                      >

                        {isDeleting ? (
                          <LoaderCircle
                            size={17}
                            className="application-spinner"
                          />
                        ) : (
                          <Trash2
                            size={17}
                          />
                        )}

                      </button>

                    </div>

                  </article>
                );
              }
            )
          )}

        </section>

        {/* ====================================================
            TIP
        ===================================================== */}

        <section className="application-tip">

          <div className="application-tip-icon">

            <BriefcaseBusiness
              size={20}
            />

          </div>

          <div>

            <h3>
              Stay organized
            </h3>

            <p>
              Update your application
              status after every major
              step. This helps CareerAI
              understand your
              job-search progress.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Applications;