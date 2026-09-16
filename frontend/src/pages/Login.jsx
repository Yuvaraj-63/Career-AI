import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Check empty fields
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.message || "Invalid email or password.");
      return;
    }

    // Go to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="login-page">

      {/* =================================================
          LEFT PANEL
      ================================================= */}
      <section className="login-left">

        {/* Decorative circles */}
        <div className="login-circle-one"></div>
        <div className="login-circle-two"></div>


        <div className="login-left-content">

          {/* Logo */}
          <Link to="/" className="login-brand">

            <div className="login-brand-icon">
              <GraduationCap size={27} />
            </div>

            <span>
              Career<span>AI</span>
            </span>

          </Link>


          {/* Main message */}
          <div className="login-hero-content">

            <p className="login-eyebrow">
              Welcome Back
            </p>

            <h1>
              Your next
              <br />
              opportunity
              <br />
              starts here.
            </h1>

            <p className="login-hero-description">
              Keep improving your resume, discover better
              opportunities, and prepare for the interviews
              that matter.
            </p>

          </div>


          {/* Bottom text */}
          <p className="login-left-footer">
            CareerAI • Your career companion
          </p>

        </div>

      </section>


      {/* =================================================
          RIGHT PANEL
      ================================================= */}
      <section className="login-right">

        <div className="login-wrapper">

          {/* Back */}
          <Link
            to="/"
            className="login-back"
          >
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Link>


          {/* Login Card */}
          <div className="login-card">

            {/* Header */}
            <div className="login-card-header">

              <h2>
                Welcome back
              </h2>

              <p>
                Sign in to continue your career journey.
              </p>

            </div>


            {/* Error */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            {/* Form */}
            <form
              className="login-form"
              onSubmit={handleSubmit}
            >

              {/* Email */}
              <div className="login-field">

                <label htmlFor="login-email">
                  Email address
                </label>

                <div className="login-input-wrapper">

                  <Mail
                    size={18}
                    className="login-input-icon"
                  />

                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                  />

                </div>

              </div>


              {/* Password */}
              <div className="login-field">

                <div className="login-password-label-row">

                  <label htmlFor="login-password">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="login-forgot"
                  >
                    Forgot password?
                  </Link>

                </div>


                <div className="login-input-wrapper">

                  <LockKeyhole
                    size={18}
                    className="login-input-icon"
                  />

                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />


                  <button
                    type="button"
                    className="login-eye-button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>


              {/* Remember me */}
              <div className="login-options">

                <label className="remember-option">

                  <input
                    type="checkbox"
                  />

                  <span>
                    Remember me
                  </span>

                </label>

              </div>


              {/* Submit */}
              <button
                type="submit"
                className="login-submit"
                disabled={submitting}
              >
                {submitting ? "Signing In..." : "Sign In"}
              </button>

            </form>


            {/* Divider */}
            <div className="login-divider">

              <span></span>

              <p>OR</p>

              <span></span>

            </div>


            {/* Google */}
            <button
              type="button"
              className="login-google"
              onClick={() => {
                setError(
                  "Google sign-in will be available when authentication is connected."
                );
              }}
            >

              <span className="google-logo">
                G
              </span>

              <span>
                Continue with Google
              </span>

            </button>


            {/* Register */}
            <p className="login-register">

              Don't have an account?

              <Link to="/register">
                Create one
              </Link>

            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;