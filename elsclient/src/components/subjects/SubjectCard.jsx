import React from 'react';
import './SubjectCard.css';

const SubjectCard = ({ title, icon, onClick, className = '', selected = false }) => {
    return (
        <div
            className={`subject-card ${className} ${selected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <div className="subject-icon-wrapper">
                <span className="subject-icon">{icon}</span>
            </div>
            <h3 className="subject-title">{title}</h3>
        </div>
    );
};

export default SubjectCard;
