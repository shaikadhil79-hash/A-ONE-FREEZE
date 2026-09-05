import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Snowflake,
  Wind,
  Refrigerator,
  WashingMachine,
  Flame,
  Wrench,
  ShieldCheck,
} from "lucide-react";

import "./ServiceDetails.css";


const services = {

  "air-conditioner": {
    name: "Air Conditioner",
    description:
      "Professional AC installation, repair and maintenance services.",

    icon: Snowflake,

    services: [
      {
        name: "AC Installation",
        description:
          "Professional installation and setup of your AC.",
        price: 999,
      },
      {
        name: "AC General Service",
        description:
          "Complete cleaning, inspection and maintenance.",
        price: 599,
      },
      {
        name: "AC Gas Refill",
        description:
          "Gas level checking and refrigerant refill.",
        price: 899,
      },
      {
        name: "AC Repair",
        description:
          "Diagnosis and repair of AC cooling and electrical issues.",
        price: 499,
      },
    ],
  },


  "air-cooler": {
    name: "Air Cooler",
    description:
      "Professional cooling system service and maintenance.",

    icon: Wind,

    services: [
      {
        name: "Cooler General Service",
        description:
          "Complete cleaning and maintenance.",
        price: 399,
      },
      {
        name: "Cooler Repair",
        description:
          "Motor, pump and electrical repair.",
        price: 499,
      },
      {
        name: "Cooler Motor Replacement",
        description:
          "Professional motor replacement.",
        price: 799,
      },
    ],
  },


  refrigerator: {
    name: "Refrigerator",
    description:
      "Reliable refrigerator repair and maintenance.",

    icon: Refrigerator,

    services: [
      {
        name: "Refrigerator General Service",
        description:
          "Complete inspection and cleaning.",
        price: 499,
      },
      {
        name: "Refrigerator Repair",
        description:
          "Diagnosis and repair of refrigerator issues.",
        price: 599,
      },
      {
        name: "Refrigerator Gas Refill",
        description:
          "Gas checking and refill.",
        price: 999,
      },
    ],
  },


  "washing-machine": {
    name: "Washing Machine",
    description:
      "Complete washing machine repair and maintenance.",

    icon: WashingMachine,

    services: [
      {
        name: "Washing Machine Service",
        description:
          "Complete inspection and maintenance.",
        price: 499,
      },
      {
        name: "Washing Machine Repair",
        description:
          "Professional repair service.",
        price: 599,
      },
      {
        name: "Washing Machine Installation",
        description:
          "Professional installation service.",
        price: 699,
      },
    ],
  },


  "water-heater": {
    name: "Water Heater",
    description:
      "Installation, maintenance and repair for water heaters.",

    icon: Flame,

    services: [
      {
        name: "Water Heater Installation",
        description:
          "Professional geyser installation.",
        price: 799,
      },
      {
        name: "Water Heater Service",
        description:
          "Complete inspection and maintenance.",
        price: 499,
      },
      {
        name: "Water Heater Repair",
        description:
          "Heating and electrical repair.",
        price: 599,
      },
    ],
  },


  "other-services": {
    name: "Other Services",
    description:
      "Professional support for household appliances.",

    icon: Wrench,

    services: [
      {
        name: "Appliance Inspection",
        description:
          "Professional appliance inspection.",
        price: 299,
      },
      {
        name: "General Appliance Repair",
        description:
          "Diagnosis and repair for appliances.",
        price: 499,
      },
    ],
  },

};


function ServiceDetails() {

  const navigate = useNavigate();

  const { serviceId } = useParams();


  const service =
    services[serviceId];


  if (!service) {

    return (

      <div className="service-not-found">

        <h1>
          Service Not Found
        </h1>

        <button
          onClick={() =>
            navigate("/customer/services")
          }
        >
          Back to Services
        </button>

      </div>

    );

  }


  const Icon = service.icon;


  const handleBook = (selectedService) => {

    navigate(
      `/customer/booking?service=${encodeURIComponent(
        selectedService.name
      )}&price=${selectedService.price}`
    );

  };


  return (

    <div className="service-details-page">


      {/* HEADER */}

      <header className="service-details-header">

        <button
          className="service-back-button"
          onClick={() =>
            navigate("/customer/services")
          }
        >

          <ArrowLeft size={18} />

          Back to Services

        </button>

      </header>


      {/* HERO */}

      <section className="service-details-hero">

        <div className="service-details-icon">

          <Icon size={40} />

        </div>


        <span>
          PROFESSIONAL SERVICE
        </span>


        <h1>
          {service.name}
        </h1>


        <p>
          {service.description}
        </p>

      </section>


      {/* SERVICES */}

      <main className="service-options-container">

        <div className="service-options-heading">

          <div>

            <span>
              AVAILABLE SERVICES
            </span>

            <h2>
              Choose the service you need
            </h2>

          </div>

        </div>


        <div className="service-options-grid">

          {service.services.map(
            (item, index) => (

              <div
                className="service-option-card"
                key={item.name}
              >

                <div className="service-option-top">

                  <div className="service-number">

                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}

                  </div>

                  <div className="service-option-price">

                    <span>
                      Starting from
                    </span>

                    <strong>
                      ₹{item.price}
                    </strong>

                  </div>

                </div>


                <h3>
                  {item.name}
                </h3>


                <p>
                  {item.description}
                </p>


                <div className="service-feature">

                  <CheckCircle2 size={15} />

                  <span>
                    Professional technician
                  </span>

                </div>


                <div className="service-feature">

                  <CheckCircle2 size={15} />

                  <span>
                    Transparent pricing
                  </span>

                </div>


                <button
                  className="service-book-button"
                  onClick={() =>
                    handleBook(item)
                  }
                >

                  Book This Service

                  <ArrowRight size={17} />

                </button>

              </div>

            )
          )}

        </div>


        {/* SECURITY */}

        <div className="service-security">

          <ShieldCheck size={21} />

          <div>

            <strong>
              Secure & Transparent Service
            </strong>

            <p>
              You will receive a Start OTP before
              the technician begins the service and
              an End OTP when the service is completed.
            </p>

          </div>

        </div>

      </main>

    </div>

  );

}


export default ServiceDetails;