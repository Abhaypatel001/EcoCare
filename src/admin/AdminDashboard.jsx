import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ShieldCheck,
  Truck,
  AlertTriangle,
  Clock3,
  Search,
  Filter,
  MapPin,
  Leaf,
  RefreshCw,
  Users,
  UserCheck,
  Mail,
  Phone,
  BarChart3,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";

function AdminDashboard() {
  // ==========================================
  // STATE
  // ==========================================

  const [complaints, setComplaints] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [activeTab, setActiveTab] =
    useState("complaints");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [pickupSearch, setPickupSearch] =
    useState("");

  const [pickupStatusFilter, setPickupStatusFilter] =
    useState("All");

  const [citizenSearch, setCitizenSearch] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [pickupLoading, setPickupLoading] =
    useState(false);
  const [citizenLoading, setCitizenLoading] =
    useState(false);
  const [analyticsLoading, setAnalyticsLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [updatingComplaintId, setUpdatingComplaintId] =
    useState(null);

  const [updatingPickupId, setUpdatingPickupId] =
    useState(null);

  // ==========================================
  // TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("ecocare_token");
  };

  // ==========================================
  // FETCH COMPLAINTS
  // ==========================================

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin authentication required."
        );
      }

      const response = await fetch(
        "https://ecocare-backend-zhgx.onrender.com/api/complaints",
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
          data.message ||
            "Failed to load complaints"
        );
      }

      setComplaints(data.complaints || []);
    } catch (error) {
      console.error(
        "Fetch Complaints Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH PICKUPS
  // ==========================================

  const fetchPickups = async (
    showLoader = true
  ) => {
    try {
      if (showLoader) {
        setPickupLoading(true);
      }

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin authentication required."
        );
      }

      const response = await fetch(
        "https://ecocare-backend-zhgx.onrender.com/api/pickups",
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
          data.message ||
            "Failed to load pickup requests"
        );
      }

      setPickups(data.pickups || []);
    } catch (error) {
      console.error(
        "Fetch Pickups Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load pickup requests."
      );
    } finally {
      setPickupLoading(false);
    }
  };

  // ==========================================
  // FETCH CITIZENS
  // ==========================================

  const fetchCitizens = async () => {
    try {
      setCitizenLoading(true);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin authentication required."
        );
      }

      const response = await fetch(
        "https://ecocare-backend-zhgx.onrender.com/api/users/citizens",
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
          data.message ||
            "Failed to load citizens"
        );
      }

      setCitizens(data.citizens || []);
    } catch (error) {
      console.error(
        "Fetch Citizens Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load citizens."
      );
    } finally {
      setCitizenLoading(false);
    }
  };

  // ==========================================
  // FETCH ANALYTICS
  // ==========================================

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin authentication required."
        );
      }

      const response = await fetch(
        "https://ecocare-backend-zhgx.onrender.com/api/analytics",
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
          data.message ||
            "Failed to load analytics"
        );
      }

      setAnalytics(data.analytics || null);
    } catch (error) {
      console.error(
        "Fetch Analytics Error:",
        error
      );

      setError(
        error.message ||
          "Unable to load analytics."
      );
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // ==========================================
  // LOAD EVERYTHING
  // ==========================================

  const fetchAllData = async () => {
    setError("");

    await Promise.all([
      fetchComplaints(),
      fetchPickups(false),
      fetchCitizens(),
      fetchAnalytics(),
    ]);
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchAllData();
  }, []);

  // ==========================================
  // AUTO REFRESH PICKUPS
  // ==========================================

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPickups(false);
      fetchAnalytics();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // UPDATE COMPLAINT STATUS
  // ==========================================

  const updateComplaintStatus = async (
    complaintId,
    newStatus
  ) => {
    try {
      setError("");
      setUpdatingComplaintId(complaintId);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin authentication required."
        );
      }

      const response = await fetch(
        `https://ecocare-backend-zhgx.onrender.com/api/complaints/${complaintId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update complaint status"
        );
      }

      setComplaints(
        (previousComplaints) =>
          previousComplaints.map(
            (complaint) =>
              complaint._id === complaintId
                ? {
                    ...complaint,
                    status:
                      data.complaint.status,
                    updatedAt:
                      data.complaint.updatedAt,
                  }
                : complaint
          )
      );

      await fetchAnalytics();
    } catch (error) {
      console.error(
        "Update Complaint Status Error:",
        error
      );

      setError(
        error.message ||
          "Unable to update complaint status."
      );
    } finally {
      setUpdatingComplaintId(null);
    }
  };

  // ==========================================
  // UPDATE PICKUP STATUS
  // ==========================================

  const updatePickupStatus = async (
    pickupId,
    newStatus
  ) => {
    try {
      setError("");
      setUpdatingPickupId(pickupId);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin authentication required."
        );
      }

      const response = await fetch(
        `https://ecocare-backend-zhgx.onrender.com/api/pickups/${pickupId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update pickup status"
        );
      }

      setPickups(
        (previousPickups) =>
          previousPickups.map(
            (pickup) =>
              pickup._id === pickupId
                ? {
                    ...pickup,
                    status:
                      data.pickup.status,
                    updatedAt:
                      data.pickup.updatedAt,
                  }
                : pickup
          )
      );

      await fetchAnalytics();
    } catch (error) {
      console.error(
        "Update Pickup Status Error:",
        error
      );

      setError(
        error.message ||
          "Unable to update pickup status."
      );
    } finally {
      setUpdatingPickupId(null);
    }
  };

  // ==========================================
  // FILTER COMPLAINTS
  // ==========================================

  const filteredComplaints =
    complaints.filter((complaint) => {
      const searchText =
        search.toLowerCase();

      const title =
        complaint.title?.toLowerCase() || "";

      const location =
        complaint.location?.toLowerCase() || "";

      const category =
        complaint.category?.toLowerCase() || "";

      const id =
        complaint._id?.toLowerCase() || "";

      const citizenName =
        complaint.user?.name?.toLowerCase() ||
        "";

      const citizenEmail =
        complaint.user?.email?.toLowerCase() ||
        "";

      const matchesSearch =
        title.includes(searchText) ||
        location.includes(searchText) ||
        category.includes(searchText) ||
        id.includes(searchText) ||
        citizenName.includes(searchText) ||
        citizenEmail.includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        complaint.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // ==========================================
  // FILTER PICKUPS
  // ==========================================

  const filteredPickups =
    pickups.filter((pickup) => {
      const searchText =
        pickupSearch.toLowerCase();

      const bookingId =
        pickup.bookingId?.toLowerCase() || "";

      const wasteType =
        pickup.wasteType?.toLowerCase() || "";

      const address =
        pickup.address?.toLowerCase() || "";

      const fullName =
        pickup.fullName?.toLowerCase() || "";

      const phone =
        pickup.phone?.toLowerCase() || "";

      const email =
        pickup.user?.email?.toLowerCase() || "";

      const matchesSearch =
        bookingId.includes(searchText) ||
        wasteType.includes(searchText) ||
        address.includes(searchText) ||
        fullName.includes(searchText) ||
        phone.includes(searchText) ||
        email.includes(searchText);

      const matchesStatus =
        pickupStatusFilter === "All" ||
        pickup.status?.toLowerCase() ===
          pickupStatusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // ==========================================
  // FILTER CITIZENS
  // ==========================================

  const filteredCitizens =
    citizens.filter((citizen) => {
      const searchText =
        citizenSearch.toLowerCase();

      const name =
        citizen.name?.toLowerCase() || "";

      const email =
        citizen.email?.toLowerCase() || "";

      const phone =
        citizen.phone?.toLowerCase() || "";

      return (
        name.includes(searchText) ||
        email.includes(searchText) ||
        phone.includes(searchText)
      );
    });

  // ==========================================
  // COMPLAINT COUNTS
  // ==========================================

  const openComplaints =
    complaints.filter(
      (c) => c.status !== "Resolved"
    ).length;

  const pendingComplaints =
    complaints.filter(
      (c) => c.status === "Pending"
    ).length;

  const resolvedComplaints =
    complaints.filter(
      (c) => c.status === "Resolved"
    ).length;

  // ==========================================
  // PICKUP COUNTS
  // ==========================================

  const scheduledPickups =
    pickups.filter(
      (p) => p.status === "Scheduled"
    ).length;

  const inProgressPickups =
    pickups.filter(
      (p) => p.status === "In Progress"
    ).length;

  const completedPickups =
    pickups.filter(
      (p) => p.status === "Completed"
    ).length;

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // PICKUP TIME FORMAT
  // ==========================================

  const formatPickupTime = (time) => {
    const slots = {
      morning:
        "08:00 AM – 11:00 AM",

      afternoon:
        "12:00 PM – 03:00 PM",

      evening:
        "04:00 PM – 07:00 PM",
    };

    return (
      slots[time] ||
      time ||
      "N/A"
    );
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    return (
      "status-select-control status-" +
      String(status || "Pending")
        .toLowerCase()
        .replace(/\s+/g, "-")
    );
  };

  const getPickupStatusClass = (
    status
  ) => {
    return (
      "status-select-control status-" +
      String(status || "Scheduled")
        .toLowerCase()
        .replace(/\s+/g, "-")
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="admin-dashboard-page">

      <div className="admin-container">

        {/* ==========================================
            ADMIN HEADER
        ========================================== */}

        <div className="admin-top-header">

          <div className="admin-title-area">

            <div className="admin-badge">
              <ShieldCheck size={14} />
              Municipal Sanitation Authority
            </div>

            <h1>
              Municipal Command Center
            </h1>

            <p>
              Real-time waste fleet telemetry,
              citizen reports dispatch, and
              organic processing metrics.
            </p>

          </div>

          <div className="admin-header-actions">

            <span className="live-clock-pill">
              <span className="live-dot pulse"></span>
              Telemetry Active
            </span>

            <button
              type="button"
              className="btn-admin-cta"
              onClick={fetchAllData}
              disabled={
                loading ||
                pickupLoading ||
                citizenLoading ||
                analyticsLoading
              }
            >
              <RefreshCw
                size={15}
              />

              {loading ||
              pickupLoading ||
              citizenLoading ||
              analyticsLoading
                ? "Loading..."
                : "Refresh Data"}
            </button>

          </div>

        </div>

        {/* ==========================================
            TOP STAT CARDS
        ========================================== */}

        <div className="admin-metrics-row">

          <div className="admin-stat-card">

            <div className="admin-stat-icon-wrap bg-green">
              <Truck size={22} />
            </div>

            <div>

              <span className="admin-stat-lbl">
                Active Green Fleet
              </span>

              <strong className="admin-stat-val">
                18 Vehicles
              </strong>

              <small className="stat-note text-green">
                14 Electric • 4 Compactors
              </small>

            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon-wrap bg-orange">
              <AlertTriangle size={22} />
            </div>

            <div>

              <span className="admin-stat-lbl">
                Open Incidents
              </span>

              <strong className="admin-stat-val">
                {openComplaints}
              </strong>

              <small className="stat-note text-orange">
                {pendingComplaints} Pending
              </small>

            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon-wrap bg-blue">
              <Clock3 size={22} />
            </div>

            <div>

              <span className="admin-stat-lbl">
                Scheduled Pickups
              </span>

              <strong className="admin-stat-val">
                {scheduledPickups}
              </strong>

              <small className="stat-note text-blue">
                {pickups.length} Total Requests
              </small>

            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon-wrap bg-emerald">
              <Leaf size={22} />
            </div>

            <div>

              <span className="admin-stat-lbl">
                Resolved Reports
              </span>

              <strong className="admin-stat-val">
                {resolvedComplaints}
              </strong>

              <small className="stat-note text-emerald">
                Successfully resolved
              </small>

            </div>

          </div>

        </div>

        {/* ==========================================
            ANALYTICS
        ========================================== */}

        <section className="admin-analytics-section">

          <div className="analytics-section-header">

            <div>

              <div className="analytics-eyebrow">
                <BarChart3 size={14} />
                ECOCARE ANALYTICS
              </div>

              <h2>
                System Overview
              </h2>

              <p>
                Live statistics from citizen
                complaints and waste pickup
                requests.
              </p>

            </div>

            <div className="analytics-live-badge">
              <span className="analytics-live-dot"></span>
              Live Data
            </div>

          </div>


          {analyticsLoading ? (

            <div className="analytics-loading-box">

              <RefreshCw
                size={22}
                className="analytics-spin"
              />

              <span>
                Loading analytics...
              </span>

            </div>

          ) : analytics ? (

            <>

              <div className="analytics-cards-grid">

                <div className="analytics-card analytics-card-green">

                  <div className="analytics-card-icon">
                    <Users size={22} />
                  </div>

                  <div>

                    <span>
                      Total Citizens
                    </span>

                    <strong>
                      {analytics.citizens?.total || 0}
                    </strong>

                    <small>
                      Registered users
                    </small>

                  </div>

                </div>


                <div className="analytics-card analytics-card-orange">

                  <div className="analytics-card-icon">
                    <ClipboardList size={22} />
                  </div>

                  <div>

                    <span>
                      Total Complaints
                    </span>

                    <strong>
                      {analytics.complaints?.total || 0}
                    </strong>

                    <small>
                      Citizen waste reports
                    </small>

                  </div>

                </div>


                <div className="analytics-card analytics-card-blue">

                  <div className="analytics-card-icon">
                    <CheckCircle2 size={22} />
                  </div>

                  <div>

                    <span>
                      Resolved Complaints
                    </span>

                    <strong>
                      {analytics.complaints?.resolved || 0}
                    </strong>

                    <small>
                      Successfully resolved
                    </small>

                  </div>

                </div>


                <div className="analytics-card analytics-card-purple">

                  <div className="analytics-card-icon">
                    <Truck size={22} />
                  </div>

                  <div>

                    <span>
                      Total Pickups
                    </span>

                    <strong>
                      {analytics.pickups?.total || 0}
                    </strong>

                    <small>
                      Doorstep requests
                    </small>

                  </div>

                </div>

              </div>


              <div className="analytics-breakdown-grid">

                {/* COMPLAINT STATUS */}

                <div className="analytics-breakdown-card">

                  <div className="analytics-breakdown-title">

                    <div className="breakdown-icon complaints-icon">
                      <AlertTriangle size={18} />
                    </div>

                    <div>

                      <h3>
                        Complaint Status
                      </h3>

                      <span>
                        Current report distribution
                      </span>

                    </div>

                  </div>


                  <div className="analytics-status-list">

                    <div className="analytics-status-row">

                      <span>
                        <i className="status-dot pending-dot"></i>
                        Pending
                      </span>

                      <strong>
                        {analytics.complaints?.pending || 0}
                      </strong>

                    </div>


                    <div className="analytics-status-row">

                      <span>
                        <i className="status-dot progress-dot"></i>
                        In Progress
                      </span>

                      <strong>
                        {analytics.complaints?.inProgress || 0}
                      </strong>

                    </div>


                    <div className="analytics-status-row">

                      <span>
                        <i className="status-dot resolved-dot"></i>
                        Resolved
                      </span>

                      <strong>
                        {analytics.complaints?.resolved || 0}
                      </strong>

                    </div>


                    <div className="analytics-status-row">

                      <span>
                        <i className="status-dot rejected-dot"></i>
                        Rejected
                      </span>

                      <strong>
                        {analytics.complaints?.rejected || 0}
                      </strong>

                    </div>

                  </div>

                </div>


                {/* PICKUP STATUS */}

                <div className="analytics-breakdown-card">

                  <div className="analytics-breakdown-title">

                    <div className="breakdown-icon pickup-icon">
                      <Truck size={18} />
                    </div>

                    <div>

                      <h3>
                        Pickup Status
                      </h3>

                      <span>
                        Current collection distribution
                      </span>

                    </div>

                  </div>


                  <div className="analytics-status-list">

                    <div className="analytics-status-row">

                      <span>
                        <i className="status-dot scheduled-dot"></i>
                        Scheduled
                      </span>

                      <strong>
                        {analytics.pickups?.scheduled || 0}
                      </strong>

                    </div>


                    <div className="analytics-status-row">

                      <span>
                        <i className="status-dot progress-dot"></i>
                        In Progress
                      </span>

                      <strong>
                        {analytics.pickups?.inProgress || 0}
                      </strong>

                    </div>


                    <div className="analytics-status-row">

                      <span>
                        <i className="status-dot completed-dot"></i>
                        Completed
                      </span>

                      <strong>
                        {analytics.pickups?.completed || 0}
                      </strong>

                    </div>


                    <div className="analytics-status-row">

                      <span>
                        <i className="status-dot cancelled-dot"></i>
                        Cancelled
                      </span>

                      <strong>
                        {analytics.pickups?.cancelled || 0}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

            </>

          ) : (

            <div className="analytics-empty-box">

              <BarChart3 size={28} />

              <h3>
                Analytics unavailable
              </h3>

              <p>
                Unable to load live analytics
                data from the server.
              </p>

            </div>

          )}

        </section>


        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (

          <div
            style={{
              padding: "14px 16px",
              marginBottom: "16px",
              borderRadius: "10px",
              background: "#fff1f2",
              color: "#be123c",
              border:
                "1px solid #fecdd3",
            }}
          >
            {error}
          </div>

        )}


        {/* ==========================================
            TABS
        ========================================== */}

        <div className="admin-tabs-bar">

          <button
            type="button"
            className={`admin-tab-btn ${
              activeTab ===
              "complaints"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "complaints"
              )
            }
          >

            <AlertTriangle size={16} />

            <span>
              Citizen Waste Reports (
              {complaints.length})
            </span>

          </button>


          <button
            type="button"
            className={`admin-tab-btn ${
              activeTab ===
              "pickups"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "pickups"
              )
            }
          >

            <Truck size={16} />

            <span>
              Doorstep Pickups Dispatch (
              {pickups.length})
            </span>

          </button>


          <button
            type="button"
            className={`admin-tab-btn ${
              activeTab ===
              "citizens"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "citizens"
              )
            }
          >

            <Users size={16} />

            <span>
              Citizens Management (
              {citizens.length})
            </span>

          </button>

        </div>


        {/* ==========================================
            COMPLAINTS TAB
        ========================================== */}

        {activeTab ===
          "complaints" && (

          <div className="admin-panel-box">

            <div className="panel-controls-row">

              <div className="admin-search-wrapper">

                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search complaint ID, location, issue, citizen..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>


              <div className="admin-filter-wrapper">

                <Filter size={16} />

                <select
                  value={
                    statusFilter
                  }
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
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

            </div>


            {loading ? (

              <div className="admin-empty-state">
                Loading complaints...
              </div>

            ) : filteredComplaints.length ===
              0 ? (

              <div className="admin-empty-state">

                <AlertTriangle size={40} />

                <h3>
                  No complaints found
                </h3>

                <p>
                  There are no complaints
                  matching your current
                  search or filter.
                </p>

              </div>

            ) : (

              <div className="admin-table-container">

                <table className="admin-data-table">

                  <thead>

                    <tr>

                      <th>
                        Report ID
                      </th>

                      <th>
                        Issue & Location
                      </th>

                      <th>
                        Category
                      </th>

                      <th>
                        Citizen
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredComplaints.map(
                      (item) => (

                        <tr
                          key={
                            item._id
                          }
                        >

                          <td className="font-mono">

                            <Link
                              to={`/complaints/${item._id}`}
                              className="id-link"
                            >
                              #
                              {item._id
                                .slice(
                                  -6
                                )
                                .toUpperCase()}
                            </Link>

                          </td>


                          <td>

                            <strong>
                              {item.title}
                            </strong>

                            <div className="table-sub-meta">

                              <MapPin size={12} />

                              {item.location}

                              {" • "}

                              {formatDate(
                                item.createdAt
                              )}

                            </div>

                          </td>


                          <td>

                            <span className="type-badge">
                              {item.category}
                            </span>

                          </td>


                          <td>

                            <strong>
                              {item.user
                                ?.name ||
                                "Unknown User"}
                            </strong>

                            <div className="table-sub-meta">
                              {item.user
                                ?.email ||
                                ""}
                            </div>

                          </td>


                          <td>

                            <select
                              className={getStatusClass(
                                item.status
                              )}
                              value={
                                item.status
                              }
                              disabled={
                                updatingComplaintId ===
                                item._id
                              }
                              onChange={(
                                e
                              ) =>
                                updateComplaintStatus(
                                  item._id,
                                  e.target.value
                                )
                              }
                            >

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

                            {updatingComplaintId ===
                              item._id && (

                              <small className="updating-text">
                                Updating...
                              </small>

                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        )}


        {/* ==========================================
            PICKUPS TAB
        ========================================== */}

        {activeTab ===
          "pickups" && (

          <div className="admin-panel-box">

            <div className="panel-controls-row">

              <div className="admin-search-wrapper">

                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search booking ID, citizen, phone, waste type, address..."
                  value={
                    pickupSearch
                  }
                  onChange={(e) =>
                    setPickupSearch(
                      e.target.value
                    )
                  }
                />

              </div>


              <div className="admin-filter-wrapper">

                <Filter size={16} />

                <select
                  value={
                    pickupStatusFilter
                  }
                  onChange={(e) =>
                    setPickupStatusFilter(
                      e.target.value
                    )
                  }
                >

                  <option value="All">
                    All Pickup Statuses
                  </option>

                  <option value="Scheduled">
                    Scheduled
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

            </div>


            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "18px",
              }}
            >

              <span
                className="type-badge"
                style={{
                  background: "#eff6ff",
                  color: "#1d4ed8",
                }}
              >
                Scheduled:{" "}
                {scheduledPickups}
              </span>


              <span
                className="type-badge"
                style={{
                  background: "#fff7ed",
                  color: "#c2410c",
                }}
              >
                In Progress:{" "}
                {inProgressPickups}
              </span>


              <span
                className="type-badge"
                style={{
                  background: "#ecfdf3",
                  color: "#15803d",
                }}
              >
                Completed:{" "}
                {completedPickups}
              </span>

            </div>


            {pickupLoading ? (

              <div className="admin-empty-state">
                Loading pickup requests...
              </div>

            ) : filteredPickups.length ===
              0 ? (

              <div className="admin-empty-state">

                <Truck size={42} />

                <h3>
                  No pickup requests found
                </h3>

                <p>
                  Citizen pickup requests
                  will automatically appear
                  here after booking.
                </p>

              </div>

            ) : (

              <div className="admin-table-container">

                <table className="admin-data-table">

                  <thead>

                    <tr>

                      <th>
                        Booking ID
                      </th>

                      <th>
                        Citizen Details
                      </th>

                      <th>
                        Waste Type
                      </th>

                      <th>
                        Quantity
                      </th>

                      <th>
                        Address
                      </th>

                      <th>
                        Scheduled Slot
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredPickups.map(
                      (p) => (

                        <tr
                          key={
                            p._id
                          }
                        >

                          <td className="font-mono">

                            <strong>
                              #
                              {p.bookingId}
                            </strong>

                            <div className="table-sub-meta">
                              {formatDate(
                                p.createdAt
                              )}
                            </div>

                          </td>


                          <td>

                            <strong>
                              {p.fullName ||
                                p.user
                                  ?.name ||
                                "Unknown User"}
                            </strong>

                            <div className="table-sub-meta">
                              {p.phone ||
                                p.user
                                  ?.phone ||
                                ""}
                            </div>

                            <div className="table-sub-meta">
                              {p.user
                                ?.email ||
                                ""}
                            </div>

                          </td>


                          <td>

                            <span className="type-badge">
                              {p.wasteType}
                            </span>

                          </td>


                          <td>
                            {p.quantity}
                          </td>


                          <td>

                            <strong>
                              {p.addressType}
                            </strong>

                            <div className="table-sub-meta">

                              <MapPin size={12} />

                              {p.address}

                            </div>

                          </td>


                          <td>

                            <strong>
                              {p.pickupDate}
                            </strong>

                            <div className="table-sub-meta">
                              {formatPickupTime(
                                p.pickupTime
                              )}
                            </div>

                          </td>


                          <td>

                            <select
                              className={getPickupStatusClass(
                                p.status
                              )}
                              value={
                                p.status ||
                                "Scheduled"
                              }
                              disabled={
                                updatingPickupId ===
                                p._id
                              }
                              onChange={(
                                e
                              ) =>
                                updatePickupStatus(
                                  p._id,
                                  e.target.value
                                )
                              }
                            >

                              <option value="Scheduled">
                                Scheduled
                              </option>

                              <option value="In Progress">
                                In Progress
                              </option>

                              <option value="Completed">
                                Completed
                              </option>

                              <option value="Cancelled">
                                Cancelled
                              </option>

                            </select>

                            {updatingPickupId ===
                              p._id && (

                              <small className="updating-text">
                                Updating...
                              </small>

                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        )}


        {/* ==========================================
            CITIZENS MANAGEMENT
        ========================================== */}

        {activeTab ===
          "citizens" && (

          <div className="admin-panel-box">

            <div className="citizens-header">

              <div>

                <div className="citizens-title">

                  <Users size={22} />

                  <h2>
                    Citizens Management
                  </h2>

                </div>

                <p>
                  View registered citizens
                  and their waste activity.
                </p>

              </div>


              <div className="registered-citizens-badge">

                <UserCheck size={17} />

                {citizens.length}
                {" "}
                Registered Citizens

              </div>

            </div>


            <div
              className="panel-controls-row"
              style={{
                marginBottom: "20px",
              }}
            >

              <div className="admin-search-wrapper">

                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search citizen by name, email or phone..."
                  value={
                    citizenSearch
                  }
                  onChange={(e) =>
                    setCitizenSearch(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>


            {citizenLoading ? (

              <div className="admin-empty-state">
                Loading citizens...
              </div>

            ) : filteredCitizens.length ===
              0 ? (

              <div className="admin-empty-state">

                <Users size={42} />

                <h3>
                  No citizens found
                </h3>

                <p>
                  No registered citizen
                  matches your search.
                </p>

              </div>

            ) : (

              <div className="admin-table-container">

                <table className="admin-data-table">

                  <thead>

                    <tr>

                      <th>
                        Citizen
                      </th>

                      <th>
                        Contact
                      </th>

                      <th>
                        Complaints
                      </th>

                      <th>
                        Pickups
                      </th>

                      <th>
                        Registered
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredCitizens.map(
                      (citizen) => (

                        <tr
                          key={
                            citizen._id
                          }
                        >

                          <td>

                            <div className="citizen-cell">

                              <div className="citizen-avatar">

                                {citizen.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "U"}

                              </div>

                              <div>

                                <strong>
                                  {citizen.name ||
                                    "Unknown User"}
                                </strong>

                                <div className="table-sub-meta">
                                  Citizen
                                </div>

                              </div>

                            </div>

                          </td>


                          <td>

                            <div className="contact-line">

                              <Mail size={12} />

                              {citizen.email ||
                                "N/A"}

                            </div>

                            <div className="contact-line">

                              <Phone size={12} />

                              {citizen.phone ||
                                "Not provided"}

                            </div>

                          </td>


                          <td>

                            <span
                              className="type-badge"
                              style={{
                                background:
                                  "#fff7ed",
                                color:
                                  "#c2410c",
                              }}
                            >

                              {citizen.complaintCount ||
                                0}
                              {" "}
                              Reports

                            </span>

                          </td>


                          <td>

                            <span
                              className="type-badge"
                              style={{
                                background:
                                  "#eff6ff",
                                color:
                                  "#1d4ed8",
                              }}
                            >

                              {citizen.pickupCount ||
                                0}
                              {" "}
                              Pickups

                            </span>

                          </td>


                          <td>
                            {formatDate(
                              citizen.createdAt
                            )}
                          </td>


                          <td>

                            <span
                              className="type-badge"
                              style={{
                                background:
                                  "#ecfdf3",
                                color:
                                  "#15803d",
                              }}
                            >
                              Active
                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminDashboard;