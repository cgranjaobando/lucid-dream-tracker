// This file contains the component for rendering individual day cards.
// It supports rendering in both grid and carousel views.

import React from 'react';
import './day-card.css'; // Assuming you have styles for day cards

const DayCard = ({ day, activities, isCarousel }) => {
    return (
        <div className={`day-card ${isCarousel ? 'carousel' : 'grid'}`}>
            <h3>Día {day}</h3>
            <ul>
                {activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                ))}
            </ul>
        </div>
    );
};

export default DayCard;