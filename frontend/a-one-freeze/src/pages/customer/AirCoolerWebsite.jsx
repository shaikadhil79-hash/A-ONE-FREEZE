import { useNavigate } from 'react-router-dom';
import { Wind, Droplets, Wrench, Clock, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
import './AirCoolerWebsite.css';

const AirCoolerWebsite = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Wind className="service-icon" />,
      title: 'Air Cooler Cleaning',
      description: 'Deep cleaning of cooling pads, water tank, and fan blades for optimal performance',
      features: ['Pad cleaning & replacement', 'Tank sanitization', 'Fan blade cleaning']
    },
    {
      icon: <Droplets className="service-icon" />,
      title: 'Water Pump Service',
      description: 'Repair and maintenance of water circulation system for efficient cooling',
      features: ['Pump inspection', 'Motor check', 'Water flow optimization']
    },
    {
      icon: <Wrench className="service-icon" />,
      title: 'General Repair',
      description: 'Complete diagnostic and repair service for all air cooler issues',
      features: ['Electrical repairs', 'Mechanical fixes', 'Parts replacement']
    }
  ];

  const benefits = [
    'Certified & experienced technicians',
    'Transparent pricing with no hidden charges',
    'Same-day service availability',
    'Genuine spare parts',
    'Post-service support'
  ];

  const handleBookNow = () => {
    navigate('/customer/service-selection');
  };

  return (
    <div className="air-cooler-website">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Professional Air Cooler Service
          </h1>
          <p className="hero-subtitle">
            Keep your air cooler running efficiently with expert maintenance and repair services
          </p>
          <button className="cta-button" onClick={handleBookNow}>
            Book Service Now
          </button>
        </div>
        <div className="hero-image">
          <Wind size={200} className="hero-icon" />
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon-wrapper">
                {service.icon}
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>
                    <CheckCircle size={16} className="check-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="benefits-section">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <CheckCircle className="benefit-icon" />
              <p>{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="process-section">
        <h2 className="section-title">How It Works</h2>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">1</div>
            <h3>Book Online</h3>
            <p>Choose your service and schedule a convenient time</p>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <h3>Technician Assigned</h3>
            <p>Expert technician arrives at your location</p>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <h3>Service Completed</h3>
            <p>Professional service with quality assurance</p>
          </div>
          <div className="process-step">
            <div className="step-number">4</div>
            <h3>Payment</h3>
            <p>Secure payment after service completion</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          <div className="faq-item">
            <h3>How do I book a service?</h3>
            <p>Click the "Book Service Now" button, select your air cooler service type, and choose a convenient time slot.</p>
          </div>
          <div className="faq-item">
            <h3>What areas do you cover?</h3>
            <p>We provide air cooler services across multiple locations. Check service availability during booking.</p>
          </div>
          <div className="faq-item">
            <h3>How long does a service take?</h3>
            <p>Basic cleaning takes 30-45 minutes. Repairs may take longer depending on the issue.</p>
          </div>
          <div className="faq-item">
            <h3>Do you provide spare parts?</h3>
            <p>Yes, we use genuine spare parts. Parts cost is separate from service charges.</p>
          </div>
          <div className="faq-item">
            <h3>Can I track my service request?</h3>
            <p>Yes, you can track your booking status in real-time from your bookings page.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Service Your Air Cooler?</h2>
        <p>Book now and enjoy cool, fresh air all summer long</p>
        <button className="cta-button-large" onClick={handleBookNow}>
          Book Your Service
        </button>
      </section>

      {/* Footer */}
      <footer className="website-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>A-ONE FREEZE</h4>
            <p>Professional air cooler service at your doorstep</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li onClick={() => navigate('/customer')}>Customer Home</li>
              <li onClick={() => navigate('/customer/bookings')}>My Bookings</li>
              <li onClick={() => navigate('/customer/services')}>All Services</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <div className="contact-info">
              <p><Phone size={16} /> Support available</p>
              <p><Mail size={16} /> Contact via booking</p>
              <p><MapPin size={16} /> Service locations vary</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 A-ONE FREEZE. Professional Air Cooler Services.</p>
        </div>
      </footer>
    </div>
  );
};

export default AirCoolerWebsite;
