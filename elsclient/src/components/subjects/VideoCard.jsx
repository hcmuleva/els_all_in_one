import React from 'react';
import './VideoCard.css';

const VideoCard = ({ title, youtubeUrl, onClick, className = '' }) => {
    // Extract video ID to get thumbnail
    const getThumbnail = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11)
            ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
            : null;
    };

    const thumbnailUrl = getThumbnail(youtubeUrl);

    return (
        <div className={`video-card glass ${className}`} onClick={onClick}>
            <div className="video-thumbnail-wrapper">
                {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={title} className="video-thumbnail" />
                ) : (
                    <div className="video-placeholder">▶️</div>
                )}
                <div className="play-overlay">
                    <span className="play-icon">▶</span>
                </div>
            </div>
            <div className="video-info">
                <h3 className="video-title">{title}</h3>
            </div>
        </div>
    );
};

export default VideoCard;
