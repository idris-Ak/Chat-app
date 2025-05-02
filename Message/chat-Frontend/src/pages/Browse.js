// src/pages/Browse.js
import React from 'react';
import Navigation from '../components/Navigation';
import './styles/Browse.css';

const mockTasks = [
  {
    id: 1,
    title: 'Assemble IKEA Furniture',
    description: 'Need help assembling a MALM bed and dresser.',
    location: 'Melbourne, VIC',
    budget: '$60',
    image: '/images/Furniture_Assembly.jpg',
  },
  {
    id: 2,
    title: 'Clean my 2BR Apartment',
    description: 'Looking for a reliable cleaner for a light clean.',
    location: 'Sydney, NSW',
    budget: '$90',
    image: '/images/Commercial_Cleaner.jpg',
  },
  {
    id: 3,
    title: 'Fix my leaking tap',
    description: 'Kitchen sink tap is leaking, need a quick fix.',
    location: 'Brisbane, QLD',
    budget: '$50',
    image: '/images/Plumber.jpg',
  },
];

const Browse = () => {
  return (
    <div className="browse-container">
      <header className="browse-header">
        <Navigation />
      </header>

      <main className="browse-main">
        <h1>Browse Available Tasks</h1>
        <div className="task-grid">
          {mockTasks.map((task) => (
            <div key={task.id} className="task-card">
              <img src={task.image} alt={task.title} className="task-image" />
              <div className="task-info">
                <h2 className="task-title">{task.title}</h2>
                <p className="task-desc">{task.description}</p>
                <p className="task-location">{task.location}</p>
                <p className="task-budget">{task.budget}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Browse;
