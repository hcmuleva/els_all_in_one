import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './QuizResultAnalysis.css';

const QuizResultAnalysis = ({ quizResult, quiz, onClose }) => {
    const { user } = useAuth();

    // Safety checks
    if (!quizResult || !quiz || !quiz.questions) {
        return (
            <div className="quiz-result-analysis">
                <div className="analysis-header">
                    {onClose && (
                        <button className="close-analysis-btn" onClick={onClose}>
                            ← Back
                        </button>
                    )}
                </div>
                <div className="empty-state">
                    <p>Unable to load quiz analysis data.</p>
                </div>
            </div>
        );
    }

    // Calculate breakdown
    const totalQuestions = quizResult.totalQuestions || quiz.questions.length;
    const correct = quizResult.score || 0;
    const totalAnswered = Object.keys(quizResult.answers || {}).length;
    const incorrect = totalAnswered - correct;
    const unanswered = totalQuestions - totalAnswered;

    // Helper to check if answer is correct
    const isAnswerCorrect = (question, userAnswerIndex) => {
        if (userAnswerIndex === undefined) return null;

        // Check correctAnswers array
        if (question.correctAnswers && question.correctAnswers.includes(userAnswerIndex)) {
            return true;
        }

        // Check object-based options with isCorrect property
        if (question.options && Array.isArray(question.options) && typeof question.options[0] === 'object') {
            const selectedOption = question.options[userAnswerIndex];
            return selectedOption && selectedOption.isCorrect === true;
        }

        return false;
    };

    // Build question details array
    const questionDetails = quiz.questions.map((q, index) => {
        const userAnswer = quizResult.answers[q.id];
        const time = quizResult.questionTimings?.[q.id] || 0;

        let status = 'unanswered';
        if (userAnswer !== undefined) {
            status = isAnswerCorrect(q, userAnswer) ? 'correct' : 'incorrect';
        }

        return {
            number: index + 1,
            time,
            status
        };
    });

    // Calculate donut chart segments (as percentages for stroke-dasharray)
    const correctPercent = (correct / totalQuestions) * 100;
    const incorrectPercent = (incorrect / totalQuestions) * 100;
    const unansweredPercent = (unanswered / totalQuestions) * 100;

    // SVG circle calculations
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const correctLength = (correctPercent / 100) * circumference;
    const incorrectLength = (incorrectPercent / 100) * circumference;
    const unansweredLength = (unansweredPercent / 100) * circumference;

    return (
        <div className="quiz-result-analysis">
            {/* Header */}
            <div className="analysis-header">
                {onClose && (
                    <button className="close-analysis-btn" onClick={onClose}>
                        ← Back
                    </button>
                )}
                <div className="user-profile-section">
                    <div className="user-avatar-analysis">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h2 className="user-name-analysis">{user?.username || 'Student'}</h2>
                </div>
            </div>

            {/* Donut Chart */}
            <div className="donut-chart-container">
                <svg className="donut-chart" viewBox="0 0 200 200">
                    {/* Background circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#f0f0f0"
                        strokeWidth="30"
                    />

                    {/* Correct segment (cyan) */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#14b8a6"
                        strokeWidth="30"
                        strokeDasharray={`${correctLength} ${circumference - correctLength}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 100 100)"
                        className="donut-segment"
                    />

                    {/* Incorrect segment (dark blue) */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#1e3a8a"
                        strokeWidth="30"
                        strokeDasharray={`${incorrectLength} ${circumference - incorrectLength}`}
                        strokeDashoffset={-correctLength}
                        transform="rotate(-90 100 100)"
                        className="donut-segment"
                    />

                    {/* Unanswered segment (yellow) */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="30"
                        strokeDasharray={`${unansweredLength} ${circumference - unansweredLength}`}
                        strokeDashoffset={-(correctLength + incorrectLength)}
                        transform="rotate(-90 100 100)"
                        className="donut-segment"
                    />

                    {/* Center text */}
                    <text
                        x="100"
                        y="100"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="donut-center-text"
                    >
                        {correct}/{totalQuestions}
                    </text>
                </svg>

                {/* Legend */}
                <div className="donut-legend">
                    <div className="legend-item-analysis">
                        <span className="legend-color-box correct-color"></span>
                        <span className="legend-label">Correct</span>
                    </div>
                    <div className="legend-item-analysis">
                        <span className="legend-color-box incorrect-color"></span>
                        <span className="legend-label">Incorrect</span>
                    </div>
                    <div className="legend-item-analysis">
                        <span className="legend-color-box unanswered-color"></span>
                        <span className="legend-label">Unanswered</span>
                    </div>
                </div>
            </div>

            {/* Time Chart */}
            <div className="time-chart-container">
                <h3 className="time-chart-title">Time per Question</h3>
                <div className="time-bars">
                    {questionDetails.map((detail) => (
                        <div key={detail.number} className="time-bar-row">
                            <div className={`question-number-box ${detail.status}`}>
                                {detail.number}
                            </div>
                            <div className="time-bar-wrapper">
                                <div
                                    className={`time-bar ${detail.status}`}
                                    style={{
                                        width: `${Math.min((detail.time / 10) * 100, 100)}%`
                                    }}
                                >
                                    <span className="time-label">{detail.time}s</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuizResultAnalysis;
