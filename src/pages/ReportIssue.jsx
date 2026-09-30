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
  Clock,
  Sparkles,
  Info,
  Navigation,
  FileText
} from "lucide-react";

const issueCategories = [
  { id: "Uncollected Waste", label: "Overflowing Dustbin", icon: Trash2, desc: "Public bin overflowing onto pavement" },
  { id: "Illegal Dumping", label: "Illegal Open Dumping", icon: AlertTriangle, desc: "Unauthorized garbage dumped in vacant plot" },
  { id: "Plastic Waste", label: "Plastic Waste", icon: Leaf, desc: "Single-use plastic, bottles or wrappers" },
  { id: "Organic Waste", label: "Rotting Organic Waste", icon: Leaf, desc: "Kitchen/market vegetable waste causing foul smell" },
  { id: "Hazardous Waste", label: "Hazardous / Medical", icon: AlertTriangle, desc: "Chemicals, needles, paint cans, or batteries" },
  { id: "Construction Waste", label: "Debris & Construction", icon: Trash2, desc: "Concrete, brick rubble blocking pedestrian access" },
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
          setFormData(prev => ({
            ...prev,
            address: `Near Sector 4, Lat: ${lat}, Lng: ${lng}, City Central Ward`,
            landmark: "Auto-detected via Device GPS"
          }));
          setDetectingLocation(false);
          setLocationSuccess(true);
          setTimeout(() => setLocationSuccess(false), 3000);
        },
        (error) => {
          // Graceful fallback for demo
          setFormData(prev => ({
            ...prev,
            address: "Civil Lines, Near Green Park, Kanpur",
            landmark: "Opposite Nagar Nigam Community Center"
          }));
          setDetectingLocation(false);
          setLocationSuccess(true);
          setTimeout(() => setLocationSuccess(false), 3000);
        }
      );
    } else {
      setFormData(prev => ({
        ...prev,
        address: "Civil Lines, Kanpur Central",
        landmark: "Main Road"
      }));
      setDetectingLocation(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newId = `WM${Math.floor(1000 + Math.random() * 9000)}`;
    const newReport = {
      id: newId,
      title: formData.title || formData.issueType,
      type: formData.issueType,
      location: formData.address || "Kanpur Central Ward",
      date: "Just now",
      status: "Pending",
      priority: formData.priority,
      description: formData.description,
      image: image || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
    };

    // Store in localStorage if available
    try {
      const existing = JSON.parse(localStorage.getItem("eco_complaints") || "[]");
      localStorage.setItem("eco_complaints", JSON.stringify([newReport, ...existing]));
    } catch (err) {
      console.error(err);
    }

    setSubmittedReport(newReport);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="report-issue-page">
      <div className="report-container">
        {/* Navigation Breadcrumb */}
        <div className="report-nav-bar">
          <Link to="/dashboard" className="btn-back-link">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <span className="breadcrumb-pill">Citizens Service • Issue Reporting</span>
        </div>

        {/* Page Header */}
        <div className="report-header-banner">
          <div className="header-badge-wrap">
            <div className="header-icon-box">
              <Camera size={26} />
            </div>
            <div>
              <span className="header-eyebrow">COMMUNITY CLEANLINESS INITIATIVE</span>
              <h1>Report a Waste Issue</h1>
              <p>
                Help municipal sanitation crews maintain clean, litter-free streets.
                Take a photo, verify your location, and track resolution in real time.
              </p>
            </div>
          </div>
        </div>

        {/* SUCCESS MODAL / BANNER */}
        {submittedReport && (
          <div className="report-success-card">
            <div className="success-icon-wrap">
              <CheckCircle2 size={36} />
            </div>
            <div className="success-content">
              <div className="success-tag">Report Successfully Registered!</div>
              <h2>Complaint Tracking ID: #{submittedReport.id}</h2>
              <p>
                Your report has been dispatched to the Ward Sanitation Officer.
                An eco-collection vehicle is scheduled for verification within{" "}
                <strong>{submittedReport.priority === "Critical" ? "4 hours" : "24 hours"}</strong>.
              </p>
              <div className="success-actions">
                <Link to={`/complaints/${submittedReport.id}`} className="btn-view-tracker">
                  <FileText size={16} /> Track Report #{submittedReport.id}
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
          <form className="report-form-layout" onSubmit={handleSubmit}>
            <div className="form-main-col">
              {/* Category Picker */}
              <div className="form-card-block">
                <div className="block-header">
                  <span className="step-num">Step 1</span>
                  <h3>Select Waste Category</h3>
                  <p>Choose the category that best describes the waste problem.</p>
                </div>

                <div className="category-selection-grid">
                  {issueCategories.map((cat) => {
                    const IconComp = cat.icon;
                    const isSelected = formData.issueType === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        className={`category-tile ${isSelected ? "selected" : ""}`}
                        onClick={() => setFormData({ ...formData, issueType: cat.id })}
                      >
                        <div className="tile-icon-box">
                          <IconComp size={20} />
                        </div>
                        <div className="tile-text">
                          <strong>{cat.label}</strong>
                          <small>{cat.desc}</small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Photo Upload Box */}
              <div className="form-card-block">
                <div className="block-header">
                  <span className="step-num">Step 2</span>
                  <h3>Upload Photo Evidence</h3>
                  <p>A clear photograph helps the sanitation team gauge the required equipment.</p>
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
                      <h4>Drag and drop photo here, or click to browse</h4>
                      <p>Supports JPG, PNG, WEBP up to 10MB</p>
                      <span className="btn-choose-file">Select Image</span>
                    </div>
                  </label>
                ) : (
                  <div className="image-preview-card">
                    <img src={image} alt="Uploaded waste evidence" />
                    <div className="image-preview-overlay">
                      <span className="preview-filename">{imageName || "Evidence Photo"}</span>
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

              {/* Location & Details */}
              <div className="form-card-block">
                <div className="block-header">
                  <span className="step-num">Step 3</span>
                  <h3>Location & Issue Description</h3>
                  <p>Specify the exact spot so our green team can locate it quickly.</p>
                </div>

                <div className="input-group-row">
                  <div className="form-field-wrap">
                    <label>Short Title</label>
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

                <div className="input-group-row">
                  <div className="form-field-wrap">
                    <div className="label-with-action">
                      <label>Incident Street Address</label>
                      <button
                        type="button"
                        className="btn-gps-detect"
                        onClick={handleDetectLocation}
                        disabled={detectingLocation}
                      >
                        <Navigation size={14} className={detectingLocation ? "spin" : ""} />
                        <span>{detectingLocation ? "Detecting GPS..." : "📍 Detect My Location"}</span>
                      </button>
                    </div>
                    <div className="input-with-icon">
                      <MapPin size={18} className="field-icon" />
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
                        <CheckCircle2 size={13} /> GPS Coordinates captured successfully!
                      </span>
                    )}
                  </div>
                </div>

                <div className="input-group-row">
                  <div className="form-field-wrap">
                    <label>Nearby Landmark (Optional)</label>
                    <input
                      type="text"
                      name="landmark"
                      placeholder="e.g. Opposite State Bank ATM, Beside Tea Stall"
                      value={formData.landmark}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="input-group-row">
                  <div className="form-field-wrap">
                    <label>Detailed Description</label>
                    <textarea
                      name="description"
                      rows={4}
                      placeholder="Provide additional details: approximate volume of waste, is it blocking drainage, foul smell, how many days uncollected, etc."
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar / Submission Summary */}
            <div className="form-sidebar-col">
              <div className="sidebar-sticky-box">
                {/* Priority Selector */}
                <div className="sidebar-section-card">
                  <h4>Severity / Urgency</h4>
                  <p className="sidebar-help-text">
                    Emergency dumps blocking roads or medical hazards receive priority dispatch.
                  </p>

                  <div className="priority-options-list">
                    {[
                      { val: "Low", label: "Standard (48h)", color: "low" },
                      { val: "Medium", label: "Priority (24h)", color: "medium" },
                      { val: "Critical", label: "Emergency (4-6h)", color: "high" }
                    ].map((p) => (
                      <label
                        key={p.val}
                        className={`priority-select-item ${formData.priority === p.val ? "active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={p.val}
                          checked={formData.priority === p.val}
                          onChange={handleChange}
                        />
                        <span className={`priority-color-indicator ${p.color}`}></span>
                        <div>
                          <strong>{p.val}</strong>
                          <small>{p.label}</small>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Eco Impact Information */}
                <div className="sidebar-section-card eco-guarantee-card">
                  <div className="card-badge-row">
                    <Leaf size={16} />
                    <span>Zero Waste Commitment</span>
                  </div>
                  <p>
                    All collected organic waste is processed at our bio-composting facility,
                    diverting it from toxic open landfills.
                  </p>
                  <div className="eco-points-preview">
                    <Sparkles size={16} />
                    <span>You'll earn <strong>+30 EcoPoints</strong> for reporting!</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn-submit-report">
                  <Send size={18} />
                  <span>Submit Waste Report</span>
                </button>

                <p className="submit-disclaimer">
                  By submitting, you confirm the accuracy of the location to assist municipal sanitation.
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