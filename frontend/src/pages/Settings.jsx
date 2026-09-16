import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  GraduationCap,
  Lock,
  LogOut,
  Mail,
  Moon,
  Save,
  Shield,
  User,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="settings-page">

      {/* HEADER */}
      <header className="settings-header">

        <div className="settings-header-left">

          <button
            className="settings-back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <p className="settings-eyebrow">
              CareerAI
            </p>

            <h1>
              Settings
            </h1>

            <p>
              Manage your account and preferences.
            </p>
          </div>

        </div>

        <button
          className="settings-save-button"
          onClick={handleSave}
        >
          {saved ? (
            <>
              <Check size={18} />
              Saved
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>

      </header>


      {/* CONTENT */}
      <main className="settings-content">

        {/* PROFILE */}
        <section className="settings-card">

          <div className="settings-card-heading">

            <div className="settings-section-icon blue">
              <User size={20} />
            </div>

            <div>
              <h2>
                Profile Information
              </h2>

              <p>
                Update your personal information.
              </p>
            </div>

          </div>


          <div className="settings-form-grid">

            <div className="settings-field">

              <label>
                Full name
              </label>

              <div className="settings-input-wrapper">

                <User size={18} />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

              </div>

            </div>


            <div className="settings-field">

              <label>
                Email address
              </label>

              <div className="settings-input-wrapper disabled">

                <Mail size={18} />

                <input
                  type="email"
                  value={email}
                  disabled
                />

              </div>

            </div>

          </div>

        </section>


        {/* SECURITY */}
        <section className="settings-card">

          <div className="settings-card-heading">

            <div className="settings-section-icon purple">
              <Shield size={20} />
            </div>

            <div>
              <h2>
                Security
              </h2>

              <p>
                Manage your account security.
              </p>
            </div>

          </div>


          <button
            className="settings-action-row"
            onClick={() => alert("Password change will be connected with Firebase later.")}
          >

            <div className="settings-action-left">

              <div className="settings-action-icon">
                <Lock size={18} />
              </div>

              <div>
                <strong>
                  Change password
                </strong>

                <span>
                  Update your account password
                </span>
              </div>

            </div>

            <ChevronRight size={19} />

          </button>

        </section>


        {/* NOTIFICATIONS */}
        <section className="settings-card">

          <div className="settings-card-heading">

            <div className="settings-section-icon orange">
              <Bell size={20} />
            </div>

            <div>
              <h2>
                Notifications
              </h2>

              <p>
                Choose what CareerAI should remind you about.
              </p>
            </div>

          </div>


          <SettingToggle
            icon={<Mail size={18} />}
            title="Email notifications"
            description="Receive important CareerAI updates by email."
            enabled={emailNotifications}
            onChange={() =>
              setEmailNotifications(!emailNotifications)
            }
          />


          <SettingToggle
            icon={<Bell size={18} />}
            title="Job alerts"
            description="Get notified about new matching opportunities."
            enabled={jobAlerts}
            onChange={() =>
              setJobAlerts(!jobAlerts)
            }
          />


          <SettingToggle
            icon={<Bell size={18} />}
            title="Interview reminders"
            description="Receive reminders before upcoming interviews."
            enabled={interviewReminders}
            onChange={() =>
              setInterviewReminders(!interviewReminders)
            }
          />

        </section>


        {/* APPEARANCE */}
        <section className="settings-card">

          <div className="settings-card-heading">

            <div className="settings-section-icon green">
              <Moon size={20} />
            </div>

            <div>
              <h2>
                Preferences
              </h2>

              <p>
                Customize your CareerAI experience.
              </p>
            </div>

          </div>


          <div className="settings-preference">

            <div>

              <strong>
                Theme
              </strong>

              <span>
                CareerAI currently uses the default light theme.
              </span>

            </div>

            <div className="settings-theme-badge">
              Light
            </div>

          </div>

        </section>


        {/* LOGOUT */}
        <section className="settings-danger-card">

          <div>

            <h2>
              Sign out of CareerAI
            </h2>

            <p>
              You'll need to sign in again to access your dashboard.
            </p>

          </div>

          <button
            className="settings-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>

        </section>

      </main>

    </div>
  );
}


/* =========================================
   TOGGLE
========================================= */

function SettingToggle({
  icon,
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="settings-toggle-row">

      <div className="settings-action-left">

        <div className="settings-action-icon">
          {icon}
        </div>

        <div>
          <strong>
            {title}
          </strong>

          <span>
            {description}
          </span>
        </div>

      </div>


      <button
        type="button"
        className={`settings-toggle ${
          enabled ? "active" : ""
        }`}
        onClick={onChange}
        aria-label={title}
      >

        <span />

      </button>

    </div>
  );
}

export default Settings;