import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Truck,
  CheckCircle2,
  Recycle,
  Leaf,
  Sparkles,
  TreePine,
  ShieldCheck,
  Search,
  Award,
  ChevronRight,
  Zap
} from "lucide-react";

// Common household items for the instant waste lookup tool
const quickWasteItems = [
  { name: "Banana Peels", bin: "Green (Wet Waste)", type: "Biodegradable", compost: "100% Composting in 3-4 weeks", color: "wet" },
  { name: "Plastic Bottles", bin: "Blue (Dry Waste)", type: "Recyclable", compost: "Recycled into polyester & pellets", color: "dry" },
  { name: "Vegetable Scraps", bin: "Green (Wet Waste)", type: "Biodegradable", compost: "Creates rich organic soil", color: "wet" },
  { name: "Cardboard Box", bin: "Blue (Dry Waste)", type: "Recyclable", compost: "Pulp recycled or brown compost carbon", color: "dry" },
  { name: "Old Batteries", bin: "Black / Red (Hazardous)", type: "E-Waste", compost: "Special chemical extraction required", color: "hazard" },
  { name: "Glass Jar", bin: "Blue (Dry Waste)", type: "Recyclable", compost: "100% infinitely recyclable", color: "dry" },
  { name: "Medicine Foil", bin: "Red (Sanitary/Hazard)", type: "Hazardous", compost: "Incinerated safely in biomedical facility", color: "hazard" },
  { name: "Dry Leaves", bin: "Green (Wet / Brown)", type: "Compostable", compost: "High-carbon mulch & compost activator", color: "wet" }
];

function Home() {
  const [wasteSearch, setWasteSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(quickWasteItems[0]);

  const filteredItems = quickWasteItems.filter(item =>
    item.name.toLowerCase().includes(wasteSearch.toLowerCase())
  );

  return (
    <div className="home-page">
      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        <div className="hero-background-decorations">
          <div className="decor-circle circle-1"></div>
          <div className="decor-circle circle-2"></div>
          <div className="decor-leaf leaf-1">🍃</div>
          <div className="decor-leaf leaf-2">🌿</div>
        </div>

        <div className="home-container hero-layout">
          <div className="hero-content">
            <div className="hero-badge">
              <Leaf size={16} className="badge-icon" />
              <span>Bio-Circular Waste Management Platform</span>
            </div>

            <h1 className="hero-title">
              Cleaner Cities. <br />
              Greener Planet. <br />
              <span className="hero-highlight">Natural Waste Systems.</span>
            </h1>

            <p className="hero-description">
              Join thousands of conscious citizens turning neighborhood waste into
              clean compost and recyclable resources. Report garbage dumps with GPS photos,
              schedule doorstep segregated pickups, and track city cleanliness in real time.
            </p>

            <div className="hero-actions">
              <Link to="/report-issue" className="btn-primary-nature">
                <Camera size={19} />
                <span>Report Waste Dump</span>
                <ArrowRight size={17} className="btn-arrow" />
              </Link>

              <Link to="/pickup-request" className="btn-secondary-nature">
                <Truck size={19} />
                <span>Book Doorstep Pickup</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="hero-metrics-grid">
              <div className="metric-box">
                <div className="metric-icon-wrap green-glow">
                  <TreePine size={20} />
                </div>
                <div>
                  <h3 className="metric-val">1,480+</h3>
                  <span className="metric-lbl">Tons Recycled</span>
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-icon-wrap emerald-glow">
                  <Leaf size={20} />
                </div>
                <div>
                  <h3 className="metric-val">890+</h3>
                  <span className="metric-lbl">Tons Composted</span>
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-icon-wrap blue-glow">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="metric-val">98.6%</h3>
                  <span className="metric-lbl">Resolution Rate</span>
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-icon-wrap orange-glow">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="metric-val">4.2K+</h3>
                  <span className="metric-lbl">Green Citizens</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual Card / Interactive Showcase */}
          <div className="hero-visual-card">
            <div className="visual-card-glass">
              {/* Card Header */}
              <div className="visual-card-header">
                <div className="status-indicator">
                  <span className="live-dot pulse"></span>
                  <span>Live Municipal Cleanliness Feed</span>
                </div>
                <span className="city-pill">Kanpur Smart City</span>
              </div>

              {/* Central Nature Orb */}
              <div className="nature-orb-container">
                <div className="nature-orb">
                  <Recycle size={70} className="spinning-recycle-icon" />
                  <span className="orb-caption">Zero Landfill Goal</span>
                </div>
              </div>

              {/* Floating Live Badges */}
              <div className="floating-badge badge-top-left">
                <div className="badge-icon-bg bg-emerald">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <strong>Issue #WM1024 Cleaned</strong>
                  <small>Civil Lines • 12 mins ago</small>
                </div>
              </div>

              <div className="floating-badge badge-bottom-right">
                <div className="badge-icon-bg bg-green">
                  <Leaf size={16} />
                </div>
                <div>
                  <strong>Wet Waste Composted</strong>
                  <small>+35 kg Organic Soil Generated</small>
                </div>
              </div>

              <div className="floating-badge badge-middle-right">
                <div className="badge-icon-bg bg-blue">
                  <Truck size={16} />
                </div>
                <div>
                  <strong>Electric Pickup Crew</strong>
                  <small>Active on Route #04</small>
                </div>
              </div>

              {/* Card Footer Metric */}
              <div className="visual-card-footer">
                <div className="card-score-info">
                  <span className="score-label">Neighborhood Cleanliness Index</span>
                  <div className="progress-bar-wrap">
                    <div className="progress-fill" style={{ width: "94%" }}></div>
                  </div>
                </div>
                <span className="score-percentage">94%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE WASTE SEARCH TOOL ================= */}
      <section className="waste-scanner-section">
        <div className="home-container">
          <div className="scanner-container-card">
            <div className="scanner-header">
              <div className="scanner-title-area">
                <span className="sub-badge">
                  <Sparkles size={14} /> Instant Waste Segregation Finder
                </span>
                <h2>Not sure how to dispose of an item?</h2>
                <p>
                  Search or click common items to discover the right bin, decomposition cycle,
                  and composting potential.
                </p>
              </div>

              <div className="scanner-search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Type an item (e.g. coffee grounds, plastic bag)..."
                  value={wasteSearch}
                  onChange={(e) => setWasteSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Quick Chips */}
            <div className="quick-chips-row">
              {filteredItems.slice(0, 8).map((item) => (
                <button
                  key={item.name}
                  className={`waste-chip ${selectedItem?.name === item.name ? "selected" : ""}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <span className={`chip-dot dot-${item.color}`}></span>
                  {item.name}
                </button>
              ))}
            </div>

            {/* Selected Item Breakdown */}
            {selectedItem && (
              <div className={`scanner-result-box result-theme-${selectedItem.color}`}>
                <div className="result-main">
                  <div className="result-bin-badge">
                    <Leaf size={18} />
                    <span>Target Bin: <strong>{selectedItem.bin}</strong></span>
                  </div>
                  <h3>{selectedItem.name} — {selectedItem.type}</h3>
                  <p className="compost-note">{selectedItem.compost}</p>
                </div>
                <Link to="/awareness" className="scanner-learn-more">
                  Full Segregation Guide <ChevronRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= CORE FEATURES / SOLUTIONS ================= */}
      <section className="features-showcase-section">
        <div className="home-container">
          <div className="section-title-center">
            <span className="section-eyebrow">SMART & NATURAL SOLUTIONS</span>
            <h2>Everything Needed for a Waste-Free Community</h2>
            <p>
              Combining modern citizen reporting technology with traditional, high-yield
              organic composting and verified circular material recovery.
            </p>
          </div>

          <div className="features-cards-grid">
            {/* Feature 1 */}
            <div className="nature-feature-card">
              <div className="feature-card-header">
                <div className="feature-icon-box green-icon">
                  <Camera size={26} />
                </div>
                <span className="feature-tag">Citizens</span>
              </div>
              <h3>AI & Geo-Photo Waste Reporting</h3>
              <p>
                Spot garbage dumps, overflowing street bins, or unauthorized burning?
                Take a quick photo — our GPS pinpoints coordinates and notifies municipal sanitation teams.
              </p>
              <Link to="/report-issue" className="feature-action-link">
                <span>Report Waste Issue</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="nature-feature-card">
              <div className="feature-card-header">
                <div className="feature-icon-box emerald-icon">
                  <Truck size={26} />
                </div>
                <span className="feature-tag">Doorstep</span>
              </div>
              <h3>Scheduled Doorstep Segregated Pickup</h3>
              <p>
                Request door-to-door collection for dry recyclables, e-waste, garden prunings,
                or bulk society waste at your preferred morning or evening time slot.
              </p>
              <Link to="/pickup-request" className="feature-action-link">
                <span>Book Pickup Slot</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="nature-feature-card">
              <div className="feature-card-header">
                <div className="feature-icon-box earth-icon">
                  <Leaf size={26} />
                </div>
                <span className="feature-tag">Composting</span>
              </div>
              <h3>100% Bio-Organic Composting</h3>
              <p>
                Wet kitchen food scraps don’t rot in dumps — they are routed directly to
                scientific composting hubs, generating organic manure for city gardens and local farmers.
              </p>
              <Link to="/awareness" className="feature-action-link">
                <span>Explore Composting</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="nature-feature-card">
              <div className="feature-card-header">
                <div className="feature-icon-box blue-icon">
                  <Recycle size={26} />
                </div>
                <span className="feature-tag">Circularity</span>
              </div>
              <h3>Traceable Dry Material Recovery</h3>
              <p>
                Track the journey of your plastics, cardboards, and e-waste from collection
                to authorized recyclers. Zero leakage into open rivers and water bodies.
              </p>
              <Link to="/complaints" className="feature-action-link">
                <span>Track Recovery Flow</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Feature 5 */}
            <div className="nature-feature-card">
              <div className="feature-card-header">
                <div className="feature-icon-box amber-icon">
                  <Award size={26} />
                </div>
                <span className="feature-tag">Rewards</span>
              </div>
              <h3>Citizen EcoPoints & Green Badges</h3>
              <p>
                Earn verified EcoPoints for every report resolved and properly segregated
                pickup. Redeem points for community recognition and green utility perks.
              </p>
              <Link to="/dashboard" className="feature-action-link">
                <span>View Eco Dashboard</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Feature 6 */}
            <div className="nature-feature-card">
              <div className="feature-card-header">
                <div className="feature-icon-box purple-icon">
                  <ShieldCheck size={26} />
                </div>
                <span className="feature-tag">Municipal</span>
              </div>
              <h3>Command Center & Staff Dispatch</h3>
              <p>
                Sanitation inspectors monitor live complaint maps, assign electric collection
                fleets, and upload resolution proof with before/after timestamps.
              </p>
              <Link to="/admin" className="feature-action-link">
                <span>Staff Portal</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4-STEP NATURAL CIRCULAR CYCLE ================= */}
      <section className="how-it-works-nature">
        <div className="home-container">
          <div className="section-title-center">
            <span className="section-eyebrow">THE CIRCULAR PROCESS</span>
            <h2>How Nature-Positive Waste Management Works</h2>
            <p>From citizen action to rich fertile compost in 4 transparent stages.</p>
          </div>

          <div className="steps-timeline-grid">
            {/* Step 1 */}
            <div className="nature-step-card">
              <div className="step-badge-number">01</div>
              <div className="step-icon-wrap">
                <Camera size={24} />
              </div>
              <h4>Snap & Geotag</h4>
              <p>
                A citizen takes a photo of uncollected waste or books a doorstep pickup
                with accurate GPS location.
              </p>
            </div>

            <div className="timeline-connector"></div>

            {/* Step 2 */}
            <div className="nature-step-card">
              <div className="step-badge-number">02</div>
              <div className="step-icon-wrap">
                <Zap size={24} />
              </div>
              <h4>Smart Routing</h4>
              <p>
                System assigns nearest green collection crew and optimizes fuel-efficient
                electric vehicle routes.
              </p>
            </div>

            <div className="timeline-connector"></div>

            {/* Step 3 */}
            <div className="nature-step-card">
              <div className="step-badge-number">03</div>
              <div className="step-icon-wrap">
                <Truck size={24} />
              </div>
              <h4>Segregated Haul</h4>
              <p>
                Sanitation teams safely collect segregated wet, dry, and e-waste without
                mixing them together.
              </p>
            </div>

            <div className="timeline-connector"></div>

            {/* Step 4 */}
            <div className="nature-step-card">
              <div className="step-badge-number">04</div>
              <div className="step-icon-wrap">
                <Leaf size={24} />
              </div>
              <h4>Bio-Compost & Recycle</h4>
              <p>
                Organic waste becomes nutrient soil conditioner; dry materials enter circular
                recycling streams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMMUNITY QUOTE / NATURE BANNER ================= */}
      <section className="nature-quote-section">
        <div className="home-container">
          <div className="quote-card-box">
            <span className="quote-leaf-badge">🌿 Sustainability Principle</span>
            <blockquote>
              "In nature, there is no such thing as waste. Every organic scrap is food
              for another living organism. When we segregate responsibly, our city breathes easier."
            </blockquote>
            <div className="quote-author">
              <strong>EcoCare Municipal Sustainability Board</strong>
              <span>Dedicated to Circular Cities & Zero Landfill by 2030</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION (CTA) ================= */}
      <section className="home-cta-section">
        <div className="home-container">
          <div className="nature-cta-card">
            <div className="cta-left-content">
              <span className="cta-badge">
                <Sparkles size={14} /> Be a City Cleanliness Champion
              </span>
              <h2>Ready to build a clean, green neighborhood?</h2>
              <p>
                Report an overflowing bin in under 60 seconds, or book a free segregated
                waste pickup for your home or residential society today.
              </p>

              <div className="cta-button-group">
                <Link to="/report-issue" className="cta-btn-white">
                  <Camera size={18} />
                  <span>Report Waste Now</span>
                </Link>

                <Link to="/pickup-request" className="cta-btn-ghost">
                  <Truck size={18} />
                  <span>Schedule Home Pickup</span>
                </Link>

                <Link to="/awareness" className="cta-btn-link">
                  <span>Learn Segregation</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="cta-right-graphic">
              <div className="graphic-circle">
                <Recycle size={110} />
              </div>
              <span className="eco-stamp">100% Bio-Circular</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;