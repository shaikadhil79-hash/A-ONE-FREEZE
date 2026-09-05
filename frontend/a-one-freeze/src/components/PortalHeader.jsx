import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UserRound,
  Wrench,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import serviceStore from "../services/serviceStore";

function PortalHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeRole, setActiveRole] = useState("customer");
  const [stats, setStats] = useState({ activeBookings: 0, pendingBookings: 0 });

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/admin")) {
      setActiveRole("admin");
    } else if (path.startsWith("/technician")) {
      setActiveRole("technician");
    } else {
      setActiveRole("customer");
    }

    const updateStats = () => {
      setStats(serviceStore.getDashboardStats());
    };

    updateStats();
    return serviceStore.subscribe(updateStats);
  }, [location.pathname]);

  const handleRoleChange = (role) => {
    setActiveRole(role);
    if (role === "customer") {
      localStorage.setItem("customerLoggedIn", "true");
      navigate("/customer");
    } else if (role === "technician") {
      localStorage.setItem("technicianLoggedIn", "true");
      localStorage.setItem("technicianId", "TECH-001");
      localStorage.setItem("technicianName", "Ravi Kumar");
      localStorage.setItem("technicianOnline", "true");
      navigate("/technician/dashboard");
    } else if (role === "admin") {
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminEmail", "admin@aonefreeze.com");
      navigate("/admin");
    }
  };

  const handleResetData = () => {
    if (window.confirm("Reset all AC service bookings and technician data to initial demo state?")) {
      localStorage.removeItem("aone_bookings");
      localStorage.removeItem("aone_technicians");
      localStorage.removeItem("aone_services");
      serviceStore.init();
      serviceStore.notify();
      alert("Demo data reset successfully!");
    }
  };

  return (
    <aside
      aria-label="Platform navigation bar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 9999,
        background: "rgba(10, 25, 41, 0.94)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(49, 198, 235, 0.25)",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#ffffff",
        fontSize: "13px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}
    >
      {/* Brand & Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            fontWeight: "800",
            letterSpacing: "0.5px",
          }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #31c6eb, #087ea4)",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "900",
              color: "#ffffff",
            }}
          >
            A-ONE AC
          </span>
          <span style={{ color: "#e2e8f0" }}>SERVICE PLATFORM</span>
        </div>

        {stats.activeBookings > 0 && (
          <span
            style={{
              background: "rgba(49, 198, 235, 0.15)",
              color: "#31c6eb",
              border: "1px solid rgba(49, 198, 235, 0.3)",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#31c6eb",
                boxShadow: "0 0 8px #31c6eb",
              }}
            />
            {stats.activeBookings} Live Service{stats.activeBookings > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Role Switcher Pills */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.08)",
          padding: "3px",
          borderRadius: "30px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <button
          onClick={() => handleRoleChange("customer")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            transition: "all 0.2s ease",
            background:
              activeRole === "customer"
                ? "linear-gradient(135deg, #31c6eb, #087ea4)"
                : "transparent",
            color: activeRole === "customer" ? "#ffffff" : "#94a3b8",
            boxShadow:
              activeRole === "customer"
                ? "0 2px 10px rgba(49, 198, 235, 0.35)"
                : "none",
          }}
        >
          <UserRound size={14} />
          Customer
        </button>

        <button
          onClick={() => handleRoleChange("technician")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            transition: "all 0.2s ease",
            background:
              activeRole === "technician"
                ? "linear-gradient(135deg, #10b981, #059669)"
                : "transparent",
            color: activeRole === "technician" ? "#ffffff" : "#94a3b8",
            boxShadow:
              activeRole === "technician"
                ? "0 2px 10px rgba(16, 185, 129, 0.35)"
                : "none",
          }}
        >
          <Wrench size={14} />
          Technician
        </button>

        <button
          onClick={() => handleRoleChange("admin")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            transition: "all 0.2s ease",
            background:
              activeRole === "admin"
                ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                : "transparent",
            color: activeRole === "admin" ? "#ffffff" : "#94a3b8",
            boxShadow:
              activeRole === "admin"
                ? "0 2px 10px rgba(139, 92, 246, 0.35)"
                : "none",
          }}
        >
          <ShieldCheck size={14} />
          Admin
        </button>
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={handleResetData}
          title="Reset demo data"
          style={{
            background: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#94a3b8",
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "11px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <RotateCcw size={12} />
          Reset Data
        </button>
      </div>
    </aside>
  );
}

export default PortalHeader;
