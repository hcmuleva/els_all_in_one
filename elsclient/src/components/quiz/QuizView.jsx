import React, { useState, useEffect, useRef } from 'react';
import QuestionCard from './QuestionCard';
import { quizResultAPI } from '../../services/quizResult';
import './QuizView.css';

const QuizView = ({ quiz, topic, subjectName }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [savingResult, setSavingResult] = useState(false);

    // Timing tracking
    const [quizStartTime, setQuizStartTime] = useState(null);
    const [questionStartTime, setQuestionStartTime] = useState(null);
    const [questionTimings, setQuestionTimings] = useState({});

    // Initialize timing when quiz loads
    useEffect(() => {
        const now = new Date();
        setQuizStartTime(now);
        setQuestionStartTime(now);
    }, []);

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
        // Record time taken for this question if not already answered
        if (answers[questionId] === undefined && questionStartTime) {
            const timeSpent = Math.round((new Date() - questionStartTime) / 1000); // in seconds
            setQuestionTimings(prev => ({
                ...prev,
                [questionId]: timeSpent
            }));
        }

        setAnswers({
            ...answers,
            [questionId]: answerIndex
        });
    };

    const calculateScore = () => {
        let correct = 0;
        quiz.questions.forEach((q) => {
            const userAnswer = answers[q.id];
            if (userAnswer !== undefined && q.correctAnswers && q.correctAnswers.includes(userAnswer)) {
                correct++;
            }
        });
        return correct;
    };

    const submitResult = async () => {
        setSavingResult(true);
        const score = calculateScore();
        const percentage = Math.round((score / totalQuestions) * 100);
        const completedAt = new Date();
        const timeTaken = Math.round((completedAt - quizStartTime) / 1000); // Total time in seconds

        try {
            await quizResultAPI.create({
                score,
                totalQuestions,
                percentage,
                answers,
                timeTaken,
                questionTimings,
                startedAt: quizStartTime.toISOString(),
                completedAt: completedAt.toISOString(),
                quiz: quiz.documentId,
                topic: topic?.documentId,
                subject: topic?.subject?.documentId
            });
            console.log('Quiz result saved successfully!');
        } catch (error) {
            console.error('Failed to save quiz result:', error);
        } finally {
            setSavingResult(false);
            setShowResults(true);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            // Move to next question and reset timer
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setQuestionStartTime(new Date());
        } else {
            submitResult();
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setQuestionStartTime(new Date());
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setShowResults(false);
        const now = new Date();
        setQuizStartTime(now);
        setQuestionStartTime(now);
        setQuestionTimings({});
    };

    if (showResults) {
        const score = calculateScore();
        const percentage = ((score / totalQuestions) * 100).toFixed(0);
        const totalTime = Math.round((new Date() - quizStartTime) / 1000);
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;

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

                <div className="quiz-stats">
                    <p>⏱️ Time taken: {minutes}m {seconds}s</p>
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
                    disabled={currentQuestionIndex === 0 || savingResult}
                >
                    ⬅️ Previous
                </button>

                <button
                    className="btn-nav btn-next"
                    onClick={handleNext}
                    disabled={savingResult}
                >
                    {savingResult ? 'Saving...' : (currentQuestionIndex === totalQuestions - 1 ? 'Finish 🏁' : 'Next ➡️')}
                </button>
            </div>
        </div>
    );
};

export default QuizView;
