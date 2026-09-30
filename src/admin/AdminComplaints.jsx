import { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  CalendarDays,
  FileWarning,
  ChevronDown,
} from "lucide-react";

function AdminComplaints() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [complaints, setComplaints] = useState([
    {
      id: "WM1024",
      title: "Garbage overflowing",
      type: "Uncollected Waste",
      location: "Civil Lines, Kanpur",
      date: "28 Sep 2026",
      status: "In Progress",
      priority: "High",
    },
    {
      id: "WM1023",
      title: "Illegal dumping",
      type: "Illegal Dumping",
      location: "Swaroop Nagar, Kanpur",
      date: "27 Sep 2026",
      status: "Pending",
      priority: "High",
    },
    {
      id: "WM1022",
      title: "Plastic waste on road",
      type: "Plastic Waste",
      location: "Mall Road, Kanpur",
      date: "26 Sep 2026",
      status: "Resolved",
      priority: "Medium",
    },
    {
      id: "WM1021",
      title: "Overflowing dustbin",
      type: "Overflowing Bin",
      location: "Kakadeo, Kanpur",
      date: "25 Sep 2026",
      status: "Pending",
      priority: "Medium",
    },
    {
      id: "WM1020",
      title: "Construction waste on street",
      type: "Construction Waste",
      location: "Arya Nagar, Kanpur",
      date: "24 Sep 2026",
      status: "In Progress",
      priority: "Low",
    },
    {
      id: "WM1019",
      title: "E-waste dumped near park",
      type: "E-Waste",
      location: "Kidwai Nagar, Kanpur",
      date: "23 Sep 2026",
      status: "Resolved",
      priority: "High",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id
          ? { ...complaint, status: newStatus }
          : complaint
      )
    );
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      complaint.id.toLowerCase().includes(searchText) ||
      complaint.title.toLowerCase().includes(searchText) ||
      complaint.location.toLowerCase().includes(searchText) ||
      complaint.type.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    if (status === "Resolved") return "admin-status resolved";
    if (status === "In Progress") return "admin-status in-progress";
    return "admin-status pending";
  };

  const getPriorityClass = (priority) => {
    if (priority === "High") return "admin-priority high";
    if (priority === "Medium") return "admin-priority medium";
    return "admin-priority low";
  };

  return (
    <div className="admin-complaints-page">

      {/* HEADER */}
      <section className="admin-page-header">
        <div>
          <span className="admin-header-label">
            ADMIN PANEL
          </span>

          <h1>Manage Complaints</h1>

          <p>
            Review, monitor and update waste complaints.
          </p>
        </div>

        <div className="admin-total-complaints">
          <FileWarning size={20} />
          <span>
            {filteredComplaints.length} Complaints
          </span>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="admin-filter-bar">

        <div className="admin-search-box">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search complaint, ID or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filter-select">
          <Filter size={18} />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <ChevronDown size={16} />
        </div>

      </section>

      {/* COMPLAINT CARDS */}
      <section className="admin-complaints-grid">

        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (

            <article
              className="admin-complaint-card"
              key={complaint.id}
            >

              {/* CARD TOP */}
              <div className="admin-card-top">

                <div className="admin-card-icon">
                  <FileWarning size={22} />
                </div>

                <div className="admin-card-id">
                  #{complaint.id}
                </div>

                <span
                  className={getStatusClass(
                    complaint.status
                  )}
                >
                  {complaint.status}
                </span>

              </div>

              {/* TITLE */}
              <h2>{complaint.title}</h2>

              <span className="admin-complaint-type">
                {complaint.type}
              </span>

              {/* INFO */}
              <div className="admin-complaint-details">

                <div>
                  <MapPin size={16} />
                  <span>{complaint.location}</span>
                </div>

                <div>
                  <CalendarDays size={16} />
                  <span>{complaint.date}</span>
                </div>

              </div>

              {/* BOTTOM */}
              <div className="admin-card-bottom">

                <span
                  className={getPriorityClass(
                    complaint.priority
                  )}
                >
                  {complaint.priority} Priority
                </span>

                {/* STATUS UPDATE */}
                <select
                  value={complaint.status}
                  onChange={(e) =>
                    updateStatus(
                      complaint.id,
                      e.target.value
                    )
                  }
                  className="admin-status-select"
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
                </select>

              </div>

            </article>

          ))
        ) : (
          <div className="admin-no-results">
            <FileWarning size={40} />

            <h3>No complaints found</h3>

            <p>
              Try changing your search or filter.
            </p>
          </div>
        )}

      </section>

    </div>
  );
}

export default AdminComplaints;