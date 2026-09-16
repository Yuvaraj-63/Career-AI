import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  GraduationCap,
  Play,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}
      <header className="home-header">
        <nav className="home-navbar">

          {/* Logo */}
          <Link to="/" className="home-logo">
            <div className="home-logo-icon">
              <GraduationCap size={27} />
            </div>

            <span className="home-logo-text">
              Career<span>AI</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="home-nav-links">

            <a href="#home" className="home-nav-link active">
              Home
              <span className="nav-active-line"></span>
            </a>

            <a href="#features" className="home-nav-link">
              Features
            </a>

            <a href="#about" className="home-nav-link">
              About
            </a>

          </div>

          {/* Auth Buttons */}
          <div className="home-auth-buttons">

            <Link to="/login" className="login-button">
              Login
            </Link>

            <Link to="/register" className="get-started-button">
              Get Started
            </Link>

          </div>

        </nav>
      </header>


      {/* ================= HERO ================= */}
      <main id="home">

        <section className="hero-section">

          {/* Background decorations */}
          <div className="hero-bg-left"></div>
          <div className="hero-bg-right"></div>


          <div className="hero-container">

            {/* ================= LEFT HERO ================= */}
            <div className="hero-content">

              {/* Badge */}
              <div className="hero-badge">
                <Sparkles size={16} />
                <span>Your Career, Smarter with AI</span>
              </div>


              {/* Heading */}
              <h1 className="hero-title">
                Build a Better
                <br />
                Tomorrow
                <br />
                with <span>CareerAI</span>
              </h1>


              {/* Description */}
              <p className="hero-description">
                Analyze your resume, find the right opportunities,
                and get ready for interviews — all in one place.
              </p>


              {/* CTA Buttons */}
              <div className="hero-buttons">

                <Link to="/register" className="primary-hero-button">
                  <span>Analyze My Resume</span>

                  <ArrowRight
                    size={19}
                    className="hero-arrow"
                  />
                </Link>


                <button className="secondary-hero-button">
                  <span className="play-icon">
                    <Play
                      size={13}
                      fill="currentColor"
                    />
                  </span>

                  <span>Watch Demo</span>
                </button>

              </div>


              {/* Stats */}
              <div className="hero-stats">

                <Stat
                  number="100+"
                  label="Resumes Analysed"
                />

                <div className="stat-divider"></div>

                <Stat
                  number="50+"
                  label="Job Roles Covered"
                />

                <div className="stat-divider"></div>

                <Stat
                  number="90%"
                  label="User Satisfaction"
                />

              </div>

            </div>


            {/* ================= RIGHT HERO ================= */}
            <div className="hero-visual">

              {/* Main circle */}
              <div className="visual-circle"></div>


              {/* Decorative dots */}
              <div className="green-dot"></div>
              <div className="orange-dot"></div>


              {/* Person / Illustration */}
              <div className="person-container">

                {/* Body */}
                <div className="person-body"></div>


                {/* Head */}
                <div className="person-head"></div>


                {/* Hair */}
                <div className="person-hair"></div>


                {/* Laptop */}
                <div className="laptop">

                  <div className="laptop-screen">

                    <div className="laptop-content">

                      <FileText
                        size={32}
                        className="laptop-file-icon"
                      />

                      <p>
                        Resume Analysis
                      </p>

                    </div>

                  </div>

                  <div className="laptop-base"></div>

                </div>

              </div>


              {/* ================= ATS CARD ================= */}
              <div className="ats-card">

                <p className="floating-card-title">
                  ATS Score
                </p>

                <div className="ats-circle">
                  <span>85%</span>
                </div>

                <div className="ats-status">
                  Great Match!
                </div>

              </div>


              {/* ================= MISSING SKILLS ================= */}
              <div className="missing-skills-card">

                <p className="floating-card-title">
                  Missing Skills
                </p>

                <Skill
                  color="red"
                  name="System Design"
                />

                <Skill
                  color="orange"
                  name="AWS"
                />

                <Skill
                  color="blue"
                  name="Communication"
                />

              </div>


              {/* ================= RECOMMENDED JOBS ================= */}
              <div className="recommended-jobs-card">

                <div className="recommended-title">

                  <p className="floating-card-title">
                    Recommended Jobs
                  </p>

                  <BriefcaseBusiness
                    size={18}
                    className="recommended-icon"
                  />

                </div>

                <Job name="Software Engineer" />
                <Job name="Frontend Developer" />
                <Job name="Data Analyst" />

              </div>

            </div>

          </div>

        </section>


        {/* ================= FEATURES ================= */}
        <section
          id="features"
          className="features-section"
        >

          <div className="section-container">

            <div className="section-heading">

              <p className="section-label">
                Everything You Need
              </p>

              <h2>
                Your career, all in one place.
              </h2>

              <p>
                From improving your resume to preparing for interviews,
                CareerAI helps you move forward with confidence.
              </p>

            </div>


            {/* Feature Cards */}
            <div className="feature-grid">

              <FeatureCard
                to="/resume"
                icon={<FileText />}
                title="Resume Analysis"
                description="Get an AI-powered review with detailed feedback and ATS score."
                bg="blue-card"
                iconBg="blue-icon"
                iconColor="blue-icon-color"
              />


              <FeatureCard
                to="/jobs"
                icon={<BriefcaseBusiness />}
                title="Job Matching"
                description="Discover jobs that match your skills and interests."
                bg="green-card"
                iconBg="green-icon"
                iconColor="green-icon-color"
              />


              <FeatureCard
                to="/interview"
                icon={<Target />}
                title="Interview Preparation"
                description="Practice with AI-generated questions tailored to your target role."
                bg="orange-card"
                iconBg="orange-icon"
                iconColor="orange-icon-color"
              />


              <FeatureCard
                to="/progress"
                icon={<TrendingUp />}
                title="Career Growth"
                description="Identify skill gaps and get personalized learning recommendations."
                bg="pink-card"
                iconBg="pink-icon"
                iconColor="pink-icon-color"
              />

            </div>

          </div>

        </section>


        {/* ================= ABOUT ================= */}
        <section
          id="about"
          className="about-section"
        >

          <div className="section-container">

            <div className="about-grid">

              {/* Left Content */}
              <div className="about-content">

                <p className="section-label">
                  Built for Job Seekers
                </p>

                <h2>
                  Less guessing.
                  <br />
                  More confidence.
                </h2>

                <p className="about-description">
                  CareerAI brings your resume, job applications,
                  skill development and interview preparation together
                  so you can focus on getting the opportunity you want.
                </p>


                <div className="check-list">

                  <CheckItem text="Know exactly what your resume needs" />

                  <CheckItem text="Understand how well you match a job" />

                  <CheckItem text="Prepare specifically for your interviews" />

                </div>

              </div>


              {/* Progress Card */}
              <div className="progress-wrapper">

                <div className="progress-card">

                  <div className="progress-header">

                    <div>

                      <p>
                        Your Career Progress
                      </p>

                      <h3>
                        72%
                      </h3>

                    </div>

                    <div className="progress-icon">
                      <TrendingUp size={26} />
                    </div>

                  </div>


                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>

                  <p className="progress-text">
                    You're making good progress. Keep going!
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================= FOOTER CTA ================= */}
        <section className="footer-cta">

          <div className="footer-cta-content">

            <h2>
              Same You.
              <span> A Brighter Future.</span>
            </h2>

            <p>
              Take the next step in your career today.
            </p>

            <Link
              to="/register"
              className="footer-cta-button"
            >
              Get Started
              <ArrowUpRight size={19} />
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}


/* =====================================================
   STAT COMPONENT
===================================================== */

function Stat({ number, label }) {
  return (
    <div className="stat-item">

      <p className="stat-number">
        {number}
      </p>

      <p className="stat-label">
        {label}
      </p>

    </div>
  );
}


/* =====================================================
   SKILL COMPONENT
===================================================== */

function Skill({ color, name }) {
  return (
    <div className="skill-item">

      <span className={`skill-dot ${color}`}></span>

      <span>
        {name}
      </span>

    </div>
  );
}


/* =====================================================
   JOB COMPONENT
===================================================== */

function Job({ name }) {
  return (
    <div className="recommended-job">

      <span>
        {name}
      </span>

      <ArrowRight
        size={15}
        className="job-arrow"
      />

    </div>
  );
}


/* =====================================================
   FEATURE CARD
===================================================== */

function FeatureCard({
  to,
  icon,
  title,
  description,
  bg,
  iconBg,
  iconColor,
}) {
  return (
    <Link
      to={to}
      className={`feature-card ${bg}`}
    >

      <div className={`feature-icon ${iconBg} ${iconColor}`}>
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

      <div className="learn-more">
        Learn more
        <ArrowRight size={16} />
      </div>

    </Link>
  );
}


/* =====================================================
   CHECK ITEM
===================================================== */

function CheckItem({ text }) {
  return (
    <div className="check-item">

      <CheckCircle2
        size={21}
        className="check-icon"
      />

      <span>
        {text}
      </span>

    </div>
  );
}


export default Home;