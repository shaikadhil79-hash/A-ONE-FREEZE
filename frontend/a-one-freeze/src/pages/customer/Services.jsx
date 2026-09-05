import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Snowflake,
  Wind,
  Refrigerator,
  WashingMachine,
  Flame,
  Wrench,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import "./Services.css";


const services = [
  {
    id: "air-conditioner",
    name: "Air Conditioner",
    description: "Installation, service and repair",
    icon: Snowflake,

    serviceOptions: [
      {
        name: "AC Installation",
        description: "Professional AC installation and setup.",
        price: 999,
      },
      {
        name: "AC General Service",
        description: "Complete cleaning and preventive maintenance.",
        price: 599,
      },
      {
        name: "AC Gas Refill",
        description: "Gas level checking and refrigerant refill.",
        price: 899,
      },
      {
        name: "AC Repair",
        description: "Diagnosis and repair of AC problems.",
        price: 499,
      },
    ],
  },

  {
    id: "air-cooler",
    name: "Air Cooler",
    description: "Cooling service and maintenance",
    icon: Wind,

    serviceOptions: [
      {
        name: "Cooler General Service",
        description: "Complete cleaning and maintenance.",
        price: 399,
      },
      {
        name: "Cooler Repair",
        description: "Motor, pump and electrical repair.",
        price: 499,
      },
      {
        name: "Cooler Motor Replacement",
        description: "Professional motor replacement.",
        price: 799,
      },
    ],
  },

  {
    id: "refrigerator",
    name: "Refrigerator",
    description: "Repair and regular maintenance",
    icon: Refrigerator,

    serviceOptions: [
      {
        name: "Refrigerator General Service",
        description: "Complete inspection and cleaning.",
        price: 499,
      },
      {
        name: "Refrigerator Repair",
        description: "Diagnosis and repair of refrigerator problems.",
        price: 599,
      },
      {
        name: "Refrigerator Gas Refill",
        description: "Gas checking and refrigerant refill.",
        price: 999,
      },
    ],
  },

  {
    id: "washing-machine",
    name: "Washing Machine",
    description: "Complete appliance service",
    icon: WashingMachine,

    serviceOptions: [
      {
        name: "Washing Machine Service",
        description: "Complete inspection and maintenance.",
        price: 499,
      },
      {
        name: "Washing Machine Repair",
        description: "Professional repair for machine problems.",
        price: 599,
      },
      {
        name: "Washing Machine Installation",
        description: "Professional installation service.",
        price: 699,
      },
    ],
  },

  {
    id: "water-heater",
    name: "Water Heater",
    description: "Installation and repair",
    icon: Flame,

    serviceOptions: [
      {
        name: "Water Heater Installation",
        description: "Professional geyser installation.",
        price: 799,
      },
      {
        name: "Water Heater Service",
        description: "Complete inspection and maintenance.",
        price: 499,
      },
      {
        name: "Water Heater Repair",
        description: "Heating and electrical repair.",
        price: 599,
      },
    ],
  },

  {
    id: "other-services",
    name: "Other Services",
    description: "Professional appliance support",
    icon: Wrench,

    serviceOptions: [
      {
        name: "Appliance Inspection",
        description: "Professional appliance inspection.",
        price: 299,
      },
      {
        name: "General Appliance Repair",
        description: "Diagnosis and repair for appliances.",
        price: 499,
      },
    ],
  },
];


function Services() {

  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState(null);


  /*
    ================================
    EXPLORE SERVICE
    ================================
  */

  const handleExplore = (service) => {

    setSelectedService(service);

    // Scroll to service details
    setTimeout(() => {

      document
        .getElementById("service-details")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

    }, 100);

  };


  /*
    ================================
    BOOK SERVICE

    IMPORTANT:
    This keeps your existing
    booking page.

    We are NOT changing the
    booking route.
    ================================
  */

  const handleBookService = (serviceOption) => {

    // Save selected service for Booking.jsx
    localStorage.setItem(
      "selectedServiceName",
      serviceOption.name
    );

    localStorage.setItem(
      "selectedServicePrice",
      serviceOption.price
    );

    // Go to your existing booking page
    navigate("/customer/booking");

  };


  /*
    ================================
    BACK TO SERVICES
    ================================
  */

  const handleBack = () => {

    setSelectedService(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  return (

    <div className="services-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="services-header">

        <span>
          OUR SERVICES
        </span>

        <h1>
          What can we help you with?
        </h1>

        <p>
          Choose your appliance and book a professional service.
        </p>

      </div>


      {/* =================================================
          SERVICE CARDS
      ================================================= */}

      {!selectedService && (

        <div className="services-grid">

          {services.map((service) => {

            const Icon = service.icon;

            return (

              <div
                className="service-card"
                key={service.id}
              >

                <div className="service-icon">

                  <Icon size={28} />

                </div>


                <h2>
                  {service.name}
                </h2>


                <p>
                  {service.description}
                </p>


                <button
                  onClick={() =>
                    handleExplore(service)
                  }
                >

                  Explore

                  <ArrowRight size={17} />

                </button>

              </div>

            );

          })}

        </div>

      )}


      {/* =================================================
          SERVICE DETAILS
      ================================================= */}

      {selectedService && (

        <section
          id="service-details"
          className="service-details-section"
        >

          {/* BACK */}

          <button
            className="service-details-back"
            onClick={handleBack}
          >

            <ArrowLeft size={18} />

            Back to Services

          </button>


          {/* SERVICE HEADER */}

          <div className="service-details-heading">

            <div className="service-details-icon">

              {(() => {

                const Icon =
                  selectedService.icon;

                return <Icon size={38} />;

              })()}

            </div>


            <div>

              <span>
                PROFESSIONAL SERVICE
              </span>

              <h1>
                {selectedService.name}
              </h1>

              <p>
                {selectedService.description}
              </p>

            </div>

          </div>


          {/* AVAILABLE SERVICES */}

          <div className="available-services-header">

            <span>
              AVAILABLE SERVICES
            </span>

            <h2>
              Choose the service you need
            </h2>

          </div>


          {/* SERVICE OPTIONS */}

          <div className="service-options-grid">

            {selectedService.serviceOptions.map(
              (option, index) => (

                <div
                  className="service-option-card"
                  key={option.name}
                >

                  <div className="service-option-top">

                    <div className="service-number">

                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}

                    </div>


                    <div className="service-price">

                      <small>
                        Starting from
                      </small>

                      <strong>
                        ₹{option.price}
                      </strong>

                    </div>

                  </div>


                  <h3>
                    {option.name}
                  </h3>


                  <p>
                    {option.description}
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


                  {/* BOOK */}

                  <button
                    className="service-book-button"
                    onClick={() =>
                      handleBookService(option)
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

          <div className="service-security-box">

            <div>
              🔐
            </div>

            <div>

              <strong>
                Secure & Transparent Service
              </strong>

              <p>
                A Start OTP will be generated for
                the technician before the service
                begins and an End OTP will be used
                when the service is completed.
              </p>

            </div>

          </div>

        </section>

      )}

    </div>

  );

}


export default Services;