import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Snowflake,
  UserRound,
  Phone,
  Mail,
  MapPin,
  Wrench,
  Upload,
  Camera,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  FileText,
  CreditCard,
} from "lucide-react";


function TechnicianRegister() {
  const navigate = useNavigate();

  /* =====================================================
     FORM DATA
  ===================================================== */

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    specialization: "",
  });

  /* =====================================================
     DOCUMENTS
  ===================================================== */

  const [aadhaarFile, setAadhaarFile] = useState(null);
const [panFile, setPanFile] = useState(null);

const [aadhaarStatus, setAadhaarStatus] = useState("idle");
const [panStatus, setPanStatus] = useState("idle");

const [aadhaarMessage, setAadhaarMessage] = useState("");
const [panMessage, setPanMessage] = useState("");

const [checkingDocument, setCheckingDocument] = useState("");

  /* =====================================================
     CAMERA
  ===================================================== */

  const [livePhoto, setLivePhoto] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  /* =====================================================
     SUBMISSION
  ===================================================== */

  const [submitted, setSubmitted] = useState(false);

  /* =====================================================
     FORM INPUT
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     AADHAAR
  ===================================================== */

  const handleAadhaarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAadhaarFile(file);

    // TEMPORARILY DISABLED:
    // Aadhaar OCR/document-type verification will be restored later.
    setAadhaarStatus("valid");
    setAadhaarMessage(
      "Aadhaar uploaded successfully. Verification will be completed later."
    );
  };

  /* =====================================================
     PAN
  ===================================================== */

  const handlePanChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setPanFile(file);

    // TEMPORARILY DISABLED:
    // PAN OCR/document-type verification will be restored later.
    setPanStatus("valid");
    setPanMessage(
      "PAN uploaded successfully. Verification will be completed later."
    );
  };

  /* =====================================================
     OPEN CAMERA
  ===================================================== */

  const openCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert(
          "Camera access is not supported by this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

      streamRef.current = stream;

      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);

    } catch (error) {
      console.error("Camera error:", error);

      alert(
        "Camera permission is required. Please allow camera access in your browser."
      );
    }
  };

  /* =====================================================
     CAPTURE PHOTO
  ===================================================== */

  const capturePhoto = () => {
    if (!videoRef.current) {
      return;
    }

    const video = videoRef.current;

    if (
      !video.videoWidth ||
      !video.videoHeight
    ) {
      alert(
        "Camera is not ready yet. Please wait a moment."
      );
      return;
    }

    const canvas =
      document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      alert("Unable to capture photo.");
      return;
    }

    /*
      The preview is mirrored using CSS.
      We mirror the captured image too so
      the preview looks natural.
    */

    context.translate(
      canvas.width,
      0
    );

    context.scale(-1, 1);

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          alert("Unable to create photo.");
          return;
        }

        const photoFile = new File(
          [blob],
          "technician-live-photo.jpg",
          {
            type: "image/jpeg",
          }
        );

        setLivePhoto(photoFile);

        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  /* =====================================================
     STOP CAMERA
  ===================================================== */

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  };

  /* =====================================================
     SUBMIT REGISTRATION
  ===================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Please enter your mobile number.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!formData.specialization) {
      alert("Please select your specialization.");
      return;
    }

    if (!formData.address.trim()) {
      alert("Please enter your current address.");
      return;
    }

    if (!aadhaarFile) {
      alert("Please upload your Aadhaar card.");
      return;
    }

    if (!panFile) {
      alert("Please upload your PAN card.");
      return;
    }

    if (!livePhoto) {
      alert("Please capture your live photo.");
      return;
    }

    setSubmitted(true);
  };

  /* =====================================================
     SUCCESS SCREEN
  ===================================================== */

  if (submitted) {
    return (
      <div className="technician-register-page">

        {/* NAVBAR */}

        <nav className="technician-register-nav">

          <div
            className="technician-brand"
            onClick={() =>
              navigate("/customer")
            }
          >

            <div className="technician-brand-icon">
              <Snowflake size={22} />
            </div>

            <div>
              <strong>A-ONE</strong>
              <span>FREEZE</span>
            </div>

          </div>


          <div className="verification-pill">

            <ShieldCheck size={16} />

            Verification Process

          </div>

        </nav>


        {/* SUCCESS */}

        <main className="registration-success">

          <div className="registration-success-icon">

            <CheckCircle2 size={48} />

          </div>


          <span className="registration-success-label">
            APPLICATION SUBMITTED
          </span>


          <h1>
            You're almost ready
            <span> to get started.</span>
          </h1>


          <p>
            Your technician registration has been
            submitted successfully. Our verification
            team will review your details and documents.
          </p>


          {/* STATUS */}

          <div className="verification-status-card">

            {/* STEP 1 */}

            <div className="status-row">

              <div className="status-icon completed">

                <CheckCircle2 size={18} />

              </div>

              <div>

                <strong>
                  Registration submitted
                </strong>

                <span>
                  Your application has been received.
                </span>

              </div>

              <b>
                DONE
              </b>

            </div>


            <div className="status-line"></div>


            {/* STEP 2 */}

            <div className="status-row">

              <div className="status-icon pending">

                <ShieldCheck size={18} />

              </div>

              <div>

                <strong>
                  Document verification
                </strong>

                <span>
                  Aadhaar, PAN and photo will be reviewed.
                </span>

              </div>

              <b>
                WAITING
              </b>

            </div>


            <div className="status-line"></div>


            {/* STEP 3 */}

            <div className="status-row">

              <div className="status-icon waiting">

                <UserRound size={18} />

              </div>

              <div>

                <strong>
                  Account activation
                </strong>

                <span>
                  Dashboard access after approval.
                </span>

              </div>

              <b>
                LOCKED
              </b>

            </div>

          </div>


          {/* LOGIN */}

          <button
            className="registration-home-button"
            onClick={() =>
              navigate("/technician/login")
            }
          >

            Go to Technician Login

            <ArrowRight size={18} />

          </button>


          {/* EDIT */}

          <button
            className="registration-back-button"
            onClick={() =>
              setSubmitted(false)
            }
          >
            Edit registration
          </button>

        </main>

      </div>
    );
  }


  /* =====================================================
     MAIN REGISTRATION PAGE
  ===================================================== */

  return (
    <div className="technician-register-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="technician-register-nav">

        <div
          className="technician-brand"
          onClick={() =>
            navigate("/customer")
          }
        >

          <div className="technician-brand-icon">

            <Snowflake size={22} />

          </div>


          <div>

            <strong>A-ONE</strong>

            <span>FREEZE</span>

          </div>

        </div>


        <div className="verification-pill">

          <ShieldCheck size={16} />

          Secure Registration

        </div>

      </nav>


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="technician-register-header">

        <div className="register-eyebrow">

          <span></span>

          JOIN A-ONE FREEZE

          <span></span>

        </div>


        <h1>

          Become a
          <span> service professional.</span>

        </h1>


        <p>

          Join our technician network and connect
          with customers who need your expertise.

        </p>

      </header>


      {/* =================================================
          FORM
      ================================================= */}

      <main className="technician-register-container">

        <form
          className="technician-register-form"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              STEP 01 - PERSONAL DETAILS
          ================================================= */}

          <section className="register-section">

            <div className="register-section-heading">

              <div className="register-heading-icon">

                <UserRound size={19} />

              </div>


              <div>

                <span>
                  STEP 01
                </span>

                <h2>
                  Personal details
                </h2>

              </div>

            </div>


            <div className="register-input-grid">

              {/* NAME */}

              <div className="register-input">

                <label>

                  <UserRound size={14} />

                  Full name

                </label>


                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />

              </div>


              {/* PHONE */}

              <div className="register-input">

                <label>

                  <Phone size={14} />

                  Mobile number

                </label>


                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                />

              </div>


              {/* EMAIL */}

              <div className="register-input">

                <label>

                  <Mail size={14} />

                  Email address

                </label>


                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />

              </div>


              {/* SPECIALIZATION */}

              <div className="register-input">

                <label>

                  <Wrench size={14} />

                  Service specialization

                </label>


                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                >

                  <option value="">
                    Select specialization
                  </option>

                  <option value="Air Conditioner">
                    Air Conditioner
                  </option>

                  <option value="Refrigerator">
                    Refrigerator
                  </option>

                  <option value="Washing Machine">
                    Washing Machine
                  </option>

                  <option value="Air Cooler">
                    Air Cooler
                  </option>

                  <option value="All Appliances">
                    All Appliances
                  </option>

                </select>

              </div>

            </div>


            {/* ADDRESS */}

            <div className="register-input full">

              <label>

                <MapPin size={14} />

                Current address

              </label>


              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
              />

            </div>

          </section>


          {/* =================================================
              STEP 02 - DOCUMENT VERIFICATION
          ================================================= */}

          <section className="register-section">

            <div className="register-section-heading">

              <div className="register-heading-icon">

                <ShieldCheck size={19} />

              </div>


              <div>

                <span>
                  STEP 02
                </span>

                <h2>
                  Identity verification
                </h2>

              </div>

            </div>


            <p className="document-description">

              Upload clear documents for verification.
              Your documents should be readable and valid.

            </p>


            <div className="document-grid">

              {/* AADHAAR */}

              <label className="document-upload">

                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleAadhaarChange}
                />


                <div className="document-icon">

                  <CreditCard size={22} />

                </div>


                <div className="document-content">

                    <strong>
                        Aadhaar Card
                    </strong>

                    <span>
                        {aadhaarFile
                        ? aadhaarFile.name
                        : "JPG, PNG or PDF"}
                    </span>

                    {aadhaarStatus === "checking" && (
                        <small className="document-checking">
                        🔍 Checking document...
                        </small>
                    )}

                    {aadhaarStatus === "valid" && (
                        <small className="document-valid">
                        ✓ {aadhaarMessage}
                        </small>
                    )}

                    {aadhaarStatus === "wrong" && (
                        <small className="document-invalid">
                        ✕ {aadhaarMessage}
                        </small>
                    )}

                    {aadhaarStatus === "unknown" && (
                        <small className="document-warning">
                        ⚠ {aadhaarMessage}
                        </small>
                    )}

                    </div>


                {aadhaarFile ? (

                  <CheckCircle2
                    className="document-check"
                    size={20}
                  />

                ) : (

                  <Upload
                    className="document-upload-icon"
                    size={19}
                  />

                )}

              </label>


              {/* PAN */}

              <label className="document-upload">

                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handlePanChange}
                />


                <div className="document-icon pan">

                  <FileText size={22} />

                </div>


                <div className="document-content">

                    <strong>
                        PAN Card
                    </strong>

                    <span>
                        {panFile
                        ? panFile.name
                        : "JPG or PNG"}
                    </span>

                    {panStatus === "checking" && (
                        <small className="document-checking">
                        🔍 Checking document...
                        </small>
                    )}

                    {panStatus === "valid" && (
                        <small className="document-valid">
                        ✓ {panMessage}
                        </small>
                    )}

                    {panStatus === "wrong" && (
                        <small className="document-invalid">
                        ✕ {panMessage}
                        </small>
                    )}

                    {panStatus === "unknown" && (
                        <small className="document-warning">
                        ⚠ {panMessage}
                        </small>
                    )}

                    </div>


                {panFile ? (

                  <CheckCircle2
                    className="document-check"
                    size={20}
                  />

                ) : (

                  <Upload
                    className="document-upload-icon"
                    size={19}
                  />

                )}

              </label>

            </div>

          </section>


          {/* =================================================
              STEP 03 - LIVE CAMERA
          ================================================= */}

          <section className="register-section">

            <div className="register-section-heading">

              <div className="register-heading-icon">

                <Camera size={19} />

              </div>


              <div>

                <span>
                  STEP 03
                </span>

                <h2>
                  Live photo verification
                </h2>

              </div>

            </div>


            <p className="document-description">

              Take a live photo using your device camera.
              A normal uploaded image cannot be used.

            </p>


            {/* CAMERA OPEN BUTTON */}

            {!cameraOpen && !livePhoto && (

              <div className="camera-only-box">

                <div className="camera-large-icon">

                  <Camera size={32} />

                </div>


                <strong>
                  Take your live photo
                </strong>


                <span>

                  Your camera will open and capture
                  a fresh photo for verification.

                </span>


                <button
                  type="button"
                  className="open-camera-button"
                  onClick={openCamera}
                >

                  <Camera size={18} />

                  Open Camera

                </button>

              </div>

            )}


            {/* CAMERA VIEW */}

            {cameraOpen && (
  <div className="professional-camera">

    {/* CAMERA PREVIEW */}

    <div className="camera-preview-area">

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="professional-camera-video"
      />

      {/* DARK OVERLAY */}

      <div className="camera-dark-overlay"></div>


      {/* FACE GUIDE */}

      <div className="face-position-guide">

        <div className="face-oval">

          <div className="face-corner top-left"></div>
          <div className="face-corner top-right"></div>
          <div className="face-corner bottom-left"></div>
          <div className="face-corner bottom-right"></div>

        </div>


        <div className="face-instruction">

          <span className="face-status-dot"></span>

          Position your face inside the frame

        </div>

      </div>


      {/* TOP STATUS */}

      <div className="camera-top-status">

        <div className="live-indicator">
          <span></span>
          LIVE
        </div>

        <div className="camera-security">
          <ShieldCheck size={14} />
          Secure verification
        </div>

      </div>


      {/* CAMERA SIDE CONTROLS */}

      <div className="camera-side-controls">

        <button
          type="button"
          className="camera-capture-main"
          onClick={capturePhoto}
          aria-label="Capture live photo"
        >

          <span className="capture-inner">
            <Camera size={25} />
          </span>

        </button>


        <span className="capture-label">
          Capture
        </span>


        <button
          type="button"
          className="camera-cancel"
          onClick={stopCamera}
        >
          Cancel
        </button>

      </div>

    </div>


    {/* CAMERA INSTRUCTION */}

    <div className="camera-bottom-info">

      <div className="camera-tip-icon">
        <UserRound size={18} />
      </div>

      <div>

        <strong>
          Keep your face clearly visible
        </strong>

        <span>
          Look directly at the camera and keep your
          face inside the oval. Make sure you have
          enough lighting.
        </span>

      </div>

    </div>

  </div>
)}


            {/* CAPTURED PHOTO */}

            {livePhoto && !cameraOpen && (

              <div className="captured-photo-box">

                <div className="captured-photo">

                  <img
                    src={URL.createObjectURL(
                      livePhoto
                    )}
                    alt="Technician live verification"
                  />

                </div>


                <div className="captured-photo-info">

                  <div>

                    <CheckCircle2
                      size={19}
                      className="photo-check"
                    />


                    <div>

                      <strong>
                        Live photo captured
                      </strong>


                      <span>
                        Ready for verification
                      </span>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={openCamera}
                  >

                    <Camera size={16} />

                    Retake

                  </button>

                </div>

              </div>

            )}

          </section>


          {/* =================================================
              DECLARATION
          ================================================= */}

          <div className="registration-declaration">

            <ShieldCheck size={19} />


            <p>

              I confirm that the information and
              documents provided by me are genuine.
              I understand that A-ONE Freeze will
              verify these details before activating
              my technician account.

            </p>

          </div>


          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            className="submit-registration"
          >

            <span>
              Submit for verification
            </span>


            <ArrowRight size={20} />

          </button>


          {/* LOGIN */}

          <button
            type="button"
            className="registration-login-button"
            onClick={() =>
              navigate("/technician/login")
            }
          >

            Already registered?

            <strong>
              Technician Login
            </strong>

          </button>


          {/* SECURITY */}

          <div className="registration-security-note">

            <ShieldCheck size={14} />

            Your documents are handled securely
            during verification.

          </div>

        </form>

      </main>

    </div>
  );
}

export default TechnicianRegister;