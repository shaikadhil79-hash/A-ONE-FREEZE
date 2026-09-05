// Unified Reactive Data Store for A-ONE FREEZE Air Conditioner Platform
// Synchronizes Customer, Technician, and Admin portals across tabs and sessions.

const STORAGE_KEYS = {
  BOOKINGS: "aone_bookings",
  TECHNICIANS: "aone_technicians",
  SERVICES: "aone_services",
  REVIEWS: "aone_reviews",
  CURRENT_CUSTOMER: "customerPhone",
  CURRENT_TECH: "technicianId",
};

// Seed AC Services Catalog
export const DEFAULT_AC_SERVICES = [
  {
    id: "ac-jet-wash",
    applianceId: "air-conditioner",
    name: "AC Jet Foam Wash & Deep Cleaning",
    category: "Cleaning & Maintenance",
    price: 699,
    originalPrice: 899,
    duration: "45 mins",
    warranty: "30-Day Cooling Guarantee",
    rating: 4.9,
    popular: true,
    description: "High-pressure jet wash with antibacterial foam for indoor cooling coil, blower, drain tray, and outdoor condenser.",
    features: [
      "Deep indoor cooling coil jet wash",
      "Outdoor condenser fin cleaning",
      "Drain pipe & tray blockage flush",
      "Air filter sanitization & deodorizing",
      "Post-service cooling & ampere check",
    ],
  },
  {
    id: "ac-gas-refill",
    applianceId: "air-conditioner",
    name: "AC Gas Leakage Diagnosis & Refill",
    category: "Cooling & Gas",
    price: 1899,
    originalPrice: 2400,
    duration: "60 mins",
    warranty: "60-Day Leakage Guarantee",
    rating: 4.8,
    popular: true,
    description: "Nitrogen pressure leak testing, brazing joint repair, vacuum pump moisture evacuation, and exact refrigerant refill (R32 / R410A / R22).",
    features: [
      "Precision digital pressure leak test",
      "Joint brazing & valve flare inspection",
      "High vacuum moisture evacuation",
      "Accurate refrigerant weigh-in charge",
      "Subcooling & superheat temperature test",
    ],
  },
  {
    id: "ac-repair",
    applianceId: "air-conditioner",
    name: "AC Repair & PCB / Electrical Troubleshooting",
    category: "Repairs",
    price: 499,
    originalPrice: 650,
    duration: "45 mins",
    warranty: "30-Day Service Guarantee",
    rating: 4.8,
    popular: false,
    description: "Comprehensive diagnosis for tripping power, noise, ice formation, water leakage inside room, or cooling drop.",
    features: [
      "Multi-point electrical & sensor check",
      "Run capacitor & motor inspection",
      "Inverter PCB diagnostics",
      "Internal water leakage rectification",
      "Clear upfront quotation before repair",
    ],
  },
  {
    id: "ac-installation",
    applianceId: "air-conditioner",
    name: "Split AC Complete Installation",
    category: "Installation",
    price: 1199,
    originalPrice: 1500,
    duration: "90 mins",
    warranty: "30-Day Installation Guarantee",
    rating: 4.9,
    popular: true,
    description: "Mounting of indoor unit with spirit-level precision, outdoor heavy-duty bracket fixing, copper flaring, vacuuming & commissioning.",
    features: [
      "Spirit-level balanced indoor mounting",
      "Heavy-gauge outdoor stand installation",
      "Copper pipe flaring & insulation wrap",
      "Vacuum leak verification",
      "Air flow & cooling performance test",
    ],
  },
  {
    id: "ac-uninstallation",
    applianceId: "air-conditioner",
    name: "Split / Window AC Safe Uninstallation",
    category: "Installation",
    price: 649,
    originalPrice: 850,
    duration: "40 mins",
    warranty: "Safe Gas Lock Guarantee",
    rating: 4.7,
    popular: false,
    description: "Safe gas lockdown into the outdoor compressor, careful disassembly of indoor/outdoor units, and copper pipe preservation.",
    features: [
      "Gas pump-down safely stored in condenser",
      "Careful unmounting of both units",
      "Copper tube end sealing to avoid moisture",
      "Safe pack-up of brackets and hardware",
    ],
  },
  {
    id: "ac-amc",
    applianceId: "air-conditioner",
    name: "Annual AC Care Plan (AMC)",
    category: "Maintenance Plans",
    price: 2499,
    originalPrice: 3500,
    duration: "1 Year Plan",
    warranty: "365-Day Priority Support",
    rating: 5.0,
    popular: false,
    description: "Comprehensive yearly protection plan for peaceful cooling throughout the year with priority technician dispatch.",
    features: [
      "2x Free Jet Foam wet deep cleanings",
      "1x Dry inspection before summer",
      "Unlimited breakdown emergency visits",
      "15% flat discount on all spare parts",
      "Dedicated senior AC technician assigned",
    ],
  },
];

// Seed Technicians Directory
export const DEFAULT_TECHNICIANS = [
  {
    id: "TECH-001",
    name: "Ravi Kumar",
    phone: "9876543210",
    email: "ravi.kumar@aonefreeze.com",
    rating: 4.9,
    reviewsCount: 164,
    experience: "6 yrs",
    jobsDone: 420,
    isOnline: true,
    location: "Anna Nagar, Chennai",
    skills: ["Split AC", "Inverter AC", "Gas Refill", "Jet Wash"],
    avatar: "RK",
    earningsToday: 1840,
    totalEarnings: 48920,
    activeBookingId: null,
  },
  {
    id: "TECH-002",
    name: "Arun Prakash",
    phone: "9876543211",
    email: "arun.prakash@aonefreeze.com",
    rating: 4.8,
    reviewsCount: 112,
    experience: "4 yrs",
    jobsDone: 280,
    isOnline: true,
    location: "T. Nagar, Chennai",
    skills: ["AC Installation", "PCB Repair", "Water Leakage"],
    avatar: "AP",
    earningsToday: 950,
    totalEarnings: 32400,
    activeBookingId: null,
  },
  {
    id: "TECH-003",
    name: "Vijay Anand",
    phone: "9876543212",
    email: "vijay.anand@aonefreeze.com",
    rating: 4.7,
    reviewsCount: 98,
    experience: "5 yrs",
    jobsDone: 340,
    isOnline: true,
    location: "Velachery, Chennai",
    skills: ["Daikin", "Voltas", "Cassette AC", "Jet Wash"],
    avatar: "VA",
    earningsToday: 0,
    totalEarnings: 38750,
    activeBookingId: null,
  },
  {
    id: "TECH-004",
    name: "Mohammed Faisal",
    phone: "9876543213",
    email: "faisal@aonefreeze.com",
    rating: 4.9,
    reviewsCount: 189,
    experience: "7 yrs",
    jobsDone: 512,
    isOnline: false,
    location: "Guindy, Chennai",
    skills: ["Ductable AC", "Gas Leakage", "Compressor Replacement"],
    avatar: "MF",
    earningsToday: 0,
    totalEarnings: 59300,
    activeBookingId: null,
  },
];

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateBookingCode() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `AOF-2026-${num}`;
}

const INITIAL_BOOKINGS = [
  {
    id: "AOF-2026-00124",
    customerId: "CUS-001",
    customerName: "Adhil Shaik",
    customerPhone: "9876543201",
    serviceId: "ac-jet-wash",
    serviceName: "AC Jet Foam Wash & Deep Cleaning",
    appliance: "Air Conditioner",
    acType: "Split Inverter AC",
    acTonnage: "1.5 Ton",
    acBrand: "Daikin",
    address: "Flat 4B, Emerald Heights, 2nd Avenue, Anna Nagar",
    city: "Chennai",
    pincode: "600040",
    scheduledDate: "Today",
    scheduledTime: "11:00 AM",
    technicianId: "TECH-001",
    technicianName: "Ravi Kumar",
    technicianPhone: "9876543210",
    technicianRating: 4.9,
    status: "IN_PROGRESS",
    amount: 699,
    extraAmount: 0,
    totalAmount: 699,
    paymentStatus: "PENDING",
    paymentMethod: "UPI",
    startOtp: "482910",
    endOtp: "731940",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    startedAt: new Date(Date.now() - 1800000).toISOString(),
    completedAt: null,
    notes: "AC cooling has dropped; water leaking slightly from indoor corner.",
    checklist: [
      { task: "Indoor unit foam wash & jet clean", done: true },
      { task: "Drain pipe blockage cleared", done: true },
      { task: "Outdoor condenser fin wash", done: false },
      { task: "Ampere & temperature performance check", done: false },
    ],
  },
  {
    id: "AOF-2026-00125",
    customerId: "CUS-002",
    customerName: "Priya Sundaram",
    customerPhone: "9876543202",
    serviceId: "ac-gas-refill",
    serviceName: "AC Gas Leakage Diagnosis & Refill",
    appliance: "Air Conditioner",
    acType: "Split AC",
    acTonnage: "1.0 Ton",
    acBrand: "Voltas",
    address: "32 Raman Street, Near Panagal Park, T. Nagar",
    city: "Chennai",
    pincode: "600017",
    scheduledDate: "Today",
    scheduledTime: "02:30 PM",
    technicianId: "TECH-002",
    technicianName: "Arun Prakash",
    technicianPhone: "9876543211",
    technicianRating: 4.8,
    status: "ON_THE_WAY",
    amount: 1899,
    extraAmount: 0,
    totalAmount: 1899,
    paymentStatus: "PENDING",
    paymentMethod: "Cash",
    startOtp: "591024",
    endOtp: "830192",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    startedAt: null,
    completedAt: null,
    notes: "Fan runs but zero cooling. Suspected refrigerant leak.",
    checklist: [
      { task: "Nitrogen leak pressure testing", done: false },
      { task: "Flare nut brazing & sealing", done: false },
      { task: "Vacuum moisture evacuation", done: false },
      { task: "R32 Gas refill by digital scale", done: false },
    ],
  },
  {
    id: "AOF-2026-00122",
    customerId: "CUS-003",
    customerName: "Karthik Subramaniam",
    customerPhone: "9876543203",
    serviceId: "ac-installation",
    serviceName: "Split AC Complete Installation",
    appliance: "Air Conditioner",
    acType: "Split Inverter AC",
    acTonnage: "2.0 Ton",
    acBrand: "LG",
    address: "15 Gandhi Road, Velachery",
    city: "Chennai",
    pincode: "600042",
    scheduledDate: "Yesterday",
    scheduledTime: "04:00 PM",
    technicianId: "TECH-001",
    technicianName: "Ravi Kumar",
    technicianPhone: "9876543210",
    technicianRating: 4.9,
    status: "COMPLETED",
    amount: 1199,
    extraAmount: 250,
    totalAmount: 1449,
    paymentStatus: "PAID",
    paymentMethod: "UPI",
    startOtp: "112233",
    endOtp: "445566",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    startedAt: new Date(Date.now() - 86400000 + 1800000).toISOString(),
    completedAt: new Date(Date.now() - 86400000 + 7200000).toISOString(),
    notes: "Brand new AC box install. Extra 2m copper pipe added.",
    review: {
      rating: 5,
      comment: "Ravi was exceptionally punctual and did a clean installation with zero mess. Very polite!",
      date: "Yesterday",
    },
  },
];

class ServiceStore {
  constructor() {
    this.listeners = new Set();
    this.init();

    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (Object.values(STORAGE_KEYS).includes(e.key)) {
          this.notify();
        }
      });
    }
  }

  init() {
    if (typeof window === "undefined") return;

    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_AC_SERVICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TECHNICIANS)) {
      localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(DEFAULT_TECHNICIANS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        console.error("Store listener error:", err);
      }
    }
  }

  getServices() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return data ? JSON.parse(data) : DEFAULT_AC_SERVICES;
    } catch {
      return DEFAULT_AC_SERVICES;
    }
  }

  getServiceById(id) {
    return this.getServices().find((s) => s.id === id);
  }

  getTechnicians() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TECHNICIANS);
      return data ? JSON.parse(data) : DEFAULT_TECHNICIANS;
    } catch {
      return DEFAULT_TECHNICIANS;
    }
  }

  getTechnicianById(id) {
    return this.getTechnicians().find((t) => t.id === id);
  }

  getBookings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  }

  getBookingById(id) {
    return this.getBookings().find((b) => b.id === id);
  }

  getCustomerBookings(phone) {
    const all = this.getBookings();
    if (!phone) return all;
    return all.filter((b) => b.customerPhone?.replace(/\D/g, "") === phone.replace(/\D/g, ""));
  }

  getTechnicianBookings(techId) {
    const all = this.getBookings();
    return all.filter((b) => b.technicianId === techId);
  }

  getAvailableBookings() {
    const all = this.getBookings();
    return all.filter((b) => b.status === "PENDING" || !b.technicianId);
  }

  createBooking({
    serviceId,
    serviceName,
    appliance = "Air Conditioner",
    acType = "Split Inverter AC",
    acTonnage = "1.5 Ton",
    acBrand = "General AC",
    customerName = "Customer",
    customerPhone = "9876543201",
    address = "Main Street, Chennai",
    city = "Chennai",
    pincode = "600001",
    scheduledDate = "Today",
    scheduledTime = "Flexible",
    amount = 699,
    notes = "",
    preferredTechId = null,
  }) {
    const bookings = this.getBookings();
    const technicians = this.getTechnicians();

    let assignedTech = null;
    if (preferredTechId) {
      assignedTech = technicians.find((t) => t.id === preferredTechId);
    }

    const startOtp = generateOtp();
    let endOtp = generateOtp();
    while (endOtp === startOtp) {
      endOtp = generateOtp();
    }

    const newBooking = {
      id: generateBookingCode(),
      customerId: "CUS-" + Date.now().toString().slice(-4),
      customerName,
      customerPhone,
      serviceId,
      serviceName,
      appliance,
      acType,
      acTonnage,
      acBrand,
      address,
      city,
      pincode,
      scheduledDate,
      scheduledTime,
      technicianId: assignedTech ? assignedTech.id : null,
      technicianName: assignedTech ? assignedTech.name : "To Be Assigned",
      technicianPhone: assignedTech ? assignedTech.phone : "",
      technicianRating: assignedTech ? assignedTech.rating : 4.8,
      status: assignedTech ? "ASSIGNED" : "PENDING",
      amount: Number.isFinite(Number(amount)) ? Number(amount) : 699,
      extraAmount: 0,
      parts: [],
      totalAmount: Number.isFinite(Number(amount)) ? Number(amount) : 699,
      paymentStatus: "PENDING",
      paymentMethod: "UPI",
      startOtp,
      endOtp,
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      notes,
      checklist: [
        { task: "Initial AC cooling & power test", done: false },
        { task: "Inspection of coils, blower & filters", done: false },
        { task: "Execute core service package", done: false },
        { task: "Final airflow & thermostat test", done: false },
      ],
    };

    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    localStorage.setItem("activeBookingId", newBooking.id);
    localStorage.setItem("serviceStartOtp", startOtp);
    localStorage.setItem("serviceEndOtp", endOtp);

    this.notify();
    return newBooking;
  }

  acceptBooking(bookingId, techId) {
    const bookings = this.getBookings();
    const tech = this.getTechnicianById(techId) || this.getTechnicians()[0];
    const index = bookings.findIndex((b) => b.id === bookingId);

    if (index === -1) return null;

    bookings[index] = {
      ...bookings[index],
      technicianId: tech.id,
      technicianName: tech.name,
      technicianPhone: tech.phone,
      technicianRating: tech.rating,
      status: "ASSIGNED",
    };

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    this.notify();
    return bookings[index];
  }

  technicianStartJourney(bookingId) {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    bookings[index] = {
      ...bookings[index],
      status: "ON_THE_WAY",
    };

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    this.notify();
    return bookings[index];
  }

  technicianArrive(bookingId) {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    bookings[index] = {
      ...bookings[index],
      status: "ARRIVED",
    };

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    this.notify();
    return bookings[index];
  }

  verifyStartOtp(bookingId, inputOtp) {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error("Booking not found");

    const booking = bookings[index];
    if (booking.startOtp.trim() !== String(inputOtp).trim()) {
      throw new Error("Invalid Start OTP. Please ask the customer for the correct 6-digit code.");
    }

    bookings[index] = {
      ...booking,
      status: "IN_PROGRESS",
      startedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    localStorage.setItem("serviceReadyForCompletion", "true");
    this.notify();
    return bookings[index];
  }

  updateJobChecklist(bookingId, taskIndex, isDone) {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    const checklist = [...(bookings[index].checklist || [])];
    if (checklist[taskIndex]) {
      checklist[taskIndex].done = isDone;
    }

    bookings[index].checklist = checklist;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    this.notify();
    return bookings[index];
  }

  addExtraCharge(bookingId, description, amount) {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    const price = Number(amount);
    if (!Number.isFinite(price) || price < 0) {
      throw new Error("Part price must be a valid non-negative number.");
    }

    const currentParts = Array.isArray(bookings[index].parts)
      ? bookings[index].parts
      : [];

    const newPart = {
      id: `part-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(description || "Additional material").trim(),
      price: Math.round(price * 100) / 100,
    };

    const updatedParts = [...currentParts, newPart];
    const partsTotal = updatedParts.reduce(
      (sum, part) => sum + Number(part.price || 0),
      0
    );

    const baseAmount = Number(bookings[index].amount || 0);

    bookings[index] = {
      ...bookings[index],
      parts: updatedParts,
      extraAmount: partsTotal,
      totalAmount: baseAmount + partsTotal,
    };

    localStorage.setItem(
      STORAGE_KEYS.BOOKINGS,
      JSON.stringify(bookings)
    );
    this.notify();
    return bookings[index];
  }

  setBookingParts(bookingId, parts) {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    const cleanParts = Array.isArray(parts)
      ? parts.map((part, index) => ({
          id: String(part.id || `part-${Date.now()}-${index}`),
          name: String(part.name || "Material").trim(),
          price: Math.max(0, Number(part.price || part.amount || 0)),
        }))
      : [];

    const partsTotal = cleanParts.reduce(
      (sum, part) => sum + Number(part.price || 0),
      0
    );

    const baseAmount = Number(bookings[index].amount || 0);

    bookings[index] = {
      ...bookings[index],
      parts: cleanParts,
      extraAmount: partsTotal,
      totalAmount: baseAmount + partsTotal,
    };

    localStorage.setItem(
      STORAGE_KEYS.BOOKINGS,
      JSON.stringify(bookings)
    );
    this.notify();
    return bookings[index];
  }

  verifyEndOtp(bookingId, inputOtp) {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error("Booking not found");

    const booking = bookings[index];
    if (booking.endOtp.trim() !== String(inputOtp).trim()) {
      throw new Error("Invalid End OTP. Please check the completion code with the customer.");
    }

    bookings[index] = {
      ...booking,
      status: "COMPLETED",
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    this.notify();
    return bookings[index];
  }

  recordPayment(bookingId, method = "UPI") {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    const booking = bookings[index];

    // Payment is idempotent: never award technician earnings twice.
    if (booking.paymentStatus === "PAID") {
      return booking;
    }

    const paidAmount = Number(booking.totalAmount || booking.amount || 0);

    bookings[index] = {
      ...booking,
      paymentStatus: "PAID",
      paymentMethod: method,
    };

    if (booking.technicianId) {
      const technicians = this.getTechnicians();
      const techIndex = technicians.findIndex(
        (t) => t.id === booking.technicianId
      );

      if (techIndex !== -1) {
        const share = Math.round(paidAmount * 0.8);
        technicians[techIndex].earningsToday =
          (technicians[techIndex].earningsToday || 0) + share;
        technicians[techIndex].totalEarnings =
          (technicians[techIndex].totalEarnings || 0) + share;
        technicians[techIndex].jobsDone =
          (technicians[techIndex].jobsDone || 0) + 1;

        localStorage.setItem(
          STORAGE_KEYS.TECHNICIANS,
          JSON.stringify(technicians)
        );
      }
    }

    localStorage.setItem(
      STORAGE_KEYS.BOOKINGS,
      JSON.stringify(bookings)
    );
    this.notify();
    return bookings[index];
  }

  toggleTechnicianDuty(techId, isOnline) {
    const technicians = this.getTechnicians();
    const index = technicians.findIndex((t) => t.id === techId);
    if (index !== -1) {
      technicians[index].isOnline = isOnline;
      localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(technicians));
      localStorage.setItem("technicianOnline", String(isOnline));
      this.notify();
    }
  }

  assignBooking(bookingId, techId) {
    const bookings = this.getBookings();
    const technicians = this.getTechnicians();
    const tech = technicians.find((t) => t.id === techId);
    const bIndex = bookings.findIndex((b) => b.id === bookingId);

    if (bIndex === -1 || !tech) return null;

    bookings[bIndex] = {
      ...bookings[bIndex],
      technicianId: tech.id,
      technicianName: tech.name,
      technicianPhone: tech.phone,
      technicianRating: tech.rating,
      status: "ASSIGNED",
    };

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    this.notify();
    return bookings[bIndex];
  }

  updateService(serviceData) {
    const services = this.getServices();
    const index = services.findIndex((s) => s.id === serviceData.id);

    if (index !== -1) {
      services[index] = { ...services[index], ...serviceData };
    } else {
      services.push({
        id: "ac-" + Date.now(),
        applianceId: "air-conditioner",
        ...serviceData,
      });
    }

    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    this.notify();
  }

  submitReview(bookingId, { rating, comment, customerName }) {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) return null;

    const reviewObj = {
      rating: Number(rating) || 5,
      comment,
      customerName: customerName || bookings[index].customerName,
      date: "Just now",
    };

    bookings[index].review = reviewObj;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    this.notify();
    return reviewObj;
  }

  getDashboardStats() {
    const bookings = this.getBookings();
    const technicians = this.getTechnicians();

    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === "PAID" || b.status === "COMPLETED")
      .reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0);

    const activeBookings = bookings.filter((b) =>
      ["ASSIGNED", "ON_THE_WAY", "ARRIVED", "IN_PROGRESS"].includes(b.status)
    ).length;

    const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
    const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length;
    const onlineTechnicians = technicians.filter((t) => t.isOnline).length;

    return {
      totalBookings: bookings.length,
      activeBookings,
      pendingBookings,
      completedBookings,
      totalRevenue,
      onlineTechnicians,
      totalTechnicians: technicians.length,
    };
  }
}

export const serviceStore = new ServiceStore();
export default serviceStore;
