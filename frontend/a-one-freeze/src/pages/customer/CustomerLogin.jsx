import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Snowflake,
  Phone,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  UserRound,
  CheckCircle2,
} from "lucide-react";

function CustomerLogin() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const [countdown, setCountdown] = useState(0);

  const [error, setError] = useState("");

  const otpInputRef = useRef(null);

  /* =====================================================
     OTP COUNTDOWN
     ===================================================== */

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);


  /* =====================================================
     SEND OTP
     ===================================================== */

  const handleSendOtp = (e) => {
    e.preventDefault();

    setError("");

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    /*
      FRONTEND DEMO

      Later this will call:

      POST /api/auth/customer/send-otp

      The backend will generate and send
      a real OTP through an SMS provider.
    */

    setOtpSent(true);

    setOtp("");

    setCountdown(30);

    setTimeout(() => {
      otpInputRef.current?.focus();
    }, 150);

    /*
      Demo only:
      The actual OTP must NOT be hardcoded
      in the production application.
    */

    console.log(
      "Demo OTP flow started for:",
      cleanPhone
    );
  };


  /* =====================================================
     VERIFY OTP
     ===================================================== */

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError(
        "Please enter the 6-digit OTP."
      );
      return;
    }

    setVerifying(true);

    /*
      FRONTEND DEMO

      Later this will call:

      POST /api/auth/customer/verify-otp

      with:

      {
        phone,
        otp
      }
    */

    setTimeout(() => {

      /*
        Temporary demo verification.

        IMPORTANT:
        This is NOT real OTP authentication.
        Replace with backend verification later.
      */

      setVerifying(false);

      setVerified(true);

      localStorage.setItem(
        "customerLoggedIn",
        "true"
      );

      localStorage.setItem(
        "customerPhone",
        phone
      );

      setTimeout(() => {
        navigate("/customer");
      }, 900);

    }, 700);
  };


  /* =====================================================
     CHANGE NUMBER
     ===================================================== */

  const handleChangeNumber = () => {

    setOtpSent(false);

    setOtp("");

    setError("");

    setCountdown(0);

  };


  /* =====================================================
     RESEND OTP
     ===================================================== */

  const handleResendOtp = () => {

    if (countdown > 0) return;

    setError("");

    setOtp("");

    setCountdown(30);

    /*
      Later:
      API call to resend OTP.
    */

    console.log(
      "Resend OTP requested"
    );
  };


  return (
    <div className="customer-login-page">

      {/* =================================================
          LEFT BRAND SECTION
          ================================================= */}

      <section className="customer-login-visual">

        <div className="customer-login-glow glow-one"></div>

        <div className="customer-login-glow glow-two"></div>


        {/* BRAND */}

        <div className="customer-login-brand">

          <div className="customer-login-logo">
            <Snowflake size={25} />
          </div>

          <div>
            <strong>A-ONE</strong>
            <span>FREEZE</span>
          </div>

        </div>


        {/* HERO */}

        <div className="customer-login-hero">

          <span className="customer-login-label">
            CUSTOMER PORTAL
          </span>

          <h1>
            Service made
            <br />
            <span>simple.</span>
          </h1>

          <p>
            Book trusted appliance services,
            track your technician and manage
            everything from one place.
          </p>


          <div className="customer-login-benefits">

            <div>

              <CheckCircle2 size={16} />

              <span>
                Quick service booking
              </span>

            </div>


            <div>

              <CheckCircle2 size={16} />

              <span>
                Live technician tracking
              </span>

            </div>


            <div>

              <CheckCircle2 size={16} />

              <span>
                Secure OTP login
              </span>

            </div>

          </div>

        </div>


        {/* BOTTOM */}

        <div className="customer-login-bottom">

          <ShieldCheck size={15} />

          Secure customer access

        </div>

      </section>


      {/* =================================================
          RIGHT LOGIN
          ================================================= */}

      <main className="customer-login-content">

        <div className="customer-login-card">


          {/* MOBILE LOGO */}

          <div className="customer-mobile-logo">

            <Snowflake size={21} />

          </div>


          {/* =================================================
              STEP 1 — PHONE
              ================================================= */}

          {!otpSent && !verified && (

            <>

              <div className="customer-login-heading">

                <span>
                  CUSTOMER LOGIN
                </span>

                <h2>
                  Welcome back
                </h2>

                <p>
                  Enter your mobile number to
                  receive a secure OTP.
                </p>

              </div>


              <form
                className="customer-login-form"
                onSubmit={handleSendOtp}
              >

                <div className="customer-login-input">

                  <label>
                    <Phone size={14} />

                    Mobile number
                  </label>


                  <div className="customer-phone-input">

                    <span>
                      +91
                    </span>

                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => {

                        const value =
                          e.target.value.replace(
                            /\D/g,
                            ""
                          );

                        setPhone(value);

                        setError("");

                      }}
                      placeholder="Enter 10-digit mobile number"
                    />

                  </div>

                </div>


                {error && (

                  <div className="customer-login-error">
                    {error}
                  </div>

                )}


                <button
                  type="submit"
                  className="customer-send-otp-button"
                >

                  <span>
                    Send OTP
                  </span>

                  <ArrowRight size={18} />

                </button>

              </form>

            </>

          )}


          {/* =================================================
              STEP 2 — OTP
              ================================================= */}

          {otpSent && !verified && (

            <>

              <div className="customer-login-heading">

                <div className="customer-otp-icon">

                  <ShieldCheck size={24} />

                </div>

                <span>
                  VERIFY YOUR NUMBER
                </span>

                <h2>
                  Enter OTP
                </h2>

                <p>
                  We've sent a 6-digit verification
                  code to
                  <strong>
                    {" +91 "}{phone}
                  </strong>
                </p>

              </div>


              <form
                className="customer-login-form"
                onSubmit={handleVerifyOtp}
              >

                <div className="customer-otp-input-area">

                  <label>
                    Verification code
                  </label>


                  <input
                    ref={otpInputRef}
                    className="customer-otp-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {

                      const value =
                        e.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setOtp(value);

                      setError("");

                    }}
                    placeholder="000000"
                  />

                </div>


                {error && (

                  <div className="customer-login-error">
                    {error}
                  </div>

                )}


                <button
                  type="submit"
                  className="customer-send-otp-button"
                  disabled={verifying}
                >

                  <span>
                    {verifying
                      ? "Verifying..."
                      : "Verify & Continue"}
                  </span>

                  {verifying ? (
                    <RotateCcw
                      size={17}
                      className="otp-loading"
                    />
                  ) : (
                    <ArrowRight size={18} />
                  )}

                </button>


                <div className="customer-otp-actions">

                  <button
                    type="button"
                    onClick={handleChangeNumber}
                  >
                    Change number
                  </button>


                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0}
                  >

                    {countdown > 0
                      ? `Resend in ${countdown}s`
                      : "Resend OTP"}

                  </button>

                </div>

              </form>

            </>

          )}


          {/* =================================================
              SUCCESS
              ================================================= */}

          {verified && (

            <div className="customer-login-success">

              <div className="customer-success-icon">

                <CheckCircle2 size={35} />

              </div>

              <span>
                VERIFIED
              </span>

              <h2>
                Login successful
              </h2>

              <p>
                Taking you to your customer dashboard...
              </p>

            </div>

          )}


          {/* SECURITY */}

          {!verified && (

            <div className="customer-login-security">

              <ShieldCheck size={14} />

              <span>
                Your mobile number is used only
                for secure account verification.
              </span>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default CustomerLogin;