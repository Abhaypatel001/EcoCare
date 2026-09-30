import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  User,
  ShieldCheck,
  Truck,
  Leaf,
  Star,
  Phone
} from "lucide-react";

const initialComplaintDetails = {
  WM1024: {
    id: "WM1024",
    title: "Garbage overflowing near residential park",
    type: "Uncollected Waste",
    location: "Civil Lines, Near Green Park, Kanpur",
    date: "28 Sep 2026",
    status: "In Progress",
    priority: "High",
    description:
      "Garbage has been overflowing from the public bin point for several days. Waste is spilling onto the roadside and creating a breeding ground for insects. Immediate collection required.",
    imageBefore: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
    imageAfter: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    officer: {
      name: "Dinesh Verma",
      role: "Ward Sanitation Supervisor",
      phone: "+91 98390 11234",
      badge: "Eco-Fleet Crew #08",
      zone: "Civil Lines Zone 3"
    },
    timeline: [
      { title: "Complaint Registered", time: "28 Sep, 09:30 AM", done: true, desc: "Citizen uploaded geo-tagged photo with precise GPS coordinates." },
      { title: "Municipal Review & Verification", time: "28 Sep, 10:15 AM", done: true, desc: "Verified as Category 1 priority issue by automated routing." },
      { title: "Electric Crew Assigned", time: "28 Sep, 11:00 AM", done: true, desc: "Eco-Truck #08 and 3 crew members dispatched to Civil Lines." },
      { title: "On-Site Clearance & Disinfection", time: "28 Sep, 01:30 PM", done: false, desc: "Waste clearance, street sweeping, and eco-sanitization in progress." },
      { title: "Final Resolution & Recycling", time: "Estimated 04:00 PM", done: false, desc: "Organic scraps routed to central bio-compost pit." }
    ]
  },
  WM1021: {
    id: "WM1021",
    title: "Plastic waste dumped on pedestrian roadside",
    type: "Plastic Waste",
    location: "Mall Road, Kanpur",
    date: "25 Sep 2026",
    status: "Pending",
    priority: "Medium",
    description: "A substantial volume of single-use plastic bottles, cups, and polythene dumped beside the pedestrian pavement.",
    imageBefore: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=900&q=80",
    imageAfter: null,
    officer: {
      name: "Sunil Tiwari",
      role: "Mall Road Sector Lead",
      phone: "+91 98391 55678",
      badge: "Recyclables Squad #04",
      zone: "Central Commercial Zone"
    },
    timeline: [
      { title: "Complaint Registered", time: "25 Sep, 02:20 PM", done: true, desc: "Report filed by resident via web portal." },
      { title: "Under Route Scheduling", time: "25 Sep, 03:00 PM", done: true, desc: "Queue assigned for dry waste recovery vehicle." },
      { title: "Vehicle Dispatch Scheduled", time: "Next Slot: Morning", done: false, desc: "Crew scheduled for morning dry sweep." },
      { title: "Recycling Facility Routing", time: "Pending", done: false, desc: "Materials will be baled for mechanical shredding." }
    ]
  },
  WM1018: {
    id: "WM1018",
    title: "Unauthorized open dumping in vacant plot",
    type: "Illegal Dumping",
    location: "Swaroop Nagar, Kanpur",
    date: "22 Sep 2026",
    status: "Resolved",
    priority: "High",
    description: "Vacant plot was being used as unauthorized dumping ground. Sanitized, leveled and sealed with municipal warning signs.",
    imageBefore: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
    imageAfter: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    officer: {
      name: "Rameshwar Dayal",
      role: "Chief Sanitary Inspector",
      phone: "+91 98392 99881",
      badge: "Flying Squad #01",
      zone: "West Urban Zone"
    },
    timeline: [
      { title: "Report Submitted", time: "22 Sep, 08:15 AM", done: true, desc: "Neighboring society filed complaint with photos." },
      { title: "Notice Served & Inspected", time: "22 Sep, 10:00 AM", done: true, desc: "Plot owner issued notice and immediate cleanup order." },
      { title: "Bulldozer & Truck Clearance", time: "22 Sep, 01:00 PM", done: true, desc: "Cleared 2.4 tons of debris and organic refuse." },
      { title: "Disinfected & Barricaded", time: "22 Sep, 04:30 PM", done: true, desc: "Area sprayed with eco-disinfectant. Signboard erected." }
    ]
  }
};

function ComplaintDetails() {
  const { id } = useParams();
  const cleanId = (id || "WM1024").replace("#", "");

  const [complaint, setComplaint] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    // Check built-in complaints
    let found = initialComplaintDetails[cleanId];

    // If not found, look inside localStorage
    if (!found) {
      try {
        const stored = JSON.parse(localStorage.getItem("eco_complaints") || "[]");
        const match = stored.find(c => c.id.replace("#", "") === cleanId);
        if (match) {
          found = {
            ...match,
            imageBefore: match.image || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
            imageAfter: null,
            officer: {
              name: "Pooja Trivedi",
              role: "Municipal Ward Officer",
              phone: "+91 98390 00112",
              badge: "Rapid Response Unit #03",
              zone: "Kanpur Ward 14"
            },
            timeline: [
              { title: "Complaint Registered", time: match.date || "Today", done: true, desc: "Registered by citizen via EcoCare mobile portal." },
              { title: "Automated Inspection", time: "In Queue", done: true, desc: "Assigned to the nearest sector crew." },
              { title: "On-Site Clearance", time: "Pending", done: match.status === "In Progress" || match.status === "Resolved", desc: "Eco-truck dispatched." },
              { title: "Complete & Recycled", time: "Estimated 24h", done: match.status === "Resolved", desc: "Scientific segregation and waste diversion." }
            ]
          };
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Fallback to first complaint if still not found
    setComplaint(found || initialComplaintDetails["WM1024"]);
  }, [cleanId]);

  if (!complaint) return null;

  return (
    <div className="complaint-details-page">
      <div className="details-container">
        {/* Breadcrumb Bar */}
        <div className="details-breadcrumb-bar">
          <Link to="/complaints" className="btn-back-link">
            <ArrowLeft size={16} />
            <span>Back to All Reports</span>
          </Link>
          <span className="breadcrumb-id">Complaint File #{complaint.id}</span>
        </div>

        {/* Header Hero Banner */}
        <div className="details-header-card">
          <div className="header-badge-row">
            <span className="file-id-badge">#{complaint.id}</span>
            <span className={`status-pill status-${complaint.status.toLowerCase().replace(/\s+/g, "-")}`}>
              {complaint.status === "Resolved" && <CheckCircle2 size={14} />}
              {complaint.status === "In Progress" && <Clock3 size={14} />}
              {complaint.status === "Pending" && <AlertTriangle size={14} />}
              <span>{complaint.status}</span>
            </span>
            <span className="priority-pill">Priority: {complaint.priority}</span>
          </div>

          <h1>{complaint.title}</h1>

          <div className="details-meta-row">
            <div className="meta-block">
              <MapPin size={16} className="text-emerald" />
              <span>{complaint.location}</span>
            </div>
            <div className="meta-block">
              <CalendarDays size={16} className="text-emerald" />
              <span>Reported on {complaint.date}</span>
            </div>
            <div className="meta-block">
              <Leaf size={16} className="text-emerald" />
              <span>Category: {complaint.type}</span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="details-layout-grid">
          {/* Main Column */}
          <div className="details-main-content">
            {/* Description Card */}
            <div className="details-card-box">
              <h3>Issue Description</h3>
              <p className="description-text">{complaint.description}</p>
            </div>

            {/* Before & After Photo Visualizer */}
            <div className="details-card-box">
              <div className="card-box-header">
                <h3>Visual Photographic Evidence</h3>
                <span className="badge-geo">GPS Geotagged</span>
              </div>

              <div className="evidence-photos-grid">
                <div className="photo-panel">
                  <div className="photo-tag tag-before">Initial Citizen Photo</div>
                  <img
                    src={complaint.imageBefore}
                    alt="Before waste cleanup"
                    className="evidence-img"
                  />
                </div>

                <div className="photo-panel">
                  <div className="photo-tag tag-after">
                    {complaint.imageAfter ? "Resolved Condition" : "Cleanup Scheduled"}
                  </div>
                  {complaint.imageAfter ? (
                    <img
                      src={complaint.imageAfter}
                      alt="After waste cleanup"
                      className="evidence-img"
                    />
                  ) : (
                    <div className="awaiting-photo-placeholder">
                      <Truck size={36} />
                      <p>After photo will be uploaded automatically once the crew marks the spot clean.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resolution Progress Timeline */}
            <div className="details-card-box">
              <div className="card-box-header">
                <h3>Live Resolution Timeline</h3>
                <span className="badge-live">
                  <Clock3 size={13} /> Updated Real-time
                </span>
              </div>

              <div className="timeline-flow">
                {complaint.timeline && complaint.timeline.map((item, idx) => (
                  <div key={idx} className={`timeline-entry ${item.done ? "completed" : "pending"}`}>
                    <div className="timeline-node">
                      {item.done ? <CheckCircle2 size={16} /> : <div className="pending-dot"></div>}
                    </div>
                    <div className="timeline-entry-content">
                      <div className="entry-header">
                        <h4>{item.title}</h4>
                        <span className="entry-time">{item.time}</span>
                      </div>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Citizen Feedback Rating */}
            <div className="details-card-box rating-box">
              <h3>Citizen Service Rating</h3>
              <p>Are you satisfied with the speed and cleanliness of this resolution?</p>

              {!feedbackSent ? (
                <div className="star-rating-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-btn ${rating >= star ? "filled" : ""}`}
                      onClick={() => setRating(star)}
                    >
                      <Star size={24} />
                    </button>
                  ))}
                  {rating > 0 && (
                    <button
                      type="button"
                      className="btn-submit-rating"
                      onClick={() => setFeedbackSent(true)}
                    >
                      Submit Feedback
                    </button>
                  )}
                </div>
              ) : (
                <div className="rating-thankyou">
                  <CheckCircle2 size={18} />
                  <span>Thank you! Your feedback helps us improve municipal sanitation standards.</span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="details-sidebar-content">
            {/* Sanitation Officer Card */}
            <div className="sidebar-card officer-card">
              <div className="officer-header">
                <div className="officer-avatar">
                  <User size={24} />
                </div>
                <div>
                  <span className="officer-label">Assigned Sanitation Officer</span>
                  <h4>{complaint.officer?.name || "Municipal Officer"}</h4>
                  <small>{complaint.officer?.role || "Sanitation Supervisor"}</small>
                </div>
              </div>

              <div className="officer-details-list">
                <div className="officer-item">
                  <ShieldCheck size={16} />
                  <span>{complaint.officer?.badge || "Fleet Unit #1"}</span>
                </div>
                <div className="officer-item">
                  <MapPin size={16} />
                  <span>{complaint.officer?.zone || "Central City Ward"}</span>
                </div>
                <div className="officer-item">
                  <Phone size={16} />
                  <a href={`tel:${complaint.officer?.phone}`}>{complaint.officer?.phone || "1800-ECO-CLEAN"}</a>
                </div>
              </div>
            </div>

            {/* Ecological Impact Card */}
            <div className="sidebar-card eco-impact-card">
              <div className="eco-card-header">
                <Leaf size={20} className="text-emerald" />
                <h4>Environmental Impact Diverted</h4>
              </div>
              <p>
                By reporting this issue, you helped divert hazardous & organic waste
                from contaminating groundwater and open air burning.
              </p>
              <div className="impact-stats-list">
                <div className="impact-stat-item">
                  <strong>~35 kg</strong>
                  <span>Organic Waste Composted</span>
                </div>
                <div className="impact-stat-item">
                  <strong>~14 kg</strong>
                  <span>Plastics Recovered</span>
                </div>
                <div className="impact-stat-item">
                  <strong>+30 pts</strong>
                  <span>EcoPoints Awarded</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="sidebar-card quick-actions-card">
              <h4>Citizen Actions</h4>
              <Link to="/report-issue" className="btn-sidebar-action primary">
                Report Another Waste Issue
              </Link>
              <Link to="/pickup-request" className="btn-sidebar-action secondary">
                Schedule Doorstep Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;