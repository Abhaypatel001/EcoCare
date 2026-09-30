import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  FileText,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Filter,
  Plus,
  Layers,
  Leaf,
  RefreshCw,
} from "lucide-react";
import ComplaintCard from "../components/ComplaintCard";

function Complaints() {
  const [complaintList, setComplaintList] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH MY COMPLAINTS FROM BACKEND
  // ==========================================
  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("ecocare_token");

      if (!token) {
        setError("Please login to view your complaints.");
        setComplaintList([]);
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
          data.message || "Failed to load complaints"
        );
      }

      // ==========================================
      // CONVERT BACKEND DATA TO COMPLAINT CARD FORMAT
      // ==========================================
      const formattedComplaints = (
        data.complaints || []
      ).map((complaint) => ({
        id: complaint._id,

        title: complaint.title,

        type: complaint.category,

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

        status: complaint.status,

        // Backend currently doesn't have priority
        priority: "Medium",

        description: complaint.description,

        image: complaint.image || "",

        // Keep original backend ID
        _id: complaint._id,

        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
      }));

      setComplaintList(formattedComplaints);
    } catch (error) {
      console.error(
        "Fetch My Complaints Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load your complaints."
      );

      setComplaintList([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD COMPLAINTS ON PAGE OPEN
  // ==========================================
  useEffect(() => {
    fetchMyComplaints();
  }, []);

  // ==========================================
  // FILTER COMPLAINTS
  // ==========================================
  const filteredComplaints = complaintList.filter(
    (item) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const title =
        item.title?.toLowerCase() || "";

      const id =
        item.id?.toLowerCase() || "";

      const location =
        item.location?.toLowerCase() || "";

      const category =
        item.type?.toLowerCase() || "";

      const matchesSearch =
        title.includes(searchText) ||
        id.includes(searchText) ||
        location.includes(searchText) ||
        category.includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        item.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesType =
        typeFilter === "All" ||
        item.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    }
  );

  // ==========================================
  // COMPLAINT COUNTS
  // ==========================================
  const total = complaintList.length;

  const pending = complaintList.filter(
    (item) =>
      item.status?.toLowerCase() === "pending"
  ).length;

  const inProgress = complaintList.filter(
    (item) =>
      item.status?.toLowerCase() ===
      "in progress"
  ).length;

  const resolved = complaintList.filter(
    (item) =>
      item.status?.toLowerCase() === "resolved"
  ).length;

  // ==========================================
  // RESET FILTERS
  // ==========================================
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
  };

  return (
    <div className="complaints-page">
      <div className="complaints-container">

        {/* ==========================================
            TOP HEADER
        ========================================== */}

        <div className="complaints-header">

          <div className="header-info">

            <span className="page-pill">
              <Leaf size={14} />
              Transparent Citizen Tracking
            </span>

            <h1>
              Track City Waste Complaints
            </h1>

            <p>
              Monitor the live status of reported
              garbage dumps, uncollected bins, and
              neighborhood cleanups across all
              municipal wards.
            </p>

          </div>

          <Link
            to="/report-issue"
            className="btn-header-cta"
          >
            <Plus size={18} />
            <span>Report New Issue</span>
          </Link>

        </div>

        {/* ==========================================
            LIVE METRICS ROW
        ========================================== */}

        <div className="complaints-metrics-grid">

          {/* TOTAL */}

          <div
            className={`metric-stat-card ${
              statusFilter === "All"
                ? "active-filter"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("All")
            }
          >
            <div className="metric-icon bg-blue">
              <FileText size={20} />
            </div>

            <div>
              <span className="metric-count">
                {total}
              </span>

              <span className="metric-name">
                Total Reports
              </span>
            </div>
          </div>

          {/* PENDING */}

          <div
            className={`metric-stat-card ${
              statusFilter === "Pending"
                ? "active-filter"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("Pending")
            }
          >
            <div className="metric-icon bg-orange">
              <AlertCircle size={20} />
            </div>

            <div>
              <span className="metric-count">
                {pending}
              </span>

              <span className="metric-name">
                Pending Review
              </span>
            </div>
          </div>

          {/* IN PROGRESS */}

          <div
            className={`metric-stat-card ${
              statusFilter === "In Progress"
                ? "active-filter"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("In Progress")
            }
          >
            <div className="metric-icon bg-teal">
              <Clock3 size={20} />
            </div>

            <div>
              <span className="metric-count">
                {inProgress}
              </span>

              <span className="metric-name">
                In Progress
              </span>
            </div>
          </div>

          {/* RESOLVED */}

          <div
            className={`metric-stat-card ${
              statusFilter === "Resolved"
                ? "active-filter"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("Resolved")
            }
          >
            <div className="metric-icon bg-green">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span className="metric-count">
                {resolved}
              </span>

              <span className="metric-name">
                Cleaned & Resolved
              </span>
            </div>
          </div>

        </div>

        {/* ==========================================
            SEARCH + FILTER
        ========================================== */}

        <div className="complaints-filter-bar">

          <div className="search-input-wrapper">

            <Search
              size={18}
              className="search-svg"
            />

            <input
              type="text"
              placeholder="Search by ID, street name, or title..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() =>
                  setSearch("")
                }
              >
                Clear
              </button>
            )}

          </div>

          <div className="filter-select-group">

            {/* STATUS FILTER */}

            <div className="custom-select-box">

              <Filter size={15} />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="All">
                  All Statuses
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>

            </div>

            {/* CATEGORY FILTER */}

            <div className="custom-select-box">

              <Layers size={15} />

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value)
                }
              >
                <option value="All">
                  All Categories
                </option>

                <option value="Garbage Collection">
                  Garbage Collection
                </option>

                <option value="Waste Dumping">
                  Waste Dumping
                </option>

                <option value="Dirty Area">
                  Dirty Area
                </option>

                <option value="Blocked Drain">
                  Blocked Drain
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div
            style={{
              padding: "16px",
              marginBottom: "20px",
              borderRadius: "12px",
              background: "#fff1f2",
              color: "#be123c",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
            }}
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={fetchMyComplaints}
              style={{
                border: "none",
                background: "transparent",
                color: "#be123c",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "600",
              }}
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading ? (
          <div
            className="no-complaints-found"
            style={{
              padding: "60px 20px",
            }}
          >
            <div className="no-results-icon">
              <RefreshCw size={40} />
            </div>

            <h3>
              Loading your complaints...
            </h3>

            <p>
              Please wait while we fetch your
              complaints.
            </p>
          </div>
        ) : filteredComplaints.length > 0 ? (

          /* ==========================================
              COMPLAINTS GRID
          ========================================== */

          <div className="complaints-grid">

            {filteredComplaints.map((item) => (
              <ComplaintCard
                key={item.id}
                complaint={item}
              />
            ))}

          </div>

        ) : (

          /* ==========================================
              EMPTY STATE
          ========================================== */

          <div className="no-complaints-found">

            <div className="no-results-icon">
              <AlertCircle size={40} />
            </div>

            <h3>
              {complaintList.length === 0
                ? "No complaints submitted yet"
                : "No reports match your current filters"}
            </h3>

            <p>
              {complaintList.length === 0
                ? "You have not submitted any waste complaint yet."
                : "Try clearing your search query or switching your category filter."}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {(search ||
                statusFilter !== "All" ||
                typeFilter !== "All") && (
                <button
                  type="button"
                  className="btn-reset-filters"
                  onClick={resetFilters}
                >
                  Reset All Filters
                </button>
              )}

              {complaintList.length === 0 && (
                <Link
                  to="/report-issue"
                  className="btn-reset-filters"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  Report New Issue
                </Link>
              )}
            </div>

          </div>

        )}

      </div>
    </div>
  );
}

export default Complaints;