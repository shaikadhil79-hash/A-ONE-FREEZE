import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Snowflake,
  Wind,
  Refrigerator,
  WashingMachine,
  Flame,
  ShieldCheck,
  Star,
  Clock3,
} from "lucide-react";
import serviceStore from "../../services/serviceStore";
import "./ApplianceServices.css";

const applianceData = {
  "air-conditioner": {
    name: "Air Conditioner",
    description: "Professional AC deep jet wash, gas refilling, repairs and installation by certified engineers.",
    icon: Snowflake,
  },
  "air-cooler": {
    name: "Air Cooler",
    description: "Cooling service, motor and pump maintenance for air coolers.",
    icon: Wind,
    services: [
      { id: "c1", name: "Cooler General Service", description: "Complete cleaning and motor oiling.", price: 399, duration: "30 mins", warranty: "15-Day Warranty" },
      { id: "c2", name: "Cooler Pump / Motor Repair", description: "Water pump replacement and wiring check.", price: 499, duration: "45 mins", warranty: "30-Day Warranty" },
    ],
  },
  refrigerator: {
    name: "Refrigerator",
    description: "Reliable refrigerator cooling repair, compressor inspection, and gas refilling.",
    icon: Refrigerator,
    services: [
      { id: "r1", name: "Refrigerator General Service", description: "Condenser coil cleaning & thermostat check.", price: 499, duration: "40 mins", warranty: "30-Day Warranty" },
      { id: "r2", name: "Refrigerator Gas Refill", description: "Refrigerant charging and leak check.", price: 999, duration: "60 mins", warranty: "60-Day Warranty" },
      { id: "r3", name: "Refrigerator Cooling Repair", description: "Relay, thermostat, and defrost repair.", price: 599, duration: "45 mins", warranty: "30-Day Warranty" },
    ],
  },
  "washing-machine": {
    name: "Washing Machine",
    description: "Top-load, front-load and semi-automatic washing machine repair & drum descaling.",
    icon: WashingMachine,
    services: [
      { id: "w1", name: "Drum Descaling & Deep Clean", description: "High-temperature drum sanitize & descaling.", price: 499, duration: "45 mins", warranty: "30-Day Warranty" },
      { id: "w2", name: "Washing Machine Motor Repair", description: "Drain motor, belt & gearbox inspection.", price: 699, duration: "60 mins", warranty: "30-Day Warranty" },
    ],
  },
  "water-heater": {
    name: "Water Heater",
    description: "Geyser installation, element descaling, thermostat and safety valve replacement.",
    icon: Flame,
    services: [
      { id: "g1", name: "Geyser Installation", description: "Inlet/outlet connection and safety valve setup.", price: 799, duration: "45 mins", warranty: "30-Day Warranty" },
      { id: "g2", name: "Element Descaling & Service", description: "Thermostat test, tank flush & anode check.", price: 499, duration: "40 mins", warranty: "30-Day Warranty" },
    ],
  },
};

function ApplianceServices() {
  const navigate = useNavigate();
  const { applianceId = "air-conditioner" } = useParams();

  const isAc = applianceId === "air-conditioner";
  const appliance = applianceData[applianceId] || applianceData["air-conditioner"];
  const Icon = appliance.icon;

  // AC Configuration State
  const [acType, setAcType] = useState("Split Inverter AC");
  const [acTonnage, setAcTonnage] = useState("1.5 Ton");
  const [acBrand, setAcBrand] = useState("Daikin");

  const services = isAc ? serviceStore.getServices() : appliance.services || [];

  const handleBook = (service) => {
    localStorage.setItem("selectedServiceName", service.name);
    localStorage.setItem("selectedServicePrice", String(service.price));
    localStorage.setItem("selectedAppliance", appliance.name);
    localStorage.setItem("selectedAcType", acType);
    localStorage.setItem("selectedAcTonnage", acTonnage);
    localStorage.setItem("selectedAcBrand", acBrand);

    navigate("/customer/booking", {
      state: {
        service: service.name,
        serviceId: service.id,
        price: service.price,
        appliance: appliance.name,
        acType,
        acTonnage,
        acBrand,
      },
    });
  };

  return (
    <div className="appliance-services-page" style={{ paddingBottom: "70px" }}>
      {/* HEADER */}
      <header className="appliance-services-header">
        <button onClick={() => navigate("/customer/service-selection")}>
          <ArrowLeft size={18} />
          Back to Appliances
        </button>

        <span style={{ fontWeight: "700", color: "#0284c7" }}>
          ❄ A-ONE FREEZE
        </span>
      </header>

      {/* HERO */}
      <section className="appliance-services-hero">
        <div className="appliance-services-icon">
          <Icon size={38} />
        </div>

        <span>CERTIFIED REPAIR & MAINTENANCE</span>
        <h1>{appliance.name} Services</h1>
        <p>{appliance.description}</p>
      </section>

      {/* AC SPECIFICATION SELECTOR (IF AC) */}
      {isAc && (
        <section
          style={{
            maxWidth: "960px",
            margin: "0 auto 35px",
            background: "#ffffff",
            padding: "24px 30px",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: "#0f172a" }}>
            Select Your Air Conditioner Details:
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            {/* AC Type */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "6px" }}>
                AC Unit Type
              </label>
              <select
                value={acType}
                onChange={(e) => setAcType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#f8fafc",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0f172a",
                }}
              >
                <option>Split Inverter AC</option>
                <option>Regular Split AC</option>
                <option>Window AC</option>
                <option>Cassette / Ceiling AC</option>
                <option>Tower AC</option>
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "6px" }}>
                Cooling Capacity
              </label>
              <select
                value={acTonnage}
                onChange={(e) => setAcTonnage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#f8fafc",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0f172a",
                }}
              >
                <option>1.0 Ton (Up to 110 sq ft)</option>
                <option>1.5 Ton (110 - 160 sq ft)</option>
                <option>2.0 Ton (160 - 240 sq ft)</option>
                <option>2+ Ton (Commercial/Large Hall)</option>
              </select>
            </div>

            {/* Brand */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "6px" }}>
                AC Brand
              </label>
              <select
                value={acBrand}
                onChange={(e) => setAcBrand(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#f8fafc",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0f172a",
                }}
              >
                <option>Daikin</option>
                <option>Voltas</option>
                <option>LG</option>
                <option>Blue Star</option>
                <option>Hitachi</option>
                <option>Carrier</option>
                <option>Mitsubishi Electric</option>
                <option>Samsung</option>
                <option>Panasonic</option>
                <option>O General</option>
                <option>Godrej</option>
                <option>Other Brand</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {/* SERVICES LIST */}
      <main className="appliance-services-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            width: "100%",
          }}
        >
          {services.map((service) => (
            <div
              key={service.id || service.name}
              style={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                padding: "26px",
                background: "#ffffff",
                boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
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
                    padding: "3px 10px",
                    borderRadius: "20px",
                  }}
                >
                  RECOMMENDED
                </span>
              )}

              <h2 style={{ fontSize: "20px", color: "#0f172a", margin: "0 0 10px" }}>
                {service.name}
              </h2>

              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6, margin: "0 0 16px" }}>
                {service.description}
              </p>

              {/* FEATURES CHECKLIST */}
              {service.features && (
                <div style={{ marginBottom: "20px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", letterSpacing: "1px", textTransform: "uppercase" }}>
                    What's Included:
                  </span>
                  <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0" }}>
                    {service.features.map((feat, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "13px",
                          color: "#334155",
                          marginBottom: "6px",
                        }}
                      >
                        <CheckCircle2 size={15} color="#16a34a" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* PRICING & GUARANTEE */}
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "16px",
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontSize: "26px", fontWeight: "900", color: "#0f172a" }}>
                      ₹{service.price}
                    </span>
                    {service.originalPrice && (
                      <span style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "line-through" }}>
                        ₹{service.originalPrice}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "11px", color: "#0284c7", fontWeight: "700" }}>
                    🛡️ {service.warranty || "30-Day Guarantee"}
                  </span>
                </div>

                <button
                  onClick={() => handleBook(service)}
                  style={{
                    background: "linear-gradient(135deg, #0284c7, #0369a1)",
                    color: "#ffffff",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 4px 14px rgba(2, 132, 199, 0.3)",
                  }}
                >
                  Select & Book
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ApplianceServices;