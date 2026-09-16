import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  ChevronRight,
  Clock3,
  History,
  Lightbulb,
  Play,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
  BarChart3,
  Code2,
  Sparkles,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";
const HISTORY_KEY = "careerai_interview_history";

const DOMAINS = [
  "Java",
  "Python",
  "JavaScript",
  "React.js",
  "Node.js",
  "SQL",
  "DSA",
  "Full Stack",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const PASS_SCORE = 70;

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */

const safeLocalStorageGet = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error("Unable to read localStorage:", error);
    return fallback;
  }
};

const safeLocalStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Unable to save to localStorage:", error);
    return false;
  }
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Unknown date";
  }

  try {
    return new Date(dateValue).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Unknown date";
  }
};

const getScoreLabel = (score) => {
  if (score >= 90) {
    return "Excellent";
  }

  if (score >= 80) {
    return "Very Good";
  }

  if (score >= 70) {
    return "Good";
  }

  if (score >= 50) {
    return "Needs Improvement";
  }

  return "Needs Practice";
};

const getScoreClass = (score) => {
  if (score >= 70) {
    return "score-good";
  }

  if (score >= 50) {
    return "score-medium";
  }

  return "score-low";
};

/* ---------------------------------------------------------
   Component
--------------------------------------------------------- */

export default function Interview() {
  const navigate = useNavigate();

  /* -------------------------------------------------------
     Setup state
  ------------------------------------------------------- */

  const [selectedRole, setSelectedRole] = useState("Java");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState("Medium");

  /* -------------------------------------------------------
     Questions
  ------------------------------------------------------- */

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  /* -------------------------------------------------------
     Answer / evaluation
  ------------------------------------------------------- */

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  /* -------------------------------------------------------
     Page / loading
  ------------------------------------------------------- */

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  /* -------------------------------------------------------
     Session
  ------------------------------------------------------- */

  const [sessionResults, setSessionResults] = useState([]);
  const [sessionSummary, setSessionSummary] = useState(null);

  /* -------------------------------------------------------
     History
  ------------------------------------------------------- */

  const [history, setHistory] = useState([]);

  /* -------------------------------------------------------
     Timer
  ------------------------------------------------------- */

  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  /* -------------------------------------------------------
     Load history
  ------------------------------------------------------- */

  useEffect(() => {
    const storedHistory = safeLocalStorageGet(
      HISTORY_KEY,
      []
    );

    if (Array.isArray(storedHistory)) {
      setHistory(storedHistory);
    }
  }, []);

  /* -------------------------------------------------------
     Timer
  ------------------------------------------------------- */

  useEffect(() => {
    if (!started || showSummary || !sessionStartTime) {
      return undefined;
    }

    const interval = setInterval(() => {
      const difference = Math.floor(
        (Date.now() - sessionStartTime) / 1000
      );

      setElapsedSeconds(difference);
    }, 1000);

    return () => clearInterval(interval);
  }, [
    started,
    showSummary,
    sessionStartTime,
  ]);

  /* -------------------------------------------------------
     Current question
  ------------------------------------------------------- */

  const currentQuestion = questions[currentQuestionIndex];

  const progressPercentage = useMemo(() => {
    if (!questions.length) {
      return 0;
    }

    return (
      ((currentQuestionIndex + 1) / questions.length) *
      100
    );
  }, [currentQuestionIndex, questions.length]);

  /* -------------------------------------------------------
     Timer formatter
  ------------------------------------------------------- */

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }, [elapsedSeconds]);

  /* -------------------------------------------------------
     Fetch randomized questions
  ------------------------------------------------------- */

  const fetchQuestions = async (
    role = selectedRole,
    difficulty = selectedDifficulty
  ) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        domain: role,
        difficulty,
      });

      const response = await fetch(
        `${API_URL}/interview/questions?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load interview questions."
        );
      }

      if (
        !Array.isArray(data.questions) ||
        data.questions.length === 0
      ) {
        throw new Error(
          "No interview questions were returned."
        );
      }

      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setAnswer("");
      setFeedback(null);
      setSessionResults([]);
      setSessionSummary(null);
      setShowSummary(false);
      setError("");

      return true;
    } catch (err) {
      console.error("Question fetch error:", err);

      setQuestions([]);
      setError(
        err.message ||
          "Unable to load interview questions. Make sure the backend is running."
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
     Start practice
  ------------------------------------------------------- */

  const startPractice = async () => {
    const success = await fetchQuestions(
      selectedRole,
      selectedDifficulty
    );

    if (!success) {
      return;
    }

    setStarted(true);
    setShowSummary(false);
    setSessionSummary(null);
    setSessionResults([]);
    setSessionStartTime(Date.now());
    setElapsedSeconds(0);
    setAnswer("");
    setFeedback(null);
  };

  /* -------------------------------------------------------
     Restart practice
  ------------------------------------------------------- */

  const restartPractice = async () => {
    const success = await fetchQuestions(
      selectedRole,
      selectedDifficulty
    );

    if (!success) {
      return;
    }

    setStarted(true);
    setShowSummary(false);
    setSessionSummary(null);
    setSessionResults([]);
    setSessionStartTime(Date.now());
    setElapsedSeconds(0);
    setAnswer("");
    setFeedback(null);
  };

  /* -------------------------------------------------------
     Role change
  ------------------------------------------------------- */

  const handleRoleChange = async (role) => {
    setSelectedRole(role);

    if (started) {
      await fetchQuestions(
        role,
        selectedDifficulty
      );
    }
  };

  /* -------------------------------------------------------
     Difficulty change
  ------------------------------------------------------- */

  const handleDifficultyChange = async (difficulty) => {
    setSelectedDifficulty(difficulty);

    if (started) {
      await fetchQuestions(
        selectedRole,
        difficulty
      );
    }
  };

  /* -------------------------------------------------------
     Evaluate answer
  ------------------------------------------------------- */

  const handleGetFeedback = async () => {
    if (!currentQuestion) {
      return;
    }

    if (!answer.trim()) {
      setError(
        "Please write an answer before getting feedback."
      );
      return;
    }

    setEvaluating(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/interview/evaluate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question:
              currentQuestion.question ||
              currentQuestion.text ||
              "",
            answer: answer.trim(),
            domain:
              currentQuestion.domain ||
              selectedRole,
            difficulty:
              currentQuestion.difficulty ||
              selectedDifficulty,
            category:
              currentQuestion.category ||
              "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to evaluate your answer."
        );
      }

      const evaluation = data.evaluation;

      setFeedback(evaluation);

      /* -----------------------------------------------
         Store result for current question.

         If user evaluates the same question again,
         replace the previous result rather than
         creating duplicates.
      ------------------------------------------------ */

      setSessionResults((previousResults) => {
        const questionId =
          currentQuestion.id ||
          currentQuestion.questionId ||
          currentQuestionIndex;

        const result = {
          questionId,
          question:
            currentQuestion.question ||
            currentQuestion.text ||
            "",
          category:
            currentQuestion.category ||
            "General",
          score:
            Number(evaluation.score) || 0,
          verdict:
            evaluation.verdict ||
            getScoreLabel(
              Number(evaluation.score) || 0
            ),
          strengths:
            Array.isArray(evaluation.strengths)
              ? evaluation.strengths
              : [],
          suggestions:
            Array.isArray(evaluation.suggestions)
              ? evaluation.suggestions
              : [],
          matchedKeywords:
            Array.isArray(
              evaluation.matchedKeywords
            )
              ? evaluation.matchedKeywords
              : [],
          completedAt: new Date().toISOString(),
        };

        const existingIndex =
          previousResults.findIndex(
            (item) =>
              String(item.questionId) ===
              String(questionId)
          );

        if (existingIndex === -1) {
          return [...previousResults, result];
        }

        const updated = [...previousResults];
        updated[existingIndex] = result;

        return updated;
      });
    } catch (err) {
      console.error(
        "Answer evaluation error:",
        err
      );

      setError(
        err.message ||
          "Unable to evaluate your answer."
      );
    } finally {
      setEvaluating(false);
    }
  };

  /* -------------------------------------------------------
     Build session summary
  ------------------------------------------------------- */

  const buildSessionSummary = (
    finalResults = sessionResults
  ) => {
    if (!finalResults.length) {
      return null;
    }

    const scores = finalResults.map(
      (item) => Number(item.score) || 0
    );

    const totalScore = scores.reduce(
      (sum, score) => sum + score,
      0
    );

    const averageScore = Math.round(
      totalScore / scores.length
    );

    const strongAnswers = finalResults.filter(
      (item) => Number(item.score) >= PASS_SCORE
    ).length;

    const needsImprovement =
      finalResults.length - strongAnswers;

    /* -----------------------------------------------
       Category performance
    ------------------------------------------------ */

    const categoryMap = {};

    finalResults.forEach((item) => {
      const category =
        item.category || "General";

      if (!categoryMap[category]) {
        categoryMap[category] = {
          total: 0,
          score: 0,
        };
      }

      categoryMap[category].total += 1;
      categoryMap[category].score +=
        Number(item.score) || 0;
    });

    const categoryPerformance = Object.entries(
      categoryMap
    )
      .map(([category, value]) => ({
        category,
        score: Math.round(
          value.score / value.total
        ),
        count: value.total,
      }))
      .sort((a, b) => b.score - a.score);

    const strongAreas = categoryPerformance
      .filter((item) => item.score >= PASS_SCORE)
      .slice(0, 3)
      .map((item) => item.category);

    const improveAreas = categoryPerformance
      .filter((item) => item.score < PASS_SCORE)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((item) => item.category);

    if (
      strongAreas.length === 0 &&
      categoryPerformance.length > 0
    ) {
      strongAreas.push(
        categoryPerformance[0].category
      );
    }

    if (
      improveAreas.length === 0 &&
      categoryPerformance.length > 0
    ) {
      improveAreas.push(
        categoryPerformance[
          categoryPerformance.length - 1
        ].category
      );
    }

    return {
      totalScore,
      averageScore,
      answeredQuestions: finalResults.length,
      totalQuestions: questions.length || 5,
      strongAnswers,
      needsImprovement,
      strongAreas,
      improveAreas,
      categoryPerformance,
      durationSeconds: elapsedSeconds,
      completedAt: new Date().toISOString(),
      domain: selectedRole,
      difficulty: selectedDifficulty,
    };
  };

  /* -------------------------------------------------------
     Save session to history
  ------------------------------------------------------- */

  const saveSessionToHistory = (
    summary,
    results
  ) => {
    if (!summary) {
      return;
    }

    const historyItem = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,
      ...summary,
      results,
    };

    const existingHistory = safeLocalStorageGet(
      HISTORY_KEY,
      []
    );

    const nextHistory = [
      historyItem,
      ...(Array.isArray(existingHistory)
        ? existingHistory
        : []),
    ].slice(0, 20);

    const saved = safeLocalStorageSet(
      HISTORY_KEY,
      nextHistory
    );

    if (saved) {
      setHistory(nextHistory);
    }
  };

  /* -------------------------------------------------------
     Finish session
  ------------------------------------------------------- */

  const finishSession = (results) => {
    const summary = buildSessionSummary(results);

    if (!summary) {
      return;
    }

    setSessionSummary(summary);
    setShowSummary(true);

    saveSessionToHistory(
      summary,
      results
    );
  };

  /* -------------------------------------------------------
     Next question
  ------------------------------------------------------- */

  const nextQuestion = () => {
    if (!feedback) {
      setError(
        "Please evaluate your answer before continuing."
      );
      return;
    }

    if (
      currentQuestionIndex >=
      questions.length - 1
    ) {
      /*
        State updates are asynchronous.

        At this point sessionResults may not yet
        contain the latest evaluation, so explicitly
        create the final result here.
      */

      const questionId =
        currentQuestion.id ||
        currentQuestion.questionId ||
        currentQuestionIndex;

      const finalResult = {
        questionId,
        question:
          currentQuestion.question ||
          currentQuestion.text ||
          "",
        category:
          currentQuestion.category ||
          "General",
        score:
          Number(feedback.score) || 0,
        verdict:
          feedback.verdict ||
          getScoreLabel(
            Number(feedback.score) || 0
          ),
        strengths:
          Array.isArray(feedback.strengths)
            ? feedback.strengths
            : [],
        suggestions:
          Array.isArray(feedback.suggestions)
            ? feedback.suggestions
            : [],
        matchedKeywords:
          Array.isArray(
            feedback.matchedKeywords
          )
            ? feedback.matchedKeywords
            : [],
        completedAt: new Date().toISOString(),
      };

      const existingIndex =
        sessionResults.findIndex(
          (item) =>
            String(item.questionId) ===
            String(questionId)
        );

      let finalResults;

      if (existingIndex === -1) {
        finalResults = [
          ...sessionResults,
          finalResult,
        ];
      } else {
        finalResults = [...sessionResults];
        finalResults[existingIndex] =
          finalResult;
      }

      setSessionResults(finalResults);
      finishSession(finalResults);

      return;
    }

    setCurrentQuestionIndex(
      (previous) => previous + 1
    );

    setAnswer("");
    setFeedback(null);
    setError("");
  };

  /* -------------------------------------------------------
     Back to setup
  ------------------------------------------------------- */

  const backToInterviewSetup = () => {
    setStarted(false);
    setShowSummary(false);
    setSessionSummary(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswer("");
    setFeedback(null);
    setSessionResults([]);
    setSessionStartTime(null);
    setElapsedSeconds(0);
    setError("");
  };

  /* -------------------------------------------------------
     Delete history
  ------------------------------------------------------- */

  const clearHistory = () => {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error(
        "Unable to clear history:",
        error
      );
    }

    setHistory([]);
  };

  /* -------------------------------------------------------
     Score helpers
  ------------------------------------------------------- */

  const summaryScore =
    sessionSummary?.averageScore || 0;

  /* =======================================================
     SUMMARY SCREEN
  ======================================================= */

  if (showSummary && sessionSummary) {
    return (
      <div className="interview-page">
        <style>{`
          .interview-page {
            min-height: 100vh;
            background: #f5f8fc;
            color: #172033;
            padding: 28px;
            box-sizing: border-box;
          }

          .interview-container {
            max-width: 1180px;
            margin: 0 auto;
          }

          .interview-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 28px;
          }

          .back-button {
            border: none;
            background: white;
            border-radius: 12px;
            padding: 11px 16px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            color: #344054;
            font-weight: 600;
            box-shadow: 0 2px 10px rgba(16, 24, 40, 0.06);
          }

          .summary-title {
            text-align: center;
            margin-bottom: 30px;
          }

          .summary-title .icon {
            width: 62px;
            height: 62px;
            border-radius: 18px;
            margin: 0 auto 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #eaf2ff;
            color: #2563eb;
          }

          .summary-title h1 {
            margin: 0 0 8px;
            font-size: 32px;
          }

          .summary-title p {
            margin: 0;
            color: #667085;
          }

          .summary-score-card {
            background: white;
            border-radius: 24px;
            padding: 30px;
            box-shadow: 0 8px 30px rgba(16, 24, 40, 0.07);
            margin-bottom: 22px;
          }

          .score-main {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 34px;
            flex-wrap: wrap;
          }

          .score-circle {
            width: 170px;
            height: 170px;
            border-radius: 50%;
            border: 12px solid #2563eb;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f8fbff;
          }

          .score-circle strong {
            font-size: 48px;
            line-height: 1;
          }

          .score-circle span {
            color: #667085;
            margin-top: 6px;
          }

          .score-info h2 {
            margin: 0 0 8px;
            font-size: 26px;
          }

          .score-info p {
            margin: 5px 0;
            color: #667085;
          }

          .summary-progress {
            margin-top: 26px;
          }

          .progress-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 9px;
            font-size: 14px;
            color: #667085;
          }

          .progress-track {
            width: 100%;
            height: 12px;
            background: #e7edf5;
            border-radius: 999px;
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            border-radius: inherit;
            background: #2563eb;
          }

          .summary-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 22px;
          }

          .summary-stat {
            background: white;
            padding: 22px;
            border-radius: 18px;
            box-shadow: 0 5px 20px rgba(16, 24, 40, 0.05);
          }

          .summary-stat .stat-icon {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: #eef4ff;
            color: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 13px;
          }

          .summary-stat strong {
            display: block;
            font-size: 26px;
            margin-bottom: 5px;
          }

          .summary-stat span {
            color: #667085;
            font-size: 14px;
          }

          .summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 22px;
            margin-bottom: 22px;
          }

          .summary-panel {
            background: white;
            padding: 24px;
            border-radius: 20px;
            box-shadow: 0 5px 20px rgba(16, 24, 40, 0.05);
          }

          .summary-panel h3 {
            margin: 0 0 18px;
            font-size: 19px;
          }

          .area-list {
            display: flex;
            flex-direction: column;
            gap: 11px;
          }

          .area-item {
            padding: 13px 15px;
            border-radius: 12px;
            background: #f7f9fc;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .area-item svg {
            flex-shrink: 0;
          }

          .category-row {
            margin-bottom: 15px;
          }

          .category-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 7px;
            font-size: 14px;
          }

          .category-header span:first-child {
            color: #344054;
            font-weight: 600;
          }

          .category-header span:last-child {
            color: #667085;
          }

          .category-bar {
            height: 9px;
            background: #edf1f6;
            border-radius: 999px;
            overflow: hidden;
          }

          .category-bar-fill {
            height: 100%;
            background: #2563eb;
            border-radius: inherit;
          }

          .summary-actions {
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 28px;
          }

          .primary-button,
          .secondary-button {
            border: none;
            border-radius: 12px;
            padding: 13px 20px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 9px;
            cursor: pointer;
          }

          .primary-button {
            background: #2563eb;
            color: white;
          }

          .secondary-button {
            background: white;
            color: #344054;
            box-shadow: 0 2px 10px rgba(16, 24, 40, 0.08);
          }

          @media (max-width: 800px) {
            .summary-stats {
              grid-template-columns: repeat(2, 1fr);
            }

            .summary-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 520px) {
            .interview-page {
              padding: 16px;
            }

            .summary-stats {
              grid-template-columns: 1fr;
            }

            .summary-title h1 {
              font-size: 26px;
            }

            .score-circle {
              width: 140px;
              height: 140px;
            }
          }
        `}</style>

        <div className="interview-container">
          <div className="interview-header">
            <button
              className="back-button"
              onClick={backToInterviewSetup}
            >
              <ArrowLeft size={18} />
              Back to Interview
            </button>
          </div>

          <div className="summary-title">
            <div className="icon">
              <Trophy size={30} />
            </div>

            <h1>Interview Session Complete!</h1>

            <p>
              Here is your performance summary for
              this practice session.
            </p>
          </div>

          <div className="summary-score-card">
            <div className="score-main">
              <div className="score-circle">
                <strong>
                  {sessionSummary.averageScore}
                </strong>
                <span>/ 100</span>
              </div>

              <div className="score-info">
                <h2>
                  {getScoreLabel(
                    sessionSummary.averageScore
                  )}
                </h2>

                <p>
                  <strong>
                    {sessionSummary.domain}
                  </strong>{" "}
                  · {sessionSummary.difficulty}
                </p>

                <p>
                  You answered{" "}
                  <strong>
                    {
                      sessionSummary.answeredQuestions
                    }
                  </strong>{" "}
                  questions.
                </p>

                <p>
                  Session duration:{" "}
                  <strong>
                    {Math.floor(
                      sessionSummary.durationSeconds /
                        60
                    )}{" "}
                    min{" "}
                    {sessionSummary.durationSeconds %
                      60}{" "}
                    sec
                  </strong>
                </p>
              </div>
            </div>

            <div className="summary-progress">
              <div className="progress-label">
                <span>Overall Performance</span>
                <span>
                  {sessionSummary.averageScore}%
                </span>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(
                      sessionSummary.averageScore,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="summary-stats">
            <div className="summary-stat">
              <div className="stat-icon">
                <Target size={21} />
              </div>

              <strong>
                {
                  sessionSummary.answeredQuestions
                }
              </strong>

              <span>Questions Answered</span>
            </div>

            <div className="summary-stat">
              <div className="stat-icon">
                <CheckCircle size={21} />
              </div>

              <strong>
                {sessionSummary.strongAnswers}
              </strong>

              <span>Strong Answers</span>
            </div>

            <div className="summary-stat">
              <div className="stat-icon">
                <XCircle size={21} />
              </div>

              <strong>
                {sessionSummary.needsImprovement}
              </strong>

              <span>Need Improvement</span>
            </div>

            <div className="summary-stat">
              <div className="stat-icon">
                <Clock3 size={21} />
              </div>

              <strong>
                {Math.floor(
                  sessionSummary.durationSeconds /
                    60
                )}{" "}
                min
              </strong>

              <span>Session Time</span>
            </div>
          </div>

          <div className="summary-grid">
            <div className="summary-panel">
              <h3>💪 Strong Areas</h3>

              <div className="area-list">
                {sessionSummary.strongAreas.length >
                0 ? (
                  sessionSummary.strongAreas.map(
                    (area, index) => (
                      <div
                        className="area-item"
                        key={`${area}-${index}`}
                      >
                        <CheckCircle
                          size={18}
                        />
                        <span>{area}</span>
                      </div>
                    )
                  )
                ) : (
                  <div className="area-item">
                    Keep practicing to build
                    stronger areas.
                  </div>
                )}
              </div>
            </div>

            <div className="summary-panel">
              <h3>🎯 Areas to Improve</h3>

              <div className="area-list">
                {sessionSummary.improveAreas.length >
                0 ? (
                  sessionSummary.improveAreas.map(
                    (area, index) => (
                      <div
                        className="area-item"
                        key={`${area}-${index}`}
                      >
                        <Lightbulb
                          size={18}
                        />
                        <span>{area}</span>
                      </div>
                    )
                  )
                ) : (
                  <div className="area-item">
                    Excellent! No major weak
                    areas detected.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="summary-panel">
            <h3>
              <BarChart3
                size={20}
                style={{
                  verticalAlign: "middle",
                  marginRight: 8,
                }}
              />
              Category Performance
            </h3>

            {sessionSummary.categoryPerformance.map(
              (item, index) => (
                <div
                  className="category-row"
                  key={`${item.category}-${index}`}
                >
                  <div className="category-header">
                    <span>
                      {item.category}
                    </span>

                    <span>
                      {item.score}%
                    </span>
                  </div>

                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: `${Math.min(
                          item.score,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}

            <div className="summary-actions">
              <button
                className="primary-button"
                onClick={restartPractice}
              >
                <RotateCcw size={18} />
                Practice Again
              </button>

              <button
                className="secondary-button"
                onClick={backToInterviewSetup}
              >
                <ArrowLeft size={18} />
                Back to Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     PRACTICE SCREEN
  ======================================================= */

  if (started && currentQuestion) {
    return (
      <div className="interview-page">
        <style>{`
          .interview-page {
            min-height: 100vh;
            background: #f5f8fc;
            color: #172033;
            padding: 28px;
            box-sizing: border-box;
          }

          .interview-container {
            max-width: 1100px;
            margin: 0 auto;
          }

          .practice-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            margin-bottom: 20px;
          }

          .practice-back {
            border: none;
            background: white;
            border-radius: 12px;
            padding: 11px 15px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-weight: 600;
            color: #344054;
            box-shadow: 0 2px 10px rgba(16, 24, 40, 0.06);
          }

          .practice-meta {
            display: flex;
            align-items: center;
            gap: 9px;
            flex-wrap: wrap;
          }

          .meta-pill {
            background: white;
            padding: 8px 12px;
            border-radius: 999px;
            color: #475467;
            font-size: 13px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .timer-pill {
            color: #2563eb;
          }

          .question-progress {
            margin-bottom: 22px;
          }

          .progress-text {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            color: #667085;
            font-size: 14px;
          }

          .progress-track {
            height: 9px;
            background: #e4eaf2;
            border-radius: 999px;
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            background: #2563eb;
            border-radius: inherit;
            transition: width 0.3s ease;
          }

          .question-card {
            background: white;
            border-radius: 22px;
            padding: 30px;
            box-shadow: 0 8px 30px rgba(16, 24, 40, 0.07);
            margin-bottom: 20px;
          }

          .question-labels {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 18px;
          }

          .question-badge {
            background: #eef4ff;
            color: #2563eb;
            padding: 7px 11px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
          }

          .question-badge.difficulty {
            background: #f2f4f7;
            color: #475467;
          }

          .question-card h1 {
            font-size: 27px;
            line-height: 1.4;
            margin: 0 0 25px;
          }

          .answer-label {
            font-weight: 700;
            margin-bottom: 10px;
            display: block;
          }

          .answer-box {
            width: 100%;
            min-height: 210px;
            box-sizing: border-box;
            border: 1px solid #d9e0ea;
            border-radius: 15px;
            padding: 16px;
            font-size: 15px;
            line-height: 1.6;
            resize: vertical;
            outline: none;
            font-family: inherit;
            color: #172033;
          }

          .answer-box:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }

          .answer-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            margin-top: 12px;
          }

          .word-count {
            color: #667085;
            font-size: 13px;
          }

          .evaluate-button,
          .next-button {
            border: none;
            border-radius: 12px;
            padding: 13px 19px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
          }

          .evaluate-button {
            background: #2563eb;
            color: white;
          }

          .evaluate-button:disabled,
          .next-button:disabled {
            opacity: 0.55;
            cursor: not-allowed;
          }

          .feedback-card {
            background: white;
            border-radius: 22px;
            padding: 28px;
            box-shadow: 0 8px 30px rgba(16, 24, 40, 0.07);
            margin-bottom: 20px;
          }

          .feedback-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 18px;
            flex-wrap: wrap;
            margin-bottom: 20px;
          }

          .feedback-header h2 {
            margin: 0 0 5px;
            font-size: 22px;
          }

          .feedback-header p {
            margin: 0;
            color: #667085;
          }

          .feedback-score {
            min-width: 90px;
            height: 90px;
            border-radius: 18px;
            background: #f3f7ff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .feedback-score strong {
            font-size: 29px;
          }

          .feedback-score span {
            font-size: 12px;
            color: #667085;
          }

          .breakdown-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 13px;
            margin-bottom: 22px;
          }

          .breakdown-item {
            background: #f8fafc;
            padding: 15px;
            border-radius: 14px;
          }

          .breakdown-item span {
            display: block;
            color: #667085;
            font-size: 13px;
            margin-bottom: 5px;
          }

          .breakdown-item strong {
            font-size: 20px;
          }

          .feedback-section {
            margin-top: 21px;
          }

          .feedback-section h3 {
            font-size: 16px;
            margin: 0 0 10px;
          }

          .feedback-list {
            margin: 0;
            padding-left: 20px;
            color: #475467;
            line-height: 1.65;
          }

          .keyword-list {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
          }

          .keyword {
            padding: 6px 10px;
            background: #edf4ff;
            color: #2563eb;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
          }

          .improved-answer {
            background: #f8fafc;
            border-left: 4px solid #2563eb;
            padding: 15px 17px;
            border-radius: 0 12px 12px 0;
            color: #475467;
            line-height: 1.65;
          }

          .interview-tip {
            background: #fff8e7;
            padding: 14px 16px;
            border-radius: 12px;
            color: #805b00;
            line-height: 1.55;
          }

          .next-row {
            display: flex;
            justify-content: flex-end;
            margin-top: 23px;
          }

          .next-button {
            background: #172033;
            color: white;
          }

          .error-message {
            background: #fff0f0;
            border: 1px solid #ffd2d2;
            color: #b42318;
            padding: 12px 14px;
            border-radius: 11px;
            margin-bottom: 18px;
          }

          .spinner {
            width: 17px;
            height: 17px;
            border: 2px solid rgba(255,255,255,0.35);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 750px) {
            .interview-page {
              padding: 16px;
            }

            .practice-topbar {
              align-items: flex-start;
              flex-direction: column;
            }

            .question-card,
            .feedback-card {
              padding: 20px;
            }

            .breakdown-grid {
              grid-template-columns: 1fr;
            }

            .question-card h1 {
              font-size: 22px;
            }

            .answer-footer {
              align-items: flex-start;
              flex-direction: column;
            }
          }
        `}</style>

        <div className="interview-container">
          <div className="practice-topbar">
            <button
              className="practice-back"
              onClick={backToInterviewSetup}
            >
              <ArrowLeft size={18} />
              Exit Practice
            </button>

            <div className="practice-meta">
              <span className="meta-pill">
                <Code2 size={15} />
                {selectedRole}
              </span>

              <span className="meta-pill">
                {selectedDifficulty}
              </span>

              <span className="meta-pill timer-pill">
                <Clock3 size={15} />
                {formattedTime}
              </span>
            </div>
          </div>

          <div className="question-progress">
            <div className="progress-text">
              <span>
                Question{" "}
                {currentQuestionIndex + 1} of{" "}
                {questions.length}
              </span>

              <span>
                {Math.round(
                  progressPercentage
                )}
                %
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="question-card">
            <div className="question-labels">
              <span className="question-badge">
                {currentQuestion.category ||
                  "General"}
              </span>

              <span className="question-badge">
                {currentQuestion.type ||
                  "Technical"}
              </span>

              <span className="question-badge difficulty">
                {currentQuestion.difficulty ||
                  selectedDifficulty}
              </span>
            </div>

            <h1>
              {currentQuestion.question ||
                currentQuestion.text}
            </h1>

            <label className="answer-label">
              Your Answer
            </label>

            <textarea
              className="answer-box"
              value={answer}
              onChange={(event) =>
                setAnswer(event.target.value)
              }
              placeholder="Explain your answer clearly. Include examples, reasoning, implementation details, or complexity where relevant..."
              disabled={evaluating}
            />

            <div className="answer-footer">
              <span className="word-count">
                {
                  answer.trim()
                    ? answer.trim().split(/\s+/)
                        .length
                    : 0
                }{" "}
                words
              </span>

              <button
                className="evaluate-button"
                onClick={handleGetFeedback}
                disabled={
                  evaluating ||
                  !answer.trim()
                }
              >
                {evaluating ? (
                  <>
                    <span className="spinner" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Get Feedback
                  </>
                )}
              </button>
            </div>
          </div>

          {feedback && (
            <div className="feedback-card">
              <div className="feedback-header">
                <div>
                  <h2>
                    AI Interview Feedback
                  </h2>

                  <p>
                    {feedback.verdict ||
                      getScoreLabel(
                        feedback.score
                      )}
                  </p>
                </div>

                <div className="feedback-score">
                  <strong>
                    {feedback.score}
                  </strong>
                  <span>/ 100</span>
                </div>
              </div>

              <div className="breakdown-grid">
                <div className="breakdown-item">
                  <span>
                    Technical Relevance
                  </span>

                  <strong>
                    {
                      feedback.breakdown
                        ?.technicalRelevance ??
                      0
                    }
                    %
                  </strong>
                </div>

                <div className="breakdown-item">
                  <span>
                    Answer Quality
                  </span>

                  <strong>
                    {
                      feedback.breakdown
                        ?.answerQuality ?? 0
                    }
                    %
                  </strong>
                </div>

                <div className="breakdown-item">
                  <span>
                    Technical Depth
                  </span>

                  <strong>
                    {
                      feedback.breakdown
                        ?.technicalDepth ?? 0
                    }
                    %
                  </strong>
                </div>
              </div>

              {Array.isArray(
                feedback.strengths
              ) &&
                feedback.strengths.length >
                  0 && (
                  <div className="feedback-section">
                    <h3>
                      💪 Strengths
                    </h3>

                    <ul className="feedback-list">
                      {feedback.strengths.map(
                        (item, index) => (
                          <li
                            key={`${item}-${index}`}
                          >
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {Array.isArray(
                feedback.suggestions
              ) &&
                feedback.suggestions.length >
                  0 && (
                  <div className="feedback-section">
                    <h3>
                      🎯 Suggestions
                    </h3>

                    <ul className="feedback-list">
                      {feedback.suggestions.map(
                        (item, index) => (
                          <li
                            key={`${item}-${index}`}
                          >
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {Array.isArray(
                feedback.matchedKeywords
              ) &&
                feedback.matchedKeywords.length >
                  0 && (
                  <div className="feedback-section">
                    <h3>
                      🔑 Technical Concepts Detected
                    </h3>

                    <div className="keyword-list">
                      {feedback.matchedKeywords.map(
                        (keyword, index) => (
                          <span
                            className="keyword"
                            key={`${keyword}-${index}`}
                          >
                            {keyword}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              {feedback.improvedAnswer && (
                <div className="feedback-section">
                  <h3>
                    💡 How You Could Improve
                  </h3>

                  <div className="improved-answer">
                    {
                      feedback.improvedAnswer
                    }
                  </div>
                </div>
              )}

              {feedback.interviewTip && (
                <div className="feedback-section">
                  <h3>
                    <Lightbulb
                      size={17}
                      style={{
                        verticalAlign:
                          "middle",
                        marginRight: 6,
                      }}
                    />
                    Interview Tip
                  </h3>

                  <div className="interview-tip">
                    {feedback.interviewTip}
                  </div>
                </div>
              )}

              <div className="next-row">
                <button
                  className="next-button"
                  onClick={nextQuestion}
                >
                  {currentQuestionIndex ===
                  questions.length - 1
                    ? "Finish Interview"
                    : "Next Question"}

                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* =======================================================
     SETUP SCREEN
  ======================================================= */

  return (
    <div className="interview-page">
      <style>{`
        .interview-page {
          min-height: 100vh;
          background: #f5f8fc;
          color: #172033;
          padding: 28px;
          box-sizing: border-box;
        }

        .interview-container {
          max-width: 1180px;
          margin: 0 auto;
        }

        .setup-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 30px;
        }

        .back-button {
          border: none;
          background: white;
          border-radius: 12px;
          padding: 11px 15px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #344054;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(16, 24, 40, 0.06);
        }

        .hero-icon {
          width: 56px;
          height: 56px;
          border-radius: 17px;
          background: #eaf2ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .setup-heading h1 {
          margin: 0 0 5px;
          font-size: 30px;
        }

        .setup-heading p {
          margin: 0;
          color: #667085;
        }

        .setup-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr);
          gap: 22px;
          align-items: start;
        }

        .setup-card {
          background: white;
          border-radius: 22px;
          padding: 28px;
          box-shadow: 0 8px 30px rgba(16, 24, 40, 0.07);
        }

        .setup-card h2 {
          margin: 0 0 7px;
          font-size: 21px;
        }

        .setup-card-description {
          margin: 0 0 24px;
          color: #667085;
          line-height: 1.55;
        }

        .field-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .domain-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 24px;
        }

        .domain-button {
          border: 1px solid #dce2ea;
          background: white;
          border-radius: 12px;
          padding: 12px 10px;
          cursor: pointer;
          font-weight: 600;
          color: #475467;
          transition: 0.18s ease;
        }

        .domain-button:hover {
          border-color: #9dbcf8;
        }

        .domain-button.active {
          background: #eef4ff;
          border-color: #2563eb;
          color: #2563eb;
        }

        .difficulty-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 26px;
        }

        .difficulty-button {
          border: 1px solid #dce2ea;
          background: white;
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          font-weight: 600;
          color: #475467;
        }

        .difficulty-button.active {
          background: #172033;
          color: white;
          border-color: #172033;
        }

        .start-button {
          width: 100%;
          border: none;
          border-radius: 13px;
          padding: 15px;
          background: #2563eb;
          color: white;
          font-size: 15px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          cursor: pointer;
        }

        .start-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 13px;
          border-radius: 13px;
          background: #f8fafc;
        }

        .feature-icon {
          width: 35px;
          height: 35px;
          border-radius: 10px;
          background: #eef4ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-item strong {
          display: block;
          margin-bottom: 3px;
        }

        .feature-item span {
          font-size: 13px;
          color: #667085;
          line-height: 1.45;
        }

        .history-section {
          margin-top: 24px;
        }

        .history-card {
          background: white;
          border-radius: 22px;
          padding: 25px;
          box-shadow: 0 8px 30px rgba(16, 24, 40, 0.06);
        }

        .history-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .history-heading h2 {
          margin: 0;
          font-size: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .clear-history {
          border: none;
          background: transparent;
          color: #667085;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .history-item {
          border: 1px solid #e5e9ef;
          border-radius: 15px;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .history-main {
          min-width: 0;
        }

        .history-main h3 {
          margin: 0 0 5px;
          font-size: 15px;
        }

        .history-main p {
          margin: 0;
          color: #667085;
          font-size: 13px;
        }

        .history-score {
          min-width: 80px;
          text-align: right;
        }

        .history-score strong {
          font-size: 21px;
          display: block;
        }

        .history-score span {
          font-size: 12px;
          color: #667085;
        }

        .empty-history {
          padding: 25px;
          text-align: center;
          color: #667085;
          background: #f8fafc;
          border-radius: 14px;
        }

        .error-message {
          background: #fff0f0;
          border: 1px solid #ffd2d2;
          color: #b42318;
          padding: 12px 14px;
          border-radius: 11px;
          margin-bottom: 18px;
        }

        .spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .setup-grid {
            grid-template-columns: 1fr;
          }

          .domain-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 560px) {
          .interview-page {
            padding: 16px;
          }

          .setup-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .domain-grid,
          .difficulty-grid {
            grid-template-columns: 1fr;
          }

          .setup-card {
            padding: 20px;
          }

          .history-item {
            align-items: flex-start;
            flex-direction: column;
          }

          .history-score {
            text-align: left;
          }
        }
      `}</style>

      <div className="interview-container">
        <div className="setup-header">
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

          <div className="hero-icon">
            <Brain size={29} />
          </div>

          <div className="setup-heading">
            <h1>AI Interview Practice</h1>

            <p>
              Practice real interview-style questions
              and improve your answers with instant
              feedback.
            </p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="setup-grid">
          <div className="setup-card">
            <h2>
              Start a New Interview
            </h2>

            <p className="setup-card-description">
              Choose your technical domain and
              difficulty. Every session gives you a
              fresh randomized set of questions.
            </p>

            <label className="field-label">
              Choose Domain
            </label>

            <div className="domain-grid">
              {DOMAINS.map((domain) => (
                <button
                  key={domain}
                  className={`domain-button ${
                    selectedRole === domain
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleRoleChange(domain)
                  }
                >
                  {domain}
                </button>
              ))}
            </div>

            <label className="field-label">
              Difficulty
            </label>

            <div className="difficulty-grid">
              {DIFFICULTIES.map(
                (difficulty) => (
                  <button
                    key={difficulty}
                    className={`difficulty-button ${
                      selectedDifficulty ===
                      difficulty
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleDifficultyChange(
                        difficulty
                      )
                    }
                  >
                    {difficulty}
                  </button>
                )
              )}
            </div>

            <button
              className="start-button"
              onClick={startPractice}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Loading Questions...
                </>
              ) : (
                <>
                  <Play size={18} />
                  Start Interview
                </>
              )}
            </button>
          </div>

          <div className="setup-card">
            <h2>
              What You'll Get
            </h2>

            <p className="setup-card-description">
              CareerAI evaluates your answers and
              helps you identify what to improve.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <Brain size={18} />
                </div>

                <div>
                  <strong>
                    50 Questions per Domain
                  </strong>

                  <span>
                    Java, Python, JavaScript,
                    React, Node.js, SQL, DSA and
                    Full Stack.
                  </span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <Sparkles size={18} />
                </div>

                <div>
                  <strong>
                    Randomized Sessions
                  </strong>

                  <span>
                    Get a fresh set of 5 questions
                    instead of seeing the same
                    sequence every time.
                  </span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <Target size={18} />
                </div>

                <div>
                  <strong>
                    Answer Evaluation
                  </strong>

                  <span>
                    Get technical relevance,
                    answer quality and technical
                    depth scores.
                  </span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <Trophy size={18} />
                </div>

                <div>
                  <strong>
                    Session Summary
                  </strong>

                  <span>
                    See your overall performance,
                    strong areas and topics to
                    improve.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------
            INTERVIEW HISTORY
        ------------------------------------------------- */}

        <div className="history-section">
          <div className="history-card">
            <div className="history-heading">
              <h2>
                <History size={21} />
                Recent Interview History
              </h2>

              {history.length > 0 && (
                <button
                  className="clear-history"
                  onClick={clearHistory}
                >
                  Clear History
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="empty-history">
                <History
                  size={28}
                  style={{
                    marginBottom: 8,
                    opacity: 0.5,
                  }}
                />

                <div>
                  No interview sessions yet.
                  Complete your first practice
                  session to see your history here.
                </div>
              </div>
            ) : (
              <div className="history-list">
                {history
                  .slice(0, 10)
                  .map((item) => (
                    <div
                      className="history-item"
                      key={item.id}
                    >
                      <div className="history-main">
                        <h3>
                          {item.domain} Interview
                        </h3>

                        <p>
                          {item.difficulty} ·{" "}
                          {
                            item.answeredQuestions
                          }{" "}
                          questions ·{" "}
                          {formatDate(
                            item.completedAt
                          )}
                        </p>
                      </div>

                      <div className="history-score">
                        <strong>
                          {item.averageScore}%
                        </strong>

                        <span>
                          {getScoreLabel(
                            item.averageScore
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}