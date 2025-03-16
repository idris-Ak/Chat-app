import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <nav>
          <div className="logo">
            <Link to="/">TaskHub</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Browse</Link>
            <Link to="/">How It Works</Link>
            <Link to="/">Contact Us</Link>
            <Link to="/login" className="login-btn">Log In</Link>
            <Link to="/register" className="post-task-btn">Post a Task</Link>
          </div>
        </nav>
      </header>

      <main className="landing-main">
        <div className="hero-section">
          <div className="hero-content">
            <h1>GET TASKS DONE WITH EASE!</h1>
            <p>Post your tasks today</p>
            <p className="subtitle">Choose the right person. Get it done with ease!</p>
            <div className="cta-buttons">
              <Link to="/login" className="cta-btn login">Log In</Link>
              <Link to="/register" className="cta-btn post-task">Post a Task</Link>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="/images/hero-image.jpg" 
              alt="Happy family getting tasks done"
            />
          </div>
        </div>

        <section className="how-it-works">
          <h2>HOW IT WORKS</h2>
          <p className="section-description">
            Taskers are invited to connect & provide quality household services in Australia, Japan, and Canada.
            Describe your task, set your budget, get offers from skilled taskers, and choose the best fit!
          </p>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-icon describe"></div>
              <h3>Describe Your Task</h3>
              <Link to="/post-task" className="read-more">Read more</Link>
            </div>
            <div className="step">
              <div className="step-icon budget"></div>
              <h3>Set Your Budget For Task</h3>
              <Link to="/how-it-works" className="read-more">Read more</Link>
            </div>
            <div className="step">
              <div className="step-icon offers"></div>
              <h3>Get Offers</h3>
              <Link to="/how-it-works" className="read-more">Read more</Link>
            </div>
            <div className="step">
              <div className="step-icon choose"></div>
              <h3>Choose the Best Tasker</h3>
              <Link to="/how-it-works" className="read-more">Read more</Link>
            </div>
          </div>
        </section>

        <section className="mission">
          <h2>OUR MISSION</h2>
          <p>
            At TaskHub, we aim to connect people with skilled services, making everyday tasks easier,
            faster, and more efficient. We strive to create a seamless platform where users can find reliable help,
            while taskers have the opportunity to showcase their skills and grow their businesses.
          </p>
          <Link to="/about" className="read-more">Read more</Link>
        </section>
      </main>
    </div>
  );
};

export default Landing; 