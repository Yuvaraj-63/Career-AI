import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  ClipboardList,
  Mic,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  User,
  Search,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Target,
  Sparkles,
  Upload,
  PlayCircle,
  BarChart3,
  X,
  Menu,
  CircleAlert,
  ExternalLink,
  CalendarDays,
  Award,
  Zap,
} from "lucide-react";

import "./Dashboard.css";

const API_URL = "http://localhost:5000/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [resumeScore, setResumeScore] = useState(0);
  const [applications, setApplications] = useState([]);
  const [interviewHistory, setInterviewHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =========================================================
     LOAD USER
  ========================================================= */

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Unable to load user:", error);
    }
  }, []);

  /* =========================================================
     LOAD DASHBOARD DATA
  ========================================================= */

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      /* -------------------------------
         Resume
      -------------------------------- */

      // 1. Instant load from localStorage
      try {
        const cachedResume = localStorage.getItem("careerAIResumeAnalysis");
        if (cachedResume) {
          const parsed = JSON.parse(cachedResume);
          const cachedScore =
            parsed?.atsScore ??
            parsed?.data?.atsScore ??
            parsed?.analysis?.atsScore ??
            0;
          if (cachedScore) {
            setResumeScore(Number(cachedScore));
          }
        }
      } catch (e) {
        // ignore
      }

      // 2. Fetch latest from backend API
      try {
        const response = await fetch(`${API_URL}/resume`);

        if (response.ok) {
          const data = await response.json();

          const score =
            data?.data?.atsScore ??
            data?.data?.analysis?.atsScore ??
            data?.atsScore ??
            data?.analysis?.atsScore ??
            0;

          if (score) {
            setResumeScore(Number(score));
          }
        }
      } catch (error) {
        console.log("Resume data not available yet.");
      }

      /* -------------------------------
         Applications
      -------------------------------- */

      try {
        const response = await fetch(`${API_URL}/applications`);

        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data?.data)) {
            setApplications(data.data);
          } else if (Array.isArray(data)) {
            setApplications(data);
          }
        }
      } catch (error) {
        console.log("Application data not available yet.");
      }

      /* -------------------------------
         Interview history
      -------------------------------- */

      try {
        const storedHistory = localStorage.getItem(
          "careerai_interview_history"
        );

        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);

          if (Array.isArray(parsedHistory)) {
            setInterviewHistory(parsedHistory);
          }
        }
      } catch (error) {
        console.log("Interview history not available yet.");
      }

      setLoading(false);
    };

    loadDashboardData();
  }, []);

  /* =========================================================
     USER NAME
  ========================================================= */

  const firstName = useMemo(() => {
    if (user?.name) {
      return user.name.split(" ")[0];
    }

    if (user?.displayName) {
      return user.displayName.split(" ")[0];
    }

    return "there";
  }, [user]);

  /* =========================================================
     APPLICATION STATS
  ========================================================= */

  const applicationStats = useMemo(() => {
    const total = applications.length;

    const active = applications.filter((application) => {
      const status = String(
        application?.status || ""
      ).toLowerCase();

      return (
        status === "applied" ||
        status === "under review" ||
        status === "screening" ||
        status === "interview"
      );
    }).length;

    const interviews = applications.filter((application) => {
      const status = String(
        application?.status || ""
      ).toLowerCase();

      return status === "interview";
    }).length;

    const offers = applications.filter((application) => {
      const status = String(
        application?.status || ""
      ).toLowerCase();

      return (
        status === "offer" ||
        status === "selected"
      );
    }).length;

    return {
      total,
      active,
      interviews,
      offers,
    };
  }, [applications]);

  /* =========================================================
     INTERVIEW STATS
  ========================================================= */

  const interviewStats = useMemo(() => {
    if (!interviewHistory.length) {
      return {
        sessions: 0,
        average: 0,
      };
    }

    const scores = interviewHistory
      .map(
        (session) =>
          Number(
            session?.averageScore ??
              session?.score ??
              session?.overallScore ??
              0
          )
      )
      .filter((score) => !Number.isNaN(score));

    const average = scores.length
      ? Math.round(
          scores.reduce(
            (sum, score) => sum + score,
            0
          ) / scores.length
        )
      : 0;

    return {
      sessions: interviewHistory.length,
      average,
    };
  }, [interviewHistory]);

  /* =========================================================
     SKILLS PROGRESS
  ========================================================= */

  const skillsProgress = useMemo(() => {
    if (resumeScore === 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(resumeScore * 0.9)
    );
  }, [resumeScore]);

  /* =========================================================
     CAREER READINESS
  ========================================================= */

  const careerReadiness = useMemo(() => {
    const resumePart = resumeScore * 0.45;

    const applicationPart =
      Math.min(
        applicationStats.total * 5,
        20
      );

    const interviewPart =
      Math.min(
        interviewStats.sessions * 5,
        20
      );

    const skillPart =
      skillsProgress * 0.15;

    return Math.min(
      100,
      Math.round(
        resumePart +
          applicationPart +
          interviewPart +
          skillPart
      )
    );
  }, [
    resumeScore,
    applicationStats.total,
    interviewStats.sessions,
    skillsProgress,
  ]);

  /* =========================================================
     READINESS STATUS
  ========================================================= */

  const readinessStatus = useMemo(() => {
    if (careerReadiness >= 80) {
      return {
        title: "Excellent progress",
        text: "You're building a strong career profile.",
        className: "status-excellent",
      };
    }

    if (careerReadiness >= 60) {
      return {
        title: "Good progress",
        text: "Keep improving your resume and interview skills.",
        className: "status-good",
      };
    }

    if (careerReadiness >= 35) {
      return {
        title: "Getting started",
        text: "Complete more career activities to improve your score.",
        className: "status-started",
      };
    }

    return {
      title: "Just getting started",
      text: "Analyze your resume and start exploring opportunities.",
      className: "status-empty",
    };
  }, [careerReadiness]);

  /* =========================================================
     RECENT APPLICATIONS
  ========================================================= */

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => {
        const dateA = new Date(
          a?.appliedDate ||
            a?.createdAt ||
            0
        ).getTime();

        const dateB = new Date(
          b?.appliedDate ||
            b?.createdAt ||
            0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 4);
  }, [applications]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goTo = (path) => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
    navigate(path);
  };

  /* =========================================================
     STATUS CLASS
  ========================================================= */

  const getApplicationStatusClass = (status) => {
    const normalized = String(
      status || ""
    ).toLowerCase();

    if (
      normalized === "offer" ||
      normalized === "selected"
    ) {
      return "application-status selected";
    }

    if (normalized === "interview") {
      return "application-status interview";
    }

    if (
      normalized === "rejected"
    ) {
      return "application-status rejected";
    }

    if (
      normalized === "under review" ||
      normalized === "screening"
    ) {
      return "application-status review";
    }

    return "application-status applied";
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="career-dashboard">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="dashboard-header">

        <div className="dashboard-header-inner">

          {/* LOGO */}

          <button
            className="dashboard-brand"
            onClick={() => goTo("/dashboard")}
          >
            <span className="dashboard-brand-icon">
              <Sparkles size={20} />
            </span>

            <span className="dashboard-brand-text">
              Career<span>AI</span>
            </span>
          </button>


          {/* DESKTOP NAV */}

          <nav className="dashboard-top-nav">

            <button
              className="dashboard-top-nav-item active"
              onClick={() => goTo("/dashboard")}
            >
              Dashboard
            </button>

            <button
              className="dashboard-top-nav-item"
              onClick={() => goTo("/resume")}
            >
              Resume
            </button>

            <button
              className="dashboard-top-nav-item"
              onClick={() => goTo("/jobs")}
            >
              Jobs
            </button>

            <button
              className="dashboard-top-nav-item"
              onClick={() => goTo("/applications")}
            >
              Applications
            </button>

            <button
              className="dashboard-top-nav-item"
              onClick={() => goTo("/interview")}
            >
              Interview
            </button>

            <button
              className="dashboard-top-nav-item"
              onClick={() => goTo("/progress")}
            >
              Progress
            </button>

          </nav>


          {/* HEADER ACTIONS */}

          <div className="dashboard-header-actions">

            <button
              className="dashboard-icon-button"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="notification-dot" />
            </button>


            <div className="dashboard-profile-wrapper">

              <button
                className="dashboard-profile-button"
                onClick={() =>
                  setProfileOpen(
                    (value) => !value
                  )
                }
              >

                <span className="dashboard-profile-avatar">
                  {firstName
                    .charAt(0)
                    .toUpperCase()}
                </span>

                <span className="dashboard-profile-info">
                  <strong>{user?.name || "Yuvaraj"}</strong>
                  <small>My profile</small>
                </span>

                <ChevronDown size={15} />

              </button>


              {profileOpen && (
                <div className="dashboard-profile-menu">

                  <button
                    onClick={() =>
                      goTo("/settings")
                    }
                  >
                    <Settings size={16} />
                    Settings
                  </button>

                  <button
                    onClick={() =>
                      goTo("/progress")
                    }
                  >
                    <TrendingUp size={16} />
                    My Progress
                  </button>

                  <button
                    className="profile-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>

                </div>
              )}

            </div>


            {/* MOBILE MENU */}

            <button
              className="dashboard-mobile-menu"
              onClick={() =>
                setMobileMenuOpen(true)
              }
            >
              <Menu size={21} />
            </button>

          </div>

        </div>

      </header>


      {/* =====================================================
          MOBILE NAV
      ====================================================== */}

      {mobileMenuOpen && (
        <div
          className="mobile-nav-overlay"
          onClick={() =>
            setMobileMenuOpen(false)
          }
        >
          <aside
            className="mobile-nav-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="mobile-nav-header">

              <button
                className="dashboard-brand"
                onClick={() =>
                  goTo("/dashboard")
                }
              >
                <span className="dashboard-brand-icon">
                  <Sparkles size={19} />
                </span>

                <span className="dashboard-brand-text">
                  Career<span>AI</span>
                </span>
              </button>

              <button
                className="mobile-nav-close"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                <X size={20} />
              </button>

            </div>


            <div className="mobile-nav-links">

              <button
                className="active"
                onClick={() =>
                  goTo("/dashboard")
                }
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>

              <button
                onClick={() =>
                  goTo("/resume")
                }
              >
                <FileText size={18} />
                Resume
              </button>

              <button
                onClick={() =>
                  goTo("/jobs")
                }
              >
                <Briefcase size={18} />
                Jobs
              </button>

              <button
                onClick={() =>
                  goTo("/applications")
                }
              >
                <ClipboardList size={18} />
                Applications
              </button>

              <button
                onClick={() =>
                  goTo("/interview")
                }
              >
                <Mic size={18} />
                Interview
              </button>

              <button
                onClick={() =>
                  goTo("/progress")
                }
              >
                <TrendingUp size={18} />
                Progress
              </button>

              <button
                onClick={() =>
                  goTo("/settings")
                }
              >
                <Settings size={18} />
                Settings
              </button>

            </div>


            <button
              className="mobile-logout"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>

          </aside>
        </div>
      )}


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="dashboard-content">


        {/* ===================================================
            WELCOME HERO
        ==================================================== */}

        <section className="dashboard-hero">

          <div className="dashboard-hero-content">

            <div className="dashboard-eyebrow">
              <Sparkles size={13} />
              YOUR CAREER OVERVIEW
            </div>

            <h1>
              Welcome back,
              <span> {firstName}!</span>
            </h1>

            <p>
              Track your resume, discover real job
              opportunities, prepare for interviews,
              and build your career with confidence.
            </p>


            <div className="dashboard-hero-actions">

              <button
                className="dashboard-primary-button"
                onClick={() =>
                  goTo("/resume")
                }
              >
                <FileText size={17} />
                Analyze Resume
                <ArrowUpRight size={15} />
              </button>

              <button
                className="dashboard-secondary-button"
                onClick={() =>
                  goTo("/jobs")
                }
              >
                <Search size={17} />
                Explore Jobs
              </button>

            </div>

          </div>


          {/* HERO DECORATION */}

          <div className="dashboard-hero-decoration">

            <div className="hero-orbit hero-orbit-one" />
            <div className="hero-orbit hero-orbit-two" />

            <div className="hero-floating-card">

              <div className="hero-floating-icon">
                <Target size={20} />
              </div>

              <div>
                <small>CAREER READINESS</small>
                <strong>
                  {careerReadiness}
                  <span>/100</span>
                </strong>
              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            STAT CARDS
        ==================================================== */}

        <section className="dashboard-stats-grid">


          {/* RESUME SCORE */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-top">

              <div className="dashboard-stat-icon blue">
                <FileText size={19} />
              </div>

              <button
                onClick={() =>
                  goTo("/resume")
                }
              >
                View
                <ArrowUpRight size={13} />
              </button>

            </div>

            <span className="dashboard-stat-label">
              RESUME SCORE
            </span>

            <div className="dashboard-stat-number">
              {loading ? "—" : resumeScore}
              <small>/100</small>
            </div>

            <div className="dashboard-progress">
              <div
                style={{
                  width: `${resumeScore}%`,
                }}
              />
            </div>

            <p>
              {resumeScore === 0
                ? "Analyze your resume to get started"
                : "ATS optimization score"}
            </p>

          </div>


          {/* APPLICATIONS */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-top">

              <div className="dashboard-stat-icon purple">
                <ClipboardList size={19} />
              </div>

              <button
                onClick={() =>
                  goTo("/applications")
                }
              >
                View
                <ArrowUpRight size={13} />
              </button>

            </div>

            <span className="dashboard-stat-label">
              APPLICATIONS
            </span>

            <div className="dashboard-stat-number">
              {loading
                ? "—"
                : applicationStats.total}
            </div>

            <div className="dashboard-stat-meta">

              <span>
                <strong>
                  {applicationStats.active}
                </strong>
                active
              </span>

              <span>
                <strong>
                  {applicationStats.offers}
                </strong>
                selected
              </span>

            </div>

          </div>


          {/* INTERVIEWS */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-top">

              <div className="dashboard-stat-icon orange">
                <Mic size={19} />
              </div>

              <button
                onClick={() =>
                  goTo("/interview")
                }
              >
                Practice
                <ArrowUpRight size={13} />
              </button>

            </div>

            <span className="dashboard-stat-label">
              INTERVIEW PRACTICE
            </span>

            <div className="dashboard-stat-number">
              {loading
                ? "—"
                : interviewStats.sessions}
            </div>

            <div className="dashboard-stat-meta">

              <span>
                <strong>
                  {interviewStats.average || 0}
                </strong>
                avg score
              </span>

              <span>
                {interviewStats.sessions === 0
                  ? "Not started"
                  : "Keep practicing"}
              </span>

            </div>

          </div>


          {/* SKILLS */}

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-top">

              <div className="dashboard-stat-icon green">
                <BarChart3 size={19} />
              </div>

              <button
                onClick={() =>
                  goTo("/progress")
                }
              >
                Progress
                <ArrowUpRight size={13} />
              </button>

            </div>

            <span className="dashboard-stat-label">
              SKILLS PROGRESS
            </span>

            <div className="dashboard-stat-number">
              {skillsProgress}
              <small>%</small>
            </div>

            <div className="dashboard-progress green-progress">
              <div
                style={{
                  width: `${skillsProgress}%`,
                }}
              />
            </div>

            <p>
              Based on your current resume
            </p>

          </div>

        </section>


        {/* ===================================================
            MAIN GRID
        ==================================================== */}

        <section className="dashboard-main-grid">


          {/* =================================================
              CAREER READINESS
          ================================================== */}

          <div className="dashboard-card readiness-main-card">

            <div className="dashboard-card-header">

              <div>
                <span className="dashboard-card-eyebrow">
                  YOUR CAREER
                </span>

                <h2>Career Readiness</h2>

                <p>
                  A snapshot of your current
                  preparation.
                </p>
              </div>

              <div className="dashboard-card-header-icon">
                <Target size={19} />
              </div>

            </div>


            <div className="readiness-main-body">

              <div className="readiness-score-wrapper">

                <div
                  className="readiness-score-ring"
                  style={{
                    background: `conic-gradient(
                      #1769e0 ${careerReadiness * 3.6}deg,
                      #e7edf6 ${careerReadiness * 3.6}deg
                    )`,
                  }}
                >

                  <div className="readiness-score-inner">

                    <strong>
                      {careerReadiness}
                    </strong>

                    <span>
                      / 100
                    </span>

                  </div>

                </div>

              </div>


              <div className="readiness-details">

                <div
                  className={`readiness-status ${readinessStatus.className}`}
                >
                  <span />
                  {readinessStatus.title}
                </div>

                <p>
                  {readinessStatus.text}
                </p>


                <div className="readiness-checklist">

                  <div className="readiness-check">

                    <span
                      className={
                        resumeScore > 0
                          ? "completed"
                          : ""
                      }
                    >
                      <CheckCircle2 size={15} />
                    </span>

                    <div>
                      <strong>
                        Resume
                      </strong>

                      <small>
                        {resumeScore > 0
                          ? "Analyzed"
                          : "Not started"}
                      </small>
                    </div>

                  </div>


                  <div className="readiness-check">

                    <span
                      className={
                        interviewStats.sessions > 0
                          ? "completed"
                          : ""
                      }
                    >
                      <Mic size={14} />
                    </span>

                    <div>
                      <strong>
                        Interview
                      </strong>

                      <small>
                        {interviewStats.sessions > 0
                          ? `${interviewStats.sessions} sessions`
                          : "Not started"}
                      </small>
                    </div>

                  </div>


                  <div className="readiness-check">

                    <span
                      className={
                        applicationStats.total > 0
                          ? "completed"
                          : ""
                      }
                    >
                      <Briefcase size={14} />
                    </span>

                    <div>
                      <strong>
                        Applications
                      </strong>

                      <small>
                        {applicationStats.total > 0
                          ? `${applicationStats.total} tracked`
                          : "Not started"}
                      </small>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              QUICK ACTIONS
          ================================================== */}

          <div className="dashboard-card quick-actions-card">

            <div className="dashboard-card-header">

              <div>
                <span className="dashboard-card-eyebrow">
                  GET STARTED
                </span>

                <h2>Quick Actions</h2>

                <p>
                  Continue building your career profile.
                </p>
              </div>

            </div>


            <div className="quick-actions-list">

              <button
                className="quick-action"
                onClick={() =>
                  goTo("/resume")
                }
              >

                <span className="quick-action-icon blue">
                  <Upload size={17} />
                </span>

                <span className="quick-action-text">
                  <strong>
                    Analyze Resume
                  </strong>

                  <small>
                    Improve your ATS score
                  </small>
                </span>

                <ArrowUpRight size={15} />

              </button>


              <button
                className="quick-action"
                onClick={() =>
                  goTo("/jobs")
                }
              >

                <span className="quick-action-icon purple">
                  <Search size={17} />
                </span>

                <span className="quick-action-text">
                  <strong>
                    Find Jobs
                  </strong>

                  <small>
                    Explore real opportunities
                  </small>
                </span>

                <ArrowUpRight size={15} />

              </button>


              <button
                className="quick-action"
                onClick={() =>
                  goTo("/interview")
                }
              >

                <span className="quick-action-icon orange">
                  <PlayCircle size={17} />
                </span>

                <span className="quick-action-text">
                  <strong>
                    Practice Interview
                  </strong>

                  <small>
                    Test your interview skills
                  </small>
                </span>

                <ArrowUpRight size={15} />

              </button>


              <button
                className="quick-action"
                onClick={() =>
                  goTo("/progress")
                }
              >

                <span className="quick-action-icon green">
                  <TrendingUp size={17} />
                </span>

                <span className="quick-action-text">
                  <strong>
                    View Progress
                  </strong>

                  <small>
                    Track your improvement
                  </small>
                </span>

                <ArrowUpRight size={15} />

              </button>

            </div>

          </div>

        </section>


        {/* ===================================================
            BOTTOM GRID
        ==================================================== */}

        <section className="dashboard-bottom-grid">


          {/* =================================================
              RECENT APPLICATIONS
          ================================================== */}

          <div className="dashboard-card recent-applications-card">

            <div className="dashboard-card-header">

              <div>
                <span className="dashboard-card-eyebrow">
                  APPLICATION TRACKER
                </span>

                <h2>Recent Applications</h2>

                <p>
                  Your latest job applications.
                </p>
              </div>

              <button
                className="dashboard-text-button"
                onClick={() =>
                  goTo("/applications")
                }
              >
                View all
                <ArrowUpRight size={14} />
              </button>

            </div>


            {recentApplications.length === 0 ? (

              <div className="dashboard-empty-state">

                <div className="dashboard-empty-icon">
                  <Briefcase size={20} />
                </div>

                <h3>
                  No applications yet
                </h3>

                <p>
                  Find a real job opportunity and
                  start tracking your applications.
                </p>

                <button
                  onClick={() =>
                    goTo("/jobs")
                  }
                >
                  Explore Jobs
                  <ArrowUpRight size={14} />
                </button>

              </div>

            ) : (

              <div className="applications-list">

                {recentApplications.map(
                  (application, index) => {

                    const role =
                      application?.jobTitle ||
                      application?.role ||
                      "Job Application";

                    const company =
                      application?.company ||
                      "Company";

                    const location =
                      application?.location ||
                      "Location";

                    const status =
                      application?.status ||
                      "Applied";

                    return (
                      <div
                        className="application-row"
                        key={
                          application?.id ||
                          application?._id ||
                          index
                        }
                      >

                        <div className="application-company-icon">
                          <Briefcase size={16} />
                        </div>

                        <div className="application-row-info">

                          <strong>
                            {role}
                          </strong>

                          <span>
                            {company}
                            <i>•</i>
                            {location}
                          </span>

                        </div>

                        <span
                          className={getApplicationStatusClass(
                            status
                          )}
                        >
                          {status}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>

            )}

          </div>


          {/* =================================================
              INTERVIEW PROGRESS
          ================================================== */}

          <div className="dashboard-card interview-progress-card">

            <div className="dashboard-card-header">

              <div>
                <span className="dashboard-card-eyebrow">
                  INTERVIEW PREPARATION
                </span>

                <h2>Interview Progress</h2>

                <p>
                  Keep improving your interview performance.
                </p>
              </div>

              <div className="dashboard-card-header-icon orange-header-icon">
                <Award size={19} />
              </div>

            </div>


            <div className="interview-progress-content">

              <div className="interview-score-box">

                <span>
                  AVERAGE SCORE
                </span>

                <strong>
                  {interviewStats.average || 0}
                  <small>/100</small>
                </strong>

                <div className="dashboard-progress orange-progress">
                  <div
                    style={{
                      width: `${interviewStats.average}%`,
                    }}
                  />
                </div>

              </div>


              <div className="interview-metrics">

                <div>
                  <span className="metric-icon">
                    <Mic size={14} />
                  </span>

                  <div>
                    <strong>
                      {interviewStats.sessions}
                    </strong>

                    <small>
                      Practice sessions
                    </small>
                  </div>
                </div>


                <div>
                  <span className="metric-icon">
                    <Zap size={14} />
                  </span>

                  <div>
                    <strong>
                      {interviewStats.average >= 70
                        ? "Strong"
                        : interviewStats.sessions
                        ? "Improving"
                        : "Start"}
                    </strong>

                    <small>
                      Current performance
                    </small>
                  </div>
                </div>

              </div>


              <button
                className="interview-practice-button"
                onClick={() =>
                  goTo("/interview")
                }
              >
                <PlayCircle size={16} />
                Start Practice
                <ArrowUpRight size={14} />
              </button>

            </div>

          </div>

        </section>


        {/* ===================================================
            BOTTOM CTA
        ==================================================== */}

        <section className="dashboard-cta">

          <div className="dashboard-cta-icon">
            <Sparkles size={20} />
          </div>

          <div className="dashboard-cta-content">

            <span>
              YOUR NEXT STEP
            </span>

            <h2>
              Ready to improve your career profile?
            </h2>

            <p>
              Start with your resume, then explore jobs
              and practice interviews.
            </p>

          </div>

          <button
            onClick={() =>
              goTo(
                resumeScore > 0
                  ? "/jobs"
                  : "/resume"
              )
            }
          >
            {resumeScore > 0
              ? "Explore Jobs"
              : "Analyze Resume"}

            <ArrowUpRight size={15} />
          </button>

        </section>


        {/* ===================================================
            FOOTER
        ==================================================== */}

        <footer className="dashboard-footer">

          <span>
            <Sparkles size={12} />
            CareerAI
          </span>

          <span>
            Build your career with confidence.
          </span>

        </footer>

      </main>

    </div>
  );
}

export default Dashboard;