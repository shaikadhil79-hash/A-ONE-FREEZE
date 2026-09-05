import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Snowflake,
  Search,
  ClipboardList,
  CircleCheck,
  Clock3,
  Wrench,
  MapPin,
  CalendarDays,
  IndianRupee,
  XCircle,
  AlertTriangle,
  MoreVertical,
  X,
  User,
  UserCog,
} from "lucide-react";
import { useEffect } from "react";
import serviceStore from "../../services/serviceStore";

function AdminBookings() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryCustomer =
    new URLSearchParams(location.search).get("customer");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [selectedTechToAssign, setSelectedTechToAssign] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const sync = () => {
      const raw = serviceStore.getBookings();
      const mapped = raw.map((b) => ({
        id: b.id,
        customerId: b.customerId || "CUS-001",
        customer: b.customerName,
        phone: b.customerPhone,
        technicianId: b.technicianId || "Not Assigned",
        technician: b.technicianName || "Not Assigned",
        service: b.serviceName,
        appliance: b.appliance || "Air Conditioner",
        location: `${b.address}, ${b.city}`,
        date: b.scheduledDate || "Today",
        time: b.scheduledTime || "11:00 AM",
        amount: b.totalAmount || b.amount,
        paid: b.paymentStatus === "PAID" ? (b.totalAmount || b.amount) : 0,
        due: b.paymentStatus === "PAID" ? 0 : (b.totalAmount || b.amount),
        payment: b.paymentStatus === "PAID" ? "PAID" : "UNPAID",
        status: b.status,
      }));
      setBookings(mapped);
    };

    sync();
    return serviceStore.subscribe(sync);
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        booking.id.toLowerCase().includes(query) ||
        booking.customer.toLowerCase().includes(query) ||
        booking.technician.toLowerCase().includes(query) ||
        booking.service.toLowerCase().includes(query);

      const matchesCustomer =
        !queryCustomer ||
        booking.customerId === queryCustomer;

      const matchesFilter =
        filter === "ALL" ||
        booking.status === filter ||
        booking.payment === filter;

      return (
        matchesSearch &&
        matchesCustomer &&
        matchesFilter
      );
    });
  }, [
    bookings,
    search,
    filter,
    queryCustomer,
  ]);

  const totalBookings = bookings.length;

  const pendingCount = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;

  const activeCount = bookings.filter(
    (booking) =>
      booking.status === "ACCEPTED" ||
      booking.status === "IN_PROGRESS"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "COMPLETED"
  ).length;

  const totalRevenue = bookings.reduce(
    (total, booking) => total + booking.paid,
    0
  );

  const totalDue = bookings.reduce(
    (total, booking) => total + booking.due,
    0
  );

  const updateStatus = (id, status) => {
    if (status === "ACCEPTED") {
      serviceStore.assignBooking(id, selectedTechToAssign || "TECH-001");
    } else {
      const all = serviceStore.getBookings();
      const idx = all.findIndex((b) => b.id === id);
      if (idx !== -1) {
        all[idx].status = status;
        localStorage.setItem("aone_bookings", JSON.stringify(all));
        serviceStore.notify();
      }
    }

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
              BOOKING MANAGEMENT
            </span>

            <h1 style={pageTitle}>
              Bookings
            </h1>

            <p style={pageDescription}>
              Monitor every customer booking,
              technician assignment, service status
              and payment.
            </p>
          </div>

          <div style={totalCard}>
            <ClipboardList size={19} />

            <div>
              <span>Total Bookings</span>
              <strong>{totalBookings}</strong>
            </div>
          </div>
        </div>

        {/* SUMMARY */}

        <section style={summaryGrid}>
          <SummaryCard
            label="PENDING"
            value={pendingCount}
            icon={<Clock3 size={19} />}
            type="warning"
          />

          <SummaryCard
            label="ACTIVE"
            value={activeCount}
            icon={<Wrench size={19} />}
            type="blue"
          />

          <SummaryCard
            label="COMPLETED"
            value={completedCount}
            icon={<CircleCheck size={19} />}
            type="success"
          />

          <SummaryCard
            label="COLLECTED"
            value={`₹${totalRevenue}`}
            icon={<IndianRupee size={19} />}
            type="purple"
          />

          <SummaryCard
            label="CUSTOMER DUE"
            value={`₹${totalDue}`}
            icon={<AlertTriangle size={19} />}
            type="danger"
          />
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
              placeholder="Search booking, customer, technician or service..."
              style={searchInput}
            />
          </div>

          <div style={filters}>
            {[
              "ALL",
              "PENDING",
              "ACCEPTED",
              "IN_PROGRESS",
              "COMPLETED",
              "CANCELLED",
              "PAID",
              "UNPAID",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                style={{
                  ...filterButton,
                  ...(filter === item
                    ? activeFilter
                    : {}),
                }}
              >
                {item.replace("_", " ")}
              </button>
            ))}
          </div>
        </section>

        {/* CUSTOMER FILTER NOTICE */}

        {queryCustomer && (
          <div style={customerNotice}>
            <User size={17} />

            <span>
              Showing bookings for customer:
              <strong>
                {" "}
                {queryCustomer}
              </strong>
            </span>

            <button
              onClick={() =>
                navigate("/admin/bookings")
              }
              style={clearCustomer}
            >
              Clear
            </button>
          </div>
        )}

        {/* TABLE */}

        <section style={tableCard}>
          <div style={tableHeader}>
            <div>
              <span style={eyebrow}>
                BOOKING DIRECTORY
              </span>

              <h2 style={tableTitle}>
                All Bookings
              </h2>
            </div>

            <span style={resultCount}>
              {filteredBookings.length} results
            </span>
          </div>

          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th
                    style={{
                      ...th,
                      width: "17%",
                    }}
                  >
                    BOOKING
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "17%",
                    }}
                  >
                    CUSTOMER
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "16%",
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
                      width: "14%",
                    }}
                  >
                    DATE / TIME
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "9%",
                    }}
                  >
                    STATUS
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "8%",
                    }}
                  >
                    AMOUNT
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
                {filteredBookings.map(
                  (booking) => (
                    <tr key={booking.id}>
                      {/* BOOKING */}

                      <td style={td}>
                        <div style={bookingCell}>
                          <div style={bookingIcon}>
                            <ClipboardList
                              size={17}
                            />
                          </div>

                          <div>
                            <strong
                              style={bookingId}
                            >
                              {booking.id}
                            </strong>

                            <span
                              style={bookingAppliance}
                            >
                              {booking.appliance}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CUSTOMER */}

                      <td style={td}>
                        <div
                          style={personCell}
                        >
                          <div
                            style={smallAvatar}
                          >
                            {booking.customer
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div
                            style={personInfo}
                          >
                            <strong
                              style={
                                personName
                              }
                            >
                              {booking.customer}
                            </strong>

                            <span
                              style={
                                personId
                              }
                            >
                              {booking.customerId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* TECHNICIAN */}

                      <td style={td}>
                        <div
                          style={personCell}
                        >
                          <div
                            style={
                              technicianAvatar
                            }
                          >
                            <UserCog
                              size={15}
                            />
                          </div>

                          <div
                            style={personInfo}
                          >
                            <strong
                              style={
                                personName
                              }
                            >
                              {booking.technician}
                            </strong>

                            <span
                              style={
                                personId
                              }
                            >
                              {booking.technicianId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SERVICE */}

                      <td style={td}>
                        <span
                          style={serviceText}
                        >
                          {booking.service}
                        </span>
                      </td>

                      {/* DATE */}

                      <td style={td}>
                        <div
                          style={dateCell}
                        >
                          <span>
                            <CalendarDays
                              size={13}
                            />
                            {booking.date}
                          </span>

                          <strong>
                            {booking.time}
                          </strong>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td style={td}>
                        <StatusBadge
                          status={
                            booking.status
                          }
                        />
                      </td>

                      {/* AMOUNT */}

                      <td style={td}>
                        <div
                          style={
                            amountCell
                          }
                        >
                          <strong>
                            ₹{booking.amount}
                          </strong>

                          {booking.due >
                            0 && (
                            <span>
                              Due ₹
                              {booking.due}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* MENU */}

                      <td style={td}>
                        <button
                          onClick={() =>
                            setSelected(
                              booking
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

          {filteredBookings.length === 0 && (
            <div style={emptyState}>
              <ClipboardList size={42} />

              <h3>
                No bookings found
              </h3>

              <p>
                Try changing your search or
                filter.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* DETAILS MODAL */}

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

            <div style={modalHeading}>
              <div style={modalBookingIcon}>
                <ClipboardList
                  size={22}
                />
              </div>

              <div>
                <span style={eyebrow}>
                  BOOKING DETAILS
                </span>

                <h2 style={modalTitle}>
                  {selected.id}
                </h2>

                <p style={modalSubtitle}>
                  {selected.service}
                </p>
              </div>
            </div>

            {/* STATUS */}

            <div style={modalStatusRow}>
              <StatusBadge
                status={selected.status}
              />

              <PaymentBadge
                payment={selected.payment}
              />
            </div>

            {/* DETAILS */}

            <div style={detailsGrid}>
              <Detail
                label="Customer"
                value={selected.customer}
                icon={<User size={16} />}
              />

              <Detail
                label="Customer Phone"
                value={selected.phone}
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
                value={selected.service}
                icon={<Wrench size={16} />}
              />

              <Detail
                label="Location"
                value={selected.location}
                icon={
                  <MapPin size={16} />
                }
              />

              <Detail
                label="Date"
                value={selected.date}
                icon={
                  <CalendarDays
                    size={16}
                  />
                }
              />

              <Detail
                label="Time"
                value={selected.time}
                icon={<Clock3 size={16} />}
              />

              <Detail
                label="Total Amount"
                value={`₹${selected.amount}`}
                icon={
                  <IndianRupee
                    size={16}
                  />
                }
              />

              <Detail
                label="Paid"
                value={`₹${selected.paid}`}
                icon={
                  <CircleCheck
                    size={16}
                  />
                }
              />

              <Detail
                label="Due"
                value={`₹${selected.due}`}
                icon={
                  <AlertTriangle
                    size={16}
                  />
                }
              />
            </div>

            {/* PAYMENT WARNING */}

            {selected.due > 0 && (
              <div style={warningBox}>
                <AlertTriangle
                  size={18}
                />

                <div>
                  <strong>
                    Payment outstanding
                  </strong>

                  <span>
                    Customer has ₹
                    {selected.due} remaining
                    on this booking.
                  </span>
                </div>
              </div>
            )}

            {/* DISPATCH / ASSIGN TECHNICIAN */}
            {selected.status !== "COMPLETED" && selected.status !== "CANCELLED" && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "14px",
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <UserCog size={17} color="#16a34a" />
                  <strong style={{ fontSize: "13px", color: "#166534" }}>
                    Dispatch / Reassign Technician
                  </strong>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <select
                    value={selectedTechToAssign}
                    onChange={(e) => setSelectedTechToAssign(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      flex: 1,
                      fontSize: "13px",
                      background: "#ffffff",
                    }}
                  >
                    <option value="">Select an AC Technician...</option>
                    {serviceStore.getTechnicians().map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.isOnline ? "● Online" : "○ Offline"} - ★ {t.rating})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (selectedTechToAssign) {
                        serviceStore.assignBooking(selected.id, selectedTechToAssign);
                        setSelected(null);
                        setSelectedTechToAssign("");
                      } else {
                        alert("Please select a technician first.");
                      }
                    }}
                    style={{
                      background: "#16a34a",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 18px",
                      borderRadius: "8px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Assign Now
                  </button>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div style={actionTitle}>
              ADMIN ACTIONS
            </div>

            <div style={actionGrid}>
              {selected.status ===
                "PENDING" && (
                <button
                  onClick={() =>
                    updateStatus(
                      selected.id,
                      "ACCEPTED"
                    )
                  }
                  style={successButton}
                >
                  <CircleCheck
                    size={16}
                  />
                  Accept Booking
                </button>
              )}

              {selected.status ===
                "ACCEPTED" && (
                <button
                  onClick={() =>
                    updateStatus(
                      selected.id,
                      "IN_PROGRESS"
                    )
                  }
                  style={blueButton}
                >
                  <Wrench size={16} />
                  Start Service
                </button>
              )}

              {selected.status ===
                "IN_PROGRESS" && (
                <button
                  onClick={() =>
                    updateStatus(
                      selected.id,
                      "COMPLETED"
                    )
                  }
                  style={successButton}
                >
                  <CircleCheck
                    size={16}
                  />
                  Mark Completed
                </button>
              )}

              {selected.status !==
                "COMPLETED" &&
                selected.status !==
                  "CANCELLED" && (
                  <button
                    onClick={() =>
                      updateStatus(
                        selected.id,
                        "CANCELLED"
                      )
                    }
                    style={dangerButton}
                  >
                    <XCircle size={16} />
                    Cancel Booking
                  </button>
                )}
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
    success: {
      background: "#12382b",
      color: "#39c98a",
      border: "#245b45",
    },

    danger: {
      background: "#3b2023",
      color: "#ff6b6b",
      border: "#6a3034",
    },

    warning: {
      background: "#3a2e17",
      color: "#e5ad42",
      border: "#604c25",
    },

    blue: {
      background: "#123f52",
      color: "#35c9f2",
      border: "#20556a",
    },

    purple: {
      background: "#29213b",
      color: "#b79aff",
      border: "#493a68",
    },
  };

  const current = colors[type];

  return (
    <div
      style={{
        ...summaryCard,
        borderColor: current.border,
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
   STATUS BADGES
===================================================== */

function StatusBadge({ status }) {
  const styles = {
    PENDING: {
      background: "#3a2e17",
      color: "#e5ad42",
    },

    ACCEPTED: {
      background: "#123f52",
      color: "#35c9f2",
    },

    IN_PROGRESS: {
      background: "#173b4b",
      color: "#48d3f5",
    },

    COMPLETED: {
      background: "#12382b",
      color: "#39c98a",
    },

    CANCELLED: {
      background: "#3b2023",
      color: "#ff6b6b",
    },
  };

  const current =
    styles[status] ||
    styles.PENDING;

  return (
    <span
      style={{
        ...statusBadge,
        background:
          current.background,
        color: current.color,
      }}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function PaymentBadge({ payment }) {
  const styles = {
    PAID: {
      background: "#12382b",
      color: "#39c98a",
    },

    PARTIAL: {
      background: "#3a2e17",
      color: "#e5ad42",
    },

    UNPAID: {
      background: "#3b2023",
      color: "#ff6b6b",
    },
  };

  const current =
    styles[payment] ||
    styles.UNPAID;

  return (
    <span
      style={{
        ...statusBadge,
        background:
          current.background,
        color: current.color,
      }}
    >
      {payment}
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

      <div style={detailContent}>
        <span>{label}</span>

        <strong>
          {value}
        </strong>
      </div>
    </div>
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
  borderBottom: "1px solid #203542",
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

const totalCard = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 18px",
  background: "#101f2a",
  border: "1px solid #203542",
  borderRadius: "12px",
  color: "#35c9f2",
  flexShrink: 0,
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
  minWidth: 0,
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
  whiteSpace: "nowrap",
};

const summaryValue = {
  display: "block",
  marginTop: "4px",
  fontSize: "21px",
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
  maxWidth: "560px",
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
  padding: "9px 11px",
  fontSize: "8px",
  fontWeight: "800",
  cursor: "pointer",
};

const activeFilter = {
  background: "#123f52",
  borderColor: "#20556a",
  color: "#35c9f2",
};

const customerNotice = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  marginBottom: "16px",
  padding: "12px 15px",
  borderRadius: "11px",
  background: "#123f52",
  border: "1px solid #20556a",
  color: "#b8dce8",
  fontSize: "12px",
};

const clearCustomer = {
  marginLeft: "auto",
  border: "none",
  background: "transparent",
  color: "#35c9f2",
  cursor: "pointer",
  fontWeight: "800",
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
  borderBottom: "1px solid #203542",
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
  padding: "14px 14px",
  textAlign: "left",
  fontSize: "8px",
  fontWeight: "900",
  letterSpacing: "1px",
  color: "#8fa8b5",
  background: "#0d1b25",
  borderBottom: "1px solid #203542",
  whiteSpace: "nowrap",
};

const td = {
  padding: "14px",
  textAlign: "left",
  fontSize: "11px",
  color: "#b8cbd3",
  borderBottom: "1px solid #1c303c",
  verticalAlign: "middle",
  overflow: "hidden",
};

const bookingCell = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  minWidth: 0,
};

const bookingIcon = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const bookingId = {
  display: "block",
  color: "#35c9f2",
  fontSize: "11px",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const bookingAppliance = {
  display: "block",
  color: "#78909c",
  fontSize: "9px",
  marginTop: "3px",
};

const personCell = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  minWidth: 0,
};

const smallAvatar = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  background: "#173b4b",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
  fontSize: "11px",
  flexShrink: 0,
};

const technicianAvatar = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  background: "#29213b",
  color: "#b79aff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const personInfo = {
  minWidth: 0,
};

const personName = {
  display: "block",
  color: "#e8f4f8",
  fontSize: "11px",
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

const serviceText = {
  color: "#b8cbd3",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const dateCell = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const dateCellTop = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
};

const amountCell = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
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

const statusBadge = {
  display: "inline-block",
  padding: "6px 8px",
  borderRadius: "20px",
  fontSize: "7px",
  fontWeight: "900",
  letterSpacing: ".3px",
  whiteSpace: "nowrap",
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

const modalHeading = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  marginBottom: "18px",
};

const modalBookingIcon = {
  width: "52px",
  height: "52px",
  borderRadius: "14px",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const modalTitle = {
  margin: "5px 0 3px",
  fontSize: "22px",
  color: "#e8f4f8",
};

const modalSubtitle = {
  margin: 0,
  color: "#78909c",
  fontSize: "11px",
};

const modalStatusRow = {
  display: "flex",
  gap: "7px",
  flexWrap: "wrap",
  marginBottom: "18px",
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
  minWidth: 0,
};

const detailIcon = {
  color: "#35c9f2",
  flexShrink: 0,
};

const detailContent = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  minWidth: 0,
};

const warningBox = {
  marginTop: "15px",
  padding: "13px",
  borderRadius: "11px",
  background: "#3a2e17",
  border: "1px solid #604c25",
  color: "#e5ad42",
  fontSize: "12px",
  display: "flex",
  gap: "9px",
  lineHeight: "1.5",
};

const actionTitle = {
  marginTop: "22px",
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

const successButton = {
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

const blueButton = {
  border: "1px solid #20556a",
  borderRadius: "10px",
  background: "#123f52",
  color: "#35c9f2",
  padding: "12px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
};

const dangerButton = {
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

export default AdminBookings;