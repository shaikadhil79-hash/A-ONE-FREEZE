import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Snowflake,
  Search,
  IndianRupee,
  TrendingUp,
  Users,
  Wallet,
  CheckCircle2,
  Clock3,
  X,
  Receipt,
  UserCog,
  CalendarDays,
  Percent,
  MoreVertical,
} from "lucide-react";

function AdminCommission() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);

  const [records, setRecords] = useState([
    {
      id: "COM-2026-001",
      bookingId: "AOF-2026-00124",
      technicianId: "TECH-001",
      technician: "Ravi Kumar",
      customer: "Adhil Shaik",
      service: "AC Repair & Service",
      serviceAmount: 1299,
      commissionRate: 20,
      commission: 260,
      technicianPayout: 1039,
      date: "25 Aug 2026",
      status: "PAID",
    },
    {
      id: "COM-2026-002",
      bookingId: "AOF-2026-00125",
      technicianId: "TECH-002",
      technician: "Arun Kumar",
      customer: "Arun Kumar",
      service: "Refrigerator Service",
      serviceAmount: 899,
      commissionRate: 20,
      commission: 180,
      technicianPayout: 719,
      date: "25 Aug 2026",
      status: "PAID",
    },
    {
      id: "COM-2026-003",
      bookingId: "AOF-2026-00126",
      technicianId: "TECH-005",
      technician: "Mohammed Faisal",
      customer: "Mohammed Sameer",
      service: "AC Gas Filling",
      serviceAmount: 1499,
      commissionRate: 20,
      commission: 300,
      technicianPayout: 1199,
      date: "25 Aug 2026",
      status: "PENDING",
    },
    {
      id: "COM-2026-004",
      bookingId: "AOF-2026-00127",
      technicianId: "TECH-003",
      technician: "Vijay",
      customer: "Faisal Ahmed",
      service: "Washing Machine Repair",
      serviceAmount: 799,
      commissionRate: 20,
      commission: 160,
      technicianPayout: 639,
      date: "25 Aug 2026",
      status: "PAID",
    },
    {
      id: "COM-2026-005",
      bookingId: "AOF-2026-00128",
      technicianId: "TECH-004",
      technician: "Suresh",
      customer: "Rahul Kumar",
      service: "Water Heater Service",
      serviceAmount: 599,
      commissionRate: 20,
      commission: 120,
      technicianPayout: 479,
      date: "26 Aug 2026",
      status: "PENDING",
    },
    {
      id: "COM-2026-006",
      bookingId: "AOF-2026-00129",
      technicianId: "TECH-002",
      technician: "Arun Kumar",
      customer: "Suresh B",
      service: "AC Installation",
      serviceAmount: 1899,
      commissionRate: 20,
      commission: 380,
      technicianPayout: 1519,
      date: "26 Aug 2026",
      status: "PENDING",
    },
  ]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        record.id.toLowerCase().includes(query) ||
        record.bookingId.toLowerCase().includes(query) ||
        record.technician.toLowerCase().includes(query) ||
        record.customer.toLowerCase().includes(query) ||
        record.service.toLowerCase().includes(query);

      const matchesFilter =
        filter === "ALL" ||
        record.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [records, search, filter]);

  const totalRevenue = records.reduce(
    (sum, record) => sum + record.serviceAmount,
    0
  );

  const totalCommission = records.reduce(
    (sum, record) => sum + record.commission,
    0
  );

  const totalPayout = records.reduce(
    (sum, record) => sum + record.technicianPayout,
    0
  );

  const pendingCommission = records
    .filter((record) => record.status === "PENDING")
    .reduce(
      (sum, record) => sum + record.commission,
      0
    );

  const paidCommission = records
    .filter((record) => record.status === "PAID")
    .reduce(
      (sum, record) => sum + record.commission,
      0
    );

  const paidCount = records.filter(
    (record) => record.status === "PAID"
  ).length;

  const pendingCount = records.filter(
    (record) => record.status === "PENDING"
  ).length;

  const markAsPaid = (id) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? {
              ...record,
              status: "PAID",
            }
          : record
      )
    );

    setSelected(null);
  };

  return (
    <div style={pageStyle}>
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
        <div style={pageHeading}>
          <div>
            <span style={eyebrow}>
              FINANCIAL MANAGEMENT
            </span>

            <h1 style={pageTitle}>
              Commission
            </h1>

            <p style={pageDescription}>
              Track A-ONE FREEZE commission and
              technician payouts for completed services.
            </p>
          </div>

          <div style={commissionRateCard}>
            <Percent size={18} />

            <div>
              <span>Default Commission</span>
              <strong>20%</strong>
            </div>
          </div>
        </div>

        <section style={summaryGrid}>
          <SummaryCard
            label="SERVICE REVENUE"
            value={`₹${totalRevenue}`}
            icon={<TrendingUp size={19} />}
            type="blue"
          />

          <SummaryCard
            label="A-ONE COMMISSION"
            value={`₹${totalCommission}`}
            icon={<IndianRupee size={19} />}
            type="success"
          />

          <SummaryCard
            label="TECHNICIAN PAYOUT"
            value={`₹${totalPayout}`}
            icon={<Wallet size={19} />}
            type="purple"
          />

          <SummaryCard
            label="PAID COMMISSION"
            value={`₹${paidCommission}`}
            icon={<CheckCircle2 size={19} />}
            type="success"
          />

          <SummaryCard
            label="PENDING COMMISSION"
            value={`₹${pendingCommission}`}
            icon={<Clock3 size={19} />}
            type="warning"
          />
        </section>

        <section style={toolbar}>
          <div style={searchBox}>
            <Search size={18} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search booking, technician or service..."
              style={searchInput}
            />
          </div>

          <div style={filters}>
            {["ALL", "PAID", "PENDING"].map(
              (item) => (
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
                  {item}
                </button>
              )
            )}
          </div>
        </section>

        <section style={tableCard}>
          <div style={tableHeader}>
            <div>
              <span style={eyebrow}>
                COMMISSION DIRECTORY
              </span>

              <h2 style={tableTitle}>
                Commission Transactions
              </h2>
            </div>

            <span style={resultCount}>
              {filteredRecords.length} results
            </span>
          </div>

          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={{ ...th, width: "15%" }}>
                    COMMISSION
                  </th>

                  <th style={{ ...th, width: "16%" }}>
                    TECHNICIAN
                  </th>

                  <th style={{ ...th, width: "16%" }}>
                    SERVICE
                  </th>

                  <th style={{ ...th, width: "12%" }}>
                    SERVICE VALUE
                  </th>

                  <th style={{ ...th, width: "11%" }}>
                    RATE
                  </th>

                  <th style={{ ...th, width: "12%" }}>
                    A-ONE SHARE
                  </th>

                  <th style={{ ...th, width: "12%" }}>
                    TECH PAYOUT
                  </th>

                  <th style={{ ...th, width: "8%" }}>
                    STATUS
                  </th>

                  <th style={{ ...th, width: "5%" }} />
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map(
                  (record) => (
                    <tr key={record.id}>
                      <td style={td}>
                        <div style={commissionCell}>
                          <div style={commissionIcon}>
                            <Receipt size={16} />
                          </div>

                          <div>
                            <strong
                              style={commissionId}
                            >
                              {record.id}
                            </strong>

                            <span
                              style={bookingText}
                            >
                              {record.bookingId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={td}>
                        <div style={personCell}>
                          <div style={technicianAvatar}>
                            <UserCog size={14} />
                          </div>

                          <div>
                            <strong style={personName}>
                              {record.technician}
                            </strong>

                            <span style={personId}>
                              {record.technicianId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={td}>
                        <span style={serviceText}>
                          {record.service}
                        </span>
                      </td>

                      <td style={td}>
                        <strong style={serviceAmount}>
                          ₹{record.serviceAmount}
                        </strong>
                      </td>

                      <td style={td}>
                        <span style={rateBadge}>
                          {record.commissionRate}%
                        </span>
                      </td>

                      <td style={td}>
                        <strong style={commissionAmount}>
                          ₹{record.commission}
                        </strong>
                      </td>

                      <td style={td}>
                        <strong style={payoutAmount}>
                          ₹{record.technicianPayout}
                        </strong>
                      </td>

                      <td style={td}>
                        <CommissionStatus
                          status={record.status}
                        />
                      </td>

                      <td style={td}>
                        <button
                          onClick={() =>
                            setSelected(record)
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
          </div>

          {filteredRecords.length === 0 && (
            <div style={emptyState}>
              <Wallet size={42} />

              <h3>
                No commission records found
              </h3>

              <p>
                Try changing your search or filter.
              </p>
            </div>
          )}
        </section>

        <section style={bottomGrid}>
          <div style={bottomCard}>
            <div style={bottomIcon}>
              <Users size={20} />
            </div>

            <div>
              <span>Technician Transactions</span>

              <strong>
                {records.length}
              </strong>
            </div>
          </div>

          <div style={bottomCard}>
            <div
              style={{
                ...bottomIcon,
                background: "#12382b",
                color: "#39c98a",
              }}
            >
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Paid Transactions</span>

              <strong>
                {paidCount}
              </strong>
            </div>
          </div>

          <div style={bottomCard}>
            <div
              style={{
                ...bottomIcon,
                background: "#3a2e17",
                color: "#e5ad42",
              }}
            >
              <Clock3 size={20} />
            </div>

            <div>
              <span>Pending Transactions</span>

              <strong>
                {pendingCount}
              </strong>
            </div>
          </div>
        </section>
      </main>

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
                  COMMISSION DETAILS
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
              <CommissionStatus
                status={selected.status}
              />

              <span style={rateBadge}>
                {selected.commissionRate}% Commission
              </span>
            </div>

            <div style={detailsGrid}>
              <Detail
                label="Technician"
                value={selected.technician}
                icon={<UserCog size={16} />}
              />

              <Detail
                label="Customer"
                value={selected.customer}
                icon={<Users size={16} />}
              />

              <Detail
                label="Service"
                value={selected.service}
                icon={<Receipt size={16} />}
              />

              <Detail
                label="Booking"
                value={selected.bookingId}
                icon={<Receipt size={16} />}
              />

              <Detail
                label="Service Value"
                value={`₹${selected.serviceAmount}`}
                icon={<IndianRupee size={16} />}
              />

              <Detail
                label="Commission Rate"
                value={`${selected.commissionRate}%`}
                icon={<Percent size={16} />}
              />

              <Detail
                label="A-ONE Commission"
                value={`₹${selected.commission}`}
                icon={<TrendingUp size={16} />}
              />

              <Detail
                label="Technician Payout"
                value={`₹${selected.technicianPayout}`}
                icon={<Wallet size={16} />}
              />

              <Detail
                label="Transaction Date"
                value={selected.date}
                icon={<CalendarDays size={16} />}
              />
            </div>

            <div style={calculationBox}>
              <div>
                <span>Service Amount</span>
                <strong>
                  ₹{selected.serviceAmount}
                </strong>
              </div>

              <div>
                <span>
                  A-ONE Commission (
                  {selected.commissionRate}%)
                </span>

                <strong style={{ color: "#39c98a" }}>
                  - ₹{selected.commission}
                </strong>
              </div>

              <div style={calculationTotal}>
                <span>
                  Technician Receives
                </span>

                <strong>
                  ₹{selected.technicianPayout}
                </strong>
              </div>
            </div>

            {selected.status === "PENDING" && (
              <button
                onClick={() =>
                  markAsPaid(selected.id)
                }
                style={markPaidButton}
              >
                <CheckCircle2 size={17} />
                Mark Commission as Paid
              </button>
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

    purple: {
      background: "#29213b",
      color: "#b79aff",
      border: "#493a68",
    },

    warning: {
      background: "#3a2e17",
      color: "#e5ad42",
      border: "#604c25",
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
   STATUS
===================================================== */

function CommissionStatus({ status }) {
  const paid = status === "PAID";

  return (
    <span
      style={{
        ...statusBadge,
        background: paid
          ? "#12382b"
          : "#3a2e17",
        color: paid
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

const commissionRateCard = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 18px",
  background: "#101f2a",
  border: "1px solid #203542",
  borderRadius: "12px",
  color: "#35c9f2",
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
  fontSize: "19px",
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
};

const filterButton = {
  border: "1px solid #29414e",
  background: "#101f2a",
  color: "#8fa8b5",
  borderRadius: "8px",
  padding: "9px 12px",
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
};

const table = {
  width: "100%",
  minWidth: "1150px",
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

const commissionCell = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
};

const commissionIcon = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const commissionId = {
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
};

const personName = {
  display: "block",
  color: "#e8f4f8",
  fontSize: "10px",
  whiteSpace: "nowrap",
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

const serviceAmount = {
  color: "#dcebf0",
};

const rateBadge = {
  display: "inline-block",
  padding: "6px 9px",
  borderRadius: "20px",
  background: "#173b4b",
  color: "#8fd9eb",
  fontSize: "8px",
  fontWeight: "900",
};

const commissionAmount = {
  color: "#39c98a",
};

const payoutAmount = {
  color: "#b79aff",
};

const statusBadge = {
  display: "inline-block",
  padding: "6px 9px",
  borderRadius: "20px",
  fontSize: "8px",
  fontWeight: "900",
};

const moreButton = {
  border: "none",
  background: "transparent",
  color: "#78909c",
  cursor: "pointer",
};

const emptyState = {
  padding: "70px 20px",
  textAlign: "center",
  color: "#8fa8b5",
};

const bottomGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, minmax(0, 1fr))",
  gap: "12px",
  marginTop: "15px",
};

const bottomCard = {
  background: "#101f2a",
  border: "1px solid #203542",
  borderRadius: "14px",
  padding: "15px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const bottomIcon = {
  width: "40px",
  height: "40px",
  borderRadius: "11px",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
  maxWidth: "650px",
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
  gap: "8px",
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

const calculationBox = {
  marginTop: "15px",
  padding: "15px",
  background: "#0d1b25",
  border: "1px solid #203542",
  borderRadius: "12px",
};

const calculationRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const calculationTotal = {
  marginTop: "12px",
  paddingTop: "12px",
  borderTop: "1px solid #29414e",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#35c9f2",
};

const markPaidButton = {
  width: "100%",
  marginTop: "15px",
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

export default AdminCommission;