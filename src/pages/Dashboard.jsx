import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Recycle,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  Truck,
  Plus,
  ArrowRight,
  MapPin,
  CalendarDays,
  FileText,
  Leaf,
  Sparkles,
  TreePine,
  User,
  ExternalLink,
} from "lucide-react";

function Dashboard() {
  // ==========================================
  // LOGGED-IN USER
  // ==========================================
  const [user, setUser] = useState(null);

  // ==========================================
  // COMPLAINTS
  // ==========================================
  const [complaints, setComplaints] = useState([]);

  // ==========================================
  // REAL PICKUPS
  // ==========================================
  const [pickups, setPickups] = useState([]);

  // ==========================================
  // LOADING / ERROR
  // ==========================================
  const [loading, setLoading] = useState(true);
  const [pickupLoading, setPickupLoading] = useState(true);
  const [error, setError] = useState("");
  const [pickupError, setPickupError] = useState("");

  // ==========================================
  // LOAD LOGGED-IN USER
  // ==========================================
  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem("ecocare_user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);

        console.log("Dashboard User:", parsedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("User Load Error:", error);
      setUser(null);
    }
  };

  // ==========================================
  // FETCH MY COMPLAINTS
  // ==========================================
  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("ecocare_token");

      if (!token) {
        setError("Please login to view your reports.");
        setComplaints([]);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/complaints/my",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load your complaints"
        );
      }

      const formattedComplaints = (data.complaints || []).map(
        (complaint) => ({
          id: complaint._id,

          displayId: complaint._id
            ? complaint._id.slice(-6).toUpperCase()
            : "N/A",

          title: complaint.title,

          type: complaint.category || "Other",

          location: complaint.location,

          date: complaint.createdAt
            ? new Date(
                complaint.createdAt
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A",

          status: complaint.status || "Pending",

          priority: "Medium",

          description: complaint.description,

          image: complaint.image || "",

          createdAt: complaint.createdAt,

          updatedAt: complaint.updatedAt,
        })
      );

      setComplaints(formattedComplaints);
    } catch (error) {
      console.error(
        "Dashboard Complaints Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load your reports."
      );

      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH MY PICKUPS
  // ==========================================
  const fetchMyPickups = async () => {
    try {
      setPickupLoading(true);
      setPickupError("");

      const token = localStorage.getItem("ecocare_token");

      if (!token) {
        setPickups([]);
        setPickupError("Please login to view pickups.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/pickups/my",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load pickups"
        );
      }

      const formattedPickups = (
        data.pickups || []
      ).map((pickup) => ({
        id: pickup._id,

        bookingId:
          pickup.bookingId ||
          pickup._id?.slice(-6).toUpperCase(),

        wasteType: pickup.wasteType,

        pickupDate: pickup.pickupDate
          ? new Date(
              `${pickup.pickupDate}T00:00:00`
            ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A",

        pickupTime:
          pickup.pickupTime === "morning"
            ? "08:00 AM – 11:00 AM"
            : pickup.pickupTime === "afternoon"
            ? "12:00 PM – 03:00 PM"
            : pickup.pickupTime === "evening"
            ? "04:00 PM – 07:00 PM"
            : pickup.pickupTime || "N/A",

        status: pickup.status || "Scheduled",

        address: pickup.address || "",
      }));

      setPickups(formattedPickups);
    } catch (error) {
      console.error(
        "Dashboard Pickup Error:",
        error
      );

      setPickupError(
        error.message ||
          "Unable to load your pickups."
      );

      setPickups([]);
    } finally {
      setPickupLoading(false);
    }
  };

  // ==========================================
  // LOAD ALL DASHBOARD DATA
  // ==========================================
  useEffect(() => {
    loadUser();
    fetchMyComplaints();
    fetchMyPickups();
  }, []);

  // ==========================================
  // COMPLAINT COUNTS
  // ==========================================
  const totalReports = complaints.length;

  const pendingCount = complaints.filter(
    (complaint) =>
      complaint.status === "Pending"
  ).length;

  const inProgressCount = complaints.filter(
    (complaint) =>
      complaint.status === "In Progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) =>
      complaint.status === "Resolved"
  ).length;

  // ==========================================
  // USER NAME
  // ==========================================
  const userName = user?.name || "Citizen";

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* ==========================================
            TOP HERO
        ========================================== */}
        <section className="dashboard-top-hero">

          <div className="citizen-info-block">

            <div className="citizen-avatar">
              <User size={28} />
              <span className="online-badge"></span>
            </div>

            <div>

              <div className="welcome-tag">

                <span>
                  Welcome back 👋
                </span>

                <span className="citizen-level-pill">
                  <Leaf size={13} />
                  Eco Champion Level 2
                </span>

              </div>

              <h1>
                {userName}
              </h1>

              <p>
                Track your active municipal reports,
                scheduled doorstep pickups, and
                neighborhood impact.
              </p>

            </div>

          </div>

          {/* ==========================================
              ECOPOINTS
          ========================================== */}
          <div className="ecopoints-wallet-card">

            <div className="wallet-header">

              <span className="wallet-label">
                My EcoPoints Balance
              </span>

              <Sparkles
                size={18}
                className="sparkle-icon"
              />

            </div>

            <div className="wallet-amount">

              <strong>420</strong>

              <span>
                Points Earned
              </span>

            </div>

            <div className="wallet-progress-wrap">

              <div
                className="wallet-progress-bar"
                style={{
                  width: "70%",
                }}
              ></div>

            </div>

            <span className="wallet-next-level">
              80 pts to Level 3 Green Guardian
            </span>

          </div>

        </section>

        {/* ==========================================
            QUICK ACTIONS
        ========================================== */}
        <section className="dashboard-quick-actions">

          <Link
            to="/report-issue"
            className="quick-action-card action-report"
          >
            <div className="action-icon">
              <Plus size={22} />
            </div>

            <div className="action-texts">
              <h4>
                Report Waste Issue
              </h4>

              <span>
                Upload photo with GPS
              </span>
            </div>

            <ArrowRight
              size={17}
              className="action-arrow"
            />
          </Link>

          <Link
            to="/pickup-request"
            className="quick-action-card action-pickup"
          >
            <div className="action-icon">
              <Truck size={22} />
            </div>

            <div className="action-texts">
              <h4>
                Schedule Doorstep Pickup
              </h4>

              <span>
                Organic & dry recyclables
              </span>
            </div>

            <ArrowRight
              size={17}
              className="action-arrow"
            />
          </Link>

          <Link
            to="/complaints"
            className="quick-action-card action-track"
          >
            <div className="action-icon">
              <FileText size={22} />
            </div>

            <div className="action-texts">
              <h4>
                Track All Reports
              </h4>

              <span>
                Live municipal status
              </span>
            </div>

            <ArrowRight
              size={17}
              className="action-arrow"
            />
          </Link>

          <Link
            to="/awareness"
            className="quick-action-card action-guide"
          >
            <div className="action-icon">
              <Leaf size={22} />
            </div>

            <div className="action-texts">
              <h4>
                Segregation Masterclass
              </h4>

              <span>
                Learn 4-bin compost system
              </span>
            </div>

            <ArrowRight
              size={17}
              className="action-arrow"
            />
          </Link>

        </section>

        {/* ==========================================
            KEY METRICS
        ========================================== */}
        <section className="dashboard-stats-grid">

          <div className="stat-summary-card stat-blue">

            <div className="stat-header">

              <span className="stat-label">
                Total Reports
              </span>

              <div className="stat-icon-wrap">
                <FileText size={20} />
              </div>

            </div>

            <strong className="stat-number">
              {loading ? "..." : totalReports}
            </strong>

            <span className="stat-subtext">
              Your submitted reports
            </span>

          </div>

          <div className="stat-summary-card stat-orange">

            <div className="stat-header">

              <span className="stat-label">
                Pending Review
              </span>

              <div className="stat-icon-wrap">
                <Clock3 size={20} />
              </div>

            </div>

            <strong className="stat-number">
              {loading ? "..." : pendingCount}
            </strong>

            <span className="stat-subtext">
              Awaiting inspection
            </span>

          </div>

          <div className="stat-summary-card stat-green">

            <div className="stat-header">

              <span className="stat-label">
                In Progress
              </span>

              <div className="stat-icon-wrap">
                <Recycle size={20} />
              </div>

            </div>

            <strong className="stat-number">
              {loading
                ? "..."
                : inProgressCount}
            </strong>

            <span className="stat-subtext">
              Crew actively cleaning
            </span>

          </div>

          <div className="stat-summary-card stat-emerald">

            <div className="stat-header">

              <span className="stat-label">
                Resolved
              </span>

              <div className="stat-icon-wrap">
                <CheckCircle2 size={20} />
              </div>

            </div>

            <strong className="stat-number">
              {loading
                ? "..."
                : resolvedCount}
            </strong>

            <span className="stat-subtext">
              Cleaned & recycled
            </span>

          </div>

        </section>

        {/* ==========================================
            ERROR
        ========================================== */}
        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px 18px",
              borderRadius: "12px",
              background: "#fff1f2",
              color: "#be123c",
              border: "1px solid #fecdd3",
            }}
          >
            {error}
          </div>
        )}

        {/* ==========================================
            MAIN GRID
        ========================================== */}
        <div className="dashboard-main-grid">

          {/* ==========================================
              RECENT REPORTS
          ========================================== */}
          <div className="dashboard-panel-card">

            <div className="panel-header">

              <div>
                <h3>
                  Recent Waste Reports
                </h3>

                <p>
                  Track the progress of your
                  submitted complaints
                </p>
              </div>

              <Link
                to="/complaints"
                className="panel-view-all"
              >
                View All
                <ArrowRight size={14} />
              </Link>

            </div>

            <div className="dashboard-list">

              {loading && (
                <div
                  style={{
                    padding: "35px 20px",
                    textAlign: "center",
                    color: "#667085",
                  }}
                >
                  Loading your reports...
                </div>
              )}

              {!loading &&
                complaints.length === 0 && (
                  <div
                    style={{
                      padding: "35px 20px",
                      textAlign: "center",
                      color: "#667085",
                    }}
                  >
                    <FileText
                      size={35}
                      style={{
                        marginBottom: "10px",
                      }}
                    />

                    <h4>
                      No waste reports yet
                    </h4>

                    <p>
                      You have not submitted any
                      waste report yet.
                    </p>

                    <Link
                      to="/report-issue"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "10px",
                        color: "#16a34a",
                        fontWeight: "600",
                      }}
                    >
                      Report an Issue
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                )}

              {!loading &&
                complaints
                  .slice(0, 4)
                  .map((c) => (
                    <div
                      key={c.id}
                      className="dashboard-list-item"
                    >

                      <div className="item-icon-box">
                        <AlertTriangle size={18} />
                      </div>

                      <div className="item-content">

                        <div className="item-title-row">

                          <h4>
                            {c.title}
                          </h4>

                          <span
                            className={`status-pill status-${String(
                              c.status
                            )
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                          >
                            {c.status}
                          </span>

                        </div>

                        <div className="item-meta">

                          <span className="meta-id">
                            #{c.displayId}
                          </span>

                          <span>
                            •
                          </span>

                          <span className="meta-location">

                            <MapPin size={12} />

                            {c.location}

                          </span>

                          <span>
                            •
                          </span>

                          <span className="meta-date">

                            <CalendarDays size={12} />

                            {c.date}

                          </span>

                        </div>

                      </div>

                      <Link
                        to={`/complaints/${c.id}`}
                        className="item-action-btn"
                      >
                        <ExternalLink size={16} />
                      </Link>

                    </div>
                  ))}

            </div>
          </div>

          {/* ==========================================
              RIGHT SIDEBAR
          ========================================== */}
          <div className="dashboard-sidebar-panels">

            {/* ==========================================
                SCHEDULED PICKUPS
            ========================================== */}
            <div className="dashboard-panel-card">

              <div className="panel-header">

                <div>

                  <h3>
                    Scheduled Pickups
                  </h3>

                  <p>
                    Upcoming doorstep collections
                  </p>

                </div>

                <Link
                  to="/pickup-request"
                  className="panel-add-btn"
                >
                  <Plus size={14} />
                  Book
                </Link>

              </div>

              <div className="pickups-list">

                {pickupLoading && (
                  <div
                    style={{
                      padding: "25px 15px",
                      textAlign: "center",
                      color: "#667085",
                    }}
                  >
                    Loading pickups...
                  </div>
                )}

                {!pickupLoading &&
                  pickups.length === 0 && (
                    <div
                      style={{
                        padding: "25px 15px",
                        textAlign: "center",
                        color: "#667085",
                      }}
                    >
                      <Truck
                        size={32}
                        style={{
                          marginBottom: "8px",
                          opacity: 0.7,
                        }}
                      />

                      <p>
                        No pickups scheduled yet.
                      </p>

                      <Link
                        to="/pickup-request"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          marginTop: "8px",
                          color: "#16a34a",
                          fontWeight: "600",
                        }}
                      >
                        Schedule Pickup
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  )}

                {!pickupLoading &&
                  pickups.slice(0, 3).map((p) => (

                    <div
                      key={p.id || p.bookingId}
                      className="pickup-compact-item"
                    >

                      <div className="pickup-compact-top">

                        <div className="pickup-compact-icon">
                          <Truck size={18} />
                        </div>

                        <div>

                          <strong>
                            {p.wasteType}
                          </strong>

                          <span className="pickup-id-tag">
                            #{p.bookingId}
                          </span>

                        </div>

                        <span
                          className={
                            p.status === "Completed"
                              ? "badge-scheduled badge-completed"
                              : p.status === "Cancelled"
                              ? "badge-scheduled badge-cancelled"
                              : "badge-scheduled"
                          }
                        >
                          {p.status}
                        </span>

                      </div>

                      <div className="pickup-compact-meta">

                        <span>
                          <CalendarDays size={13} />
                          {p.pickupDate}
                        </span>

                        <span>
                          <Clock3 size={13} />
                          {p.pickupTime}
                        </span>

                      </div>

                    </div>

                  ))}

              </div>

              {pickupError && (
                <div
                  style={{
                    padding: "0 15px 15px",
                    color: "#be123c",
                    fontSize: "13px",
                  }}
                >
                  {pickupError}
                </div>
              )}

            </div>

            {/* ==========================================
                CLEANLINESS INDEX
            ========================================== */}
            <div className="dashboard-panel-card cleanliness-panel">

              <div className="cleanliness-header">

                <TreePine
                  size={22}
                  className="text-emerald"
                />

                <div>

                  <h4>
                    Kanpur Central Ward
                  </h4>

                  <small>
                    Cleanliness Health Score
                  </small>

                </div>

              </div>

              <div className="cleanliness-meter-row">

                <div className="meter-circle">
                  <span>92%</span>
                </div>

                <div className="meter-details">

                  <strong>
                    Grade: A+ (Clean & Green)
                  </strong>

                  <p>
                    98.6% of wet waste diverted
                    into organic vermicomposting
                    this month.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;