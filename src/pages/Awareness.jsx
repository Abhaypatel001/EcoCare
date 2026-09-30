import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Recycle,
  Trash2,
  Leaf,
  Battery,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lightbulb,
  TreePine,
  Sparkles,
  BookOpen,
  Search,
  Droplets,
  Sun,
  Wind,
  ShieldAlert,
  Heart
} from "lucide-react";

const binGuide = [
  {
    id: "green",
    name: "Green Bin (Wet Waste)",
    tag: "100% Biodegradable",
    icon: Leaf,
    badgeColor: "bin-badge-green",
    description: "Organic kitchen and garden waste that naturally decomposes into nutrient-rich humus.",
    items: ["Fruit & vegetable peels", "Leftover cooked food", "Eggshells & coffee grounds", "Tea bags & leaves", "Garden leaves & small twigs", "Soiled napkins & tissue paper"],
    destination: "Municipal Vermicompost & Biogas Digestion"
  },
  {
    id: "blue",
    name: "Blue Bin (Dry Waste)",
    tag: "Clean & Recyclable",
    icon: Recycle,
    badgeColor: "bin-badge-blue",
    description: "Inorganic, clean, dry materials that can be mechanically sorted and reprocessed into new goods.",
    items: ["Flattened cardboard & boxes", "Rinsed plastic bottles & caps", "Milk & oil pouches (rinsed)", "Glass jars & clean bottles", "Aluminum drink cans", "Newspapers & notebooks"],
    destination: "Material Recovery Facilities (MRF) & Circular Mills"
  },
  {
    id: "red",
    name: "Red Bin (Sanitary & Hazardous)",
    tag: "Biomedical / Toxic",
    icon: ShieldAlert,
    badgeColor: "bin-badge-red",
    description: "Dangerous, infectious, or chemically hazardous items requiring specialized sterilization.",
    items: ["Sanitary pads & diapers (wrapped)", "Expired medicines & syrups", "Used bandages & syringes", "Pesticides & insecticide cans", "Paints, thinners & solvents", "Broken mirror & window glass"],
    destination: "High-Temperature Controlled Thermal Sterilization"
  },
  {
    id: "black",
    name: "Black Bin (E-Waste)",
    tag: "Electronic & Heavy Metals",
    icon: Battery,
    badgeColor: "bin-badge-black",
    description: "Old electronic goods containing hazardous heavy metals that must never reach open soil.",
    items: ["Mobile chargers & USB cables", "Lithium & alkaline batteries", "Broken headphones & remotes", "Dead laptop circuit boards", "Fluorescent CFL & LED bulbs", "Old kitchen appliances"],
    destination: "Authorized E-Waste Dismantling & Rare Metal Extraction"
  }
];

const wasteDatabase = [
  { item: "Banana Peel", bin: "Green (Wet)", note: "Breaks down into compost in 2-4 weeks" },
  { item: "Plastic Soda Bottle", bin: "Blue (Dry)", note: "Rinse before placing in dry bin" },
  { item: "Pizza Box", bin: "Green if greasy / Blue if clean", note: "Oil prevents paper recycling; greasy cardboard can be composted" },
  { item: "Used AA Batteries", bin: "Black (E-Waste)", note: "Contains corrosive cadmium/zinc; never mix with regular trash" },
  { item: "Egg Shells", bin: "Green (Wet)", note: "Rich in calcium; excellent soil additive for gardening" },
  { item: "Glass Pickle Jar", bin: "Blue (Dry)", note: "Wash thoroughly with water; 100% recyclable infinitely" },
  { item: "Expired Antibiotics", bin: "Red (Hazardous)", note: "Hand over to pharmacy or wrap in marked red bag" },
  { item: "Milk Poly-pouch", bin: "Blue (Dry)", note: "Cut corner partially so snippet doesn't get lost; rinse clean" },
  { item: "Tea Bags", bin: "Green (Wet)", note: "Remove staple pin before tossing into wet bin" },
  { item: "Dry Garden Leaves", bin: "Green (Browns for Compost)", note: "High in carbon; balances wet greens in home compost pit" }
];

function Awareness() {
  const [activeBin, setActiveBin] = useState("green");
  const [searchTerm, setSearchTerm] = useState("");
  const [pledged, setPledged] = useState(false);
  const [pledgeCount, setPledgeCount] = useState(1420);

  const handlePledge = () => {
    if (!pledged) {
      setPledged(true);
      setPledgeCount(prev => prev + 1);
    }
  };

  const filteredItems = wasteDatabase.filter(w =>
    w.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.bin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="awareness-page">
      {/* Hero Banner */}
      <section className="awareness-hero-section">
        <div className="awareness-container">
          <div className="awareness-hero-box">
            <span className="awareness-eyebrow">
              <Leaf size={14} /> NATURAL WASTE EDUCATION & COMPOSTING
            </span>
            <h1>The Art of Waste Segregation & Home Composting</h1>
            <p>
              Over 60% of all municipal waste is organic food scraps that can be converted
              into rich bio-fertilizer. Master source segregation and help your city achieve zero-landfill status.
            </p>

            <div className="hero-key-facts">
              <div className="fact-item">
                <strong>60%</strong>
                <span>Of Household Trash is Compostable</span>
              </div>
              <div className="fact-item">
                <strong>Zero</strong>
                <span>Methane Emitted when Composted Correctly</span>
              </div>
              <div className="fact-item">
                <strong>100%</strong>
                <span>Nutrient Return to Mother Earth</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Color Bins Section */}
      <section className="bins-guide-section">
        <div className="awareness-container">
          <div className="section-title-center">
            <span className="section-eyebrow">THE 4-BIN SYSTEM</span>
            <h2>Segregate at Source: Color Coding Guide</h2>
            <p>Know which waste belongs in each bin to ensure hygienic recycling.</p>
          </div>

          <div className="bins-tabs-row">
            {binGuide.map((bin) => {
              const Icon = bin.icon;
              return (
                <button
                  key={bin.id}
                  className={`bin-tab-btn tab-${bin.id} ${activeBin === bin.id ? "active" : ""}`}
                  onClick={() => setActiveBin(bin.id)}
                >
                  <Icon size={18} />
                  <span>{bin.name.split(" ")[0]} Bin</span>
                </button>
              );
            })}
          </div>

          {/* Active Bin Details Card */}
          {(() => {
            const current = binGuide.find(b => b.id === activeBin);
            const Icon = current.icon;
            return (
              <div className={`bin-detailed-card bin-theme-${current.id}`}>
                <div className="bin-card-left">
                  <div className="bin-icon-banner">
                    <Icon size={36} />
                  </div>
                  <span className={`bin-pill-tag ${current.badgeColor}`}>{current.tag}</span>
                  <h3>{current.name}</h3>
                  <p className="bin-desc">{current.description}</p>

                  <div className="bin-destination-box">
                    <strong>Processing Destination:</strong>
                    <span>{current.destination}</span>
                  </div>
                </div>

                <div className="bin-card-right">
                  <h4>Common Items for this Bin</h4>
                  <ul className="bin-items-checklist">
                    {current.items.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* "Where Does This Go?" Search Finder */}
      <section className="waste-finder-section">
        <div className="awareness-container">
          <div className="finder-card-box">
            <div className="finder-header">
              <div>
                <span className="finder-badge">
                  <Search size={14} /> Quick Waste Directory
                </span>
                <h2>Where Does This Item Go?</h2>
                <p>Type any everyday item below to discover its designated bin.</p>
              </div>

              <div className="finder-search-field">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="e.g. egg shells, pizza box, battery..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="finder-results-grid">
              {filteredItems.map((entry, idx) => (
                <div key={idx} className="finder-result-item">
                  <div className="result-top">
                    <h4>{entry.item}</h4>
                    <span className="bin-target-pill">{entry.bin}</span>
                  </div>
                  <p>{entry.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 Steps to Home Composting */}
      <section className="composting-guide-section">
        <div className="awareness-container">
          <div className="section-title-center">
            <span className="section-eyebrow">NATURAL BIO-COMPOSTING</span>
            <h2>Home Composting in 4 Simple Steps</h2>
            <p>Transform kitchen peels into dark, earthy, chemical-free organic fertilizer.</p>
          </div>

          <div className="compost-steps-grid">
            <div className="compost-step-card">
              <div className="compost-step-icon bg-green">
                <Leaf size={24} />
              </div>
              <div className="compost-step-number">01</div>
              <h3>Balance Greens & Browns</h3>
              <p>
                Greens (vegetable peels, tea bags) provide nitrogen.
                Browns (dry leaves, shredded cardboard) provide carbon. Keep a 1:2 ratio.
              </p>
            </div>

            <div className="compost-step-card">
              <div className="compost-step-icon bg-blue">
                <Droplets size={24} />
              </div>
              <div className="compost-step-number">02</div>
              <h3>Maintain Moisture</h3>
              <p>
                Compost should feel like a wrung-out damp sponge.
                If it smells foul, it is too wet (add dry leaves); if dry, sprinkle water.
              </p>
            </div>

            <div className="compost-step-card">
              <div className="compost-step-icon bg-amber">
                <Wind size={24} />
              </div>
              <div className="compost-step-number">03</div>
              <h3>Aerate & Turn Weekly</h3>
              <p>
                Turn the pile with a small garden fork once a week.
                Aerobic microbes need oxygen to break down waste without bad odors.
              </p>
            </div>

            <div className="compost-step-card">
              <div className="compost-step-icon bg-emerald">
                <Sparkles size={24} />
              </div>
              <div className="compost-step-number">04</div>
              <h3>Harvest Black Gold</h3>
              <p>
                In 4 to 6 weeks, your compost transforms into rich, dark, earthy soil.
                Feed it to your houseplants, balcony garden, or neighborhood trees!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="dos-donts-section">
        <div className="awareness-container">
          <div className="dos-donts-grid">
            {/* DO's */}
            <div className="rules-card card-dos">
              <div className="rules-header">
                <CheckCircle2 size={24} className="text-green" />
                <h3>Segregation Do's</h3>
              </div>
              <ul className="rules-list">
                <li>
                  <CheckCircle2 size={16} />
                  <span>Keep two separate dustbins at home: Green (Wet) and Blue (Dry).</span>
                </li>
                <li>
                  <CheckCircle2 size={16} />
                  <span>Rinse milk pouches, sauce bottles, and food plastic before dry disposal.</span>
                </li>
                <li>
                  <CheckCircle2 size={16} />
                  <span>Wrap sanitary and bio-waste securely in old newspaper before red bin.</span>
                </li>
                <li>
                  <CheckCircle2 size={16} />
                  <span>Use reusable cloth bags when shopping to prevent polythene accumulation.</span>
                </li>
                <li>
                  <CheckCircle2 size={16} />
                  <span>Report uncollected public bins on EcoCare to protect local hygiene.</span>
                </li>
              </ul>
            </div>

            {/* DON'Ts */}
            <div className="rules-card card-donts">
              <div className="rules-header">
                <XCircle size={24} className="text-red" />
                <h3>Segregation Don'ts</h3>
              </div>
              <ul className="rules-list">
                <li>
                  <XCircle size={16} />
                  <span>Never throw wet food waste in thin plastic carry bags.</span>
                </li>
                <li>
                  <XCircle size={16} />
                  <span>Never burn leaves, plastic, or road garbage — toxic dioxins pollute air.</span>
                </li>
                <li>
                  <XCircle size={16} />
                  <span>Never dump construction debris, plaster, or concrete in open plots.</span>
                </li>
                <li>
                  <XCircle size={16} />
                  <span>Never mix dead batteries or chemicals with everyday kitchen trash.</span>
                </li>
                <li>
                  <XCircle size={16} />
                  <span>Do not leave garbage outside public bins where stray animals scatter it.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Citizen Green Pledge Banner */}
      <section className="citizen-pledge-section">
        <div className="awareness-container">
          <div className="pledge-card-box">
            <div className="pledge-content">
              <span className="pledge-eyebrow">
                <Heart size={15} /> CITIZEN COMMITMENT
              </span>
              <h2>Take the 100% Home Waste Segregation Pledge</h2>
              <p>
                Commit to segregating your kitchen and dry waste every single day.
                Small household habits build resilient, disease-free, beautiful cities.
              </p>

              <div className="pledge-action-row">
                <button
                  type="button"
                  className={`btn-take-pledge ${pledged ? "already-pledged" : ""}`}
                  onClick={handlePledge}
                >
                  <Sparkles size={18} />
                  <span>{pledged ? "✓ You Took The Green Pledge!" : "Take The Green Pledge"}</span>
                </button>

                <div className="pledge-counter-box">
                  <strong>{pledgeCount.toLocaleString()}</strong>
                  <span>Conscious Citizens Pledged</span>
                </div>
              </div>
            </div>

            <div className="pledge-side-links">
              <Link to="/report-issue" className="pledge-cta-btn">
                <span>Report Waste Dump</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/pickup-request" className="pledge-cta-btn secondary">
                <span>Book Segregated Pickup</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Awareness;