import React, { useState } from 'react';
import QuestionCard from './QuestionCard';
import './QuizView.css';

const QuizView = ({ quiz }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="quiz-empty">
                <div className="empty-icon">🎯</div>
                <p>No quiz available for this topic yet!</p>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const totalQuestions = quiz.questions.length;

    const handleAnswer = (questionId, answerIndex) => {
        setAnswers({
            ...answers,
            [questionId]: answerIndex
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResults(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setShowResults(false);
    };

    const calculateScore = () => {
        let correct = 0;
        quiz.questions.forEach((q, idx) => {
            if (answers[q.id] === q.correctAnswer) {
                correct++;
            }
        });
        return correct;
    };

    if (showResults) {
        const score = calculateScore();
        const percentage = ((score / totalQuestions) * 100).toFixed(0);

        return (
            <div className="quiz-results">
                <div className="results-header">
                    <h2>Quiz Complete! 🎉</h2>
                </div>

                <div className="score-circle">
                    <div className="score-number">{score}/{totalQuestions}</div>
                    <div className="score-percentage">{percentage}%</div>
                </div>

                <div className="score-message">
                    {percentage >= 80 ? "🌟 Excellent work!" :
                        percentage >= 60 ? "👍 Good job!" :
                            "💪 Keep practicing!"}
                </div>

                <button className="btn-restart" onClick={handleRestart}>
                    🔄 Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="quiz-view">
            <div className="quiz-header">
                <h3>{quiz.title}</h3>
                <div className="quiz-progress">
                    <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <QuestionCard
                question={currentQuestion}
                selectedAnswer={answers[currentQuestion.id]}
                onAnswer={(answerIndex) => handleAnswer(currentQuestion.id, answerIndex)}
            />

            <div className="quiz-navigation">
                <button
                    className="btn-nav btn-previous"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                >
                    ⬅️ Previous
                </button>

                <button
                    className="btn-nav btn-next"
                    onClick={handleNext}
                >
                    {currentQuestionIndex === totalQuestions - 1 ? 'Finish 🏁' : 'Next ➡️'}
                </button>
            </div>
        </div>
    );
};

export default QuizView;
