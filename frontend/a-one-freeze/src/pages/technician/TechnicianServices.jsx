import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wrench,
  MapPin,
  Clock3,
  ArrowRight,
  UserRound,
  CheckCircle2,
  AlertCircle,
  Phone,
  Snowflake,
  ShieldCheck,
  Zap,
} from "lucide-react";
import serviceStore from "../../services/serviceStore";

function TechnicianServices() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all"); // all | available | my_jobs
  const [bookings, setBookings] = useState([]);
  const [techId, setTechId] = useState(
    localStorage.getItem("technicianId") || "TECH-001"
  );
  const [techName, setTechName] = useState(
    localStorage.getItem("technicianName") || "Ravi Kumar"
  );

  useEffect(() => {
    const update = () => {
      setBookings(serviceStore.getBookings());
    };

    update();
    return serviceStore.subscribe(update);
  }, []);

  const handleAcceptJob = (bookingId) => {
    serviceStore.acceptBooking(bookingId, techId);
    navigate(`/technician/service/${bookingId}`);
  };

  const availableRequests = bookings.filter(
    (b) => b.status === "PENDING" || !b.technicianId
  );

  const myAssignedJobs = bookings.filter(
    (b) => b.technicianId === techId && b.status !== "CANCELLED"
  );

  const displayedJobs =
    tab === "available"
      ? availableRequests
      : tab === "my_jobs"
      ? myAssignedJobs
      : bookings;

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return { bg: "#dcfce7", color: "#15803d", text: "Completed" };
      case "IN_PROGRESS":
        return { bg: "#e0f2fe", color: "#0369a1", text: "In Progress" };
      case "ON_THE_WAY":
        return { bg: "#fef3c7", color: "#b45309", text: "On The Way" };
      case "ARRIVED":
        return { bg: "#fef3c7", color: "#b45309", text: "Arrived" };
      case "ASSIGNED":
        return { bg: "#e0e7ff", color: "#4338ca", text: "Assigned" };
      default:
        return { bg: "#fee2e2", color: "#b91c1c", text: "New Request" };
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
          onClick={() => navigate("/technician/dashboard")}
          style={{
            background: "transparent",
            border: "none",
            color: "#10b981",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
          }}
        >
          <ArrowLeft size={18} />
          Technician Dashboard
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Snowflake size={20} color="#10b981" />
          <strong style={{ fontSize: "16px", color: "#0f172a" }}>A-ONE FREEZE</strong>
        </div>

        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
          Technician: <strong style={{ color: "#0f172a" }}>{techName}</strong>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main
        style={{
          maxWidth: "920px",
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
              color: "#10b981",
              textTransform: "uppercase",
            }}
          >
            DISPATCH & JOBS
          </span>
          <h1 style={{ fontSize: "28px", margin: "6px 0 0", color: "#0f172a" }}>
            AC Service Calls
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0 0" }}>
            Accept incoming AC repair and servicing requests or continue active jobs.
          </p>
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
          <button
            onClick={() => setTab("all")}
            style={{
              background: tab === "all" ? "#10b981" : "#ffffff",
              color: tab === "all" ? "#ffffff" : "#64748b",
              border: "1px solid",
              borderColor: tab === "all" ? "#10b981" : "#cbd5e1",
              padding: "7px 18px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            All Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setTab("available")}
            style={{
              background: tab === "available" ? "#10b981" : "#ffffff",
              color: tab === "available" ? "#ffffff" : "#64748b",
              border: "1px solid",
              borderColor: tab === "available" ? "#10b981" : "#cbd5e1",
              padding: "7px 18px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ⚡ Available Requests ({availableRequests.length})
          </button>

          <button
            onClick={() => setTab("my_jobs")}
            style={{
              background: tab === "my_jobs" ? "#10b981" : "#ffffff",
              color: tab === "my_jobs" ? "#ffffff" : "#64748b",
              border: "1px solid",
              borderColor: tab === "my_jobs" ? "#10b981" : "#cbd5e1",
              padding: "7px 18px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            My Assigned Jobs ({myAssignedJobs.length})
          </button>
        </div>

        {/* JOBS LIST */}
        {displayedJobs.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              padding: "48px",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#64748b" }}>No service requests found under this tab.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "18px" }}>
            {displayedJobs.map((b) => {
              const badge = getStatusBadge(b.status);
              const isUnassigned = b.status === "PENDING" || !b.technicianId;
              const isMyJob = b.technicianId === techId;

              return (
                <div
                  key={b.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    border: "1px solid #e2e8f0",
                    padding: "24px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8" }}>
                          {b.id}
                        </span>
                        <span
                          style={{
                            background: badge.bg,
                            color: badge.color,
                            padding: "3px 10px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: "800",
                          }}
                        >
                          {badge.text}
                        </span>
                      </div>

                      <h2 style={{ fontSize: "19px", margin: "0 0 6px", color: "#0f172a" }}>
                        {b.serviceName}
                      </h2>

                      <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                        <strong>AC Unit:</strong> {b.acBrand || "Daikin"} {b.acType || "Split AC"} ({b.acTonnage || "1.5 Ton"})
                      </p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "11px", color: "#64748b", display: "block" }}>
                        Tech Payout (80%)
                      </span>
                      <strong style={{ fontSize: "20px", color: "#16a34a" }}>
                        ₹{Math.round((b.totalAmount || b.amount) * 0.8)}
                      </strong>
                    </div>
                  </div>

                  {/* Customer and Location details */}
                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: "12px",
                      padding: "14px 18px",
                      fontSize: "13px",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <span style={{ color: "#64748b", display: "block", fontSize: "11px" }}>Customer</span>
                      <strong style={{ color: "#0f172a" }}>{b.customerName}</strong>
                      <div style={{ color: "#64748b", fontSize: "12px" }}>📞 {b.customerPhone}</div>
                    </div>

                    <div>
                      <span style={{ color: "#64748b", display: "block", fontSize: "11px" }}>Location</span>
                      <div style={{ color: "#334155" }}>📍 {b.address}</div>
                    </div>

                    <div>
                      <span style={{ color: "#64748b", display: "block", fontSize: "11px" }}>Scheduled</span>
                      <div style={{ color: "#334155" }}>🕒 {b.scheduledDate} ({b.scheduledTime})</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
                    {isUnassigned ? (
                      <button
                        onClick={() => handleAcceptJob(b.id)}
                        style={{
                          background: "linear-gradient(135deg, #10b981, #059669)",
                          color: "#ffffff",
                          border: "none",
                          padding: "10px 22px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                        }}
                      >
                        <Zap size={15} />
                        Accept Job & Dispatch
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/technician/service/${b.id}`)}
                        style={{
                          background: "linear-gradient(135deg, #0284c7, #0369a1)",
                          color: "#ffffff",
                          border: "none",
                          padding: "10px 22px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        Open Service Call
                        <ArrowRight size={15} />
                      </button>
                    )}
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

export default TechnicianServices;