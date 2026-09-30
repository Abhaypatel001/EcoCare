import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Recycle,
  Leaf,
  Send,
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle2,
  Heart,
  ShieldCheck,
  TreePine,
  Sparkles
} from "lucide-react";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer-section">
      {/* Top Banner / Citizen Helpline */}
      <div className="footer-helpline-bar">
        <div className="footer-container helpline-inner">
          <div className="helpline-left">
            <span className="helpline-badge">24/7 Sanitation Support</span>
            <span className="helpline-text">
              Spot an urgent illegal dump or hazardous medical waste?
            </span>
          </div>
          <div className="helpline-right">
            <a href="tel:18003262273" className="helpline-phone-btn">
              <PhoneCall size={16} />
              <span>1800-ECO-CARE (Toll-Free)</span>
            </a>
            <Link to="/report-issue" className="helpline-report-btn">
              <Sparkles size={15} />
              <span>Emergency Report</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-container footer-main-grid">
        {/* Brand & Purpose Column */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon">
              <Recycle size={24} />
            </div>
            <div>
              <span className="footer-logo-title">EcoCare</span>
              <span className="footer-logo-sub">Natural Waste Systems</span>
            </div>
          </Link>

          <p className="footer-brand-desc">
            Empowering citizens and municipal eco-crews to eliminate open dumping,
            boost organic composting, and advance circular waste recovery across our neighborhoods.
          </p>

          <div className="footer-eco-badges">
            <div className="eco-pill">
              <Leaf size={14} />
              <span>Bio-Circular Economy</span>
            </div>
            <div className="eco-pill">
              <TreePine size={14} />
              <span>Zero-Landfill Mission</span>
            </div>
          </div>
        </div>

        {/* Quick Citizen Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Citizen Services</h4>
          <ul className="footer-nav-links">
            <li>
              <Link to="/report-issue">Report Waste Dump</Link>
            </li>
            <li>
              <Link to="/pickup-request">Schedule Home Pickup</Link>
            </li>
            <li>
              <Link to="/complaints">Track My Complaints</Link>
            </li>
            <li>
              <Link to="/dashboard">Citizen Eco Dashboard</Link>
            </li>
            <li>
              <Link to="/awareness">Bin Segregation Guide</Link>
            </li>
          </ul>
        </div>

        {/* Eco Awareness & Composting */}
        <div className="footer-col">
          <h4 className="footer-col-title">Eco & Composting</h4>
          <ul className="footer-nav-links">
            <li>
              <Link to="/awareness#wet-waste">Wet & Kitchen Waste</Link>
            </li>
            <li>
              <Link to="/awareness#composting">Home Composting Guide</Link>
            </li>
            <li>
              <Link to="/awareness#dry-recycling">Plastic & Dry Recycling</Link>
            </li>
            <li>
              <Link to="/awareness#e-waste">E-Waste Safe Disposal</Link>
            </li>
            <li>
              <Link to="/login">Citizen Community Portal</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter & Eco Community */}
        <div className="footer-col newsletter-col">
          <h4 className="footer-col-title">Join the Green Movement</h4>
          <p className="newsletter-desc">
            Get practical home composting tips, recycling guides, and neighborhood cleanup schedules.
          </p>

          <form onSubmit={handleSubscribe} className="footer-subscribe-form">
            <div className="subscribe-input-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" aria-label="Subscribe to newsletter">
                <Send size={16} />
              </button>
            </div>
            {subscribed && (
              <span className="subscribe-success-msg">
                <CheckCircle2 size={14} /> Welcome to the eco community!
              </span>
            )}
          </form>

          <div className="sdg-commitment">
            <span className="sdg-label">Aligned with UN SDG:</span>
            <div className="sdg-tags">
              <span className="sdg-badge">#11 Sustainable Cities</span>
              <span className="sdg-badge">#12 Responsible Consumption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-container bottom-inner">
          <div className="copyright-text">
            © {new Date().getFullYear()} <strong>EcoCare Systems</strong>. Smart Natural Waste Management. All rights reserved.
          </div>
          <div className="footer-bottom-links">
            <span>Clean Environment Guarantee</span>
            <span>•</span>
            <span>Open Municipal Data</span>
            <span>•</span>
            <span className="crafted-with">
              Made with <Heart size={13} className="heart-icon" /> for a greener planet
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;