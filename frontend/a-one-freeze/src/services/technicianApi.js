const API_BASE_URL = "http://127.0.0.1:5000/api";

export const getTechnicianToken = () => {
  return localStorage.getItem("technicianAccessToken");
};

export const getTechnicianHeaders = () => {
  const token = getTechnicianToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};


/* ================================
   TECHNICIAN LOGIN
================================ */

export const technicianLogin = async (data) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/technician/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Technician login failed."
    );
  }

  return result;
};


/* ================================
   ONLINE / OFFLINE
================================ */

export const updateTechnicianOnlineStatus = async (
  isOnline
) => {
  const response = await fetch(
    `${API_BASE_URL}/technician/online-status`,
    {
      method: "PATCH",

      headers: getTechnicianHeaders(),

      body: JSON.stringify({
        is_online: isOnline,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Unable to update online status."
    );
  }

  return result;
};


/* ================================
   AVAILABLE BOOKINGS
================================ */

export const getAvailableBookings = async () => {
  const response = await fetch(
    `${API_BASE_URL}/technician/bookings`,
    {
      method: "GET",

      headers: getTechnicianHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Unable to load service requests."
    );
  }

  return result;
};


/* ================================
   ACCEPT BOOKING
================================ */

export const acceptBooking = async (
  bookingId
) => {
  const response = await fetch(
    `${API_BASE_URL}/technician/bookings/${bookingId}/accept`,
    {
      method: "POST",

      headers: getTechnicianHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Unable to accept booking."
    );
  }

  return result;
};


/* ================================
   START OTP
================================ */

export const verifyStartOtp = async (
  bookingId,
  otp
) => {
  const response = await fetch(
    `${API_BASE_URL}/technician/bookings/${bookingId}/verify-start-otp`,
    {
      method: "POST",

      headers: getTechnicianHeaders(),

      body: JSON.stringify({
        otp,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Unable to verify Start OTP."
    );
  }

  return result;
};


/* ================================
   END OTP
================================ */

export const verifyEndOtp = async (
  bookingId,
  otp
) => {
  const response = await fetch(
    `${API_BASE_URL}/technician/bookings/${bookingId}/verify-end-otp`,
    {
      method: "POST",

      headers: getTechnicianHeaders(),

      body: JSON.stringify({
        otp,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Unable to verify End OTP."
    );
  }

  return result;
};

/* ================================
   UPDATE SERVICE PARTS
================================ */

export const updateBookingParts = async (
  bookingId,
  parts
) => {
  const response = await fetch(
    `${API_BASE_URL}/technician/bookings/${bookingId}/parts`,
    {
      method: "PUT",
      headers: getTechnicianHeaders(),
      body: JSON.stringify({ parts }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Unable to update service parts."
    );
  }

  return result;
};
