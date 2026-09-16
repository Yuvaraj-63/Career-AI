import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Target,
  BriefcaseBusiness,
  Search,
  BarChart3,
  Sparkles,
  X,
  GraduationCap,
  FolderGit2,
} from "lucide-react";

import "./Resume.css";

const API_URL =
  "http://localhost:5000/api";

function Resume() {
  const navigate = useNavigate();

  const [file, setFile] =
    useState(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [analysis, setAnalysis] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD INITIAL RESUME DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    // 1. Instant load from localStorage
    try {
      const cached = localStorage.getItem("careerAIResumeAnalysis");
      if (cached) {
        setAnalysis(JSON.parse(cached));
      }
    } catch (e) {
      // ignore
    }

    // 2. Fetch latest from backend
    const fetchResume = async () => {
      try {
        const response = await fetch(`${API_URL}/resume`);
        if (response.ok) {
          const data = await response.json();
          if (data?.data && (data.data.atsScore !== undefined || data.data.breakdown)) {
            setAnalysis(data.data);
            localStorage.setItem(
              "careerAIResumeAnalysis",
              JSON.stringify(data.data)
            );
          }
        }
      } catch (err) {
        // ignore
      }
    };

    fetchResume();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILE SELECTION
  |--------------------------------------------------------------------------
  */

  const handleFileChange = (e) => {
    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const extension =
      selectedFile.name
        .split(".")
        .pop()
        .toLowerCase();

    const validType =
      allowedTypes.includes(
        selectedFile.type
      ) ||
      ["pdf", "docx"].includes(
        extension
      );

    if (!validType) {
      setError(
        "Please upload a PDF or DOCX file."
      );

      setFile(null);
      return;
    }

    if (
      selectedFile.size >
      5 * 1024 * 1024
    ) {
      setError(
        "File size must be less than 5MB."
      );

      setFile(null);
      return;
    }

    setFile(selectedFile);

    setError("");

    /*
     * New resume = new analysis.
     */
    setAnalysis(null);
  };

  /*
  |--------------------------------------------------------------------------
  | ANALYZE
  |--------------------------------------------------------------------------
  */

  const handleAnalyze = async (
  includeJobMatch = false
) => {
  if (!file) {
    setError("Please select a resume first.");
    return;
  }

  if (
    includeJobMatch &&
    !jobDescription.trim()
  ) {
    setError(
      "Please paste a job description to calculate the Job Match Score."
    );
    return;
  }

  setLoading(true);
  setError("");

  try {
    /*
     * ==========================================================
     * STEP 1
     * Save the uploaded resume so other CareerAI modules
     * such as Jobs can use the user's latest resume.
     * ==========================================================
     */

    const uploadFormData = new FormData();

    uploadFormData.append(
      "resume",
      file
    );

    const uploadResponse = await fetch(
      `${API_URL}/resume/upload`,
      {
        method: "POST",
        body: uploadFormData,
      }
    );

    const uploadData =
      await uploadResponse.json();

    if (
      !uploadResponse.ok ||
      !uploadData.success
    ) {
      throw new Error(
        uploadData.message ||
          "Unable to save your resume."
      );
    }

    /*
     * ==========================================================
     * STEP 2
     * Analyze the resume.
     * ==========================================================
     */

    const formData =
      new FormData();

    formData.append(
      "resume",
      file
    );

    /*
     * Send the job description only when
     * the user has provided one.
     */
    if (
      jobDescription.trim()
    ) {
      formData.append(
        "jobDescription",
        jobDescription.trim()
      );
    }

    const response =
      await fetch(
        `${API_URL}/resume/analyze`,
        {
          method: "POST",
          body: formData,
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
          "Resume analysis failed."
      );
    }

    /*
     * ==========================================================
     * STEP 3
     * Store analysis result.
     * ==========================================================
     */

    const result = data.data || {};

    setAnalysis(result);

    /*
     * Keep the latest analysis available for
     * the rest of the CareerAI frontend.
     */
    localStorage.setItem(
      "careerAIResumeAnalysis",
      JSON.stringify(result)
    );

  } catch (err) {
    console.error(
      "Resume analysis error:",
      err
    );

    setError(
      err.message ||
        "Unable to connect to the backend."
    );
  } finally {
    setLoading(false);
  }
};
  /*
  |--------------------------------------------------------------------------
  | CLEAR JD
  |--------------------------------------------------------------------------
  */

  const clearJobDescription = () => {
    setJobDescription("");

    if (analysis) {
      setAnalysis({
        ...analysis,
        jobMatchScore: null,
        requiredSkills: [],
        matchedSkills: [],
        missingJobSkills: [],
        hasJobDescription: false,
      });
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SCORE STATUS
  |--------------------------------------------------------------------------
  */

  const getScoreStatus = (
    score
  ) => {
    if (score >= 80) {
      return {
        label: "Excellent",
        className: "score-excellent",
      };
    }

    if (score >= 65) {
      return {
        label: "Good",
        className: "score-good",
      };
    }

    if (score >= 50) {
      return {
        label: "Needs Improvement",
        className: "score-average",
      };
    }

    return {
      label: "Needs Attention",
      className: "score-low",
    };
  };

  const atsStatus =
    analysis
      ? getScoreStatus(
          analysis.atsScore
        )
      : null;

  const matchStatus =
    analysis?.jobMatchScore !==
    null &&
    analysis?.jobMatchScore !==
      undefined
      ? getScoreStatus(
          analysis.jobMatchScore
        )
      : null;

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="resume-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="resume-header">

          {/* Back Button */}
          <button
            className="resume-back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          {/* Centered Hero Content */}
          <div className="resume-hero-content">
            <h1>Resume Analysis</h1>

            <p>
              Upload your resume and discover how strong it is
              for your target roles.
            </p>
          </div>

        </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="resume-content">

        {/* ===================================================
            UPLOAD CARD
        ==================================================== */}

        <section className="resume-upload-card">

          <div className="resume-section-heading">

            <div className="resume-heading-icon">
              <FileText
                size={22}
              />
            </div>

            <div>
              <h2>
                Upload your resume
              </h2>

              <p>
                PDF or DOCX files
                up to 5MB
              </p>
            </div>

          </div>

          <label className="resume-drop-zone">

            <input
              type="file"
              accept=".pdf,.docx"
              onChange={
                handleFileChange
              }
              hidden
            />

            <div className="resume-upload-icon">
              <Upload
                size={28}
              />
            </div>

            {file ? (
              <>
                <h3>
                  {file.name}
                </h3>

                <p>
                  {(
                    file.size /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </p>

                <span className="resume-selected-label">
                  Resume selected
                </span>
              </>
            ) : (
              <>
                <h3>
                  Drop your resume
                  here
                </h3>

                <p>
                  or{" "}
                  <span>
                    browse files
                  </span>{" "}
                  from your computer
                </p>
              </>
            )}

          </label>

        </section>

        {/* ===================================================
            JOB DESCRIPTION
        ==================================================== */}

        <section className="job-description-card">

          <div className="job-description-header">

            <div className="job-description-title">

              <div className="job-description-icon">
                <BriefcaseBusiness
                  size={21}
                />
              </div>

              <div>
                <h2>
                  Job Description
                </h2>

                <p>
                  Optional — paste a
                  job description to
                  calculate your
                  Job Match Score.
                </p>
              </div>

            </div>

            {jobDescription && (
              <button
                className="clear-jd-button"
                onClick={
                  clearJobDescription
                }
              >
                <X
                  size={15}
                />

                Clear
              </button>
            )}

          </div>

          <textarea
            className="job-description-input"
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(
                e.target.value
              )
            }
            placeholder={
              "Paste the job description here...\n\nExample:\nWe are looking for a Java Developer with experience in Spring Boot, SQL, React and REST APIs..."
            }
            rows={9}
          />

          <div className="job-description-footer">

            <span>
              {jobDescription.length}{" "}
              characters
            </span>

            <span>
              {jobDescription.trim()
                ? "Job description ready"
                : "Optional"}
            </span>

          </div>

        </section>

        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="resume-error">
            <AlertCircle
              size={17}
            />

            <span>
              {error}
            </span>
          </div>
        )}

        {/* ===================================================
            ACTION BUTTONS
        ==================================================== */}

        <section className="resume-action-card">

          <div className="resume-action-text">

            <Sparkles
              size={20}
            />

            <div>
              <strong>
                Ready to analyze?
              </strong>

              <span>
                Check your resume
                quality or compare
                it with a specific
                job.
              </span>
            </div>

          </div>

          <div className="resume-action-buttons">

            <button
              className="resume-analyze-button secondary"
              onClick={() =>
                handleAnalyze(false)
              }
              disabled={
                !file || loading
              }
            >
              <BarChart3
                size={18}
              />

              {loading
                ? "Analyzing..."
                : "Analyze Resume"}
            </button>

            <button
              className="resume-analyze-button"
              onClick={() =>
                handleAnalyze(true)
              }
              disabled={
                !file ||
                loading ||
                !jobDescription.trim()
              }
            >
              <Search
                size={18}
              />

              {loading
                ? "Analyzing..."
                : "Analyze Job Match"}
            </button>

          </div>

        </section>

        {/* ===================================================
            RESULTS
        ==================================================== */}

        {analysis && (
          <>

            {/* ===============================================
                SCORE OVERVIEW
            ================================================ */}

            <section className="resume-score-overview">

              {/* ATS SCORE */}

              <div className="resume-score-card">

                <div className="resume-card-header">

                  <div>
                    <span className="resume-card-label">
                      RESUME QUALITY
                    </span>

                    <h2>
                      ATS Score
                    </h2>

                    <p>
                      How strong your
                      resume is for ATS
                      screening.
                    </p>
                  </div>

                  <Target
                    size={23}
                  />

                </div>

                <div className="score-circle">

                  <div>
                    <strong>
                      {analysis.atsScore}
                    </strong>

                    <span>
                      /100
                    </span>
                  </div>

                </div>

                {atsStatus && (
                  <div
                    className={`score-status ${atsStatus.className}`}
                  >
                    <CheckCircle2
                      size={17}
                    />

                    {atsStatus.label}
                  </div>
                )}

                <p className="score-description">
                  Your resume is
                  evaluated using
                  CareerAI's resume
                  structure, skills,
                  keywords,
                  experience,
                  achievements and
                  formatting signals.
                </p>

              </div>

              {/* JOB MATCH */}

              <div className="job-match-score-card">

                <div className="resume-card-header">

                  <div>
                    <span className="resume-card-label">
                      TARGET JOB
                    </span>

                    <h2>
                      Job Match Score
                    </h2>

                    <p>
                      How well your
                      resume matches
                      the job description.
                    </p>
                  </div>

                  <BriefcaseBusiness
                    size={23}
                  />

                </div>

                {analysis.jobMatchScore !==
                null &&
                analysis.jobMatchScore !==
                  undefined ? (
                  <>
                    <div className="job-match-score">

                      <strong>
                        {
                          analysis.jobMatchScore
                        }
                        %
                      </strong>

                    </div>

                    {matchStatus && (
                      <div
                        className={`score-status ${matchStatus.className}`}
                      >
                        <CheckCircle2
                          size={17}
                        />

                        {
                          matchStatus.label
                        }
                      </div>
                    )}

                    <p className="score-description">
                      This score combines
                      your resume ATS
                      quality with the
                      skills required by
                      this job.
                    </p>
                  </>
                ) : (
                  <div className="job-match-empty">

                    <div className="job-match-empty-icon">
                      <Search
                        size={24}
                      />
                    </div>

                    <strong>
                      No Job Match Score
                      yet
                    </strong>

                    <p>
                      Paste a job
                      description above
                      and click{" "}
                      <b>
                        Analyze Job Match
                      </b>
                      .
                    </p>

                  </div>
                )}

              </div>

            </section>

            {/* ===============================================
                JOB SKILL MATCH
            ================================================ */}

            {analysis.jobMatchScore !==
              null &&
              analysis.jobMatchScore !==
                undefined && (
                <section className="job-match-details">

                  <div className="job-match-details-header">

                    <div>
                      <span className="resume-card-label">
                        JOB REQUIREMENTS
                      </span>

                      <h2>
                        Job Description
                        Analysis
                      </h2>

                      <p>
                        See exactly which
                        skills you already
                        match and which
                        ones are missing.
                      </p>
                    </div>

                    <div className="job-match-percentage">
                      {
                        analysis.jobMatchScore
                      }
                      %
                    </div>

                  </div>

                  <div className="job-match-columns">

                    {/* MATCHED */}

                    <div className="job-skill-column">

                      <div className="job-skill-column-header matched">

                        <div>
                          <CheckCircle2
                            size={19}
                          />

                          <strong>
                            Matched Skills
                          </strong>
                        </div>

                        <span>
                          {
                            analysis
                              .matchedSkills
                              ?.length ||
                            0
                          }
                        </span>

                      </div>

                      <div className="job-skill-list">

                        {analysis
                          .matchedSkills
                          ?.length >
                        0 ? (
                          analysis.matchedSkills.map(
                            (
                              skill,
                              index
                            ) => (
                              <div
                                className="job-skill-item matched"
                                key={`${skill}-${index}`}
                              >
                                <CheckCircle2
                                  size={16}
                                />

                                <span>
                                  {skill}
                                </span>
                              </div>
                            )
                          )
                        ) : (
                          <div className="job-skill-empty">
                            No matching skills
                            detected.
                          </div>
                        )}

                      </div>

                    </div>

                    {/* MISSING */}

                    <div className="job-skill-column">

                      <div className="job-skill-column-header missing">

                        <div>
                          <AlertCircle
                            size={19}
                          />

                          <strong>
                            Missing Skills
                          </strong>
                        </div>

                        <span>
                          {
                            analysis
                              .missingJobSkills
                              ?.length ||
                            0
                          }
                        </span>

                      </div>

                      <div className="job-skill-list">

                        {analysis
                          .missingJobSkills
                          ?.length >
                        0 ? (
                          analysis.missingJobSkills.map(
                            (
                              skill,
                              index
                            ) => (
                              <div
                                className="job-skill-item missing"
                                key={`${skill}-${index}`}
                              >
                                <AlertCircle
                                  size={16}
                                />

                                <span>
                                  {skill}
                                </span>
                              </div>
                            )
                          )
                        ) : (
                          <div className="job-skill-empty success">
                            Great! No missing
                            detected skills.
                          </div>
                        )}

                      </div>

                    </div>

                  </div>

                </section>
              )}

            {/* ===============================================
                ATS BREAKDOWN
            ================================================ */}

            {analysis.breakdown && (
              <section className="ats-breakdown-card">

                <div className="resume-card-header">

                  <div>
                    <span className="resume-card-label">
                      SCORE BREAKDOWN
                    </span>

                    <h2>
                      ATS Score Breakdown
                    </h2>

                    <p>
                      Understand how your
                      resume score was
                      calculated.
                    </p>
                  </div>

                  <BarChart3
                    size={22}
                  />

                </div>

                <div className="ats-breakdown-grid">

  <BreakdownItem
    label="Resume Sections"
    value={
      Number(
        analysis.breakdown?.sections
      ) || 0
    }
    max={20}
  />

  <BreakdownItem
    label="Technical Skills"
    value={
      Number(
        analysis.breakdown?.technicalSkills
      ) || 0
    }
    max={25}
  />

  <BreakdownItem
    label="Experience"
    value={
      Number(
        analysis.breakdown?.experience
      ) || 0
    }
    max={15}
  />

  <BreakdownItem
    label="Education"
    value={
      Number(
        analysis.breakdown?.education
      ) || 0
    }
    max={10}
  />

  <BreakdownItem
    label="Projects"
    value={
      Number(
        analysis.breakdown?.projects
      ) || 0
    }
    max={10}
  />

  <BreakdownItem
    label="Contact"
    value={
      Number(
        analysis.breakdown?.contact
      ) || 0
    }
    max={10}
  />

</div>

              </section>
            )}

            {/* ===============================================
                DETECTED SKILLS
            ================================================ */}

            <section className="detected-skills-card">

              <div className="resume-card-header">

                <div>
                  <span className="resume-card-label">
                    RESUME
                  </span>

                  <h2>
                    Detected Skills
                  </h2>

                  <p>
                    Skills CareerAI
                    detected in your
                    resume.
                  </p>
                </div>

                <Target
                  size={22}
                />

              </div>

              <div className="detected-skills-list">

                {analysis.detectedSkills
                  ?.length > 0 ? (
                  analysis.detectedSkills.map(
                    (
                      skill,
                      index
                    ) => (
                      <span
                        className="detected-skill"
                        key={`${skill}-${index}`}
                      >
                        <CheckCircle2
                          size={14}
                        />

                        {skill}
                      </span>
                    )
                  )
                ) : (
                  <span className="no-skills">
                    No recognized skills
                    detected.
                  </span>
                )}

              </div>

            </section>

            {/* ===============================================
                EDUCATION & QUALIFICATIONS
            ================================================ */}

            <section className="resume-extracted-card">

              <div className="resume-card-header">
                <div>
                  <span className="resume-card-label">
                    ACADEMIC BACKGROUND
                  </span>

                  <h2>
                    Education & Qualifications
                  </h2>

                  <p>
                    Degrees, colleges, and academic institutions identified from your resume.
                  </p>
                </div>

                <GraduationCap
                  size={22}
                />
              </div>

              <div className="resume-extracted-list">
                {analysis.education && analysis.education.length > 0 ? (
                  analysis.education.map((item, index) => (
                    <div className="resume-extracted-item" key={index}>
                      <div className="resume-extracted-badge edu">
                        <GraduationCap size={16} />
                      </div>
                      <div className="resume-extracted-text">
                        <p>{item}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="resume-extracted-empty">
                    <GraduationCap size={22} />
                    <span>No separate education lines identified. Make sure your resume has a clear "Education" section.</span>
                  </div>
                )}
              </div>

            </section>

            {/* ===============================================
                EXPERIENCE & PROJECTS
            ================================================ */}

            <div className="resume-extracted-grid">

              {/* EXPERIENCE */}
              <section className="resume-extracted-card">
                <div className="resume-card-header">
                  <div>
                    <span className="resume-card-label">
                      PROFESSIONAL JOURNEY
                    </span>

                    <h2>
                      Work Experience
                    </h2>

                    <p>
                      Roles, companies, and internships found.
                    </p>
                  </div>

                  <BriefcaseBusiness
                    size={22}
                  />
                </div>

                <div className="resume-extracted-list">
                  {analysis.experience && analysis.experience.length > 0 ? (
                    analysis.experience.map((item, index) => (
                      <div className="resume-extracted-item" key={index}>
                        <div className="resume-extracted-badge exp">
                          <BriefcaseBusiness size={16} />
                        </div>
                        <div className="resume-extracted-text">
                          <p>{item}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="resume-extracted-empty">
                      <BriefcaseBusiness size={22} />
                      <span>No work experience entries identified. Adding an "Experience" or "Internships" section will boost your score.</span>
                    </div>
                  )}
                </div>
              </section>

              {/* PROJECTS */}
              <section className="resume-extracted-card">
                <div className="resume-card-header">
                  <div>
                    <span className="resume-card-label">
                      PORTFOLIO
                    </span>

                    <h2>
                      Projects & Work
                    </h2>

                    <p>
                      Technical projects extracted from your resume.
                    </p>
                  </div>

                  <FolderGit2
                    size={22}
                  />
                </div>

                <div className="resume-extracted-list">
                  {analysis.projects && analysis.projects.length > 0 ? (
                    analysis.projects.map((item, index) => (
                      <div className="resume-extracted-item" key={index}>
                        <div className="resume-extracted-badge proj">
                          <FolderGit2 size={16} />
                        </div>
                        <div className="resume-extracted-text">
                          <p>{item}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="resume-extracted-empty">
                      <FolderGit2 size={22} />
                      <span>No project entries identified. Adding key projects demonstrates applied skills.</span>
                    </div>
                  )}
                </div>
              </section>

            </div>

            {/* ===============================================
                STRENGTHS / SUGGESTIONS
            ================================================ */}

            <section className="resume-analysis-grid">

              {/* STRENGTHS */}

              <div className="resume-info-card">

                <div className="resume-card-header">

                  <div>
                    <h2>
                      Resume Strengths
                    </h2>

                    <p>
                      What's working
                      well.
                    </p>
                  </div>

                  <CheckCircle2
                    size={22}
                  />

                </div>

                <div className="resume-list">

                  {analysis.strengths
                    ?.map(
                      (
                        strength,
                        index
                      ) => (
                        <div
                          className="resume-list-item"
                          key={index}
                        >
                          <CheckCircle2
                            size={18}
                          />

                          <span>
                            {strength}
                          </span>
                        </div>
                      )
                    )}

                </div>

              </div>

              {/* SUGGESTIONS */}

              <div className="resume-info-card">

                <div className="resume-card-header">

                  <div>
                    <h2>
                      Improvement
                      Suggestions
                    </h2>

                    <p>
                      Make your resume
                      stronger.
                    </p>
                  </div>

                  <Lightbulb
                    size={22}
                  />

                </div>

                <div className="resume-suggestions">

                  {analysis.suggestions
                    ?.map(
                      (
                        suggestion,
                        index
                      ) => (
                        <div
                          className="resume-suggestion"
                          key={index}
                        >

                          <div className="suggestion-number">
                            {index + 1}
                          </div>

                          <div>
                            <h3>
                              {index === 0
                                ? "Improve your resume"
                                : index === 1
                                ? "Improve keyword matching"
                                : "Strengthen your profile"}
                            </h3>

                            <p>
                              {suggestion}
                            </p>
                          </div>

                        </div>
                      )
                    )}

                </div>

              </div>

            </section>

          </>
        )}

        {/* ===================================================
            BEFORE ANALYSIS
        ==================================================== */}

        {!analysis &&
          !loading && (
            <section className="resume-empty-state">

              <div className="resume-empty-icon">
                <Target
                  size={28}
                />
              </div>

              <h2>
                Your analysis will
                appear here
              </h2>

              <p>
                Upload your resume
                and analyze it to
                see your ATS Score.
                Add a job description
                whenever you want to
                check your Job Match
                Score.
              </p>

              <div className="empty-feature-row">

                <div>
                  <CheckCircle2
                    size={17}
                  />

                  <span>
                    ATS Resume Score
                  </span>
                </div>

                <div>
                  <BriefcaseBusiness
                    size={17}
                  />

                  <span>
                    Job Match Score
                  </span>
                </div>

                <div>
                  <Target
                    size={17}
                  />

                  <span>
                    Missing Skills
                  </span>
                </div>

              </div>

            </section>
          )}

        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="resume-loading">

            <div className="resume-loading-spinner" />

            <strong>
              Analyzing your resume...
            </strong>

            <p>
              CareerAI is extracting
              your resume content and
              calculating your scores.
            </p>

          </div>
        )}

        {/* ===================================================
            NEXT STEP
        ==================================================== */}

        <section className="resume-next-section">

          <div>
            <h2>
              Ready for the next step?
            </h2>

            <p>
              Use your resume skills
              to discover jobs that
              match your profile.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/jobs")
            }
            className="resume-jobs-button"
          >
            <BriefcaseBusiness
              size={18}
            />

            Find Matching Jobs
          </button>

        </section>

      </main>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| BREAKDOWN ITEM
|--------------------------------------------------------------------------
*/

function BreakdownItem({
  label,
  value,
  max,
}) {
  const safeValue =
    Number.isFinite(Number(value))
      ? Number(value)
      : 0;

  const safeMax =
    Number.isFinite(Number(max))
      ? Number(max)
      : 0;

  const percentage =
    safeMax > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              (safeValue / safeMax) * 100
            )
          )
        )
      : 0;

  return (
    <div className="ats-breakdown-item">

      <div className="ats-breakdown-top">

        <span>
          {label}
        </span>

        <strong>
          {safeValue}/{safeMax}
        </strong>

      </div>

      <div className="ats-breakdown-bar">

        <div
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

export default Resume;