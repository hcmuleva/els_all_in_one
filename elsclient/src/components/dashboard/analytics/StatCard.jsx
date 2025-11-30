import React from 'react';
import './QuizAnalytics.css';

const StatCard = ({ icon, label, value, subtext, className = '' }) => {
    return (
        <div className={`stat-card-analytics ${className}`}>
            <div className="stat-analytics-icon">{icon}</div>
            <div className="stat-analytics-content">
                <div className="stat-analytics-value">{value}</div>
                <div className="stat-analytics-label">{label}</div>
                {subtext && <div className="stat-analytics-subtext">{subtext}</div>}
            </div>
        </div>
    );
};

export default StatCard;
