import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import serviceStore from "../../services/serviceStore";

function TechnicianEarnings() {
  const navigate = useNavigate();
  const techId = localStorage.getItem("technicianId") || "TECH-001";
  const [tech, setTech] = useState(null);

  useEffect(() => {
    const sync = () => {
      const t = serviceStore.getTechnicianById(techId) || serviceStore.getTechnicians()[0];
      setTech(t);
    };
    sync();
    return serviceStore.subscribe(sync);
  }, [techId]);

  const commissionDue = Number(
    localStorage.getItem("technicianCommissionDue") || 120
  );
  const commissionLimit = 1500;
  const isBlocked = commissionDue > commissionLimit;
  const todayEarnings = tech?.earningsToday || 1840;
  const totalEarnings = tech?.totalEarnings || 48920;
  const payableEarnings = Math.max(todayEarnings - commissionDue, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5faff",
        fontFamily: "Arial, sans-serif",
        color: "#173b53",
      }}
    >

      {/* HEADER */}

      <header
        style={{
          height: "75px",
          background: "#fff",
          borderBottom: "1px solid #dfeaf0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 6%",
        }}
      >

        <button
          onClick={() =>
            navigate("/technician/dashboard")
          }
          style={{
            border: "none",
            background: "transparent",
            color: "#087ea4",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontWeight: "700",
          }}
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <strong
          style={{
            color: "#087ea4",
            letterSpacing: "2px",
          }}
        >
          ❄ A-ONE FREEZE
        </strong>

      </header>


      {/* MAIN */}

      <main
        style={{
          width: "90%",
          maxWidth: "1100px",
          margin: "40px auto",
        }}
      >

        <span
          style={{
            color: "#087ea4",
            fontSize: "10px",
            fontWeight: "900",
            letterSpacing: "2px",
          }}
        >
          TECHNICIAN FINANCE
        </span>

        <h1
          style={{
            margin: "8px 0",
            fontSize: "34px",
          }}
        >
          Earnings
        </h1>

        <p
          style={{
            color: "#78909c",
          }}
        >
          Track your earnings, commission and payable amount.
        </p>


        {/* CARDS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "20px",
            marginTop: "30px",
          }}
        >

          <div
            style={cardStyle}
          >
            <Wallet color="#087ea4" />

            <span style={labelStyle}>
              TODAY'S EARNINGS
            </span>

            <strong style={amountStyle}>
              ₹{todayEarnings.toLocaleString()}
            </strong>
          </div>


          <div
            style={cardStyle}
          >
            <TrendingUp color="#16a36a" />

            <span style={labelStyle}>
              AFTER COMMISSION
            </span>

            <strong style={amountStyle}>
              ₹{payableEarnings.toLocaleString()}
            </strong>
          </div>


          <div
            style={cardStyle}
          >
            <CreditCard color="#d88900" />

            <span style={labelStyle}>
              COMMISSION DUE
            </span>

            <strong
              style={{
                ...amountStyle,
                color:
                  isBlocked
                    ? "#d64242"
                    : "#d88900",
              }}
            >
              ₹{commissionDue.toFixed(2)}
            </strong>
          </div>

        </div>


        {/* COMMISSION STATUS */}

        <div
          style={{
            marginTop: "25px",
            background: isBlocked
              ? "#fff2f2"
              : "#effaf5",
            border: `1px solid ${
              isBlocked
                ? "#f0cccc"
                : "#d6eee2"
            }`,
            borderRadius: "18px",
            padding: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >

          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
            }}
          >

            {isBlocked ? (
              <AlertTriangle
                color="#d64242"
              />
            ) : (
              <CheckCircle2
                color="#16a36a"
              />
            )}

            <div>

              <strong>
                {isBlocked
                  ? "Service access blocked"
                  : "Account in good standing"}
              </strong>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#78909c",
                  fontSize: "12px",
                }}
              >
                {isBlocked
                  ? "Please pay your outstanding commission to accept new services."
                  : `₹${commissionLimit - commissionDue > 0
                    ? (commissionLimit - commissionDue).toFixed(2)
                    : "0.00"
                  } remaining before service restrictions.`}
              </p>

            </div>

          </div>


          {isBlocked && (
            <button
              onClick={() =>
                alert(
                  "Payment gateway will be connected here."
                )
              }
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "12px 18px",
                background:
                  "linear-gradient(100deg,#35c9f2,#087ea4)",
                color: "#fff",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Pay Commission
            </button>
          )}

        </div>

      </main>

    </div>
  );
}


const cardStyle = {
  background: "#fff",
  border: "1px solid #dfeaf0",
  borderRadius: "18px",
  padding: "25px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  boxShadow:
    "0 10px 30px rgba(20,70,95,.05)",
};

const labelStyle = {
  color: "#8aa0ac",
  fontSize: "9px",
  fontWeight: "800",
  letterSpacing: "1px",
};

const amountStyle = {
  color: "#173b53",
  fontSize: "28px",
};

export default TechnicianEarnings;