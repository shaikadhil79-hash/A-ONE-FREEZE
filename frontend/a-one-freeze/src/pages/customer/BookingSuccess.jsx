import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ShieldCheck,
  Snowflake,
  Copy,
  Check,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Lock,
} from "lucide-react";
import serviceStore from "../../services/serviceStore";

function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const [booking, setBooking] = useState(
    location.state?.booking || null
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!booking) {
      const all = serviceStore.getBookings();
      if (all.length > 0) {
        setBooking(all[0]);
      }
    }
  }, [booking]);

  const handleCopyOtp = () => {
    if (booking?.startOtp) {
      navigator.clipboard?.writeText(booking.startOtp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTrackLive = () => {
    navigate("/customer/track-service", {
      state: booking,
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        padding: "40px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "#ffffff",
          borderRadius: "26px",
          padding: "40px 36px",
          boxShadow: "0 20px 50px rgba(2, 132, 199, 0.12)",
          border: "1px solid #e0f2fe",
          textAlign: "center",
        }}
      >
        {/* SUCCESS ICON */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)",
          }}
        >
          <CheckCircle2 size={44} />
        </div>

        <span
          style={{
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "1.5px",
            color: "#16a34a",
            textTransform: "uppercase",
          }}
        >
          BOOKING CONFIRMED
        </span>

        <h1 style={{ fontSize: "28px", color: "#0f172a", margin: "6px 0 10px" }}>
          AC Service Scheduled!
        </h1>

        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 28px" }}>
          Booking ID: <strong style={{ color: "#0284c7" }}>{booking?.id || "AOF-2026-00124"}</strong>
        </p>

        {/* =====================================================
            DUAL-OTP SECURITY CARD
        ===================================================== */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "28px",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <ShieldCheck size={20} color="#0284c7" />
            <strong style={{ fontSize: "15px", color: "#0f172a" }}>
              Secure Service Verification OTPs
            </strong>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {/* START OTP */}
            <div
              style={{
                background: "#ffffff",
                border: "2px solid #38bdf8",
                borderRadius: "14px",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  color: "#0369a1",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                1. START SERVICE OTP
              </span>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  letterSpacing: "4px",
                  color: "#0f172a",
                  fontFamily: "monospace",
                }}
              >
                {booking?.startOtp || "482910"}
              </div>
              <p style={{ fontSize: "11px", color: "#64748b", margin: "6px 0 10px" }}>
                Give to technician upon arrival
              </p>
              <button
                onClick={handleCopyOtp}
                style={{
                  background: copied ? "#dcfce7" : "#f1f5f9",
                  color: copied ? "#16a34a" : "#475569",
                  border: "none",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy OTP"}
              </button>
            </div>

            {/* END OTP */}
            <div
              style={{
                background: "#ffffff",
                border: "1px dashed #cbd5e1",
                borderRadius: "14px",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  color: "#64748b",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                2. COMPLETE SERVICE OTP
              </span>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  letterSpacing: "3px",
                  color: "#94a3b8",
                  padding: "4px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <Lock size={18} />
                <span>••••••</span>
              </div>
              <p style={{ fontSize: "11px", color: "#64748b", margin: "6px 0 0" }}>
                Will be displayed once technician completes service
              </p>
            </div>
          </div>
        </div>

        {/* BOOKING DETAILS SUMMARY */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #f1f5f9",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "left",
            fontSize: "13px",
            lineHeight: 1.8,
            marginBottom: "28px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px", marginBottom: "10px" }}>
            <span style={{ color: "#64748b" }}>Service Requested:</span>
            <strong style={{ color: "#0f172a" }}>{booking?.serviceName || "AC Jet Foam Wash & Deep Cleaning"}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px", marginBottom: "10px" }}>
            <span style={{ color: "#64748b" }}>AC Unit:</span>
            <span>{booking?.acBrand || "Daikin"} {booking?.acType || "Split AC"} ({booking?.acTonnage || "1.5 Ton"})</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px", marginBottom: "10px" }}>
            <span style={{ color: "#64748b" }}>Scheduled Time:</span>
            <span>{booking?.scheduledDate || "Today"} ({booking?.scheduledTime || "11:00 AM - 01:00 PM"})</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px", marginBottom: "10px" }}>
            <span style={{ color: "#64748b" }}>Assigned Technician:</span>
            <strong style={{ color: "#0284c7" }}>{booking?.technicianName || "Auto-Dispatching..."}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#64748b" }}>Total Amount Payable:</span>
            <strong style={{ color: "#16a34a", fontSize: "16px" }}>₹{booking?.totalAmount || booking?.amount || 648}</strong>
          </div>
        </div>

        {/* ACTIONS */}
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleTrackLive}
            style={{
              background: "linear-gradient(135deg, #0284c7, #0369a1)",
              color: "#ffffff",
              border: "none",
              padding: "14px 28px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 16px rgba(2, 132, 199, 0.35)",
            }}
          >
            Track Technician Live
            <ArrowRight size={17} />
          </button>

          <button
            onClick={() => navigate("/customer/bookings")}
            style={{
              background: "#ffffff",
              color: "#334155",
              border: "1px solid #cbd5e1",
              padding: "14px 24px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;