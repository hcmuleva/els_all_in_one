import React from 'react';
import './QuizAnalytics.css';

const ProgressionMetricSelector = ({ selectedMetrics, onMetricToggle }) => {
    const metrics = [
        { id: 'score', label: 'Score (%)', icon: '🎯' },
        { id: 'time', label: 'Time (min)', icon: '⏱️' },
        { id: 'correct', label: 'Correct', icon: '✅' },
        { id: 'wrong', label: 'Wrong', icon: '❌' }
    ];

    return (
        <div className="progression-metric-selector">
            <h4 className="progression-metric-title">Select Metrics to Display</h4>
            <div className="progression-metric-chips">
                {metrics.map(metric => (
                    <button
                        key={metric.id}
                        onClick={() => onMetricToggle(metric.id)}
                        className={`metric-chip ${selectedMetrics.includes(metric.id) ? 'active' : ''}`}
                    >
                        <span className="chip-icon">{metric.icon}</span>
                        <span className="chip-label">{metric.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProgressionMetricSelector;
