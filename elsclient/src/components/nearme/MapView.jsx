import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapView.css';

// Fix for default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const currentUserIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const otherUserIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const MapView = ({ users, currentUserLocation, currentUser }) => {
    if (!currentUserLocation) {
        return (
            <div className="map-error">
                <p>Unable to load map - location not available</p>
            </div>
        );
    }

    // Format distance for display
    const formatDistance = (distanceKm) => {
        if (distanceKm === null || distanceKm === undefined) return 'Unknown';
        if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
        return `${distanceKm.toFixed(1)} km`;
    };

    return (
        <div className="map-container">
            <MapContainer
                center={[currentUserLocation.lat, currentUserLocation.lng]}
                zoom={12}
                style={{ height: '600px', width: '100%', borderRadius: '12px' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Current User Marker */}
                <Marker
                    position={[currentUserLocation.lat, currentUserLocation.lng]}
                    icon={currentUserIcon}
                >
                    <Popup>
                        <div className="map-popup">
                            <h3>📍 You are here</h3>
                            <p><strong>{currentUser.username}</strong></p>
                            <p className="popup-coords">
                                {currentUserLocation.lat.toFixed(4)}°N,{' '}
                                {currentUserLocation.lng.toFixed(4)}°E
                            </p>
                        </div>
                    </Popup>
                </Marker>

                {/* Radius Circle around current user */}
                <Circle
                    center={[currentUserLocation.lat, currentUserLocation.lng]}
                    radius={5000} // 5km radius
                    pathOptions={{
                        color: '#667eea',
                        fillColor: '#667eea',
                        fillOpacity: 0.1,
                        weight: 2,
                        dashArray: '5, 5'
                    }}
                />

                {/* Other User Markers */}
                {users.map(user => {
                    if (!user.location) return null;

                    return (
                        <Marker
                            key={user.id}
                            position={[user.location.lat, user.location.lng]}
                            icon={otherUserIcon}
                        >
                            <Popup>
                                <div className="map-popup">
                                    <h3>👤 {user.username}</h3>
                                    {user.home_address?.address_line2 && (
                                        <p className="popup-location">
                                            📍 {user.home_address.address_line2}
                                        </p>
                                    )}
                                    <p className="popup-distance">
                                        🎯 <strong>{formatDistance(user.distance)}</strong> away
                                    </p>
                                    <p className="popup-email">{user.email}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            <div className="map-legend">
                <div className="legend-item">
                    <span className="legend-marker blue">📍</span>
                    <span>You</span>
                </div>
                <div className="legend-item">
                    <span className="legend-marker red">📍</span>
                    <span>Other Users ({users.length})</span>
                </div>
                <div className="legend-item">
                    <span className="legend-circle">⭕</span>
                    <span>5km Radius</span>
                </div>
            </div>
        </div>
    );
};

export default MapView;
