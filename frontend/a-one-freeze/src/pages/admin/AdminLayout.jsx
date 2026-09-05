import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  ChevronRight,
} from "lucide-react";

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [adminEmail, setAdminEmail] =
    useState("admin@aonefreeze.com");

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
      navigate("/admin/login");
      return;
    }

    const email =
      localStorage.getItem("adminEmail");

    if (email) {
      setAdminEmail(email);
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");

    navigate("/admin/login");
  };

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
    <div style={layout}>
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
          transform: sidebarOpen
            ? "translateX(0)"
            : undefined,
        }}
      >
        {/* LOGO */}

        <div style={sidebarHeader}>
          <div style={logoBox}>
            <Snowflake size={21} />
          </div>

          <div style={brandText}>
            <strong>
              A-ONE FREEZE
            </strong>

            <span>
              ADMIN PANEL
            </span>
          </div>

          <button
            style={closeButton}
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={18} />
          </button>
        </div>

        {/* MENU */}

        <nav style={nav}>
          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname ===
              item.path;

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                style={{
                  ...navItem,
                  background: active
                    ? "#123f52"
                    : "transparent",

                  color: active
                    ? "#35c9f2"
                    : "#8fa8b5",

                  border: active
                    ? "1px solid #20556a"
                    : "1px solid transparent",
                }}
              >
                <Icon size={18} />

                <span>
                  {item.label}
                </span>

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

        {/* ADMIN PROFILE */}

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

      {/* MAIN CONTENT */}

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
              A-ONE FREEZE
            </h1>
          </div>
        </header>

        <main style={pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}

/* =====================================================
   STYLES
===================================================== */

const layout = {
  minHeight: "100vh",
  background: "#0b1720",
  color: "#e8f4f8",
  fontFamily:
    "Arial, sans-serif",
};

const sidebar = {
  position: "fixed",
  left: 0,
  top: 0,
  bottom: 0,
  width: "280px",
  background: "#101f2a",
  borderRight:
    "1px solid #203542",
  display: "flex",
  flexDirection: "column",
  zIndex: 100,
  transition:
    "transform .25s ease",
};

const sidebarHeader = {
  height: "96px",
  padding: "0 20px",
  display: "flex",
  alignItems: "center",
  gap: "11px",
  borderBottom:
    "1px solid #203542",
};

const logoBox = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const brandText = {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
};

const closeButton = {
  display: "none",
  marginLeft: "auto",
  border: "none",
  background: "transparent",
  color: "#8fa8b5",
};

const nav = {
  padding: "18px 14px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  overflowY: "auto",
};

const navItem = {
  width: "100%",
  minHeight: "48px",
  padding: "0 13px",
  borderRadius: "11px",
  display: "flex",
  alignItems: "center",
  gap: "11px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "700",
  textAlign: "left",
};

const sidebarBottom = {
  marginTop: "auto",
  padding: "16px",
  borderTop:
    "1px solid #203542",
};

const adminProfile = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "14px",
  minWidth: 0,
};

const adminInfo = {
  minWidth: 0,
  overflow: "hidden",
};

const adminName = {
  display: "block",
  color: "#e8f4f8",
  fontSize: "13px",
  fontWeight: "800",
  whiteSpace: "nowrap",
};

const adminEmailStyle = {
  display: "block",
  marginTop: "3px",
  color: "#78909c",
  fontSize: "10px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const avatar = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "#159ac0",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
};

const logoutButton = {
  width: "100%",
  height: "44px",
  border:
    "1px solid #29414e",
  borderRadius: "10px",
  background: "transparent",
  color: "#8fa8b5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  cursor: "pointer",
  fontWeight: "700",
};

const content = {
  minHeight: "100vh",
  marginLeft: "280px",
};

const topbar = {
  height: "76px",
  background: "#101f2a",
  borderBottom:
    "1px solid #203542",
  display: "flex",
  alignItems: "center",
  padding: "0 30px",
};

const topEyebrow = {
  color: "#35c9f2",
  fontSize: "9px",
  fontWeight: "900",
  letterSpacing: "2px",
};

const topTitle = {
  margin: "4px 0 0",
  fontSize: "22px",
};

const pageContent = {
  minHeight:
    "calc(100vh - 76px)",
  background: "#0b1720",
};

const mobileMenu = {
  display: "none",
  marginRight: "15px",
  border: "none",
  background: "transparent",
  color: "#35c9f2",
  cursor: "pointer",
};

const overlay = {
  display: "none",
};

export default AdminLayout;