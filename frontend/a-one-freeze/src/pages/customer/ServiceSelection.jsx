import { useNavigate } from "react-router-dom";

import {
  Snowflake,
  Wind,
  Refrigerator,
  WashingMachine,
  Flame,
  ArrowRight,
} from "lucide-react";

import "./ServiceSelection.css";


const appliances = [
  {
    id: "air-conditioner",
    name: "Air Conditioner",
    description: "Installation, service and repair",
    icon: Snowflake,
  },

  {
    id: "air-cooler",
    name: "Air Cooler",
    description: "Cooling service and maintenance",
    icon: Wind,
  },

  {
    id: "refrigerator",
    name: "Refrigerator",
    description: "Repair and regular maintenance",
    icon: Refrigerator,
  },

  {
    id: "washing-machine",
    name: "Washing Machine",
    description: "Complete appliance service",
    icon: WashingMachine,
  },

  {
    id: "water-heater",
    name: "Water Heater",
    description: "Installation and repair",
    icon: Flame,
  },
];


function ServiceSelection() {

  const navigate = useNavigate();


  const handleApplianceClick = (appliance) => {

    navigate(
      `/customer/services/${appliance.id}`
    );

  };


  return (

    <div className="service-selection-page">


      {/* HEADER */}

      <div className="service-selection-header">

        <span>
          BOOK A SERVICE
        </span>

        <h1>
          What appliance needs attention?
        </h1>

        <p>
          Select your appliance to view available
          services and prices.
        </p>

      </div>


      {/* APPLIANCE CARDS */}

      <div className="service-selection-grid">

        {appliances.map((appliance) => {

          const Icon = appliance.icon;

          return (

            <div
              className="service-selection-card"
              key={appliance.id}
              onClick={() =>
                handleApplianceClick(appliance)
              }
            >

              <div className="service-selection-icon">

                <Icon size={32} />

              </div>


              <h2>
                {appliance.name}
              </h2>


              <p>
                {appliance.description}
              </p>


              <button>

                View Services

                <ArrowRight size={17} />

              </button>

            </div>

          );

        })}

      </div>

    </div>

  );
}


export default ServiceSelection;