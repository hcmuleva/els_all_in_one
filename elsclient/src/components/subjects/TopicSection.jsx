import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import QuizView from '../quiz/QuizView';
import { fetchQuizForTopic } from '../../services/quiz';
import './TopicSection.css';

const TopicSection = ({ topic, subjectName, onVideoClick }) => {
    const [viewMode, setViewMode] = useState('videos'); // 'videos' or 'quiz'
    const [quiz, setQuiz] = useState(null);
    const [loadingQuiz, setLoadingQuiz] = useState(false);

    const contents = topic.contents || [];

    useEffect(() => {
        // Fetch quiz when component mounts
        const loadQuiz = async () => {
            if (!topic.documentId) return;

            setLoadingQuiz(true);
            try {
                const quizData = await fetchQuizForTopic(topic.documentId);
                setQuiz(quizData);
            } catch (error) {
                console.error('Error loading quiz:', error);
            } finally {
                setLoadingQuiz(false);
            }
        };

        loadQuiz();
    }, [topic.documentId]);

    if (contents.length === 0 && !quiz) {
        return null; // Don't show empty topics
    }

    // Topic emojis for visual appeal
    const topicEmojis = {
        'ImpossibleToPossible': '✨',
        'magicofScience': '⚗️',
        'MindCalculation': '🧮',
        'History': '📜',
        'Geography': '🗺️',
        'state': '🏛️',
        'country': '🌍',
        'animal': '🦁',
        'hospital&Doctors': '👨‍⚕️',
        'Waste2Best': '♻️',
        'ProductOfWaste': '🧴',
        'Navodaya': '🏫',
        'Olympiads': '🥇',
        'Science': '🔬',
        'GK': '🌐',
        'DIY': '🔨',
        'ThoughOftheDay': '💭',
        'Puzzle': '🧩',
        'moral': '🦉',
        'motivation': '💪',
        'isnpiring': '🌟'
    };

    const emoji = topicEmojis[topic.name] || '📚';

    return (
        <div className="topic-section">
            <div className="topic-section-header">
                <span className="topic-emoji">{emoji}</span>
                <h2 className="topic-title">{topic.name}</h2>
                <span className="topic-count">
                    {viewMode === 'videos' ? `${contents.length} videos` : 'Quiz Time!'}
                </span>
            </div>

            {/* Toggle Tabs */}
            <div className="view-toggle-tabs">
                <button
                    className={`toggle-tab ${viewMode === 'videos' ? 'active' : ''}`}
                    onClick={() => setViewMode('videos')}
                >
                    📚 Videos
                </button>
                <button
                    className={`toggle-tab ${viewMode === 'quiz' ? 'active' : ''}`}
                    onClick={() => setViewMode('quiz')}
                    disabled={!quiz && !loadingQuiz}
                >
                    🎯 Quiz {!quiz && !loadingQuiz && '(Coming Soon)'}
                </button>
            </div>

            {/* Content based on view mode */}
            {viewMode === 'videos' ? (
                <div className="video-carousel-container">
                    <div className="video-carousel">
                        {contents.map((content) => (
                            <div key={content.id} className="carousel-video-item">
                                <VideoCard
                                    title={content.title}
                                    youtubeUrl={content.youtubeurl}
                                    onClick={() => onVideoClick(content.youtubeurl)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {loadingQuiz ? (
                        <div className="quiz-loading">
                            <div className="spinner"></div>
                            <p>Loading quiz...</p>
                        </div>
                    ) : quiz ? (
                        <QuizView
                            quiz={quiz}
                            topic={topic}
                            subjectName={subjectName}
                            onClose={() => setViewMode('videos')}
                        />
                    ) : (
                        <div className="no-quiz">
                            <p>📝 Quiz coming soon for this topic!</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TopicSection;
