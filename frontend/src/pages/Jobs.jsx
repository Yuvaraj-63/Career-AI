import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Search,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  SlidersHorizontal,
  X,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronRight,
} from "lucide-react";

import "./Jobs.css";

const API_URL = "http://localhost:5000/api";

/* =====================================================
   SKILL ALIASES
===================================================== */

const SKILL_ALIASES = {
  javascript: "JavaScript",
  js: "JavaScript",

  typescript: "TypeScript",
  ts: "TypeScript",

  react: "React",
  "react.js": "React",

  node: "Node.js",
  "node.js": "Node.js",

  express: "Express.js",
  "express.js": "Express.js",

  "spring boot": "Spring Boot",

  java: "Java",
  python: "Python",

  sql: "SQL",
  mysql: "MySQL",
  postgresql: "PostgreSQL",

  mongodb: "MongoDB",

  firebase: "Firebase",

  html: "HTML",
  css: "CSS",

  tailwind: "Tailwind CSS",

  git: "Git",
  github: "GitHub",

  docker: "Docker",

  aws: "AWS",
  azure: "Azure",

  "rest api": "REST API",
  api: "API",

  "c++": "C++",
  "c#": "C#",
  c: "C",

  "machine learning": "Machine Learning",
  tensorflow: "TensorFlow",

  pandas: "Pandas",
  numpy: "NumPy",

  "data structures": "Data Structures",
  algorithms: "Algorithms",

  figma: "Figma",

  angular: "Angular",
  vue: "Vue",
  "next.js": "Next.js",
  nextjs: "Next.js",

  django: "Django",
  flask: "Flask",
  fastapi: "FastAPI",

  graphql: "GraphQL",
  redis: "Redis",

  kubernetes: "Kubernetes",
  linux: "Linux",

  jenkins: "Jenkins",
  terraform: "Terraform",

  "power bi": "Power BI",
  tableau: "Tableau",
};


/* =====================================================
   ALL SKILLS
===================================================== */

const SKILL_PATTERNS = Object.keys(SKILL_ALIASES).sort(
  (a, b) => b.length - a.length
);


/* =====================================================
   NORMALIZE SKILL
===================================================== */

function normalizeSkill(skill) {
  if (!skill) return "";

  const cleaned = String(skill)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  return (
    SKILL_ALIASES[cleaned] ||
    String(skill).trim()
  );
}


/* =====================================================
   EXTRACT SKILLS FROM TEXT
===================================================== */

function extractSkillsFromText(text = "") {
  const lowerText = String(text).toLowerCase();

  const found = [];

  for (const pattern of SKILL_PATTERNS) {
    let regex;

    /*
     * Short skills such as C need special handling.
     */
    if (pattern === "c") {
      regex = /(?:^|[\s,.;:()[\]{}\/+\-])c(?:$|[\s,.;:()[\]{}\/+\-])/i;
    } else {
      regex = new RegExp(
        `(^|[^a-z0-9+#.])${pattern.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}($|[^a-z0-9+#.])`,
        "i"
      );
    }

    if (regex.test(lowerText)) {
      found.push(SKILL_ALIASES[pattern]);
    }
  }

  return [...new Set(found)];
}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(dateValue) {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


/* =====================================================
   CALCULATE JOB MATCH
===================================================== */

function calculateMatch(resumeSkills, jobSkills) {
  const resumeSet = new Set(
    resumeSkills.map(normalizeSkill).map((skill) =>
      skill.toLowerCase()
    )
  );

  const required = [
    ...new Set(
      jobSkills
        .map(normalizeSkill)
        .filter(Boolean)
        .map((skill) => skill.toLowerCase())
    ),
  ];

  if (
    resumeSet.size === 0 ||
    required.length === 0
  ) {
    return {
      score: null,
      matched: [],
      missing: required.map(
        (skill) =>
          skill.charAt(0).toUpperCase() +
          skill.slice(1)
      ),
    };
  }

  const matched = required.filter((skill) =>
    resumeSet.has(skill)
  );

  const missing = required.filter(
    (skill) => !resumeSet.has(skill)
  );

  const score = Math.round(
    (matched.length / required.length) * 100
  );

  return {
    score,
    matched,
    missing,
  };
}


/* =====================================================
   JOB COMPONENT
===================================================== */

function Jobs() {
  const navigate = useNavigate();

  /* ===================================================
     STATE
  =================================================== */

  const [jobs, setJobs] = useState([]);

  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [resumeLoading, setResumeLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");

  const [showFilters, setShowFilters] =
    useState(false);

  const [filters, setFilters] = useState({
    jobType: "All",
    experience: "All",
    savedOnly: false,
  });


  /* ===================================================
     FETCH JOBS
  =================================================== */

  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/jobs?limit=50`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load live jobs."
        );
      }

      const receivedJobs = Array.isArray(
        data.data
      )
        ? data.data
        : [];

      setJobs(receivedJobs);

    } catch (err) {
      console.error(
        "Fetch jobs error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to the CareerAI job service."
      );

    } finally {
      setLoading(false);
    }
  };


  /* ===================================================
     FETCH RESUME
  =================================================== */

  const fetchResume = async () => {
    setResumeLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/resume`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load resume."
        );
      }

      if (
        data.success &&
        data.data
      ) {
        setResume(data.data);
      } else {
        setResume(null);
      }

    } catch (err) {
      /*
       * Resume is optional.
       * We don't show an error because
       * users can browse jobs without a resume.
       */
      console.log(
        "No resume available yet."
      );

      setResume(null);

    } finally {
      setResumeLoading(false);
    }
  };


  /* ===================================================
     INITIAL LOAD
  =================================================== */

  useEffect(() => {
    fetchJobs();
    fetchResume();
  }, []);


  /* ===================================================
     RESUME SKILLS
  =================================================== */

  const resumeSkills = useMemo(() => {
    if (!resume) {
      return [];
    }

    const skills = Array.isArray(
      resume.skills
    )
      ? resume.skills
      : Array.isArray(
          resume.detectedSkills
        )
      ? resume.detectedSkills
      : [];

    return [
      ...new Set(
        skills
          .map(normalizeSkill)
          .filter(Boolean)
      ),
    ];
  }, [resume]);


  /* ===================================================
     NORMALIZE JOBS + MATCH
  =================================================== */

  const normalizedJobs = useMemo(() => {
    return jobs.map((job) => {

      const title =
        job.title ||
        job.job_title ||
        job.role ||
        "Untitled Position";

      const company =
        job.company ||
        job.companyName ||
        "Company";

      const location =
        job.location ||
        job.city ||
        "Location not specified";

      const type =
        job.type ||
        job.job_type ||
        job.jobType ||
        "Full-time";

      const experience =
        job.experience ||
        job.experienceLevel ||
        "Not specified";

      const salary =
        job.salary ||
        job.salaryRange ||
        "";

      const description =
        job.description ||
        job.job_description ||
        "No description available.";

      const responsibilities =
        job.responsibilities ||
        job.role_and_responsibility ||
        "";

      const educationAndSkills =
        job.educationAndSkills ||
        job.education_and_skills ||
        "";

      const aboutCompany =
        job.aboutCompany ||
        job.about_company ||
        "";

      const applicationUrl =
        job.applicationUrl ||
        job.applyLink ||
        job.apply_link ||
        job.applyUrl ||
        job.apply_url ||
        "";

      const postedDate =
        job.postedDate ||
        job.posted_date ||
        "";

      const deadline =
        job.deadline ||
        "";

      /*
       * Combine all useful job text.
       * This lets us detect skills even when
       * the provider's skills array is incomplete.
       */
      const combinedText = [
        title,
        description,
        responsibilities,
        educationAndSkills,
      ].join(" ");


      const providerSkills =
        Array.isArray(job.skills)
          ? job.skills
          : [];

      const extractedSkills =
        extractSkillsFromText(
          combinedText
        );

      const allJobSkills = [
        ...new Set([
          ...providerSkills,
          ...extractedSkills,
        ]),
      ]
        .map(normalizeSkill)
        .filter(Boolean);


      const match = calculateMatch(
        resumeSkills,
        allJobSkills
      );


      return {
        ...job,

        id:
          job.id ||
          job._id ||
          job.jobId,

        title,

        company,

        location,

        type,

        experience,

        salary,

        description,

        responsibilities,

        educationAndSkills,

        aboutCompany,

        applicationUrl,

        postedDate,

        deadline,

        skills: allJobSkills,

        matchScore: match.score,

        matchedSkills: match.matched,

        missingSkills: match.missing,

        saved: Boolean(job.saved),
      };
    });
  }, [jobs, resumeSkills]);


  /* ===================================================
     FILTER + SORT
  =================================================== */

  const filteredJobs = useMemo(() => {

    const search =
      searchTerm
        .trim()
        .toLowerCase();

    const location =
      locationTerm
        .trim()
        .toLowerCase();


    const result =
      normalizedJobs.filter((job) => {

        /* Search */

        const searchableText = [
          job.title,
          job.company,
          job.location,
          ...job.skills,
        ]
          .join(" ")
          .toLowerCase();


        const matchesSearch =
          !search ||
          searchableText.includes(search);


        /* Location */

        const matchesLocation =
          !location ||
          job.location
            .toLowerCase()
            .includes(location);


        /* Job type */

        const matchesJobType =
          filters.jobType === "All" ||
          job.type
            .toLowerCase()
            .includes(
              filters.jobType.toLowerCase()
            );


        /* Experience */

        const matchesExperience =
          filters.experience === "All" ||
          job.experience
            .toLowerCase()
            .includes(
              filters.experience.toLowerCase()
            );


        /* Saved */

        const matchesSaved =
          !filters.savedOnly ||
          job.saved;

        /* Closed Application Registration check (automatically removed) */
        const isClosed =
          job.isClosed === true ||
          job.status === "closed" ||
          job.status === "expired" ||
          (job.deadline &&
            !isNaN(new Date(job.deadline).getTime()) &&
            new Date(job.deadline).getTime() < Date.now());

        return (
          !isClosed &&
          matchesSearch &&
          matchesLocation &&
          matchesJobType &&
          matchesExperience &&
          matchesSaved
        );
      });


    /*
     * When resume exists, put jobs with
     * higher match scores first.
     */
    if (resumeSkills.length > 0) {

      result.sort((a, b) => {

        const scoreA =
          a.matchScore ?? -1;

        const scoreB =
          b.matchScore ?? -1;

        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }

        return (
          new Date(
            b.postedDate || 0
          ) -
          new Date(
            a.postedDate || 0
          )
        );
      });

    } else {

      /*
       * Without a resume, newest jobs first.
       */
      result.sort((a, b) => {

        return (
          new Date(
            b.postedDate || 0
          ) -
          new Date(
            a.postedDate || 0
          )
        );
      });
    }


    return result;

  }, [
    normalizedJobs,
    searchTerm,
    locationTerm,
    filters,
    resumeSkills,
  ]);


  /* ===================================================
     BEST MATCH
  =================================================== */

  const bestMatch = useMemo(() => {

    const scores =
      normalizedJobs
        .map((job) => job.matchScore)
        .filter(
          (score) =>
            typeof score === "number"
        );

    if (scores.length === 0) {
      return null;
    }

    return Math.max(...scores);

  }, [normalizedJobs]);


  /* ===================================================
     SAVE / UNSAVE
  =================================================== */

  const handleToggleSave = async (
    jobId
  ) => {

    if (!jobId) return;

    try {

      const response = await fetch(
        `${API_URL}/jobs/${jobId}/save`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to update saved job."
        );
      }


      const saved =
        typeof data.data?.saved ===
        "boolean"
          ? data.data.saved
          : false;


      setJobs((currentJobs) =>
        currentJobs.map((job) => {

          const currentId =
            job.id ||
            job._id ||
            job.jobId;


          if (
            String(currentId) !==
            String(jobId)
          ) {
            return job;
          }


          return {
            ...job,
            saved,
          };
        })
      );

    } catch (err) {

      console.error(
        "Save job error:",
        err
      );

      setError(
        err.message ||
          "Unable to save this job."
      );
    }
  };


  /* ===================================================
     APPLY
  =================================================== */

 // ==========================================
// APPLY + ADD TO APPLICATION TRACKER
// ==========================================

const handleApply = async (job) => {
  try {
    setError("");

    const applicationUrl =
      job.applicationUrl ||
      job.applyLink ||
      job.apply_link ||
      job.applyUrl ||
      job.apply_url ||
      "";

    if (!applicationUrl) {
      setError(
        "Application link is not available for this job."
      );
      return;
    }

    /*
     * First create the application in CareerAI.
     */
    const response = await fetch(
      `${API_URL}/applications`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: job.company || "Unknown Company",
          role:
            job.title ||
            job.job_title ||
            "Unknown Position",
          location:
            job.location ||
            "Location not specified",
          status: "Applied",
          applicationUrl: applicationUrl,
          appliedDate: new Date().toISOString(),
          source:
            job.source ||
            "Live Job Provider",
          jobId:
            job.id ||
            job._id ||
            job.jobId ||
            null,
        }),
      }
    );

    const data = await response.json();

    /*
     * If the application could not be
     * created, don't pretend that it was saved.
     */
    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Unable to add this application to the tracker."
      );
    }

    /*
     * Open the REAL company application page.
     */
    window.open(
      applicationUrl,
      "_blank",
      "noopener,noreferrer"
    );

    /*
     * Optional success message.
     */
    setError("");

    /*
     * Keep the selected job available if the
     * Applications page needs it later.
     */
    navigate("/applications", {
      state: {
        selectedJob: {
          ...job,
          applicationUrl,
        },
        applicationCreated: true,
      },
    });

  } catch (err) {
    console.error(
      "Apply / application tracker error:",
      err
    );

    setError(
      err.message ||
        "Unable to add application."
    );
  }
};

  /* ===================================================
     VIEW DETAILS
  =================================================== */

  const handleViewDetails = (
    jobId
  ) => {

    if (!jobId) return;

    navigate(
      `/jobs/${jobId}`
    );
  };


  /* ===================================================
     CLEAR FILTERS
  =================================================== */

  const clearFilters = () => {

    setSearchTerm("");

    setLocationTerm("");

    setFilters({
      jobType: "All",
      experience: "All",
      savedOnly: false,
    });
  };


  /* ===================================================
     ACTIVE FILTER COUNT
  =================================================== */

  const activeFilterCount =
    (filters.jobType !== "All"
      ? 1
      : 0) +
    (filters.experience !== "All"
      ? 1
      : 0) +
    (filters.savedOnly ? 1 : 0);


  /* ===================================================
     RENDER
  =================================================== */

  return (
    <div className="jobs-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="jobs-header">

        <div>

          <button
            className="jobs-back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <ArrowLeft size={18} />

            Back to Dashboard
          </button>


          <h1>
            Job Matching
          </h1>


          <p>
            Discover opportunities that match
            your skills and career goals.
          </p>

        </div>


        <div className="jobs-header-stat">

          <strong>
            {loading
              ? "—"
              : filteredJobs.length}
          </strong>

          <span>
            Matching Jobs
          </span>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="jobs-content">


        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="jobs-search-card">

          {/* Search */}

          <div className="jobs-search-box">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search job title, company or skill"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />


            {searchTerm && (
              <button
                className="jobs-input-clear"
                onClick={() =>
                  setSearchTerm("")
                }
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}

          </div>


          {/* Location */}

          <div className="jobs-location-box">

            <MapPin size={19} />

            <input
              type="text"
              placeholder="Location"
              value={locationTerm}
              onChange={(e) =>
                setLocationTerm(
                  e.target.value
                )
              }
            />


            {locationTerm && (
              <button
                className="jobs-input-clear"
                onClick={() =>
                  setLocationTerm("")
                }
                aria-label="Clear location"
              >
                <X size={16} />
              </button>
            )}

          </div>


          {/* Filters */}

          <button
            className={`jobs-filter-button ${
              activeFilterCount > 0
                ? "active"
                : ""
            }`}
            onClick={() =>
              setShowFilters(
                (value) => !value
              )
            }
          >

            <SlidersHorizontal
              size={17}
            />

            Filters

            {activeFilterCount > 0 && (
              <span className="filter-count">
                {activeFilterCount}
              </span>
            )}

          </button>

        </section>


        {/* =================================================
            FILTER PANEL
        ================================================= */}

        {showFilters && (

          <section className="jobs-filter-panel">


            {/* Job Type */}

            <div className="jobs-filter-group">

              <label>
                Job Type
              </label>

              <select
                value={
                  filters.jobType
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    jobType:
                      e.target.value,
                  })
                }
              >

                <option value="All">
                  All Types
                </option>

                <option value="Full-time">
                  Full-time
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Part-time">
                  Part-time
                </option>

              </select>

            </div>


            {/* Experience */}

            <div className="jobs-filter-group">

              <label>
                Experience
              </label>

              <select
                value={
                  filters.experience
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    experience:
                      e.target.value,
                  })
                }
              >

                <option value="All">
                  All Levels
                </option>

                <option value="Intern">
                  Intern
                </option>

                <option value="Entry">
                  Entry Level
                </option>

                <option value="Junior">
                  Junior
                </option>

                <option value="Mid">
                  Mid Level
                </option>

                <option value="Senior">
                  Senior
                </option>

              </select>

            </div>


            {/* Saved */}

            <label className="jobs-saved-filter">

              <input
                type="checkbox"
                checked={
                  filters.savedOnly
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    savedOnly:
                      e.target.checked,
                  })
                }
              />

              <Bookmark
                size={16}
              />

              Saved jobs only

            </label>


            <button
              className="jobs-clear-filter"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </section>
        )}


        {/* =================================================
            PROFILE MATCH
        ================================================= */}

        <section className="jobs-profile-card">


          <div className="jobs-profile-icon">
            <Sparkles size={22} />
          </div>


          <div className="jobs-profile-text">

            <h2>
              {resumeSkills.length > 0
                ? "Your career profile"
                : "Build your career profile"}
            </h2>


            <p>

              {resumeSkills.length > 0
                ? `We found ${resumeSkills.length} skills in your resume and ranked jobs based on your profile.`
                : "Upload and analyze your resume to get personalized job matching and skill-gap insights."}

            </p>


            {resumeSkills.length > 0 && (

              <div className="profile-skill-preview">

                {resumeSkills
                  .slice(0, 6)
                  .map((skill) => (
                    <span
                      key={skill}
                    >
                      {skill}
                    </span>
                  ))}


                {resumeSkills.length >
                  6 && (
                  <span>
                    +
                    {resumeSkills.length -
                      6}
                  </span>
                )}

              </div>
            )}

          </div>


          <div className="jobs-profile-score">

            <strong>
              {resumeLoading
                ? "—"
                : bestMatch !== null
                ? `${bestMatch}%`
                : "—"}
            </strong>

            <span>
              Best Match
            </span>

          </div>


          {resumeSkills.length === 0 && (

            <button
              className="jobs-profile-button"
              onClick={() =>
                navigate("/resume")
              }
            >
              <FileText size={16} />

              Analyze Resume

              <ChevronRight
                size={16}
              />

            </button>

          )}

        </section>


        {/* =================================================
            SECTION TITLE
        ================================================= */}

        <div className="jobs-section-title">

          <div>

            <h2>
              Recommended Jobs
            </h2>

            <p>

              {resumeSkills.length > 0
                ? "Ranked by how closely each opportunity matches your resume."
                : "Live opportunities from the CareerAI job database."}

            </p>

          </div>


          <span>

            {loading
              ? "Loading..."
              : `${filteredJobs.length} results`}

          </span>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="jobs-error">

            <div className="jobs-error-icon">
              <AlertCircle
                size={20}
              />
            </div>


            <div>

              <strong>
                Something went wrong
              </strong>

              <p>
                {error}
              </p>

            </div>


            <button
              onClick={() => {
                setError("");
                fetchJobs();
                fetchResume();
              }}
              className="jobs-retry-button"
            >

              <RefreshCw
                size={16}
              />

              Retry

            </button>

          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="jobs-loading">

            <LoaderCircle
              size={32}
              className="jobs-loading-spinner"
            />

            <h3>
              Finding jobs...
            </h3>

            <p>
              Loading live opportunities
              from CareerAI.
            </p>

          </div>


        ) : filteredJobs.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="jobs-empty">

            <div className="jobs-empty-icon">
              <BriefcaseBusiness
                size={28}
              />
            </div>


            <h3>
              No jobs found
            </h3>


            <p>
              Try changing your search
              or filters to find more
              opportunities.
            </p>


            <button
              className="jobs-empty-button"
              onClick={
                clearFilters
              }
            >
              Clear Search & Filters
            </button>

          </div>


        ) : (

          /* =================================================
             JOB LIST
          ================================================= */

          <div className="jobs-list">

            {filteredJobs.map(
              (job) => (

                <article
                  className="job-card"
                  key={job.id}
                >


                  {/* Company Logo */}

                  <div className="job-company-logo">

                    {job.company
                      .charAt(0)
                      .toUpperCase()}

                  </div>


                  {/* Main */}

                  <div className="job-main">


                    {/* Title */}

                    <div className="job-title-row">

                      <div>

                        <h3>
                          {job.title}
                        </h3>

                        <div className="job-company">
                          {job.company}
                        </div>

                      </div>


                      {/* Match */}

                      {job.matchScore !==
                        null && (

                        <div
                          className={`job-match ${
                            job.matchScore >=
                            75
                              ? "high"
                              : job.matchScore >=
                                50
                              ? "medium"
                              : "low"
                          }`}
                        >

                          <strong>
                            {job.matchScore}%
                          </strong>

                          <span>
                            match
                          </span>

                        </div>
                      )}

                    </div>


                    {/* Metadata */}

                    <div className="job-meta">

                      <span>
                        <MapPin
                          size={14}
                        />

                        {job.location}
                      </span>


                      <span>
                        <BriefcaseBusiness
                          size={14}
                        />

                        {job.type}
                      </span>


                      <span>
                        <Clock3
                          size={14}
                        />

                        {job.experience}
                      </span>


                      {job.salary && (
                        <span>
                          ₹ {job.salary}
                        </span>
                      )}

                    </div>


                    {/* Posted */}

                    <div className="job-dates">

                      {job.postedDate && (

                        <span>
                          Posted{" "}
                          {formatDate(
                            job.postedDate
                          )}
                        </span>

                      )}


                      {job.deadline ? (

                        <span className="job-deadline">
                          Deadline{" "}
                          {formatDate(
                            job.deadline
                          )}
                        </span>

                      ) : (

                        <span className="job-recruitment-live">
                          <span className="live-recruitment-dot" />
                          Live Recruitment
                        </span>

                      )}

                    </div>


                    {/* Skills */}

                    {job.skills.length >
                      0 && (

                      <div className="job-skills">

                        {job.skills
                          .slice(0, 8)
                          .map(
                            (
                              skill
                            ) => {

                              const normalized =
                                normalizeSkill(
                                  skill
                                );

                              const matched =
                                job.matchedSkills.some(
                                  (
                                    item
                                  ) =>
                                    item.toLowerCase() ===
                                    normalized.toLowerCase()
                                );


                              return (

                                <span
                                  key={
                                    skill
                                  }
                                  className={
                                    matched
                                      ? "skill-match"
                                      : "skill-missing"
                                  }
                                >

                                  {matched ? (
                                    <CheckCircle2
                                      size={
                                        12
                                      }
                                    />
                                  ) : (
                                    <XCircle
                                      size={
                                        12
                                      }
                                    />
                                  )}

                                  {
                                    normalized
                                  }

                                </span>

                              );
                            }
                          )}

                      </div>
                    )}


                    {/* Skill gap */}

                    {resumeSkills.length >
                      0 &&
                      job.missingSkills
                        .length > 0 && (

                        <div className="job-skill-gap">

                          <span>
                            Missing:
                          </span>

                          {job.missingSkills
                            .slice(0, 4)
                            .map(
                              (
                                skill
                              ) => (
                                <span
                                  key={
                                    skill
                                  }
                                  className="missing-skill"
                                >
                                  {skill}
                                </span>
                              )
                            )}

                          {job.missingSkills
                            .length >
                            4 && (
                            <span className="missing-more">
                              +
                              {job.missingSkills
                                .length -
                                4}
                            </span>
                          )}

                        </div>
                      )}

                  </div>


                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <div className="job-actions">


                    {/* Save */}

                    <button
                      className={`job-save-button ${
                        job.saved
                          ? "saved"
                          : ""
                      }`}
                      onClick={() =>
                        handleToggleSave(
                          job.id
                        )
                      }
                      title={
                        job.saved
                          ? "Remove from saved jobs"
                          : "Save job"
                      }
                      aria-label={
                        job.saved
                          ? "Remove from saved jobs"
                          : "Save job"
                      }
                    >

                      {job.saved ? (
                        <BookmarkCheck
                          size={19}
                        />
                      ) : (
                        <Bookmark
                          size={19}
                        />
                      )}

                    </button>


                    {/* Details */}

                    <button
                      className="job-details-button"
                      onClick={() =>
                        handleViewDetails(
                          job.id
                        )
                      }
                    >
                      View Details
                    </button>


                    {/* Apply */}

                    <button
                      className="job-apply-button"
                      onClick={() =>
                        handleApply(job)
                      }
                      disabled={
                        !job.applicationUrl
                      }
                    >

                      Apply Now

                      <ExternalLink
                        size={15}
                      />

                    </button>

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </main>

    </div>
  );
}


export default Jobs;