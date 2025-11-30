import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import nearMeAPI from '../services/nearMeAPI';
import { calculateDistance } from '../utils/geoUtils';
import UserCard from '../components/nearme/UserCard';
import MapView from '../components/nearme/MapView';
import './NearMe.css';

const NearMe = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserLocation, setCurrentUserLocation] = useState(null);
    const [error, setError] = useState(null);
    const [activeView, setActiveView] = useState('cards'); // 'cards' or 'map'

    useEffect(() => {
        loadNearbyUsers();
    }, []);

    const loadNearbyUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            // Get current user's location
            const currentUserData = await nearMeAPI.getCurrentUserAddress(currentUser.id);

            if (!currentUserData.home_address || !currentUserData.home_address.latitude || !currentUserData.home_address.longitude) {
                setError('Your location is not set. Please update your address in settings.');
                setLoading(false);
                return;
            }

            const myLocation = {
                lat: parseFloat(currentUserData.home_address.latitude),
                lng: parseFloat(currentUserData.home_address.longitude)
            };
            setCurrentUserLocation(myLocation);

            // Get all users with addresses
            const allUsers = await nearMeAPI.getAllUsersWithAddresses();

            // Filter out current user and users without addresses
            const otherUsers = allUsers.filter(u =>
                u.id !== currentUser.id &&
                u.home_address &&
                u.home_address.latitude &&
                u.home_address.longitude
            );

            // Calculate distances and sort
            const usersWithDistance = otherUsers.map(u => {
                const distance = calculateDistance(
                    myLocation.lat,
                    myLocation.lng,
                    parseFloat(u.home_address.latitude),
                    parseFloat(u.home_address.longitude)
                );

                return {
                    ...u,
                    distance,
                    location: {
                        lat: parseFloat(u.home_address.latitude),
                        lng: parseFloat(u.home_address.longitude)
                    }
                };
            });

            // Sort by distance (nearest first)
            usersWithDistance.sort((a, b) => (a.distance || 999) - (b.distance || 999));

            setUsers(usersWithDistance);
        } catch (err) {
            console.error('Error loading nearby users:', err);
            setError('Failed to load nearby users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="nearme-container">
                <div className="nearme-loading">
                    <div className="spinner"></div>
                    <p>Finding users near you...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="nearme-container">
                <div className="nearme-error">
                    <div className="error-icon">📍</div>
                    <h2>Location Not Available</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="nearme-container">
                <div className="nearme-empty">
                    <div className="empty-icon">🔍</div>
                    <h2>No Nearby Users Found</h2>
                    <p>There are no other users in your area yet.</p>
                    <p className="empty-subtitle">Check back later!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="nearme-container">
            <div className="nearme-header">
                <h1>📍 NearMe</h1>
                <p className="nearme-subtitle">
                    Discover learners near you • {users.length} {users.length === 1 ? 'user' : 'users'} found
                </p>
                {currentUserLocation && (
                    <p className="nearme-location">
                        Your location: {currentUserLocation.lat.toFixed(4)}°N, {currentUserLocation.lng.toFixed(4)}°E
                    </p>
                )}
            </div>

            {/* View Tabs */}
            <div className="view-tabs">
                <button
                    className={`tab-button ${activeView === 'cards' ? 'active' : ''}`}
                    onClick={() => setActiveView('cards')}
                >
                    <span className="tab-icon">📋</span>
                    Card View
                </button>
                <button
                    className={`tab-button ${activeView === 'map' ? 'active' : ''}`}
                    onClick={() => setActiveView('map')}
                >
                    <span className="tab-icon">🗺️</span>
                    Map View
                </button>
            </div>

            {/* Card View */}
            {activeView === 'cards' && (
                <div className="users-grid">
                    {users.map(user => (
                        <UserCard
                            key={user.id}
                            user={user}
                            distance={user.distance}
                        />
                    ))}
                </div>
            )}

            {/* Map View */}
            {activeView === 'map' && (
                <MapView
                    users={users}
                    currentUserLocation={currentUserLocation}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

export default NearMe;
