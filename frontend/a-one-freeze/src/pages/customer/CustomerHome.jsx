import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Snowflake,
  ArrowRight,
  ShieldCheck,
  Clock3,
  MapPin,
  Star,
  Wrench,
  CheckCircle2,
  Phone,
  Zap,
  Tag,
  Calendar,
  AlertCircle,
} from "lucide-react";
import serviceStore from "../../services/serviceStore";
import "./CustomerHome.css";

function CustomerHome() {
  const navigate = useNavigate();
  const [activeBooking, setActiveBooking] = useState(null);
  const [acServices, setAcServices] = useState([]);

  useEffect(() => {
    const updateData = () => {
      const bookings = serviceStore.getBookings();
      const active = bookings.find((b) =>
        ["PENDING", "ASSIGNED", "ON_THE_WAY", "ARRIVED", "IN_PROGRESS"].includes(b.status)
      );
      setActiveBooking(active || null);
      setAcServices(serviceStore.getServices().slice(0, 4));
    };

    updateData();
    return serviceStore.subscribe(updateData);
  }, []);

  const goToServices = () => {
    navigate("/customer/services/air-conditioner");
  };

  const goToBookService = () => {
    navigate("/customer/services/air-conditioner");
  };

  const goToBookings = () => {
    navigate("/customer/bookings");
  };

  const handleBookSpecificService = (service) => {
    navigate("/customer/booking", {
      state: {
        service: service.name,
        serviceId: service.id,
        appliance: "Air Conditioner",
        price: service.price,
        amount: service.price,
      },
    });
  };

  return (
    <div className="customer-home">
      {/* =================================================
          NAVBAR
      ================================================= */}
      <header className="customer-navbar">
        <div className="customer-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="customer-logo-icon">
            <Snowflake size={28} />
          </div>
          <div className="customer-logo-text">
            <strong>A-ONE FREEZE</strong>
            <span style={{ fontSize: "10px", color: "#0284c7", fontWeight: "700" }}>
              AC SERVICE SPECIALIST
            </span>
          </div>
        </div>

        <nav className="customer-nav-links">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="customer-nav-active">
            Home
          </button>
          <button onClick={goToServices}>AC Services</button>
          <button onClick={goToBookings}>My Bookings</button>
        </nav>
      </header>

      {/* =================================================
          ACTIVE SERVICE ALERT BANNER (If any active)
      ================================================= */}
      {activeBooking && (
        <section
          style={{
            background: "linear-gradient(100deg, #0284c7, #0369a1)",
            color: "#ffffff",
            padding: "16px 6%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px",
            boxShadow: "0 6px 20px rgba(2, 132, 199, 0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Wrench size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <strong style={{ fontSize: "15px" }}>Active AC Service: {activeBooking.serviceName}</strong>
                <span
                  style={{
                    background: "#22c55e",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "800",
                    padding: "2px 8px",
                    borderRadius: "10px",
                  }}
                >
                  {activeBooking.status.replace(/_/g, " ")}
                </span>
              </div>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#e0f2fe" }}>
                Booking ID: <strong>{activeBooking.id}</strong> | Technician:{" "}
                <strong>{activeBooking.technicianName || "Dispatching..."}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {["PENDING", "ASSIGNED", "ON_THE_WAY", "ARRIVED"].includes(activeBooking.status) && (
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.2)",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1px dashed rgba(255, 255, 255, 0.4)",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "10px", textTransform: "uppercase", display: "block", color: "#bae6fd" }}>
                  Your Start OTP
                </span>
                <strong style={{ fontSize: "18px", letterSpacing: "2px", color: "#fef08a" }}>
                  {activeBooking.startOtp}
                </strong>
              </div>
            )}

            <button
              onClick={() => navigate("/customer/track-service", { state: activeBooking })}
              style={{
                background: "#ffffff",
                color: "#0369a1",
                border: "none",
                padding: "10px 18px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              Track Live Service
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* =================================================
          HERO SECTION
      ================================================= */}
      <section className="customer-hero">
        <div className="customer-hero-content">
          <span className="customer-hero-label">
            <Snowflake size={14} style={{ marginRight: "4px", verticalAlign: "middle" }} />
            PREMIUM AIR CONDITIONER SERVICE
          </span>

          <h1>
            Beat the heat with
            <br />
            expert AC repair & care.
          </h1>

          <p>
            Certified AC technicians at your doorstep in 60 minutes. From high-pressure jet foam washes
            to exact refrigerant refills and precision split AC installation.
          </p>

          {/* HERO BUTTONS */}
          <div className="customer-hero-actions">
            <button className="customer-primary-button" onClick={goToBookService}>
              Book AC Service
              <ArrowRight size={18} />
            </button>

            <button className="customer-secondary-button" onClick={goToServices}>
              View All AC Packages
            </button>
          </div>

          {/* TRUST INFORMATION */}
          <div className="customer-hero-trust">
            <div>
              <CheckCircle2 size={17} />
              <span>Verified AC Engineers</span>
            </div>
            <div>
              <ShieldCheck size={17} />
              <span>Dual-OTP Verified</span>
            </div>
            <div>
              <Star size={17} />
              <span>30-Day Cooling Warranty</span>
            </div>
          </div>
        </div>

        {/* HERO SIDE CARD */}
        <div className="customer-hero-card">
          <div className="customer-hero-card-icon">
            <Snowflake size={32} />
          </div>

          <span style={{ color: "#0284c7", fontWeight: "800", fontSize: "12px", letterSpacing: "1px" }}>
            SUMMER COOLING SALE
          </span>

          <h2>
            AC Jet Foam Clean
            <br />
            Starting at ₹699
          </h2>

          <p>
            2x deeper cleaning with our high-pressure jet pump & antibacterial foam. Restores ice-cold
            airflow and cuts electricity consumption by up to 25%.
          </p>

          <button onClick={() => navigate("/customer/services/air-conditioner")}>
            Get Started
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* =================================================
          POPULAR AIR CONDITIONER PACKAGES
      ================================================= */}
      <section style={{ padding: "60px 7%", background: "#ffffff" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "800",
              letterSpacing: "2px",
              color: "#0284c7",
              textTransform: "uppercase",
            }}
          >
            POPULAR PACKAGES
          </span>
          <h2 style={{ fontSize: "34px", color: "#0f172a", margin: "8px 0" }}>
            Tailored Air Conditioner Services
          </h2>
          <p style={{ color: "#64748b", maxWidth: "600px", margin: "0 auto", fontSize: "15px" }}>
            Transparent pricing, 100% genuine spare parts, and certified technician warranty.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {acServices.map((service) => (
            <div
              key={service.id}
              style={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                padding: "24px",
                background: "#ffffff",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              {service.popular && (
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    background: "#0284c7",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "800",
                    padding: "4px 10px",
                    borderRadius: "20px",
                  }}
                >
                  MOST POPULAR
                </span>
              )}

              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "#e0f2fe",
                  color: "#0284c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Snowflake size={24} />
              </div>

              <h3 style={{ fontSize: "18px", color: "#0f172a", margin: "0 0 8px" }}>
                {service.name}
              </h3>

              <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px", lineHeight: 1.6 }}>
                {service.description}
              </p>

              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "auto" }}>
                <span style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a" }}>
                  ₹{service.price}
                </span>
                {service.originalPrice && (
                  <span style={{ fontSize: "15px", color: "#94a3b8", textDecoration: "line-through" }}>
                    ₹{service.originalPrice}
                  </span>
                )}
                <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "700" }}>
                  {service.duration}
                </span>
              </div>

              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "14px",
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "12px", color: "#0284c7", fontWeight: "600" }}>
                  🛡️ {service.warranty}
                </span>
                <button
                  onClick={() => handleBookSpecificService(service)}
                  style={{
                    background: "linear-gradient(135deg, #0284c7, #0369a1)",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================
          QUICK FEATURES
      ================================================= */}
      <section className="customer-features">
        <div className="customer-feature-card">
          <div className="customer-feature-icon">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3>Certified AC Experts</h3>
            <p>Background checked and trained on all major brands (Daikin, Voltas, LG, Blue Star).</p>
          </div>
        </div>

        <div className="customer-feature-card">
          <div className="customer-feature-icon">
            <Clock3 size={22} />
          </div>
          <div>
            <h3>On-Time Arrival</h3>
            <p>Guaranteed 60-minute dispatch or schedule at your convenience.</p>
          </div>
        </div>

        <div className="customer-feature-card">
          <div className="customer-feature-icon">
            <MapPin size={22} />
          </div>
          <div>
            <h3>Doorstep Service</h3>
            <p>Hassle-free AC servicing right inside your living room or office.</p>
          </div>
        </div>
      </section>

      {/* =================================================
          HOW IT WORKS (PROCESS)
      ================================================= */}
      <section className="customer-about-section">
        <div className="customer-about-content">
          <span className="customer-section-label">HOW IT WORKS</span>
          <h2>Seamless booking to completion.</h2>
          <p>
            Experience peace of mind with our secure 4-step verified AC service workflow:
          </p>

          <div className="customer-about-points">
            <div>
              <CheckCircle2 size={18} />
              <span>Select your AC type & problem</span>
            </div>
            <div>
              <CheckCircle2 size={18} />
              <span>Instant technician assignment & live tracking</span>
            </div>
            <div>
              <CheckCircle2 size={18} />
              <span>Give Start OTP to begin service</span>
            </div>
            <div>
              <CheckCircle2 size={18} />
              <span>Inspect work & release End OTP to complete</span>
            </div>
          </div>
        </div>

        <div className="customer-process-card">
          <div className="customer-process-step">
            <div>01</div>
            <span>Select AC Service</span>
          </div>
          <div className="customer-process-line"></div>
          <div className="customer-process-step">
            <div>02</div>
            <span>Technician Assigned</span>
          </div>
          <div className="customer-process-line"></div>
          <div className="customer-process-step">
            <div>03</div>
            <span>Start OTP Verification</span>
          </div>
          <div className="customer-process-line"></div>
          <div className="customer-process-step">
            <div>04</div>
            <span>End OTP & Invoice</span>
          </div>
        </div>
      </section>

      {/* =================================================
          FINAL CTA
      ================================================= */}
      <section className="customer-final-cta">
        <div>
          <span>READY FOR POWERFUL COOLING?</span>
          <h2>Book your AC service today.</h2>
          <p>Get ₹100 instant discount on your first AC jet foam wash or repair booking.</p>
        </div>

        <button onClick={goToBookService}>
          Book a Service
          <ArrowRight size={18} />
        </button>
      </section>

      {/* =================================================
          FOOTER
      ================================================= */}
      <footer className="customer-footer">
        <div className="customer-footer-brand">
          <div className="customer-logo-icon">
            <Snowflake size={20} />
          </div>
          <div>
            <strong>A-ONE FREEZE</strong>
            <span>Air Conditioner Service & Repair Platform</span>
          </div>
        </div>

        <p>© 2026 A-ONE Freeze. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default CustomerHome;