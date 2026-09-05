import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Snowflake,
  AlertCircle,
} from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    /*
      TEMPORARY FRONTEND LOGIN

      This is only for the UI prototype.

      Later this will be replaced with:
      POST /api/auth/admin/login
    */

    setTimeout(() => {
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminEmail", email);

      navigate("/admin");
      setLoading(false);
    }, 500);
  };

  return (
    <div style={pageStyle}>
      {/* HEADER */}

      <header style={headerStyle}>
        <button
          onClick={() => navigate("/")}
          style={backButton}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div style={brand}>
          <div style={brandIcon}>
            <Snowflake size={18} />
          </div>

          <strong>A-ONE FREEZE</strong>
        </div>
      </header>

      {/* LOGIN */}

      <main style={mainStyle}>
        <div style={loginCard}>
          <div style={securityIcon}>
            <ShieldCheck size={32} />
          </div>

          <span style={eyebrow}>
            ADMIN PORTAL
          </span>

          <h1 style={title}>
            Welcome back
          </h1>

          <p style={subtitle}>
            Sign in to manage A-ONE FREEZE.
          </p>

          {error && (
            <div style={errorBox}>
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* EMAIL */}

            <label style={label}>
              ADMIN EMAIL
            </label>

            <div style={inputWrapper}>
              <Mail
                size={18}
                style={inputIcon}
              />

              <input
                type="email"
                value={email}
                placeholder="admin@aonefreeze.com"
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                style={input}
              />
            </div>

            {/* PASSWORD */}

            <label
              style={{
                ...label,
                marginTop: "20px",
              }}
            >
              PASSWORD
            </label>

            <div style={inputWrapper}>
              <LockKeyhole
                size={18}
                style={inputIcon}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                placeholder="Enter password"
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                style={input}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* LOGIN */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...loginButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              <ShieldCheck size={18} />

              {loading
                ? "Signing in..."
                : "Sign in to Admin"}
            </button>
          </form>

          <div style={securityNote}>
            <LockKeyhole size={14} />

            <span>
              Admin access is protected.
              Backend authentication will be
              connected next.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg,#f4fbfe,#eaf7fc)",
  fontFamily: "Arial, sans-serif",
  color: "#173b53",
};

const headerStyle = {
  height: "72px",
  padding: "0 6%",
  background: "#ffffff",
  borderBottom: "1px solid #dfeaf0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const backButton = {
  border: "none",
  background: "transparent",
  color: "#087ea4",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const brand = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  color: "#087ea4",
  letterSpacing: "1.5px",
};

const brandIcon = {
  width: "34px",
  height: "34px",
  borderRadius: "10px",
  background: "#e7f7fc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mainStyle = {
  minHeight:
    "calc(100vh - 72px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "35px 20px",
};

const loginCard = {
  width: "100%",
  maxWidth: "440px",
  background: "#ffffff",
  border: "1px solid #dfeaf0",
  borderRadius: "24px",
  padding: "38px",
  boxShadow:
    "0 20px 60px rgba(20,70,95,.10)",
};

const securityIcon = {
  width: "64px",
  height: "64px",
  borderRadius: "18px",
  background: "#e7f7fc",
  color: "#087ea4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "22px",
};

const eyebrow = {
  color: "#087ea4",
  fontSize: "10px",
  fontWeight: "900",
  letterSpacing: "2px",
};

const title = {
  margin: "8px 0 7px",
  fontSize: "32px",
};

const subtitle = {
  margin: "0 0 28px",
  color: "#78909c",
  lineHeight: "1.6",
};

const label = {
  display: "block",
  fontSize: "10px",
  fontWeight: "900",
  letterSpacing: "1.5px",
  color: "#55717f",
  marginBottom: "8px",
};

const inputWrapper = {
  height: "50px",
  border: "1px solid #d5e5eb",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  position: "relative",
  background: "#fbfdfe",
};

const inputIcon = {
  marginLeft: "15px",
  color: "#087ea4",
  flexShrink: 0,
};

const input = {
  width: "100%",
  height: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  padding: "0 14px",
  fontSize: "14px",
  color: "#173b53",
};

const eyeButton = {
  border: "none",
  background: "transparent",
  color: "#78909c",
  cursor: "pointer",
  marginRight: "10px",
};

const loginButton = {
  width: "100%",
  marginTop: "28px",
  height: "52px",
  border: "none",
  borderRadius: "12px",
  background:
    "linear-gradient(100deg,#35c9f2,#087ea4)",
  color: "#ffffff",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

const errorBox = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "#fff1f1",
  border: "1px solid #ffd3d3",
  color: "#c53b3b",
  padding: "12px",
  borderRadius: "10px",
  fontSize: "12px",
  marginBottom: "20px",
};

const securityNote = {
  marginTop: "22px",
  padding: "12px",
  borderRadius: "10px",
  background: "#f5fafc",
  color: "#78909c",
  fontSize: "11px",
  lineHeight: "1.5",
  display: "flex",
  gap: "7px",
};

export default AdminLogin;