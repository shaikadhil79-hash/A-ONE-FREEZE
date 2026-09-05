import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Snowflake,
  CalendarDays,
  Clock3,
  MapPin,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Star,
  Plus,
} from "lucide-react";
import serviceStore from "../../services/serviceStore";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // all | active | completed

  useEffect(() => {
    const update = () => {
      const phone = localStorage.getItem("customerPhone");
      const list = serviceStore.getBookings();
      setBookings(list);
    };

    update();
    return serviceStore.subscribe(update);
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "active") {
      return ["PENDING", "ASSIGNED", "ON_THE_WAY", "ARRIVED", "IN_PROGRESS"].includes(b.status);
    }
    if (activeTab === "completed") {
      return b.status === "COMPLETED";
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return { bg: "#dcfce7", color: "#15803d", text: "Completed" };
      case "IN_PROGRESS":
        return { bg: "#e0f2fe", color: "#0369a1", text: "In Progress" };
      case "ON_THE_WAY":
        return { bg: "#fef3c7", color: "#b45309", text: "On The Way" };
      case "ARRIVED":
        return { bg: "#fef3c7", color: "#b45309", text: "Arrived at Location" };
      case "ASSIGNED":
        return { bg: "#e0e7ff", color: "#4338ca", text: "Technician Assigned" };
      default:
        return { bg: "#f1f5f9", color: "#475569", text: "Pending Dispatch" };
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        color: "#0f172a",
        paddingBottom: "80px",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 6%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => navigate("/customer")}
          style={{
            background: "transparent",
            border: "none",
            color: "#0284c7",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
          }}
        >
          <ArrowLeft size={18} />
          Customer Home
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Snowflake size={20} color="#0284c7" />
          <strong style={{ fontSize: "16px", color: "#0f172a" }}>A-ONE FREEZE</strong>
        </div>

        <button
          onClick={() => navigate("/customer/services/air-conditioner")}
          style={{
            background: "linear-gradient(135deg, #0284c7, #0369a1)",
            color: "#ffffff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Plus size={15} />
          Book AC Service
        </button>
      </header>

      {/* CONTAINER */}
      <main
        style={{
          maxWidth: "880px",
          margin: "35px auto",
          padding: "0 20px",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "800",
              letterSpacing: "1.5px",
              color: "#0284c7",
              textTransform: "uppercase",
            }}
          >
            SERVICE HISTORY
          </span>
          <h1 style={{ fontSize: "28px", margin: "6px 0 0", color: "#0f172a" }}>
            My AC Bookings
          </h1>
        </div>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "12px",
            marginBottom: "24px",
          }}
        >
          {["all", "active", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? "#0284c7" : "#ffffff",
                color: activeTab === tab ? "#ffffff" : "#64748b",
                border: "1px solid",
                borderColor: activeTab === tab ? "#0284c7" : "#cbd5e1",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {tab === "all" ? "All Bookings" : tab === "active" ? "Active (Live)" : "Completed"}
            </button>
          ))}
        </div>

        {/* BOOKINGS LIST */}
        {filteredBookings.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              padding: "48px",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#64748b", margin: "0 0 16px" }}>No bookings found under this filter.</p>
            <button
              onClick={() => navigate("/customer/services/air-conditioner")}
              style={{
                background: "#0284c7",
                color: "#ffffff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Book an AC Service
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "18px" }}>
            {filteredBookings.map((b) => {
              const badge = getStatusBadge(b.status);
              const isActive = ["PENDING", "ASSIGNED", "ON_THE_WAY", "ARRIVED", "IN_PROGRESS"].includes(b.status);

              return (
                <div
                  key={b.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    border: "1px solid #e2e8f0",
                    padding: "22px 26px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8" }}>
                        {b.id} • {b.scheduledDate} ({b.scheduledTime})
                      </span>
                      <h3 style={{ fontSize: "18px", margin: "2px 0 0", color: "#0f172a" }}>
                        {b.serviceName}
                      </h3>
                      <span style={{ fontSize: "13px", color: "#64748b" }}>
                        Unit: {b.acBrand} {b.acType} ({b.acTonnage})
                      </span>
                    </div>

                    <span
                      style={{
                        background: badge.bg,
                        color: badge.color,
                        padding: "5px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "800",
                      }}
                    >
                      {badge.text}
                    </span>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <span style={{ color: "#64748b" }}>Technician: </span>
                      <strong style={{ color: "#0f172a" }}>{b.technicianName || "Dispatching..."}</strong>
                      {b.technicianRating && <span> (★ {b.technicianRating})</span>}
                    </div>

                    {isActive && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "#0369a1", fontSize: "12px", fontWeight: "700" }}>Start OTP:</span>
                        <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: "6px", fontFamily: "monospace", fontWeight: "900" }}>
                          {b.startOtp}
                        </span>
                      </div>
                    )}

                    <div>
                      <span style={{ color: "#64748b" }}>Total: </span>
                      <strong style={{ color: "#16a34a", fontSize: "15px" }}>₹{b.totalAmount || b.amount}</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button
                      onClick={() => navigate("/customer/track-service", { state: b })}
                      style={{
                        background: isActive ? "linear-gradient(135deg, #0284c7, #0369a1)" : "#f1f5f9",
                        color: isActive ? "#ffffff" : "#334155",
                        border: "none",
                        padding: "8px 18px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {isActive ? "Track Live Service" : "View Service Receipt"}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyBookings;