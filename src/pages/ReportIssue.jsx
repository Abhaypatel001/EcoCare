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
    latitude: null,
    longitude: null,
  });

  // ==========================================
  // IMAGE STATES
  // ==========================================

  // Preview URL
  const [image, setImage] = useState(null);

  // Actual File object
  const [imageFile, setImageFile] = useState(null);

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
  // IMAGE UPLOAD
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // ==========================================
    // IMAGE TYPE VALIDATION
    // ==========================================

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    // ==========================================
    // 5 MB LIMIT
    // Backend multer bhi 5 MB limit rakhta hai
    // ==========================================

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      return;
    }

    // ==========================================
    // STORE ACTUAL FILE
    // ==========================================

    setImageFile(file);

    // ==========================================
    // CREATE PREVIEW
    // ==========================================

    const previewUrl = URL.createObjectURL(file);

    setImage(previewUrl);

    setImageName(file.name);
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }

    setImage(null);
    setImageFile(null);
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

    // ==========================================
    // REQUIRE IMAGE
    // ==========================================

    if (!imageFile) {
      alert(
        "Please upload a clear waste image for AI verification."
      );

      return;
    }

    // ==========================================
    // REQUIRE LOCATION
    // ==========================================

    if (
      formData.latitude === null ||
      formData.latitude === undefined ||
      formData.longitude === null ||
      formData.longitude === undefined
    ) {
      alert(
        "Please detect or select the waste location before submitting."
      );

      return;
    }

    // ==========================================
    // REQUIRE DESCRIPTION
    // ==========================================

    if (!formData.description.trim()) {
      alert(
        "Please provide a description of the waste issue."
      );

      return;
    }

    try {
      setSubmitting(true);

      const token =
        localStorage.getItem("ecocare_token") ||
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Your login session has expired. Please login again."
        );

        navigate("/login");

        return;
      }

      // ==========================================
      // CATEGORY MAPPING
      // ==========================================

      const mappedCategory =
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
          : "Other";

      // ==========================================
      // FORM DATA
      // ==========================================
      // IMPORTANT:
      // JSON.stringify() nahi karna.
      // Image ke liye multipart/form-data use hoga.

      const formDataToSend = new FormData();

      formDataToSend.append(
        "title",
        formData.title ||
          formData.issueType
      );

      formDataToSend.append(
        "description",
        formData.description
      );

      formDataToSend.append(
        "location",
        formData.address
      );

      formDataToSend.append(
        "latitude",
        String(formData.latitude)
      );

      formDataToSend.append(
        "longitude",
        String(formData.longitude)
      );

      formDataToSend.append(
        "landmark",
        formData.landmark || ""
      );

      formDataToSend.append(
        "category",
        mappedCategory
      );

      // ==========================================
      // ACTUAL IMAGE FILE
      // ==========================================

      formDataToSend.append(
        "image",
        imageFile
      );

      // ==========================================
      // DEBUG
      // ==========================================

      console.log(
        "================================="
      );

      console.log(
        "SUBMITTING AI VERIFIED COMPLAINT"
      );

      console.log(
        "Title:",
        formData.title ||
          formData.issueType
      );

      console.log(
        "Location:",
        formData.address
      );

      console.log(
        "Latitude:",
        formData.latitude
      );

      console.log(
        "Longitude:",
        formData.longitude
      );

      console.log(
        "Image:",
        imageFile.name
      );

      console.log(
        "Image Size:",
        (
          imageFile.size /
          (1024 * 1024)
        ).toFixed(2),
        "MB"
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
            // IMPORTANT:
            // Content-Type manually MAT lagana.
            // Browser automatically multipart boundary set karega.

            Authorization:
              `Bearer ${token}`,
          },

          body: formDataToSend,
        }
      );

      // ==========================================
      // RESPONSE
      // ==========================================

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
        // AI rejected image
        if (
          data.aiVerification?.status ===
          "Rejected"
        ) {
          throw new Error(
            data.message ||
              "AI verification rejected this image. Please upload a clear waste image."
          );
        }

        throw new Error(
          data.message ||
            "Failed to submit complaint"
        );
      }

      // ==========================================
      // AI RESULT
      // ==========================================

      const aiVerification =
        data.aiVerification;

      console.log(
        "================================="
      );

      console.log(
        "AI VERIFICATION RESULT"
      );

      console.log(
        "Waste:",
        aiVerification?.isWaste
      );

      console.log(
        "Confidence:",
        aiVerification?.confidence
      );

      console.log(
        "Category:",
        aiVerification?.category
      );

      console.log(
        "Status:",
        aiVerification?.status
      );

      console.log(
        "Explanation:",
        aiVerification?.explanation
      );

      console.log(
        "================================="
      );

      // ==========================================
      // TRACKING ID
      // ==========================================

      const complaintId =
        data.complaint?._id ||
        data.data?._id ||
        data._id;

      // ==========================================
      // NEW REPORT
      // ==========================================

      const newReport = {
        id:
          complaintId ||
          `WM${Date.now()}`,

        title:
          formData.title ||
          formData.issueType,

        type:
          formData.issueType,

        location:
          formData.address,

        latitude:
          formData.latitude,

        longitude:
          formData.longitude,

        date: "Just now",

        // AI verified complaints start as Pending
        status: "Pending",

        priority:
          formData.priority,

        description:
          formData.description,

        image:
          image,

        // ========================================
        // AI DATA
        // ========================================

        aiVerification:
          aiVerification,
      };

      setSubmittedReport(
        newReport
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // ==========================================
      // RESET FORM
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
      setImageFile(null);
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
    formData.latitude !== null &&
    formData.longitude !== null
      ? [
          formData.latitude,
          formData.longitude,
        ]
      : [26.4499, 80.3319];

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

              {/* AI RESULT */}

              {submittedReport.aiVerification && (
                <div
                  style={{
                    marginTop: "18px",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    background:
                      submittedReport
                        .aiVerification
                        .status ===
                      "Approved"
                        ? "#ecfdf3"
                        : "#fffaeb",
                    border:
                      "1px solid #d0d5dd",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontWeight: "700",
                      marginBottom: "6px",
                    }}
                  >
                    <Sparkles size={17} />

                    AI Image Verification:{" "}
                    {
                      submittedReport
                        .aiVerification
                        .status
                    }
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#475467",
                    }}
                  >
                    Detected:{" "}
                    {
                      submittedReport
                        .aiVerification
                        .category
                    }
                    {" • "}
                    Confidence:{" "}
                    {Math.round(
                      submittedReport
                        .aiVerification
                        .confidence *
                        100
                    )}
                    %
                  </div>

                  <p
                    style={{
                      marginTop: "7px",
                      marginBottom: 0,
                      fontSize: "13px",
                      color: "#475467",
                    }}
                  >
                    {
                      submittedReport
                        .aiVerification
                        .explanation
                    }
                  </p>
                </div>
              )}

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
                    setSubmittedReport(null)
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
                    AI will verify that the
                    uploaded image actually
                    contains waste-related
                    evidence.
                  </p>

                </div>

                {/* AI INFO */}

                <div
                  style={{
                    marginBottom: "16px",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    background: "#f0fdf4",
                    border:
                      "1px solid #bbf7d0",
                    color: "#166534",
                    fontSize: "13px",
                  }}
                >
                  <strong>
                    ✨ AI Image Verification
                  </strong>

                  <div
                    style={{
                      marginTop: "4px",
                    }}
                  >
                    Unrelated images such as
                    selfies, animals, vehicles,
                    screenshots or random
                    objects may be rejected
                    automatically.
                  </div>
                </div>

                {!image ? (
                  <label className="upload-dropzone">

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
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
                        JPG, PNG, WEBP up to 5MB
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

                    {locationError && (
                      <div
                        style={{
                          marginTop: "10px",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          background: "#fff1f2",
                          color: "#be123c",
                          fontSize: "13px",
                        }}
                      >
                        {locationError}
                      </div>
                    )}

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

                {/* MAP */}

                <div
                  style={{
                    marginTop: "18px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border:
                      "1px solid #d0d5dd",
                    height: "360px",
                    position: "relative",
                  }}
                >
                  <MapContainer
                    center={mapCenter}
                    zoom={
                      formData.latitude !== null
                        ? 17
                        : 12
                    }
                    scrollWheelZoom={true}
                    style={{
                      height: "100%",
                      width: "100%",
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

                    {formData.latitude !== null &&
                      formData.longitude !== null && (
                        <Marker
                          position={[
                            formData.latitude,
                            formData.longitude,
                          ]}
                        >
                          <Popup>
                            <strong>
                              EcoCare Report
                              Location
                            </strong>

                            <br />

                            {formData.address ||
                              "Selected location"}
                          </Popup>
                        </Marker>
                      )}
                  </MapContainer>

                  {!formData.latitude && (
                    <div
                      style={{
                        position: "absolute",
                        top: "15px",
                        left: "50%",
                        transform:
                          "translateX(-50%)",
                        zIndex: 1000,
                        background: "white",
                        padding: "9px 14px",
                        borderRadius: "10px",
                        boxShadow:
                          "0 3px 12px rgba(0,0,0,.15)",
                        fontSize: "13px",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      📍 Click on the map to
                      select location
                    </div>
                  )}
                </div>

                {/* COORDINATES */}

                {formData.latitude !== null &&
                  formData.longitude !== null && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        background: "#f0fdf4",
                        border:
                          "1px solid #bbf7d0",
                        fontSize: "13px",
                        color: "#166534",
                      }}
                    >
                      <strong>
                        📍 Location selected
                      </strong>

                      <div
                        style={{
                          marginTop: "5px",
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
                    Severity / Urgency
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

                {/* AI VERIFICATION INFO */}

                <div
                  className="sidebar-section-card"
                  style={{
                    border:
                      "1px solid #bbf7d0",
                    background: "#f0fdf4",
                  }}
                >
                  <div className="card-badge-row">
                    <Sparkles size={16} />

                    <span>
                      AI Image Verification
                    </span>
                  </div>

                  <p>
                    Your uploaded image will
                    be analyzed automatically
                    to verify that it contains
                    waste-related evidence.
                  </p>

                  <div className="eco-points-preview">
                    <CheckCircle2 size={16} />

                    <span>
                      Clear waste evidence
                      helps speed up verification.
                    </span>
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
                    All collected organic
                    waste is processed at
                    our bio-composting
                    facility, diverting it
                    from toxic open
                    landfills.
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
                    <span>
                      🤖 AI Verifying Image...
                    </span>
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
                  Your image will be checked
                  by AI before the complaint
                  is registered.
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