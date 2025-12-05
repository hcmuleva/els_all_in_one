import React, { useState, useEffect } from 'react';
import DetailedSubjectCard from '../components/subjects/DetailedSubjectCard';
import TopicSection from '../components/subjects/TopicSection';
import VideoPlayer from '../components/subjects/VideoPlayer';
import './SubjectsPage.css';
import { fetchSubjectsWithContent } from '../services/subjects';
import { quizResultAPI } from '../services/quizResult';

const SubjectsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [playingVideo, setPlayingVideo] = useState(null);
    const [subjectProgress, setSubjectProgress] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const [subjectsData, quizResults] = await Promise.all([
                    fetchSubjectsWithContent(),
                    quizResultAPI.getMyResults()
                ]);

                setSubjects(subjectsData);

                // Calculate progress
                const progressMap = {};
                const results = quizResults.data || [];

                subjectsData.forEach(subject => {
                    const totalTopics = subject.topics ? subject.topics.length : 0;
                    if (totalTopics === 0) {
                        progressMap[subject.id] = 0;
                        return;
                    }

                    // Get unique topics attempted for this subject
                    const attemptedTopics = new Set();
                    results.forEach(result => {
                        if (result.subject && result.subject.id === subject.id && result.topic) {
                            attemptedTopics.add(result.topic.id);
                        }
                    });

                    const progress = (attemptedTopics.size / totalTopics) * 100;
                    progressMap[subject.id] = Math.min(100, Math.max(0, progress));
                });

                setSubjectProgress(progressMap);

                // Auto-select first subject
                if (subjectsData && subjectsData.length > 0) {
                    setSelectedSubject(subjectsData[0]);
                }
            } catch (err) {
                console.error("Error loading subjects:", err);
                setError('Failed to load subjects. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSubjectClick = (subject) => {
        setSelectedSubject(subject);
    };

    const handleVideoClick = (videoUrl) => {
        setPlayingVideo(videoUrl);
    };

    const handleClosePlayer = () => {
        setPlayingVideo(null);
    };

    if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading Subjects...</p></div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="subjects-page container">
            <div className="subjects-header">
                <h1>Explore Subjects 🚀</h1>
                <p>Select a subject and scroll through topics</p>
            </div>

            {/* Subjects Carousel - Always visible */}
            <div className="carousel-container animate-slide-up">
                <div className="carousel-track">
                    {subjects.map((subject) => (
                        <div key={subject.id} className="carousel-item-wrapper">
                            <DetailedSubjectCard
                                subject={subject}
                                progress={subjectProgress[subject.id] || 0}
                                selected={selectedSubject && selectedSubject.id === subject.id}
                                onClick={() => handleSubjectClick(subject)}
                                className="carousel-item"
                                // Assuming subject might have a videoUrl or imageUrl field in the future
                                // For now, passing null or mock if needed. 
                                // If the subject has a video, pass it here.
                                videoUrl={subject.videoUrl}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Topic Sections (when subject is selected) */}
            {selectedSubject && (
                <div className="topics-content animate-fade-in">
                    {selectedSubject.topics && selectedSubject.topics.length > 0 ? (
                        selectedSubject.topics.map((topic) => (
                            <TopicSection
                                key={topic.id}
                                topic={topic}
                                subject={selectedSubject}
                                subjectName={selectedSubject.name}
                                onVideoClick={handleVideoClick}
                            />
                        ))
                    ) : (
                        <div className="no-topics">
                            <p>No topics found for this subject.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Video Player Modal */}
            {playingVideo && (
                <VideoPlayer videoUrl={playingVideo} onClose={handleClosePlayer} />
            )}
        </div>
    );
};

export default SubjectsPage;
