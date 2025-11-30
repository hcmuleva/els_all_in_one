import React from 'react';
import './QuizAnalytics.css';

const SubjectFilter = ({ subjects, selectedSubjects, onSubjectToggle }) => {
    const subjectColors = {
        'BeBrainee': '#667eea',
        'Geography': '#48bb78',
        'History': '#ed8936',
        'Science': '#4299e1',
        'Math': '#a28fd0'
    };

    const getSubjectColor = (subject) => {
        return subjectColors[subject] || '#718096';
    };

    return (
        <div className="subject-filter">
            <h4 className="subject-filter-title">Filter by Subject</h4>
            <div className="subject-filter-chips">
                {subjects.map(subject => (
                    <button
                        key={subject}
                        onClick={() => onSubjectToggle(subject)}
                        className={`subject-chip ${selectedSubjects.includes(subject) ? 'active' : ''}`}
                        style={{
                            '--subject-color': getSubjectColor(subject)
                        }}
                    >
                        <span className="subject-chip-label">{subject}</span>
                        {selectedSubjects.includes(subject) && (
                            <span className="subject-chip-check">✓</span>
                        )}
                    </button>
                ))}
            </div>
            {selectedSubjects.length > 0 && (
                <button
                    onClick={() => onSubjectToggle('ALL')}
                    className="clear-filters-btn"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    );
};

export default SubjectFilter;
