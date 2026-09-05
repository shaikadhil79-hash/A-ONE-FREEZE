import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Snowflake,
  ArrowLeft,
  MapPin,
  Phone,
  Navigation,
  ShieldCheck,
  Clock3,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Play,
  Check,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import serviceStore from "../../services/serviceStore";

function TechnicianService() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [startOtpInput, setStartOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [extraPartName, setExtraPartName] = useState("");
  const [extraPartCost, setExtraPartCost] = useState("");
  const [showAddPart, setShowAddPart] = useState(false);

  useEffect(() => {
    const sync = () => {
      let b = serviceStore.getBookingById(bookingId);
      if (!b) {
        const all = serviceStore.getBookings();
        b = all[0];
      }
      setBooking(b);
    };

    sync();
    return serviceStore.subscribe(sync);
  }, [bookingId]);

  // Elapsed Timer Effect when IN_PROGRESS
  useEffect(() => {
    if (booking?.status !== "IN_PROGRESS" || !booking?.startedAt) return;

    const updateTimer = () => {
      const start = new Date(booking.startedAt).getTime();
      const now = Date.now();
      setElapsedSeconds(Math.max(0, Math.floor((now - start) / 1000)));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [booking?.status, booking?.startedAt]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleStartJourney = () => {
    if (booking) {
      serviceStore.technicianStartJourney(booking.id);
    }
  };

  const handleMarkArrived = () => {
    if (booking) {
      serviceStore.technicianArrive(booking.id);
    }
  };

  const handleVerifyStartOtp = (e) => {
    e.preventDefault();
    setOtpError("");

    if (!startOtpInput.trim() || startOtpInput.length !== 6) {
      setOtpError("Please enter the 6-digit Start OTP provided by the customer.");
      return;
    }

    try {
      const updatedBooking = serviceStore.verifyStartOtp(
        booking.id,
        startOtpInput
      );

      if (updatedBooking?.startedAt) {
        localStorage.setItem(
          "serviceStartedAt",
          updatedBooking.startedAt
        );
      }

      setStartOtpInput("");
    } catch (err) {
      setOtpError(err.message || "Invalid OTP.");
    }
  };

  const handleToggleChecklist = (index, currentDone) => {
    if (booking) {
      serviceStore.updateJobChecklist(booking.id, index, !currentDone);
    }
  };

  const handleAddPart = (e) => {
    e.preventDefault();
    if (!extraPartName || !extraPartCost) return;

    serviceStore.addExtraCharge(booking.id, extraPartName, Number(extraPartCost));
    setExtraPartName("");
    setExtraPartCost("");
    setShowAddPart(false);
  };

  const handleNavigateComplete = () => {
    if (!booking) return;

    const parts = Array.isArray(booking.parts)
      ? booking.parts
      : [];

    const serviceCharge = Number(
      booking.amount ??
      booking.servicePrice ??
      0
    );

    const partsTotal = parts.reduce(
      (sum, part) => sum + Number(part.price || part.amount || 0),
      0
    );

    const finalTotal =
      serviceCharge + partsTotal;

    const serviceData = {
      bookingId: booking.id,
      customerName: booking.customerName || "Customer",
      customerPhone: booking.customerPhone || "",
      serviceName: booking.serviceName || "Service",
      serviceAddress: booking.address || "",
      city: booking.city || "",
      serviceCharge,
      servicePrice: serviceCharge,
      parts,
      partsTotal,
      estimatedTotal: finalTotal,
      duration: elapsedSeconds,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "activeServiceBooking",
      booking.id
    );

    localStorage.setItem(
      "servicePrice",
      String(serviceCharge)
    );

    localStorage.setItem(
      "serviceParts",
      JSON.stringify(parts)
    );

    localStorage.setItem(
      "partsTotal",
      String(partsTotal)
    );

    localStorage.setItem(
      "completedServiceData",
      JSON.stringify(serviceData)
    );

    localStorage.setItem(
      "serviceStatus",
      "READY_FOR_COMPLETION"
    );

    console.log(
      "SERVICE COMPLETION BILL:",
      serviceData
    );

    navigate(
      `/technician/service/${booking.id}/complete`
    );
  };

  if (!booking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        Loading AC service details...
      </div>
    );
  }

  const isAssigned = booking.status === "ASSIGNED";
  const isOnTheWay = booking.status === "ON_THE_WAY";
  const isArrived = booking.status === "ARRIVED";
  const isInProgress = booking.status === "IN_PROGRESS";
  const isCompleted = booking.status === "COMPLETED";

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
      {/* TOP HEADER */}
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
          onClick={() => navigate("/technician/services")}
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
          All AC Services
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Snowflake size={20} color="#10b981" />
          <strong style={{ fontSize: "16px", color: "#0f172a" }}>A-ONE FREEZE TECH</strong>
        </div>

        <span
          style={{
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "800",
            background: isInProgress ? "#e0f2fe" : isCompleted ? "#dcfce7" : "#fef3c7",
            color: isInProgress ? "#0369a1" : isCompleted ? "#15803d" : "#b45309",
          }}
        >
          {booking.status.replace(/_/g, " ")}
        </span>
      </header>

      {/* MAIN CONTENT */}
      <main
        style={{
          maxWidth: "880px",
          margin: "30px auto",
          padding: "0 20px",
        }}
      >
        {/* HERO TITLE */}
        <div
          style={{
            background: "#ffffff",
            padding: "26px",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#10b981", letterSpacing: "1.5px" }}>
                ORDER {booking.id}
              </span>
              <h1 style={{ fontSize: "24px", margin: "4px 0 6px", color: "#0f172a" }}>
                {booking.serviceName}
              </h1>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                AC Unit: <strong>{booking.acBrand} {booking.acType} ({booking.acTonnage})</strong>
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "11px", color: "#64748b", display: "block" }}>
                Total Order Value
              </span>
              <strong style={{ fontSize: "22px", color: "#0f172a" }}>
                ₹{booking.totalAmount || booking.amount}
              </strong>
            </div>
          </div>
        </div>

        {/* CUSTOMER & LOCATION CARD */}
        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            marginBottom: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>
              Customer Details
            </span>
            <h3 style={{ margin: "4px 0 2px", fontSize: "17px", color: "#0f172a" }}>
              {booking.customerName}
            </h3>
            <div style={{ fontSize: "13px", color: "#475569" }}>📞 {booking.customerPhone}</div>
          </div>

          <div>
            <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>
              Service Location
            </span>
            <div style={{ fontSize: "14px", color: "#0f172a", marginTop: "4px" }}>
              📍 {booking.address}, {booking.city} - {booking.pincode}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <a
              href={`tel:${booking.customerPhone}`}
              style={{
                background: "#f0fdf4",
                color: "#16a34a",
                border: "1px solid #bbf7d0",
                padding: "10px 16px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "13px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Phone size={15} />
              Call Customer
            </a>

            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    booking.address + ", " + booking.city
                  )}`,
                  "_blank"
                )
              }
              style={{
                background: "#eff6ff",
                color: "#2563eb",
                border: "1px solid #bfdbfe",
                padding: "10px 16px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Navigation size={15} />
              Directions
            </button>
          </div>
        </div>

        {/* =====================================================
            STAGE ACTION CARDS (DYNAMIC PER STATUS)
        ===================================================== */}

        {/* 1. ASSIGNED -> START JOURNEY */}
        {isAssigned && (
          <div
            style={{
              background: "#ffffff",
              padding: "26px",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>Ready to Travel?</h3>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px" }}>
              Notify customer that you are on your way to their service address.
            </p>
            <button
              onClick={handleStartJourney}
              style={{
                background: "linear-gradient(135deg, #0284c7, #0369a1)",
                color: "#ffffff",
                border: "none",
                padding: "12px 32px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Navigation size={18} />
              Start Journey (On The Way)
            </button>
          </div>
        )}

        {/* 2. ON THE WAY -> MARK ARRIVED */}
        {isOnTheWay && (
          <div
            style={{
              background: "#ffffff",
              padding: "26px",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>Arrived at Doorstep?</h3>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px" }}>
              Confirm your arrival at customer location to ask for the Start OTP.
            </p>
            <button
              onClick={handleMarkArrived}
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#ffffff",
                border: "none",
                padding: "12px 32px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <MapPin size={18} />
              I Have Arrived at Location
            </button>
          </div>
        )}

        {/* 3. ARRIVED -> VERIFY START OTP */}
        {isArrived && (
          <div
            style={{
              background: "linear-gradient(135deg, #ffffff, #f0fdf4)",
              padding: "30px",
              borderRadius: "20px",
              border: "2px solid #86efac",
              boxShadow: "0 10px 30px rgba(16, 185, 129, 0.1)",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#dcfce7",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}
            >
              <ShieldCheck size={28} />
            </div>

            <h2 style={{ fontSize: "20px", margin: "0 0 8px", color: "#0f172a" }}>
              Enter Customer's Start OTP
            </h2>
            <p style={{ color: "#64748b", fontSize: "13px", maxWidth: "460px", margin: "0 auto 20px" }}>
              Ask the customer for the 6-digit Start OTP shown on their screen to begin work.
            </p>

            {otpError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  maxWidth: "400px",
                  margin: "0 auto 16px",
                }}
              >
                {otpError}
              </div>
            )}

            <form
              onSubmit={handleVerifyStartOtp}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                placeholder="6-digit Start OTP"
                maxLength={6}
                value={startOtpInput}
                onChange={(e) => setStartOtpInput(e.target.value.replace(/\D/g, ""))}
                style={{
                  padding: "14px 20px",
                  fontSize: "24px",
                  fontWeight: "800",
                  letterSpacing: "6px",
                  textAlign: "center",
                  borderRadius: "12px",
                  border: "2px solid #cbd5e1",
                  width: "220px",
                  outline: "none",
                  fontFamily: "monospace",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#ffffff",
                  border: "none",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Verify & Start Job
              </button>
            </form>
          </div>
        )}

        {/* 4. IN PROGRESS -> ACTIVE WORKSPACE & CHECKLIST */}
        {isInProgress && (
          <div
            style={{
              background: "#ffffff",
              padding: "28px",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              marginBottom: "24px",
            }}
          >
            {/* TIMER BAR */}
            <div
              style={{
                background: "linear-gradient(135deg, #0284c7, #0369a1)",
                color: "#ffffff",
                borderRadius: "14px",
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "26px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Clock3 size={24} />
                <div>
                  <span style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#bae6fd" }}>
                    SERVICE IN PROGRESS
                  </span>
                  <div style={{ fontSize: "28px", fontWeight: "900", fontFamily: "monospace" }}>
                    {formatTimer(elapsedSeconds)}
                  </div>
                </div>
              </div>

              <button
                onClick={handleNavigateComplete}
                style={{
                  background: "#ffffff",
                  color: "#0369a1",
                  border: "none",
                  padding: "10px 22px",
                  borderRadius: "10px",
                  fontWeight: "800",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Finish & Collect End OTP
                <ArrowRight size={16} />
              </button>
            </div>

            {/* CHECKLIST */}
            <h3 style={{ fontSize: "16px", margin: "0 0 14px", color: "#0f172a" }}>
              Service Inspection & Execution Checklist
            </h3>

            <div style={{ display: "grid", gap: "10px", marginBottom: "26px" }}>
              {(booking.checklist || []).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleToggleChecklist(idx, item.done)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: item.done ? "#bbf7d0" : "#e2e8f0",
                    background: item.done ? "#f0fdf4" : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "6px",
                      border: "2px solid",
                      borderColor: item.done ? "#16a34a" : "#cbd5e1",
                      background: item.done ? "#16a34a" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                    }}
                  >
                    {item.done && <Check size={14} />}
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      color: item.done ? "#15803d" : "#334155",
                      fontWeight: item.done ? "600" : "500",
                    }}
                  >
                    {item.task}
                  </span>
                </div>
              ))}
            </div>

            {/* EXTRA SPARE PARTS / ADD-ON CHARGES */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "14px",
                padding: "18px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div>
                  <strong style={{ fontSize: "14px" }}>Extra Spare Parts & Materials</strong>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Current extra: ₹{booking.extraAmount || 0}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddPart(!showAddPart)}
                  style={{
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Plus size={14} />
                  {showAddPart ? "Cancel" : "Add Part"}
                </button>
              </div>

              {showAddPart && (
                <form
                  onSubmit={handleAddPart}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr auto",
                    gap: "10px",
                    marginTop: "12px",
                  }}
                >
                  <input
                    type="text"
                    required
                    placeholder="e.g. Capacitor 35μF / Copper Pipe (1m)"
                    value={extraPartName}
                    onChange={(e) => setExtraPartName(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                  <input
                    type="number"
                    required
                    placeholder="Cost (₹)"
                    value={extraPartCost}
                    onChange={(e) => setExtraPartCost(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "#16a34a",
                      color: "#fff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Add
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 5. COMPLETED */}
        {isCompleted && (
          <div
            style={{
              background: "#ffffff",
              padding: "30px",
              borderRadius: "20px",
              border: "1px solid #bbf7d0",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#dcfce7",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h2 style={{ fontSize: "22px", margin: "0 0 8px", color: "#0f172a" }}>
              Service Completed Successfully!
            </h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px" }}>
              Payment of <strong>₹{booking.totalAmount || booking.amount}</strong> was recorded via {booking.paymentMethod || "UPI"}.
            </p>

            <button
              onClick={() => navigate("/technician/services")}
              style={{
                background: "#10b981",
                color: "#ffffff",
                border: "none",
                padding: "10px 24px",
                borderRadius: "10px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Return to Jobs
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default TechnicianService;