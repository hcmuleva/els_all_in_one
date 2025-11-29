import React from 'react';
import './QuestionCard.css';

const QuestionCard = ({ question, selectedAnswer, onAnswer }) => {
    if (!question) return null;

    return (
        <div className="question-card">
            <div className="question-text">
                {question.questionText}
            </div>

            <div className="options-grid">
                {question.options && question.options.map((option, index) => (
                    <button
                        key={index}
                        className={`option-button ${selectedAnswer === index ? 'selected' : ''}`}
                        onClick={() => onAnswer(index)}
                    >
                        <span className="option-letter">
                            {String.fromCharCode(65 + index)}
                        </span>
                        <span className="option-text">{option}</span>
                    </button>
                ))}
            </div>

            {selectedAnswer !== undefined && question.explanation && (
                <div className="explanation">
                    <div className="explanation-icon">💡</div>
                    <div className="explanation-text">{question.explanation}</div>
                </div>
            )}
        </div>
    );
};

export default QuestionCard;
