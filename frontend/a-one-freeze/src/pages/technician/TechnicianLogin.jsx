import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Snowflake,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import "./TechnicianLogin.css";

function TechnicianLogin() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!phone.trim()) {
      setError("Please enter your mobile number.");
      return;
    }

    if (phone.trim().length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:5000/api/auth/technician/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            phone: phone.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "TECHNICIAN LOGIN RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          "Unable to login."
        );
      }

      /*
        ===============================
        GET ACCESS TOKEN
        ===============================
      */

      const token =
        data.access_token ||
        data.token;

      if (!token) {
        console.error(
          "Backend login response:",
          data
        );

        throw new Error(
          "Login successful but access token was not received."
        );
      }

      /*
        ===============================
        CLEAR ONLY OLD TECHNICIAN SESSION
        CUSTOMER SESSION IS NOT TOUCHED
        ===============================
      */

      localStorage.removeItem("technicianAccessToken");
      localStorage.removeItem("technicianLoggedIn");
      localStorage.removeItem("technicianOnline");
      localStorage.removeItem("technicianName");
      localStorage.removeItem("technicianId");

      /*
        ===============================
        SAVE TECHNICIAN SESSION
        ===============================
      */

      localStorage.setItem(
        "technicianAccessToken",
        token
      );

      localStorage.setItem(
        "technicianLoggedIn",
        "true"
      );

      localStorage.setItem(
        "technicianOnline",
        "false"
      );

      /*
        ===============================
        SAVE TECHNICIAN INFORMATION
        ===============================
      */

      const technicianName =
        data.technician?.name ||
        data.technician?.full_name ||
        data.user?.name ||
        data.user?.username ||
        data.username ||
        "Technician";

      localStorage.setItem(
        "technicianName",
        technicianName
      );

      const technicianId =
        data.technician?.id ||
        data.technician_id;

      if (technicianId) {
        localStorage.setItem(
          "technicianId",
          technicianId
        );
      }

      console.log(
        "Technician login successful."
      );

      console.log(
        "Saved technician token:",
        localStorage.getItem(
          "technicianAccessToken"
        )
      );

      /*
        ===============================
        GO TO DASHBOARD
        ===============================
      */

      navigate(
        "/technician/dashboard",
        { replace: true }
      );

    } catch (error) {

      console.error(
        "Technician login error:",
        error
      );

      setError(
        error.message ||
        "Unable to login. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="technician-login-page">

      {/* LEFT BRAND SIDE */}

      <section className="technician-login-brand-side">

        <div className="brand-glow glow-one" />
        <div className="brand-glow glow-two" />

        <div className="technician-brand">

          <div className="brand-logo">
            <Snowflake size={27} />
          </div>

          <div>
            <strong>A-ONE</strong>
            <span>FREEZE</span>
          </div>

        </div>

        <div className="brand-content">

          <span className="portal-label">
            TECHNICIAN PORTAL
          </span>

          <h1>
            Service work.
            <br />

            <span>
              Made simpler.
            </span>
          </h1>

          <p>
            Manage service requests,
            track your work and stay
            connected with A-ONE FREEZE.
          </p>

        </div>

        <div className="brand-footer">

          <ShieldCheck size={17} />

          Secure technician workspace

        </div>

      </section>


      {/* LOGIN SIDE */}

      <section className="technician-login-panel">

        <form
          className="technician-login-card"
          onSubmit={handleLogin}
        >

          <div className="login-mobile-logo">
            <Snowflake size={23} />
          </div>


          <div className="login-heading">

            <span>WELCOME BACK</span>

            <h2>
              Technician Login
            </h2>

            <p>
              Sign in to manage your
              service work.
            </p>

          </div>


          {error && (

            <div className="login-error">
              {error}
            </div>

          )}


          {/* PHONE */}

          <div className="login-field">

            <label>

              <Phone size={15} />

              Mobile Number

            </label>

            <div className="phone-input">

              <span>+91</span>

              <input
                type="tel"
                placeholder="Enter mobile number"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                maxLength={10}
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div className="login-field">

            <label>

              <LockKeyhole size={15} />

              Password

            </label>

            <div className="password-input">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >

                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}

              </button>

            </div>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >

            {loading
              ? "Signing in..."
              : "Sign in to Dashboard"}

            <ArrowRight size={19} />

          </button>


          <div className="login-security">

            <ShieldCheck size={15} />

            Secure access for A-ONE FREEZE technicians

          </div>

        </form>

      </section>

    </div>
  );
}

export default TechnicianLogin;