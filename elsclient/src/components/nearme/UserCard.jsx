import React from 'react';
import './UserCard.css';

const UserCard = ({ user, distance }) => {
    const { username, email, home_address } = user;
    const address = home_address;

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return username?.charAt(0).toUpperCase() || '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return parts[0].charAt(0) + parts[1].charAt(0);
        }
        return name.charAt(0).toUpperCase();
    };

    // Get distance category for styling
    const getDistanceClass = () => {
        if (distance === null) return 'unknown';
        if (distance < 1) return 'near';
        if (distance < 5) return 'medium';
        return 'far';
    };

    // Format distance
    const formatDistance = () => {
        if (distance === null) return 'Unknown';
        if (distance < 1) return `${Math.round(distance * 1000)} m`;
        return `${distance.toFixed(1)} km`;
    };

    return (
        <div className="user-card">
            <div className="user-avatar">
                {getInitials(username)}
            </div>

            <div className="user-info">
                <h3 className="user-name">{username}</h3>
                {address && (
                    <p className="user-location">
                        📍 {address.address_line2 || address.city || 'Unknown'}
                    </p>
                )}
                <p className="user-email">{email}</p>
            </div>

            <div className={`distance-badge ${getDistanceClass()}`}>
                <span className="distance-icon">🎯</span>
                <span className="distance-text">{formatDistance()}</span>
            </div>
        </div>
    );
};

export default UserCard;
