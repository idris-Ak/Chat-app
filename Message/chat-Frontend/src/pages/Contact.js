// src/pages/Contact.js
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import './styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can replace this with API logic later
    alert(`Thanks, ${formData.name}! We'll get back to you shortly.`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-container">
      <header className="contact-header">
        <Navigation />
      </header>

      <main className="contact-main">
        <h1>Contact Us</h1>
        <p className="contact-description">
          Have a question, feedback, or need help? Reach out using the form below.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Type your message here..."
            />
          </div>

          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </main>
    </div>
  );
};

export default Contact;
