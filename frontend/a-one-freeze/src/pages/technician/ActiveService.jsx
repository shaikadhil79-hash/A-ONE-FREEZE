import "./ActiveService.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import serviceStore from "../../services/serviceStore";

import {
  Snowflake,
  ArrowLeft,
  MapPin,
  Clock3,
  Wrench,
  UserRound,
  Phone,
  Navigation,
  Camera,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  ReceiptText,
} from "lucide-react";

function ActiveService() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [seconds, setSeconds] = useState(0);
  const [parts, setParts] = useState([]);
  const [booking, setBooking] = useState(null);
  const [partName, setPartName] = useState("");
  const [partPrice, setPartPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState(null);

  /*
   * =========================================================
   * LOAD BOOKING
   * =========================================================
   */

  useEffect(() => {
    const sync = () => {
      const current = serviceStore.getBookingById(bookingId);
      setBooking(current || null);

      if (current && Array.isArray(current.parts)) {
        setParts(current.parts);
      } else {
        try {
          const saved = JSON.parse(
            localStorage.getItem("serviceParts") || "[]"
          );
          setParts(Array.isArray(saved) ? saved : []);
        } catch {
          setParts([]);
        }
      }
    };

    sync();
    return serviceStore.subscribe(sync);
  }, [bookingId]);


  /*
   * =========================================================
   * SERVICE TIMER
   * =========================================================
   */

  useEffect(() => {
    const startedAt =
      booking?.startedAt ||
      localStorage.getItem("serviceStartedAt");

    if (!startedAt) {
      setSeconds(0);
      return undefined;
    }

    const startTime =
      new Date(startedAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor(
        (now - startTime) / 1000
      );

      setSeconds(
        elapsed >= 0 ? elapsed : 0
      );
    };

    updateTimer();

    const timer = setInterval(
      updateTimer,
      1000
    );

    return () => clearInterval(timer);
  }, [booking?.startedAt]);


  /*
   * =========================================================
   * FORMAT TIMER
   * =========================================================
   */

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(
      totalSeconds / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const secs =
      totalSeconds % 60;

    return [
      hours,
      minutes,
      secs,
    ]
      .map((value) =>
        String(value).padStart(2, "0")
      )
      .join(":");
  };


  /*
   * =========================================================
   * ADD PART
   * =========================================================
   */

  const handleAddPart = () => {
    if (!partName.trim() || !partPrice) {
      return;
    }

    const price = Number(partPrice);

    if (!Number.isFinite(price) || price < 0) {
      return;
    }

    const newPart = {
      id: `part-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: partName.trim(),
      price: Math.round(price * 100) / 100,
    };

    const updatedParts = [...parts, newPart];
    setParts(updatedParts);

    if (booking) {
      serviceStore.setBookingParts(booking.id, updatedParts);
    }

    localStorage.setItem(
      "serviceParts",
      JSON.stringify(updatedParts)
    );

    localStorage.setItem(
      "partsTotal",
      String(
        updatedParts.reduce(
          (sum, part) => sum + Number(part.price || 0),
          0
        )
      )
    );

    setPartName("");
    setPartPrice("");
  };


  /*
   * =========================================================
   * REMOVE PART
   * =========================================================
   */

  const handleRemovePart = (id) => {
    const updatedParts = parts.filter(
      (part) => part.id !== id
    );

    setParts(updatedParts);

    if (booking) {
      serviceStore.setBookingParts(booking.id, updatedParts);
    }

    localStorage.setItem(
      "serviceParts",
      JSON.stringify(updatedParts)
    );

    localStorage.setItem(
      "partsTotal",
      String(
        updatedParts.reduce(
          (sum, part) => sum + Number(part.price || 0),
          0
        )
      )
    );
  };


  /*
   * =========================================================
   * PHOTO
   * =========================================================
   */

  const handlePhoto = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const imageUrl =
      URL.createObjectURL(file);

    setPhoto(imageUrl);
  };


  /*
   * =========================================================
   * PART TOTAL
   * =========================================================
   */

  const partsTotal = parts.reduce(
    (total, part) =>
      total + Number(part.price || 0),
    0
  );


  /*
   * =========================================================
   * SERVICE CHARGE
   * =========================================================
   */

  const serviceCharge = Number(
    booking?.amount ??
    booking?.servicePrice ??
    localStorage.getItem("servicePrice") ??
    0
  );

  const estimatedTotal =
    serviceCharge + partsTotal;


  /*
   * =========================================================
   * COMPLETE SERVICE
   * =========================================================
   */

  const handleCompleteService = () => {
    const currentBookingId =
      bookingId || "AOF-2026-00124";

    const finalCustomerName =
      booking?.customerName ||
      localStorage.getItem("customerName") ||
      "Customer";

    const finalServiceName =
      booking?.serviceName ||
      localStorage.getItem("selectedServiceName") ||
      "Service";

    const finalAddress =
      booking?.address ||
      localStorage.getItem("serviceAddress") ||
      "";

    const finalParts = Array.isArray(parts)
      ? parts
      : [];

    const finalPartsTotal = finalParts.reduce(
      (sum, part) => sum + Number(part.price || 0),
      0
    );

    const finalServiceCharge = Number(
      booking?.amount ??
      booking?.servicePrice ??
      localStorage.getItem("servicePrice") ??
      0
    );

    const finalAmount =
      finalServiceCharge + finalPartsTotal;

    const serviceData = {
      bookingId: currentBookingId,
      customerName: finalCustomerName,
      customerPhone: booking?.customerPhone || "",
      serviceName: finalServiceName,
      serviceAddress: finalAddress,
      serviceCharge: finalServiceCharge,
      servicePrice: finalServiceCharge,
      parts: finalParts,
      partsTotal: finalPartsTotal,
      estimatedTotal: finalAmount,
      duration: seconds,
      notes,
      photo,
      completedAt: new Date().toISOString(),
    };

    if (booking) {
      serviceStore.setBookingParts(
        booking.id,
        finalParts
      );
    }

    localStorage.setItem(
      "serviceParts",
      JSON.stringify(finalParts)
    );

    localStorage.setItem(
      "partsTotal",
      String(finalPartsTotal)
    );

    localStorage.setItem(
      "servicePrice",
      String(finalServiceCharge)
    );

    localStorage.setItem(
      "serviceDuration",
      String(seconds)
    );

    localStorage.setItem(
      "completedServiceData",
      JSON.stringify(serviceData)
    );

    localStorage.setItem(
      "activeServiceBooking",
      currentBookingId
    );

    localStorage.setItem(
      "serviceCompletionBooking",
      currentBookingId
    );

    localStorage.setItem(
      "serviceStatus",
      "READY_FOR_COMPLETION"
    );

    console.log(
      "FINAL SERVICE BILL:",
      serviceData
    );

    navigate(
      `/technician/service/${currentBookingId}/complete`
    );
  };


  /*
   * =========================================================
   * BACK
   * =========================================================
   */

  const handleBack = () => {
    navigate(
      `/technician/service/${bookingId}`
    );
  };


  return (
    <div className="active-service-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="active-service-header">

        <button
          className="active-service-back"
          onClick={handleBack}
        >
          <ArrowLeft size={17} />

          Service Details
        </button>


        <div className="active-service-brand">

          <div>
            <Snowflake size={20} />
          </div>

          <span>
            A-ONE FREEZE
          </span>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="active-service-main">


        {/* =================================================
            TITLE
        ================================================= */}

        <div className="active-service-title">

          <div>

            <span>
              ACTIVE SERVICE
            </span>

            <h1>
              Service in Progress
            </h1>

            <p>
              Complete the service details before
              requesting the customer's End OTP.
            </p>

          </div>


          <div className="active-service-live">

            <span></span>

            LIVE

          </div>

        </div>


        {/* =================================================
            SERVICE INFO
        ================================================= */}

        <section className="active-service-info">

          <div className="active-service-info-item">

            <UserRound size={18} />

            <div>

              <span>
                CUSTOMER
              </span>

              <strong>
                {booking?.customerName || "Customer"}
              </strong>

            </div>

          </div>


          <div className="active-service-info-item">

            <MapPin size={18} />

            <div>

              <span>
                LOCATION
              </span>

              <strong>
                {booking?.address || "Service location"}{booking?.city ? `, ${booking.city}` : ""}
              </strong>

            </div>

          </div>


          <div className="active-service-info-item">

            <Wrench size={18} />

            <div>

              <span>
                SERVICE
              </span>

              <strong>
                {booking?.serviceName || "Service"}
              </strong>

            </div>

          </div>


          <div className="active-service-info-item">

            <Clock3 size={18} />

            <div>

              <span>
                BOOKING
              </span>

              <strong>
                {bookingId}
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            TIMER
        ================================================= */}

        <section className="active-service-timer-card">

          <div className="active-service-timer-icon">
            <Clock3 size={23} />
          </div>

          <div>

            <span>
              SERVICE DURATION
            </span>

            <strong>
              {formatTime(seconds)}
            </strong>

            <small>
              Service timer started after
              Start OTP verification.
            </small>

          </div>


          <div className="active-service-timer-status">

            <span></span>

            SERVICE IN PROGRESS

          </div>

        </section>


        {/* =================================================
            CONTENT GRID
        ================================================= */}

        <div className="active-service-grid">


          {/* =================================================
              LEFT
          ================================================= */}

          <div>


            {/* =================================================
                PARTS
            ================================================= */}

            <section className="active-service-card">

              <div className="active-service-card-heading">

                <div>

                  <span>
                    MATERIALS
                  </span>

                  <h2>
                    Parts Used
                  </h2>

                </div>

              </div>


              <div className="active-service-add-part">

                <input
                  type="text"
                  placeholder="Part name"
                  value={partName}
                  onChange={(e) =>
                    setPartName(
                      e.target.value
                    )
                  }
                />


                <input
                  type="number"
                  min="0"
                  placeholder="₹ Price"
                  value={partPrice}
                  onChange={(e) =>
                    setPartPrice(
                      e.target.value
                    )
                  }
                />


                <button
                  onClick={
                    handleAddPart
                  }
                >

                  <Plus size={16} />

                  Add

                </button>

              </div>


              {/* PART LIST */}

              {parts.length === 0 ? (

                <div className="active-service-empty">

                  <Wrench size={18} />

                  <span>
                    No parts added yet.
                  </span>

                </div>

              ) : (

                <div className="active-service-part-list">

                  {parts.map((part) => (

                    <div
                      className="active-service-part"
                      key={part.id}
                    >

                      <div>

                        <strong>
                          {part.name}
                        </strong>

                        <span>
                          Material
                        </span>

                      </div>


                      <strong>
                        ₹{part.price}
                      </strong>


                      <button
                        onClick={() =>
                          handleRemovePart(
                            part.id
                          )
                        }
                      >

                        <Trash2 size={15} />

                      </button>

                    </div>

                  ))}

                </div>

              )}


              <div className="active-service-parts-total">

                <span>
                  Parts Total
                </span>

                <strong>
                  ₹{partsTotal}
                </strong>

              </div>

            </section>


            {/* =================================================
                NOTES
            ================================================= */}

            <section className="active-service-card">

              <div className="active-service-card-heading">

                <div>

                  <span>
                    WORK NOTES
                  </span>

                  <h2>
                    Service Notes
                  </h2>

                </div>

              </div>


              <textarea
                className="active-service-notes"
                value={notes}
                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }
                placeholder="Describe the issue found, work performed, parts replaced and any additional information..."
              />

            </section>


            {/* =================================================
                PHOTO
            ================================================= */}

            <section className="active-service-card">

              <div className="active-service-card-heading">

                <div>

                  <span>
                    SERVICE EVIDENCE
                  </span>

                  <h2>
                    Work Photo
                  </h2>

                </div>

              </div>


              <label className="active-service-camera">

                <Camera size={23} />

                <strong>
                  Take Service Photo
                </strong>

                <span>
                  Capture the completed work
                  for customer transparency.
                </span>


                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={
                    handlePhoto
                  }
                  hidden
                />

              </label>


              {photo && (

                <div className="active-service-photo-preview">

                  <img
                    src={photo}
                    alt="Service work"
                  />

                  <div>
                    <CheckCircle2 size={15} />

                    Photo captured successfully

                  </div>

                </div>

              )}

            </section>

          </div>


          {/* =================================================
              RIGHT
          ================================================= */}

          <aside>


            {/* =================================================
                CUSTOMER
            ================================================= */}

            <section className="active-service-side-card">

              <div className="active-service-side-icon">
                <UserRound size={20} />
              </div>

              <span>
                CUSTOMER
              </span>

              <h2>
                Adhil
              </h2>

              <p>
                Customer verification completed.
              </p>


              <div className="active-service-verified">

                <ShieldCheck size={15} />

                Start OTP Verified

              </div>


              <div className="active-service-side-actions">

                <button
                  onClick={() => {
                    window.location.href =
                      "tel:+919363965359";
                  }}
                >

                  <Phone size={15} />

                  Call

                </button>


                <button
                  onClick={() => {
                    window.open(
                      "https://www.google.com/maps/search/?api=1&query=Anna%20Nagar%2C%20Chennai",
                      "_blank"
                    );
                  }}
                >

                  <Navigation size={15} />

                  Navigate

                </button>

              </div>

            </section>


            {/* =================================================
                BILL PREVIEW
            ================================================= */}

            <section className="active-service-bill-card">

              <div className="active-service-bill-heading">

                <ReceiptText size={19} />

                <div>

                  <span>
                    BILL PREVIEW
                  </span>

                  <h2>
                    Estimated Bill
                  </h2>

                </div>

              </div>


              <div className="active-service-bill-row">

                <span>
                  Service Charge
                </span>

                <strong>
                  ₹{serviceCharge}
                </strong>

              </div>


              <div className="active-service-bill-row">

                <span>
                  Parts
                </span>

                <strong>
                  ₹{partsTotal}
                </strong>

              </div>


              <div className="active-service-bill-total">

                <span>
                  ESTIMATED TOTAL
                </span>

                <strong>
                  ₹{estimatedTotal}
                </strong>

              </div>


              <div className="active-service-bill-note">

                <ShieldCheck size={14} />

                Final bill will be shown to the
                customer before the End OTP.

              </div>

            </section>


            {/* =================================================
                COMPLETE
            ================================================= */}

            <button
              className="active-service-complete-button"
              onClick={
                handleCompleteService
              }
            >

              <CheckCircle2 size={18} />

              Complete Service

            </button>


            <p className="active-service-complete-note">

              The customer will receive the
              End OTP after the final bill is
              prepared.

            </p>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default ActiveService;