import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './styles/Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <Navigation />
      </header>

      <main className="landing-main">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Real-Time Team Chat. Simplified.</h1>
            <p className="subtitle">
              Secure, instant messaging built for fast collaboration. Stay connected with your team — from anywhere.
            </p>
            <div className="cta-buttons">
              <Link to="/login" className="cta-btn login">Log In</Link>
              <Link to="/register" className="cta-btn post-task">Get Started</Link>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="/images/chat-hero-preview.jpg" 
              alt="Real-time chat application interface"
              style={{ width: "100%", height: "100%", borderRadius: "10px", objectFit: "cover" }}
            />
          </div>
        </div>

        <section className="how-it-works">
          <h2>FEATURE HIGHLIGHTS</h2>
          <p className="section-description">
            Explore the powerful features that make IT Boost Chat App your go-to team communication tool.
          </p>

          <div className="steps-container">
            <div className="step">
              <div className="step-icon describe"></div>
              <h3>Real-Time Messaging</h3>
              <p>Send and receive messages instantly using WebSockets. Experience zero delay.</p>
            </div>
            <div className="step">
              <div className="step-icon budget"></div>
              <h3>User Authentication</h3>
              <p>Secure login with token-based session handling for total data protection.</p>
            </div>
            <div className="step">
              <div className="step-icon offers"></div>
              <h3>Persistent Chat History</h3>
              <p>Never lose a message. Conversations are synced and stored across devices.</p>
            </div>
            <div className="step">
              <div className="step-icon choose"></div>
              <h3>Responsive Design</h3>
              <p>Built for mobile and desktop with a clean, modern interface that adapts to any screen.</p>
            </div>
          </div>
        </section>

        <section className="mission">
          <h2>OUR MISSION</h2>
          <p>
            We’re building the most intuitive messaging platform for teams and businesses. 
            With real-time communication, secure authentication, and beautifully responsive design, 
            our goal is to make staying connected effortless.
          </p>
          <Link to="/about" className="read-more">Read more</Link>
        </section>
      </main>
    </div>
  );
};

export default Landing;
