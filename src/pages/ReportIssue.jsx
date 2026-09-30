import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  MapPin,
  Upload,
  X,
  Send,
  CheckCircle2,
  Leaf,
  Trash2,
  Navigation,
  FileText,
  Sparkles,
} from "lucide-react";

const API_BASE_URL =
  "https://ecocare-backend-zhgx.onrender.com";

const issueCategories = [
  {
    id: "Uncollected Waste",
    label: "Overflowing Dustbin",
    icon: Trash2,
    desc: "Public bin overflowing onto pavement",
  },
  {
    id: "Illegal Dumping",
    label: "Illegal Open Dumping",
    icon: AlertTriangle,
    desc: "Unauthorized garbage dumped in vacant plot",
  },
  {
    id: "Plastic Waste",
    label: "Plastic Waste",
    icon: Leaf,
    desc: "Single-use plastic, bottles or wrappers",
  },
  {
    id: "Organic Waste",
    label: "Rotting Organic Waste",
    icon: Leaf,
    desc: "Kitchen/market vegetable waste causing foul smell",
  },
  {
    id: "Hazardous Waste",
    label: "Hazardous / Medical",
    icon: AlertTriangle,
    desc: "Chemicals, needles, paint cans, or batteries",
  },
  {
    id: "Construction Waste",
    label: "Debris & Construction",
    icon: Trash2,
    desc: "Concrete, brick rubble blocking pedestrian access",
  },
];

function ReportIssue() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    issueType: "Uncollected Waste",
    title: "",
    description: "",
    address: "",
    landmark: "",
    priority: "Medium",
  });

  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
      setImageName(file.name);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageName("");
  };

  const handleDetectLocation = () => {
    setDetectingLocation(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);

          setFormData((prev) => ({
            ...prev,
            address: `Near Sector 4, Lat: ${lat}, Lng: ${lng}, City Central Ward`,
            landmark: "Auto-detected via Device GPS",
          }));

          setDetectingLocation(false);
          setLocationSuccess(true);

          setTimeout(() => {
            setLocationSuccess(false);
          }, 3000);
        },
        () => {
          setFormData((prev) => ({
            ...prev,
            address: "Civil Lines, Near Green Park, Kanpur",
            landmark: "Opposite Nagar Nigam Community Center",
          }));

          setDetectingLocation(false);
          setLocationSuccess(true);

          setTimeout(() => {
            setLocationSuccess(false);
          }, 3000);
        }
      );
    } else {
      setFormData((prev) => ({
        ...prev,
        address: "Civil Lines, Kanpur Central",
        landmark: "Main Road",
      }));

      setDetectingLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    try {
      setSubmitting(true);

      /*
       * Get logged-in user token.
       * Your login response stores the token in localStorage.
       */
      const token =
        localStorage.getItem("ecocare_token") ||
        localStorage.getItem("token");

      if (!token) {
        alert("Your login session has expired. Please login again.");
        navigate("/login");
        return;
      }

      const complaintData = {
        title: formData.title || formData.issueType,
        description: formData.description,
        location: formData.address || "Kanpur Central Ward",

        /*
         * Backend Complaint model uses these categories:
         *
         * Garbage Collection
         * Waste Dumping
         * Dirty Area
         * Blocked Drain
         * Other
         *
         * So frontend categories are mapped to backend categories.
         */
        category:
          formData.issueType === "Uncollected Waste"
            ? "Garbage Collection"
            : formData.issueType === "Illegal Dumping"
            ? "Waste Dumping"
            : formData.issueType === "Plastic Waste"
            ? "Other"
            : formData.issueType === "Organic Waste"
            ? "Dirty Area"
            : formData.issueType === "Hazardous Waste"
            ? "Other"
            : formData.issueType === "Construction Waste"
            ? "Other"
            : "Other",
      };

      console.log("=================================");
      console.log("SUBMITTING COMPLAINT");
      console.log("Complaint Data:", complaintData);
      console.log("Token exists:", !!token);
      console.log("=================================");

      const response = await fetch(
        `${API_BASE_URL}/api/complaints`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(complaintData),
        }
      );

      const data = await response.json();

      console.log("=================================");
      console.log("COMPLAINT API RESPONSE");
      console.log(data);
      console.log("=================================");

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to submit complaint"
        );
      }

      /*
       * Backend successfully created the complaint.
       * Use backend MongoDB _id as tracking ID.
       */
      const complaintId =
        data.complaint?._id ||
        data.data?._id ||
        data._id;

      const newReport = {
        id: complaintId || `WM${Date.now()}`,
        title: complaintData.title,
        type: complaintData.category,
        location: complaintData.location,
        date: "Just now",
        status: "Pending",
        priority: formData.priority,
        description: complaintData.description,
        image:
          image ||
          "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
      };

      setSubmittedReport(newReport);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      /*
       * Reset form after successful submission.
       */
      setFormData({
        issueType: "Uncollected Waste",
        title: "",
        description: "",
        address: "",
        landmark: "",
        priority: "Medium",
      });

      setImage(null);
      setImageName("");
    } catch (error) {
      console.error("=================================");
      console.error("COMPLAINT SUBMISSION ERROR");
      console.error(error);
      console.error("=================================");

      alert(
        error.message ||
          "Something went wrong while submitting your complaint."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report-issue-page">
      <div className="report-container">

        {/* Navigation Breadcrumb */}
        <div className="report-nav-bar">
          <Link
            to="/dashboard"
            className="btn-back-link"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>

          <span className="breadcrumb-pill">
            Citizens Service • Issue Reporting
          </span>
        </div>

        {/* Page Header */}
        <div className="report-header-banner">
          <div className="header-badge-wrap">
            <div className="header-icon-box">
              <Camera size={26} />
            </div>

            <div>
              <span className="header-eyebrow">
                COMMUNITY CLEANLINESS INITIATIVE
              </span>

              <h1>Report a Waste Issue</h1>

              <p>
                Help municipal sanitation crews maintain
                clean, litter-free streets. Take a photo,
                verify your location, and track resolution
                in real time.
              </p>
            </div>
          </div>
        </div>

        {/* SUCCESS CARD */}
        {submittedReport && (
          <div className="report-success-card">
            <div className="success-icon-wrap">
              <CheckCircle2 size={36} />
            </div>

            <div className="success-content">
              <div className="success-tag">
                Report Successfully Registered!
              </div>

              <h2>
                Complaint Tracking ID: #
                {submittedReport.id}
              </h2>

              <p>
                Your report has been dispatched to the
                Ward Sanitation Officer. An eco-collection
                vehicle is scheduled for verification
                within{" "}
                <strong>
                  {submittedReport.priority === "Critical"
                    ? "4 hours"
                    : "24 hours"}
                </strong>
                .
              </p>

              <div className="success-actions">
                <Link
                  to={`/complaints/${submittedReport.id}`}
                  className="btn-view-tracker"
                >
                  <FileText size={16} />
                  Track Report #{submittedReport.id}
                </Link>

                <button
                  type="button"
                  onClick={() => setSubmittedReport(null)}
                  className="btn-new-report"
                >
                  Report Another Issue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN REPORTING FORM */}
        {!submittedReport && (
          <form
            className="report-form-layout"
            onSubmit={handleSubmit}
          >
            <div className="form-main-col">

              {/* CATEGORY */}
              <div className="form-card-block">
                <div className="block-header">
                  <span className="step-num">
                    Step 1
                  </span>

                  <h3>
                    Select Waste Category
                  </h3>

                  <p>
                    Choose the category that best
                    describes the waste problem.
                  </p>
                </div>

                <div className="category-selection-grid">
                  {issueCategories.map((cat) => {
                    const IconComp = cat.icon;

                    const isSelected =
                      formData.issueType === cat.id;

                    return (
                      <button
                        type="button"
                        key={cat.id}
                        className={`category-tile ${
                          isSelected
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            issueType: cat.id,
                          })
                        }
                      >
                        <div className="tile-icon-box">
                          <IconComp size={20} />
                        </div>

                        <div className="tile-text">
                          <strong>
                            {cat.label}
                          </strong>

                          <small>
                            {cat.desc}
                          </small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PHOTO */}
              <div className="form-card-block">
                <div className="block-header">
                  <span className="step-num">
                    Step 2
                  </span>

                  <h3>
                    Upload Photo Evidence
                  </h3>

                  <p>
                    A clear photograph helps the
                    sanitation team gauge the required
                    equipment.
                  </p>
                </div>

                {!image ? (
                  <label className="upload-dropzone">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden-file-input"
                    />

                    <div className="dropzone-inner">
                      <div className="upload-icon-circle">
                        <Upload size={28} />
                      </div>

                      <h4>
                        Drag and drop photo here, or
                        click to browse
                      </h4>

                      <p>
                        Supports JPG, PNG, WEBP up to
                        10MB
                      </p>

                      <span className="btn-choose-file">
                        Select Image
                      </span>
                    </div>
                  </label>
                ) : (
                  <div className="image-preview-card">
                    <img
                      src={image}
                      alt="Uploaded waste evidence"
                    />

                    <div className="image-preview-overlay">
                      <span className="preview-filename">
                        {imageName ||
                          "Evidence Photo"}
                      </span>

                      <button
                        type="button"
                        className="btn-remove-photo"
                        onClick={removeImage}
                        title="Remove photo"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* LOCATION & DESCRIPTION */}
              <div className="form-card-block">
                <div className="block-header">
                  <span className="step-num">
                    Step 3
                  </span>

                  <h3>
                    Location & Issue Description
                  </h3>

                  <p>
                    Specify the exact spot so our green
                    team can locate it quickly.
                  </p>
                </div>

                {/* TITLE */}
                <div className="input-group-row">
                  <div className="form-field-wrap">
                    <label>
                      Short Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      placeholder="e.g. Overflowing garbage bin outside community park"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="input-group-row">
                  <div className="form-field-wrap">
                    <div className="label-with-action">
                      <label>
                        Incident Street Address
                      </label>

                      <button
                        type="button"
                        className="btn-gps-detect"
                        onClick={
                          handleDetectLocation
                        }
                        disabled={
                          detectingLocation
                        }
                      >
                        <Navigation
                          size={14}
                          className={
                            detectingLocation
                              ? "spin"
                              : ""
                          }
                        />

                        <span>
                          {detectingLocation
                            ? "Detecting GPS..."
                            : "📍 Detect My Location"}
                        </span>
                      </button>
                    </div>

                    <div className="input-with-icon">
                      <MapPin
                        size={18}
                        className="field-icon"
                      />

                      <input
                        type="text"
                        name="address"
                        placeholder="e.g. Civil Lines, Near Green Park, Kanpur"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {locationSuccess && (
                      <span className="location-success-text">
                        <CheckCircle2 size={13} />
                        GPS Coordinates captured
                        successfully!
                      </span>
                    )}
                  </div>
                </div>

                {/* LANDMARK */}
                <div className="input-group-row">
                  <div className="form-field-wrap">
                    <label>
                      Nearby Landmark (Optional)
                    </label>

                    <input
                      type="text"
                      name="landmark"
                      placeholder="e.g. Opposite State Bank ATM, Beside Tea Stall"
                      value={formData.landmark}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="input-group-row">
                  <div className="form-field-wrap">
                    <label>
                      Detailed Description
                    </label>

                    <textarea
                      name="description"
                      rows={4}
                      placeholder="Provide additional details: approximate volume of waste, is it blocking drainage, foul smell, how many days uncollected, etc."
                      value={
                        formData.description
                      }
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="form-sidebar-col">
              <div className="sidebar-sticky-box">

                {/* PRIORITY */}
                <div className="sidebar-section-card">
                  <h4>
                    Severity / Urgency
                  </h4>

                  <p className="sidebar-help-text">
                    Emergency dumps blocking roads
                    or medical hazards receive
                    priority dispatch.
                  </p>

                  <div className="priority-options-list">
                    {[
                      {
                        val: "Low",
                        label: "Standard (48h)",
                        color: "low",
                      },
                      {
                        val: "Medium",
                        label: "Priority (24h)",
                        color: "medium",
                      },
                      {
                        val: "Critical",
                        label: "Emergency (4-6h)",
                        color: "high",
                      },
                    ].map((p) => (
                      <label
                        key={p.val}
                        className={`priority-select-item ${
                          formData.priority ===
                          p.val
                            ? "active"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={p.val}
                          checked={
                            formData.priority ===
                            p.val
                          }
                          onChange={
                            handleChange
                          }
                        />

                        <span
                          className={`priority-color-indicator ${p.color}`}
                        ></span>

                        <div>
                          <strong>
                            {p.val}
                          </strong>

                          <small>
                            {p.label}
                          </small>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ECO IMPACT */}
                <div className="sidebar-section-card eco-guarantee-card">
                  <div className="card-badge-row">
                    <Leaf size={16} />
                    <span>
                      Zero Waste Commitment
                    </span>
                  </div>

                  <p>
                    All collected organic waste is
                    processed at our bio-composting
                    facility, diverting it from toxic
                    open landfills.
                  </p>

                  <div className="eco-points-preview">
                    <Sparkles size={16} />

                    <span>
                      You'll earn{" "}
                      <strong>
                        +30 EcoPoints
                      </strong>{" "}
                      for reporting!
                    </span>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="btn-submit-report"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>
                        Submit Waste Report
                      </span>
                    </>
                  )}
                </button>

                <p className="submit-disclaimer">
                  By submitting, you confirm the
                  accuracy of the location to assist
                  municipal sanitation.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReportIssue;