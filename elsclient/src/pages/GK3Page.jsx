import React, { useState, useEffect } from 'react';
import { subjectAPI } from '../services/subjects';
import { fetchQuizForTopic } from '../services/quiz';
import QuizView from '../components/quiz/QuizView';
import './GK3Page.css';

const GK3Page = () => {
    console.log("GK3Page");
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [debugData, setDebugData] = useState(null);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [topicQuizzes, setTopicQuizzes] = useState({});
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizError, setQuizError] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(1); // Level 1, 2, or 3
    const SUBJECT_ID = "gvzucbgegjcfiz5ojzugwj9l";

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                // Fetch specific GK3 subject by ID
                const response = await subjectAPI.getById(SUBJECT_ID);
                console.log("GK3 API Response:", response);
                setDebugData(response);

                const gk3Subject = response.data;

                if (gk3Subject && gk3Subject.topics) {
                    console.log("Topics:", gk3Subject.topics);
                    setTopics(gk3Subject.topics);
                } else {
                    console.warn("GK3 Subject found but no topics or invalid structure:", gk3Subject);
                }
            } catch (error) {
                console.error("Failed to fetch GK3 topics:", error);
                setDebugData({ error: error.message });
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    const handleTopicClick = async (topic) => {
        if (!topic?.documentId) return;

        setSelectedTopicId(topic.documentId);
        setQuizError(null);

        // Create cache key with level
        const cacheKey = `${topic.documentId}-level-${selectedLevel}`;

        // Use cached quiz if available for this level
        if (topicQuizzes[cacheKey]) {
            return;
        }

        setQuizLoading(true);
        try {
            // Fetch quiz with level filter
            const quizData = await fetchQuizForTopic(topic.documentId, selectedLevel);
            if (!quizData || !quizData.questions || quizData.questions.length === 0) {
                setQuizError(`No questions found for ${topic.name} at Level ${selectedLevel}.`);
                return;
            }
            setTopicQuizzes(prev => ({
                ...prev,
                [cacheKey]: quizData
            }));
        } catch (error) {
            console.error('Failed to load quiz:', error);
            setQuizError('Failed to load quiz. Please try again.');
        } finally {
            setQuizLoading(false);
        }
    };

    const handleCloseQuiz = () => {
        setSelectedTopicId(null);
        setQuizError(null);
    };

    const selectedTopic = topics.find(topic => topic.documentId === selectedTopicId);
    const cacheKey = selectedTopicId ? `${selectedTopicId}-level-${selectedLevel}` : null;
    const selectedQuiz = cacheKey ? topicQuizzes[cacheKey] : null;

    if (loading) {
        return (
            <div className="gk3-page container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (topics.length === 0) {
        return (
            <div className="gk3-page container">
                <h1 className="gk3-title">General Knowledge (GK3)</h1>
                <div className="error-message">
                    <p>No topics found.</p>
                    <details style={{ marginTop: '1rem', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                        <summary>Debug Info</summary>
                        <pre style={{ textAlign: 'left', overflow: 'auto' }}>
                            {JSON.stringify(debugData, null, 2)}
                        </pre>
                    </details>
                </div>
            </div>
        );
    }

    return (
        <div className="gk3-page container">
            <h1 className="gk3-title">General Knowledge (GK3)</h1>
            
            {/* Level Selection */}
            <div className="gk3-level-selector">
                <label htmlFor="level-select">Select Level: </label>
                <select 
                    id="level-select" 
                    value={selectedLevel} 
                    onChange={e => {
                        setSelectedLevel(parseInt(e.target.value));
                        // Clear cached quizzes when level changes
                        setTopicQuizzes({});
                        setSelectedTopicId(null);
                    }}
                >
                    <option value={1}>Level 1</option>
                    <option value={2}>Level 2</option>
                    <option value={3}>Level 3</option>
                </select>
            </div>

            <div className="gk3-grid">
                {topics.map((topic) => (
                    <button
                        type="button"
                        key={topic.id}
                        className="gk3-card"
                        onClick={() => handleTopicClick(topic)}
                    >
                        <div className="gk3-icon">{topic.icon || '📚'}</div>
                        <h3 className="gk3-topic-name">{topic.name}</h3>
                        <p className="gk3-card-cta">Play Quiz</p>
                    </button>
                ))}
            </div>

            {selectedTopicId && (
                <div className="gk3-quiz-overlay">
                    <div className="gk3-quiz-shell">
                        {quizLoading && !selectedQuiz ? (
                            <div className="gk3-quiz-loading">
                                <div className="loading-spinner small"></div>
                                <p>Loading quiz...</p>
                                <button className="gk3-quiz-close" onClick={handleCloseQuiz}>
                                    Cancel
                                </button>
                            </div>
                        ) : quizError ? (
                            <div className="gk3-quiz-error">
                                <p>{quizError}</p>
                                <button className="gk3-quiz-close" onClick={handleCloseQuiz}>
                                    Back to topics
                                </button>
                            </div>
                        ) : selectedQuiz ? (
                            <QuizView
                                quiz={selectedQuiz}
                                topic={selectedTopic}
                                subjectName="GK3"
                                onClose={handleCloseQuiz}
                            />
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GK3Page;
