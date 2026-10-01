
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
  LocateFixed,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ==========================================
// FIX LEAFLET DEFAULT MARKER ICON
// ==========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const API_BASE_URL =
  "https://ecocare-backend-zhgx.onrender.com";

// ==========================================
// ISSUE CATEGORIES
// ==========================================

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

// ==========================================
// MAP CLICK COMPONENT
// ==========================================

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

      onLocationSelect(lat, lng);
    },
  });

  return null;
}

// ==========================================
// REPORT ISSUE
// ==========================================

function ReportIssue() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    issueType: "Uncollected Waste",
    title: "",
    description: "",
    address: "",
    landmark: "",
    priority: "Medium",

    // REAL LOCATION DATA
    latitude: null,
    longitude: null,
  });

  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");

  const [detectingLocation, setDetectingLocation] =
    useState(false);

  const [locationSuccess, setLocationSuccess] =
    useState(false);

  const [locationError, setLocationError] =
    useState("");

  const [submittedReport, setSubmittedReport] =
    useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // IMAGE
  // ==========================================

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

  // ==========================================
  // REVERSE GEOCODING
  // LAT/LNG → REAL ADDRESS
  // ==========================================

  const getAddressFromCoordinates = async (
    latitude,
    longitude
  ) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to find address for this location."
        );
      }

      const data = await response.json();

      return (
        data.display_name ||
        `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      );
    } catch (error) {
      console.error(
        "Reverse Geocoding Error:",
        error
      );

      return `${latitude.toFixed(
        6
      )}, ${longitude.toFixed(6)}`;
    }
  };

  // ==========================================
  // SELECT LOCATION FROM MAP
  // ==========================================

  const handleLocationSelect = async (
    latitude,
    longitude
  ) => {
    try {
      setDetectingLocation(true);
      setLocationError("");

      const address =
        await getAddressFromCoordinates(
          latitude,
          longitude
        );

      setFormData((prev) => ({
        ...prev,

        address,

        latitude,
        longitude,
      }));

      setLocationSuccess(true);

      setTimeout(() => {
        setLocationSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(error);

      setLocationError(
        "Unable to identify this location."
      );
    } finally {
      setDetectingLocation(false);
    }
  };

  // ==========================================
  // DETECT CURRENT GPS LOCATION
  // ==========================================

  const handleDetectLocation = () => {
    setLocationError("");

    if (!("geolocation" in navigator)) {
      setLocationError(
        "Your browser does not support location detection."
      );

      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        console.log(
          "REAL GPS LOCATION:",
          latitude,
          longitude
        );

        await handleLocationSelect(
          latitude,
          longitude
        );

        setDetectingLocation(false);
      },

      (error) => {
        console.error(
          "GPS Location Error:",
          error
        );

        setDetectingLocation(false);

        if (error.code === 1) {
          setLocationError(
            "Location permission was denied. Please allow location access in your browser."
          );
        } else if (error.code === 2) {
          setLocationError(
            "Your current location could not be determined."
          );
        } else if (error.code === 3) {
          setLocationError(
            "Location request timed out. Please try again."
          );
        } else {
          setLocationError(
            "Unable to detect your location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    // Require location
    if (
      !formData.latitude ||
      !formData.longitude
    ) {
      alert(
        "Please detect or select the waste location before submitting."
      );

      return;
    }

    try {
      setSubmitting(true);

      const token =
        localStorage.getItem(
          "ecocare_token"
        ) ||
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Your login session has expired. Please login again."
        );

        navigate("/login");

        return;
      }

      // ==========================================
      // FRONTEND COMPLAINT DATA
      // ==========================================

      const complaintData = {
        title:
          formData.title ||
          formData.issueType,

        description:
          formData.description,

        // Current backend still receives address
        location:
          formData.address,

        // NEW REAL LOCATION DATA
        latitude:
          formData.latitude,

        longitude:
          formData.longitude,

        landmark:
          formData.landmark,

        category:
          formData.issueType ===
          "Uncollected Waste"
            ? "Garbage Collection"
            : formData.issueType ===
              "Illegal Dumping"
            ? "Waste Dumping"
            : formData.issueType ===
              "Plastic Waste"
            ? "Other"
            : formData.issueType ===
              "Organic Waste"
            ? "Dirty Area"
            : formData.issueType ===
              "Hazardous Waste"
            ? "Other"
            : formData.issueType ===
              "Construction Waste"
            ? "Other"
            : "Other",
      };

      console.log(
        "================================="
      );

      console.log(
        "SUBMITTING COMPLAINT"
      );

      console.log(
        "Complaint Data:",
        complaintData
      );

      console.log(
        "REAL LATITUDE:",
        formData.latitude
      );

      console.log(
        "REAL LONGITUDE:",
        formData.longitude
      );

      console.log(
        "================================="
      );

      // ==========================================
      // API REQUEST
      // ==========================================

      const response = await fetch(
        `${API_BASE_URL}/api/complaints`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            complaintData
          ),
        }
      );

      const data =
        await response.json();

      console.log(
        "COMPLAINT API RESPONSE:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to submit complaint"
        );
      }

      // ==========================================
      // TRACKING ID
      // ==========================================

      const complaintId =
        data.complaint?._id ||
        data.data?._id ||
        data._id;

      const newReport = {
        id:
          complaintId ||
          `WM${Date.now()}`,

        title:
          complaintData.title,

        type:
          complaintData.category,

        location:
          complaintData.location,

        latitude:
          formData.latitude,

        longitude:
          formData.longitude,

        date: "Just now",

        status: "Pending",

        priority:
          formData.priority,

        description:
          complaintData.description,

        image:
          image ||
          "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
      };

      setSubmittedReport(
        newReport
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // ==========================================
      // RESET
      // ==========================================

      setFormData({
        issueType:
          "Uncollected Waste",

        title: "",

        description: "",

        address: "",

        landmark: "",

        priority: "Medium",

        latitude: null,

        longitude: null,
      });

      setImage(null);
      setImageName("");
    } catch (error) {
      console.error(
        "COMPLAINT SUBMISSION ERROR:",
        error
      );

      alert(
        error.message ||
          "Something went wrong while submitting your complaint."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // MAP CENTER
  // ==========================================

  const mapCenter =
    formData.latitude &&
    formData.longitude
      ? [
          formData.latitude,
          formData.longitude,
        ]
      : [26.4499, 80.3319]; // Kanpur default view

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="report-issue-page">
      <div className="report-container">

        {/* NAVIGATION */}

        <div className="report-nav-bar">
          <Link
            to="/dashboard"
            className="btn-back-link"
          >
            <ArrowLeft size={16} />

            <span>
              Back to Dashboard
            </span>
          </Link>

          <span className="breadcrumb-pill">
            Citizens Service • Issue Reporting
          </span>
        </div>

        {/* HEADER */}

        <div className="report-header-banner">
          <div className="header-badge-wrap">

            <div className="header-icon-box">
              <Camera size={26} />
            </div>

            <div>

              <span className="header-eyebrow">
                COMMUNITY CLEANLINESS
                INITIATIVE
              </span>

              <h1>
                Report a Waste Issue
              </h1>

              <p>
                Help municipal sanitation
                crews maintain clean,
                litter-free streets. Take
                a photo, verify your
                location, and track
                resolution in real time.
              </p>

            </div>
          </div>
        </div>

        {/* SUCCESS */}

        {submittedReport && (
          <div className="report-success-card">

            <div className="success-icon-wrap">
              <CheckCircle2 size={36} />
            </div>

            <div className="success-content">

              <div className="success-tag">
                Report Successfully
                Registered!
              </div>

              <h2>
                Complaint Tracking ID: #
                {submittedReport.id}
              </h2>

              <p>
                Your report has been
                dispatched to the Ward
                Sanitation Officer.
                An eco-collection vehicle
                is scheduled for verification
                within{" "}
                <strong>
                  {submittedReport.priority ===
                  "Critical"
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

                  Track Report #
                  {submittedReport.id}
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setSubmittedReport(
                      null
                    )
                  }
                  className="btn-new-report"
                >
                  Report Another Issue
                </button>

              </div>

            </div>
          </div>
        )}

        {/* FORM */}

        {!submittedReport && (
          <form
            className="report-form-layout"
            onSubmit={handleSubmit}
          >

            <div className="form-main-col">

              {/* STEP 1 */}

              <div className="form-card-block">

                <div className="block-header">

                  <span className="step-num">
                    Step 1
                  </span>

                  <h3>
                    Select Waste Category
                  </h3>

                  <p>
                    Choose the category that
                    best describes the waste
                    problem.
                  </p>

                </div>

                <div className="category-selection-grid">

                  {issueCategories.map(
                    (cat) => {

                      const IconComp =
                        cat.icon;

                      const isSelected =
                        formData.issueType ===
                        cat.id;

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
                              issueType:
                                cat.id,
                            })
                          }
                        >

                          <div className="tile-icon-box">
                            <IconComp
                              size={20}
                            />
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
                    }
                  )}

                </div>
              </div>

              {/* STEP 2 PHOTO */}

              <div className="form-card-block">

                <div className="block-header">

                  <span className="step-num">
                    Step 2
                  </span>

                  <h3>
                    Upload Photo Evidence
                  </h3>

                  <p>
                    A clear photograph helps
                    the sanitation team gauge
                    the required equipment.
                  </p>

                </div>

                {!image ? (
                  <label className="upload-dropzone">

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleImageChange
                      }
                      className="hidden-file-input"
                    />

                    <div className="dropzone-inner">

                      <div className="upload-icon-circle">
                        <Upload size={28} />
                      </div>

                      <h4>
                        Drag and drop photo
                        here, or click to
                        browse
                      </h4>

                      <p>
                        Supports JPG, PNG,
                        WEBP up to 10MB
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
                        onClick={
                          removeImage
                        }
                      >
                        <X size={18} />
                      </button>

                    </div>

                  </div>
                )}

              </div>

              {/* STEP 3 LOCATION */}

              <div className="form-card-block">

                <div className="block-header">

                  <span className="step-num">
                    Step 3
                  </span>

                  <h3>
                    Location & Issue
                    Description
                  </h3>

                  <p>
                    Detect your real location
                    or select the exact point
                    directly on the map.
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
                      value={
                        formData.title
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>

                </div>

                {/* REAL LOCATION */}

                <div className="input-group-row">

                  <div className="form-field-wrap">

                    <div className="label-with-action">

                      <label>
                        Incident Location
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

                    {/* ADDRESS */}

                    <div className="input-with-icon">

                      <MapPin
                        size={18}
                        className="field-icon"
                      />

                      <input
                        type="text"
                        name="address"
                        placeholder="Detect your location or select a point on the map"
                        value={
                          formData.address
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    {/* LOCATION ERROR */}

                    {locationError && (
                      <div
                        style={{
                          marginTop:
                            "10px",
                          padding:
                            "10px 12px",
                          borderRadius:
                            "10px",
                          background:
                            "#fff1f2",
                          color:
                            "#be123c",
                          fontSize:
                            "13px",
                        }}
                      >
                        {locationError}
                      </div>
                    )}

                    {/* SUCCESS */}

                    {locationSuccess && (
                      <span className="location-success-text">

                        <CheckCircle2
                          size={13}
                        />

                        Real GPS location
                        captured
                        successfully!

                      </span>
                    )}

                  </div>

                </div>

                {/* ==================================
                    MAP
                ================================== */}

                <div
                  style={{
                    marginTop:
                      "18px",
                    borderRadius:
                      "16px",
                    overflow:
                      "hidden",
                    border:
                      "1px solid #d0d5dd",
                    height:
                      "360px",
                    position:
                      "relative",
                  }}
                >

                  <MapContainer
                    center={mapCenter}
                    zoom={
                      formData.latitude
                        ? 17
                        : 12
                    }
                    scrollWheelZoom={
                      true
                    }
                    style={{
                      height:
                        "100%",
                      width:
                        "100%",
                    }}
                  >

                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <LocationPicker
                      onLocationSelect={
                        handleLocationSelect
                      }
                    />

                    {formData.latitude &&
                      formData.longitude && (
                        <Marker
                          position={[
                            formData.latitude,
                            formData.longitude,
                          ]}
                        >

                          <Popup>

                            <strong>
                              EcoCare
                              Report
                              Location
                            </strong>

                            <br />

                            {formData.address ||
                              "Selected location"}

                          </Popup>

                        </Marker>
                      )}

                  </MapContainer>

                  {/* MAP INSTRUCTION */}

                  {!formData.latitude && (
                    <div
                      style={{
                        position:
                          "absolute",
                        top: "15px",
                        left: "50%",
                        transform:
                          "translateX(-50%)",
                        zIndex: 1000,
                        background:
                          "white",
                        padding:
                          "9px 14px",
                        borderRadius:
                          "10px",
                        boxShadow:
                          "0 3px 12px rgba(0,0,0,.15)",
                        fontSize:
                          "13px",
                        fontWeight:
                          "600",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      📍 Click on the map
                      to select location
                    </div>
                  )}

                </div>

                {/* COORDINATES */}

                {formData.latitude &&
                  formData.longitude && (
                    <div
                      style={{
                        marginTop:
                          "12px",
                        padding:
                          "12px 14px",
                        borderRadius:
                          "10px",
                        background:
                          "#f0fdf4",
                        border:
                          "1px solid #bbf7d0",
                        fontSize:
                          "13px",
                        color:
                          "#166534",
                      }}
                    >

                      <strong>
                        📍 Location
                        selected
                      </strong>

                      <div
                        style={{
                          marginTop:
                            "5px",
                        }}
                      >
                        Latitude:{" "}
                        {formData.latitude.toFixed(
                          6
                        )}
                      </div>

                      <div>
                        Longitude:{" "}
                        {formData.longitude.toFixed(
                          6
                        )}
                      </div>

                    </div>
                  )}

                {/* LANDMARK */}

                <div className="input-group-row">

                  <div className="form-field-wrap">

                    <label>
                      Nearby Landmark
                      (Optional)
                    </label>

                    <input
                      type="text"
                      name="landmark"
                      placeholder="e.g. Opposite State Bank ATM, Beside Tea Stall"
                      value={
                        formData.landmark
                      }
                      onChange={
                        handleChange
                      }
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
                      onChange={
                        handleChange
                      }
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
                    Severity /
                    Urgency
                  </h4>

                  <p className="sidebar-help-text">
                    Emergency dumps
                    blocking roads or
                    medical hazards
                    receive priority
                    dispatch.
                  </p>

                  <div className="priority-options-list">

                    {[
                      {
                        val: "Low",
                        label:
                          "Standard (48h)",
                        color: "low",
                      },
                      {
                        val: "Medium",
                        label:
                          "Priority (24h)",
                        color: "medium",
                      },
                      {
                        val: "Critical",
                        label:
                          "Emergency (4-6h)",
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
                      Zero Waste
                      Commitment
                    </span>

                  </div>

                  <p>
                    All collected
                    organic waste is
                    processed at our
                    bio-composting
                    facility,
                    diverting it from
                    toxic open
                    landfills.
                  </p>

                  <div className="eco-points-preview">

                    <Sparkles
                      size={16}
                    />

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
                  disabled={
                    submitting
                  }
                >

                  {submitting ? (
                    <span>
                      Submitting...
                    </span>
                  ) : (
                    <>
                      <Send
                        size={18}
                      />

                      <span>
                        Submit Waste
                        Report
                      </span>
                    </>
                  )}

                </button>

                <p className="submit-disclaimer">
                  By submitting, you
                  confirm the accuracy
                  of the location to
                  assist municipal
                  sanitation.
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

