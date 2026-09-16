import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Target,
  TrendingUp,
} from "lucide-react";

function Progress() {
  const navigate = useNavigate();

  const [selectedSkill, setSelectedSkill] = useState(null);

  const skills = [
    {
      name: "Java",
      level: 90,
      status: "Strong",
      color: "blue",
    },
    {
      name: "React",
      level: 75,
      status: "Good",
      color: "green",
    },
    {
      name: "Node.js",
      level: 65,
      status: "Improving",
      color: "orange",
    },
    {
      name: "SQL",
      level: 60,
      status: "Improving",
      color: "purple",
    },
  ];

  const goals = [
    {
      title: "Improve Resume Score",
      description: "Complete the recommended resume improvements.",
      progress: 82,
      icon: <FileText size={20} />,
      color: "blue",
    },
    {
      title: "Strengthen Technical Skills",
      description: "Work on your identified skill gaps.",
      progress: 68,
      icon: <BookOpen size={20} />,
      color: "green",
    },
    {
      title: "Apply to Matching Jobs",
      description: "Apply to jobs that match your current profile.",
      progress: 55,
      icon: <BriefcaseBusiness size={20} />,
      color: "orange",
    },
    {
      title: "Prepare for Interviews",
      description: "Complete interview practice sessions.",
      progress: 45,
      icon: <Target size={20} />,
      color: "purple",
    },
  ];

  const recommendations = [
    {
      title: "Learn REST API Design",
      description:
        "Improve your backend development skills and strengthen your Node.js profile.",
      type: "Skill Development",
      icon: <BookOpen size={20} />,
    },
    {
      title: "Add More Measurable Achievements",
      description:
        "Add numbers and measurable results to your project and experience descriptions.",
      type: "Resume Improvement",
      icon: <FileText size={20} />,
    },
    {
      title: "Practice Technical Interviews",
      description:
        "Practice Java, React and backend questions to improve your interview confidence.",
      type: "Interview Preparation",
      icon: <Target size={20} />,
    },
  ];

  return (
    <div className="progress-page">

      {/* ================= HEADER ================= */}
      <header className="progress-header">

        <div className="progress-header-left">

          <button
            className="progress-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

          <div className="progress-title-area">
            <div className="progress-page-icon">
              <TrendingUp size={22} />
            </div>

            <div>
              <h1>Career Progress</h1>
              <p>Track your growth and work towards your career goals.</p>
            </div>
          </div>

        </div>

        <button
          className="progress-dashboard-btn"
          onClick={() => navigate("/dashboard")}
        >
          <GraduationCap size={18} />
          CareerAI
        </button>

      </header>


      {/* ================= MAIN ================= */}
      <main className="progress-main">

        {/* ================= OVERVIEW ================= */}
        <section className="progress-overview">

          <div className="progress-overview-content">

            <div className="progress-overview-label">
              <TrendingUp size={17} />
              YOUR CAREER JOURNEY
            </div>

            <h2>
              You're making{" "}
              <span>good progress.</span>
            </h2>

            <p>
              Keep improving your skills, resume and interview preparation
              to move closer to your career goals.
            </p>

            <div className="overall-progress-wrapper">

              <div className="overall-progress-top">
                <span>Overall Career Progress</span>
                <strong>72%</strong>
              </div>

              <div className="overall-progress-bar">
                <div
                  className="overall-progress-fill"
                  style={{ width: "72%" }}
                />
              </div>

              <span className="overall-progress-text">
                You're ahead of your previous progress.
              </span>

            </div>

          </div>


          <div className="progress-score-circle">

            <div className="progress-circle-inner">

              <TrendingUp size={25} />

              <strong>72%</strong>

              <span>Overall</span>

            </div>

          </div>

        </section>


        {/* ================= STATS ================= */}
        <section className="progress-stats">

          <ProgressStat
            icon={<Award size={21} />}
            value="82%"
            label="Resume Score"
            color="blue"
          />

          <ProgressStat
            icon={<BookOpen size={21} />}
            value="4"
            label="Skills Tracked"
            color="green"
          />

          <ProgressStat
            icon={<BriefcaseBusiness size={21} />}
            value="12"
            label="Applications"
            color="orange"
          />

          <ProgressStat
            icon={<Target size={21} />}
            value="3"
            label="Interviews"
            color="purple"
          />

        </section>


        {/* ================= SKILLS ================= */}
        <section className="progress-section">

          <div className="progress-section-heading">

            <div>
              <span className="progress-kicker">
                SKILLS
              </span>

              <h2>Skill Development</h2>

              <p>
                Your current skill levels based on your CareerAI profile.
              </p>
            </div>

            <button
              className="progress-small-btn"
              onClick={() => navigate("/resume")}
            >
              Improve Skills
              <ArrowRight size={16} />
            </button>

          </div>


          <div className="skills-progress-grid">

            {skills.map((skill) => (
              <button
                key={skill.name}
                className={`skill-progress-card ${
                  selectedSkill === skill.name ? "selected" : ""
                }`}
                onClick={() =>
                  setSelectedSkill(
                    selectedSkill === skill.name ? null : skill.name
                  )
                }
              >

                <div className="skill-card-top">

                  <div className="skill-name-wrapper">

                    <div className={`skill-mini-icon ${skill.color}`}>
                      <TrendingUp size={17} />
                    </div>

                    <div>
                      <h3>{skill.name}</h3>
                      <span>{skill.status}</span>
                    </div>

                  </div>

                  <strong>{skill.level}%</strong>

                </div>


                <div className="skill-progress-bar">

                  <div
                    className={`skill-progress-fill ${skill.color}`}
                    style={{ width: `${skill.level}%` }}
                  />

                </div>


                <div className="skill-card-bottom">

                  <span>
                    {skill.level >= 80
                      ? "Excellent"
                      : skill.level >= 70
                      ? "Good progress"
                      : "Needs improvement"}
                  </span>

                  <ChevronRight size={16} />

                </div>

              </button>
            ))}

          </div>

        </section>


        {/* ================= GOALS ================= */}
        <section className="progress-section">

          <div className="progress-section-heading">

            <div>
              <span className="progress-kicker">
                GOALS
              </span>

              <h2>Your Career Goals</h2>

              <p>
                Keep working on these areas to improve your overall profile.
              </p>
            </div>

          </div>


          <div className="career-goals-grid">

            {goals.map((goal) => (
              <div
                className="career-goal-card"
                key={goal.title}
              >

                <div className="career-goal-top">

                  <div className={`career-goal-icon ${goal.color}`}>
                    {goal.icon}
                  </div>

                  <span className="goal-percentage">
                    {goal.progress}%
                  </span>

                </div>


                <h3>{goal.title}</h3>

                <p>{goal.description}</p>


                <div className="goal-progress-bar">

                  <div
                    className={`goal-progress-fill ${goal.color}`}
                    style={{
                      width: `${goal.progress}%`,
                    }}
                  />

                </div>


                <div className="goal-footer">

                  <span>
                    {goal.progress >= 75
                      ? "Almost complete"
                      : "Keep going"}
                  </span>

                  {goal.progress >= 75 ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}

                </div>

              </div>
            ))}

          </div>

        </section>


        {/* ================= RECOMMENDATIONS ================= */}
        <section className="progress-section">

          <div className="progress-section-heading">

            <div>
              <span className="progress-kicker">
                RECOMMENDED NEXT STEPS
              </span>

              <h2>What you should focus on next</h2>

              <p>
                A few improvements that can help strengthen your profile.
              </p>
            </div>

          </div>


          <div className="recommendations-list">

            {recommendations.map((item, index) => (

              <div
                className="recommendation-card"
                key={item.title}
              >

                <div className="recommendation-number">
                  {index + 1}
                </div>


                <div className="recommendation-icon">
                  {item.icon}
                </div>


                <div className="recommendation-content">

                  <span className="recommendation-type">
                    {item.type}
                  </span>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                </div>


                <button
                  className="recommendation-action"
                  onClick={() => {
                    if (item.type === "Resume Improvement") {
                      navigate("/resume");
                    } else if (
                      item.type === "Interview Preparation"
                    ) {
                      navigate("/interview");
                    } else {
                      navigate("/jobs");
                    }
                  }}
                >
                  Start
                  <ArrowRight size={16} />
                </button>

              </div>

            ))}

          </div>

        </section>


        {/* ================= BOTTOM CTA ================= */}
        <section className="progress-bottom-cta">

          <div className="progress-bottom-icon">
            <GraduationCap size={25} />
          </div>

          <div>

            <h2>
              Ready to take the next step?
            </h2>

            <p>
              Continue improving your profile and get closer to your dream job.
            </p>

          </div>

          <div className="progress-bottom-actions">

            <button
              onClick={() => navigate("/resume")}
            >
              Resume Analysis
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate("/jobs")}
            >
              Find Jobs
              <ArrowRight size={16} />
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}


/* =====================================================
   PROGRESS STAT
===================================================== */

function ProgressStat({
  icon,
  value,
  label,
  color,
}) {
  return (
    <div className="progress-stat-card">

      <div className={`progress-stat-icon ${color}`}>
        {icon}
      </div>

      <div>

        <strong>{value}</strong>

        <span>{label}</span>

      </div>

    </div>
  );
}


export default Progress;