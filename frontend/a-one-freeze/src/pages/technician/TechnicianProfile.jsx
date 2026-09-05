import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserRound, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

function TechnicianProfile() {
  const navigate = useNavigate();

  return (
    <div style={pageStyle}>

      <header style={headerStyle}>

        <button
          onClick={() =>
            navigate("/technician/dashboard")
          }
          style={backStyle}
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <strong style={brandStyle}>
          ❄ A-ONE FREEZE
        </strong>

      </header>


      <main style={mainStyle}>

        <span style={eyebrow}>
          TECHNICIAN ACCOUNT
        </span>

        <h1 style={title}>
          My Profile
        </h1>


        <section style={profileCard}>

          <div style={avatar}>
            K
          </div>

          <h2>
            Kumar
          </h2>

          <span style={role}>
            Technician
          </span>


          <div style={infoGrid}>

            <div style={infoBox}>
              <Phone size={18} color="#087ea4" />

              <div>
                <small>PHONE</small>
                <strong>+91 XXXXX XXXXX</strong>
              </div>
            </div>


            <div style={infoBox}>
              <Mail size={18} color="#087ea4" />

              <div>
                <small>EMAIL</small>
                <strong>kumar@example.com</strong>
              </div>
            </div>


            <div style={infoBox}>
              <MapPin size={18} color="#087ea4" />

              <div>
                <small>LOCATION</small>
                <strong>Chennai, Tamil Nadu</strong>
              </div>
            </div>


            <div style={infoBox}>
              <ShieldCheck
                size={18}
                color="#16a36a"
              />

              <div>
                <small>ACCOUNT</small>
                <strong>Verified Technician</strong>
              </div>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f5faff",
  fontFamily: "Arial, sans-serif",
  color: "#173b53",
};

const headerStyle = {
  height: "75px",
  background: "#fff",
  borderBottom: "1px solid #dfeaf0",
  padding: "0 6%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const backStyle = {
  border: "none",
  background: "transparent",
  color: "#087ea4",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "7px",
  fontWeight: "700",
};

const brandStyle = {
  color: "#087ea4",
  letterSpacing: "2px",
};

const mainStyle = {
  width: "90%",
  maxWidth: "950px",
  margin: "45px auto",
};

const eyebrow = {
  color: "#087ea4",
  fontSize: "10px",
  fontWeight: "900",
  letterSpacing: "2px",
};

const title = {
  fontSize: "35px",
  margin: "8px 0 30px",
};

const profileCard = {
  background: "#fff",
  border: "1px solid #dfeaf0",
  borderRadius: "22px",
  padding: "40px",
  textAlign: "center",
};

const avatar = {
  width: "80px",
  height: "80px",
  borderRadius: "22px",
  margin: "0 auto",
  background: "#dff5fb",
  color: "#087ea4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
  fontWeight: "900",
};

const role = {
  color: "#78909c",
  fontSize: "12px",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px",
  marginTop: "35px",
  textAlign: "left",
};

const infoBox = {
  padding: "18px",
  border: "1px solid #e1ebf0",
  borderRadius: "14px",
  display: "flex",
  gap: "12px",
};

export default TechnicianProfile;