import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  ShieldCheck,
  Recycle,
  Truck,
  Leaf,
  LayoutDashboard,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const loadUser = () => {
    try {
      const savedUser = localStorage.getItem("ecocare_user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("User data error:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    // Login/logout ke baad navbar update
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ecocare_user");
    setUser(null);
    setMobileOpen(false);
    navigate("/");
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const getUserName = () => {
    if (!user) return "";

    if (user.name) {
      return user.name.split(" ")[0];
    }

    if (user.email) {
      return user.email.split("@")[0];
    }

    return "User";
  };

  return (
    <header className="ecocare-navbar-wrapper">
      {/* Top announcement bar */}
      <div className="ecocare-topbar">
        <div className="ecocare-topbar-inner">
          <span className="ecocare-top-badge">
            <Leaf size={14} />
            Zero Waste Initiative
          </span>

          <span className="ecocare-top-text">
            Transforming municipal waste into bio-organic compost & clean energy
          </span>

          <Link to="/awareness" className="ecocare-top-link">
            Segregation Guide →
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="ecocare-navbar">
        <div className="ecocare-navbar-inner">

          {/* Logo */}
          <Link
            to="/"
            className="ecocare-logo"
            onClick={closeMobile}
          >
            <div className="ecocare-logo-icon">
              <Recycle size={27} />
            </div>

            <div className="ecocare-logo-text">
              <strong>EcoCare</strong>
              <span>NATURAL WASTE SYSTEM</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="ecocare-desktop-nav">

            <NavLink
              to="/"
              className={({ isActive }) =>
                `ecocare-nav-link ${isActive ? "active" : ""}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/report-issue"
              className={({ isActive }) =>
                `ecocare-nav-link ${isActive ? "active" : ""}`
              }
            >
              Report Issue
            </NavLink>

            <NavLink
              to="/pickup-request"
              className={({ isActive }) =>
                `ecocare-nav-link ${isActive ? "active" : ""}`
              }
            >
              Pickup Request
            </NavLink>

            <NavLink
              to="/complaints"
              className={({ isActive }) =>
                `ecocare-nav-link ${isActive ? "active" : ""}`
              }
            >
              Track Reports
            </NavLink>

            <NavLink
              to="/awareness"
              className={({ isActive }) =>
                `ecocare-nav-link ${isActive ? "active" : ""}`
              }
            >
              Eco Awareness
            </NavLink>

            {user && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `ecocare-nav-link ${isActive ? "active" : ""}`
                }
              >
                Dashboard
              </NavLink>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="ecocare-navbar-actions">

            {!user ? (
              <>
                <Link to="/login" className="ecocare-signin-btn">
                  <User size={17} />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/report-issue"
                  className="ecocare-report-btn"
                >
                  <Recycle size={17} />
                  <span>Report Waste</span>
                </Link>
              </>
            ) : (
              <>
                {/* User */}
                <div className="ecocare-user-box">
                  <div className="ecocare-user-icon">
                    <User size={18} />
                  </div>

                  <div className="ecocare-user-info">
                    <span>Hello,</span>
                    <strong>{getUserName()}</strong>
                  </div>
                </div>

                {/* Admin Panel */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="ecocare-admin-btn"
                  >
                    <ShieldCheck size={17} />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  className="ecocare-logout-btn"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut size={17} />
                </button>
              </>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            className="ecocare-mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={25} /> : <Menu size={25} />}
          </button>

        </div>

        {/* Mobile Menu */}
        <div
          className={`ecocare-mobile-menu ${
            mobileOpen ? "open" : ""
          }`}
        >

          <NavLink
            to="/"
            onClick={closeMobile}
            className={({ isActive }) =>
              `ecocare-mobile-link ${isActive ? "active" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/report-issue"
            onClick={closeMobile}
            className={({ isActive }) =>
              `ecocare-mobile-link ${isActive ? "active" : ""}`
            }
          >
            <Recycle size={18} />
            Report Issue
          </NavLink>

          <NavLink
            to="/pickup-request"
            onClick={closeMobile}
            className={({ isActive }) =>
              `ecocare-mobile-link ${isActive ? "active" : ""}`
            }
          >
            <Truck size={18} />
            Pickup Request
          </NavLink>

          <NavLink
            to="/complaints"
            onClick={closeMobile}
            className={({ isActive }) =>
              `ecocare-mobile-link ${isActive ? "active" : ""}`
            }
          >
            Track Reports
          </NavLink>

          <NavLink
            to="/awareness"
            onClick={closeMobile}
            className={({ isActive }) =>
              `ecocare-mobile-link ${isActive ? "active" : ""}`
            }
          >
            <Leaf size={18} />
            Eco Awareness
          </NavLink>

          {user && (
            <NavLink
              to="/dashboard"
              onClick={closeMobile}
              className={({ isActive }) =>
                `ecocare-mobile-link ${isActive ? "active" : ""}`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              onClick={closeMobile}
              className="ecocare-mobile-link admin"
            >
              <ShieldCheck size={18} />
              Admin Panel
            </NavLink>
          )}

          <div className="ecocare-mobile-bottom">

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="ecocare-mobile-signin"
                >
                  <User size={18} />
                  Sign In
                </Link>

                <Link
                  to="/report-issue"
                  onClick={closeMobile}
                  className="ecocare-mobile-report"
                >
                  Report Waste
                </Link>
              </>
            ) : (
              <>
                <div className="ecocare-mobile-user">
                  <div className="ecocare-user-icon">
                    <User size={18} />
                  </div>

                  <div>
                    <span>Hello,</span>
                    <strong>{getUserName()}</strong>
                  </div>
                </div>

                <button
                  className="ecocare-mobile-logout"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}

          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;