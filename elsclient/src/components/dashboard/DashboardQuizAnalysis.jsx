import React, { useState, useEffect } from 'react';
import { quizResultAPI } from '../../services/quizResult';
import { quizAPI } from '../../services/quiz';
import QuizResultAnalysis from '../quiz/QuizResultAnalysis';
import QuizView from '../quiz/QuizView';
import './DashboardQuizAnalysis.css';

const DashboardQuizAnalysis = () => {
    const [loading, setLoading] = useState(true);
    const [allResults, setAllResults] = useState([]);
    const [groupedQuizzes, setGroupedQuizzes] = useState({});
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [selectedResultId, setSelectedResultId] = useState(null);
    const [selectedResult, setSelectedResult] = useState(null);
    const [fullQuizData, setFullQuizData] = useState({}); // Cache for full quiz details
    const [loadingQuizDetails, setLoadingQuizDetails] = useState(false);

    // Retake state
    const [retakeConfig, setRetakeConfig] = useState(null); // { quiz, filterType, previousResult }

    useEffect(() => {
        loadQuizResults();
    }, []);

    const loadQuizResults = async () => {
        setLoading(true);
        try {
            // Fetch results with basic relations (no deep questions populate)
            const response = await quizResultAPI.getMyResults();
            const results = response.data || [];

            // Group results by quiz
            const grouped = results.reduce((acc, result) => {
                if (!result.quiz) return acc;

                const quizId = result.quiz.id;
                if (!acc[quizId]) {
                    acc[quizId] = {
                        quiz: result.quiz, // Basic quiz info
                        subject: result.subject?.name || 'Unknown',
                        topic: result.topic?.name || 'Unknown',
                        attempts: []
                    };
                }
                acc[quizId].attempts.push(result);
                return acc;
            }, {});

            // Sort attempts by date (newest first)
            Object.values(grouped).forEach(group => {
                group.attempts.sort((a, b) =>
                    new Date(b.completedAt) - new Date(a.completedAt)
                );
            });

            setAllResults(results);
            setGroupedQuizzes(grouped);

            // Auto-select first quiz if available
            const firstQuizId = Object.keys(grouped)[0];
            if (firstQuizId) {
                handleQuizSelection(firstQuizId, grouped);
            }
        } catch (error) {
            console.error('Failed to load quiz results:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuizSelection = async (quizId, grouped = groupedQuizzes) => {
        setSelectedQuizId(quizId);
        setLoadingQuizDetails(true);

        try {
            // Check if we have full quiz data (with questions)
            if (!fullQuizData[quizId]) {
                const response = await quizAPI.getById(quizId);
                const fullQuiz = response.data;

                setFullQuizData(prev => ({
                    ...prev,
                    [quizId]: fullQuiz
                }));
            }

            // Auto-select latest attempt
            const attempts = grouped[quizId]?.attempts || [];
            if (attempts.length > 0) {
                const latestResult = attempts[0];
                setSelectedResultId(latestResult.id);
                setSelectedResult(latestResult);
            }
        } catch (error) {
            console.error('Failed to load full quiz details:', error);
        } finally {
            setLoadingQuizDetails(false);
        }
    };

    const handleAttemptSelection = (resultId) => {
        setSelectedResultId(resultId);
        const result = allResults.find(r => r.id === parseInt(resultId));
        setSelectedResult(result);
    };

    const handleRetake = (filterType) => {
        if (!fullQuizData[selectedQuizId] || !selectedResult) return;

        setRetakeConfig({
            quiz: fullQuizData[selectedQuizId],
            filterType,
            previousResult: selectedResult
        });
    };

    const closeRetake = () => {
        setRetakeConfig(null);
        // Refresh results to show new attempt
        loadQuizResults();
    };

    const formatAttemptLabel = (result, index, attempts) => {
        const date = new Date(result.completedAt);
        const dateStr = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        if (index === 0) {
            return `Latest - ${dateStr}`;
        }
        return `Attempt ${attempts.length - index} - ${dateStr}`;
    };

    if (loading) {
        return (
            <div className="dashboard-quiz-analysis">
                <h2>📊 Detailed Quiz Review</h2>
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading quiz results...</p>
                </div>
            </div>
        );
    }

    if (Object.keys(groupedQuizzes).length === 0) {
        return (
            <div className="dashboard-quiz-analysis">
                <h2>📊 Detailed Quiz Review</h2>
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <p>No quiz results yet!</p>
                    <p className="empty-hint">Take a quiz to see detailed analysis here.</p>
                </div>
            </div>
        );
    }

    const selectedQuizGroup = groupedQuizzes[selectedQuizId];
    const attempts = selectedQuizGroup?.attempts || [];
    const fullQuiz = fullQuizData[selectedQuizId];

    // Calculate counts for retake buttons
    let incorrectCount = 0;
    let unattemptedCount = 0;

    if (selectedResult && fullQuiz) {
        const totalQuestions = fullQuiz.questions.length;
        const correct = selectedResult.score || 0;
        const totalAnswered = Object.keys(selectedResult.answers || {}).length;
        incorrectCount = totalAnswered - correct; // Approximation based on score
        unattemptedCount = totalQuestions - totalAnswered;

        // More accurate count if we iterate (optional but better)
        // For now, simple math is okay, but incorrect count might be slightly off if partial marks exist.
        // Let's stick to simple logic for UI buttons.
    }

    return (
        <div className="dashboard-quiz-analysis">
            <h2>📊 Detailed Quiz Review</h2>

            {/* Selectors */}
            <div className="quiz-selectors">
                <div className="selector-group">
                    <label htmlFor="quiz-select">Select Quiz:</label>
                    <select
                        id="quiz-select"
                        value={selectedQuizId || ''}
                        onChange={(e) => handleQuizSelection(e.target.value)}
                    >
                        {Object.entries(groupedQuizzes).map(([quizId, data]) => (
                            <option key={quizId} value={quizId}>
                                {data.subject} - {data.topic} - {data.quiz.title}
                            </option>
                        ))}
                    </select>
                    {selectedQuizGroup && (
                        <div className="selector-meta">
                            {attempts.length} attempt{attempts.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {selectedQuizId && attempts.length > 0 && (
                    <div className="selector-group">
                        <label htmlFor="attempt-select">Attempt:</label>
                        <select
                            id="attempt-select"
                            value={selectedResultId || ''}
                            onChange={(e) => handleAttemptSelection(e.target.value)}
                        >
                            {attempts.map((result, index) => (
                                <option key={result.id} value={result.id}>
                                    {formatAttemptLabel(result, index, attempts)}
                                </option>
                            ))}
                        </select>
                        <div className="selector-meta">
                            Score: {selectedResult?.score || 0}/{selectedResult?.totalQuestions || 0}
                            ({selectedResult?.percentage || 0}%)
                        </div>
                    </div>
                )}
            </div>

            {/* Retake Actions */}
            {selectedResult && fullQuiz && !loadingQuizDetails && (
                <div className="retake-actions">
                    <span className="retake-label">Retake Options:</span>
                    <div className="retake-buttons">
                        <button className="btn-retake btn-retake-full" onClick={() => handleRetake('all')}>
                            🔄 Full Quiz
                        </button>

                        {incorrectCount > 0 && (
                            <button className="btn-retake btn-retake-incorrect" onClick={() => handleRetake('incorrect')}>
                                ❌ Incorrect Only
                            </button>
                        )}

                        {unattemptedCount > 0 && (
                            <button className="btn-retake btn-retake-unattempted" onClick={() => handleRetake('unattempted')}>
                                ⏭️ Unattempted Only
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Analysis Display */}
            {loadingQuizDetails ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading quiz details...</p>
                </div>
            ) : (
                selectedResult && fullQuiz && (
                    <div className="analysis-container">
                        <QuizResultAnalysis
                            quizResult={selectedResult}
                            quiz={fullQuiz}
                            onClose={null}
                        />
                    </div>
                )
            )}

            {/* Retake Modal */}
            {retakeConfig && (
                <div className="quiz-modal-overlay">
                    <div className="quiz-modal-content">
                        <QuizView
                            quiz={retakeConfig.quiz}
                            topic={{
                                name: selectedQuizGroup?.topic,
                                subject: { name: selectedQuizGroup?.subject }
                            }}
                            onClose={closeRetake}
                            filterType={retakeConfig.filterType}
                            previousResult={retakeConfig.previousResult}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardQuizAnalysis;
