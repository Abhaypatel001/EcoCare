import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Recycle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Key,
  X,
  AlertCircle,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isAdminDetected, setIsAdminDetected] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");

    // Sirf UI indication.
    // Actual admin role backend decide karega.
    if (name === "email") {
      const val = value.trim().toLowerCase();

      if (
        val === "admin" ||
        val.startsWith("admin@") ||
        val === "administrator" ||
        val === "officer"
      ) {
        setIsAdminDetected(true);
      } else {
        setIsAdminDetected(false);
      }
    }
  };

  // =========================
  // STAFF KEY
  // =========================

  const handleAdminDirectOpen = () => {
    setFormData((prev) => ({
      ...prev,
      email: "admin@ecocare.gov",
      password: "",
    }));

    setError("");
    setIsAdminDetected(true);
    setShowAdminPopup(true);
  };

  // =========================
  // LOGIN API
  // =========================

  const loginUser = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "https://ecocare-backend-zhgx.onrender.com/api/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      console.log("FULL LOGIN RESPONSE:", response.data);

      if (!response.data.success) {
        setError(
          response.data.message || "Login failed."
        );
        return;
      }

      const token = response.data.token;
      const user = response.data.user;

      // =========================
      // CHECK BACKEND USER
      // =========================

      console.log("LOGIN USER:", user);
      console.log("LOGIN ROLE:", user?.role);
      console.log("LOGIN EMAIL:", user.email);
console.log("FULL RESPONSE JSON:", JSON.stringify(response.data, null, 2));

      if (!token || !user) {
        setError(
          "Invalid server response. User information not received."
        );
        return;
      }

      // =========================
      // SAVE LOGIN SESSION
      // =========================

      localStorage.setItem(
        "ecocare_token",
        token
      );

      localStorage.setItem(
        "ecocare_user",
        JSON.stringify(user)
      );

      // Navbar ko immediately update karne ke liye
      window.dispatchEvent(
        new Event("ecocare_user_updated")
      );

      // =========================
      // ACTUAL ROLE CHECK
      // =========================

      const role = String(user.role || "")
        .trim()
        .toLowerCase();

      console.log("NORMALIZED ROLE:", role);

      if (role === "admin") {
        console.log(
          "ADMIN DETECTED → Opening Admin Dashboard"
        );

        setShowAdminPopup(false);

        navigate("/admin", {
          replace: true,
        });
      } else {
        console.log(
          "NORMAL USER → Opening Citizen Dashboard"
        );

        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Invalid email or password."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to server. Please make sure backend is running."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORM SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    await loginUser();
  };

  // =========================
  // ADMIN POPUP LOGIN
  // =========================

  const handleConfirmAdminAccess = async () => {
    if (!formData.password) {
      setError(
        "Please enter the administrator password first."
      );
      return;
    }

    setIsAuthorizing(true);
    setError("");

    try {
      await loginUser();
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <div className="auth-page-clean">

      {/* Background Ambience */}
      <div className="auth-ambient-blur blob-1"></div>
      <div className="auth-ambient-blur blob-2"></div>

      <div className="auth-central-card">

        {/* =========================
            HEADER
        ========================= */}

        <div className="auth-card-top">

          <Link
            to="/"
            className="auth-brand-badge"
            title="Go to EcoCare Home"
          >
            <div className="brand-badge-icon">
              <Recycle
                size={22}
                className="logo-spin"
              />
            </div>

            <span className="brand-badge-text">
              EcoCare
            </span>
          </Link>

          <button
            type="button"
            className="discreet-staff-key-btn"
            onClick={handleAdminDirectOpen}
            title="Municipal Staff Key Access"
          >
            <Key size={14} />
            <span>Staff Key</span>
          </button>

        </div>


        {/* =========================
            HEADING
        ========================= */}

        <div className="auth-text-header">

          <h2>Welcome back</h2>

          <p>
            Sign in to manage your waste reports,
            pickups and green rewards.
          </p>

        </div>


        {/* =========================
            ADMIN DETECTED
        ========================= */}

        {isAdminDetected && (
          <div className="admin-detected-pill popup-spring-in">

            <ShieldCheck
              size={16}
              className="text-emerald"
            />

            <span>
              <strong>
                Administrator username detected!
              </strong>{" "}
              Credentials will be verified by server.
            </span>

          </div>
        )}


        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}


        {/* =========================
            FORM
        ========================= */}

        <form
          onSubmit={handleSubmit}
          className="auth-clean-form"
        >

          {/* EMAIL */}

          <div className="form-group-floating">

            <label htmlFor="email">
              Email or Username
            </label>

            <div
              className={`input-field-wrapper ${
                isAdminDetected
                  ? "admin-border-glow"
                  : ""
              }`}
            >

              <Mail
                size={18}
                className="field-icon-left"
              />

              <input
                id="email"
                type="text"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="username"
                disabled={
                  loading || isAuthorizing
                }
              />

              {isAdminDetected && (
                <span className="admin-inline-tag">
                  Admin Mode
                </span>
              )}

            </div>

          </div>


          {/* PASSWORD */}

          <div className="form-group-floating">

            <div className="label-forgot-row">

              <label htmlFor="password">
                Password
              </label>

              <button
                type="button"
                className="btn-forgot-link"
                onClick={() =>
                  alert(
                    "Forgot password functionality will be added soon."
                  )
                }
              >
                Forgot password?
              </button>

            </div>

            <div className="input-field-wrapper">

              <Lock
                size={18}
                className="field-icon-left"
              />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                disabled={
                  loading || isAuthorizing
                }
              />

              <button
                type="button"
                className="btn-password-eye"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                disabled={
                  loading || isAuthorizing
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


          {/* REMEMBER ME */}

          <div className="remember-me-row">

            <label className="checkbox-label">

              <input
                type="checkbox"
                defaultChecked
                disabled={
                  loading || isAuthorizing
                }
              />

              <span className="checkbox-custom"></span>

              <span className="checkbox-text">
                Keep me signed in
              </span>

            </label>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className={`btn-auth-submit ${
              isAdminDetected
                ? "btn-admin-glow"
                : ""
            }`}
            disabled={
              loading || isAuthorizing
            }
            style={{
              opacity:
                loading || isAuthorizing
                  ? 0.7
                  : 1,
              cursor:
                loading || isAuthorizing
                  ? "not-allowed"
                  : "pointer",
            }}
          >

            {loading ? (
              <span>
                Signing in...
              </span>
            ) : isAdminDetected ? (
              <>
                <ShieldCheck size={18} />

                <span>
                  Verify & Open Admin Console
                </span>

                <ArrowRight
                  size={18}
                  className="arrow-hover"
                />
              </>
            ) : (
              <>
                <span>
                  Sign In to Citizen Portal
                </span>

                <ArrowRight
                  size={18}
                  className="arrow-hover"
                />
              </>
            )}

          </button>

        </form>


        {/* =========================
            REGISTER
        ========================= */}

        <div className="auth-card-footer">

          <span>
            New to EcoCare?
          </span>

          <Link
            to="/register"
            className="register-link-highlight"
          >
            Create an Eco Citizen Account
          </Link>

        </div>

      </div>


      {/* =========================================================
          ADMIN POPUP
          ========================================================= */}

      {showAdminPopup && (
        <div className="admin-popup-backdrop">

          <div className="admin-popup-modal popup-spring-in">

            <button
              type="button"
              className="popup-close-corner"
              onClick={() => {
                setShowAdminPopup(false);
                setIsAuthorizing(false);
                setError("");
              }}
              title="Close"
              disabled={isAuthorizing}
            >
              <X size={18} />
            </button>


            <div className="popup-shield-halo">

              <ShieldCheck
                size={38}
                className="halo-icon"
              />

            </div>


            <span className="popup-badge">
              Municipal Clearance
            </span>

            <h3>
              Municipal Administrator Access
            </h3>

            <p className="popup-description">
              You are accessing the restricted Municipal
              Sanitation Command & Fleet Telemetry Console.
            </p>


            <div className="popup-officer-info">

              <div className="officer-row">

                <span>
                  Staff Username:
                </span>

                <strong>
                  {formData.email ||
                    "admin@ecocare.gov"}
                </strong>

              </div>


              <div className="officer-row">

                <span>
                  Access Role:
                </span>

                <strong className="text-emerald">
                  Server Verified
                </strong>

              </div>


              <div className="officer-row">

                <span>
                  Security Clearance:
                </span>

                <span className="clearance-tag">
                  Backend Verification
                </span>

              </div>

            </div>


            {isAuthorizing ? (

              <div className="authorizing-progress-box">

                <div className="authorizing-spinner"></div>

                <span>
                  Verifying administrator credentials...
                </span>

              </div>

            ) : (

              <div className="popup-button-row">

                <button
                  type="button"
                  className="btn-popup-cancel"
                  onClick={() =>
                    setShowAdminPopup(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn-popup-proceed"
                  onClick={
                    handleConfirmAdminAccess
                  }
                >

                  <Sparkles size={16} />

                  <span>
                    Verify & Enter
                  </span>

                  <ArrowRight size={16} />

                </button>

              </div>

            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default Login;