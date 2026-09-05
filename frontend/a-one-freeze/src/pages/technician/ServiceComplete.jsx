import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Snowflake,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  ReceiptText,
  UserRound,
  Wrench,
  Clock3,
  QrCode,
  CreditCard,
  AlertCircle,
  IndianRupee,
} from "lucide-react";

import {
  recordCustomerPayment,
  getTechnicianAccount,
} from "../../utils/commissionService";

import { QRCodeSVG } from "qrcode.react";
import serviceStore from "../../services/serviceStore";


function ServiceComplete() {

  const navigate = useNavigate();

  const { bookingId } = useParams();


  // =====================================================
  // STATE
  // =====================================================

  const [serviceData, setServiceData] =
    useState(null);

  const [storeBooking, setStoreBooking] =
    useState(null);

  const [endOtp, setEndOtp] =
    useState("");

  const [otpVerified, setOtpVerified] =
    useState(false);

  const [paymentCompleted, setPaymentCompleted] =
    useState(false);

  const [paymentResult, setPaymentResult] =
    useState(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // LOAD SERVICE DATA
  // =====================================================

  useEffect(() => {
    const loadData = () => {
      const currentBooking = bookingId
        ? serviceStore.getBookingById(bookingId)
        : null;

      setStoreBooking(currentBooking || null);

      const savedData = localStorage.getItem(
        "completedServiceData"
      );

      let parsed = null;

      if (savedData) {
        try {
          parsed = JSON.parse(savedData);
        } catch (err) {
          console.error(
            "Unable to read completed service data:",
            err
          );
        }
      }

      if (currentBooking) {
        const parts = Array.isArray(currentBooking.parts)
          ? currentBooking.parts
          : Array.isArray(parsed?.parts)
            ? parsed.parts
            : [];

        const serviceCharge = Number(
          currentBooking.amount ??
          currentBooking.servicePrice ??
          parsed?.serviceCharge ??
          parsed?.servicePrice ??
          0
        );

        const partsTotal = parts.reduce(
          (sum, part) =>
            sum + Number(part.price || part.amount || 0),
          0
        );

        const merged = {
          ...(parsed || {}),
          bookingId: currentBooking.id,
          customerName:
            currentBooking.customerName ||
            parsed?.customerName ||
            "Customer",
          customerPhone:
            currentBooking.customerPhone ||
            parsed?.customerPhone ||
            "",
          serviceName:
            currentBooking.serviceName ||
            parsed?.serviceName ||
            "Service",
          serviceAddress:
            currentBooking.address ||
            currentBooking.service_address ||
            parsed?.serviceAddress ||
            "",
          serviceCharge,
          servicePrice: serviceCharge,
          parts,
          partsTotal,
          estimatedTotal: serviceCharge + partsTotal,
          duration:
            currentBooking.durationSeconds ??
            parsed?.duration ??
            0,
        };

        setServiceData(merged);
        localStorage.setItem(
          "completedServiceData",
          JSON.stringify(merged)
        );
        return;
      }

      if (parsed) {
        setServiceData(parsed);
      }
    };

    loadData();
    return serviceStore.subscribe(loadData);
  }, [bookingId]);


  // =====================================================
  // DEMO END OTP
  // =====================================================

  useEffect(() => {

    let savedEndOtp =
      localStorage.getItem(
        "serviceEndOtp"
      );


    if (!savedEndOtp) {

      savedEndOtp =
        String(
          Math.floor(
            100000 +
            Math.random() * 900000
          )
        );


      localStorage.setItem(
        "serviceEndOtp",
        savedEndOtp
      );

    }


    console.log(
      "DEMO SERVICE END OTP:",
      savedEndOtp
    );

  }, []);


  // =====================================================
  // SERVICE INFORMATION
  // =====================================================

  const finalBookingId =
    bookingId ||
    localStorage.getItem(
      "activeServiceBooking"
    ) ||
    "AOF-2026-00124";


  const customerName =
    serviceData?.customerName ||
    localStorage.getItem(
      "customerName"
    ) ||
    "Adhil";


  const serviceName =
    serviceData?.serviceName ||
    localStorage.getItem(
      "selectedServiceName"
    ) ||
    "AC Repair & Service";


  const serviceAddress =
    serviceData?.serviceAddress ||
    localStorage.getItem(
      "serviceAddress"
    ) ||
    "Anna Nagar, Chennai";


  // =====================================================
  // BILL
  // =====================================================

  const serviceCharge = Number(
    serviceData?.serviceCharge ??
    serviceData?.servicePrice ??
    storeBooking?.amount ??
    storeBooking?.servicePrice ??
    0
  );

  const parts = Array.isArray(serviceData?.parts)
    ? serviceData.parts
    : Array.isArray(storeBooking?.parts)
      ? storeBooking.parts
      : [];

  const partsTotal = parts.reduce(
    (sum, part) =>
      sum + Number(part.price || part.amount || 0),
    0
  );

  const finalTotal =
    serviceCharge + partsTotal;


  // =====================================================
  // FORMAT DURATION
  // =====================================================

  const formatDuration = (
    seconds = 0
  ) => {

    const hours =
      Math.floor(
        seconds / 3600
      );

    const minutes =
      Math.floor(
        (seconds % 3600) / 60
      );

    const secs =
      seconds % 60;


    return [
      hours,
      minutes,
      secs,
    ]
      .map(
        (value) =>
          String(value).padStart(
            2,
            "0"
          )
      )
      .join(":");

  };


  // =====================================================
  // VERIFY END OTP
  // =====================================================

  const handleVerifyEndOtp = () => {

    setError("");

    if (
      endOtp.length !== 6
    ) {

      setError(
        "Please enter the 6-digit End OTP."
      );

      return;
    }


    const customerEndOtp =
      storeBooking?.endOtp ||
      localStorage.getItem(
        "serviceEndOtp"
      );


    if (!customerEndOtp) {

      setError(
        "End OTP could not be found."
      );

      return;
    }


    if (
      endOtp !== customerEndOtp
    ) {

      setError(
        "Incorrect End OTP. Please ask the customer for the correct OTP."
      );

      return;
    }


    setOtpVerified(true);

    // Mark the exact booking as completed in the reactive store.
    // Earnings are recorded only when payment is recorded.
    if (storeBooking) {
      try {
        serviceStore.verifyEndOtp(
          finalBookingId,
          endOtp
        );
      } catch (err) {
        console.warn(
          "Booking completion sync skipped:",
          err
        );
      }
    }

    localStorage.setItem(
      "serviceEndOtpVerified",
      "true"
    );


    localStorage.setItem(
      "serviceStatus",
      "PAYMENT_PENDING"
    );

  };


  // =====================================================
  // PAYMENT QR
  // =====================================================

  const paymentData =
    `upi://pay?pa=aonefreeze@upi&pn=A-ONE%20Freeze&am=${finalTotal}&cu=INR&tn=Service%20${finalBookingId}`;


  // =====================================================
  // RECORD CUSTOMER PAYMENT
  // =====================================================

  const handlePaymentReceived = () => {

    if (!otpVerified) {

      setError(
        "Please verify the customer's End OTP first."
      );

      return;
    }


    if (paymentCompleted) {

      return;
    }


    setLoading(true);

    setError("");


    try {

      const result =
        recordCustomerPayment({

          bookingId:
            finalBookingId,

          customerName:
            customerName,

          serviceName:
            serviceName,

          paymentAmount:
            finalTotal,

        });

      // Keep the reactive booking store in sync with the paid bill.
      serviceStore.recordPayment(
        finalBookingId,
        "UPI"
      );


      console.log(
        "PAYMENT RESULT:",
        result
      );


      const account =
        getTechnicianAccount();


      console.log(
        "TECHNICIAN ACCOUNT:",
        account
      );


      setPaymentResult(result);

      setPaymentCompleted(true);


      localStorage.setItem(
        "serviceStatus",
        "COMPLETED"
      );


      localStorage.setItem(
        "paymentStatus",
        "PAID"
      );


      localStorage.setItem(
        "servicePaymentAmount",
        String(finalTotal)
      );


      localStorage.setItem(
        "serviceCompletedAt",
        new Date().toISOString()
      );


      localStorage.setItem(
        "lastCompletedBooking",
        finalBookingId
      );


    } catch (err) {

      console.error(
        "Payment recording failed:",
        err
      );


      setError(
        "Unable to record payment. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // BACK TO ACTIVE WORK
  // =====================================================

  const handleBackToActive =
    () => {

      navigate(
        `/technician/service/${finalBookingId}/active`
      );

    };


  // =====================================================
  // GO DASHBOARD
  // =====================================================

  const handleDashboard =
    () => {

      navigate(
        "/technician/dashboard"
      );

    };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div
      className="service-complete-page"
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className="service-complete-header"
      >

        <button
          className="service-complete-back"
          onClick={
            handleBackToActive
          }
        >

          <ArrowLeft
            size={17}
          />

          Active Service

        </button>


        <div
          className="service-complete-brand"
        >

          <div>

            <Snowflake
              size={20}
            />

          </div>

          <span>
            A-ONE FREEZE
          </span>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main
        className="service-complete-main"
      >

        {/* TITLE */}

        <div
          className="service-complete-title"
        >

          <div>

            <span>
              SERVICE COMPLETION
            </span>

            <h1>
              Final Bill & Verification
            </h1>

            <p>
              Confirm the final service amount
              before closing the booking.
            </p>

          </div>


          <div
            className="service-complete-booking"
          >

            <span>
              BOOKING ID
            </span>

            <strong>
              {finalBookingId}
            </strong>

          </div>

        </div>


        {/* =================================================
            GRID
        ================================================= */}

        <div
          className="service-complete-grid"
        >


          {/* =================================================
              FINAL BILL
          ================================================= */}

          <section
            className="service-final-bill"
          >

            <div
              className="service-complete-card-heading"
            >

              <div
                className="service-complete-heading-icon"
              >

                <ReceiptText
                  size={19}
                />

              </div>


              <div>

                <span>
                  FINAL INVOICE
                </span>

                <h2>
                  Service Bill
                </h2>

              </div>

            </div>


            {/* CUSTOMER */}

            <div
              className="service-bill-customer"
            >

              <div
                className="service-bill-avatar"
              >
                {customerName
                  ?.charAt(0)
                  ?.toUpperCase() || "A"}
              </div>


              <div>

                <strong>
                  {customerName}
                </strong>

                <span>
                  Customer
                </span>

              </div>

            </div>


            {/* SERVICE */}

            <div
              className="service-bill-row"
            >

              <span>
                {serviceName}
              </span>

              <strong>
                ₹{serviceCharge}
              </strong>

            </div>


            {/* PARTS */}

            <div
              className="service-bill-row"
            >

              <span>
                Parts & Materials
              </span>

              <strong>
                ₹{partsTotal}
              </strong>

            </div>


            {/* PART DETAILS */}

            {parts.length > 0 && (

              <div
                className="service-bill-parts"
              >

                {parts.map(
                  (part) => (

                    <div
                      key={part.id}
                    >

                      <span>
                        {part.name}
                      </span>

                      <strong>
                        ₹{part.price}
                      </strong>

                    </div>

                  )
                )}

              </div>

            )}


            {/* ADDRESS */}

            <div
              style={{
                marginTop: "18px",
                padding: "12px",
                borderRadius: "10px",
                background: "#f7fbfd",
                fontSize: "12px",
                color: "#78909c",
              }}
            >

              📍 {serviceAddress}

            </div>


            {/* DURATION */}

            <div
              className="service-bill-duration"
            >

              <Clock3
                size={15}
              />

              <span>
                Service duration
              </span>

              <strong>
                {formatDuration(
                  serviceData?.duration
                )}
              </strong>

            </div>


            {/* TOTAL */}

            <div
              className="service-final-total"
            >

              <span>
                FINAL TOTAL
              </span>

              <strong>
                ₹{finalTotal}
              </strong>

            </div>


            {/* SECURITY */}

            <div
              className="service-bill-security"
            >

              <ShieldCheck
                size={15}
              />

              <span>
                Customer must confirm the
                final bill using the End OTP.
              </span>

            </div>

          </section>


          {/* =================================================
              END OTP
          ================================================= */}

          <section
            className="service-end-otp-card"
          >

            {!otpVerified ? (

              <>

                <div
                  className="service-end-otp-heading"
                >

                  <div>
                    🔴
                  </div>

                  <span>
                    FINAL VERIFICATION
                  </span>

                </div>


                <h2>
                  Customer End OTP
                </h2>


                <p>
                  Show the final bill to the
                  customer and ask for their
                  <strong> End OTP </strong>
                  to confirm that the service
                  is complete.
                </p>


                {/* AMOUNT */}

                <div
                  className="service-end-bill-confirm"
                >

                  <IndianRupee
                    size={18}
                  />

                  <div>

                    <span>
                      FINAL AMOUNT
                    </span>

                    <strong>
                      ₹{finalTotal}
                    </strong>

                  </div>

                </div>


                {/* INPUT */}

                <label>
                  ENTER CUSTOMER END OTP
                </label>


                <input
                  className="service-end-otp-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={endOtp}
                  placeholder="000000"
                  onChange={(e) => {

                    const value =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setEndOtp(value);
                    setError("");

                  }}
                />


                {/* ERROR */}

                {error && (

                  <div
                    className="service-end-error"
                  >

                    <AlertCircle
                      size={14}
                    />

                    <span>
                      {error}
                    </span>

                  </div>

                )}


                {/* VERIFY */}

                <button
                  className="service-end-verify"
                  onClick={
                    handleVerifyEndOtp
                  }
                >

                  <ShieldCheck
                    size={17}
                  />

                  Verify End OTP

                </button>


                <div
                  className="service-end-security"
                >

                  <ShieldCheck
                    size={14}
                  />

                  <span>
                    End OTP confirms that the
                    customer accepts the final
                    service completion.
                  </span>

                </div>

              </>

            ) : (

              <div
                className="service-end-verified"
              >

                <div
                  className="service-end-success-icon"
                >

                  <CheckCircle2
                    size={38}
                  />

                </div>


                <span
                  className="service-end-verified-label"
                >
                  END OTP VERIFIED
                </span>


                <h2>
                  Service confirmed ✓
                </h2>


                <p>
                  The customer has confirmed the
                  final bill and service completion.
                </p>


                <div
                  className="service-end-confirmed-box"
                >

                  <CheckCircle2
                    size={16}
                  />

                  Customer confirmation successful

                </div>


                <div
                  style={{
                    marginTop: "20px",
                    padding: "14px",
                    borderRadius: "12px",
                    background: "#f4f9fc",
                    textAlign: "center",
                  }}
                >

                  <strong
                    style={{
                      display: "block",
                      color: "#173b53",
                      fontSize: "13px",
                    }}
                  >
                    Final Amount
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: "5px",
                      fontSize: "25px",
                      fontWeight: "900",
                      color: "#087ea4",
                    }}
                  >
                    ₹{finalTotal}
                  </span>

                </div>

              </div>

            )}

          </section>

        </div>


        {/* =================================================
            PAYMENT SECTION
        ================================================= */}

        {otpVerified && (

          <section
            className="service-payment-card"
          >

            <div
              className="service-payment-heading"
            >

              <div
                className="service-payment-icon"
              >

                <QrCode
                  size={20}
                />

              </div>


              <div>

                <span>
                  CUSTOMER PAYMENT
                </span>

                <h2>
                  Scan & Pay
                </h2>

              </div>

            </div>


            {!paymentCompleted ? (

              <>

                <div
                  className="service-payment-content"
                >

                  {/* QR */}

                  <div
                    className="service-qr-wrapper"
                  >

                    <QRCodeSVG
                      value={
                        paymentData
                      }
                      size={190}
                      bgColor="#ffffff"
                      fgColor="#173b53"
                      level="H"
                    />

                  </div>


                  {/* PAYMENT DETAILS */}

                  <div
                    className="service-payment-details"
                  >

                    <span>
                      AMOUNT TO PAY
                    </span>

                    <strong>
                      ₹{finalTotal}
                    </strong>


                    <p>
                      Ask the customer to scan
                      this QR code using their
                      UPI payment application.
                    </p>


                    <div
                      className="service-payment-method"
                    >

                      <CreditCard
                        size={16}
                      />

                      <span>
                        UPI Payment
                      </span>

                    </div>


                    <div
                      className="service-payment-security"
                    >

                      <ShieldCheck
                        size={15}
                      />

                      <span>
                        Payment is handled securely
                        through the customer's UPI app.
                      </span>

                    </div>

                  </div>

                </div>


                {/* PAYMENT CONFIRMATION */}

                <div
                  style={{
                    marginTop: "25px",
                    padding: "15px",
                    borderRadius: "12px",
                    background: "#fffaf0",
                    border: "1px solid #f3dfb3",
                    color: "#8a6a20",
                    fontSize: "12px",
                  }}
                >

                  ⚠️ Only confirm payment after
                  receiving the customer's successful
                  payment confirmation.

                </div>


                {error && (

                  <div
                    className="service-end-error"
                    style={{
                      marginTop: "15px",
                    }}
                  >

                    <AlertCircle
                      size={14}
                    />

                    <span>
                      {error}
                    </span>

                  </div>

                )}


                <button
                  className="service-complete-final-button"
                  onClick={
                    handlePaymentReceived
                  }
                  disabled={loading}
                  style={{
                    opacity:
                      loading ? 0.6 : 1,
                    cursor:
                      loading
                        ? "not-allowed"
                        : "pointer",
                  }}
                >

                  <CheckCircle2
                    size={17}
                  />

                  {loading
                    ? "Recording Payment..."
                    : "Confirm Payment Received"}

                </button>

              </>

            ) : (

              /* =================================================
                 PAYMENT SUCCESS
              ================================================= */

              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                }}
              >

                <div
                  className="service-end-success-icon"
                  style={{
                    margin:
                      "0 auto 18px",
                  }}
                >

                  <CheckCircle2
                    size={38}
                  />

                </div>


                <span
                  className="service-end-verified-label"
                >
                  PAYMENT SUCCESSFUL
                </span>


                <h2>
                  ₹{finalTotal} received ✓
                </h2>


                <p
                  style={{
                    color: "#78909c",
                    lineHeight: "1.6",
                  }}
                >
                  The customer payment has been
                  recorded successfully.
                </p>


                {/* COMMISSION INFO */}

                {paymentResult && (

                  <div
                    style={{
                      margin:
                        "22px auto",
                      maxWidth:
                        "500px",
                      padding:
                        "18px",
                      borderRadius:
                        "14px",
                      background:
                        "#f4f9fc",
                      textAlign:
                        "left",
                    }}
                  >

                    <strong
                      style={{
                        display:
                          "block",
                        marginBottom:
                          "12px",
                        color:
                          "#173b53",
                      }}
                    >
                      Technician Earnings
                    </strong>


                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        padding:
                          "7px 0",
                        color:
                          "#78909c",
                      }}
                    >

                      <span>
                        Customer Payment
                      </span>

                      <strong
                        style={{
                          color:
                            "#173b53",
                        }}
                      >
                        ₹{finalTotal}
                      </strong>

                    </div>


                    {paymentResult.commission !==
                      undefined && (

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          padding:
                            "7px 0",
                          color:
                            "#78909c",
                        }}
                      >

                        <span>
                          App Commission
                        </span>

                        <strong
                          style={{
                            color:
                              "#d56b32",
                          }}
                        >
                          ₹
                          {
                            paymentResult.commission
                          }
                        </strong>

                      </div>

                    )}


                    {paymentResult.technicianEarning !==
                      undefined && (

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          padding:
                            "10px 0 0",
                          marginTop:
                            "8px",
                          borderTop:
                            "1px solid #dfeaf0",
                        }}
                      >

                        <span>
                          Technician Earning
                        </span>

                        <strong
                          style={{
                            color:
                              "#18845e",
                            fontSize:
                              "16px",
                          }}
                        >
                          ₹
                          {
                            paymentResult.technicianEarning
                          }
                        </strong>

                      </div>

                    )}

                  </div>

                )}


                <button
                  className="service-complete-final-button"
                  onClick={
                    handleDashboard
                  }
                >

                  <CheckCircle2
                    size={17}
                  />

                  Finish & Go to Dashboard

                </button>

              </div>

            )}

          </section>

        )}


        {/* =================================================
            SERVICE FLOW
        ================================================= */}

        <section
          className="service-complete-flow"
        >

          <div>

            <span>
              SERVICE WORKFLOW
            </span>

            <h2>
              Transparent completion process
            </h2>

          </div>


          <div
            className="service-complete-steps"
          >

            <div
              className="service-complete-step done"
            >

              <div>
                ✓
              </div>

              <span>
                Start OTP
              </span>

            </div>


            <div
              className="service-complete-line"
            />


            <div
              className="service-complete-step done"
            >

              <div>
                ✓
              </div>

              <span>
                Service
              </span>

            </div>


            <div
              className="service-complete-line"
            />


            <div
              className={`service-complete-step ${
                otpVerified
                  ? "done"
                  : "active"
              }`}
            >

              <div>
                {otpVerified
                  ? "✓"
                  : "3"}
              </div>

              <span>
                End OTP
              </span>

            </div>


            <div
              className="service-complete-line"
            />


            <div
              className={`service-complete-step ${
                paymentCompleted
                  ? "done"
                  : otpVerified
                  ? "active"
                  : ""
              }`}
            >

              <div>
                {paymentCompleted
                  ? "✓"
                  : "4"}
              </div>

              <span>
                Payment
              </span>

            </div>


            <div
              className="service-complete-line"
            />


            <div
              className={`service-complete-step ${
                paymentCompleted
                  ? "done"
                  : ""
              }`}
            >

              <div>
                {paymentCompleted
                  ? "✓"
                  : "5"}
              </div>

              <span>
                Completed
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>

  );
}


export default ServiceComplete;