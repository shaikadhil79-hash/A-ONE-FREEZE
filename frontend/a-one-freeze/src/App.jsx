import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// =================================================
// ROLE / LOGIN
// =================================================

import RoleSelection from "./pages/RoleSelection";

import CustomerLogin
  from "./pages/customer/CustomerLogin";

import TechnicianLogin
  from "./pages/technician/TechnicianLogin";
import AdminLogin
  from "./pages/admin/AdminLogin";

import AdminTechnicians
  from "./pages/admin/AdminTechnicians";  

import AdminDashboard
  from "./pages/admin/AdminDashboard";

import TechnicianRegister
  from "./pages/technician/TechnicianRegister";


// =================================================
// CUSTOMER PAGES
// =================================================

import CustomerHome
  from "./pages/customer/CustomerHome";

import Services
  from "./pages/customer/Services";

import ServiceSelection
  from "./pages/customer/ServiceSelection";

import AdminCustomers
  from "./pages/admin/AdminCustomers";

import ApplianceServices
  from "./pages/customer/ApplianceServices";

import AdminPayments
  from "./pages/admin/AdminPayments";

import MyBookings
  from "./pages/customer/MyBookings";

import Booking
  from "./pages/customer/Booking";

import TrackingService
  from "./pages/customer/TrackService";

import BookingSuccess
  from "./pages/customer/BookingSuccess";

import ServiceCompleted
  from "./pages/customer/ServiceCompleted";

import AdminReviews
  from "./pages/admin/AdminReviews";
// =================================================
// TECHNICIAN PAGES
// =================================================

import TechnicianDashboard
  from "./pages/technician/TechnicianDashboard";

import TechnicianService
  from "./pages/technician/TechnicianService";

import AdminCommission
  from "./pages/admin/AdminCommission";

import TechnicianServices
  from "./pages/technician/TechnicianServices";

import TechnicianActiveWork
  from "./pages/technician/TechnicianActiveWork";

import AdminServices
  from "./pages/admin/AdminServices";  

import AdminBookings
  from "./pages/admin/AdminBookings";

import TechnicianEarnings
  from "./pages/technician/TechnicianEarnings";

import AdminLayout
  from "./pages/admin/AdminLayout";

import AdminIncidents
  from "./pages/admin/AdminIncidents";


import TechnicianRatings
  from "./pages/technician/TechnicianRatings";

import TechnicianProfile
  from "./pages/technician/TechnicianProfile";

import ServiceComplete
  from "./pages/technician/ServiceComplete";
import PortalHeader from "./components/PortalHeader";
// =================================================
// APP
// =================================================

function App() {

  return (

    <BrowserRouter>
      <PortalHeader />

      <Routes>


        {/* =================================================
            DEFAULT
        ================================================= */}

        <Route
          path="/"
          element={<RoleSelection />}
        />


        {/* =================================================
            CUSTOMER LOGIN
        ================================================= */}

        <Route
          path="/customer/login"
          element={<CustomerLogin />}
        />


        {/* =================================================
            CUSTOMER HOME
        ================================================= */}

        <Route
          path="/customer"
          element={<CustomerHome />}
        />


        {/* =================================================
            CUSTOMER SERVICES
        ================================================= */}

        <Route
          path="/customer/services"
          element={<Services />}
        />


        {/* =================================================
            BOOK A SERVICE
            5 APPLIANCE CARDS
        ================================================= */}

        <Route
          path="/customer/service-selection"
          element={<ServiceSelection />}
        />

        <Route
          path="/customer/services/:applianceId"
          element={<ApplianceServices />}
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />


        {/* =================================================
            MY BOOKINGS
        ================================================= */}

        <Route
          path="/customer/bookings"
          element={<MyBookings />}
        />


        {/* =================================================
            BOOKING
        ================================================= */}

        <Route
          path="/customer/booking"
          element={<Booking />}
        />


        {/* =================================================
            BOOKING SUCCESS
        ================================================= */}

        <Route
          path="/customer/booking-success"
          element={<BookingSuccess />}
        />


        {/* =================================================
            TRACK SERVICE
        ================================================= */}

        <Route
          path="/customer/track-service"
          element={<TrackingService />}
        />


        {/* =================================================
            CUSTOMER SERVICE COMPLETED
        ================================================= */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/technicians"
          element={
            <AdminLayout>
              <AdminTechnicians />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/customers"
          element={
            <AdminLayout>
              <AdminCustomers />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <AdminLayout>
              <AdminBookings />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/services"
          element={
            <AdminLayout>
              <AdminServices />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <AdminLayout>
              <AdminPayments />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/commission"
          element={
            <AdminLayout>
              <AdminCommission />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <AdminLayout>
              <AdminReviews />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/incidents"
          element={
            <AdminLayout>
              <AdminIncidents />
            </AdminLayout>
          }
        />

        <Route
          path="/customer/service-completed"
          element={<ServiceCompleted />}
        />

        <Route
          path="/technician/login"
          element={<TechnicianLogin />}
        />

        <Route
          path="/technician/register"
          element={<TechnicianRegister />}
        />

        <Route
          path="/technician/dashboard"
          element={<TechnicianDashboard />}
        />

        <Route
          path="/technician/services"
          element={<TechnicianServices />}
        />

        <Route
          path="/technician/active-work"
          element={<TechnicianActiveWork />}
        />


        <Route
            path="/technician/service/:bookingId/complete"
            element={<ServiceComplete />}
          />

        <Route
          path="/technician/earnings"
          element={<TechnicianEarnings />}
        />

        <Route
          path="/technician/ratings"
          element={<TechnicianRatings />}
        />

        <Route
          path="/technician/profile"
          element={<TechnicianProfile />}
        />

        <Route
          path="/technician/service/:bookingId"
          element={<TechnicianService />}
        />

        <Route
          path="/technician/service/:bookingId/active"
          element={<TechnicianActiveWork />}
        />

        <Route
          path="*"
          element={

            <div
              style={{
                minHeight:
                  "100vh",

                display:
                  "flex",

                flexDirection:
                  "column",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                background:
                  "#f5faff",

                color:
                  "#173b53",

                fontFamily:
                  "Arial, sans-serif",

                textAlign:
                  "center",

                padding:
                  "20px",
              }}
            >

              <h1
                style={{
                  fontSize:
                    "60px",

                  margin:
                    0,

                  color:
                    "#087ea4",
                }}
              >
                404
              </h1>


              <h2>
                Page Not Found
              </h2>


              <p
                style={{
                  color:
                    "#78919f",
                }}
              >
                The page you're looking for
                doesn't exist.
              </p>


              <button
                onClick={() =>
                  window.location.href =
                    "/customer"
                }
                style={{
                  marginTop:
                    "15px",

                  padding:
                    "12px 22px",

                  border:
                    "none",

                  borderRadius:
                    "10px",

                  background:
                    "linear-gradient(100deg, #31c6eb, #087ea4)",

                  color:
                    "#ffffff",

                  fontWeight:
                    "bold",

                  cursor:
                    "pointer",
                }}
              >
                Go to Customer Home
              </button>

            </div>

          }
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;