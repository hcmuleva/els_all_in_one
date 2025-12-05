import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import QuizResultAnalysis from './QuizResultAnalysis';
import { quizResultAPI } from '../../services/quizResult';
import './QuizView.css';

const QuizView = ({ quiz, topic, subjectName, onClose, filterType = 'all', previousResult = null, selectedLevel = null }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const [savingResult, setSavingResult] = useState(false);

    // Full-screen and status tracking
    const [isFullScreen, setIsFullScreen] = useState(true); // Start in full-screen
    const [questionStatus, setQuestionStatus] = useState({});

    // Timer tracking
    const [quizStartTime, setQuizStartTime] = useState(null);
    const [questionStartTime, setQuestionStartTime] = useState(null);
    const [questionTimings, setQuestionTimings] = useState({});
    const [elapsedTime, setElapsedTime] = useState(0);

    // Initialize questions based on filter
    useEffect(() => {
        if (!quiz || !quiz.questions) return;

        let filteredQuestions = [...quiz.questions];

        // Filter by selected level if provided
        if (selectedLevel !== null) {
            filteredQuestions = filteredQuestions.filter(q => q.level === selectedLevel);
        }

        if (filterType !== 'all' && previousResult && previousResult.answers) {
            filteredQuestions = quiz.questions.filter(q => {
                const userAnswer = previousResult.answers[q.id];
                const isUnattempted = userAnswer === undefined;

                // Helper to check correctness (copied from QuizResultAnalysis logic)
                let isCorrect = false;
                if (!isUnattempted) {
                    if (q.correctAnswers && q.correctAnswers.includes(userAnswer)) {
                        isCorrect = true;
                    } else if (q.options && Array.isArray(q.options) && typeof q.options[0] === 'object') {
                        const selectedOption = q.options[userAnswer];
                        isCorrect = selectedOption && selectedOption.isCorrect === true;
                    }
                }

                if (filterType === 'incorrect') return !isUnattempted && !isCorrect;
                if (filterType === 'unattempted') return isUnattempted;
                if (filterType === 'incorrect_unattempted') return isUnattempted || !isCorrect;
                return true;
            });
        }

        setQuestions(filteredQuestions);

        // Reset state for new set of questions
        setCurrentQuestionIndex(0);
        setAnswers({});
        setShowResults(false);
        const now = new Date();
        setQuizStartTime(now);
        setQuestionStartTime(now);

        // Initialize statuses
        const initialStatus = {};
        filteredQuestions.forEach(q => {
            initialStatus[q.id] = 'not-attempted';
        });
        setQuestionStatus(initialStatus);

    }, [quiz, filterType, previousResult]);

    // Timer effect - runs every second when quiz is active
    useEffect(() => {
        if (!showResults && quizStartTime && questions.length > 0) {
            const interval = setInterval(() => {
                setElapsedTime(Math.floor((new Date() - quizStartTime) / 1000));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [showResults, quizStartTime, questions.length]);

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="quiz-empty">
                <div className="empty-icon">🎯</div>
                <p>No quiz available for this topic yet!</p>
            </div>
        );
    }

    // If after filtering by level there are no questions
    // If after filtering by level there are no questions
    if (selectedLevel !== null && questions.length === 0) {
        return (
            <div className="quiz-empty">
                <div className="empty-icon">📚</div>
                <p>No questions found for the selected level.</p>
                <button className="btn-close" onClick={onClose}>← Back to Topics</button>
            </div>
        );
    }

    if (questions.length === 0 && filterType !== 'all') {
        return (
            <div className="quiz-empty">
                <div className="empty-icon">✨</div>
                <p>No questions match your retake criteria!</p>
                <button className="btn-close" onClick={onClose}>
                    ← Go Back
                </button>
            </div>
        );
    }

    if (questions.length === 0) return null; // Loading or empty

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Handle answer selection
    const handleAnswer = (questionId, answerIndex) => {
        // Record time taken for this question if not already answered
        if (answers[questionId] === undefined && questionStartTime) {
            const timeSpent = Math.round((new Date() - questionStartTime) / 1000);
            setQuestionTimings(prev => ({
                ...prev,
                [questionId]: timeSpent
            }));
        }

        setAnswers({
            ...answers,
            [questionId]: answerIndex
        });

        // Update status to attempted (unless already flagged)
        if (questionStatus[questionId] !== 'flagged') {
            setQuestionStatus({
                ...questionStatus,
                [questionId]: 'attempted'
            });
        }
    };

    // Toggle flag status
    const toggleFlag = (questionId) => {
        const current = questionStatus[questionId];
        const newStatus = current === 'flagged' ?
            (answers[questionId] !== undefined ? 'attempted' : 'not-attempted') :
            'flagged';

        setQuestionStatus({
            ...questionStatus,
            [questionId]: newStatus
        });
    };

    // Direct navigation to question
    const goToQuestion = (index) => {
        setCurrentQuestionIndex(index);
        setQuestionStartTime(new Date());
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const calculateScore = () => {
        let correct = 0;
        console.log('=== SCORE CALCULATION DEBUG ===');
        console.log('Total questions:', questions.length);
        console.log('User answers:', answers);

        questions.forEach((q, index) => {
            const userAnswer = answers[q.id];
            console.log(`\nQuestion ${index + 1} (ID: ${q.id}):`);
            console.log('  User answer index:', userAnswer);
            console.log('  correctAnswers array:', q.correctAnswers);
            console.log('  Options type:', typeof q.options?.[0]);
            console.log('  First option:', q.options?.[0]);

            if (userAnswer === undefined) {
                console.log('  Result: SKIPPED (no answer)');
                return;
            }

            // Check if correctAnswers array exists and includes the user's answer
            if (q.correctAnswers && q.correctAnswers.includes(userAnswer)) {
                correct++;
                console.log('  Result: CORRECT (via correctAnswers array)');
            }
            // Fallback: Check if options are objects with isCorrect property (JNVST style)
            else if (q.options && Array.isArray(q.options) && typeof q.options[0] === 'object') {
                const selectedOption = q.options[userAnswer];
                console.log('  Selected option:', selectedOption);
                if (selectedOption && selectedOption.isCorrect === true) {
                    correct++;
                    console.log('  Result: CORRECT (via isCorrect property)');
                } else {
                    console.log('  Result: WRONG');
                }
            } else {
                console.log('  Result: WRONG (no matching criteria)');
            }
        });

        console.log('\n=== FINAL SCORE:', correct, '/', questions.length, '===\n');
        return correct;
    };

    const submitResult = async () => {
        setSavingResult(true);
        const score = calculateScore();
        const percentage = Math.round((score / totalQuestions) * 100);
        const completedAt = new Date();
        const timeTaken = Math.round((completedAt - quizStartTime) / 1000);

        const userStr = localStorage.getItem('user');
        const currentUser = userStr ? JSON.parse(userStr) : null;

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
                subject: topic?.subject?.documentId,
                student: currentUser?.id
            });
            console.log('Quiz result saved successfully!');
            // Store result data for analysis
            setLastResult({
                score,
                totalQuestions,
                percentage,
                answers,
                questionTimings,
                timeTaken,
                quiz: quiz.documentId,
                topic: topic?.documentId
            });

        } catch (error) {
            console.error('Failed to save quiz result:', error);
        } finally {
            setSavingResult(false);
            setShowResults(true);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
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
        setElapsedTime(0);

        // Reset all statuses
        const initialStatus = {};
        questions.forEach(q => {
            initialStatus[q.id] = 'not-attempted';
        });
        setQuestionStatus(initialStatus);
    };

    // Get status class for question number
    const getStatusClass = (questionId) => {
        const status = questionStatus[questionId] || 'not-attempted';
        return status;
    };

    // Show analysis view if requested
    if (showAnalysis && lastResult) {
        return (
            <QuizResultAnalysis
                quizResult={lastResult}
                quiz={quiz}
                onClose={() => setShowAnalysis(false)}
            />
        );
    }

    // Results view
    if (showResults) {
        const score = calculateScore();
        const percentage = ((score / totalQuestions) * 100).toFixed(0);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

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

                <div className="results-actions">
                    <button className="btn-analysis" onClick={() => setShowAnalysis(true)}>
                        📊 View Detailed Analysis
                    </button>
                    <button className="btn-restart" onClick={handleRestart}>
                        🔄 Try Again
                    </button>
                    {onClose && (
                        <button className="btn-close" onClick={onClose}>
                            ← Back to Topics
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Quiz time limit (default to 60 minutes if not set)
    const totalTimeLimit = quiz.timeLimit || 3600; // in seconds

    // Full-screen quiz view
    return (
        <div className={`quiz-view ${isFullScreen ? 'quiz-fullscreen' : ''}`}>
            {/* Full-screen Header */}
            <div className="quiz-fullscreen-header">
                <button className="topic-toggle-btn" onClick={onClose}>
                    ← {topic?.name || 'Topics'}
                </button>
                <h1 className="quiz-title">{quiz.title}</h1>
                <div className="quiz-timer">
                    <span className="timer-elapsed">⏱️ {formatTime(elapsedTime)}</span>
                    <span className="timer-divider">/</span>
                    <span className="timer-total">{formatTime(totalTimeLimit)}</span>
                </div>
            </div>

            {/* Question Info Bar */}
            <div className="question-info-bar">
                <div className="question-counter">
                    Q: {currentQuestionIndex + 1}/{totalQuestions}
                </div>
                <div className="question-marks">
                    Marks: {currentQuestion.marks || 1}
                </div>
                <button
                    className={`flag-btn ${questionStatus[currentQuestion.id] === 'flagged' ? 'flagged' : ''}`}
                    onClick={() => toggleFlag(currentQuestion.id)}
                    title={questionStatus[currentQuestion.id] === 'flagged' ? 'Unflag question' : 'Flag for review'}
                >
                    {questionStatus[currentQuestion.id] === 'flagged' ? '🚩' : '⚑'}
                </button>
            </div>

            {/* Question Card */}
            <div className="quiz-content">
                <QuestionCard
                    question={currentQuestion}
                    selectedAnswer={answers[currentQuestion.id]}
                    onAnswer={(answerIndex) => handleAnswer(currentQuestion.id, answerIndex)}
                />
            </div>

            {/* Navigation Buttons */}
            <div className="quiz-navigation">
                <button
                    className="btn-nav btn-previous"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0 || savingResult}
                >
                    ◀ Previous
                </button>

                <button
                    className="btn-nav btn-next"
                    onClick={handleNext}
                    disabled={savingResult}
                >
                    {currentQuestionIndex === totalQuestions - 1 ? 'Next ▶' : 'Next ▶'}
                </button>

                <button
                    className="btn-submit"
                    onClick={submitResult}
                    disabled={savingResult}
                >
                    {savingResult ? 'Submitting...' : 'SUBMIT TEST'}
                </button>
            </div>

            {/* Question Palette */}
            <div className="question-palette-container">
                <div className="palette-header">
                    <span>Questions</span>
                </div>
                <div className="question-palette">
                    {questions.map((q, index) => (
                        <button
                            key={q.id}
                            className={`q-number ${getStatusClass(q.id)} ${index === currentQuestionIndex ? 'current' : ''}`}
                            onClick={() => goToQuestion(index)}
                            title={`Question ${index + 1} - ${getStatusClass(q.id).replace('-', ' ')}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div className="palette-legend">
                    <div className="legend-item">
                        <span className="legend-dot not-attempted"></span>
                        <span>Not Attempted</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot attempted"></span>
                        <span>Attempted</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot flagged"></span>
                        <span>Marked for Review</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizView;
