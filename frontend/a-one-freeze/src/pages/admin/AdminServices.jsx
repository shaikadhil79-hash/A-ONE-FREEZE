import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Snowflake,
  Search,
  Wrench,
  Plus,
  MoreVertical,
  X,
  Pencil,
  Trash2,
  Power,
  Clock3,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Settings2,
} from "lucide-react";
import serviceStore from "../../services/serviceStore";

function AdminServices() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [services, setServices] = useState([
    {
      id: "SRV-001",
      category: "Air Conditioner",
      name: "AC General Service",
      description: "Complete AC cleaning and performance check.",
      price: 499,
      duration: "60 min",
      status: "ACTIVE",
    },
    {
      id: "SRV-002",
      category: "Air Conditioner",
      name: "AC Repair",
      description: "Diagnosis and repair for AC problems.",
      price: 699,
      duration: "90 min",
      status: "ACTIVE",
    },
    {
      id: "SRV-003",
      category: "Air Conditioner",
      name: "AC Gas Filling",
      description: "Gas level check and refrigerant refill.",
      price: 1499,
      duration: "90 min",
      status: "ACTIVE",
    },
    {
      id: "SRV-004",
      category: "Air Conditioner",
      name: "AC Installation",
      description: "Professional split AC installation.",
      price: 1899,
      duration: "120 min",
      status: "ACTIVE",
    },
    {
      id: "SRV-005",
      category: "Air Cooler",
      name: "Cooler General Service",
      description: "Cleaning, motor and cooling performance check.",
      price: 399,
      duration: "60 min",
      status: "ACTIVE",
    },
    {
      id: "SRV-006",
      category: "Refrigerator",
      name: "Refrigerator Service",
      description: "Complete refrigerator inspection and service.",
      price: 599,
      duration: "60 min",
      status: "ACTIVE",
    },
    {
      id: "SRV-007",
      category: "Refrigerator",
      name: "Refrigerator Repair",
      description: "Diagnosis and repair of refrigerator faults.",
      price: 799,
      duration: "90 min",
      status: "ACTIVE",
    },
    {
      id: "SRV-008",
      category: "Washing Machine",
      name: "Washing Machine Service",
      description: "Cleaning and complete machine inspection.",
      price: 499,
      duration: "60 min",
      status: "ACTIVE",
    },
    {
      id: "SRV-009",
      category: "Washing Machine",
      name: "Washing Machine Repair",
      description: "Repair for common washing machine problems.",
      price: 799,
      duration: "90 min",
      status: "ACTIVE",
    },
    {
      id: "SRV-010",
      category: "Water Heater",
      name: "Water Heater Service",
      description: "Complete geyser inspection and service.",
      price: 599,
      duration: "60 min",
      status: "ACTIVE",
    },
    {
      id: "SRV-011",
      category: "Water Heater",
      name: "Water Heater Repair",
      description: "Diagnosis and repair of water heater faults.",
      price: 899,
      duration: "90 min",
      status: "INACTIVE",
    },
  ]);

  const emptyForm = {
    category: "Air Conditioner",
    name: "",
    description: "",
    price: "",
    duration: "60 min",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const sync = () => {
      const storeAcServices = serviceStore.getServices();
      setServices((current) => {
        const acMapped = storeAcServices.map((s) => ({
          id: s.id,
          category: "Air Conditioner",
          name: s.name,
          description: s.description,
          price: s.price,
          duration: s.duration,
          status: "ACTIVE",
        }));
        const nonAc = current.filter((s) => s.category !== "Air Conditioner");
        return [...acMapped, ...nonAc];
      });
    };
    sync();
    return serviceStore.subscribe(sync);
  }, []);

  const categories = [
    "ALL",
    "Air Conditioner",
    "Air Cooler",
    "Refrigerator",
    "Washing Machine",
    "Water Heater",
  ];

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        service.name.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.id.toLowerCase().includes(query);

      const matchesFilter =
        filter === "ALL" ||
        service.category === filter;

      return matchesSearch && matchesFilter;
    });
  }, [services, search, filter]);

  const activeCount = services.filter(
    (service) => service.status === "ACTIVE"
  ).length;

  const inactiveCount = services.filter(
    (service) => service.status === "INACTIVE"
  ).length;

  const categoryCount = new Set(
    services.map((service) => service.category)
  ).size;

  const averagePrice =
    services.length > 0
      ? Math.round(
          services.reduce(
            (total, service) => total + service.price,
            0
          ) / services.length
        )
      : 0;

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setEditingId(service.id);

    setForm({
      category: service.category,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
    });

    setShowForm(true);
    setSelected(null);
  };

  const saveService = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.price ||
      Number(form.price) <= 0
    ) {
      return;
    }

    if (editingId) {
      setServices((current) =>
        current.map((service) =>
          service.id === editingId
            ? {
                ...service,
                category: form.category,
                name: form.name.trim(),
                description:
                  form.description.trim(),
                price: Number(form.price),
                duration: form.duration,
              }
            : service
        )
      );
    } else {
      const nextNumber =
        services.length + 1;

      const newService = {
        id: `SRV-${String(nextNumber).padStart(
          3,
          "0"
        )}`,
        category: form.category,
        name: form.name.trim(),
        description:
          form.description.trim(),
        price: Number(form.price),
        duration: form.duration,
        status: "ACTIVE",
      };

      setServices((current) => [
        ...current,
        newService,
      ]);
    }

    if (form.category === "Air Conditioner") {
      serviceStore.updateService({
        id: editingId || `ac-${Date.now()}`,
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        duration: form.duration,
      });
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const toggleService = (id) => {
    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? {
              ...service,
              status:
                service.status === "ACTIVE"
                  ? "INACTIVE"
                  : "ACTIVE",
            }
          : service
      )
    );

    setSelected(null);
  };

  const deleteService = (id) => {
    setServices((current) =>
      current.filter(
        (service) => service.id !== id
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
              SERVICE MANAGEMENT
            </span>

            <h1 style={pageTitle}>
              Services
            </h1>

            <p style={pageDescription}>
              Manage appliance categories, service
              prices, duration and availability.
            </p>
          </div>

          <button
            onClick={openAddForm}
            style={addButton}
          >
            <Plus size={17} />
            Add Service
          </button>
        </div>

        {/* SUMMARY */}

        <section style={summaryGrid}>
          <SummaryCard
            label="TOTAL SERVICES"
            value={services.length}
            icon={<Wrench size={19} />}
            type="blue"
          />

          <SummaryCard
            label="ACTIVE"
            value={activeCount}
            icon={<CheckCircle2 size={19} />}
            type="success"
          />

          <SummaryCard
            label="INACTIVE"
            value={inactiveCount}
            icon={<XCircle size={19} />}
            type="danger"
          />

          <SummaryCard
            label="CATEGORIES"
            value={categoryCount}
            icon={<Settings2 size={19} />}
            type="purple"
          />

          <SummaryCard
            label="AVERAGE PRICE"
            value={`₹${averagePrice}`}
            icon={<IndianRupee size={19} />}
            type="warning"
          />
        </section>

        {/* SEARCH / FILTER */}

        <section style={toolbar}>
          <div style={searchBox}>
            <Search size={18} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search service or category..."
              style={searchInput}
            />
          </div>

          <div style={filters}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setFilter(category)
                }
                style={{
                  ...filterButton,
                  ...(filter === category
                    ? activeFilter
                    : {}),
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* SERVICE TABLE */}

        <section style={tableCard}>
          <div style={tableHeader}>
            <div>
              <span style={eyebrow}>
                SERVICE DIRECTORY
              </span>

              <h2 style={tableTitle}>
                All Services
              </h2>
            </div>

            <span style={resultCount}>
              {filteredServices.length} results
            </span>
          </div>

          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th
                    style={{
                      ...th,
                      width: "22%",
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
                    CATEGORY
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "25%",
                    }}
                  >
                    DESCRIPTION
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "10%",
                    }}
                  >
                    PRICE
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "10%",
                    }}
                  >
                    DURATION
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "11%",
                    }}
                  >
                    STATUS
                  </th>

                  <th
                    style={{
                      ...th,
                      width: "5%",
                    }}
                  />
                </tr>
              </thead>

              <tbody>
                {filteredServices.map(
                  (service) => (
                    <tr key={service.id}>
                      <td style={td}>
                        <div
                          style={serviceCell}
                        >
                          <div
                            style={serviceIcon}
                          >
                            <Wrench
                              size={17}
                            />
                          </div>

                          <div
                            style={
                              serviceInfo
                            }
                          >
                            <strong
                              style={
                                serviceName
                              }
                            >
                              {service.name}
                            </strong>

                            <span
                              style={
                                serviceId
                              }
                            >
                              {service.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={td}>
                        <span
                          style={
                            categoryBadge
                          }
                        >
                          {service.category}
                        </span>
                      </td>

                      <td style={td}>
                        <span
                          style={
                            description
                          }
                        >
                          {service.description}
                        </span>
                      </td>

                      <td style={td}>
                        <strong
                          style={price}
                        >
                          ₹{service.price}
                        </strong>
                      </td>

                      <td style={td}>
                        <span
                          style={duration}
                        >
                          <Clock3
                            size={13}
                          />
                          {service.duration}
                        </span>
                      </td>

                      <td style={td}>
                        <StatusBadge
                          status={
                            service.status
                          }
                        />
                      </td>

                      <td style={td}>
                        <button
                          onClick={() =>
                            setSelected(
                              service
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

          {filteredServices.length === 0 && (
            <div style={emptyState}>
              <Wrench size={42} />

              <h3>
                No services found
              </h3>

              <p>
                Try changing your search or
                category filter.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* SERVICE DETAILS MODAL */}

      {selected && (
        <div style={modalOverlay}>
          <div style={modal}>
            <button
              onClick={() =>
                setSelected(null)
              }
              style={modalClose}
            >
              <X size={18} />
            </button>

            <div style={modalTop}>
              <div style={modalIcon}>
                <Wrench size={23} />
              </div>

              <div>
                <span style={eyebrow}>
                  SERVICE DETAILS
                </span>

                <h2 style={modalTitle}>
                  {selected.name}
                </h2>

                <p style={modalId}>
                  {selected.id}
                </p>
              </div>
            </div>

            <div style={modalStatus}>
              <StatusBadge
                status={selected.status}
              />

              <span
                style={categoryBadge}
              >
                {selected.category}
              </span>
            </div>

            <div style={detailsGrid}>
              <Detail
                label="Service Name"
                value={selected.name}
                icon={<Wrench size={16} />}
              />

              <Detail
                label="Category"
                value={selected.category}
                icon={<Settings2 size={16} />}
              />

              <Detail
                label="Price"
                value={`₹${selected.price}`}
                icon={
                  <IndianRupee size={16} />
                }
              />

              <Detail
                label="Duration"
                value={selected.duration}
                icon={<Clock3 size={16} />}
              />
            </div>

            <div style={descriptionBox}>
              <span>
                DESCRIPTION
              </span>

              <p>
                {selected.description ||
                  "No description available."}
              </p>
            </div>

            <div style={actionTitle}>
              SERVICE ACTIONS
            </div>

            <div style={actionGrid}>
              <button
                onClick={() =>
                  openEditForm(
                    selected
                  )
                }
                style={editButton}
              >
                <Pencil size={16} />
                Edit Service
              </button>

              <button
                onClick={() =>
                  toggleService(
                    selected.id
                  )
                }
                style={
                  selected.status ===
                  "ACTIVE"
                    ? disableButton
                    : activateButton
                }
              >
                <Power size={16} />

                {selected.status ===
                "ACTIVE"
                  ? "Deactivate"
                  : "Activate"}
              </button>

              <button
                onClick={() =>
                  deleteService(
                    selected.id
                  )
                }
                style={deleteButton}
              >
                <Trash2 size={16} />
                Delete Service
              </button>
            </div>

            <button
              onClick={() =>
                setSelected(null)
              }
              style={closeButton}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT FORM */}

      {showForm && (
        <div style={modalOverlay}>
          <div style={formModal}>
            <button
              onClick={() =>
                setShowForm(false)
              }
              style={modalClose}
            >
              <X size={18} />
            </button>

            <span style={eyebrow}>
              {editingId
                ? "EDIT SERVICE"
                : "NEW SERVICE"}
            </span>

            <h2 style={formTitle}>
              {editingId
                ? "Edit Service"
                : "Add Service"}
            </h2>

            <p style={formDescription}>
              Enter the service information below.
            </p>

            <form onSubmit={saveService}>
              <div style={formGrid}>
                <div style={field}>
                  <label>
                    Appliance Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        category:
                          event.target.value,
                      })
                    }
                    style={input}
                  >
                    {categories
                      .filter(
                        (item) =>
                          item !== "ALL"
                      )
                      .map((category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ))}
                  </select>
                </div>

                <div style={field}>
                  <label>
                    Service Name
                  </label>

                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name:
                          event.target.value,
                      })
                    }
                    placeholder="Example: AC Deep Cleaning"
                    style={input}
                  />
                </div>

                <div style={field}>
                  <label>
                    Price
                  </label>

                  <div
                    style={
                      inputWithIcon
                    }
                  >
                    <IndianRupee
                      size={15}
                    />

                    <input
                      type="number"
                      min="1"
                      value={form.price}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          price:
                            event.target
                              .value,
                        })
                      }
                      placeholder="499"
                      style={
                        inputInner
                      }
                    />
                  </div>
                </div>

                <div style={field}>
                  <label>
                    Duration
                  </label>

                  <select
                    value={
                      form.duration
                    }
                    onChange={(event) =>
                      setForm({
                        ...form,
                        duration:
                          event.target
                            .value,
                      })
                    }
                    style={input}
                  >
                    <option>
                      30 min
                    </option>

                    <option>
                      45 min
                    </option>

                    <option>
                      60 min
                    </option>

                    <option>
                      90 min
                    </option>

                    <option>
                      120 min
                    </option>

                    <option>
                      150 min
                    </option>
                  </select>
                </div>
              </div>

              <div style={field}>
                <label>
                  Description
                </label>

                <textarea
                  value={
                    form.description
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Describe what this service includes..."
                  style={textarea}
                  rows={4}
                />
              </div>

              <div style={formActions}>
                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  style={cancelButton}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={saveButton}
                >
                  <CheckCircle2
                    size={17}
                  />

                  {editingId
                    ? "Save Changes"
                    : "Create Service"}
                </button>
              </div>
            </form>
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

function StatusBadge({ status }) {
  const active =
    status === "ACTIVE";

  return (
    <span
      style={{
        ...statusBadge,
        background: active
          ? "#12382b"
          : "#3b2023",
        color: active
          ? "#39c98a"
          : "#ff6b6b",
      }}
    >
      {active
        ? "ACTIVE"
        : "INACTIVE"}
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

const addButton = {
  border: "1px solid #20556a",
  borderRadius: "10px",
  background: "#123f52",
  color: "#35c9f2",
  padding: "12px 17px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "7px",
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
  fontSize: "21px",
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
  borderBottom:
    "1px solid #203542",
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
  padding: "14px 15px",
  textAlign: "left",
  fontSize: "8px",
  fontWeight: "900",
  letterSpacing: "1px",
  color: "#8fa8b5",
  background: "#0d1b25",
  borderBottom:
    "1px solid #203542",
  whiteSpace: "nowrap",
};

const td = {
  padding: "14px 15px",
  textAlign: "left",
  fontSize: "11px",
  color: "#b8cbd3",
  borderBottom:
    "1px solid #1c303c",
  verticalAlign: "middle",
  overflow: "hidden",
};

const serviceCell = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  minWidth: 0,
};

const serviceIcon = {
  width: "37px",
  height: "37px",
  borderRadius: "10px",
  background: "#123f52",
  color: "#35c9f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const serviceInfo = {
  minWidth: 0,
};

const serviceName = {
  display: "block",
  color: "#e8f4f8",
  fontSize: "12px",
  fontWeight: "800",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const serviceId = {
  display: "block",
  color: "#78909c",
  fontSize: "9px",
  marginTop: "3px",
};

const categoryBadge = {
  display: "inline-block",
  padding: "6px 9px",
  borderRadius: "20px",
  background: "#173b4b",
  color: "#8fd9eb",
  fontSize: "8px",
  fontWeight: "800",
  whiteSpace: "nowrap",
};

const description = {
  display: "block",
  color: "#8fa8b5",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const price = {
  color: "#e5ad42",
  fontSize: "12px",
};

const duration = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  color: "#8fa8b5",
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
  maxWidth: "560px",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#101f2a",
  border: "1px solid #29414e",
  borderRadius: "22px",
  padding: "30px",
  position: "relative",
  boxShadow:
    "0 25px 70px rgba(0,0,0,.45)",
};

const formModal = {
  width: "100%",
  maxWidth: "650px",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#101f2a",
  border: "1px solid #29414e",
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

const modalId = {
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

const descriptionBox = {
  marginTop: "12px",
  padding: "14px",
  borderRadius: "11px",
  background: "#0d1b25",
  border: "1px solid #203542",
};

const actionTitle = {
  marginTop: "22px",
  marginBottom: "10px",
  color: "#8fa8b5",
  fontSize: "9px",
  fontWeight: "900",
  letterSpacing: "1.5px",
};

const actionGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, minmax(0, 1fr))",
  gap: "9px",
};

const editButton = {
  border: "1px solid #20556a",
  borderRadius: "10px",
  background: "#123f52",
  color: "#35c9f2",
  padding: "11px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
};

const activateButton = {
  border: "1px solid #245b45",
  borderRadius: "10px",
  background: "#12382b",
  color: "#39c98a",
  padding: "11px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
};

const disableButton = {
  border: "1px solid #604c25",
  borderRadius: "10px",
  background: "#3a2e17",
  color: "#e5ad42",
  padding: "11px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
};

const deleteButton = {
  border: "1px solid #6a3034",
  borderRadius: "10px",
  background: "#3b2023",
  color: "#ff6b6b",
  padding: "11px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
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

const formTitle = {
  margin: "7px 0 5px",
  fontSize: "25px",
  color: "#e8f4f8",
};

const formDescription = {
  margin: "0 0 20px",
  color: "#8fa8b5",
  fontSize: "12px",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "14px",
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
  marginBottom: "14px",
};

const label = {
  fontSize: "9px",
  color: "#8fa8b5",
  fontWeight: "900",
  letterSpacing: "1px",
};

const input = {
  width: "100%",
  height: "43px",
  boxSizing: "border-box",
  border: "1px solid #29414e",
  borderRadius: "9px",
  outline: "none",
  background: "#0d1b25",
  color: "#dcebf0",
  padding: "0 12px",
  fontSize: "12px",
};

const inputWithIcon = {
  height: "43px",
  boxSizing: "border-box",
  border: "1px solid #29414e",
  borderRadius: "9px",
  background: "#0d1b25",
  color: "#35c9f2",
  padding: "0 12px",
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const inputInner = {
  width: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#dcebf0",
  fontSize: "12px",
};

const textarea = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #29414e",
  borderRadius: "9px",
  outline: "none",
  background: "#0d1b25",
  color: "#dcebf0",
  padding: "12px",
  fontSize: "12px",
  resize: "vertical",
  fontFamily: "Arial, sans-serif",
};

const formActions = {
  display: "flex",
  gap: "10px",
  marginTop: "8px",
};

const cancelButton = {
  flex: 1,
  border: "1px solid #29414e",
  borderRadius: "10px",
  background: "#142631",
  color: "#8fa8b5",
  padding: "12px",
  fontWeight: "700",
  cursor: "pointer",
};

const saveButton = {
  flex: 1,
  border: "1px solid #20556a",
  borderRadius: "10px",
  background: "#123f52",
  color: "#35c9f2",
  padding: "12px",
  fontWeight: "800",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
};

export default AdminServices;