import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import avatar from '../assets/avatar-student.png';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('points');

    // Mock Data
    const userDetails = {
        firstName: user?.firstName || 'Alex',
        lastName: user?.lastName || 'Explorer',
        grade: 'Grade 5',
        school: 'Springfield Elementary',
        email: user?.email || 'alex@example.com',
        joinDate: 'September 2023',
    };

    const pointsData = {
        total: 1250,
        weekly: 150,
        breakdown: [
            { category: 'Math', points: 450, color: 'var(--color-primary-500)' },
            { category: 'Science', points: 320, color: 'var(--color-success-500)' },
            { category: 'History', points: 280, color: 'var(--color-warning-500)' },
            { category: 'Arts', points: 200, color: 'var(--color-accent-500)' },
        ]
    };

    const achievements = [
        { id: 1, title: 'Math Whiz', icon: '🧮', date: 'Oct 12, 2023', description: 'Completed 10 Math lessons with perfect score.' },
        { id: 2, title: 'Early Bird', icon: '🌅', date: 'Nov 05, 2023', description: 'Logged in before 8 AM for 5 days in a row.' },
        { id: 3, title: 'Science Fair', icon: '🧪', date: 'Nov 20, 2023', description: 'Submitted a science project.' },
        { id: 4, title: 'Bookworm', icon: '📚', date: 'Dec 01, 2023', description: 'Read 5 stories in the library.' },
    ];

    return (
        <div className="profile-page container">
            {/* Professional Header */}
            <Card className="profile-header-card glass">
                <div className="profile-header-content">
                    <div className="profile-avatar-wrapper">
                        <img src={avatar} alt="Profile" className="profile-avatar-large" />
                        <div className="profile-badge">🌟</div>
                    </div>
                    <div className="profile-info-primary">
                        <h1>{userDetails.firstName} {userDetails.lastName}</h1>
                        <p className="profile-role">{userDetails.grade} Student</p>
                        <div className="profile-stats-mini">
                            <span>🏫 {userDetails.school}</span>
                            <span>📅 Joined {userDetails.joinDate}</span>
                        </div>
                    </div>
                    <div className="profile-actions">
                        <button className="btn-primary">Edit Profile</button>
                    </div>
                </div>
            </Card>

            {/* Tabbed Content */}
            <div className="profile-content-wrapper">
                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'points' ? 'active' : ''}`}
                        onClick={() => setActiveTab('points')}
                    >
                        My Points
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
                        onClick={() => setActiveTab('achievements')}
                    >
                        My Achievements
                    </button>
                </div>

                <div className="tab-content animate-fade-in">
                    {activeTab === 'points' && (
                        <div className="points-view">
                            <Card className="total-points-card">
                                <div className="total-points-value">{pointsData.total}</div>
                                <div className="total-points-label">Total Points Earned</div>
                            </Card>

                            <div className="points-breakdown-grid">
                                {pointsData.breakdown.map((item) => (
                                    <Card key={item.category} className="point-category-card">
                                        <div className="point-cat-header" style={{ color: item.color }}>
                                            {item.category}
                                        </div>
                                        <div className="point-cat-value">{item.points}</div>
                                        <div className="point-progress-bg">
                                            <div
                                                className="point-progress-fill"
                                                style={{ width: `${(item.points / 500) * 100}%`, backgroundColor: item.color }}
                                            ></div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'achievements' && (
                        <div className="achievements-grid">
                            {achievements.map((ach) => (
                                <Card key={ach.id} className="achievement-card" hoverable>
                                    <div className="achievement-icon">{ach.icon}</div>
                                    <div className="achievement-details">
                                        <h3>{ach.title}</h3>
                                        <p>{ach.description}</p>
                                        <span className="achievement-date">{ach.date}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
