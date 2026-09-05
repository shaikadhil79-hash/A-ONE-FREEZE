import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Snowflake,
  Search,
  IndianRupee,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  CreditCard,
  Receipt,
  User,
  UserCog,
  CalendarDays,
  X,
  MoreVertical,
  Banknote,
  Smartphone,
} from "lucide-react";

function AdminPayments() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);

  const [payments, setPayments] = useState([
    {
      id: "PAY-2026-0001",
      bookingId: "AOF-2026-00124",
      customerId: "CUS-001",
      customer: "Adhil Shaik",
      technicianId: "TECH-001",
      technician: "Ravi Kumar",
      service: "AC Repair & Service",
      amount: 1299,
      paid: 1299,
      due: 0,
      method: "UPI",
      transactionId: "UPI784512963",
      date: "25 Aug 2026",
      time: "11:42 AM",
      status: "PAID",
    },
    {
      id: "PAY-2026-0002",
      bookingId: "AOF-2026-00125",
      customerId: "CUS-002",
      customer: "Arun Kumar",
      technicianId: "TECH-002",
      technician: "Arun Kumar",
      service: "Refrigerator Service",
      amount: 899,
      paid: 899,
      due: 0,
      method: "CARD",
      transactionId: "CARD638291",
      date: "25 Aug 2026",
      time: "12:18 PM",
      status: "PAID",
    },
    {
      id: "PAY-2026-0003",
      bookingId: "AOF-2026-00126",
      customerId: "CUS-003",
      customer: "Mohammed Sameer",
      technicianId: "TECH-005",
      technician: "Mohammed Faisal",
      service: "AC Gas Filling",
      amount: 1499,
      paid: 750,
      due: 749,
      method: "UPI",
      transactionId: "UPI192847561",
      date: "25 Aug 2026",
      time: "01:48 PM",
      status: "PARTIAL",
    },
    {
      id: "PAY-2026-0004",
      bookingId: "AOF-2026-00127",
      customerId: "CUS-005",
      customer: "Faisal Ahmed",
      technicianId: "TECH-003",
      technician: "Vijay",
      service: "Washing Machine Repair",
      amount: 799,
      paid: 799,
      due: 0,
      method: "CASH",
      transactionId: "CASH-00127",
      date: "25 Aug 2026",
      time: "04:52 PM",
      status: "PAID",
    },
    {
      id: "PAY-2026-0005",
      bookingId: "AOF-2026-00128",
      customerId: "CUS-006",
      customer: "Rahul Kumar",
      technicianId: "TECH-004",
      technician: "Suresh",
      service: "Water Heater Service",
      amount: 599,
      paid: 0,
      due: 599,
      method: "NOT PAID",
      transactionId: "-",
      date: "26 Aug 2026",
      time: "-",
      status: "UNPAID",
    },
    {
      id: "PAY-2026-0006",
      bookingId: "AOF-2026-00129",
      customerId: "CUS-004",
      customer: "Suresh B",
      technicianId: "TECH-002",
      technician: "Arun Kumar",
      service: "AC Installation",
      amount: 1899,
      paid: 0,
      due: 1899,
      method: "NOT PAID",
      transactionId: "-",
      date: "26 Aug 2026",
      time: "-",
      status: "UNPAID",
    },
  ]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        payment.id.toLowerCase().includes(query) ||
        payment.bookingId.toLowerCase().includes(query) ||
        payment.customer.toLowerCase().includes(query) ||
        payment.technician.toLowerCase().includes(query) ||
        payment.transactionId
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "ALL" ||
        payment.status === filter ||
        payment.method === filter;

      return matchesSearch && matchesFilter;
    });
  }, [payments, search, filter]);

  const totalAmount = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const totalCollected = payments.reduce(
    (total, payment) => total + payment.paid,
    0
  );

  const totalDue = payments.reduce(
    (total, payment) => total + payment.due,
    0
  );

  const paidCount = payments.filter(
    (payment) => payment.status === "PAID"
  ).length;

  const partialCount = payments.filter(
    (payment) => payment.status === "PARTIAL"
  ).length;

  const unpaidCount = payments.filter(
    (payment) => payment.status === "UNPAID"
  ).length;

  const markAsPaid = (paymentId) => {
    setPayments((current) =>
      current.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              paid: payment.amount,
              due: 0,
              status: "PAID",
              method:
                payment.method === "NOT PAID"
                  ? "CASH"
                  : payment.method,
              transactionId:
                payment.transactionId === "-"
                  ? `ADMIN-${Date.now()}`
                  : payment.transactionId,
              time: "Just now",
            }
          : payment
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
              PAYMENT MANAGEMENT
            </span>

            <h1 style={pageTitle}>
              Payments
            </h1>

            <p style={pageDescription}>
              Monitor customer payments, outstanding
              dues and transaction records.
            </p>
          </div>

          <div style={collectionCard}>
            <IndianRupee size={19} />

            <div>
              <span>Total Collected</span>

              <strong>
                ₹{totalCollected}
              </strong>
            </div>
          </div>
        </div>

        {/* SUMMARY */}

        <section style={summaryGrid}>
          <SummaryCard
            label="TOTAL VALUE"
            value={`₹${totalAmount}`}
            icon={<IndianRupee size={19} />}
            type="blue"
          />

          <SummaryCard
            label="COLLECTED"
            value={`₹${totalCollected}`}
            icon={<CheckCircle2 size={19} />}
            type="success"
          />

          <SummaryCard
            label="CUSTOMER DUE"
            value={`₹${totalDue}`}
            icon={<AlertTriangle size={19} />}
            type="danger"
          />

          <SummaryCard
            label="PARTIAL"
            value={partialCount}
            icon={<Clock3 size={19} />}
            type="warning"
          />

          <SummaryCard
            label="UNPAID"
            value={unpaidCount}
            icon={<CreditCard size={19} />}
            type="purple"
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
              placeholder="Search payment, booking, customer or transaction..."
              style={searchInput}
            />
          </div>

          <div style={filters}>
            {[
              "ALL",
              "PAID",
              "PARTIAL",
              "UNPAID",
              "UPI",
              "CARD",
              "CASH",
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

        {/* PAYMENT TABLE */}

        <section style={tableCard}>
          <div style={tableHeader}>
            <div>
              <span style={eyebrow}>
                PAYMENT DIRECTORY
              </span>

              <h2 style={tableTitle}>
                All Transactions
              </h2>
            </div>

            <span style={resultCount}>
              {filteredPayments.length} results
            </span>
          </div>

          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={{ ...th, width: "16%" }}>
                    PAYMENT
                  </th>

                  <th style={{ ...th, width: "16%" }}>
                    CUSTOMER
                  </th>

                  <th style={{ ...th, width: "15%" }}>
                    TECHNICIAN
                  </th>

                  <th style={{ ...th, width: "15%" }}>
                    SERVICE
                  </th>

                  <th style={{ ...th, width: "10%" }}>
                    AMOUNT
                  </th>

                  <th style={{ ...th, width: "10%" }}>
                    METHOD
                  </th>

                  <th style={{ ...th, width: "10%" }}>
                    STATUS
                  </th>

                  <th style={{ ...th, width: "8%" }}>
                    DATE
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map(
                  (payment) => (
                    <tr key={payment.id}>
                      {/* PAYMENT */}

                      <td style={td}>
                        <div style={paymentCell}>
                          <div style={paymentIcon}>
                            <Receipt size={17} />
                          </div>

                          <div>
                            <strong style={paymentId}>
                              {payment.id}
                            </strong>

                            <span style={bookingId}>
                              {payment.bookingId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CUSTOMER */}

                      <td style={td}>
                        <div style={personCell}>
                          <div style={customerAvatar}>
                            {payment.customer
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div style={personInfo}>
                            <strong style={personName}>
                              {payment.customer}
                            </strong>

                            <span style={personId}>
                              {payment.customerId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* TECHNICIAN */}

                      <td style={td}>
                        <div style={personCell}>
                          <div style={technicianAvatar}>
                            <UserCog size={14} />
                          </div>

                          <div style={personInfo}>
                            <strong style={personName}>
                              {payment.technician}
                            </strong>

                            <span style={personId}>
                              {payment.technicianId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SERVICE */}

                      <td style={td}>
                        <span style={serviceText}>
                          {payment.service}
                        </span>
                      </td>

                      {/* AMOUNT */}

                      <td style={td}>
                        <div style={amountCell}>
                          <strong style={amount}>
                            ₹{payment.paid}
                          </strong>

                          {payment.due > 0 && (
                            <span style={dueText}>
                              Due ₹{payment.due}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* METHOD */}

                      <td style={td}>
                        <PaymentMethod
                          method={payment.method}
                        />
                      </td>

                      {/* STATUS */}

                      <td style={td}>
                        <PaymentStatus
                          status={payment.status}
                        />
                      </td>

                      {/* DATE */}

                      <td style={td}>
                        <div style={dateCell}>
                          <span>
                            {payment.date}
                          </span>

                          <small>
                            {payment.time}
                          </small>
                        </div>
                      </td>

                      <td style={hiddenCell}>
                        <button
                          onClick={() =>
                            setSelected(payment)
                          }
                          style={moreButton}
                        >
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {/* ACTION BUTTON COLUMN OVERLAY */}

            <div style={actionColumn}>
              {filteredPayments.map((payment) => (
                <button
                  key={payment.id}
                  onClick={() =>
                    setSelected(payment)
                  }
                  style={moreButton}
                >
                  <MoreVertical size={18} />
                </button>
              ))}
            </div>
          </div>

          {filteredPayments.length === 0 && (
            <div style={emptyState}>
              <Receipt size={42} />

              <h3>
                No payments found
              </h3>

              <p>
                Try changing your search or filter.
              </p>
            </div>
          )}
        </section>

        {/* PAYMENT COUNTERS */}

        <div style={footerStats}>
          <div>
            <span>Paid Transactions</span>
            <strong style={{ color: "#39c98a" }}>
              {paidCount}
            </strong>
          </div>

          <div>
            <span>Partial Payments</span>
            <strong style={{ color: "#e5ad42" }}>
              {partialCount}
            </strong>
          </div>

          <div>
            <span>Unpaid Transactions</span>
            <strong style={{ color: "#ff6b6b" }}>
              {unpaidCount}
            </strong>
          </div>
        </div>
      </main>

      {/* PAYMENT DETAILS MODAL */}

      {selected && (
        <div style={modalOverlay}>
          <div style={modal}>
            <button
              onClick={() => setSelected(null)}
              style={modalClose}
            >
              <X size={18} />
            </button>

            <div style={modalTop}>
              <div style={modalIcon}>
                <Receipt size={23} />
              </div>

              <div>
                <span style={eyebrow}>
                  PAYMENT DETAILS
                </span>

                <h2 style={modalTitle}>
                  {selected.id}
                </h2>

                <p style={modalSubtitle}>
                  {selected.bookingId}
                </p>
              </div>
            </div>

            <div style={modalStatus}>
              <PaymentStatus
                status={selected.status}
              />

              <PaymentMethod
                method={selected.method}
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
                label="Technician"
                value={selected.technician}
                icon={<UserCog size={16} />}
              />

              <Detail
                label="Service"
                value={selected.service}
                icon={<Receipt size={16} />}
              />

              <Detail
                label="Payment Date"
                value={selected.date}
                icon={<CalendarDays size={16} />}
              />

              <Detail
                label="Total Amount"
                value={`₹${selected.amount}`}
                icon={<IndianRupee size={16} />}
              />

              <Detail
                label="Paid Amount"
                value={`₹${selected.paid}`}
                icon={<CheckCircle2 size={16} />}
              />

              <Detail
                label="Outstanding Due"
                value={`₹${selected.due}`}
                icon={<AlertTriangle size={16} />}
              />

              <Detail
                label="Payment Method"
                value={selected.method}
                icon={<CreditCard size={16} />}
              />

              <Detail
                label="Transaction ID"
                value={selected.transactionId}
                icon={<Receipt size={16} />}
              />

              <Detail
                label="Payment Time"
                value={selected.time}
                icon={<Clock3 size={16} />}
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
                    ₹{selected.due} is still pending
                    for this booking.
                  </span>
                </div>
              </div>
            )}

            {/* ACTIONS */}

            {selected.status !== "PAID" && (
              <>
                <div style={actionTitle}>
                  PAYMENT ACTIONS
                </div>

                <button
                  onClick={() =>
                    markAsPaid(selected.id)
                  }
                  style={markPaidButton}
                >
                  <CheckCircle2 size={17} />
                  Mark Full Payment Received
                </button>
              </>
            )}

            <button
              onClick={() => setSelected(null)}
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
          background: current.background,
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
   PAYMENT STATUS
===================================================== */

function PaymentStatus({ status }) {
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
    styles[status] || styles.UNPAID;

  return (
    <span
      style={{
        ...statusBadge,
        background: current.background,
        color: current.color,
      }}
    >
      {status}
    </span>
  );
}

/* =====================================================
   PAYMENT METHOD
===================================================== */

function PaymentMethod({ method }) {
  let icon = <CreditCard size={13} />;

  if (method === "UPI") {
    icon = <Smartphone size={13} />;
  }

  if (method === "CASH") {
    icon = <Banknote size={13} />;
  }

  return (
    <span style={methodBadge}>
      {icon}
      {method}
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

        <strong>{value}</strong>
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

const collectionCard = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 18px",
  background: "#101f2a",
  border: "1px solid #203542",
  borderRadius: "12px",
  color: "#39c98a",
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
  fontSize: "20px",
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
  position: "relative",
};

const table = {
  width: "100%",
  minWidth: "1300px",
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

const hiddenCell = {
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  opacity: 0,
};

const paymentCell = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  minWidth: 0,
};

const paymentIcon = {
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

const paymentId = {
  display: "block",
  color: "#35c9f2",
  fontSize: "11px",
  fontWeight: "900",
};

const bookingId = {
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

const personInfo = {
  minWidth: 0,
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

const serviceText = {
  color: "#b8cbd3",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const amountCell = {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
};

const amount = {
  color: "#39c98a",
  fontSize: "12px",
};

const dueText = {
  color: "#ff6b6b",
  fontSize: "8px",
  fontWeight: "700",
};

const methodBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  padding: "6px 8px",
  borderRadius: "20px",
  background: "#173b4b",
  color: "#8fd9eb",
  fontSize: "8px",
  fontWeight: "800",
  whiteSpace: "nowrap",
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

const dateCell = {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  color: "#b8cbd3",
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

const actionColumn = {
  position: "absolute",
  right: "12px",
  top: "55px",
  display: "flex",
  flexDirection: "column",
};

const emptyState = {
  padding: "70px 20px",
  textAlign: "center",
  color: "#8fa8b5",
};

const footerStats = {
  marginTop: "15px",
  display: "grid",
  gridTemplateColumns:
    "repeat(3, minmax(0, 1fr))",
  gap: "12px",
};

const footerStat = {
  background: "#101f2a",
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
  boxShadow: "0 25px 70px rgba(0,0,0,.45)",
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

const modalIcon = {
  width: "56px",
  height: "56px",
  borderRadius: "15px",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
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

const actionTitle = {
  marginTop: "22px",
  marginBottom: "10px",
  color: "#8fa8b5",
  fontSize: "9px",
  fontWeight: "900",
  letterSpacing: "1.5px",
};

const markPaidButton = {
  width: "100%",
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

export default AdminPayments;