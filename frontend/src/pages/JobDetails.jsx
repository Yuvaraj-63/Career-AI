import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  ExternalLink,
  LoaderCircle,
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";

import "./JobDetails.css";

const API_URL =
  "http://localhost:5000/api";

function JobDetails() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
  ==================================================
  FETCH JOB DETAILS
  ==================================================
  */

  useEffect(() => {
    const fetchJob =
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await fetch(
              `${API_URL}/jobs/${encodeURIComponent(
                id
              )}`
            );

          const data =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Unable to load this job."
            );
          }

          setJob(
            data.data
          );
        } catch (err) {
          console.error(
            "Job details error:",
            err
          );

          setError(
            err.message ||
              "Unable to load this job."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchJob();
  }, [id]);

  /*
  ==================================================
  APPLY
  ==================================================
  */

  const handleApply =
    () => {
      if (
        !job?.applicationUrl
      ) {
        return;
      }

      window.open(
        job.applicationUrl,
        "_blank",
        "noopener,noreferrer"
      );
    };

  /*
  ==================================================
  DATE
  ==================================================
  */

  const formatDate =
    (date) => {
      if (!date) {
        return "";
      }

      const parsed =
        new Date(date);

      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {
        return "";
      }

      return parsed.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    };

  /*
  ==================================================
  LOADING
  ==================================================
  */

  if (loading) {
    return (
      <div className="job-details-page">

        <div className="job-details-loading">

          <LoaderCircle
            size={36}
            className="job-details-spinner"
          />

          <h2>
            Loading job...
          </h2>

          <p>
            Fetching the latest
            job information.
          </p>

        </div>

      </div>
    );
  }

  /*
  ==================================================
  ERROR
  ==================================================
  */

  if (
    error ||
    !job
  ) {
    return (
      <div className="job-details-page">

        <div className="job-details-error">

          <AlertCircle
            size={34}
          />

          <h2>
            Job unavailable
          </h2>

          <p>
            {error ||
              "This job may have expired or been removed from the live job feed."}
          </p>

          <button
            onClick={() =>
              navigate(
                "/jobs"
              )
            }
          >
            Back to Jobs
          </button>

        </div>

      </div>
    );
  }

  /*
  ==================================================
  MAIN
  ==================================================
  */

  return (
    <div className="job-details-page">

      {/* HEADER */}

      <header className="job-details-header">

        <button
          className="job-details-back"
          onClick={() =>
            navigate(
              "/jobs"
            )
          }
        >
          <ArrowLeft
            size={18}
          />

          Back to Jobs
        </button>

      </header>

      <main className="job-details-container">

        {/* HERO */}

        <section className="job-details-hero">

          <div className="job-details-company-icon">

            {job.company
              ?.charAt(0)
              ?.toUpperCase() ||
              "C"}

          </div>

          <div className="job-details-title">

            <h1>
              {job.title}
            </h1>

            <h2>

              <Building2
                size={18}
              />

              {job.company}

            </h2>

            <div className="job-details-meta">

              <span>

                <MapPin
                  size={16}
                />

                {job.location}

              </span>

              <span>

                <BriefcaseBusiness
                  size={16}
                />

                {job.type}

              </span>

              <span>

                <Clock3
                  size={16}
                />

                {job.experience}

              </span>

            </div>

          </div>

          <button
            className="job-details-apply"
            onClick={
              handleApply
            }
            disabled={
              !job.applicationUrl
            }
          >

            Apply Now

            <ExternalLink
              size={17}
            />

          </button>

        </section>

        {/* CONTENT */}

        <div className="job-details-grid">

          {/* MAIN */}

          <section className="job-details-main">

            {/* DESCRIPTION */}

            <div className="job-details-section">

              <h2>
                Job Description
              </h2>

              <p>
                {job.description ||
                  "No description available."}
              </p>

            </div>

            {/* RESPONSIBILITIES */}

            {job.responsibilities && (
              <div className="job-details-section">

                <h2>
                  Responsibilities
                </h2>

                <p>
                  {
                    job.responsibilities
                  }
                </p>

              </div>
            )}

            {/* EDUCATION */}

            {job.educationAndSkills && (
              <div className="job-details-section">

                <h2>
                  Education & Skills
                </h2>

                <p>
                  {
                    job.educationAndSkills
                  }
                </p>

              </div>
            )}

            {/* ABOUT COMPANY */}

            {job.aboutCompany && (
              <div className="job-details-section">

                <h2>
                  About the Company
                </h2>

                <p>
                  {
                    job.aboutCompany
                  }
                </p>

              </div>
            )}

            {/* SKILLS */}

            {job.skills?.length >
              0 && (
              <div className="job-details-section">

                <h2>
                  Skills
                </h2>

                <div className="job-details-skills">

                  {job.skills.map(
                    (
                      skill,
                      index
                    ) => (

                      <span
                        key={`${skill}-${index}`}
                      >

                        <CheckCircle2
                          size={14}
                        />

                        {skill}

                      </span>

                    )
                  )}

                </div>

              </div>
            )}

          </section>

          {/* SIDEBAR */}

          <aside className="job-details-sidebar">

            <div className="job-details-side-card">

              <h3>
                Job Information
              </h3>

              <div>

                <span>

                  <Building2
                    size={16}
                  />

                  Company

                </span>

                <strong>
                  {job.company}
                </strong>

              </div>

              <div>

                <span>

                  <MapPin
                    size={16}
                  />

                  Location

                </span>

                <strong>
                  {job.location}
                </strong>

              </div>

              <div>

                <span>

                  <BriefcaseBusiness
                    size={16}
                  />

                  Job Type

                </span>

                <strong>
                  {job.type}
                </strong>

              </div>

              <div>

                <span>

                  <Clock3
                    size={16}
                  />

                  Experience

                </span>

                <strong>
                  {job.experience}
                </strong>

              </div>

              {job.salary && (
                <div>

                  <span>

                    <IndianRupee
                      size={16}
                    />

                    Salary

                  </span>

                  <strong>
                    {job.salary}
                  </strong>

                </div>
              )}

              {job.postedDate && (
                <div>

                  <span>

                    <CalendarDays
                      size={16}
                    />

                    Posted

                  </span>

                  <strong>
                    {formatDate(
                      job.postedDate
                    )}
                  </strong>

                </div>
              )}

              {job.deadline && (
                <div>

                  <span>

                    <CalendarDays
                      size={16}
                    />

                    Deadline

                  </span>

                  <strong>
                    {formatDate(
                      job.deadline
                    )}
                  </strong>

                </div>
              )}

            </div>

            {/* SOURCE */}

            <div className="job-details-source-card">

              <span>
                Live listing
              </span>

              <strong>
                {job.source ||
                  "Live Job Provider"}
              </strong>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default JobDetails;