import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Snowflake,
  Search,
  UserCog,
  MapPin,
  Phone,
  CircleCheck,
  CircleX,
  AlertTriangle,
  MoreVertical,
  ShieldAlert,
  X,
  Clock3,
  Star,
  BriefcaseBusiness,
  IndianRupee,
} from "lucide-react";

function AdminTechnicians() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);

  const [technicians, setTechnicians] = useState([
    {
      id: "TECH-001",
      name: "Ravi Kumar",
      phone: "9876543210",
      location: "Anna Nagar, Chennai",
      service: "AC Technician",
      status: "ONLINE",
      activeWork: 1,
      completed: 124,
      rating: 4.8,
      due: 120,
      suspended: false,
      suspensionUntil: null,
    },
    {
      id: "TECH-002",
      name: "Arun Kumar",
      phone: "9876543211",
      location: "T. Nagar, Chennai",
      service: "Refrigerator Technician",
      status: "OFFLINE",
      activeWork: 0,
      completed: 98,
      rating: 4.6,
      due: 350,
      suspended: false,
      suspensionUntil: null,
    },
    {
      id: "TECH-003",
      name: "Vijay",
      phone: "9876543212",
      location: "Velachery, Chennai",
      service: "Washing Machine Technician",
      status: "OFFLINE",
      activeWork: 2,
      completed: 176,
      rating: 4.9,
      due: 620,
      suspended: true,
      suspensionUntil: "2 hrs remaining",
    },
    {
      id: "TECH-004",
      name: "Suresh",
      phone: "9876543213",
      location: "Porur, Chennai",
      service: "AC Technician",
      status: "OFFLINE",
      activeWork: 0,
      completed: 73,
      rating: 4.4,
      due: 0,
      suspended: false,
      suspensionUntil: null,
    },
    {
      id: "TECH-005",
      name: "Mohammed Faisal",
      phone: "9876543214",
      location: "Guindy, Chennai",
      service: "Multi Appliance",
      status: "ONLINE",
      activeWork: 1,
      completed: 201,
      rating: 4.7,
      due: 480,
      suspended: false,
      suspensionUntil: null,
    },
  ]);

  const filteredTechnicians = useMemo(() => {
    return technicians.filter((technician) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        technician.name.toLowerCase().includes(query) ||
        technician.id.toLowerCase().includes(query) ||
        technician.phone.includes(query);

      const matchesFilter =
        filter === "ALL" ||
        (filter === "ONLINE" &&
          technician.status === "ONLINE" &&
          !technician.suspended) ||
        (filter === "OFFLINE" &&
          technician.status === "OFFLINE" &&
          !technician.suspended) ||
        (filter === "SUSPENDED" &&
          technician.suspended) ||
        (filter === "BLOCKED" &&
          technician.due > 500);

      return matchesSearch && matchesFilter;
    });
  }, [technicians, search, filter]);

  const onlineCount = technicians.filter(
    (t) => t.status === "ONLINE" && !t.suspended && t.due <= 500
  ).length;

  const offlineCount = technicians.filter(
    (t) => t.status === "OFFLINE" && !t.suspended
  ).length;

  const suspendedCount = technicians.filter(
    (t) => t.suspended
  ).length;

  const blockedCount = technicians.filter(
    (t) => t.due > 500
  ).length;

  const activeWorkCount = technicians.reduce(
    (total, technician) => total + technician.activeWork,
    0
  );

  const suspendTechnician = (id) => {
    setTechnicians((current) =>
      current.map((technician) =>
        technician.id === id
          ? {
              ...technician,
              suspended: true,
              status: "OFFLINE",
              suspensionUntil: "2 hrs remaining",
            }
          : technician
      )
    );

    setSelected(null);
  };

  const activateTechnician = (id) => {
    setTechnicians((current) =>
      current.map((technician) =>
        technician.id === id
          ? {
              ...technician,
              suspended: false,
              suspensionUntil: null,
            }
          : technician
      )
    );

    setSelected(null);
  };

  const canGoOnline = (technician) => {
    return (
      !technician.suspended &&
      technician.due <= 500 &&
      technician.activeWork < 2
    );
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
        {/* PAGE TITLE */}

        <div style={pageHeading}>
          <div>
            <span style={eyebrow}>
              TECHNICIAN MANAGEMENT
            </span>

            <h1 style={pageTitle}>
              Technicians
            </h1>

            <p style={pageDescription}>
              Monitor technician availability, active work,
              commission status and account restrictions.
            </p>
          </div>

          <div style={totalCard}>
            <UserCog size={19} />

            <div>
              <span>Total Technicians</span>
              <strong>{technicians.length}</strong>
            </div>
          </div>
        </div>

        {/* SUMMARY */}

        <section style={summaryGrid}>
          <SummaryCard
            label="AVAILABLE ONLINE"
            value={onlineCount}
            icon={<CircleCheck size={19} />}
            type="success"
          />

          <SummaryCard
            label="OFFLINE"
            value={offlineCount}
            icon={<CircleX size={19} />}
            type="neutral"
          />

          <SummaryCard
            label="ACTIVE WORK"
            value={`${activeWorkCount}/10`}
            icon={<BriefcaseBusiness size={19} />}
            type="blue"
          />

          <SummaryCard
            label="SUSPENDED"
            value={suspendedCount}
            icon={<ShieldAlert size={19} />}
            type="danger"
          />

          <SummaryCard
            label="COMMISSION BLOCKED"
            value={blockedCount}
            icon={<IndianRupee size={19} />}
            type="warning"
          />
        </section>

        {/* RULE NOTICE */}

        <div style={ruleNotice}>
          <ShieldAlert size={19} />

          <div>
            <strong>Technician restrictions</strong>

            <span>
              Commission due above ₹500 blocks new work
              and online status. Maximum simultaneous active
              work is 2.
            </span>
          </div>
        </div>

        {/* SEARCH */}

        <section style={toolbar}>
          <div style={searchBox}>
            <Search size={18} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search technician, ID or phone..."
              style={searchInput}
            />
          </div>

          <div style={filters}>
            {[
              "ALL",
              "ONLINE",
              "OFFLINE",
              "BLOCKED",
              "SUSPENDED",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                style={{
                  ...filterButton,
                  ...(filter === item ? activeFilter : {}),
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* TABLE */}

        <section style={tableCard}>
          <div style={tableHeader}>
            <div>
              <span style={eyebrow}>
                TECHNICIAN DIRECTORY
              </span>

              <h2 style={tableTitle}>
                All Technicians
              </h2>
            </div>

            <span style={resultCount}>
              {filteredTechnicians.length} results
            </span>
          </div>

          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={{ ...th, width: "20%" }}>
                    TECHNICIAN
                  </th>

                  <th style={{ ...th, width: "17%" }}>
                    SERVICE
                  </th>

                  <th style={{ ...th, width: "18%" }}>
                    LOCATION
                  </th>

                  <th style={{ ...th, width: "12%" }}>
                    STATUS
                  </th>

                  <th style={{ ...th, width: "11%" }}>
                    ACTIVE WORK
                  </th>

                  <th style={{ ...th, width: "8%" }}>
                    RATING
                  </th>

                  <th style={{ ...th, width: "9%" }}>
                    DUE
                  </th>

                  <th style={{ ...th, width: "5%" }} />
                </tr>
              </thead>

              <tbody>
                {filteredTechnicians.map((technician) => (
                  <tr key={technician.id}>
                    <td style={td}>
                      <div style={technicianCell}>
                        <div style={avatar}>
                          {technician.name.charAt(0).toUpperCase()}
                        </div>

                        <div style={technicianInfo}>
                          <strong style={technicianName}>
                            {technician.name}
                          </strong>

                          <span style={technicianId}>
                            {technician.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td style={td}>
                      <span style={serviceText}>
                        {technician.service}
                      </span>
                    </td>

                    <td style={td}>
                      <span style={locationText}>
                        <MapPin size={14} />
                        {technician.location}
                      </span>
                    </td>

                    <td style={td}>
                      {technician.suspended ? (
                        <StatusBadge
                          type="danger"
                          text="SUSPENDED"
                        />
                      ) : technician.due > 500 ? (
                        <StatusBadge
                          type="warning"
                          text="BLOCKED"
                        />
                      ) : (
                        <StatusBadge
                          type={
                            technician.status === "ONLINE"
                              ? "success"
                              : "neutral"
                          }
                          text={technician.status}
                        />
                      )}
                    </td>

                    <td style={td}>
                      <div style={workCount}>
                        <strong>
                          {technician.activeWork}/2
                        </strong>

                        <div style={workBar}>
                          <div
                            style={{
                              ...workBarFill,
                              width: `${
                                (technician.activeWork / 2) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td style={td}>
                      <span style={rating}>
                        <Star size={13} fill="currentColor" />
                        {technician.rating}
                      </span>
                    </td>

                    <td style={td}>
                      <strong
                        style={{
                          color:
                            technician.due > 500
                              ? "#ff6b6b"
                              : "#dcebf0",
                        }}
                      >
                        ₹{technician.due}
                      </strong>
                    </td>

                    <td style={td}>
                      <button
                        onClick={() => setSelected(technician)}
                        style={moreButton}
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTechnicians.length === 0 && (
            <div style={emptyState}>
              <UserCog size={42} />

              <h3>No technicians found</h3>

              <p>
                Try changing your search or filter.
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
              onClick={() => setSelected(null)}
              style={modalClose}
            >
              <X size={18} />
            </button>

            <div style={modalTop}>
              <div style={modalAvatar}>
                {selected.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <span style={eyebrow}>
                  TECHNICIAN
                </span>

                <h2 style={modalTitle}>
                  {selected.name}
                </h2>

                <p style={modalId}>
                  {selected.id}
                </p>
              </div>
            </div>

            {/* STATUS */}

            <div style={modalStatusRow}>
              {selected.suspended ? (
                <StatusBadge
                  type="danger"
                  text="SUSPENDED"
                />
              ) : selected.due > 500 ? (
                <StatusBadge
                  type="warning"
                  text="COMMISSION BLOCKED"
                />
              ) : (
                <StatusBadge
                  type={
                    selected.status === "ONLINE"
                      ? "success"
                      : "neutral"
                  }
                  text={selected.status}
                />
              )}

              {selected.activeWork >= 2 && (
                <StatusBadge
                  type="warning"
                  text="WORK LIMIT REACHED"
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
                label="Completed"
                value={`${selected.completed} services`}
                icon={<CircleCheck size={16} />}
              />

              <Detail
                label="Active Work"
                value={`${selected.activeWork} / 2`}
                icon={<BriefcaseBusiness size={16} />}
              />

              <Detail
                label="Rating"
                value={`★ ${selected.rating}`}
                icon={<Star size={16} />}
              />

              <Detail
                label="Commission Due"
                value={`₹${selected.due}`}
                icon={<IndianRupee size={16} />}
              />
            </div>

            {/* RESTRICTIONS */}

            {selected.due > 500 && (
              <div style={warningBox}>
                <AlertTriangle size={18} />

                <div>
                  <strong>Commission restriction</strong>

                  <span>
                    Due amount is above ₹500. The technician
                    cannot go online or accept upcoming work
                    until the due amount is cleared.
                  </span>
                </div>
              </div>
            )}

            {selected.activeWork >= 2 && (
              <div style={warningBox}>
                <BriefcaseBusiness size={18} />

                <div>
                  <strong>Maximum active work reached</strong>

                  <span>
                    This technician already has 2 active
                    works. Another overlapping work cannot
                    be accepted.
                  </span>
                </div>
              </div>
            )}

            {selected.suspended && (
              <div style={dangerBox}>
                <Clock3 size={18} />

                <div>
                  <strong>Temporary suspension</strong>

                  <span>
                    {selected.suspensionUntil ||
                      "Suspension active"}
                  </span>
                </div>
              </div>
            )}

            {!selected.suspended &&
              selected.due <= 500 &&
              selected.activeWork < 2 && (
                <div style={successBox}>
                  <CircleCheck size={18} />

                  <span>
                    Technician is currently eligible
                    for online status and new work.
                  </span>
                </div>
              )}

            {/* ACTIONS */}

            <div style={modalActions}>
              {selected.suspended ? (
                <button
                  onClick={() =>
                    activateTechnician(selected.id)
                  }
                  style={activateButton}
                >
                  <CircleCheck size={17} />
                  Remove Suspension
                </button>
              ) : (
                <button
                  onClick={() =>
                    suspendTechnician(selected.id)
                  }
                  style={suspendButton}
                >
                  <ShieldAlert size={17} />
                  Suspend for 2 Hours
                </button>
              )}

              <button
                onClick={() => setSelected(null)}
                style={cancelButton}
              >
                Close
              </button>
            </div>

            <div style={eligibilityBox}>
              <span>ONLINE ELIGIBILITY</span>

              <strong
                style={{
                  color: canGoOnline(selected)
                    ? "#39c98a"
                    : "#ff6b6b",
                }}
              >
                {canGoOnline(selected)
                  ? "ELIGIBLE"
                  : "BLOCKED"}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   COMPONENTS
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
    neutral: {
      background: "#1b2a34",
      color: "#8fa8b5",
      border: "#29414e",
    },
    blue: {
      background: "#123f52",
      color: "#35c9f2",
      border: "#20556a",
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
  };

  const c = colors[type];

  return (
    <div
      style={{
        ...summaryCard,
        borderColor: c.border,
      }}
    >
      <div
        style={{
          ...summaryIcon,
          background: c.background,
          color: c.color,
        }}
      >
        {icon}
      </div>

      <div style={summaryContent}>
        <span style={summaryLabel}>
          {label}
        </span>

        <strong
          style={{
            ...summaryValue,
            color: c.color,
          }}
        >
          {value}
        </strong>
      </div>
    </div>
  );
}

function StatusBadge({ type, text }) {
  const styles = {
    success: {
      background: "#12382b",
      color: "#39c98a",
    },
    neutral: {
      background: "#1b2a34",
      color: "#8fa8b5",
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

const totalCardText = {
  color: "#8fa8b5",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(5, minmax(0, 1fr))",
  gap: "14px",
  marginBottom: "16px",
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

const summaryContent = {
  minWidth: 0,
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

const ruleNotice = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  padding: "14px 16px",
  marginBottom: "18px",
  borderRadius: "12px",
  background: "#122936",
  border: "1px solid #20556a",
  color: "#35c9f2",
};

const ruleNoticeText = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
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

const technicianCell = {
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

const technicianInfo = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  minWidth: 0,
};

const technicianName = {
  display: "block",
  fontSize: "13px",
  fontWeight: "800",
  color: "#e8f4f8",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const technicianId = {
  display: "block",
  fontSize: "10px",
  color: "#78909c",
  whiteSpace: "nowrap",
};

const serviceText = {
  color: "#b8cbd3",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
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

const statusBadge = {
  display: "inline-block",
  padding: "6px 9px",
  borderRadius: "20px",
  fontSize: "8px",
  fontWeight: "900",
  letterSpacing: ".3px",
  whiteSpace: "nowrap",
};

const workCount = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  width: "55px",
};

const workBar = {
  width: "55px",
  height: "4px",
  borderRadius: "10px",
  background: "#243943",
  overflow: "hidden",
};

const workBarFill = {
  height: "100%",
  borderRadius: "10px",
  background: "#35c9f2",
};

const rating = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  color: "#e5ad42",
  fontWeight: "800",
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
  maxWidth: "540px",
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
  marginTop: "14px",
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

const dangerBox = {
  marginTop: "14px",
  padding: "13px",
  borderRadius: "11px",
  background: "#3b2023",
  border: "1px solid #6a3034",
  color: "#ff6b6b",
  fontSize: "12px",
  display: "flex",
  gap: "9px",
  lineHeight: "1.5",
};

const successBox = {
  marginTop: "14px",
  padding: "13px",
  borderRadius: "11px",
  background: "#12382b",
  border: "1px solid #245b45",
  color: "#39c98a",
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

const suspendButton = {
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

const cancelButton = {
  border: "1px solid #29414e",
  borderRadius: "10px",
  background: "#142631",
  color: "#8fa8b5",
  padding: "12px 18px",
  fontWeight: "700",
  cursor: "pointer",
};

const eligibilityBox = {
  marginTop: "15px",
  paddingTop: "14px",
  borderTop: "1px solid #203542",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "10px",
  letterSpacing: "1px",
};

export default AdminTechnicians;