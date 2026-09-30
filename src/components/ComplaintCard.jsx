import { Link } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  ArrowRight,
  AlertCircle,
  Clock3,
  CheckCircle2,
  Leaf
} from "lucide-react";

function ComplaintCard({ complaint }) {
  if (!complaint) return null;

  const {
    id,
    title,
    type,
    location,
    date,
    status = "Pending",
    priority = "Medium",
    image,
    description
  } = complaint;

  const getStatusBadge = () => {
    switch (status.toLowerCase()) {
      case "resolved":
        return {
          icon: <CheckCircle2 size={14} />,
          text: "Resolved",
          className: "status-badge-resolved"
        };
      case "in progress":
        return {
          icon: <Clock3 size={14} />,
          text: "In Progress",
          className: "status-badge-progress"
        };
      default:
        return {
          icon: <AlertCircle size={14} />,
          text: "Pending",
          className: "status-badge-pending"
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <div className="eco-complaint-card">
      <div className="card-top-header">
        <div className="card-id-badge">
          <span className="id-hash">#</span>
          <span>{id.replace("#", "")}</span>
        </div>
        <div className="badges-group">
          <span className={`priority-pill priority-${priority.toLowerCase()}`}>
            <span className="priority-dot"></span>
            {priority}
          </span>
          <span className={`status-pill ${statusInfo.className}`}>
            {statusInfo.icon}
            {statusInfo.text}
          </span>
        </div>
      </div>

      {image && (
        <div className="complaint-card-image-wrap">
          <img src={image} alt={title} loading="lazy" />
          <span className="image-type-overlay">{type}</span>
        </div>
      )}

      <div className="complaint-card-body">
        <div className="complaint-type-tag">
          <Leaf size={13} />
          <span>{type}</span>
        </div>

        <h3 className="complaint-card-title">{title}</h3>

        {description && (
          <p className="complaint-card-desc">
            {description.length > 90
              ? `${description.substring(0, 90)}...`
              : description}
          </p>
        )}

        <div className="complaint-meta-list">
          <div className="meta-item">
            <MapPin size={14} className="meta-icon" />
            <span title={location}>{location}</span>
          </div>
          <div className="meta-item">
            <CalendarDays size={14} className="meta-icon" />
            <span>{date}</span>
          </div>
        </div>
      </div>

      <div className="complaint-card-footer">
        <Link
          to={`/complaints/${id.replace("#", "")}`}
          className="view-details-link"
        >
          <span>View Progress Details</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default ComplaintCard;
