import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Snowflake,
  Search,
  AlertTriangle,
  UserCog,
  User,
  Wrench,
  CalendarDays,
  Clock3,
  ShieldAlert,
  CheckCircle2,
  X,
  MoreVertical,
  Ban,
  FileWarning,
  Timer,
} from "lucide-react";

function AdminIncidents() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);

  const [incidents, setIncidents] = useState([
    {
      id: "INC-2026-001",
      technicianId: "TECH-003",
      technician: "Vijay",
      customerId: "CUS-005",
      customer: "Faisal Ahmed",
      bookingId: "AOF-2026-00127",
      service: "Washing Machine Repair",
      reason:
        "Customer reported that the technician did not complete the service after accepting the work.",
      type: "SERVICE_INCIDENT",
      duration: 2,
      startedAt: "26 Aug 2026, 09:30 AM",
      expiresAt: "26 Aug 2026, 11:30 AM",
      status: "ACTIVE",
      adminNote:
        "Technician temporarily suspended for investigation.",
    },
    {
      id: "INC-2026-002",
      technicianId: "TECH-004",
      technician: "Suresh",
      customerId: "CUS-006",
      customer: "Rahul Kumar",
      bookingId: "AOF-2026-00128",
      service: "Water Heater Service",
      reason:
        "Customer reported an incident during the scheduled service.",
      type: "CUSTOMER_INCIDENT",
      duration: 2,
      startedAt: "26 Aug 2026, 08:15 AM",
      expiresAt: "26 Aug 2026, 10:15 AM",
      status: "ACTIVE",
      adminNote:
        "Incident is under admin review.",
    },
    {
      id: "INC-2026-003",
      technicianId: "TECH-005",
      technician: "Mohammed Faisal",
      customerId: "CUS-003",
      customer: "Mohammed Sameer",
      bookingId: "AOF-2026-00126",
      service: "AC Gas Filling",
      reason:
        "Technician accepted a conflicting booking time.",
      type: "SCHEDULE_CONFLICT",
      duration: 2,
      startedAt: "25 Aug 2026, 02:00 PM",
      expiresAt: "25 Aug 2026, 04:00 PM",
      status: "RESOLVED",
      adminNote:
        "Technician received a warning and completed the required review.",
    },
    {
      id: "INC-2026-004",
      technicianId: "TECH-002",
      technician: "Arun Kumar",
      customerId: "CUS-002",
      customer: "Arun Kumar",
      bookingId: "AOF-2026-00125",
      service: "Refrigerator Service",
      reason:
        "Customer reported delayed arrival beyond the agreed service window.",
      type: "LATE_ARRIVAL",
      duration: 2,
      startedAt: "24 Aug 2026, 11:00 AM",
      expiresAt: "24 Aug 2026, 01:00 PM",
      status: "RESOLVED",
      adminNote:
        "Resolved after technician provided an explanation.",
    },
    {
      id: "INC-2026-005",
      technicianId: "TECH-001",
      technician: "Ravi Kumar",
      customerId: "CUS-001",
      customer: "Adhil Shaik",
      bookingId: "AOF-2026-00124",
      service: "AC Repair & Service",
      reason:
        "Customer reported incomplete service after the technician marked the work as finished.",
      type: "INCOMPLETE_SERVICE",
      duration: 2,
      startedAt: "23 Aug 2026, 03:30 PM",
      expiresAt: "23 Aug 2026, 05:30 PM",
      status: "RESOLVED",
      adminNote:
        "Technician completed the required follow-up service.",
    },
  ]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        incident.id.toLowerCase().includes(query) ||
        incident.technician
          .toLowerCase()
          .includes(query) ||
        incident.customer
          .toLowerCase()
          .includes(query) ||
        incident.bookingId
          .toLowerCase()
          .includes(query) ||
        incident.service
          .toLowerCase()
          .includes(query) ||
        incident.reason
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "ALL" ||
        incident.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [incidents, search, filter]);

  const activeCount = incidents.filter(
    (incident) =>
      incident.status === "ACTIVE"
  ).length;

  const resolvedCount = incidents.filter(
    (incident) =>
      incident.status === "RESOLVED"
  ).length;

  const totalIncidents = incidents.length;

  const resolveIncident = (id) => {
    setIncidents((current) =>
      current.map((incident) =>
        incident.id === id
          ? {
              ...incident,
              status: "RESOLVED",
              adminNote:
                "Incident manually resolved by administrator.",
            }
          : incident
      )
    );

    setSelected(null);
  };

  const suspendTechnician = (id) => {
    setIncidents((current) =>
      current.map((incident) =>
        incident.id === id
          ? {
              ...incident,
              status: "ACTIVE",
              duration: 2,
              adminNote:
                "Technician suspended for 2 hours by administrator.",
            }
          : incident
      )
    );
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
              SAFETY & INCIDENT CONTROL
            </span>

            <h1 style={pageTitle}>
              Incidents
            </h1>

            <p style={pageDescription}>
              Monitor technician incidents,
              temporary suspensions and admin
              resolutions.
            </p>
          </div>

          <div style={incidentHero}>
            <ShieldAlert size={22} />

            <div>
              <strong>
                {activeCount}
              </strong>

              <span>
                Active Suspensions
              </span>
            </div>
          </div>
        </div>

        {/* SUMMARY */}

        <section style={summaryGrid}>
          <SummaryCard
            label="TOTAL INCIDENTS"
            value={totalIncidents}
            icon={
              <FileWarning size={19} />
            }
            type="blue"
          />

          <SummaryCard
            label="ACTIVE"
            value={activeCount}
            icon={
              <ShieldAlert size={19} />
            }
            type="danger"
          />

          <SummaryCard
            label="RESOLVED"
            value={resolvedCount}
            icon={
              <CheckCircle2 size={19} />
            }
            type="success"
          />

          <SummaryCard
            label="SUSPENSION"
            value="2 HRS"
            icon={
              <Timer size={19} />
            }
            type="warning"
          />

          <SummaryCard
            label="TECHNICIANS AFFECTED"
            value={
              new Set(
                incidents.map(
                  (incident) =>
                    incident.technicianId
                )
              ).size
            }
            icon={
              <UserCog size={19} />
            }
            type="purple"
          />
        </section>

        {/* POLICY CARD */}

        <section style={policyCard}>
          <div style={policyIcon}>
            <ShieldAlert size={21} />
          </div>

          <div style={policyContent}>
            <span style={policyEyebrow}>
              TECHNICIAN SAFETY POLICY
            </span>

            <h3>
              Incident suspension rule
            </h3>

            <p>
              When a customer reports a valid
              service incident, the technician
              can be temporarily suspended for
              <strong> 2 hours</strong>. During
              suspension the technician must not
              accept new work, go online or
              continue an affected service until
              the restriction is cleared.
            </p>
          </div>
        </section>

        {/* SEARCH / FILTER */}

        <section style={toolbar}>
          <div style={searchBox}>
            <Search size={18} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search incident, technician, customer or booking..."
              style={searchInput}
            />
          </div>

          <div style={filters}>
            {[
              "ALL",
              "ACTIVE",
              "RESOLVED",
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
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* INCIDENT TABLE */}

        <section style={tableCard}>
          <div style={tableHeader}>
            <div>
              <span style={eyebrow}>
                INCIDENT DIRECTORY
              </span>

              <h2 style={tableTitle}>
                Technician Incidents
              </h2>
            </div>

            <span style={resultCount}>
              {filteredIncidents.length} results
            </span>
          </div>

          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th
                    style={{
                      ...th,
                      width: "14%",
                    }}
                  >
                    INCIDENT
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
                      width: "14%",
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
                    SERVICE
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "17%",
                    }}
                  >
                    REASON
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "9%",
                    }}
                  >
                    DURATION
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
                      width: "7%",
                    }}
                  />
                </tr>
              </thead>

              <tbody>
                {filteredIncidents.map(
                  (incident) => (
                    <tr key={incident.id}>
                      {/* INCIDENT */}

                      <td style={td}>
                        <div
                          style={
                            incidentCell
                          }
                        >
                          <div
                            style={{
                              ...incidentIcon,
                              background:
                                incident.status ===
                                "ACTIVE"
                                  ? "#3b2023"
                                  : "#123f52",
                              color:
                                incident.status ===
                                "ACTIVE"
                                  ? "#ff6b6b"
                                  : "#35c9f2",
                            }}
                          >
                            <AlertTriangle
                              size={16}
                            />
                          </div>

                          <div>
                            <strong
                              style={
                                incidentId
                              }
                            >
                              {incident.id}
                            </strong>

                            <span
                              style={
                                bookingText
                              }
                            >
                              {
                                incident.bookingId
                              }
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* TECHNICIAN */}

                      <td style={td}>
                        <div
                          style={
                            personCell
                          }
                        >
                          <div
                            style={
                              technicianAvatar
                            }
                          >
                            <UserCog
                              size={14}
                            />
                          </div>

                          <div
                            style={
                              personInfo
                            }
                          >
                            <strong
                              style={
                                personName
                              }
                            >
                              {
                                incident.technician
                              }
                            </strong>

                            <span
                              style={
                                personId
                              }
                            >
                              {
                                incident.technicianId
                              }
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CUSTOMER */}

                      <td style={td}>
                        <div
                          style={
                            personCell
                          }
                        >
                          <div
                            style={
                              customerAvatar
                            }
                          >
                            {
                              incident.customer
                                .charAt(0)
                                .toUpperCase()
                            }
                          </div>

                          <div
                            style={
                              personInfo
                            }
                          >
                            <strong
                              style={
                                personName
                              }
                            >
                              {
                                incident.customer
                              }
                            </strong>

                            <span
                              style={
                                personId
                              }
                            >
                              {
                                incident.customerId
                              }
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SERVICE */}

                      <td style={td}>
                        <div
                          style={
                            serviceCell
                          }
                        >
                          <Wrench
                            size={14}
                          />

                          <span>
                            {
                              incident.service
                            }
                          </span>
                        </div>
                      </td>

                      {/* REASON */}

                      <td style={td}>
                        <span
                          style={
                            reasonText
                          }
                        >
                          {
                            incident.reason
                          }
                        </span>
                      </td>

                      {/* DURATION */}

                      <td style={td}>
                        <div
                          style={
                            durationCell
                          }
                        >
                          <Clock3
                            size={14}
                          />

                          <strong>
                            {
                              incident.duration
                            }{" "}
                            hrs
                          </strong>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td style={td}>
                        <IncidentStatus
                          status={
                            incident.status
                          }
                        />
                      </td>

                      {/* ACTION */}

                      <td style={td}>
                        <button
                          onClick={() =>
                            setSelected(
                              incident
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

          {filteredIncidents.length ===
            0 && (
            <div style={emptyState}>
              <AlertTriangle
                size={42}
              />

              <h3>
                No incidents found
              </h3>

              <p>
                Try changing your search or
                filter.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* INCIDENT MODAL */}

      {selected && (
        <div
          style={
            modalOverlay
          }
        >
          <div style={modal}>
            <button
              onClick={() =>
                setSelected(null)
              }
              style={
                modalClose
              }
            >
              <X size={18} />
            </button>

            <div
              style={
                modalTop
              }
            >
              <div
                style={{
                  ...modalIcon,
                  background:
                    selected.status ===
                    "ACTIVE"
                      ? "#3b2023"
                      : "#123f52",
                  color:
                    selected.status ===
                    "ACTIVE"
                      ? "#ff6b6b"
                      : "#35c9f2",
                }}
              >
                <AlertTriangle
                  size={23}
                />
              </div>

              <div>
                <span
                  style={
                    eyebrow
                  }
                >
                  INCIDENT DETAILS
                </span>

                <h2
                  style={
                    modalTitle
                  }
                >
                  {selected.id}
                </h2>

                <p
                  style={
                    modalSubtitle
                  }
                >
                  {
                    selected.bookingId
                  }
                </p>
              </div>
            </div>

            <div
              style={
                modalStatus
              }
            >
              <IncidentStatus
                status={
                  selected.status
                }
              />

              <span
                style={
                  typeBadge
                }
              >
                {
                  selected.type
                }
              </span>
            </div>

            {/* DETAILS */}

            <div
              style={
                detailsGrid
              }
            >
              <Detail
                label="Technician"
                value={
                  selected.technician
                }
                icon={
                  <UserCog
                    size={16}
                  />
                }
              />

              <Detail
                label="Customer"
                value={
                  selected.customer
                }
                icon={
                  <User
                    size={16}
                  />
                }
              />

              <Detail
                label="Service"
                value={
                  selected.service
                }
                icon={
                  <Wrench
                    size={16}
                  />
                }
              />

              <Detail
                label="Booking"
                value={
                  selected.bookingId
                }
                icon={
                  <FileWarning
                    size={16}
                  />
                }
              />

              <Detail
                label="Suspension"
                value={`${selected.duration} hours`}
                icon={
                  <Timer
                    size={16}
                  />
                }
              />

              <Detail
                label="Started"
                value={
                  selected.startedAt
                }
                icon={
                  <CalendarDays
                    size={16}
                  />
                }
              />

              <Detail
                label="Expires"
                value={
                  selected.expiresAt
                }
                icon={
                  <Clock3
                    size={16}
                  />
                }
              />

              <Detail
                label="Technician ID"
                value={
                  selected.technicianId
                }
                icon={
                  <UserCog
                    size={16}
                  />
                }
              />
            </div>

            {/* REASON */}

            <div
              style={
                reasonBox
              }
            >
              <span>
                INCIDENT REASON
              </span>

              <p>
                {selected.reason}
              </p>
            </div>

            {/* ADMIN NOTE */}

            <div
              style={
                noteBox
              }
            >
              <span>
                ADMIN NOTE
              </span>

              <p>
                {
                  selected.adminNote
                }
              </p>
            </div>

            {/* ACTIVE WARNING */}

            {selected.status ===
              "ACTIVE" && (
              <div
                style={
                  warningBox
                }
              >
                <Ban
                  size={18}
                />

                <div>
                  <strong>
                    Technician is currently suspended
                  </strong>

                  <span>
                    The technician should
                    remain unavailable for
                    new work during the
                    suspension period.
                  </span>
                </div>
              </div>
            )}

            {/* ACTIONS */}

            <div
              style={
                actionTitle
              }
            >
              INCIDENT ACTIONS
            </div>

            <div
              style={
                actionGrid
              }
            >
              {selected.status ===
                "ACTIVE" && (
                <button
                  onClick={() =>
                    resolveIncident(
                      selected.id
                    )
                  }
                  style={
                    resolveButton
                  }
                >
                  <CheckCircle2
                    size={16}
                  />
                  Resolve Incident
                </button>
              )}

              <button
                onClick={() =>
                  suspendTechnician(
                    selected.id
                  )
                }
                style={
                  suspendButton
                }
              >
                <Ban
                  size={16}
                />
                Suspend 2 Hours
              </button>
            </div>

            <button
              onClick={() =>
                setSelected(null)
              }
              style={
                closeButton
              }
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
        <span
          style={
            summaryLabel
          }
        >
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

function IncidentStatus({
  status,
}) {
  const active =
    status === "ACTIVE";

  return (
    <span
      style={{
        ...statusBadge,
        background: active
          ? "#3b2023"
          : "#12382b",
        color: active
          ? "#ff6b6b"
          : "#39c98a",
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
    <div
      style={
        detailBox
      }
    >
      <div
        style={
          detailIcon
        }
      >
        {icon}
      </div>

      <div
        style={
          detailContent
        }
      >
        <span>
          {label}
        </span>

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
  borderBottom:
    "1px solid #203542",
  padding: "0 6%",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "space-between",
};

const backButton = {
  border: "none",
  background:
    "transparent",
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
  justifyContent:
    "center",
};

const mainStyle = {
  width: "92%",
  maxWidth: "1500px",
  margin: "0 auto",
  padding:
    "40px 0 70px",
};

const pageHeading = {
  display: "flex",
  justifyContent:
    "space-between",
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
  margin:
    "7px 0 6px",
  fontSize: "34px",
  color: "#e8f4f8",
};

const pageDescription = {
  margin: 0,
  color: "#8fa8b5",
  fontSize: "13px",
  lineHeight: "1.6",
};

const incidentHero = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding:
    "12px 18px",
  background: "#3b2023",
  border:
    "1px solid #6a3034",
  borderRadius: "12px",
  color: "#ff6b6b",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(5,minmax(0,1fr))",
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
  justifyContent:
    "center",
  flexShrink: 0,
};

const summaryLabel = {
  display: "block",
  color: "#8fa8b5",
  fontSize: "8px",
  fontWeight: "900",
  letterSpacing: "1px",
  whiteSpace:
    "nowrap",
};

const summaryValue = {
  display: "block",
  marginTop: "4px",
  fontSize: "19px",
};

const policyCard = {
  display: "flex",
  alignItems: "flex-start",
  gap: "14px",
  background: "#101f2a",
  border:
    "1px solid #203542",
  borderRadius: "16px",
  padding: "18px",
  marginBottom: "18px",
};

const policyIcon = {
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  background: "#3b2023",
  color: "#ff6b6b",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
  flexShrink: 0,
};

const policyContent = {
  minWidth: 0,
};

const policyEyebrow = {
  color: "#ff6b6b",
  fontSize: "8px",
  fontWeight: "900",
  letterSpacing: "1.5px",
};

const toolbar = {
  background: "#101f2a",
  border:
    "1px solid #203542",
  borderRadius: "15px",
  padding: "13px",
  marginBottom: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "space-between",
  gap: "15px",
};

const searchBox = {
  flex: 1,
  maxWidth: "560px",
  height: "43px",
  border:
    "1px solid #29414e",
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
  background:
    "transparent",
};

const filters = {
  display: "flex",
  gap: "6px",
};

const filterButton = {
  border:
    "1px solid #29414e",
  background:
    "#101f2a",
  color: "#8fa8b5",
  borderRadius: "8px",
  padding:
    "9px 12px",
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
  border:
    "1px solid #203542",
  borderRadius: "18px",
  overflow: "hidden",
};

const tableHeader = {
  padding:
    "21px 22px",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "space-between",
  borderBottom:
    "1px solid #203542",
};

const tableTitle = {
  margin:
    "5px 0 0",
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
  minWidth: "1300px",
  tableLayout:
    "fixed",
  borderCollapse:
    "collapse",
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
  whiteSpace:
    "nowrap",
};

const td = {
  padding: "14px",
  textAlign: "left",
  fontSize: "11px",
  color: "#b8cbd3",
  borderBottom:
    "1px solid #1c303c",
  verticalAlign:
    "middle",
  overflow: "hidden",
};

const incidentCell = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
};

const incidentIcon = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
};

const incidentId = {
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

const personInfo = {
  minWidth: 0,
};

const technicianAvatar = {
  width: "31px",
  height: "31px",
  borderRadius: "50%",
  background: "#29213b",
  color: "#b79aff",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
  flexShrink: 0,
};

const customerAvatar = {
  width: "31px",
  height: "31px",
  borderRadius: "50%",
  background: "#173b4b",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
  fontWeight: "900",
  fontSize: "10px",
  flexShrink: 0,
};

const personName = {
  display: "block",
  color: "#e8f4f8",
  fontSize: "10px",
  fontWeight: "800",
  whiteSpace:
    "nowrap",
  overflow: "hidden",
  textOverflow:
    "ellipsis",
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

const reasonText = {
  display: "block",
  color: "#8fa8b5",
  lineHeight: "1.4",
  whiteSpace:
    "nowrap",
  overflow: "hidden",
  textOverflow:
    "ellipsis",
};

const durationCell = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  color: "#e5ad42",
};

const statusBadge = {
  display: "inline-block",
  padding:
    "6px 8px",
  borderRadius: "20px",
  fontSize: "8px",
  fontWeight: "900",
};

const moreButton = {
  border: "none",
  background:
    "transparent",
  color: "#78909c",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
};

const emptyState = {
  padding: "70px 20px",
  textAlign: "center",
  color: "#8fa8b5",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background:
    "rgba(0,0,0,.68)",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
  padding: "20px",
  zIndex: 100,
};

const modal = {
  width: "100%",
  maxWidth: "650px",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#101f2a",
  border:
    "1px solid #29414e",
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
  border:
    "1px solid #29414e",
  background:
    "#142631",
  color: "#8fa8b5",
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
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
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
};

const modalTitle = {
  margin:
    "5px 0 3px",
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
  flexWrap: "wrap",
  marginBottom: "18px",
};

const typeBadge = {
  display: "inline-block",
  padding:
    "6px 9px",
  borderRadius: "20px",
  background: "#173b4b",
  color: "#8fd9eb",
  fontSize: "8px",
  fontWeight: "900",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2,minmax(0,1fr))",
  gap: "10px",
};

const detailBox = {
  background: "#0d1b25",
  border:
    "1px solid #203542",
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

const reasonBox = {
  marginTop: "14px",
  padding: "15px",
  background: "#0d1b25",
  border:
    "1px solid #203542",
  borderRadius: "11px",
};

const noteBox = {
  marginTop: "10px",
  padding: "15px",
  background: "#123f52",
  border:
    "1px solid #20556a",
  borderRadius: "11px",
};

const warningBox = {
  marginTop: "14px",
  padding: "13px",
  borderRadius: "11px",
  background: "#3b2023",
  border:
    "1px solid #6a3034",
  color: "#ff6b6b",
  display: "flex",
  gap: "9px",
  fontSize: "12px",
  lineHeight: "1.5",
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
    "repeat(2,minmax(0,1fr))",
  gap: "9px",
};

const resolveButton = {
  border:
    "1px solid #245b45",
  borderRadius: "10px",
  background: "#12382b",
  color: "#39c98a",
  padding: "12px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
  gap: "7px",
};

const suspendButton = {
  border:
    "1px solid #6a3034",
  borderRadius: "10px",
  background: "#3b2023",
  color: "#ff6b6b",
  padding: "12px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center",
  gap: "7px",
};

const closeButton = {
  width: "100%",
  marginTop: "10px",
  border:
    "1px solid #29414e",
  borderRadius: "10px",
  background:
    "#142631",
  color: "#8fa8b5",
  padding: "12px",
  fontWeight: "700",
  cursor: "pointer",
};

export default AdminIncidents;