import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

function Landing() {
  useEffect(() => {
    document.title = 'Pivot Frameworks';
  }, []);

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="container">
          <h2>PivotFrameworks</h2>
          <Link to="/login" className="btn btn-primary">Employee Login</Link>
        </div>
      </nav>
      
      <main>
        <section className="hero">
          <div className="container">
            <h1>Welcome to PivotFrameworks</h1>
            <p className="hero-text">
              Transforming ideas into innovative solutions. We help businesses pivot towards success.
            </p>
            <div className="hero-buttons">
              <Link to="/login" className="btn btn-primary">Get Started</Link>
              <a href="#services" className="btn btn-secondary">Learn More</a>
            </div>
          </div>
        </section>

        <section id="services" className="services">
          <div className="container">
            <h2>Our Services</h2>
            <div className="services-grid">
              <div className="service-card">
                <h3>Strategic Consulting</h3>
                <p>Expert guidance to transform your business vision into reality.</p>
              </div>
              <div className="service-card">
                <h3>Digital Solutions</h3>
                <p>Custom software and digital transformation services.</p>
              </div>
              <div className="service-card">
                <h3>Innovation Labs</h3>
                <p>Research and development for cutting-edge technologies.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container">
            <h2>Ready to Transform Your Business?</h2>
            <p>Let's work together to achieve your goals.</p>
            <Link to="/login" className="btn btn-primary">Contact Us</Link>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>PivotFrameworks</h3>
              <p>Innovating for tomorrow, today.</p>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@pivotframeworks.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 PivotFrameworks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing; 