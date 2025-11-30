import React from 'react';
import './QuizAnalytics.css';

const MetricSelector = ({ selectedMetrics, onMetricToggle }) => {
    const metrics = [
        { id: 'totalAttempts', label: 'Total Attempts', icon: '📊' },
        { id: 'avgScore', label: 'Average Score', icon: '🎯' },
        { id: 'avgTime', label: 'Average Time', icon: '⏱️' },
        { id: 'bySubject', label: 'By Subject', icon: '📚' },
        { id: 'byTopic', label: 'By Topic', icon: '📝' }
    ];

    return (
        <div className="metric-selector">
            <h3 className="metric-selector-title">Select Metrics</h3>
            <div className="metric-checkboxes">
                {metrics.map(metric => (
                    <label key={metric.id} className="metric-checkbox-label">
                        <input
                            type="checkbox"
                            checked={selectedMetrics.includes(metric.id)}
                            onChange={() => onMetricToggle(metric.id)}
                            className="metric-checkbox"
                        />
                        <span className="metric-checkbox-custom"></span>
                        <span className="metric-icon">{metric.icon}</span>
                        <span className="metric-label">{metric.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default MetricSelector;
