import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Snowflake,
  ShieldCheck,
  MapPin,
  Phone,
  Star,
  Check,
  Navigation,
  Clock3,
  Wrench,
  AlertCircle,
  Copy,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import serviceStore from "../../services/serviceStore";

function TrackService() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingIdFromState = location.state?.id || location.state?.bookingId;
  const [booking, setBooking] = useState(null);
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const syncBooking = () => {
      let b = null;
      if (bookingIdFromState) {
        b = serviceStore.getBookingById(bookingIdFromState);
      }
      if (!b) {
        const activeId = localStorage.getItem("activeBookingId");
        if (activeId) b = serviceStore.getBookingById(activeId);
      }
      if (!b) {
        const all = serviceStore.getBookings();
        b = all[0] || null;
      }
      setBooking(b);
    };

    syncBooking();
    return serviceStore.subscribe(syncBooking);
  }, [bookingIdFromState]);

  const handleCopyOtp = (otp) => {
    if (otp) {
      navigator.clipboard?.writeText(otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (booking?.id) {
      serviceStore.submitReview(booking.id, {
        rating,
        comment: comment || "Great cooling service, technician was very professional!",
        customerName: booking.customerName,
      });
      setReviewSubmitted(true);
    }
  };

  if (!booking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px", fontFamily: "sans-serif" }}>
        <h2>No Active AC Booking Found</h2>
        <button onClick={() => navigate("/customer")} style={{ background: "#0284c7", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
          Go to Home
        </button>
      </div>
    );
  }

  // Determine stage progression
  const statusLevels = {
    PENDING: 1,
    ASSIGNED: 2,
    ON_THE_WAY: 3,
    ARRIVED: 4,
    IN_PROGRESS: 5,
    COMPLETED: 6,
    CANCELLED: 0,
  };

  const currentLevel = statusLevels[booking.status] || 1;

  const steps = [
    {
      title: "Booking Confirmed",
      desc: "Service order received & dispatched.",
      level: 1,
    },
    {
      title: "Technician Assigned",
      desc: `${booking.technicianName || "AC Specialist"} has accepted your call.`,
      level: 2,
    },
    {
      title: "Technician On The Way",
      desc: "Travelling with jet pump, tools & refrigerant kit.",
      level: 3,
    },
    {
      title: "Technician Arrived",
      desc: "Arrived at your address. Provide Start OTP.",
      level: 4,
    },
    {
      title: "Service In Progress",
      desc: "Inspection, jet foam wash & cooling performance test.",
      level: 5,
    },
    {
      title: "Service Completed",
      desc: "AC verified cooling cold. Released End OTP.",
      level: 6,
    },
  ];

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
      {/* NAVBAR */}
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
          onClick={() => navigate("/customer/bookings")}
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
          My Bookings
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Snowflake size={20} color="#0284c7" />
          <strong style={{ fontSize: "16px", color: "#0f172a" }}>A-ONE FREEZE</strong>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#16a34a", fontWeight: "700" }}>
          <ShieldCheck size={16} />
          Live Tracking
        </div>
      </header>

      {/* TRACKING CONTAINER */}
      <main
        style={{
          maxWidth: "880px",
          margin: "30px auto",
          padding: "0 20px",
        }}
      >
        {/* HEADER CARD */}
        <div
          style={{
            background: "#ffffff",
            padding: "24px 30px",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#0284c7", letterSpacing: "1.5px" }}>
              LIVE STATUS
            </span>
            <h1 style={{ fontSize: "24px", margin: "4px 0 6px", color: "#0f172a" }}>
              {booking.serviceName}
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
              ID: <strong>{booking.id}</strong> | {booking.acBrand} {booking.acType} ({booking.acTonnage})
            </p>
          </div>

          <span
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "800",
              background:
                booking.status === "COMPLETED"
                  ? "#dcfce7"
                  : booking.status === "IN_PROGRESS"
                  ? "#e0f2fe"
                  : "#fef3c7",
              color:
                booking.status === "COMPLETED"
                  ? "#15803d"
                  : booking.status === "IN_PROGRESS"
                  ? "#0369a1"
                  : "#b45309",
            }}
          >
            {booking.status.replace(/_/g, " ")}
          </span>
        </div>

        {/* =====================================================
            DUAL-OTP BANNER (CRITICAL SECURITY)
        ===================================================== */}
        <div
          style={{
            background:
              booking.status === "COMPLETED"
                ? "linear-gradient(135deg, #10b981, #059669)"
                : "linear-gradient(135deg, #0284c7, #0369a1)",
            color: "#ffffff",
            padding: "24px",
            borderRadius: "20px",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(2, 132, 199, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {/* Start OTP info */}
          <div>
            <span style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#e0f2fe", fontWeight: "700" }}>
              {currentLevel < 5 ? "⚠️ SHARE UPON TECHNICIAN ARRIVAL" : "✓ START OTP VERIFIED"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px" }}>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "900",
                  letterSpacing: "4px",
                  fontFamily: "monospace",
                  color: "#fef08a",
                }}
              >
                {booking.startOtp}
              </div>
              {currentLevel < 5 && (
                <button
                  onClick={() => handleCopyOtp(booking.startOtp)}
                  style={{
                    background: copied ? "#22c55e" : "rgba(255, 255, 255, 0.2)",
                    color: "#ffffff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#bae6fd" }}>
              {currentLevel < 5
                ? "Technician must enter this Start OTP in their app before opening AC cover."
                : "Start OTP was verified. Service began at " + new Date(booking.startedAt || Date.now()).toLocaleTimeString()}
            </p>
          </div>

          {/* End OTP (Unlocked only upon completion or active work completion) */}
          <div
            style={{
              background: "rgba(0,0,0,0.25)",
              padding: "16px 20px",
              borderRadius: "14px",
              border: "1px dashed rgba(255, 255, 255, 0.3)",
              textAlign: "center",
              minWidth: "180px",
            }}
          >
            <span style={{ fontSize: "10px", color: "#e2e8f0", textTransform: "uppercase", fontWeight: "700", display: "block" }}>
              End Service OTP
            </span>
            {currentLevel >= 5 ? (
              <strong style={{ fontSize: "26px", letterSpacing: "3px", color: "#ffffff", fontFamily: "monospace" }}>
                {booking.endOtp}
              </strong>
            ) : (
              <span style={{ fontSize: "13px", color: "#cbd5e1" }}>🔒 Locked until work completes</span>
            )}
          </div>
        </div>

        {/* TIMELINE STAGES */}
        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ fontSize: "18px", margin: "0 0 24px", color: "#0f172a" }}>
            Service Timeline
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {steps.map((step) => {
              const isPast = currentLevel > step.level;
              const isCurrent = currentLevel === step.level;

              return (
                <div key={step.level} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: isPast
                        ? "#16a34a"
                        : isCurrent
                        ? "#0284c7"
                        : "#f1f5f9",
                      color: isPast || isCurrent ? "#ffffff" : "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontWeight: "700",
                      fontSize: "14px",
                      boxShadow: isCurrent ? "0 0 0 4px rgba(2, 132, 199, 0.2)" : "none",
                    }}
                  >
                    {isPast ? <Check size={18} /> : step.level}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <strong style={{ fontSize: "15px", color: isCurrent ? "#0284c7" : "#0f172a" }}>
                        {step.title}
                      </strong>
                      {isCurrent && (
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#0284c7", background: "#e0f2fe", padding: "2px 8px", borderRadius: "10px" }}>
                          Current Stage
                        </span>
                      )}
                    </div>
                    <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#64748b" }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TECHNICIAN CONTACT CARD */}
        {booking.technicianName && (
          <div
            style={{
              background: "#ffffff",
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "30px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#e0f2fe",
                  color: "#0284c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "800",
                  fontSize: "18px",
                }}
              >
                {booking.technicianName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <strong style={{ fontSize: "16px", display: "block" }}>{booking.technicianName}</strong>
                <span style={{ fontSize: "13px", color: "#64748b" }}>
                  ★ {booking.technicianRating || 4.9} • Senior AC Technician
                </span>
              </div>
            </div>

            <a
              href={`tel:${booking.technicianPhone || "9876543210"}`}
              style={{
                background: "#f0fdf4",
                color: "#16a34a",
                border: "1px solid #bbf7d0",
                padding: "10px 18px",
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
              Call Technician
            </a>
          </div>
        )}

        {/* WORK CHECKLIST (IF IN PROGRESS OR COMPLETED) */}
        {booking.checklist && currentLevel >= 5 && (
          <div
            style={{
              background: "#ffffff",
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ fontSize: "15px", margin: "0 0 14px", color: "#0f172a" }}>
              AC Servicing Checklist
            </h3>
            <div style={{ display: "grid", gap: "10px" }}>
              {booking.checklist.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "13px",
                    color: item.done ? "#15803d" : "#64748b",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "6px",
                      background: item.done ? "#dcfce7" : "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.done ? <Check size={14} color="#16a34a" /> : <Clock3 size={13} color="#94a3b8" />}
                  </div>
                  <span style={{ textDecoration: item.done ? "none" : "none" }}>{item.task}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEW FORM (IF COMPLETED) */}
        {booking.status === "COMPLETED" && (
          <div
            style={{
              background: "#ffffff",
              padding: "28px",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
            }}
          >
            <h3 style={{ fontSize: "17px", margin: "0 0 8px", color: "#0f172a" }}>
              Rate Your AC Service Experience
            </h3>
            <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 18px" }}>
              Your feedback helps {booking.technicianName} and other customers.
            </p>

            {reviewSubmitted || booking.review ? (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  padding: "16px",
                  borderRadius: "12px",
                  color: "#16a34a",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                ✓ Thank you for rating! Rating: ★ {booking.review?.rating || rating}/5
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "24px",
                        color: star <= rating ? "#eab308" : "#cbd5e1",
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  placeholder="How was the AC cooling after service? Was the technician polite and clean?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                    marginBottom: "14px",
                  }}
                />

                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#ffffff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default TrackService;