import { useEffect, useMemo, useState } from 'react';
import Card from '../common/Card';
import { fetchYouTubeShorts, fetchYouTubeShortsByChannel } from '../../services/youtubeShorts';
import './YouTubeShortsTabs.css';

const TAB_CONFIG = [
    { id: 'animated', label: 'Animated Concepts', query: 'animated concept learning shorts' },
    { id: 'gk', label: 'General Knowledge', query: 'general knowledge shorts facts' },
    { id: 'history', label: 'History', query: 'history shorts storytelling' },
    { id: 'creativity', label: 'Creativity', query: 'creativity hacks shorts' },
    { id: 'tips', label: 'Tips & Tricks', query: 'study tips tricks shorts' },
    { id: 'fun', label: 'Fun Finds', query: 'fun educational shorts' },
    { id: 'stories', label: 'Story Shorts', channel: '@toon-stories-new', maxResults: 20 },
];

const YouTubeShortsTabs = () => {
    const [activeTab, setActiveTab] = useState(TAB_CONFIG[0].id);
    const [videosByTab, setVideosByTab] = useState({});
    const [loadingTab, setLoadingTab] = useState('');
    const [errorTab, setErrorTab] = useState('');
    const [selectedVideoId, setSelectedVideoId] = useState(null);

    const activeVideos = useMemo(() => videosByTab[activeTab] || [], [videosByTab, activeTab]);

    useEffect(() => {
        let isCancelled = false;

        const loadVideos = async () => {
            if (activeVideos.length > 0) {
                setSelectedVideoId((prev) => prev || activeVideos[0]?.id || null);
                return;
            }

            setLoadingTab(activeTab);
            setErrorTab('');

            try {
                const tabConfig = TAB_CONFIG.find((tab) => tab.id === activeTab);
                let videos = [];

                if (!tabConfig) {
                    throw new Error('Unknown tab selected');
                }

                if (tabConfig.channel) {
                    videos = await fetchYouTubeShortsByChannel(tabConfig.channel, tabConfig.maxResults);
                } else {
                    videos = await fetchYouTubeShorts(tabConfig.query, tabConfig.maxResults);
                }

                if (isCancelled) return;

                setVideosByTab((prev) => ({
                    ...prev,
                    [activeTab]: videos,
                }));
                setSelectedVideoId(videos[0]?.id || null);
            } catch (error) {
                if (!isCancelled) {
                    setErrorTab(error.message || 'Unable to load shorts');
                }
            } finally {
                if (!isCancelled) {
                    setLoadingTab('');
                }
            }
        };

        loadVideos();

        return () => {
            isCancelled = true;
        };
    }, [activeTab, activeVideos.length]);

    return (
        <Card className="shorts-card glass-panel">
            <div className="shorts-card-header">
                <div className="header-icon-wrapper">
                    <span className="header-icon">🎬</span>
                </div>
                <div>
                    <h3>Quick Learning Shorts</h3>
                    <p>Pick a theme to explore fun 1-minute lessons!</p>
                </div>
            </div>

            <div className="shorts-tabs-container">
                <div className="shorts-tabs">
                    {TAB_CONFIG.map((tab) => (
                        <button
                            key={tab.id}
                            className={`shorts-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedVideoId(null);
                                setActiveTab(tab.id);
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {errorTab && (
                <div className="shorts-error animate-fade-in">
                    <div className="error-icon">⚠️</div>
                    <span>{errorTab}</span>
                </div>
            )}

            {loadingTab === activeTab && (
                <div className="shorts-loading animate-fade-in">
                    <div className="spinner-small" />
                    <span>Finding cool videos...</span>
                </div>
            )}

            <div className="shorts-content-layout">
                {!errorTab && selectedVideoId && (
                    <div className="shorts-player-wrapper animate-scale-in">
                        <div className="shorts-player">
                            <iframe
                                title="YouTube Shorts player"
                                src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=0&modestbranding=1&rel=0`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}

                {!errorTab && activeVideos.length > 0 && (
                    <div className="shorts-list-wrapper">
                        <div className="shorts-carousel">
                            {activeVideos.map((video) => (
                                <button
                                    key={video.id}
                                    className={`shorts-thumbnail ${selectedVideoId === video.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedVideoId(video.id)}
                                >
                                    <div className="thumbnail-image-wrapper">
                                        <img src={video.thumbnail} alt={video.title} />
                                        <div className="play-overlay">▶️</div>
                                    </div>
                                    <div className="shorts-thumbnail-info">
                                        <span className="shorts-thumbnail-title">{video.title}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default YouTubeShortsTabs;

