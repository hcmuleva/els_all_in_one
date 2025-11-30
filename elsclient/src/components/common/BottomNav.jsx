import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { id: 'home', label: 'Home', icon: '🏠', path: '/' },
        { id: 'subjects', label: 'Subjects', icon: '📚', path: '/subjects' },
        { id: 'nearme', label: 'NearMe', icon: '📍', path: '/near-me' },
        { id: 'leaderboard', label: 'Leaders', icon: '🏆', path: '/leaderboard' },
        { id: 'profile', label: 'Me', icon: '👤', path: '/profile' },
    ];

    return (
        <div className="bottom-nav-container">
            <div className="bottom-nav glass">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <div className="nav-icon-wrapper">
                            <span className="nav-icon">{item.icon}</span>
                        </div>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BottomNav;
