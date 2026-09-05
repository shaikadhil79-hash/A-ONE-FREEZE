import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Snowflake,
  Search,
  Star,
  User,
  UserCog,
  Wrench,
  CalendarDays,
  X,
  MoreVertical,
  Flag,
  CheckCircle2,
  MessageSquare,
  AlertTriangle,
  Clock3,
} from "lucide-react";

function AdminReviews() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);

  const [reviews, setReviews] = useState([
    {
      id: "REV-2026-001",
      customer: "Adhil Shaik",
      customerId: "CUS-001",
      technician: "Ravi Kumar",
      technicianId: "TECH-001",
      service: "AC Repair & Service",
      bookingId: "AOF-2026-00124",
      rating: 5,
      comment:
        "Very professional technician. The AC was serviced properly and the technician arrived on time.",
      date: "25 Aug 2026",
      status: "REVIEWED",
      flagged: false,
    },
    {
      id: "REV-2026-002",
      customer: "Arun Kumar",
      customerId: "CUS-002",
      technician: "Arun Kumar",
      technicianId: "TECH-002",
      service: "Refrigerator Service",
      bookingId: "AOF-2026-00125",
      rating: 4,
      comment:
        "Good service and the technician explained the issue clearly.",
      date: "25 Aug 2026",
      status: "REVIEWED",
      flagged: false,
    },
    {
      id: "REV-2026-003",
      customer: "Mohammed Sameer",
      customerId: "CUS-003",
      technician: "Mohammed Faisal",
      technicianId: "TECH-005",
      service: "AC Gas Filling",
      bookingId: "AOF-2026-00126",
      rating: 3,
      comment:
        "Service was okay but the technician arrived later than the scheduled time.",
      date: "25 Aug 2026",
      status: "PENDING",
      flagged: false,
    },
    {
      id: "REV-2026-004",
      customer: "Faisal Ahmed",
      customerId: "CUS-005",
      technician: "Vijay",
      technicianId: "TECH-003",
      service: "Washing Machine Repair",
      bookingId: "AOF-2026-00127",
      rating: 5,
      comment:
        "Excellent work. Washing machine is working perfectly now.",
      date: "25 Aug 2026",
      status: "REVIEWED",
      flagged: false,
    },
    {
      id: "REV-2026-005",
      customer: "Rahul Kumar",
      customerId: "CUS-006",
      technician: "Suresh",
      technicianId: "TECH-004",
      service: "Water Heater Service",
      bookingId: "AOF-2026-00128",
      rating: 2,
      comment:
        "The service took longer than expected and I was not completely satisfied.",
      date: "26 Aug 2026",
      status: "PENDING",
      flagged: true,
    },
    {
      id: "REV-2026-006",
      customer: "Suresh B",
      customerId: "CUS-004",
      technician: "Arun Kumar",
      technicianId: "TECH-002",
      service: "AC Installation",
      bookingId: "AOF-2026-00129",
      rating: 5,
      comment:
        "Great installation. Everything was clean and properly explained.",
      date: "26 Aug 2026",
      status: "REVIEWED",
      flagged: false,
    },
    {
      id: "REV-2026-007",
      customer: "Karthik",
      customerId: "CUS-008",
      technician: "Vijay",
      technicianId: "TECH-003",
      service: "AC General Service",
      bookingId: "AOF-2026-00130",
      rating: 1,
      comment:
        "Very poor experience. The issue was not properly resolved.",
      date: "26 Aug 2026",
      status: "PENDING",
      flagged: true,
    },
  ]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        review.id.toLowerCase().includes(query) ||
        review.customer.toLowerCase().includes(query) ||
        review.technician.toLowerCase().includes(query) ||
        review.service.toLowerCase().includes(query) ||
        review.bookingId.toLowerCase().includes(query) ||
        review.comment.toLowerCase().includes(query);

      let matchesFilter = true;

      if (filter === "FLAGGED") {
        matchesFilter = review.flagged;
      } else if (filter === "PENDING") {
        matchesFilter = review.status === "PENDING";
      } else if (filter === "REVIEWED") {
        matchesFilter = review.status === "REVIEWED";
      } else if (filter !== "ALL") {
        matchesFilter =
          review.rating === Number(filter);
      }

      return matchesSearch && matchesFilter;
    });
  }, [reviews, search, filter]);

  const totalReviews = reviews.length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  const fiveStar = reviews.filter(
    (review) => review.rating === 5
  ).length;

  const fourStar = reviews.filter(
    (review) => review.rating === 4
  ).length;

  const threeStar = reviews.filter(
    (review) => review.rating === 3
  ).length;

  const twoStar = reviews.filter(
    (review) => review.rating === 2
  ).length;

  const oneStar = reviews.filter(
    (review) => review.rating === 1
  ).length;

  const pendingCount = reviews.filter(
    (review) => review.status === "PENDING"
  ).length;

  const flaggedCount = reviews.filter(
    (review) => review.flagged
  ).length;

  const markReviewed = (id) => {
    setReviews((current) =>
      current.map((review) =>
        review.id === id
          ? {
              ...review,
              status: "REVIEWED",
            }
          : review
      )
    );

    setSelected(null);
  };

  const toggleFlag = (id) => {
    setReviews((current) =>
      current.map((review) =>
        review.id === id
          ? {
              ...review,
              flagged: !review.flagged,
            }
          : review
      )
    );

    setSelected(null);
  };

  return (
    <div style={pageStyle}>
      {/* HEADER */}

      <header style={headerStyle}>
        <button
          onClick={() => navigate("/admin")}
          style={backButton}
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <div style={brand}>
          <div style={brandIcon}>
            <Snowflake size={18} />
          </div>

          <strong>A-ONE FREEZE</strong>
        </div>
      </header>

      <main style={mainStyle}>
        {/* PAGE HEADING */}

        <div style={pageHeading}>
          <div>
            <span style={eyebrow}>
              CUSTOMER FEEDBACK
            </span>

            <h1 style={pageTitle}>
              Reviews
            </h1>

            <p style={pageDescription}>
              Monitor customer feedback, technician
              ratings and service quality.
            </p>
          </div>

          <div style={ratingHero}>
            <Star
              size={24}
              fill="currentColor"
            />

            <div>
              <strong>
                {averageRating}
              </strong>

              <span>
                Average Rating
              </span>
            </div>
          </div>
        </div>

        {/* SUMMARY */}

        <section style={summaryGrid}>
          <SummaryCard
            label="TOTAL REVIEWS"
            value={totalReviews}
            icon={<MessageSquare size={19} />}
            type="blue"
          />

          <SummaryCard
            label="AVERAGE RATING"
            value={`${averageRating}/5`}
            icon={
              <Star
                size={19}
                fill="currentColor"
              />
            }
            type="warning"
          />

          <SummaryCard
            label="PENDING"
            value={pendingCount}
            icon={<ClockIcon />}
            type="purple"
          />

          <SummaryCard
            label="FLAGGED"
            value={flaggedCount}
            icon={<Flag size={19} />}
            type="danger"
          />

          <SummaryCard
            label="5 STAR"
            value={fiveStar}
            icon={
              <Star
                size={19}
                fill="currentColor"
              />
            }
            type="success"
          />
        </section>

        {/* RATING BREAKDOWN */}

        <section style={ratingSection}>
          <div style={ratingOverview}>
            <div style={bigRating}>
              <strong>
                {averageRating}
              </strong>

              <div style={starsLarge}>
                <Star
                  size={17}
                  fill="currentColor"
                />
                <Star
                  size={17}
                  fill="currentColor"
                />
                <Star
                  size={17}
                  fill="currentColor"
                />
                <Star
                  size={17}
                  fill="currentColor"
                />
                <Star
                  size={17}
                  fill="currentColor"
                />
              </div>

              <span>
                Based on {totalReviews} reviews
              </span>
            </div>
          </div>

          <div style={breakdown}>
            <RatingBar
              rating={5}
              count={fiveStar}
              total={totalReviews}
            />

            <RatingBar
              rating={4}
              count={fourStar}
              total={totalReviews}
            />

            <RatingBar
              rating={3}
              count={threeStar}
              total={totalReviews}
            />

            <RatingBar
              rating={2}
              count={twoStar}
              total={totalReviews}
            />

            <RatingBar
              rating={1}
              count={oneStar}
              total={totalReviews}
            />
          </div>
        </section>

        {/* SEARCH */}

        <section style={toolbar}>
          <div style={searchBox}>
            <Search size={18} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search customer, technician, service or review..."
              style={searchInput}
            />
          </div>

          <div style={filters}>
            {[
              "ALL",
              "5",
              "4",
              "3",
              "2",
              "1",
              "PENDING",
              "FLAGGED",
            ].map((item) => (
              <button
                key={item}
                onClick={() =>
                  setFilter(item)
                }
                style={{
                  ...filterButton,
                  ...(filter === item
                    ? activeFilter
                    : {}),
                }}
              >
                {item === "ALL"
                  ? "ALL"
                  : item === "PENDING"
                  ? "PENDING"
                  : item === "FLAGGED"
                  ? "FLAGGED"
                  : `${item} ★`}
              </button>
            ))}
          </div>
        </section>

        {/* REVIEW TABLE */}

        <section style={tableCard}>
          <div style={tableHeader}>
            <div>
              <span style={eyebrow}>
                REVIEW DIRECTORY
              </span>

              <h2 style={tableTitle}>
                Customer Reviews
              </h2>
            </div>

            <span style={resultCount}>
              {filteredReviews.length} results
            </span>
          </div>

          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th
                    style={{
                      ...th,
                      width: "15%",
                    }}
                  >
                    REVIEW
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "15%",
                    }}
                  >
                    CUSTOMER
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "15%",
                    }}
                  >
                    TECHNICIAN
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "16%",
                    }}
                  >
                    SERVICE
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "11%",
                    }}
                  >
                    RATING
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "17%",
                    }}
                  >
                    COMMENT
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "8%",
                    }}
                  >
                    STATUS
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "3%",
                    }}
                  />
                </tr>
              </thead>

              <tbody>
                {filteredReviews.map(
                  (review) => (
                    <tr key={review.id}>
                      {/* REVIEW */}

                      <td style={td}>
                        <div style={reviewCell}>
                          <div style={reviewIcon}>
                            <MessageSquare
                              size={16}
                            />
                          </div>

                          <div>
                            <strong
                              style={reviewId}
                            >
                              {review.id}
                            </strong>

                            <span
                              style={bookingText}
                            >
                              {review.bookingId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CUSTOMER */}

                      <td style={td}>
                        <div style={personCell}>
                          <div style={customerAvatar}>
                            {review.customer
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong
                              style={personName}
                            >
                              {review.customer}
                            </strong>

                            <span
                              style={personId}
                            >
                              {review.customerId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* TECHNICIAN */}

                      <td style={td}>
                        <div style={personCell}>
                          <div
                            style={
                              technicianAvatar
                            }
                          >
                            <UserCog
                              size={14}
                            />
                          </div>

                          <div>
                            <strong
                              style={
                                personName
                              }
                            >
                              {review.technician}
                            </strong>

                            <span
                              style={
                                personId
                              }
                            >
                              {review.technicianId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SERVICE */}

                      <td style={td}>
                        <div style={serviceCell}>
                          <Wrench
                            size={14}
                          />

                          <span>
                            {review.service}
                          </span>
                        </div>
                      </td>

                      {/* RATING */}

                      <td style={td}>
                        <RatingStars
                          rating={review.rating}
                        />
                      </td>

                      {/* COMMENT */}

                      <td style={td}>
                        <span
                          style={
                            commentText
                          }
                        >
                          {review.comment}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td style={td}>
                        <div
                          style={
                            statusStack
                          }
                        >
                          <ReviewStatus
                            status={
                              review.status
                            }
                          />

                          {review.flagged && (
                            <span
                              style={
                                flaggedBadge
                              }
                            >
                              FLAGGED
                            </span>
                          )}
                        </div>
                      </td>

                      {/* ACTION */}

                      <td style={td}>
                        <button
                          onClick={() =>
                            setSelected(
                              review
                            )
                          }
                          style={
                            moreButton
                          }
                        >
                          <MoreVertical
                            size={18}
                          />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {filteredReviews.length === 0 && (
            <div style={emptyState}>
              <MessageSquare
                size={42}
              />

              <h3>
                No reviews found
              </h3>

              <p>
                Try changing your search or
                rating filter.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* REVIEW DETAILS MODAL */}

      {selected && (
        <div style={modalOverlay}>
          <div style={modal}>
            <button
              onClick={() =>
                setSelected(null)
              }
              style={modalClose}
            >
              <X size={18} />
            </button>

            <div style={modalTop}>
              <div style={modalIcon}>
                <MessageSquare
                  size={23}
                />
              </div>

              <div>
                <span style={eyebrow}>
                  REVIEW DETAILS
                </span>

                <h2 style={modalTitle}>
                  {selected.id}
                </h2>

                <p
                  style={
                    modalSubtitle
                  }
                >
                  {selected.bookingId}
                </p>
              </div>
            </div>

            <div style={modalRating}>
              <RatingStars
                rating={selected.rating}
                large
              />

              <strong>
                {selected.rating}.0 / 5
              </strong>
            </div>

            <div style={detailsGrid}>
              <Detail
                label="Customer"
                value={
                  selected.customer
                }
                icon={<User size={16} />}
              />

              <Detail
                label="Technician"
                value={
                  selected.technician
                }
                icon={
                  <UserCog size={16} />
                }
              />

              <Detail
                label="Service"
                value={
                  selected.service
                }
                icon={
                  <Wrench size={16} />
                }
              />

              <Detail
                label="Review Date"
                value={
                  selected.date
                }
                icon={
                  <CalendarDays
                    size={16}
                  />
                }
              />
            </div>

            <div style={commentBox}>
              <span>
                CUSTOMER COMMENT
              </span>

              <p>
                "{selected.comment}"
              </p>
            </div>

            {selected.flagged && (
              <div style={warningBox}>
                <AlertTriangle
                  size={18}
                />

                <div>
                  <strong>
                    This review is flagged
                  </strong>

                  <span>
                    Admin attention may be
                    required.
                  </span>
                </div>
              </div>
            )}

            <div style={actionTitle}>
              REVIEW ACTIONS
            </div>

            <div style={actionGrid}>
              {selected.status ===
                "PENDING" && (
                <button
                  onClick={() =>
                    markReviewed(
                      selected.id
                    )
                  }
                  style={
                    markReviewedButton
                  }
                >
                  <CheckCircle2
                    size={16}
                  />
                  Mark Reviewed
                </button>
              )}

              <button
                onClick={() =>
                  toggleFlag(
                    selected.id
                  )
                }
                style={
                  selected.flagged
                    ? unflagButton
                    : flagButton
                }
              >
                <Flag size={16} />

                {selected.flagged
                  ? "Remove Flag"
                  : "Flag Review"}
              </button>
            </div>

            <button
              onClick={() =>
                setSelected(null)
              }
              style={closeButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({
  label,
  value,
  icon,
  type,
}) {
  const colors = {
    blue: {
      background: "#123f52",
      color: "#35c9f2",
      border: "#20556a",
    },

    warning: {
      background: "#3a2e17",
      color: "#e5ad42",
      border: "#604c25",
    },

    purple: {
      background: "#29213b",
      color: "#b79aff",
      border: "#493a68",
    },

    danger: {
      background: "#3b2023",
      color: "#ff6b6b",
      border: "#6a3034",
    },

    success: {
      background: "#12382b",
      color: "#39c98a",
      border: "#245b45",
    },
  };

  const current = colors[type];

  return (
    <div
      style={{
        ...summaryCard,
        borderColor:
          current.border,
      }}
    >
      <div
        style={{
          ...summaryIcon,
          background:
            current.background,
          color: current.color,
        }}
      >
        {icon}
      </div>

      <div>
        <span style={summaryLabel}>
          {label}
        </span>

        <strong
          style={{
            ...summaryValue,
            color: current.color,
          }}
        >
          {value}
        </strong>
      </div>
    </div>
  );
}

/* =====================================================
   RATING BAR
===================================================== */

function RatingBar({
  rating,
  count,
  total,
}) {
  const percentage =
    total > 0
      ? Math.round(
          (count / total) * 100
        )
      : 0;

  return (
    <div style={ratingBarRow}>
      <span style={ratingNumber}>
        {rating}
        <Star
          size={12}
          fill="currentColor"
        />
      </span>

      <div style={ratingTrack}>
        <div
          style={{
            ...ratingFill,
            width: `${percentage}%`,
          }}
        />
      </div>

      <span style={ratingCount}>
        {count}
      </span>
    </div>
  );
}

/* =====================================================
   RATING STARS
===================================================== */

function RatingStars({
  rating,
  large = false,
}) {
  return (
    <div
      style={{
        ...stars,
        ...(large
          ? starsLargeModal
          : {}),
      }}
    >
      {[1, 2, 3, 4, 5].map(
        (number) => (
          <Star
            key={number}
            size={large ? 19 : 13}
            fill={
              number <= rating
                ? "currentColor"
                : "transparent"
            }
          />
        )
      )}
    </div>
  );
}

/* =====================================================
   STATUS
===================================================== */

function ReviewStatus({ status }) {
  const reviewed =
    status === "REVIEWED";

  return (
    <span
      style={{
        ...statusBadge,
        background: reviewed
          ? "#12382b"
          : "#3a2e17",
        color: reviewed
          ? "#39c98a"
          : "#e5ad42",
      }}
    >
      {status}
    </span>
  );
}

/* =====================================================
   DETAIL
===================================================== */

function Detail({
  label,
  value,
  icon,
}) {
  return (
    <div style={detailBox}>
      <div style={detailIcon}>
        {icon}
      </div>

      <div
        style={detailContent}
      >
        <span>{label}</span>

        <strong>{value}</strong>
      </div>
    </div>
  );
}

/* =====================================================
   CLOCK ICON
===================================================== */

function ClockIcon() {
  return (
    <Clock3 size={19} />
  );
}

/* =====================================================
   STYLES
===================================================== */

const pageStyle = {
  minHeight: "100vh",
  background: "#0b1720",
  fontFamily: "Arial, sans-serif",
  color: "#e8f4f8",
};

const headerStyle = {
  height: "75px",
  background: "#101f2a",
  borderBottom:
    "1px solid #203542",
  padding: "0 6%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const backButton = {
  border: "none",
  background: "transparent",
  color: "#35c9f2",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "7px",
  fontWeight: "700",
};

const brand = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  color: "#35c9f2",
  letterSpacing: "1.5px",
};

const brandIcon = {
  width: "35px",
  height: "35px",
  borderRadius: "10px",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mainStyle = {
  width: "92%",
  maxWidth: "1500px",
  margin: "0 auto",
  padding: "40px 0 70px",
};

const pageHeading = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "25px",
  marginBottom: "25px",
};

const eyebrow = {
  color: "#35c9f2",
  fontSize: "10px",
  fontWeight: "900",
  letterSpacing: "2px",
};

const pageTitle = {
  margin: "7px 0 6px",
  fontSize: "34px",
  color: "#e8f4f8",
};

const pageDescription = {
  margin: 0,
  color: "#8fa8b5",
  fontSize: "13px",
  lineHeight: "1.6",
};

const ratingHero = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 18px",
  background: "#3a2e17",
  border: "1px solid #604c25",
  borderRadius: "12px",
  color: "#e5ad42",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(5, minmax(0, 1fr))",
  gap: "14px",
  marginBottom: "20px",
};

const summaryCard = {
  background: "#101f2a",
  border: "1px solid",
  borderRadius: "15px",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: "11px",
};

const summaryIcon = {
  width: "40px",
  height: "40px",
  borderRadius: "11px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const summaryLabel = {
  display: "block",
  color: "#8fa8b5",
  fontSize: "8px",
  fontWeight: "900",
  letterSpacing: "1px",
};

const summaryValue = {
  display: "block",
  marginTop: "4px",
  fontSize: "19px",
};

const ratingSection = {
  background: "#101f2a",
  border: "1px solid #203542",
  borderRadius: "16px",
  padding: "20px",
  display: "grid",
  gridTemplateColumns:
    "240px 1fr",
  gap: "35px",
  alignItems: "center",
  marginBottom: "18px",
};

const ratingOverview = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const bigRating = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5px",
};

const bigRatingValue = {};

const starsLarge = {
  display: "flex",
  color: "#e5ad42",
  gap: "2px",
};

const breakdown = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const ratingBarRow = {
  display: "grid",
  gridTemplateColumns:
    "42px 1fr 30px",
  alignItems: "center",
  gap: "8px",
};

const ratingNumber = {
  display: "flex",
  alignItems: "center",
  gap: "3px",
  color: "#e5ad42",
  fontSize: "11px",
  fontWeight: "800",
};

const ratingTrack = {
  height: "7px",
  background: "#203542",
  borderRadius: "10px",
  overflow: "hidden",
};

const ratingFill = {
  height: "100%",
  background: "#e5ad42",
  borderRadius: "10px",
};

const ratingCount = {
  color: "#8fa8b5",
  fontSize: "10px",
  textAlign: "right",
};

const toolbar = {
  background: "#101f2a",
  border: "1px solid #203542",
  borderRadius: "15px",
  padding: "13px",
  marginBottom: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "15px",
};

const searchBox = {
  flex: 1,
  maxWidth: "550px",
  height: "43px",
  border: "1px solid #29414e",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  gap: "9px",
  padding: "0 13px",
  color: "#78909c",
  background: "#0d1b25",
};

const searchInput = {
  width: "100%",
  border: "none",
  outline: "none",
  fontSize: "13px",
  color: "#dcebf0",
  background: "transparent",
};

const filters = {
  display: "flex",
  gap: "6px",
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const filterButton = {
  border: "1px solid #29414e",
  background: "#101f2a",
  color: "#8fa8b5",
  borderRadius: "8px",
  padding: "9px 10px",
  fontSize: "8px",
  fontWeight: "800",
  cursor: "pointer",
};

const activeFilter = {
  background: "#123f52",
  borderColor: "#20556a",
  color: "#35c9f2",
};

const tableCard = {
  background: "#101f2a",
  border: "1px solid #203542",
  borderRadius: "18px",
  overflow: "hidden",
};

const tableHeader = {
  padding: "21px 22px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom:
    "1px solid #203542",
};

const tableTitle = {
  margin: "5px 0 0",
  fontSize: "22px",
  color: "#e8f4f8",
};

const resultCount = {
  color: "#8fa8b5",
  fontSize: "12px",
};

const tableWrapper = {
  width: "100%",
  overflowX: "auto",
};

const table = {
  width: "100%",
  minWidth: "1250px",
  tableLayout: "fixed",
  borderCollapse: "collapse",
};

const th = {
  padding: "14px",
  textAlign: "left",
  fontSize: "8px",
  fontWeight: "900",
  letterSpacing: "1px",
  color: "#8fa8b5",
  background: "#0d1b25",
  borderBottom:
    "1px solid #203542",
  whiteSpace: "nowrap",
};

const td = {
  padding: "14px",
  textAlign: "left",
  fontSize: "11px",
  color: "#b8cbd3",
  borderBottom:
    "1px solid #1c303c",
  verticalAlign: "middle",
  overflow: "hidden",
};

const reviewCell = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
};

const reviewIcon = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const reviewId = {
  display: "block",
  color: "#35c9f2",
  fontSize: "10px",
};

const bookingText = {
  display: "block",
  color: "#78909c",
  fontSize: "8px",
  marginTop: "3px",
};

const personCell = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  minWidth: 0,
};

const customerAvatar = {
  width: "31px",
  height: "31px",
  borderRadius: "50%",
  background: "#173b4b",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
  fontSize: "10px",
  flexShrink: 0,
};

const technicianAvatar = {
  width: "31px",
  height: "31px",
  borderRadius: "50%",
  background: "#29213b",
  color: "#b79aff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const personName = {
  display: "block",
  color: "#e8f4f8",
  fontSize: "10px",
  fontWeight: "800",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const personId = {
  display: "block",
  color: "#78909c",
  fontSize: "8px",
  marginTop: "3px",
};

const serviceCell = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: "#8fa8b5",
};

const stars = {
  display: "flex",
  gap: "1px",
  color: "#e5ad42",
};

const starsLargeModal = {
  gap: "2px",
};

const commentText = {
  display: "block",
  color: "#8fa8b5",
  lineHeight: "1.4",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const statusStack = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const statusBadge = {
  display: "inline-block",
  width: "fit-content",
  padding: "6px 8px",
  borderRadius: "20px",
  fontSize: "8px",
  fontWeight: "900",
};

const flaggedBadge = {
  display: "inline-block",
  width: "fit-content",
  padding: "5px 7px",
  borderRadius: "20px",
  background: "#3b2023",
  color: "#ff6b6b",
  fontSize: "7px",
  fontWeight: "900",
};

const moreButton = {
  border: "none",
  background: "transparent",
  color: "#78909c",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const emptyState = {
  padding: "70px 20px",
  textAlign: "center",
  color: "#8fa8b5",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.68)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 100,
};

const modal = {
  width: "100%",
  maxWidth: "620px",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#101f2a",
  border: "1px solid #29414e",
  borderRadius: "22px",
  padding: "30px",
  position: "relative",
  boxShadow:
    "0 25px 70px rgba(0,0,0,.45)",
};

const modalClose = {
  position: "absolute",
  right: "18px",
  top: "18px",
  border: "1px solid #29414e",
  background: "#142631",
  color: "#8fa8b5",
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalTop = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  marginBottom: "15px",
};

const modalIcon = {
  width: "56px",
  height: "56px",
  borderRadius: "15px",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalTitle = {
  margin: "5px 0 3px",
  fontSize: "23px",
  color: "#e8f4f8",
};

const modalSubtitle = {
  margin: 0,
  color: "#78909c",
  fontSize: "10px",
};

const modalRating = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "13px",
  background: "#0d1b25",
  border: "1px solid #203542",
  borderRadius: "11px",
  marginBottom: "14px",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "10px",
};

const detailBox = {
  background: "#0d1b25",
  border: "1px solid #203542",
  borderRadius: "11px",
  padding: "12px",
  display: "flex",
  alignItems: "center",
  gap: "9px",
};

const detailIcon = {
  color: "#35c9f2",
};

const detailContent = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  minWidth: 0,
};

const commentBox = {
  marginTop: "14px",
  padding: "15px",
  background: "#0d1b25",
  border: "1px solid #203542",
  borderRadius: "11px",
};

const warningBox = {
  marginTop: "14px",
  padding: "13px",
  borderRadius: "11px",
  background: "#3b2023",
  border: "1px solid #6a3034",
  color: "#ff6b6b",
  display: "flex",
  gap: "9px",
  fontSize: "12px",
};

const actionTitle = {
  marginTop: "20px",
  marginBottom: "10px",
  color: "#8fa8b5",
  fontSize: "9px",
  fontWeight: "900",
  letterSpacing: "1.5px",
};

const actionGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "9px",
};

const markReviewedButton = {
  border: "1px solid #245b45",
  borderRadius: "10px",
  background: "#12382b",
  color: "#39c98a",
  padding: "12px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
};

const flagButton = {
  border: "1px solid #6a3034",
  borderRadius: "10px",
  background: "#3b2023",
  color: "#ff6b6b",
  padding: "12px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
};

const unflagButton = {
  border: "1px solid #245b45",
  borderRadius: "10px",
  background: "#12382b",
  color: "#39c98a",
  padding: "12px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
};

const closeButton = {
  width: "100%",
  marginTop: "10px",
  border: "1px solid #29414e",
  borderRadius: "10px",
  background: "#142631",
  color: "#8fa8b5",
  padding: "12px",
  fontWeight: "700",
  cursor: "pointer",
};

export default AdminReviews;