import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Snowflake,
  Search,
  Users,
  CircleCheck,
  CircleX,
  AlertTriangle,
  MoreVertical,
  X,
  Phone,
  MapPin,
  CalendarDays,
  IndianRupee,
  ClipboardList,
  ShieldAlert,
} from "lucide-react";

function AdminCustomers() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);

  const [customers, setCustomers] = useState([
    {
      id: "CUS-001",
      name: "Adhil Shaik",
      phone: "9876543201",
      location: "Alwarthirunagar, Chennai",
      joined: "12 Jan 2026",
      bookings: 14,
      completed: 12,
      cancelled: 1,
      due: 0,
      status: "ACTIVE",
    },
    {
      id: "CUS-002",
      name: "Arun Kumar",
      phone: "9876543202",
      location: "Anna Nagar, Chennai",
      joined: "28 Jan 2026",
      bookings: 8,
      completed: 7,
      cancelled: 0,
      due: 250,
      status: "ACTIVE",
    },
    {
      id: "CUS-003",
      name: "Mohammed Sameer",
      phone: "9876543203",
      location: "T. Nagar, Chennai",
      joined: "03 Feb 2026",
      bookings: 19,
      completed: 15,
      cancelled: 3,
      due: 750,
      status: "ACTIVE",
    },
    {
      id: "CUS-004",
      name: "Suresh B",
      phone: "9876543204",
      location: "Porur, Chennai",
      joined: "18 Feb 2026",
      bookings: 5,
      completed: 4,
      cancelled: 1,
      due: 0,
      status: "BLOCKED",
    },
    {
      id: "CUS-005",
      name: "Faisal Ahmed",
      phone: "9876543205",
      location: "Guindy, Chennai",
      joined: "01 Mar 2026",
      bookings: 23,
      completed: 21,
      cancelled: 1,
      due: 120,
      status: "ACTIVE",
    },
    {
      id: "CUS-006",
      name: "Rahul Kumar",
      phone: "9876543206",
      location: "Velachery, Chennai",
      joined: "15 Mar 2026",
      bookings: 3,
      completed: 2,
      cancelled: 0,
      due: 0,
      status: "ACTIVE",
    },
  ]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.id.toLowerCase().includes(query) ||
        customer.phone.includes(query);

      const matchesFilter =
        filter === "ALL" ||
        customer.status === filter ||
        (filter === "DUE" && customer.due > 0);

      return matchesSearch && matchesFilter;
    });
  }, [customers, search, filter]);

  const activeCount = customers.filter(
    (customer) => customer.status === "ACTIVE"
  ).length;

  const blockedCount = customers.filter(
    (customer) => customer.status === "BLOCKED"
  ).length;

  const dueCount = customers.filter(
    (customer) => customer.due > 0
  ).length;

  const totalDue = customers.reduce(
    (total, customer) => total + customer.due,
    0
  );

  const totalBookings = customers.reduce(
    (total, customer) => total + customer.bookings,
    0
  );

  const blockCustomer = (id) => {
    setCustomers((current) =>
      current.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              status: "BLOCKED",
            }
          : customer
      )
    );

    setSelected(null);
  };

  const unblockCustomer = (id) => {
    setCustomers((current) =>
      current.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              status: "ACTIVE",
            }
          : customer
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

      {/* MAIN */}

      <main style={mainStyle}>
        <div style={pageHeading}>
          <div>
            <span style={eyebrow}>
              CUSTOMER MANAGEMENT
            </span>

            <h1 style={pageTitle}>
              Customers
            </h1>

            <p style={pageDescription}>
              Manage customer accounts, bookings,
              payments and account status.
            </p>
          </div>

          <div style={totalCard}>
            <Users size={19} />

            <div>
              <span>Total Customers</span>
              <strong>{customers.length}</strong>
            </div>
          </div>
        </div>

        {/* SUMMARY */}

        <section style={summaryGrid}>
          <SummaryCard
            label="ACTIVE"
            value={activeCount}
            icon={<CircleCheck size={19} />}
            type="success"
          />

          <SummaryCard
            label="BLOCKED"
            value={blockedCount}
            icon={<CircleX size={19} />}
            type="danger"
          />

          <SummaryCard
            label="CUSTOMERS WITH DUE"
            value={dueCount}
            icon={<AlertTriangle size={19} />}
            type="warning"
          />

          <SummaryCard
            label="TOTAL BOOKINGS"
            value={totalBookings}
            icon={<ClipboardList size={19} />}
            type="blue"
          />

          <SummaryCard
            label="TOTAL CUSTOMER DUE"
            value={`₹${totalDue}`}
            icon={<IndianRupee size={19} />}
            type="purple"
          />
        </section>

        {/* SEARCH / FILTER */}

        <section style={toolbar}>
          <div style={searchBox}>
            <Search size={18} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search customer, ID or phone..."
              style={searchInput}
            />
          </div>

          <div style={filters}>
            {[
              "ALL",
              "ACTIVE",
              "BLOCKED",
              "DUE",
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
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* CUSTOMER TABLE */}

        <section style={tableCard}>
          <div style={tableHeader}>
            <div>
              <span style={eyebrow}>
                CUSTOMER DIRECTORY
              </span>

              <h2 style={tableTitle}>
                All Customers
              </h2>
            </div>

            <span style={resultCount}>
              {filteredCustomers.length} results
            </span>
          </div>

          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={{ ...th, width: "20%" }}>
                    CUSTOMER
                  </th>

                  <th style={{ ...th, width: "17%" }}>
                    LOCATION
                  </th>

                  <th style={{ ...th, width: "11%" }}>
                    BOOKINGS
                  </th>

                  <th style={{ ...th, width: "13%" }}>
                    COMPLETED
                  </th>

                  <th style={{ ...th, width: "11%" }}>
                    CANCELLED
                  </th>

                  <th style={{ ...th, width: "11%" }}>
                    DUE
                  </th>

                  <th style={{ ...th, width: "11%" }}>
                    STATUS
                  </th>

                  <th style={{ ...th, width: "6%" }} />
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map(
                  (customer) => (
                    <tr key={customer.id}>
                      <td style={td}>
                        <div style={customerCell}>
                          <div style={avatar}>
                            {customer.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div style={customerInfo}>
                            <strong
                              style={customerName}
                            >
                              {customer.name}
                            </strong>

                            <span
                              style={customerId}
                            >
                              {customer.id}
                            </span>

                            <span
                              style={customerPhone}
                            >
                              {customer.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={td}>
                        <span
                          style={locationText}
                        >
                          <MapPin size={14} />

                          {customer.location}
                        </span>
                      </td>

                      <td style={td}>
                        <strong>
                          {customer.bookings}
                        </strong>
                      </td>

                      <td style={td}>
                        <span
                          style={completedText}
                        >
                          <CircleCheck size={14} />
                          {customer.completed}
                        </span>
                      </td>

                      <td style={td}>
                        <span
                          style={{
                            color:
                              customer.cancelled >
                              1
                                ? "#ff6b6b"
                                : "#8fa8b5",
                            fontWeight: "800",
                          }}
                        >
                          {customer.cancelled}
                        </span>
                      </td>

                      <td style={td}>
                        <strong
                          style={{
                            color:
                              customer.due > 0
                                ? "#e5ad42"
                                : "#39c98a",
                          }}
                        >
                          ₹{customer.due}
                        </strong>
                      </td>

                      <td style={td}>
                        <StatusBadge
                          type={
                            customer.status ===
                            "ACTIVE"
                              ? "success"
                              : "danger"
                          }
                          text={
                            customer.status
                          }
                        />
                      </td>

                      <td style={td}>
                        <button
                          onClick={() =>
                            setSelected(
                              customer
                            )
                          }
                          style={moreButton}
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

          {filteredCustomers.length === 0 && (
            <div style={emptyState}>
              <Users size={42} />

              <h3>
                No customers found
              </h3>

              <p>
                Try changing your search or
                filter.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* CUSTOMER DETAILS MODAL */}

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
              <div style={modalAvatar}>
                {selected.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <span style={eyebrow}>
                  CUSTOMER
                </span>

                <h2 style={modalTitle}>
                  {selected.name}
                </h2>

                <p style={modalId}>
                  {selected.id}
                </p>
              </div>
            </div>

            <div style={modalStatus}>
              <StatusBadge
                type={
                  selected.status ===
                  "ACTIVE"
                    ? "success"
                    : "danger"
                }
                text={selected.status}
              />

              {selected.due > 0 && (
                <StatusBadge
                  type="warning"
                  text="PAYMENT DUE"
                />
              )}
            </div>

            {/* DETAILS */}

            <div style={detailsGrid}>
              <Detail
                label="Phone"
                value={selected.phone}
                icon={<Phone size={16} />}
              />

              <Detail
                label="Location"
                value={selected.location}
                icon={<MapPin size={16} />}
              />

              <Detail
                label="Joined"
                value={selected.joined}
                icon={
                  <CalendarDays size={16} />
                }
              />

              <Detail
                label="Total Bookings"
                value={selected.bookings}
                icon={
                  <ClipboardList size={16} />
                }
              />

              <Detail
                label="Completed"
                value={selected.completed}
                icon={
                  <CircleCheck size={16} />
                }
              />

              <Detail
                label="Cancelled"
                value={selected.cancelled}
                icon={<CircleX size={16} />}
              />

              <Detail
                label="Outstanding Due"
                value={`₹${selected.due}`}
                icon={
                  <IndianRupee size={16} />
                }
              />

              <Detail
                label="Account Status"
                value={selected.status}
                icon={
                  <ShieldAlert size={16} />
                }
              />
            </div>

            {/* DUE WARNING */}

            {selected.due > 0 && (
              <div style={warningBox}>
                <AlertTriangle size={18} />

                <div>
                  <strong>
                    Outstanding payment
                  </strong>

                  <span>
                    This customer has ₹
                    {selected.due} pending.
                    Payment status should be
                    verified before allowing
                    restricted services.
                  </span>
                </div>
              </div>
            )}

            {/* ACTIONS */}

            <div style={modalActions}>
              {selected.status ===
              "BLOCKED" ? (
                <button
                  onClick={() =>
                    unblockCustomer(
                      selected.id
                    )
                  }
                  style={activateButton}
                >
                  <CircleCheck size={17} />
                  Unblock Customer
                </button>
              ) : (
                <button
                  onClick={() =>
                    blockCustomer(
                      selected.id
                    )
                  }
                  style={blockButton}
                >
                  <ShieldAlert size={17} />
                  Block Customer
                </button>
              )}

              <button
                onClick={() =>
                  setSelected(null)
                }
                style={cancelButton}
              >
                Close
              </button>
            </div>

            <button
              onClick={() => {
                setSelected(null);
                navigate(
                  `/admin/bookings?customer=${selected.id}`
                );
              }}
              style={bookingButton}
            >
              <ClipboardList size={17} />
              View Customer Bookings
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
   STATUS BADGE
===================================================== */

function StatusBadge({
  type,
  text,
}) {
  const styles = {
    success: {
      background: "#12382b",
      color: "#39c98a",
    },

    danger: {
      background: "#3b2023",
      color: "#ff6b6b",
    },

    warning: {
      background: "#3a2e17",
      color: "#e5ad42",
    },
  };

  return (
    <span
      style={{
        ...statusBadge,
        ...styles[type],
      }}
    >
      {text}
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
  maxWidth: "1450px",
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
  maxWidth: "500px",
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
  padding: "9px 12px",
  fontSize: "9px",
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
  minWidth: "1100px",
  tableLayout: "fixed",
  borderCollapse: "collapse",
};

const th = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "9px",
  fontWeight: "900",
  letterSpacing: "1px",
  color: "#8fa8b5",
  background: "#0d1b25",
  borderBottom: "1px solid #203542",
  whiteSpace: "nowrap",
};

const td = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "12px",
  color: "#b8cbd3",
  borderBottom: "1px solid #1c303c",
  verticalAlign: "middle",
  overflow: "hidden",
};

const customerCell = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
};

const avatar = {
  width: "39px",
  height: "39px",
  borderRadius: "50%",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
  flexShrink: 0,
};

const customerInfo = {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  minWidth: 0,
};

const customerName = {
  display: "block",
  fontSize: "13px",
  fontWeight: "800",
  color: "#e8f4f8",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const customerId = {
  display: "block",
  fontSize: "9px",
  color: "#35c9f2",
  fontWeight: "700",
};

const customerPhone = {
  display: "block",
  fontSize: "9px",
  color: "#78909c",
};

const locationText = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  color: "#8fa8b5",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const completedText = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  color: "#39c98a",
  fontWeight: "800",
};

const statusBadge = {
  display: "inline-block",
  padding: "6px 9px",
  borderRadius: "20px",
  fontSize: "8px",
  fontWeight: "900",
  letterSpacing: ".3px",
  whiteSpace: "nowrap",
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
  maxWidth: "560px",
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
  marginBottom: "18px",
};

const modalAvatar = {
  width: "60px",
  height: "60px",
  borderRadius: "17px",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "23px",
  fontWeight: "900",
  flexShrink: 0,
};

const modalTitle = {
  margin: "5px 0 3px",
  fontSize: "24px",
  color: "#e8f4f8",
};

const modalId = {
  margin: 0,
  color: "#78909c",
  fontSize: "11px",
};

const modalStatus = {
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

const modalActions = {
  display: "flex",
  gap: "10px",
  marginTop: "22px",
};

const activateButton = {
  flex: 1,
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

const blockButton = {
  flex: 1,
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

const cancelButton = {
  border: "1px solid #29414e",
  borderRadius: "10px",
  background: "#142631",
  color: "#8fa8b5",
  padding: "12px 18px",
  fontWeight: "700",
  cursor: "pointer",
};

const bookingButton = {
  width: "100%",
  marginTop: "10px",
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

export default AdminCustomers;