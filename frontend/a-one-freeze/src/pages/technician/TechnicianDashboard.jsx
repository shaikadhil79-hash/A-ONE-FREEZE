import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  Wallet,
  BriefcaseBusiness,
  CheckCircle2,
  Wrench,
  UserRound,
  CircleHelp,
  LogOut,
  Snowflake,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import serviceStore from "../../services/serviceStore";
import "./TechnicianDashboard.css";

function TechnicianDashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(
    localStorage.getItem("technicianOnline") !== "false"
  );
  const [techId, setTechId] = useState(
    localStorage.getItem("technicianId") || "TECH-001"
  );
  const [techData, setTechData] = useState(null);
  const [activeJob, setActiveJob] = useState(null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      const tech = serviceStore.getTechnicianById(techId) || serviceStore.getTechnicians()[0];
      setTechData(tech);

      const all = serviceStore.getBookings();
      const myJobs = all.filter((b) => b.technicianId === tech.id);
      const active = myJobs.find((b) =>
        ["ASSIGNED", "ON_THE_WAY", "ARRIVED", "IN_PROGRESS"].includes(b.status)
      );
      setActiveJob(active || null);

      const available = all.filter((b) => b.status === "PENDING" || !b.technicianId);
      setAvailableJobs(available);

      setAcceptedCount(myJobs.filter((b) => b.status !== "CANCELLED" && b.status !== "COMPLETED").length);
      setCompletedCount(myJobs.filter((b) => b.status === "COMPLETED").length);
    };

    sync();
    return serviceStore.subscribe(sync);
  }, [techId]);

  const handleToggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    serviceStore.toggleTechnicianDuty(techId, next);
  };

  const handleLogout = () => {
    localStorage.removeItem("technicianLoggedIn");
    navigate("/technician/login");
  };

  const goToJobs = () => {
    navigate("/technician/services");
  };

  return (
    <div className="technician-dashboard">
      {/* SIDEBAR OVERLAY */}
      {menuOpen && (
        <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={menuOpen ? "technician-sidebar open" : "technician-sidebar"}>
        <div className="sidebar-brand">
          <div className="brand-badge">
            <Snowflake size={24} />
          </div>
          <div className="brand-text">
            <strong>A-ONE FREEZE</strong>
            <span>TECHNICIAN HUB</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="active" onClick={() => { setMenuOpen(false); navigate("/technician/dashboard"); }}>
            <Wrench size={20} />
            Dashboard
          </button>
          <button onClick={() => { setMenuOpen(false); navigate("/technician/services"); }}>
            <BriefcaseBusiness size={20} />
            AC Service Calls
          </button>
          <button onClick={() => { setMenuOpen(false); navigate("/technician/earnings"); }}>
            <Wallet size={20} />
            My Earnings
          </button>
          <button onClick={() => { setMenuOpen(false); navigate("/technician/ratings"); }}>
            <Star size={20} />
            My Ratings
          </button>
          <button onClick={() => { setMenuOpen(false); navigate("/technician/profile"); }}>
            <UserRound size={20} />
            My Profile
          </button>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {/* TOP BAR */}
        <header className="dashboard-topbar">
          <button className="top-menu-button" onClick={() => setMenuOpen(true)}>
            <Menu size={24} />
          </button>

          {/* ONLINE TOGGLE */}
          <div
            onClick={handleToggleOnline}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: isOnline ? "#ecfdf5" : "#f1f5f9",
              border: "1px solid",
              borderColor: isOnline ? "#a7f3d0" : "#cbd5e1",
              padding: "6px 16px",
              borderRadius: "20px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: isOnline ? "#10b981" : "#94a3b8",
                boxShadow: isOnline ? "0 0 8px #10b981" : "none",
              }}
            />
            <span style={{ fontSize: "13px", fontWeight: "700", color: isOnline ? "#065f46" : "#64748b" }}>
              {isOnline ? "On Duty (Online)" : "Off Duty (Offline)"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
              {techData?.name || "Ravi Kumar"}
            </span>
          </div>
        </header>

        {/* WELCOME */}
        <section className="dashboard-welcome" style={{ padding: "20px 0 10px" }}>
          <span>TECHNICIAN FIELD WORKSPACE</span>
          <h1>Welcome, {techData?.name || "Ravi Kumar"}</h1>
          <p>
            {isOnline
              ? "You are online. New AC service calls in Chennai will be dispatched to your phone."
              : "You are currently off duty. Click the toggle above to go online and receive jobs."}
          </p>
        </section>

        {/* ACTIVE JOB BANNER (IF ANY) */}
        {activeJob && (
          <section
            style={{
              background: "linear-gradient(135deg, #0284c7, #0369a1)",
              color: "#ffffff",
              borderRadius: "18px",
              padding: "22px 26px",
              marginBottom: "24px",
              boxShadow: "0 10px 25px rgba(2, 132, 199, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ background: "#fef08a", color: "#854d0e", padding: "2px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: "800" }}>
                  ACTIVE JOB: {activeJob.status.replace(/_/g, " ")}
                </span>
                <span style={{ fontSize: "12px", color: "#e0f2fe" }}>Order #{activeJob.id}</span>
              </div>
              <h2 style={{ fontSize: "20px", margin: "4px 0", color: "#ffffff" }}>
                {activeJob.serviceName}
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#bae6fd" }}>
                Customer: <strong>{activeJob.customerName}</strong> • {activeJob.address}
              </p>
            </div>

            <button
              onClick={() => navigate(`/technician/service/${activeJob.id}`)}
              style={{
                background: "#ffffff",
                color: "#0369a1",
                border: "none",
                padding: "12px 24px",
                borderRadius: "10px",
                fontWeight: "800",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Resume Job & Enter OTP
              <ArrowRight size={16} />
            </button>
          </section>
        )}

        {/* METRICS ROW */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "30px",
          }}
        >
          <div style={metricCard}>
            <div style={{ ...metricIcon, background: "#ecfdf5", color: "#10b981" }}>
              <Wallet size={24} />
            </div>
            <div>
              <span style={metricLabel}>Today's Earnings</span>
              <strong style={metricVal}>₹{techData?.earningsToday || 1840}</strong>
            </div>
          </div>

          <div style={metricCard}>
            <div style={{ ...metricIcon, background: "#eff6ff", color: "#3b82f6" }}>
              <BriefcaseBusiness size={24} />
            </div>
            <div>
              <span style={metricLabel}>Active Jobs</span>
              <strong style={metricVal}>{acceptedCount}</strong>
            </div>
          </div>

          <div style={metricCard}>
            <div style={{ ...metricIcon, background: "#f0fdf4", color: "#16a34a" }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <span style={metricLabel}>Completed Today</span>
              <strong style={metricVal}>{completedCount}</strong>
            </div>
          </div>

          <div style={metricCard}>
            <div style={{ ...metricIcon, background: "#fefce8", color: "#ca8a04" }}>
              <Star size={24} />
            </div>
            <div>
              <span style={metricLabel}>Customer Rating</span>
              <strong style={metricVal}>★ {techData?.rating || 4.9}</strong>
            </div>
          </div>
        </section>

        {/* WORK SHORTCUTS */}
        <section style={{ marginBottom: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", color: "#0f172a", margin: 0 }}>Quick Actions</h2>
            <button
              onClick={goToJobs}
              style={{
                background: "transparent",
                border: "none",
                color: "#10b981",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View All Jobs ({availableJobs.length + acceptedCount})
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <div
              onClick={goToJobs}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                transition: "transform 0.15s ease",
              }}
            >
              <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: "15px", display: "block" }}>Available AC Service Calls</strong>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  {availableJobs.length} new requests ready to accept
                </span>
              </div>
              <ArrowRight size={18} color="#94a3b8" />
            </div>

            <div
              onClick={() => navigate("/technician/earnings")}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "#fef3c7", color: "#b45309", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Wallet size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: "15px", display: "block" }}>Payouts & Earnings</strong>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  Total: ₹{techData?.totalEarnings || 48920}
                </span>
              </div>
              <ArrowRight size={18} color="#94a3b8" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const metricCard = {
  background: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  padding: "18px 20px",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
};

const metricIcon = {
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const metricLabel = {
  display: "block",
  fontSize: "11px",
  fontWeight: "700",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const metricVal = {
  fontSize: "22px",
  fontWeight: "800",
  color: "#0f172a",
};

export default TechnicianDashboard;