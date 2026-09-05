import { useNavigate } from "react-router-dom";
import {
  Snowflake,
  UserRound,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Zap,
  CheckCircle2,
} from "lucide-react";

function RoleSelection() {
  const navigate = useNavigate();

  const handleCustomerDemo = (e) => {
    e.stopPropagation();
    localStorage.setItem("customerLoggedIn", "true");
    localStorage.setItem("customerPhone", "9876543201");
    navigate("/customer");
  };

  const handleTechnicianDemo = (e) => {
    e.stopPropagation();
    localStorage.setItem("technicianLoggedIn", "true");
    localStorage.setItem("technicianId", "TECH-001");
    localStorage.setItem("technicianName", "Ravi Kumar");
    localStorage.setItem("technicianOnline", "true");
    navigate("/technician/dashboard");
  };

  const handleAdminDemo = (e) => {
    e.stopPropagation();
    localStorage.setItem("adminLoggedIn", "true");
    localStorage.setItem("adminEmail", "admin@aonefreeze.com");
    navigate("/admin");
  };

  return (
    <div className="opening-login-page">
      {/* Background effects */}
      <div className="opening-glow opening-glow-one"></div>
      <div className="opening-glow opening-glow-two"></div>

      {/* =====================================================
          TOP BRAND
      ===================================================== */}
      <header className="opening-login-header">
        <div className="opening-brand">
          <div className="opening-brand-icon">
            <Snowflake size={25} />
          </div>
          <div className="opening-brand-name">
            <strong>A-ONE</strong>
            <span>FREEZE</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              padding: "6px 14px",
              background: "#e0f2fe",
              color: "#0369a1",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "700",
              border: "1px solid #bae6fd",
            }}
          >
            Air Conditioner Service Platform
          </span>
          <div className="opening-security">
            <ShieldCheck size={15} />
            Enterprise Secure
          </div>
        </div>
      </header>

      {/* =====================================================
          LOGIN CONTENT
      ===================================================== */}
      <main
        className="opening-login-main"
        style={{ width: "min(1150px, 94%)", padding: "40px 0 30px" }}
      >
        <div className="opening-welcome">
          <Sparkles size={14} />
          <span>WELCOME TO A-ONE FREEZE AC PORTALS</span>
        </div>

        <h1>
          AC Service & <span>Management Hub</span>
        </h1>

        <p className="opening-description">
          Select your portal to continue. Experience end-to-end Air Conditioner service booking,
          live technician tracking with dual-OTP security, job execution, and complete administrative control.
        </p>

        {/* =================================================
            3 ROLE CARDS: CUSTOMER, TECHNICIAN, ADMIN
        ================================================= */}
        <div
          style={{
            width: "100%",
            marginTop: "35px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {/* 1. CUSTOMER PORTAL */}
          <div
            className="opening-login-card opening-customer-card"
            style={{
              cursor: "pointer",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              position: "relative",
            }}
            onClick={() => navigate("/customer")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div className="opening-card-icon">
                <UserRound size={26} />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "#e0f2fe",
                  color: "#0284c7",
                }}
              >
                CUSTOMER
              </span>
            </div>

            <div className="opening-card-content" style={{ marginTop: "20px" }}>
              <h2 style={{ fontSize: "22px", margin: "0 0 8px", color: "#0f172a" }}>
                Customer Portal
              </h2>
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6 }}>
                Book AC jet wash, gas refilling, repairs and installation. Track assigned technician
                in real time with secure Start & End OTPs.
              </p>
            </div>

            <div style={{ marginTop: "auto", width: "100%", paddingTop: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "14px",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  onClick={handleCustomerDemo}
                  style={{
                    background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Zap size={13} />
                  Open Customer App
                </button>
                <div className="opening-card-arrow">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* 2. TECHNICIAN PORTAL */}
          <div
            className="opening-login-card opening-technician-card"
            style={{
              cursor: "pointer",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              position: "relative",
            }}
            onClick={() => navigate("/technician/dashboard")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                className="opening-card-icon"
                style={{ background: "#ecfdf5", color: "#10b981" }}
              >
                <Wrench size={26} />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "#dcfce7",
                  color: "#16a34a",
                }}
              >
                TECHNICIAN
              </span>
            </div>

            <div className="opening-card-content" style={{ marginTop: "20px" }}>
              <h2 style={{ fontSize: "22px", margin: "0 0 8px", color: "#0f172a" }}>
                Technician Portal
              </h2>
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6 }}>
                Toggle online duty, accept AC service calls, verify customer Start OTP, record checklist
                and extra parts, and track daily payout earnings.
              </p>
            </div>

            <div style={{ marginTop: "auto", width: "100%", paddingTop: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "14px",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  onClick={handleTechnicianDemo}
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Zap size={13} />
                  Open Tech Workspace
                </button>
                <div className="opening-card-arrow">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* 3. ADMIN PORTAL */}
          <div
            className="opening-login-card"
            style={{
              cursor: "pointer",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              position: "relative",
              border: "1px solid rgba(139, 92, 246, 0.25)",
            }}
            onClick={() => navigate("/admin")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                className="opening-card-icon"
                style={{ background: "#f5f3ff", color: "#8b5cf6" }}
              >
                <ShieldAlert size={26} />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "#ede9fe",
                  color: "#7c3aed",
                }}
              >
                ADMIN
              </span>
            </div>

            <div className="opening-card-content" style={{ marginTop: "20px" }}>
              <h2 style={{ fontSize: "22px", margin: "0 0 8px", color: "#0f172a" }}>
                Admin Operations
              </h2>
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6 }}>
                Live KPI metrics, manual/auto technician dispatch for AC bookings, technician KYC
                verification, AC catalog pricing, and payments audit.
              </p>
            </div>

            <div style={{ marginTop: "auto", width: "100%", paddingTop: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "14px",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  onClick={handleAdminDemo}
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Zap size={13} />
                  Open Admin Dashboard
                </button>
                <div className="opening-card-arrow">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div
          style={{
            marginTop: "35px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            width: "100%",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CheckCircle2 size={20} color="#0284c7" />
            <div>
              <strong style={{ fontSize: "13px", display: "block" }}>
                Dual-OTP Security
              </strong>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Start & End OTP verification
              </span>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CheckCircle2 size={20} color="#10b981" />
            <div>
              <strong style={{ fontSize: "13px", display: "block" }}>
                Live Cross-Portal Sync
              </strong>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Immediate status updates
              </span>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CheckCircle2 size={20} color="#8b5cf6" />
            <div>
              <strong style={{ fontSize: "13px", display: "block" }}>
                Specialized AC Packages
              </strong>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Jet wash, gas refill & repair
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="opening-login-footer" style={{ marginTop: "30px" }}>
          <ShieldCheck size={14} />
          <span>
            A-ONE FREEZE Enterprise Architecture — 100% synchronized across Customer, Technician & Admin.
          </span>
        </div>
      </main>
    </div>
  );
}

export default RoleSelection;