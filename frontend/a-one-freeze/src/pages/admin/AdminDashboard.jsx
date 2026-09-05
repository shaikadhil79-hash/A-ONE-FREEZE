import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Snowflake,
  LayoutDashboard,
  Users,
  UserCog,
  CalendarCheck,
  Wrench,
  CreditCard,
  WalletCards,
  Star,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  TrendingUp,
  IndianRupee,
  CheckCircle2,
  Clock3,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";

import serviceStore from "../../services/serviceStore";

function AdminDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("admin@aonefreeze.com");
  const [liveStats, setLiveStats] = useState({
    totalRevenue: 0,
    activeBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalBookings: 0,
    onlineTechnicians: 0,
    totalTechnicians: 0,
  });
  const [liveBookings, setLiveBookings] = useState([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");
    if (loggedIn !== "true") {
      navigate("/admin/login");
      return;
    }

    const email = localStorage.getItem("adminEmail");
    if (email) setAdminEmail(email);

    const sync = () => {
      setLiveStats(serviceStore.getDashboardStats());
      setLiveBookings(serviceStore.getBookings());
    };
    sync();
    return serviceStore.subscribe(sync);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  const stats = [
    {
      title: "Total Customers",
      value: String(Math.max(12, liveBookings.length * 3)),
      change: "+12.4%",
      icon: Users,
    },
    {
      title: "Technicians",
      value: `${liveStats.onlineTechnicians} Online`,
      change: `${liveStats.totalTechnicians} Total`,
      icon: UserCog,
    },
    {
      title: "Total AC Bookings",
      value: String(liveStats.totalBookings),
      change: `+${liveStats.pendingBookings} New`,
      icon: CalendarCheck,
    },
    {
      title: "Platform Revenue",
      value: `₹${liveStats.totalRevenue.toLocaleString("en-IN")}`,
      change: "+9.8%",
      icon: IndianRupee,
    },
  ];

  const quickStats = [
    {
      title: "Pending Dispatch",
      value: String(liveStats.pendingBookings),
      icon: WalletCards,
      tone: "warning",
    },
    {
      title: "Active AC Jobs",
      value: String(liveStats.activeBookings),
      icon: Wrench,
      tone: "blue",
    },
    {
      title: "Completed Today",
      value: String(liveStats.completedBookings),
      icon: CheckCircle2,
      tone: "success",
    },
    {
      title: "Technicians On Duty",
      value: String(liveStats.onlineTechnicians),
      icon: ShieldAlert,
      tone: "danger",
    },
  ];

  const bookings = liveBookings.slice(0, 6).map((b) => ({
    id: b.id,
    customer: b.customerName,
    technician: b.technicianName || "Not Assigned",
    service: b.serviceName,
    amount: `₹${b.totalAmount || b.amount}`,
    status: b.status.replace(/_/g, " "),
  }));

  const menu = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      label: "Technicians",
      icon: UserCog,
      path: "/admin/technicians",
    },
    {
      label: "Customers",
      icon: Users,
      path: "/admin/customers",
    },
    {
      label: "Bookings",
      icon: CalendarCheck,
      path: "/admin/bookings",
    },
    {
      label: "Services",
      icon: Wrench,
      path: "/admin/services",
    },
    {
      label: "Payments",
      icon: CreditCard,
      path: "/admin/payments",
    },
    {
      label: "Commission",
      icon: WalletCards,
      path: "/admin/commission",
    },
    {
      label: "Reviews",
      icon: Star,
      path: "/admin/reviews",
    },
    {
      label: "Incidents",
      icon: AlertTriangle,
      path: "/admin/incidents",
    },
  ];

  return (
    <div style={pageStyle}>
      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          style={overlay}
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}

      <aside
        style={{
          ...sidebar,
          transform:
            sidebarOpen
              ? "translateX(0)"
              : undefined,
        }}
      >
        <div style={sidebarHeader}>
          <div style={adminLogo}>
            <Snowflake size={20} />
          </div>

          <div>
            <strong>A-ONE FREEZE</strong>

            <span>ADMIN PANEL</span>
          </div>

          <button
            style={closeButton}
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={19} />
          </button>
        </div>

        <nav style={nav}>
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                style={{
                  ...navItem,
                  background:
                    item.path === "/admin"
                      ? "#e7f7fc"
                      : "transparent",
                  color:
                    item.path === "/admin"
                      ? "#087ea4"
                      : "#78909c",
                }}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={18} />

                <span>{item.label}</span>

                <ChevronRight
                  size={15}
                  style={{
                    marginLeft: "auto",
                  }}
                />
              </button>
            );
          })}
        </nav>

        <div style={sidebarBottom}>
          <div style={adminProfile}>
            <div style={avatar}>
              A
            </div>

            <div style={adminInfo}>
              <strong style={adminName}>
                Administrator
              </strong>

              <span style={adminEmailStyle}>
                {adminEmail}
              </span>
            </div>
          </div>

          <button
            style={logoutButton}
            onClick={logout}
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <div style={content}>
        <header style={topbar}>
          <button
            style={mobileMenu}
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={22} />
          </button>

          <div>
            <span style={topEyebrow}>
              ADMIN CONTROL CENTER
            </span>

            <h1 style={topTitle}>
              Dashboard
            </h1>
          </div>

          <div style={topRight}>
            <div style={topDate}>
              <Clock3 size={15} />

              {new Date().toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </div>

            <div style={topAvatar}>
              A
            </div>
          </div>
        </header>

        <main style={main}>
          {/* WELCOME */}

          <section style={welcomeCard}>
            <div>
              <span style={welcomeEyebrow}>
                GOOD DAY, ADMIN
              </span>

              <h2>
                A-ONE FREEZE Overview
              </h2>

              <p>
                Monitor your customers,
                technicians, bookings and
                platform earnings from one
                place.
              </p>
            </div>

            <div style={welcomeIcon}>
              <TrendingUp size={42} />
            </div>
          </section>

          {/* MAIN STATS */}

          <section style={statsGrid}>
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  style={statCard}
                >
                  <div style={statTop}>
                    <div
                      style={statIcon}
                    >
                      <Icon size={19} />
                    </div>

                    <span
                      style={statChange}
                    >
                      {item.change}
                    </span>
                  </div>

                  <span style={statLabel}>
                    {item.title}
                  </span>

                  <strong style={statValue}>
                    {item.value}
                  </strong>
                </div>
              );
            })}
          </section>

          {/* QUICK STATS */}

          <section style={quickGrid}>
            {quickStats.map((item) => {
              const Icon = item.icon;

              const tone =
                tones[item.tone];

              return (
                <div
                  key={item.title}
                  style={{
                    ...quickCard,
                    borderColor:
                      tone.border,
                  }}
                >
                  <div
                    style={{
                      ...quickIcon,
                      background:
                        tone.background,
                      color: tone.color,
                    }}
                  >
                    <Icon size={19} />
                  </div>

                  <div>
                    <span
                      style={quickLabel}
                    >
                      {item.title}
                    </span>

                    <strong
                      style={{
                        ...quickValue,
                        color: tone.color,
                      }}
                    >
                      {item.value}
                    </strong>
                  </div>
                </div>
              );
            })}
          </section>

          {/* BOOKINGS */}

          <section style={sectionCard}>
           <div style={sectionHeader}>
            <div>
              <span style={sectionEyebrow}>
                LIVE ACTIVITY
              </span>

              <h2 style={sectionTitle}>
                Recent Bookings
              </h2>
            </div>

            <button
              style={viewButton}
              onClick={() =>
                navigate("/admin/bookings")
              }
            >
              View All
              <ChevronRight size={16} />
            </button>
          </div>

            <div style={tableWrapper}>
              <table style={table}>
               <thead>
                <tr>
                  <th
                    style={{
                      ...tableHeaderCell,
                      width: "14%",
                    }}
                  >
                    BOOKING
                  </th>

                  <th
                    style={{
                      ...tableHeaderCell,
                      width: "13%",
                    }}
                  >
                    CUSTOMER
                  </th>

                  <th
                    style={{
                      ...tableHeaderCell,
                      width: "15%",
                    }}
                  >
                    TECHNICIAN
                  </th>

                  <th
                    style={{
                      ...tableHeaderCell,
                      width: "27%",
                    }}
                  >
                    SERVICE
                  </th>

                  <th
                    style={{
                      ...tableHeaderCell,
                      width: "12%",
                    }}
                  >
                    AMOUNT
                  </th>

                  <th
                    style={{
                      ...tableHeaderCell,
                      width: "19%",
                    }}
                  >
                    STATUS
                  </th>
                </tr>
              </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      style={tableRow}
                    >
                      <td style={tableCell}>
                        <strong
                          style={bookingIdStyle}
                        >
                          {booking.id}
                        </strong>
                      </td>

                      <td style={tableCell}>
                        {booking.customer}
                      </td>

                      <td style={tableCell}>
                        {booking.technician}
                      </td>

                      <td
                        style={{
                          ...tableCell,
                          color: "#e8f4f8",
                        }}
                      >
                        {booking.service}
                      </td>

                      <td
                        style={{
                          ...tableCell,
                          color: "#e8f4f8",
                          fontWeight: "800",
                        }}
                      >
                        {booking.amount}
                      </td>

                      <td style={tableCell}>
                        <span
                          style={{
                            ...statusBadge,
                            ...getStatusStyle(
                              booking.status
                            ),
                          }}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* BOTTOM CARDS */}

          <section
            style={bottomGrid}
          >
            <div style={bottomCard}>
              <div
                style={bottomIcon}
              >
                <WalletCards size={21} />
              </div>

              <div>
                <span
                  style={bottomLabel}
                >
                  COMMISSION REQUIRING ATTENTION
                </span>

                <h3>
                  8 technicians
                </h3>

                <p>
                  have commission due above
                  the ₹500 limit.
                </p>
              </div>

              <button
                style={bottomButton}
                onClick={() =>
                  navigate(
                    "/admin/commission"
                  )
                }
              >
                Review
                <ChevronRight size={15} />
              </button>
            </div>

            <div style={bottomCard}>
              <div
                style={{
                  ...bottomIcon,
                  background: "#fff3f3",
                  color: "#ff6b6b",
                }}
              >
                <AlertTriangle
                  size={21}
                />
              </div>

              <div>
                <span
                  style={bottomLabel}
                >
                  INCIDENTS
                </span>

                <h3>
                  3 active suspensions
                </h3>

                <p>
                  Technicians currently under
                  temporary suspension.
                </p>
              </div>

              <button
                style={bottomButton}
                onClick={() =>
                  navigate(
                    "/admin/incidents"
                  )
                }
              >
                Review
                <ChevronRight size={15} />
              </button>
            </div>
          </section>
        </main>
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

const sidebar = {
  position: "fixed",
  left: 0,
  top: 0,
  bottom: 0,
  width: "255px",
  background: "#101f2a",
  borderRight: "1px solid #203542",
  display: "flex",
  flexDirection: "column",
  zIndex: 20,
  transition: "transform .25s ease",
};

const sidebarHeader = {
  minHeight: "80px",
  padding: "0 20px",
  borderBottom: "1px solid #1c303c",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  boxSizing: "border-box",
};

const brandText = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  minWidth: 0,
};

const brandTitle = {
  fontSize: "17px",
  fontWeight: "900",
  color: "#e8f4f8",
  whiteSpace: "nowrap",
};

const brandSubtitle = {
  fontSize: "12px",
  color: "#e8f4f8",
  letterSpacing: "1.5px",
};

const adminLogo = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const closeButton = {
  display: "none",
  marginLeft: "auto",
  border: "none",
  background: "transparent",
  color: "#8fa8b5",
};

const nav = {
  padding: "18px 12px",
  flex: 1,
  overflowY: "auto",
};

const navItem = {
  width: "100%",
  border: "none",
  borderRadius: "10px",
  padding: "12px 13px",
  marginBottom: "4px",
  display: "flex",
  alignItems: "center",
  gap: "11px",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
  textAlign: "left",
};

const sidebarBottom = {
  padding: "15px",
  borderTop: "1px solid #203542",
};

const adminProfile = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  marginBottom: "13px",
  minWidth: 0,
};

const adminInfo = {
  minWidth: 0,
  flex: 1,
};

const adminName = {
  display: "block",
  fontSize: "13px",
  fontWeight: "800",
  color: "#e8f4f8",
  marginBottom: "3px",
};

const adminEmailStyle = {
  display: "block",
  fontSize: "10px",
  color: "#8fa8b5",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const avatar = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background:
    "linear-gradient(135deg,#35c9f2,#087ea4)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
};

const logoutButton = {
  width: "100%",
  height: "40px",
  border: "1px solid #203542",
  borderRadius: "9px",
  background: "#101f2a",
  color: "#8fa8b5",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  fontWeight: "700",
};

const content = {
  marginLeft: "255px",
  minHeight: "100vh",
};

const topbar = {
  height: "80px",
  padding: "0 32px",
  background: "#101f2a",
  borderBottom: "1px solid #203542",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const topEyebrow = {
  fontSize: "9px",
  fontWeight: "900",
  color: "#35c9f2",
  letterSpacing: "1.8px",
};

const topTitle = {
  margin: "4px 0 0",
  fontSize: "24px",
};

const topRight = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const topDate = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: "#8fa8b5",
  fontSize: "12px",
};

const topAvatar = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
};

const mobileMenu = {
  display: "none",
  border: "none",
  background: "transparent",
  color: "#35c9f2",
};

const main = {
  padding: "28px 32px 50px",
  maxWidth: "1500px",
};

const welcomeCard = {
  borderRadius: "20px",
  padding: "25px 28px",
  background:
    "linear-gradient(120deg,#087ea4,#31c6eb)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "22px",
  boxShadow:
    "0 15px 40px rgba(0,0,0,.28)",
};

const welcomeEyebrow = {
  fontSize: "9px",
  fontWeight: "900",
  letterSpacing: "1.8px",
  opacity: ".8",
};

const welcomeIcon = {
  width: "76px",
  height: "76px",
  borderRadius: "20px",
  background: "rgba(255,255,255,.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4,minmax(0,1fr))",
  gap: "16px",
  marginBottom: "16px",
};

const statCard = {
  background: "#101f2a",
  border: "1px solid #203542",
  borderRadius: "16px",
  padding: "20px",
};

const statTop = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const statIcon = {
  width: "38px",
  height: "38px",
  borderRadius: "11px",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const statChange = {
  fontSize: "10px",
  color: "#39c98a",
  fontWeight: "800",
};

const statLabel = {
  display: "block",
  marginTop: "17px",
  color: "#8fa8b5",
  fontSize: "11px",
};

const statValue = {
  display: "block",
  marginTop: "5px",
  fontSize: "25px",
};

const quickGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4,minmax(0,1fr))",
  gap: "14px",
  marginBottom: "22px",
};

const quickCard = {
  background: "#101f2a",
  border: "1px solid",
  borderRadius: "14px",
  padding: "15px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const quickIcon = {
  width: "40px",
  height: "40px",
  borderRadius: "11px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const quickLabel = {
  display: "block",
  color: "#8fa8b5",
  fontSize: "10px",
};

const quickValue = {
  display: "block",
  marginTop: "4px",
  fontSize: "18px",
};

const sectionCard = {
  background: "#101f2a",
  border: "1px solid #203542",
  borderRadius: "18px",
  overflow: "hidden",
};

const sectionHeader = {
  padding: "22px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid #1c303c",
};

const sectionTitle = {
  margin: "5px 0 0",
  fontSize: "22px",
  color: "#e8f4f8",
};

const sectionEyebrow = {
  fontSize: "9px",
  fontWeight: "900",
  letterSpacing: "1.5px",
  color: "#35c9f2",
};

const viewButton = {
  border: "none",
  background: "#123f52",
  color: "#35c9f2",
  borderRadius: "9px",
  padding: "9px 12px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
};

const tableWrapper = {
  width: "100%",
  overflowX: "auto",
  overflowY: "hidden",
  boxSizing: "border-box",
};

const table = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  tableLayout: "fixed",
  minWidth: "950px",
};

const tableHeaderCell = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "10px",
  fontWeight: "900",
  letterSpacing: "1px",
  color: "#8fa8b5",
  background: "#0d1b25",
  borderBottom: "1px solid #203542",
  whiteSpace: "nowrap",
};

const tableCell = {
  padding: "15px 16px",
  textAlign: "left",
  fontSize: "13px",
  color: "#b8cbd3",
  borderBottom: "1px solid #1c303c",
  verticalAlign: "middle",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const tableRow = {
  height: "58px",
};

const bookingIdStyle = {
  color: "#35c9f2",
};

const statusBadge = {
  display: "inline-block",
  padding: "5px 8px",
  borderRadius: "20px",
  fontSize: "9px",
  fontWeight: "800",
};

const bottomGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2,minmax(0,1fr))",
  gap: "16px",
  marginTop: "22px",
};

const bottomCard = {
  background: "#101f2a",
  border: "1px solid #203542",
  borderRadius: "16px",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "13px",
};

const bottomIcon = {
  width: "45px",
  height: "45px",
  borderRadius: "12px",
  background: "#3a2e17",
  color: "#e5ad42",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const bottomLabel = {
  display: "block",
  fontSize: "9px",
  fontWeight: "900",
  letterSpacing: "1.2px",
  color: "#8fa8b5",
};

const bottomButton = {
  marginLeft: "auto",
  border: "none",
  background: "#123f52",
  color: "#35c9f2",
  borderRadius: "9px",
  padding: "8px 11px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "3px",
};

const tones = {
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
};

function getStatusStyle(status) {
  if (status === "Completed") {
    return {
      background: "#12382b",
      color: "#39c98a",
    };
  }

  if (status === "In Progress") {
    return {
      background: "#123f52",
      color: "#35c9f2",
    };
  }

  if (status === "Accepted") {
    return {
      background: "#3a2e17",
      color: "#e5ad42",
    };
  }

  return {
    background: "#1b2a34",
    color: "#8fa8b5",
  };
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.58)",
  zIndex: 15,
};

export default AdminDashboard;