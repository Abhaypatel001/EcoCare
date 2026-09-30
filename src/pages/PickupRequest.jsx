import { useEffect, useState } from "react";

function PickupRequest() {
  const [bookingConfirmed, setBookingConfirmed] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    wasteType: "Organic Waste",
    quantity: "2-3 Standard Bags (10-20 kg)",
    pickupDate: new Date(
      Date.now() + 86400000
    )
      .toISOString()
      .split("T")[0],
    pickupTime: "morning",
    addressType: "Home",
    fullName: "",
    phone: "",
    address: "",
    instructions: "",
  });

  // ==========================================
  // LOAD LOGGED-IN USER
  // ==========================================

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("ecocare_user");

      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      setFormData((prev) => ({
        ...prev,
        fullName:
          user.name || prev.fullName,
        phone:
          user.phone || prev.phone,
      }));
    } catch (err) {
      console.error(
        "User Details Load Error:",
        err
      );
    }
  }, []);

  // ==========================================
  // WASTE TYPES
  // ==========================================

  const wasteTypes = [
    {
      name: "Organic Waste",
      icon: "🥬",
      description:
        "Food waste, kitchen waste & biodegradable items",
    },
    {
      name: "Dry Recyclables",
      icon: "♻️",
      description:
        "Paper, plastic, cardboard, metal & glass",
    },
    {
      name: "E-Waste",
      icon: "💻",
      description:
        "Electronics, batteries, cables & devices",
    },
    {
      name: "Bulk Waste",
      icon: "🛋️",
      description:
        "Furniture, large items & household waste",
    },
  ];

  // ==========================================
  // QUANTITIES
  // ==========================================

  const quantities = [
    "1 Small Bag (up to 5 kg)",
    "2-3 Standard Bags (10-20 kg)",
    "4-6 Bags (20-40 kg)",
    "Large / Bulk Quantity (40+ kg)",
  ];

  // ==========================================
  // TIME SLOTS
  // ==========================================

  const timeSlots = [
    {
      value: "morning",
      label: "Morning",
      time: "08:00 AM – 11:00 AM",
    },
    {
      value: "afternoon",
      label: "Afternoon",
      time: "12:00 PM – 03:00 PM",
    },
    {
      value: "evening",
      label: "Evening",
      time: "04:00 PM – 07:00 PM",
    },
  ];

  // ==========================================
  // ADDRESS TYPES
  // ==========================================

  const addressTypes = [
    "Home",
    "Society / Apartment",
    "Office / Commercial",
  ];

  // ==========================================
  // INPUT HANDLER
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT PICKUP
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const token =
      localStorage.getItem("ecocare_token");

    if (!token) {
      setError(
        "Please login before requesting a pickup."
      );
      return;
    }

    // Basic validation
    if (
      !formData.wasteType ||
      !formData.quantity ||
      !formData.pickupDate ||
      !formData.pickupTime ||
      !formData.addressType ||
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      setError(
        "Please fill all required pickup details."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://ecocare-backend-zhgx.onrender.com/api/pickups",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            wasteType:
              formData.wasteType,

            quantity:
              formData.quantity,

            pickupDate:
              formData.pickupDate,

            pickupTime:
              formData.pickupTime,

            addressType:
              formData.addressType,

            fullName:
              formData.fullName.trim(),

            phone:
              formData.phone.trim(),

            address:
              formData.address.trim(),

            instructions:
              formData.instructions.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to schedule pickup."
        );
      }

      if (!data.pickup) {
        throw new Error(
          "Pickup was created but booking details were not received."
        );
      }

      // Backend se actual booking save
      setBookingConfirmed(data.pickup);

      // Error clear
      setError("");

      // Page top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Pickup Booking Error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while booking pickup."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // BOOK ANOTHER PICKUP
  // ==========================================

  const handleBookAnother = () => {
    let userName = "";
    let userPhone = "";

    try {
      const storedUser =
        localStorage.getItem("ecocare_user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        userName = user.name || "";
        userPhone = user.phone || "";
      }
    } catch (err) {
      console.error(
        "User Details Load Error:",
        err
      );
    }

    setBookingConfirmed(null);
    setError("");

    setFormData({
      wasteType: "Organic Waste",

      quantity:
        "2-3 Standard Bags (10-20 kg)",

      pickupDate: new Date(
        Date.now() + 86400000
      )
        .toISOString()
        .split("T")[0],

      pickupTime: "morning",

      addressType: "Home",

      fullName: userName,

      phone: userPhone,

      address: "",

      instructions: "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CONFIRMATION SCREEN
  // ==========================================

  if (bookingConfirmed) {
    const confirmedTime =
      timeSlots.find(
        (slot) =>
          slot.value ===
          bookingConfirmed.pickupTime
      );

    return (
      <div className="pickup-page">
        <div className="pickup-confirmation">

          <div className="confirmation-icon">
            ✓
          </div>

          <h1>
            Pickup Request Scheduled!
          </h1>

          <p className="confirmation-text">
            Your waste pickup request has been
            successfully submitted.
          </p>

          {/* BOOKING ID */}

          <div className="booking-number">
            <span>
              Booking ID
            </span>

            <strong>
              {bookingConfirmed.bookingId}
            </strong>
          </div>

          {/* DETAILS */}

          <div className="confirmation-details">

            <div className="confirmation-row">
              <span>
                Waste Type
              </span>

              <strong>
                {bookingConfirmed.wasteType}
              </strong>
            </div>

            <div className="confirmation-row">
              <span>
                Quantity
              </span>

              <strong>
                {bookingConfirmed.quantity}
              </strong>
            </div>

            <div className="confirmation-row">
              <span>
                Pickup Date
              </span>

              <strong>
                {bookingConfirmed.pickupDate}
              </strong>
            </div>

            <div className="confirmation-row">
              <span>
                Pickup Time
              </span>

              <strong>
                {confirmedTime
                  ? confirmedTime.time
                  : bookingConfirmed.pickupTime}
              </strong>
            </div>

            <div className="confirmation-row">
              <span>
                Address
              </span>

              <strong>
                {bookingConfirmed.address}
              </strong>
            </div>

            <div className="confirmation-row">
              <span>
                Status
              </span>

              <strong className="confirmed-status">
                {bookingConfirmed.status ||
                  "Scheduled"}
              </strong>
            </div>

          </div>

          {/* INFO */}

          <div className="confirmation-note">
            <span>💡</span>

            <p>
              Please keep your waste properly
              segregated and ready at the selected
              pickup time.
            </p>
          </div>

          {/* ACTIONS */}

          <div className="confirmation-actions">

            <button
              className="primary-btn"
              onClick={handleBookAnother}
            >
              + Book Another Pickup
            </button>

            <button
              className="secondary-btn"
              onClick={() =>
                (window.location.href =
                  "/dashboard")
              }
            >
              Go to Dashboard
            </button>

          </div>

        </div>

        <style>{pickupStyles}</style>
      </div>
    );
  }

  // ==========================================
  // MAIN FORM
  // ==========================================

  return (
    <div className="pickup-page">

      {/* HERO */}

      <section className="pickup-hero">

        <div>
          <span className="hero-badge">
            ECOCARE WASTE MANAGEMENT
          </span>

          <h1>
            Schedule a Waste Pickup
          </h1>

          <p>
            Choose your waste type, pickup time,
            and address. We’ll take care of the
            rest.
          </p>
        </div>

        <div className="hero-icon">
          🚛
        </div>

      </section>

      {/* ERROR */}

      {error && (
        <div className="pickup-error">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="pickup-layout"
      >

        {/* =====================================
            LEFT
        ====================================== */}

        <div className="pickup-main">

          {/* WASTE TYPE */}

          <section className="pickup-section">

            <div className="section-heading">
              <span className="step-number">
                1
              </span>

              <div>
                <h2>
                  Select Waste Type
                </h2>

                <p>
                  What type of waste would you
                  like us to collect?
                </p>
              </div>
            </div>

            <div className="waste-grid">

              {wasteTypes.map(
                (type) => (
                  <button
                    type="button"
                    key={type.name}
                    className={
                      formData.wasteType ===
                      type.name
                        ? "waste-card selected"
                        : "waste-card"
                    }
                    onClick={() =>
                      setFormData(
                        (prev) => ({
                          ...prev,
                          wasteType:
                            type.name,
                        })
                      )
                    }
                  >

                    <span className="waste-icon">
                      {type.icon}
                    </span>

                    <strong>
                      {type.name}
                    </strong>

                    <small>
                      {type.description}
                    </small>

                  </button>
                )
              )}

            </div>

          </section>

          {/* QUANTITY */}

          <section className="pickup-section">

            <div className="section-heading">
              <span className="step-number">
                2
              </span>

              <div>
                <h2>
                  Waste Quantity
                </h2>

                <p>
                  Select the approximate amount.
                </p>
              </div>
            </div>

            <div className="quantity-grid">

              {quantities.map(
                (quantity) => (
                  <button
                    type="button"
                    key={quantity}
                    className={
                      formData.quantity ===
                      quantity
                        ? "quantity-option selected"
                        : "quantity-option"
                    }
                    onClick={() =>
                      setFormData(
                        (prev) => ({
                          ...prev,
                          quantity,
                        })
                      )
                    }
                  >
                    {quantity}
                  </button>
                )
              )}

            </div>

          </section>

          {/* DATE + TIME */}

          <section className="pickup-section">

            <div className="section-heading">
              <span className="step-number">
                3
              </span>

              <div>
                <h2>
                  Pickup Schedule
                </h2>

                <p>
                  Select your preferred date and
                  time.
                </p>
              </div>
            </div>

            <div className="form-group">

              <label>
                Pickup Date
                <span>*</span>
              </label>

              <input
                type="date"
                name="pickupDate"
                value={
                  formData.pickupDate
                }
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={handleChange}
                required
              />

            </div>

            <div className="time-grid">

              {timeSlots.map(
                (slot) => (
                  <button
                    type="button"
                    key={slot.value}
                    className={
                      formData.pickupTime ===
                      slot.value
                        ? "time-card selected"
                        : "time-card"
                    }
                    onClick={() =>
                      setFormData(
                        (prev) => ({
                          ...prev,
                          pickupTime:
                            slot.value,
                        })
                      )
                    }
                  >

                    <span>
                      🕐
                    </span>

                    <strong>
                      {slot.label}
                    </strong>

                    <small>
                      {slot.time}
                    </small>

                  </button>
                )
              )}

            </div>

          </section>

          {/* ADDRESS */}

          <section className="pickup-section">

            <div className="section-heading">
              <span className="step-number">
                4
              </span>

              <div>
                <h2>
                  Pickup Address
                </h2>

                <p>
                  Where should we collect the
                  waste?
                </p>
              </div>
            </div>

            <div className="form-group">

              <label>
                Address Type
                <span>*</span>
              </label>

              <select
                name="addressType"
                value={
                  formData.addressType
                }
                onChange={handleChange}
                required
              >
                {addressTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>

            </div>

            <div className="form-group">

              <label>
                Full Address
                <span>*</span>
              </label>

              <textarea
                name="address"
                value={
                  formData.address
                }
                onChange={handleChange}
                placeholder="House/Flat No., Street, Area, City, PIN Code"
                rows="4"
                required
              />

            </div>

          </section>

          {/* CONTACT */}

          <section className="pickup-section">

            <div className="section-heading">
              <span className="step-number">
                5
              </span>

              <div>
                <h2>
                  Contact Details
                </h2>

                <p>
                  We’ll use these details for
                  pickup coordination.
                </p>
              </div>
            </div>

            <div className="two-column">

              <div className="form-group">

                <label>
                  Full Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={
                    formData.fullName
                  }
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Phone Number
                  <span>*</span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={
                    formData.phone
                  }
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  required
                />

              </div>

            </div>

            <div className="form-group">

              <label>
                Special Instructions
              </label>

              <textarea
                name="instructions"
                value={
                  formData.instructions
                }
                onChange={handleChange}
                placeholder="Any special instructions for the pickup team..."
                rows="3"
              />

            </div>

          </section>

          {/* SUBMIT */}

          <button
            type="submit"
            className="schedule-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Scheduling Pickup...
              </>
            ) : (
              <>
                🚛 Schedule Pickup
              </>
            )}
          </button>

        </div>

        {/* =====================================
            RIGHT SUMMARY
        ====================================== */}

        <aside className="pickup-sidebar">

          <div className="summary-card">

            <h3>
              Pickup Summary
            </h3>

            <div className="summary-item">
              <span>
                Waste Type
              </span>

              <strong>
                {formData.wasteType}
              </strong>
            </div>

            <div className="summary-item">
              <span>
                Quantity
              </span>

              <strong>
                {formData.quantity}
              </strong>
            </div>

            <div className="summary-item">
              <span>
                Date
              </span>

              <strong>
                {formData.pickupDate}
              </strong>
            </div>

            <div className="summary-item">
              <span>
                Time
              </span>

              <strong>
                {
                  timeSlots.find(
                    (slot) =>
                      slot.value ===
                      formData.pickupTime
                  )?.time
                }
              </strong>
            </div>

            <div className="summary-item">
              <span>
                Address Type
              </span>

              <strong>
                {formData.addressType}
              </strong>
            </div>

            <div className="summary-divider" />

            <div className="reward-box">
              <span>
                🌱
              </span>

              <div>
                <strong>
                  Earn EcoPoints
                </strong>

                <p>
                  You’ll earn points for
                  responsible waste disposal.
                </p>
              </div>
            </div>

          </div>

          <div className="help-card">

            <div>
              💡
            </div>

            <div>
              <strong>
                Before Pickup
              </strong>

              <p>
                Please keep recyclable and
                organic waste separated.
              </p>
            </div>

          </div>

        </aside>

      </form>

      <style>{pickupStyles}</style>
    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const pickupStyles = `

  .pickup-page {
    min-height: 100vh;
    background: #f5f8f6;
    padding: 35px 20px 70px;
    color: #172033;
  }

  .pickup-hero {
    max-width: 1180px;
    margin: 0 auto 25px;
    padding: 34px;
    border-radius: 20px;
    background: linear-gradient(
      135deg,
      #0f5132,
      #198754
    );
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .hero-badge {
    display: inline-block;
    margin-bottom: 9px;
    padding: 6px 10px;
    border-radius: 20px;
    background: rgba(255,255,255,.14);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
  }

  .pickup-hero h1 {
    margin: 0;
    font-size: 34px;
    line-height: 1.2;
  }

  .pickup-hero p {
    margin: 10px 0 0;
    max-width: 650px;
    color: rgba(255,255,255,.85);
    line-height: 1.6;
  }

  .hero-icon {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: rgba(255,255,255,.13);
    font-size: 45px;
    flex-shrink: 0;
  }

  .pickup-error {
    max-width: 1180px;
    margin: 0 auto 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 15px;
    border-radius: 10px;
    background: #fef3f2;
    border: 1px solid #fecdca;
    color: #b42318;
  }

  .pickup-error p {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }

  .pickup-layout {
    max-width: 1180px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 330px;
    gap: 22px;
    align-items: start;
  }

  .pickup-main {
    display: grid;
    gap: 18px;
  }

  .pickup-section {
    background: white;
    border: 1px solid #e4e7ec;
    border-radius: 16px;
    padding: 24px;
  }

  .section-heading {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 22px;
  }

  .step-number {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    flex-shrink: 0;
    background: #dcfce7;
    color: #15803d;
    font-weight: 900;
  }

  .section-heading h2 {
    margin: 0;
    font-size: 19px;
  }

  .section-heading p {
    margin: 5px 0 0;
    color: #667085;
    font-size: 13px;
  }

  .waste-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .waste-card {
    border: 1px solid #d0d5dd;
    background: white;
    border-radius: 12px;
    padding: 17px;
    text-align: left;
    cursor: pointer;
    transition: .2s;
  }

  .waste-card:hover {
    border-color: #86efac;
    transform: translateY(-1px);
  }

  .waste-card.selected {
    border-color: #16a34a;
    background: #f0fdf4;
    box-shadow: 0 0 0 2px rgba(22,163,74,.08);
  }

  .waste-icon {
    display: block;
    font-size: 28px;
    margin-bottom: 9px;
  }

  .waste-card strong {
    display: block;
    font-size: 14px;
    color: #344054;
  }

  .waste-card small {
    display: block;
    margin-top: 5px;
    color: #667085;
    line-height: 1.4;
    font-size: 11px;
  }

  .quantity-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .quantity-option {
    border: 1px solid #d0d5dd;
    background: white;
    border-radius: 10px;
    padding: 13px;
    text-align: left;
    color: #475467;
    font-weight: 700;
    cursor: pointer;
  }

  .quantity-option.selected {
    border-color: #16a34a;
    background: #f0fdf4;
    color: #15803d;
  }

  .form-group {
    margin-bottom: 17px;
  }

  .form-group:last-child {
    margin-bottom: 0;
  }

  .form-group label {
    display: block;
    margin-bottom: 7px;
    color: #344054;
    font-size: 13px;
    font-weight: 800;
  }

  .form-group label span {
    margin-left: 3px;
    color: #d92d20;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    border: 1px solid #d0d5dd;
    border-radius: 9px;
    padding: 12px 13px;
    outline: none;
    background: white;
    color: #344054;
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(22,163,74,.08);
  }

  .time-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .time-card {
    border: 1px solid #d0d5dd;
    background: white;
    border-radius: 11px;
    padding: 15px 10px;
    text-align: center;
    cursor: pointer;
  }

  .time-card span {
    display: block;
    font-size: 21px;
    margin-bottom: 6px;
  }

  .time-card strong,
  .time-card small {
    display: block;
  }

  .time-card strong {
    color: #344054;
    font-size: 13px;
  }

  .time-card small {
    margin-top: 4px;
    color: #667085;
    font-size: 10px;
  }

  .time-card.selected {
    border-color: #16a34a;
    background: #f0fdf4;
  }

  .two-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .schedule-btn {
    width: 100%;
    min-height: 52px;
    border: none;
    border-radius: 11px;
    background: #15803d;
    color: white;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 9px;
  }

  .schedule-btn:hover {
    background: #166534;
  }

  .schedule-btn:disabled {
    opacity: .7;
    cursor: not-allowed;
  }

  .spinner {
    width: 17px;
    height: 17px;
    border: 2px solid rgba(255,255,255,.4);
    border-top-color: white;
    border-radius: 50%;
    animation: pickupSpin .7s linear infinite;
  }

  @keyframes pickupSpin {
    to {
      transform: rotate(360deg);
    }
  }

  .pickup-sidebar {
    position: sticky;
    top: 95px;
    display: grid;
    gap: 14px;
  }

  .summary-card,
  .help-card {
    background: white;
    border: 1px solid #e4e7ec;
    border-radius: 15px;
    padding: 20px;
  }

  .summary-card h3 {
    margin: 0 0 17px;
    font-size: 18px;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #f2f4f7;
  }

  .summary-item span {
    color: #667085;
    font-size: 12px;
  }

  .summary-item strong {
    max-width: 180px;
    text-align: right;
    color: #344054;
    font-size: 12px;
  }

  .summary-divider {
    height: 1px;
    margin: 8px 0;
    background: #eaecf0;
  }

  .reward-box {
    display: flex;
    gap: 10px;
    padding: 12px;
    border-radius: 10px;
    background: #f0fdf4;
  }

  .reward-box > span {
    font-size: 22px;
  }

  .reward-box strong {
    font-size: 13px;
    color: #15803d;
  }

  .reward-box p {
    margin: 3px 0 0;
    color: #667085;
    font-size: 11px;
    line-height: 1.4;
  }

  .help-card {
    display: flex;
    gap: 10px;
  }

  .help-card > div:first-child {
    font-size: 24px;
  }

  .help-card strong {
    color: #344054;
    font-size: 13px;
  }

  .help-card p {
    margin: 4px 0 0;
    color: #667085;
    font-size: 11px;
    line-height: 1.5;
  }

  /* ==========================================
     CONFIRMATION
  ========================================== */

  .pickup-confirmation {
    max-width: 650px;
    margin: 35px auto;
    background: white;
    border: 1px solid #e4e7ec;
    border-radius: 20px;
    padding: 35px;
    text-align: center;
    box-shadow: 0 8px 30px rgba(16,24,40,.06);
  }

  .confirmation-icon {
    width: 72px;
    height: 72px;
    margin: 0 auto 18px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #dcfce7;
    color: #15803d;
    font-size: 36px;
    font-weight: 900;
  }

  .pickup-confirmation h1 {
    margin: 0;
    font-size: 27px;
  }

  .confirmation-text {
    margin: 9px 0 22px;
    color: #667085;
    line-height: 1.5;
  }

  .booking-number {
    padding: 15px;
    border-radius: 11px;
    background: #f0fdf4;
  }

  .booking-number span,
  .booking-number strong {
    display: block;
  }

  .booking-number span {
    color: #667085;
    font-size: 11px;
    font-weight: 700;
  }

  .booking-number strong {
    margin-top: 4px;
    color: #15803d;
    font-size: 21px;
    letter-spacing: 1px;
  }

  .confirmation-details {
    margin-top: 18px;
    border: 1px solid #eaecf0;
    border-radius: 11px;
    padding: 4px 15px;
    text-align: left;
  }

  .confirmation-row {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    padding: 12px 0;
    border-bottom: 1px solid #f2f4f7;
  }

  .confirmation-row:last-child {
    border-bottom: none;
  }

  .confirmation-row span {
    color: #667085;
    font-size: 12px;
  }

  .confirmation-row strong {
    color: #344054;
    font-size: 12px;
    text-align: right;
  }

  .confirmed-status {
    color: #15803d !important;
  }

  .confirmation-note {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin-top: 15px;
    padding: 12px;
    border-radius: 10px;
    background: #fffaeb;
    text-align: left;
  }

  .confirmation-note p {
    margin: 0;
    color: #7a5a00;
    font-size: 12px;
    line-height: 1.5;
  }

  .confirmation-actions {
    display: grid;
    gap: 9px;
    margin-top: 20px;
  }

  .primary-btn,
  .secondary-btn {
    min-height: 46px;
    border-radius: 9px;
    font-weight: 800;
    cursor: pointer;
  }

  .primary-btn {
    border: none;
    background: #15803d;
    color: white;
  }

  .secondary-btn {
    border: 1px solid #d0d5dd;
    background: white;
    color: #344054;
  }

  @media (max-width: 900px) {

    .pickup-layout {
      grid-template-columns: 1fr;
    }

    .pickup-sidebar {
      position: static;
      order: -1;
    }

  }

  @media (max-width: 650px) {

    .pickup-page {
      padding: 20px 12px 45px;
    }

    .pickup-hero {
      padding: 25px 20px;
    }

    .pickup-hero h1 {
      font-size: 27px;
    }

    .hero-icon {
      display: none;
    }

    .pickup-section {
      padding: 18px;
    }

    .waste-grid,
    .quantity-grid,
    .two-column {
      grid-template-columns: 1fr;
    }

    .time-grid {
      grid-template-columns: 1fr;
    }

    .pickup-confirmation {
      padding: 25px 17px;
      margin: 15px auto;
    }

  }

  @media (max-width: 430px) {

    .pickup-hero {
      border-radius: 14px;
    }

    .pickup-confirmation h1 {
      font-size: 23px;
    }

    .confirmation-row {
      flex-direction: column;
      gap: 4px;
    }

    .confirmation-row strong {
      text-align: left;
    }

  }

`;

export default PickupRequest;