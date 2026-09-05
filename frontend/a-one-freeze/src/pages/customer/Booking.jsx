import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Snowflake,
  ArrowLeft,
  MapPin,
  CalendarDays,
  Clock3,
  UserRound,
  Star,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Phone,
  Info,
  Wrench,
  Sparkles,
} from "lucide-react";
import serviceStore from "../../services/serviceStore";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceName =
    location.state?.service ||
    localStorage.getItem("selectedServiceName") ||
    "AC Jet Foam Wash & Deep Cleaning";

  const serviceId =
    location.state?.serviceId || "ac-jet-wash";

  const appliance =
    location.state?.appliance ||
    localStorage.getItem("selectedAppliance") ||
    "Air Conditioner";

  const acType =
    location.state?.acType ||
    localStorage.getItem("selectedAcType") ||
    "Split Inverter AC";

  const acTonnage =
    location.state?.acTonnage ||
    localStorage.getItem("selectedAcTonnage") ||
    "1.5 Ton";

  const acBrand =
    location.state?.acBrand ||
    localStorage.getItem("selectedAcBrand") ||
    "Daikin";

  const basePrice =
    Number(location.state?.price) ||
    Number(localStorage.getItem("selectedServicePrice")) ||
    699;

  // Form State
  const [customerName, setCustomerName] = useState("Adhil Shaik");
  const [customerPhone, setCustomerPhone] = useState(
    localStorage.getItem("customerPhone") || "9876543201"
  );
  const [address, setAddress] = useState(
    "Flat 4B, Emerald Heights, 2nd Avenue, Anna Nagar"
  );
  const [city, setCity] = useState("Chennai");
  const [pincode, setPincode] = useState("600040");
  const [scheduledDate, setScheduledDate] = useState("Today");
  const [scheduledTime, setScheduledTime] = useState("11:00 AM - 01:00 PM");
  const [notes, setNotes] = useState("");
  const [selectedTechId, setSelectedTechId] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const technicians = serviceStore.getTechnicians();

  // Price Calculation
  const consumablesFee = 49;
  const promoDiscount = 100;
  const totalAmount = Math.max(0, basePrice + consumablesFee - promoDiscount);

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setError("");

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, "").length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!address.trim()) {
      setError("Please enter your service address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newBooking = serviceStore.createBooking({
        serviceId,
        serviceName,
        appliance,
        acType,
        acTonnage,
        acBrand,
        customerName,
        customerPhone,
        address,
        city,
        pincode,
        scheduledDate,
        scheduledTime,
        amount: totalAmount,
        notes: notes || `${acBrand} ${acType} (${acTonnage})`,
        preferredTechId: selectedTechId || null,
      });

      // Save customer phone for auto-login
      localStorage.setItem("customerPhone", customerPhone);
      localStorage.setItem("customerLoggedIn", "true");

      setTimeout(() => {
        navigate("/customer/booking-success", {
          state: { booking: newBooking },
        });
      }, 400);
    } catch (err) {
      setError(err.message || "Failed to create booking.");
      setIsSubmitting(false);
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
          onClick={() => navigate(-1)}
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
          Back
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Snowflake size={20} color="#0284c7" />
          <strong style={{ fontSize: "16px", color: "#0f172a" }}>
            A-ONE FREEZE
          </strong>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "#16a34a",
            fontWeight: "700",
          }}
        >
          <ShieldCheck size={16} />
          Verified Booking
        </div>
      </header>

      {/* CONTAINER */}
      <main
        style={{
          maxWidth: "1020px",
          margin: "35px auto",
          padding: "0 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "30px",
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN: BOOKING FORM */}
        <div
          style={{
            background: "#ffffff",
            padding: "32px",
            borderRadius: "22px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
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
              SCHEDULE YOUR SERVICE
            </span>
            <h1 style={{ fontSize: "26px", margin: "6px 0 0", color: "#0f172a" }}>
              AC Service Booking
            </h1>
          </div>

          {error && (
            <div
              style={{
                background: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleConfirmBooking}>
            {/* Contact Details */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "14px", color: "#334155", margin: "0 0 12px" }}>
                1. Contact Information
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>
                    Mobile Number (For OTP Verification)
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "14px", color: "#334155", margin: "0 0 12px" }}>
                2. Service Address
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>
                    Door / Flat No. & Street
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>
                      Pincode
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Date and Slot */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "14px", color: "#334155", margin: "0 0 12px" }}>
                3. Date & Time Slot
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>
                    Preferred Date
                  </label>
                  <select
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    style={inputStyle}
                  >
                    <option>Today</option>
                    <option>Tomorrow</option>
                    <option>This Weekend</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>
                    Time Slot
                  </label>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    style={inputStyle}
                  >
                    <option>09:00 AM - 11:00 AM</option>
                    <option>11:00 AM - 01:00 PM</option>
                    <option>02:00 PM - 04:00 PM</option>
                    <option>04:00 PM - 06:00 PM</option>
                    <option>06:00 PM - 08:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Technician Selection */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "14px", color: "#334155", margin: "0 0 12px" }}>
                4. Select Technician (Optional)
              </h3>
              <select
                value={selectedTechId}
                onChange={(e) => setSelectedTechId(e.target.value)}
                style={inputStyle}
              >
                <option value="">⚡ Auto-Assign Nearest Available AC Specialist</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (★ {t.rating} - {t.experience}, {t.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>
                AC Symptoms / Special Instructions
              </label>
              <textarea
                rows={2}
                placeholder="e.g. AC vibrating loudly, water leak inside bedroom, cooling very slow..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #0284c7, #0369a1)",
                color: "#ffffff",
                border: "none",
                padding: "16px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 18px rgba(2, 132, 199, 0.35)",
              }}
            >
              {isSubmitting ? "Creating Booking..." : `Confirm AC Service • ₹${totalAmount}`}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: SUMMARY CARD */}
        <div
          style={{
            background: "#ffffff",
            padding: "28px",
            borderRadius: "22px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          }}
        >
          <h2 style={{ fontSize: "18px", margin: "0 0 16px", color: "#0f172a" }}>
            Booking Summary
          </h2>

          <div
            style={{
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "14px",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <Snowflake size={20} color="#0284c7" />
              <strong style={{ fontSize: "15px", color: "#0369a1" }}>{serviceName}</strong>
            </div>
            <div style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6 }}>
              <div>• <strong>Unit:</strong> {acBrand} {acType}</div>
              <div>• <strong>Capacity:</strong> {acTonnage}</div>
              <div>• <strong>Warranty:</strong> 30-Day Complete Cooling Guarantee</div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px", marginBottom: "20px" }}>
            <div style={priceRow}>
              <span style={{ color: "#64748b" }}>Service Base Price</span>
              <span>₹{basePrice}</span>
            </div>
            <div style={priceRow}>
              <span style={{ color: "#64748b" }}>Safety & Consumables Fee</span>
              <span>₹{consumablesFee}</span>
            </div>
            <div style={{ ...priceRow, color: "#16a34a", fontWeight: "600" }}>
              <span>First Booking Discount</span>
              <span>-₹{promoDiscount}</span>
            </div>
            <div
              style={{
                ...priceRow,
                borderTop: "1px dashed #e2e8f0",
                paddingTop: "12px",
                marginTop: "10px",
                fontSize: "18px",
                fontWeight: "800",
                color: "#0f172a",
              }}
            >
              <span>Total Payable</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          {/* Security Banner */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "14px",
              fontSize: "12px",
              color: "#475569",
              lineHeight: 1.5,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#16a34a", fontWeight: "700", marginBottom: "4px" }}>
              <ShieldCheck size={16} />
              OTP Protected Service
            </div>
            You will receive a <strong>Start OTP</strong> to verify your technician upon arrival, and an <strong>End OTP</strong> once your AC service is completed to your satisfaction.
          </div>
        </div>
      </main>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  fontSize: "14px",
  color: "#0f172a",
  outline: "none",
  marginTop: "4px",
  boxSizing: "border-box",
};

const priceRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "14px",
  marginBottom: "8px",
};

export default Booking;