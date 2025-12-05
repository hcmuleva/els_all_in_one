import React, { useState } from 'react';
import './DetailedSubjectCard.css';

const DetailedSubjectCard = ({
    subject,
    progress = 0,
    onClick,
    className = '',
    selected = false,
    videoUrl = null
}) => {
    const [isPlaying, setIsPlaying] = useState(false);

    // Extract video ID from YouTube URL
    const getVideoId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getVideoId(videoUrl);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1` : null;

    const handlePlayClick = (e) => {
        e.stopPropagation();
        setIsPlaying(true);
    };

    const handleCardClick = (e) => {
        // Don't trigger card click if clicking on video controls
        if (isPlaying) return;
        onClick && onClick(subject);
    };

    // Calculate lessons count (assuming topics = lessons)
    const lessonCount = subject.topics ? subject.topics.length : 0;

    // Hardcoded for now as per requirement or estimation
    const duration = "8 weeks";

    return (
        <div
            className={`detailed-subject-card ${className} ${selected ? 'selected' : ''}`}
            onClick={handleCardClick}
        >
            {/* Top Section - Video or Image */}
            {(videoUrl || subject.imageUrl) && (
                <div className="card-media">
                    {isPlaying && embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title={subject.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="card-video-iframe"
                        />
                    ) : (
                        <div className="media-placeholder">
                            {subject.imageUrl ? (
                                <img src={subject.imageUrl} alt={subject.name} className="card-image" />
                            ) : (
                                <div className="placeholder-bg">
                                    <span className="placeholder-icon">📷</span>
                                </div>
                            )}

                            {videoUrl && (
                                <button className="play-button" onClick={handlePlayClick}>
                                    <span className="play-icon">▶</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Content Section */}
            <div className="card-content">
                <div className="card-header">
                    <span className="badge category-badge">Development</span>
                    <span className="badge enrolled-badge">Enrolled</span>
                </div>

                <h3 className="card-title">{subject.name}</h3>
                <p className="card-author">{subject.author || 'Instructor'}</p>

                <p className="card-description">
                    {subject.description || 'Learn the fundamentals of this subject.'}
                </p>

                <div className="card-meta">
                    <div className="meta-item">
                        <span className="meta-icon">🕒</span>
                        <span>{duration}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-icon">📖</span>
                        <span>{lessonCount} lessons</span>
                    </div>
                </div>

                <div className="progress-section">
                    <div className="progress-header">
                        <span>Progress</span>
                        <span className="progress-percentage">{Math.round(progress)}%</span>
                    </div>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailedSubjectCard;
