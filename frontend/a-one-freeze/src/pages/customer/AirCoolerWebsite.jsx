import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CalendarDays, ClipboardList, Droplets, Menu, Wind, Wrench, X } from "lucide-react";
import "./AirCoolerWebsite.css";

const servicePath = "/customer/services/air-cooler";
const services = [
  { title: "Cooler General Service", label: "A little care. A fresher start.", description: "Explore cleaning and motor oiling for your air cooler in our service catalogue.", Icon: Droplets, className: "acf-card-clean" },
  { title: "Cooler Pump / Motor Repair", label: "Get to the heart of the problem.", description: "Explore pump and motor service options, including water pump replacement and wiring checks.", Icon: Wrench, className: "acf-card-repair" },
];
const steps = [
  { title: "Choose your service", description: "Open the air cooler catalogue and review the listed services and prices.", Icon: ClipboardList },
  { title: "Add your booking details", description: "Select a service and continue to the existing booking form.", Icon: CalendarDays },
  { title: "Follow your booking", description: "Visit My Bookings to view your service request and access its tracking page.", Icon: Wind },
];
const faqs = [
  { question: "How do I book an air cooler service?", answer: "Choose View services & book, select an air cooler service, and continue through the booking form. This page uses the same booking flow as the customer portal." },
  { question: "Where can I see service prices?", answer: "Prices and service details are shown in the air cooler catalogue. Review your selected service and any applicable parts charges in the booking and billing flow." },
  { question: "Which cooler services can I explore?", answer: "The catalogue includes Cooler General Service and Cooler Pump / Motor Repair. Open the catalogue to review what each option includes before selecting it." },
  { question: "How can I check an existing booking?", answer: "Open My Bookings from the navigation or customer portal, then select the relevant booking to view its details and available tracking information." },
];

export default function AirCoolerWebsite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="acf-site">
      <a className="acf-skip" href="#acf-main">Skip to content</a>
      <header className="acf-header">
        <div className="acf-shell acf-header-inner">
          <Link className="acf-brand" to="/air-cooler" aria-label="A-ONE FREEZE air cooler home" onClick={closeMenu}>
            <span className="acf-brand-mark"><Wind size={25} aria-hidden="true" /></span>
            <span>A-ONE<span className="acf-brand-light"> FREEZE</span><small>AIR COOLER CARE</small></span>
          </Link>
          <button className="acf-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="acf-nav" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <nav id="acf-nav" className={`acf-nav${menuOpen ? " acf-nav-open" : ""}`} aria-label="Air cooler navigation" onKeyDown={(event) => {
            if (event.key === "Escape") {
              setMenuOpen(false);
              event.currentTarget.parentElement.querySelector(".acf-menu-toggle")?.focus();
            }
          }}>
            <a href="#acf-services" onClick={closeMenu}>Our services</a>
            <a href="#acf-how" onClick={closeMenu}>How it works</a>
            <a href="#acf-faq" onClick={closeMenu}>FAQs</a>
            <Link to="/customer/bookings" onClick={closeMenu}>My bookings</Link>
            <Link className="acf-button acf-button-small" to={servicePath} onClick={closeMenu}>Book a service <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </nav>
        </div>
      </header>

      <main id="acf-main" tabIndex={-1}>
        <section className="acf-hero" aria-labelledby="acf-title">
          <div className="acf-shell acf-hero-grid">
            <div className="acf-hero-copy">
              <span className="acf-eyebrow"><span className="acf-dot" /> YOUR COOLER. OUR FOCUS.</span>
              <h1 id="acf-title">Less heat.<br />More <span>comfort.</span></h1>
              <p className="acf-lead">Give your air cooler the care it needs. Explore cleaning, maintenance and repair services with A-ONE FREEZE.</p>
              <div className="acf-actions">
                <Link className="acf-button" to={servicePath}>View services &amp; book <ArrowUpRight size={20} aria-hidden="true" /></Link>
                <a className="acf-text-link" href="#acf-how">See how it works <ArrowRight size={17} aria-hidden="true" /></a>
              </div>
              <p className="acf-hero-note">Service details first. Choose what works for you.</p>
            </div>
            <div className="acf-scene" role="img" aria-label="Illustration of a portable air cooler with flowing air">
              <div className="acf-scene-orbit" />
              <div className="acf-scene-label"><Wind size={18} aria-hidden="true" /> MADE FOR COOLER DAYS</div>
              <div className="acf-cooler" aria-hidden="true">
                <div className="acf-cooler-top"><span /><span /><span /></div>
                <div className="acf-cooler-grille"><div className="acf-fan"><i /><i /><i /><b /></div></div>
                <div className="acf-cooler-bottom"><span>A-ONE FREEZE</span><i /></div>
                <div className="acf-wheel acf-wheel-left" /><div className="acf-wheel acf-wheel-right" />
              </div>
              <div className="acf-air acf-air-one" aria-hidden="true" /><div className="acf-air acf-air-two" aria-hidden="true" /><div className="acf-air acf-air-three" aria-hidden="true" />
              <div className="acf-scene-tag"><Droplets size={20} aria-hidden="true" /><span>A fresh start<br /><strong>for your cooler.</strong></span></div>
              <span className="acf-scene-caption">AIR COOLER SERVICE &amp; MAINTENANCE</span>
            </div>
          </div>
        </section>

        <div className="acf-benefit-strip">
          <div className="acf-shell acf-benefits">
            <span><Droplets aria-hidden="true" size={21} /> Cleaning &amp; maintenance</span>
            <span><Wrench aria-hidden="true" size={21} /> Pump &amp; motor care</span>
            <span><ClipboardList aria-hidden="true" size={21} /> Booking &amp; tracking</span>
          </div>
        </div>

        <section id="acf-services" className="acf-section acf-shell" aria-labelledby="acf-services-title">
          <div className="acf-section-heading">
            <div><span className="acf-eyebrow">CARE THAT MAKES SENSE</span><h2 id="acf-services-title">What does your cooler need?</h2></div>
            <p>Start with the right service. Review the full details and listed prices before booking.</p>
          </div>
          <div className="acf-service-grid">
            {services.map(({ title, label, description, Icon, className }) => (
              <article className={`acf-service-card ${className}`} key={title}>
                <div className="acf-service-top"><span className="acf-icon-tile"><Icon size={28} aria-hidden="true" /></span><span className="acf-card-category">AIR COOLER CARE</span></div>
                <p className="acf-card-kicker">{label}</p><h3>{title}</h3><p>{description}</p>
                <Link className="acf-card-link" to={servicePath} aria-label={`View catalogue for ${title}`}>Explore service <ArrowUpRight size={20} aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
          <div className="acf-service-note"><span>Not sure which service to choose?</span><Link to={servicePath}>Compare the available options <ArrowRight size={17} aria-hidden="true" /></Link></div>
        </section>

        <section id="acf-how" className="acf-process" aria-labelledby="acf-how-title">
          <div className="acf-shell acf-section">
            <span className="acf-eyebrow">FROM BROWSING TO BOOKING</span><h2 id="acf-how-title">A simple way to get started.</h2>
            <ol className="acf-steps">
              {steps.map(({ title, description, Icon }, index) => (
                <li key={title}><div className="acf-step-top"><span>0{index + 1}</span><Icon size={27} aria-hidden="true" /></div><h3>{title}</h3><p>{description}</p></li>
              ))}
            </ol>
          </div>
        </section>

        <section id="acf-faq" className="acf-shell acf-section acf-faq-layout" aria-labelledby="acf-faq-title">
          <div><span className="acf-eyebrow">GOOD TO KNOW</span><h2 id="acf-faq-title">A few questions.<br />Clear answers.</h2><p>Everything you need to take the next step.</p><Link className="acf-text-link" to="/customer/login">Open customer login <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
          <div className="acf-faq-list">{faqs.map(({ question, answer }) => <details key={question}><summary>{question}<span className="acf-faq-plus" aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
        </section>

        <section className="acf-shell acf-cta-wrap" aria-labelledby="acf-cta-title"><div className="acf-cta"><div><span className="acf-eyebrow">LET'S TAKE CARE OF YOUR COOLER</span><h2 id="acf-cta-title">Comfort starts<br />with a little care.</h2><p>Explore air cooler services and make your next booking.</p></div><Link className="acf-button acf-button-light" to={servicePath}>Find my service <ArrowUpRight size={21} aria-hidden="true" /></Link></div></section>
      </main>

      <footer className="acf-footer"><div className="acf-shell acf-footer-inner"><div><Link className="acf-brand" to="/air-cooler"><Wind size={24} aria-hidden="true" /> A-ONE FREEZE</Link><p>Air cooler care, made straightforward.</p></div><nav aria-label="Footer navigation"><Link to="/customer">Customer portal</Link><Link to="/customer/bookings">My bookings</Link><Link to="/">All portals</Link></nav><span className="acf-footer-label">CARE. REPAIR. REFRESH.</span></div></footer>
    </div>
  );
}
