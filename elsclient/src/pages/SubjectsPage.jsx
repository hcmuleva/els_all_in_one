import React, { useState, useEffect } from 'react';
import SubjectCard from '../components/subjects/SubjectCard';
import TopicSection from '../components/subjects/TopicSection';
import VideoPlayer from '../components/subjects/VideoPlayer';
import './SubjectsPage.css';
import { fetchSubjectsWithContent } from '../services/subjects';

const SubjectsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [playingVideo, setPlayingVideo] = useState(null);

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                const data = await fetchSubjectsWithContent();
                setSubjects(data);
                // Auto-select first subject
                if (data && data.length > 0) {
                    setSelectedSubject(data[0]);
                }
            } catch (err) {
                setError('Failed to load subjects. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadSubjects();
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
                        <SubjectCard
                            key={subject.id}
                            title={subject.name}
                            icon="📚"
                            selected={selectedSubject && selectedSubject.id === subject.id}
                            onClick={() => handleSubjectClick(subject)}
                            className="carousel-item"
                        />
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
