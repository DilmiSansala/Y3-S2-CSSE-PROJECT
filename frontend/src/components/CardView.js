import React from 'react';
import './CardView.css';

// Constants for card data
const cardData = [
  {
    id: 1,
    icon: '📅',
    title: 'Upcoming Collections',
    description: 'Next pickup on Oct 15',
    status: 'Scheduled',
    className: 'upcoming-collections'
  },
  {
    id: 2,
    icon: '♻️',
    title: 'Recycling Progress',
    description: 'Monthly Target',
    status: '75% Completed',
    className: 'recycling-progress'
  },
  {
    id: 3,
    icon: '📋',
    title: 'Manage Requests',
    description: '3 Pending Requests',
    status: 'Pending',
    className: 'manage-requests'
  }
];

// CardView Component
const CardView = () => {
  return (
    <div className="card-container">
      {cardData.map((card) => (
        <div key={card.id} className={`card ${card.className}`}>
          <div className="card-icon" aria-label={card.title}>{card.icon}</div>
          <div className="card-content">
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <div className="card-status">{card.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardView;
