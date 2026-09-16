import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Check empty fields
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // Password length
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // Password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const result = await register(name, email, password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.message || "Registration failed. Please try again.");
      return;
    }

    // Go to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">

      {/* =====================================
          LEFT PANEL
      ====================================== */}

      <div className="auth-left">

        {/* Decorative circles */}
        <div className="auth-circle-one" />
        <div className="auth-circle-two" />

        <div className="auth-left-content">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center">
              <GraduationCap
                size={27}
                className="text-[#1769e0]"
              />
            </div>

            <span className="text-2xl font-bold">
              CareerAI
            </span>
          </Link>


          {/* Main content */}
          <div className="max-w-lg">

            <p className="text-blue-100 font-medium mb-4">
              Start Your Journey
            </p>

            <h1 className="auth-left-title">
              Your career.
              <br />
              Your direction.
              <br />
              Your growth.
            </h1>

            <p className="auth-left-description">
              Build a stronger resume, understand your skill gaps,
              and stay organized throughout your job search.
            </p>

          </div>


          {/* Footer */}
          <p className="text-sm text-blue-100">
            CareerAI • Built for ambitious job seekers
          </p>

        </div>
      </div>


      {/* =====================================
          RIGHT PANEL
      ====================================== */}

      <div className="auth-right">

        <div className="auth-wrapper">

          {/* Back to Home */}
          <Link
            to="/"
            className="auth-back"
          >
            <ArrowLeft size={17} />
            Back to home
          </Link>


          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">

            <div className="w-10 h-10 rounded-xl bg-[#1769e0] flex items-center justify-center">

              <GraduationCap
                size={24}
                className="text-white"
              />

            </div>

            <span className="text-xl font-bold text-[#101b45]">
              Career
              <span className="text-[#1769e0]">
                AI
              </span>
            </span>

          </div>


          {/* =====================================
              REGISTER CARD
          ====================================== */}

          <div className="auth-card">

            {/* Heading */}
            <div className="mb-7">

              <h2 className="text-3xl font-bold text-[#101b45]">
                Create your account
              </h2>

              <p className="text-[#687493] mt-2">
                Let's get your career journey started.
              </p>

            </div>


            {/* Error message */}
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}


            {/* =====================================
                FORM
            ====================================== */}

            <form
              onSubmit={handleSubmit}
              className="auth-form"
            >

              {/* ================= NAME ================= */}

              <div className="auth-field">

                <label className="auth-label">
                  Full name
                </label>

                <div className="auth-input-wrapper">

                  <User
                    size={19}
                    className="auth-input-icon"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="auth-input"
                  />

                </div>

              </div>


              {/* ================= EMAIL ================= */}

              <div className="auth-field">

                <label className="auth-label">
                  Email address
                </label>

                <div className="auth-input-wrapper">

                  <Mail
                    size={19}
                    className="auth-input-icon"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="auth-input"
                  />

                </div>

              </div>


              {/* ================= PASSWORD ================= */}

              <div className="auth-field">

                <label className="auth-label">
                  Password
                </label>

                <div className="auth-input-wrapper">

                  <LockKeyhole
                    size={19}
                    className="auth-input-icon"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="auth-input"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="auth-password-button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>


              {/* ================= CONFIRM PASSWORD ================= */}

              <div className="auth-field">

                <label className="auth-label">
                  Confirm password
                </label>

                <div className="auth-input-wrapper">

                  <LockKeyhole
                    size={19}
                    className="auth-input-icon"
                  />

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm your password"
                    className="auth-input"
                  />

                </div>

              </div>


              {/* ================= SUBMIT ================= */}

              <button
                type="submit"
                className="auth-submit"
                disabled={submitting}
              >
                {submitting ? "Creating Account..." : "Create Account"}
              </button>

            </form>


            {/* ================= FOOTER ================= */}

            <p className="auth-footer">
              {/* ================= GOOGLE SIGN IN ================= */}

<div className="auth-divider">
  <span></span>
  <p>OR</p>
  <span></span>
</div>

<button
  type="button"
  className="google-button"
  onClick={() => {
    alert("Google Sign-In will be connected with Firebase later.");
  }}
>
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fill="#4285F4"
      d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
    />

    <path
      fill="#34A853"
      d="M12 21.75c2.63 0 4.84-.87 6.46-2.35l-3.14-2.45c-.87.58-1.98.93-3.32.93-2.55 0-4.71-1.72-5.49-4.04H3.27v2.53A9.75 9.75 0 0 0 12 21.75z"
    />

    <path
      fill="#FBBC05"
      d="M6.51 13.84A5.86 5.86 0 0 1 6.2 12c0-.64.11-1.26.31-1.84V7.63H3.27A9.76 9.76 0 0 0 2.25 12c0 1.57.38 3.05 1.02 4.37l3.24-2.53z"
    />

    <path
      fill="#EA4335"
      d="M12 6.12c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.22 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.73 5.38l3.24 2.53C7.29 7.84 9.45 6.12 12 6.12z"
    />
  </svg>

  Continue with Google
</button>

              Already have an account?{" "}

              <Link
                to="/login"
                className="auth-link"
              >
                Sign in
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;