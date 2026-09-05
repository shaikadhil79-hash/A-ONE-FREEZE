import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wrench,
  MapPin,
  Navigation,
  CheckCircle2,
  ArrowRight,
  Snowflake,
  Phone,
  ReceiptText,
  IndianRupee,
} from "lucide-react";

import serviceStore from "../../services/serviceStore";

function TechnicianActiveWork() {
  const navigate = useNavigate();

  const [activeBooking, setActiveBooking] =
    useState(null);

  /*
   * =========================================================
   * LOAD ACTIVE BOOKING
   * =========================================================
   */

  useEffect(() => {
    const sync = () => {
      const all = serviceStore.getBookings();

      const inProgress = all.find(
        (booking) =>
          booking.status === "IN_PROGRESS" ||
          booking.status === "ARRIVED" ||
          booking.status === "ON_THE_WAY"
      );

      setActiveBooking(inProgress || null);
    };

    sync();

    return serviceStore.subscribe(sync);
  }, []);

  /*
   * =========================================================
   * OPEN GOOGLE MAPS
   * =========================================================
   */

  const handleDirections = () => {
    if (!activeBooking) return;

    const latitude =
      activeBooking.service_latitude ??
      activeBooking.serviceLatitude ??
      activeBooking.latitude;

    const longitude =
      activeBooking.service_longitude ??
      activeBooking.serviceLongitude ??
      activeBooking.longitude;

    if (latitude && longitude) {
      const mapsUrl =
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

      window.open(
        mapsUrl,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    const address = encodeURIComponent(
      `${activeBooking.address || ""}, ${
        activeBooking.city || ""
      }`
    );

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${address}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /*
   * =========================================================
   * CALL CUSTOMER
   * =========================================================
   */

  const handleCallCustomer = () => {
    if (!activeBooking?.customerPhone) {
      alert("Customer phone number is not available.");
      return;
    }

    window.location.href =
      `tel:${activeBooking.customerPhone}`;
  };

  /*
   * =========================================================
   * RESUME SERVICE
   * =========================================================
   *
   * IMPORTANT:
   * Before moving to TechnicianService, preserve the
   * current booking information.
   *
   * This prevents the completion page from falling back
   * to the default ₹529.
   * =========================================================
   */

  const handleResumeService = () => {
    if (!activeBooking) return;

    /*
     * Save the active booking ID.
     */
    localStorage.setItem(
      "activeServiceBooking",
      activeBooking.id
    );

    /*
     * Save basic service information.
     */
    localStorage.setItem(
      "selectedServiceName",
      activeBooking.serviceName ||
        activeBooking.service_name ||
        "Service"
    );

    /*
     * Save customer information.
     */
    if (activeBooking.customerName) {
      localStorage.setItem(
        "customerName",
        activeBooking.customerName
      );
    }

    if (activeBooking.customerPhone) {
      localStorage.setItem(
        "customerPhone",
        activeBooking.customerPhone
      );
    }

    /*
     * Save address.
     */
    const address =
      activeBooking.address ||
      activeBooking.service_address ||
      "";

    if (address) {
      localStorage.setItem(
        "serviceAddress",
        address
      );
    }

    /*
     * Save city.
     */
    if (activeBooking.city) {
      localStorage.setItem(
        "serviceCity",
        activeBooking.city
      );
    }

    /*
     * Save location coordinates.
     */
    const latitude =
      activeBooking.service_latitude ??
      activeBooking.serviceLatitude ??
      activeBooking.latitude;

    const longitude =
      activeBooking.service_longitude ??
      activeBooking.serviceLongitude ??
      activeBooking.longitude;

    if (
      latitude !== undefined &&
      latitude !== null
    ) {
      localStorage.setItem(
        "serviceLatitude",
        String(latitude)
      );
    }

    if (
      longitude !== undefined &&
      longitude !== null
    ) {
      localStorage.setItem(
        "serviceLongitude",
        String(longitude)
      );
    }

    /*
     * =====================================================
     * SERVICE PRICE
     * =====================================================
     *
     * Try the actual booking price first.
     *
     * Different versions of the booking store may use
     * different property names, so support all of them.
     */

    const bookingServicePrice =
      Number(
        activeBooking.servicePrice ??
        activeBooking.service_price ??
        activeBooking.price ??
        activeBooking.amount ??
        0
      );

    /*
     * Only overwrite servicePrice when we actually have
     * a valid booking price.
     */
    if (
      Number.isFinite(bookingServicePrice) &&
      bookingServicePrice > 0
    ) {
      localStorage.setItem(
        "servicePrice",
        String(bookingServicePrice)
      );
    }

    /*
     * =====================================================
     * PRESERVE EXISTING PARTS
     * =====================================================
     *
     * If the technician already added parts, don't delete
     * them when opening/resuming the service.
     */

    let existingParts = [];

    try {
      existingParts = JSON.parse(
        localStorage.getItem(
          "serviceParts"
        ) || "[]"
      );

      if (!Array.isArray(existingParts)) {
        existingParts = [];
      }
    } catch (error) {
      console.error(
        "Unable to read saved service parts:",
        error
      );

      existingParts = [];
    }

    /*
     * Calculate parts total from the actual parts list.
     */
    const existingPartsTotal =
      existingParts.reduce(
        (total, part) =>
          total +
          Number(
            part.price ??
            part.amount ??
            0
          ),
        0
      );

    /*
     * Save the calculated parts total.
     */
    localStorage.setItem(
      "partsTotal",
      String(existingPartsTotal)
    );

    /*
     * =====================================================
     * CREATE CURRENT SERVICE BILL DATA
     * =====================================================
     */

    const savedServicePrice =
      Number(
        localStorage.getItem(
          "servicePrice"
        ) || bookingServicePrice || 0
      );

    const finalTotal =
      savedServicePrice +
      existingPartsTotal;

    const completedServiceData = {
      bookingId: activeBooking.id,

      customerName:
        activeBooking.customerName ||
        localStorage.getItem(
          "customerName"
        ) ||
        "Customer",

      customerPhone:
        activeBooking.customerPhone ||
        localStorage.getItem(
          "customerPhone"
        ) ||
        "",

      serviceName:
        activeBooking.serviceName ||
        activeBooking.service_name ||
        localStorage.getItem(
          "selectedServiceName"
        ) ||
        "Service",

      serviceAddress:
        address ||
        localStorage.getItem(
          "serviceAddress"
        ) ||
        "",

      city:
        activeBooking.city ||
        localStorage.getItem(
          "serviceCity"
        ) ||
        "",

      servicePrice:
        savedServicePrice,

      serviceCharge:
        savedServicePrice,

      parts:
        existingParts,

      partsTotal:
        existingPartsTotal,

      estimatedTotal:
        finalTotal,

      duration:
        Number(
          localStorage.getItem(
            "serviceDuration"
          ) || 0
        ),

      serviceLatitude:
        latitude ?? null,

      serviceLongitude:
        longitude ?? null,

      updatedAt:
        new Date().toISOString(),
    };

    /*
     * Save the complete bill data.
     *
     * TechnicianService and ServiceComplete can update
     * this object again when parts are added.
     */
    localStorage.setItem(
      "completedServiceData",
      JSON.stringify(
        completedServiceData
      )
    );

    /*
     * Debug information.
     */
    console.log(
      "ACTIVE BOOKING:",
      activeBooking
    );

    console.log(
      "SERVICE PRICE:",
      savedServicePrice
    );

    console.log(
      "PARTS:",
      existingParts
    );

    console.log(
      "PARTS TOTAL:",
      existingPartsTotal
    );

    console.log(
      "FINAL TOTAL:",
      finalTotal
    );

    /*
     * Open the actual service page.
     */
    navigate(
      `/technician/service/${activeBooking.id}`
    );
  };

  /*
   * =========================================================
   * NO ACTIVE BOOKING
   * =========================================================
   */

  if (!activeBooking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          fontFamily:
            "Inter, system-ui, sans-serif",
          color: "#0f172a",
        }}
      >
        <header
          style={{
            background: "#ffffff",
            borderBottom:
              "1px solid #e2e8f0",
            padding: "16px 6%",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
          }}
        >
          <button
            onClick={() =>
              navigate(
                "/technician/dashboard"
              )
            }
            style={{
              background: "transparent",
              border: "none",
              color: "#10b981",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ArrowLeft size={18} />

            Dashboard
          </button>

          <strong
            style={{
              color: "#0f172a",
            }}
          >
            ❄ A-ONE FREEZE TECH
          </strong>
        </header>

        <main
          style={{
            maxWidth: "600px",
            margin: "80px auto",
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "#e0f2fe",
              color: "#0284c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin:
                "0 auto 16px",
            }}
          >
            <Wrench size={30} />
          </div>

          <h2
            style={{
              fontSize: "22px",
              margin:
                "0 0 8px",
            }}
          >
            No Active Job Right Now
          </h2>

          <p
            style={{
              color: "#64748b",
              margin:
                "0 0 24px",
            }}
          >
            You do not currently have
            any service call in progress.
            View your assigned jobs or
            accept new service calls.
          </p>

          <button
            onClick={() =>
              navigate(
                "/technician/services"
              )
            }
            style={{
              background:
                "linear-gradient(135deg, #10b981, #059669)",
              color: "#ffffff",
              border: "none",
              padding:
                "12px 24px",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            View Available Jobs
          </button>
        </main>
      </div>
    );
  }

  /*
   * =========================================================
   * ACTIVE WORKSPACE
   * =========================================================
   */

  const servicePrice =
    Number(
      activeBooking.servicePrice ??
      activeBooking.service_price ??
      activeBooking.price ??
      localStorage.getItem(
        "servicePrice"
      ) ??
      0
    );

  let parts = [];

  try {
    parts = JSON.parse(
      localStorage.getItem(
        "serviceParts"
      ) || "[]"
    );

    if (!Array.isArray(parts)) {
      parts = [];
    }
  } catch {
    parts = [];
  }

  const partsTotal =
    parts.reduce(
      (total, part) =>
        total +
        Number(
          part.price ??
          part.amount ??
          0
        ),
      0
    );

  const currentTotal =
    servicePrice + partsTotal;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily:
          "Inter, system-ui, sans-serif",
        color: "#0f172a",
        paddingBottom: "80px",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        style={{
          background: "#ffffff",
          borderBottom:
            "1px solid #e2e8f0",
          padding: "16px 6%",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: "15px",
        }}
      >
        <button
          onClick={() =>
            navigate(
              "/technician/dashboard"
            )
          }
          style={{
            background:
              "transparent",
            border: "none",
            color: "#10b981",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <ArrowLeft size={18} />

          Dashboard
        </button>

        <strong
          style={{
            color: "#0f172a",
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <Snowflake
            size={18}
            color="#10b981"
          />

          ACTIVE WORKSPACE
        </strong>

        <span
          style={{
            fontSize: "12px",
            background: "#dcfce7",
            color: "#15803d",
            padding:
              "5px 11px",
            borderRadius: "10px",
            fontWeight: "800",
          }}
        >
          {activeBooking.status}
        </span>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        style={{
          maxWidth: "780px",
          margin: "35px auto",
          padding: "0 20px",
        }}
      >
        {/* ===================================================
            SERVICE CARD
        =================================================== */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            border:
              "1px solid #e2e8f0",
            padding: "28px",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.03)",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: "800",
              color: "#10b981",
              letterSpacing: "1px",
            }}
          >
            CURRENT ONGOING SERVICE
          </span>

          <h1
            style={{
              fontSize: "24px",
              margin:
                "6px 0 10px",
              color: "#0f172a",
            }}
          >
            {activeBooking.serviceName ||
              activeBooking.service_name ||
              "Service"}
          </h1>

          {/* =================================================
              BOOKING DETAILS
          ================================================= */}

          <div
            style={{
              background:
                "#f8fafc",
              padding: "16px",
              borderRadius: "14px",
              fontSize: "13px",
              lineHeight: 1.8,
              marginBottom: "20px",
            }}
          >
            <div>
              <strong>
                Order ID:
              </strong>{" "}
              {activeBooking.id}
            </div>

            <div>
              <strong>
                Customer:
              </strong>{" "}
              {activeBooking.customerName ||
                "Customer"}

              {activeBooking.customerPhone
                ? ` (${activeBooking.customerPhone})`
                : ""}
            </div>

            <div>
              <strong>
                Address:
              </strong>{" "}
              {activeBooking.address ||
                activeBooking.service_address ||
                "Address not available"}

              {activeBooking.city
                ? `, ${activeBooking.city}`
                : ""}
            </div>

            {(activeBooking.acBrand ||
              activeBooking.acType ||
              activeBooking.acTonnage) && (
              <div>
                <strong>
                  Unit:
                </strong>{" "}
                {activeBooking.acBrand ||
                  ""}{" "}
                {activeBooking.acType ||
                  ""}

                {activeBooking.acTonnage
                  ? ` (${activeBooking.acTonnage})`
                  : ""}
              </div>
            )}
          </div>

          {/* =================================================
              CUSTOMER ACTIONS
          ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <button
              onClick={
                handleCallCustomer
              }
              style={{
                border:
                  "1px solid #bbf7d0",
                background:
                  "#f0fdf4",
                color: "#15803d",
                padding:
                  "12px",
                borderRadius:
                  "11px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                gap: "7px",
              }}
            >
              <Phone size={16} />
              Call Customer
            </button>

            <button
              onClick={
                handleDirections
              }
              style={{
                border:
                  "1px solid #bfdbfe",
                background:
                  "#eff6ff",
                color: "#2563eb",
                padding:
                  "12px",
                borderRadius:
                  "11px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                gap: "7px",
              }}
            >
              <Navigation
                size={16}
              />
              Directions
            </button>
          </div>

          {/* =================================================
              CURRENT BILL PREVIEW
          ================================================= */}

          <div
            style={{
              borderTop:
                "1px solid #e2e8f0",
              paddingTop: "22px",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: "9px",
                marginBottom:
                  "14px",
              }}
            >
              <ReceiptText
                size={20}
                color="#0284c7"
              />

              <strong
                style={{
                  fontSize: "16px",
                }}
              >
                Current Service Bill
              </strong>
            </div>

            <div
              style={{
                background:
                  "#f8fafc",
                borderRadius:
                  "13px",
                padding:
                  "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginBottom:
                    "9px",
                  fontSize:
                    "13px",
                }}
              >
                <span>
                  {activeBooking.serviceName ||
                    "Service"}
                </span>

                <strong>
                  ₹
                  {servicePrice.toFixed(
                    0
                  )}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginBottom:
                    "9px",
                  fontSize:
                    "13px",
                }}
              >
                <span>
                  Parts & Materials
                </span>

                <strong>
                  ₹
                  {partsTotal.toFixed(
                    0
                  )}
                </strong>
              </div>

              <div
                style={{
                  borderTop:
                    "1px dashed #cbd5e1",
                  paddingTop:
                    "12px",
                  marginTop:
                    "12px",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                }}
              >
                <strong>
                  Final Amount
                </strong>

                <strong
                  style={{
                    color: "#0284c7",
                    fontSize:
                      "20px",
                    display: "flex",
                    alignItems:
                      "center",
                  }}
                >
                  <IndianRupee
                    size={17}
                  />
                  {currentTotal.toFixed(
                    0
                  )}
                </strong>
              </div>
            </div>
          </div>

          {/* =================================================
              RESUME SERVICE
          ================================================= */}

          <button
            onClick={
              handleResumeService
            }
            style={{
              width: "100%",
              marginTop: "24px",
              background:
                "linear-gradient(135deg, #10b981, #059669)",
              color: "#ffffff",
              border: "none",
              padding: "14px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              gap: "8px",
            }}
          >
            Resume Active Job &
            Inspection

            <ArrowRight
              size={16}
            />
          </button>
        </div>

        {/* ===================================================
            SAFETY / BILL NOTE
        =================================================== */}

        <div
          style={{
            marginTop: "16px",
            background: "#eff6ff",
            border:
              "1px solid #dbeafe",
            borderRadius: "13px",
            padding: "14px 16px",
            fontSize: "12px",
            color: "#475569",
            lineHeight: 1.6,
          }}
        >
          <CheckCircle2
            size={15}
            color="#0284c7"
            style={{
              verticalAlign:
                "middle",
              marginRight: "6px",
            }}
          />

          The service amount and
          technician-added parts are
          carried forward to the final
          bill and payment screen.
        </div>
      </main>
    </div>
  );
}

export default TechnicianActiveWork;