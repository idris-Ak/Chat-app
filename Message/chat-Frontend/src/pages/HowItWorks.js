// src/pages/HowItWorks.js
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './styles/HowItWorks.css';

const steps = [
  {
    icon: '📝',
    title: 'Describe Your Task',
    description: 'Let us know what needs to be done. Be specific to attract the best taskers.',
  },
  {
    icon: '💰',
    title: 'Set Your Budget',
    description: 'Choose how much you’re willing to pay. You can adjust this later based on offers.',
  },
  {
    icon: '📬',
    title: 'Receive Offers',
    description: 'Taskers will review your task and send tailored offers. Compare their reviews, profiles, and prices.',
  },
  {
    icon: '✅',
    title: 'Select the Best Tasker',
    description: 'Pick the tasker that fits your needs. Once selected, chat and coordinate directly within the app.',
  },
  {
    icon: '🔧',
    title: 'Task Gets Done',
    description: 'Sit back while your task is completed. Don’t forget to leave a review!',
  },
];

const HowItWorks = () => {
  return (
    <div className="how-it-works-container">
      <header className="how-it-works-header">
        <Navigation />
      </header>

      <main className="how-it-works-main">
        <h1>How It Works</h1>
        <p className="intro-text">
          Getting your to-do list completed has never been easier. Here’s how TaskHub works:
        </p>

        <div className="steps-wrapper">
          {steps.map((step, index) => (
            <div className="step-card" key={index}>
              <div className="step-icon">{step.icon}</div>
              <h2 className="step-title">{step.title}</h2>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="cta-section">
          <p>Ready to get started?</p>
          <Link to="/post-task" className="cta-btn">Post a Task</Link>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
