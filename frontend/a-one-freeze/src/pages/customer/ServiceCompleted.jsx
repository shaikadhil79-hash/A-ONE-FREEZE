import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  Snowflake,
  Star,
  ShieldCheck,
  MapPin,
  CalendarDays,
  Wrench,
  ArrowRight,
  Home,
} from "lucide-react";

function ServiceCompleted() {
  const navigate = useNavigate();
  const location = useLocation();

  const booking = location.state || {};

  const service =
    booking.service || "AC Repair";

  const appliance =
    booking.appliance || "Air Conditioner";

  const technician =
    booking.technician || "Kumar";

  const rating =
    booking.rating || "4.8";

  const bookingId =
    booking.bookingId || "AOF-2026-00124";

  const [selectedRating, setSelectedRating] =
    useState(0);

  const [hoverRating, setHoverRating] =
    useState(0);

  const [review, setReview] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const handleSubmit = () => {
    if (selectedRating === 0) {
      alert("Please select a rating first.");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="completed-page">

        <nav className="completed-navbar">

          <div
            className="completed-logo"
            onClick={() =>
              navigate("/customer")
            }
          >
            <div className="completed-logo-icon">
              <Snowflake size={22} />
            </div>

            <div>
              <strong>A-ONE</strong>
              <span>FREEZE</span>
            </div>
          </div>

          <div className="completed-secure">
            <ShieldCheck size={16} />
            Service completed
          </div>

        </nav>

        <main className="review-success">

          <motion.div
            className="review-success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <Check size={48} />
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >

            <span className="completed-eyebrow">
              REVIEW SUBMITTED
            </span>

            <h1>
              Thanks for your feedback! 🎉
            </h1>

            <p>
              Your review helps A-ONE Freeze
              maintain great service quality.
            </p>

          </motion.div>

          <div className="submitted-rating">

            <span>Your rating</span>

            <div>
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <Star
                    key={star}
                    size={25}
                    fill={
                      star <= selectedRating
                        ? "currentColor"
                        : "none"
                    }
                  />
                )
              )}
            </div>

          </div>

          <button
            className="completed-home-button"
            onClick={() =>
              navigate("/customer")
            }
          >
            Back to Home
            <ArrowRight size={18} />
          </button>

        </main>

      </div>
    );
  }

  return (
    <div className="completed-page">

      {/* NAVBAR */}

      <nav className="completed-navbar">

        <div
          className="completed-logo"
          onClick={() =>
            navigate("/customer")
          }
        >

          <div className="completed-logo-icon">
            <Snowflake size={22} />
          </div>

          <div>
            <strong>A-ONE</strong>
            <span>FREEZE</span>
          </div>

        </div>

        <div className="completed-secure">
          <ShieldCheck size={16} />
          Service completed
        </div>

      </nav>


      {/* MAIN */}

      <main className="completed-container">

        {/* SUCCESS */}

        <motion.div
          className="completed-icon"
          initial={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 12,
          }}
        >
          <Check size={43} />
        </motion.div>


        <motion.div
          className="completed-heading"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
          }}
        >

          <div className="completed-eyebrow">
            SERVICE COMPLETED
          </div>

          <h1>
            Your service is
            <span> complete.</span>
          </h1>

          <p>
            We hope your appliance is working
            perfectly. Tell us how your experience was.
          </p>

        </motion.div>


        {/* SERVICE SUMMARY */}

        <motion.section
          className="completed-service-card"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.25,
          }}
        >

          <div className="completed-service-main">

            <div className="completed-service-icon">
              <Snowflake size={28} />
            </div>

            <div>

              <span>SERVICE</span>

              <h2>{service}</h2>

              <p>{appliance}</p>

            </div>

          </div>


          <div className="completed-service-info">

            <div>
              <CalendarDays size={16} />

              <span>
                Today
              </span>
            </div>

            <div>
              <MapPin size={16} />

              <span>
                Anna Nagar
              </span>
            </div>

            <div>
              <Wrench size={16} />

              <span>
                Completed
              </span>
            </div>

          </div>

        </motion.section>


        {/* RATING CARD */}

        <motion.section
          className="rating-card"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
          }}
        >

          <div className="rating-heading">

            <span>
              RATE YOUR PROFESSIONAL
            </span>

            <h2>
              How was your experience?
            </h2>

            <p>
              Your feedback helps other customers
              choose the right technician.
            </p>

          </div>


          {/* TECHNICIAN */}

          <div className="review-technician">

            <div className="review-avatar">
              {technician.charAt(0)}

              <span></span>
            </div>

            <div>

              <strong>
                {technician}
              </strong>

              <div className="review-tech-rating">

                <Star
                  size={13}
                  fill="currentColor"
                />

                {rating}

                <span>
                  Previous rating
                </span>

              </div>

            </div>

            <div className="verified-review">

              <ShieldCheck size={14} />

              Verified

            </div>

          </div>


          {/* STARS */}

          <div className="star-rating">

            <div className="stars">

              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() =>
                      setHoverRating(star)
                    }
                    onMouseLeave={() =>
                      setHoverRating(0)
                    }
                    onClick={() =>
                      setSelectedRating(star)
                    }
                  >

                    <Star
                      size={39}
                      fill={
                        star <=
                        (hoverRating ||
                          selectedRating)
                          ? "currentColor"
                          : "none"
                      }
                    />

                  </button>
                )
              )}

            </div>

            <div className="rating-text">

              {selectedRating === 0
                ? "Tap a star to rate"
                : selectedRating === 5
                ? "Excellent!"
                : selectedRating === 4
                ? "Very good!"
                : selectedRating === 3
                ? "Good"
                : selectedRating === 2
                ? "Could be better"
                : "Needs improvement"}

            </div>

          </div>


          {/* REVIEW */}

          <div className="review-input">

            <label>
              Tell us more
              <span>Optional</span>
            </label>

            <textarea
              value={review}
              onChange={(e) =>
                setReview(e.target.value)
              }
              placeholder="What did you like about the service?"
              maxLength={500}
            />

            <div className="character-count">
              {review.length}/500
            </div>

          </div>


          {/* SUBMIT */}

          <button
            className="submit-review"
            onClick={handleSubmit}
          >

            <span>
              Submit Review
            </span>

            <ArrowRight size={19} />

          </button>


          <div className="review-note">
            🔒 Your review will be linked to
            booking {bookingId}
          </div>

        </motion.section>


        {/* SKIP */}

        <button
          className="skip-review"
          onClick={() =>
            navigate("/customer")
          }
        >
          Skip for now
        </button>

      </main>

    </div>
  );
}

export default ServiceCompleted;