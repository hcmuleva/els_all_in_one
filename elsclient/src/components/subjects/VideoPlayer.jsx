import React from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl, onClose }) => {
    // Extract video ID from YouTube URL
    const getVideoId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getVideoId(videoUrl);

    if (!videoId) {
        return (
            <div className="video-player-overlay" onClick={onClose}>
                <div className="video-player-container">
                    <div className="video-error">
                        <p>Invalid video URL</p>
                        <button className="btn-close" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        );
    }

    // YouTube iframe embed URL with parameters for better UX
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

    return (
        <div className="video-player-overlay" onClick={onClose}>
            <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
                <button className="btn-close-player" onClick={onClose}>
                    ✕
                </button>
                <div className="video-wrapper">
                    <iframe
                        src={embedUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        allowFullScreen
                        className="video-iframe"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
