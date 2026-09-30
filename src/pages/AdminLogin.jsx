import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, Key } from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    badgeId: "OFFICER-7801",
    password: "••••••••",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate municipal staff authentication
    navigate("/admin");
  };

  return (
    <div className="auth-page admin-auth-theme">
      <div className="auth-visual admin-visual-bg">
        <Link to="/" className="auth-logo">
          <ShieldCheck size={28} />
          <span>EcoCare Municipal Authority</span>
        </Link>

        <div className="auth-visual-content">
          <div className="auth-icon-circle admin-icon-circle">
            <ShieldCheck size={50} />
          </div>

          <h1>
            Municipal Command
            <span> & Fleet Dispatch</span>
          </h1>

          <p>
            Authorized municipal sanitation inspectors, telemetry controllers, and ward
            officers login to manage live complaints and route electric collection vehicles.
          </p>
        </div>

        <div className="auth-visual-footer">
          Govt. Certified Municipal Waste Management System
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="admin-login-top-bar">
            <Link to="/" className="btn-back-link">
              <ArrowLeft size={16} /> Back to Public Portal
            </Link>
          </div>

          <div className="auth-heading">
            <span className="admin-badge">Sanitation Staff Access</span>
            <h2>Municipal Staff Login</h2>
            <p>Enter your municipal badge ID and credentials to enter the command console.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Official Officer Badge ID / Email</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  type="text"
                  value={credentials.badgeId}
                  onChange={(e) => setCredentials({ ...credentials, badgeId: e.target.value })}
                  placeholder="e.g. OFFICER-7801"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label>Security Password / Token</label>
              </div>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Enter staff security password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn admin-submit-btn">
              <span>Access Command Console</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-switch">
            <span>Are you a citizen reporting waste?</span>
            <Link to="/login">Citizen Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
