// =====================================================
// A-ONE FREEZE
// TECHNICIAN COMMISSION & ELIGIBILITY SERVICE
// =====================================================

const ACCOUNT_KEY =
  "technicianCommissionAccount";

const BOOKINGS_KEY =
  "technicianAcceptedBookings";

const SUSPENSION_KEY =
  "technicianSuspension";


// =====================================================
// SETTINGS
// =====================================================

export const COMMISSION_RATE = 0.10;

// Technician is blocked ONLY when commission is
// greater than ₹500.
export const COMMISSION_LIMIT = 500;

// Maximum accepted/upcoming jobs.
export const MAX_ACCEPTED_WORKS = 3;

// Suspension duration = 2 hours.
export const SUSPENSION_DURATION =
  2 * 60 * 60 * 1000;


// =====================================================
// DEFAULT ACCOUNT
// =====================================================

const defaultAccount = {
  totalEarnings: 0,
  todayEarnings: 0,
  weeklyEarnings: 0,

  totalCommission: 0,
  commissionDue: 0,
  totalCommissionPaid: 0,

  isBlocked: false,

  online: false,

  updatedAt: null,
};


// =====================================================
// GET ACCOUNT
// =====================================================

export function getTechnicianAccount() {

  const saved =
    localStorage.getItem(
      ACCOUNT_KEY
    );


  if (!saved) {

    localStorage.setItem(
      ACCOUNT_KEY,
      JSON.stringify(defaultAccount)
    );

    return {
      ...defaultAccount,
    };
  }


  try {

    const account =
      JSON.parse(saved);


    return {
      ...defaultAccount,
      ...account,
    };

  } catch (error) {

    console.error(
      "Unable to read technician account:",
      error
    );


    return {
      ...defaultAccount,
    };

  }
}


// =====================================================
// SAVE ACCOUNT
// =====================================================

function saveTechnicianAccount(
  account
) {

  localStorage.setItem(
    ACCOUNT_KEY,
    JSON.stringify(account)
  );

}


// =====================================================
// COMMISSION CALCULATION
// =====================================================

export function calculateCommission(
  paymentAmount
) {

  const amount =
    Number(paymentAmount) || 0;


  return Math.round(
    amount * COMMISSION_RATE
  );

}


// =====================================================
// RECORD CUSTOMER PAYMENT
// =====================================================

export function recordCustomerPayment({

  bookingId,

  customerName,

  serviceName,

  paymentAmount,

}) {

  const account =
    getTechnicianAccount();


  const amount =
    Number(paymentAmount) || 0;


  const commission =
    calculateCommission(amount);


  const technicianEarning =
    amount - commission;


  const newCommissionDue =
    Number(
      account.commissionDue || 0
    ) + commission;


  const now =
    new Date();


  const updatedAccount = {

    ...account,

    totalEarnings:
      Number(account.totalEarnings || 0)
      + technicianEarning,

    todayEarnings:
      Number(account.todayEarnings || 0)
      + technicianEarning,

    weeklyEarnings:
      Number(account.weeklyEarnings || 0)
      + technicianEarning,

    totalCommission:
      Number(account.totalCommission || 0)
      + commission,

    commissionDue:
      newCommissionDue,

    // IMPORTANT:
    // blocked only when ABOVE ₹500
    isBlocked:
      newCommissionDue >
      COMMISSION_LIMIT,

    updatedAt:
      now.toISOString(),

  };


  saveTechnicianAccount(
    updatedAccount
  );


  // Save completed payment history.

  const history =
    getPaymentHistory();


  history.push({

    bookingId,

    customerName,

    serviceName,

    paymentAmount:
      amount,

    commission,

    technicianEarning,

    date:
      now.toISOString(),

  });


  localStorage.setItem(
    "technicianPaymentHistory",
    JSON.stringify(history)
  );


  return {

    success: true,

    bookingId,

    customerName,

    serviceName,

    paymentAmount:
      amount,

    commission,

    technicianEarning,

    commissionDue:
      newCommissionDue,

    isBlocked:
      updatedAccount.isBlocked,

  };

}


// =====================================================
// PAYMENT HISTORY
// =====================================================

export function getPaymentHistory() {

  const saved =
    localStorage.getItem(
      "technicianPaymentHistory"
    );


  if (!saved) {
    return [];
  }


  try {

    return JSON.parse(saved);

  } catch {

    return [];

  }

}


// =====================================================
// GET ACCEPTED BOOKINGS
// =====================================================

export function getAcceptedBookings() {

  const saved =
    localStorage.getItem(
      BOOKINGS_KEY
    );


  if (!saved) {
    return [];
  }


  try {

    return JSON.parse(saved);

  } catch {

    return [];

  }

}


// =====================================================
// SAVE ACCEPTED BOOKINGS
// =====================================================

function saveAcceptedBookings(
  bookings
) {

  localStorage.setItem(
    BOOKINGS_KEY,
    JSON.stringify(bookings)
  );

}


// =====================================================
// TIME HELPERS
// =====================================================

function getTimeInMinutes(
  time
) {

  if (!time) {
    return null;
  }


  // Supports:
  // "11:00 AM"
  // "3:30 PM"
  // "11:00"
  // "15:30"

  const value =
    String(time)
      .trim()
      .toUpperCase();


  const match =
    value.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/
    );


  if (!match) {
    return null;
  }


  let hours =
    Number(match[1]);

  const minutes =
    Number(match[2]);

  const period =
    match[3];


  if (
    period === "AM" &&
    hours === 12
  ) {
    hours = 0;
  }


  if (
    period === "PM" &&
    hours !== 12
  ) {
    hours += 12;
  }


  return (
    hours * 60 +
    minutes
  );

}


// =====================================================
// SCHEDULE CONFLICT CHECK
// =====================================================

export function hasScheduleConflict(
  newBooking
) {

  const bookings =
    getAcceptedBookings();


  if (!newBooking) {
    return false;
  }


  const newDate =
    newBooking.date ||
    newBooking.scheduledDate;


  const newStart =
    getTimeInMinutes(
      newBooking.startTime ||
      newBooking.time
    );


  const newEnd =
    getTimeInMinutes(
      newBooking.endTime
    );


  // If there is no usable time information,
  // don't incorrectly block the booking.

  if (
    !newDate ||
    newStart === null
  ) {

    return false;

  }


  for (
    const booking of bookings
  ) {

    const bookingDate =
      booking.date ||
      booking.scheduledDate;


    if (
      bookingDate !== newDate
    ) {
      continue;
    }


    const bookingStart =
      getTimeInMinutes(
        booking.startTime ||
        booking.time
      );


    const bookingEnd =
      getTimeInMinutes(
        booking.endTime
      );


    if (
      bookingStart === null
    ) {
      continue;
    }


    // If an end time isn't provided,
    // assume a 1-hour service.

    const existingEnd =
      bookingEnd !== null
        ? bookingEnd
        : bookingStart + 60;


    const requestedEnd =
      newEnd !== null
        ? newEnd
        : newStart + 60;


    const overlaps =
      newStart < existingEnd &&
      requestedEnd > bookingStart;


    if (overlaps) {
      return true;
    }

  }


  return false;

}


// =====================================================
// CAN ACCEPT WORK
// =====================================================

export function canAcceptWork(
  newBooking = null
) {

  const account =
    getTechnicianAccount();


  // Commission restriction.

  if (
    Number(account.commissionDue || 0)
    > COMMISSION_LIMIT
  ) {

    return {

      allowed: false,

      reason:
        "Commission due is above ₹500. Please pay the outstanding commission before accepting new work.",

    };

  }


  // Suspension restriction.

  const suspension =
    isTechnicianSuspended();


  if (suspension.suspended) {

    return {

      allowed: false,

      reason:
        `Technician is suspended until ${suspension.untilText}.`,

    };

  }


  const bookings =
    getAcceptedBookings();


  // Maximum 2 accepted works.

  if (
    bookings.length >=
    MAX_ACCEPTED_WORKS
  ) {

    return {

      allowed: false,

      reason:
        "You can have a maximum of 2 accepted works at the same time.",

    };

  }


  // Schedule overlap.

  if (
    newBooking &&
    hasScheduleConflict(
      newBooking
    )
  ) {

    return {

      allowed: false,

      reason:
        "This work overlaps with another accepted service. Choose a different time.",

    };

  }


  return {

    allowed: true,

    reason: "",

  };

}


// =====================================================
// ACCEPT WORK
// =====================================================

export function acceptWork(
  booking
) {

  const eligibility =
    canAcceptWork(
      booking
    );


  if (
    !eligibility.allowed
  ) {

    return {

      success: false,

      reason:
        eligibility.reason,

    };

  }


  const bookings =
    getAcceptedBookings();


  const exists =
    bookings.some(
      (item) =>
        item.bookingId ===
        booking.bookingId
    );


  if (exists) {

    return {

      success: false,

      reason:
        "This booking has already been accepted.",

    };

  }


  bookings.push({
    ...booking,
    acceptedAt:
      new Date().toISOString(),
    status:
      "ACCEPTED",
  });


  saveAcceptedBookings(
    bookings
  );


  return {

    success: true,

    booking,

    bookings,

  };

}


// =====================================================
// REMOVE COMPLETED/CANCELLED WORK
// =====================================================

export function removeAcceptedWork(
  bookingId
) {

  const bookings =
    getAcceptedBookings();


  const updated =
    bookings.filter(
      (booking) =>
        booking.bookingId !==
        bookingId
    );


  saveAcceptedBookings(
    updated
  );


  return updated;

}


// =====================================================
// CAN GO ONLINE
// =====================================================

export function canGoOnline() {

  const account =
    getTechnicianAccount();


  if (
    Number(account.commissionDue || 0)
    > COMMISSION_LIMIT
  ) {

    return {

      allowed: false,

      reason:
        "You cannot go online because your commission due is above ₹500.",

    };

  }


  const suspension =
    isTechnicianSuspended();


  if (suspension.suspended) {

    return {

      allowed: false,

      reason:
        `You are suspended until ${suspension.untilText}.`,

    };

  }


  return {

    allowed: true,

    reason: "",

  };

}


// =====================================================
// SET ONLINE STATUS
// =====================================================

export function setTechnicianOnline(
  online
) {

  if (online) {

    const result =
      canGoOnline();


    if (!result.allowed) {

      return {

        success: false,

        reason:
          result.reason,

      };

    }

  }


  const account =
    getTechnicianAccount();


  account.online =
    Boolean(online);


  saveTechnicianAccount(
    account
  );


  return {

    success: true,

    online:
      account.online,

  };

}


// =====================================================
// CAN START / CONTINUE WORK
// =====================================================

export function canStartWork() {

  const account =
    getTechnicianAccount();


  if (
    Number(account.commissionDue || 0)
    > COMMISSION_LIMIT
  ) {

    return {

      allowed: false,

      reason:
        "Service cannot be started because the technician's commission due is above ₹500.",

    };

  }


  const suspension =
    isTechnicianSuspended();


  if (suspension.suspended) {

    return {

      allowed: false,

      reason:
        `Service cannot continue during suspension until ${suspension.untilText}.`,

    };

  }


  return {

    allowed: true,

    reason: "",

  };

}


// =====================================================
// PAY COMMISSION
// =====================================================

export function payCommission(
  amount
) {

  const account =
    getTechnicianAccount();


  const payment =
    Number(amount) || 0;


  if (
    payment <= 0
  ) {

    return {

      success: false,

      reason:
        "Enter a valid commission payment amount.",

    };

  }


  const currentDue =
    Number(
      account.commissionDue || 0
    );


  if (
    payment > currentDue
  ) {

    return {

      success: false,

      reason:
        "Payment cannot be greater than the commission due.",

    };

  }


  const remaining =
    currentDue -
    payment;


  const updatedAccount = {

    ...account,

    commissionDue:
      remaining,

    totalCommissionPaid:
      Number(
        account.totalCommissionPaid || 0
      ) + payment,

    isBlocked:
      remaining >
      COMMISSION_LIMIT,

    updatedAt:
      new Date().toISOString(),

  };


  saveTechnicianAccount(
    updatedAccount
  );


  return {

    success: true,

    amountPaid:
      payment,

    commissionDue:
      remaining,

    isBlocked:
      updatedAccount.isBlocked,

  };

}


// =====================================================
// SUSPEND TECHNICIAN
// =====================================================

export function suspendTechnician(
  reason = "Service incident"
) {

  const suspendedUntil =
    Date.now() +
    SUSPENSION_DURATION;


  const suspension = {

    suspended: true,

    reason,

    suspendedAt:
      new Date().toISOString(),

    suspendedUntil,

  };


  localStorage.setItem(
    SUSPENSION_KEY,
    JSON.stringify(
      suspension
    )
  );


  // Force offline.

  const account =
    getTechnicianAccount();


  account.online =
    false;


  saveTechnicianAccount(
    account
  );


  return suspension;

}


// =====================================================
// CHECK SUSPENSION
// =====================================================

export function isTechnicianSuspended() {

  const saved =
    localStorage.getItem(
      SUSPENSION_KEY
    );


  if (!saved) {

    return {

      suspended: false,

    };

  }


  try {

    const suspension =
      JSON.parse(saved);


    if (
      Date.now() >=
      Number(
        suspension.suspendedUntil
      )
    ) {

      localStorage.removeItem(
        SUSPENSION_KEY
      );


      return {

        suspended: false,

      };

    }


    const remaining =
      Number(
        suspension.suspendedUntil
      ) - Date.now();


    const minutes =
      Math.ceil(
        remaining / 60000
      );


    const until =
      new Date(
        suspension.suspendedUntil
      );


    return {

      suspended: true,

      reason:
        suspension.reason,

      suspendedUntil:
        suspension.suspendedUntil,

      remainingMinutes:
        minutes,

      untilText:
        until.toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),

    };

  } catch {

    localStorage.removeItem(
      SUSPENSION_KEY
    );


    return {

      suspended: false,

    };

  }

}


// =====================================================
// COMPLETE ACCOUNT STATUS
// =====================================================

export function getTechnicianWorkStatus() {

  const account =
    getTechnicianAccount();


  const suspension =
    isTechnicianSuspended();


  const commissionBlocked =
    Number(
      account.commissionDue || 0
    ) > COMMISSION_LIMIT;


  return {

    online:
      Boolean(account.online),

    commissionDue:
      Number(
        account.commissionDue || 0
      ),

    commissionBlocked,

    suspended:
      suspension.suspended,

    suspension,

    acceptedWorks:
      getAcceptedBookings(),

    canGoOnline:
      !commissionBlocked &&
      !suspension.suspended,

  };

}