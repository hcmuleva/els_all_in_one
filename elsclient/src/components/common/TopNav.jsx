import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import avatar from '../../assets/avatar-student.png';
import './TopNav.css';

const TopNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const navItems = [
        { id: 'home', label: 'Home', path: '/dashboard' },
        { id: 'subjects', label: 'Subjects', path: '/subjects' },
        { id: 'gk3', label: 'GK3', path: '/gk3' },
        { id: 'nearme', label: '📍 NearMe', path: '/near-me' },
        { id: 'leaderboard', label: 'Leaderboard', path: '/leaderboard' },
        { id: 'profile', label: 'My Profile', path: '/profile' },
    ];

    return (
        <div className="top-nav-container glass">
            <div className="top-nav-content container">
                <div className="nav-left" onClick={() => navigate('/dashboard')}>
                    <img src={logo} alt="ELS Logo" className="nav-logo" />
                    <span className="nav-title">ELS</span>
                </div>

                <div className="nav-center">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            className={`top-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="nav-right">
                    <div className="nav-user-info" onClick={() => navigate('/profile')}>
                        <span className="nav-username">{user?.username || 'Student'}</span>
                        <img src={avatar} alt="Profile" className="nav-avatar" />
                    </div>
                    <button className="btn-logout" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopNav;
