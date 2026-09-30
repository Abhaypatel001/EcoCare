import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Recycle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ArrowRight,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Error message remove when user starts typing
    setError("");
  };

  // =========================
  // HANDLE REGISTER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Phone validation
    if (formData.phone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
        }
      );

      if (response.data.success) {
        setSuccess(
          "Account created successfully! Redirecting to login..."
        );

        // Clear form
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });

        // Go to login after short delay
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (error) {
      console.error("Registration Error:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Registration failed. Please try again."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to server. Please make sure backend is running."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* =========================
          LEFT SIDE
      ========================= */}

      <div className="auth-visual">

        <Link to="/" className="auth-logo">
          <Recycle size={28} />
          <span>EcoCare</span>
        </Link>

        <div className="auth-visual-content">

          <div className="auth-icon-circle">
            <Recycle size={55} />
          </div>

          <h1>
            Make a difference.
            <span> Start today.</span>
          </h1>

          <p>
            Join your community in building cleaner,
            healthier and more sustainable surroundings.
          </p>

        </div>

        <div className="auth-visual-footer">
          Smart Waste Management System
        </div>

      </div>


      {/* =========================
          RIGHT SIDE
      ========================= */}

      <div className="auth-form-section">

        <div className="auth-form-container">

          {/* MOBILE LOGO */}

          <div className="mobile-auth-logo">
            <Recycle size={25} />
            <span>EcoCare</span>
          </div>


          {/* HEADING */}

          <div className="auth-heading">

            <h2>Create your account</h2>

            <p>
              Join EcoCare and help keep your community clean.
            </p>

          </div>


          {/* ERROR MESSAGE */}

          {error && (
            <div
              style={{
                marginBottom: "18px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {error}
            </div>
          )}


          {/* SUCCESS MESSAGE */}

          {success && (
            <div
              style={{
                marginBottom: "18px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {success}
            </div>
          )}


          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            {/* NAME */}

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="input-wrapper">

                <User size={18} />

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">

                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

              </div>

            </div>


            {/* PHONE */}

            <div className="form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <div className="input-wrapper">

                <Phone size={18} />

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  disabled={loading}
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">

                <Lock size={18} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="input-wrapper">

                <Lock size={18} />

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* TERMS */}

            <label className="remember-label">

              <input
                type="checkbox"
                required
                disabled={loading}
              />

              <span>
                I agree to the terms and conditions
              </span>

            </label>


            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >

              {loading ? (
                <>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}

            </button>

          </form>


          {/* LOGIN */}

          <div className="auth-switch">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login here
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;