import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MessageSquare,
} from "lucide-react";
import serviceStore from "../../services/serviceStore";

function TechnicianRatings() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const sync = () => {
      const storeReviews = serviceStore
        .getBookings()
        .filter((b) => b.review)
        .map((b) => ({
          name: b.review.customerName || b.customerName,
          rating: b.review.rating || 5,
          text: b.review.comment,
          date: b.review.date || "Recently",
        }));

      const defaultReviews = [
        {
          name: "Adhil",
          rating: 5,
          text: "Very professional AC service and explained the coil cleaning clearly.",
          date: "Today",
        },
        {
          name: "Priya",
          rating: 5,
          text: "Technician arrived on time with the jet pump and completed the work neatly.",
          date: "Yesterday",
        },
        {
          name: "Rahul",
          rating: 5,
          text: "R32 gas refilling was done with digital scale. Super cooling now!",
          date: "3 days ago",
        },
      ];

      setReviews([...storeReviews, ...defaultReviews]);
    };

    sync();
    return serviceStore.subscribe(sync);
  }, []);

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

        <span style={eyebrowStyle}>
          CUSTOMER FEEDBACK
        </span>

        <h1 style={titleStyle}>
          Ratings & Reviews
        </h1>


        <div style={ratingCard}>

          <strong style={{ fontSize: "48px" }}>
            4.8
          </strong>

          <div>

            <div
              style={{
                color: "#f3a928",
                fontSize: "22px",
              }}
            >
              ★★★★★
            </div>

            <p style={muted}>
              Based on 126 customer reviews
            </p>

          </div>

        </div>


        <div style={{ marginTop: "25px" }}>

          {reviews.map((review, index) => (

            <div
              key={index}
              style={reviewCard}
            >

              <div style={avatar}>
                {review.name.charAt(0)}
              </div>

              <div style={{ flex: 1 }}>

                <strong>
                  {review.name}
                </strong>

                <div
                  style={{
                    color: "#f3a928",
                    marginTop: "4px",
                  }}
                >
                  {"★".repeat(review.rating)}
                </div>

                <p style={muted}>
                  {review.text}
                </p>

              </div>

              <span
                style={{
                  color: "#9aaab2",
                  fontSize: "10px",
                }}
              >
                {review.date}
              </span>

            </div>

          ))}

        </div>

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

const eyebrowStyle = {
  color: "#087ea4",
  fontSize: "10px",
  fontWeight: "900",
  letterSpacing: "2px",
};

const titleStyle = {
  fontSize: "35px",
  margin: "8px 0 30px",
};

const ratingCard = {
  background: "#fff",
  border: "1px solid #dfeaf0",
  borderRadius: "20px",
  padding: "30px",
  display: "flex",
  alignItems: "center",
  gap: "25px",
};

const reviewCard = {
  background: "#fff",
  border: "1px solid #dfeaf0",
  borderRadius: "17px",
  padding: "20px",
  display: "flex",
  gap: "15px",
  marginBottom: "12px",
};

const avatar = {
  width: "45px",
  height: "45px",
  borderRadius: "50%",
  background: "#e5f6fb",
  color: "#087ea4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
};

const muted = {
  color: "#78909c",
  fontSize: "12px",
};

export default TechnicianRatings;