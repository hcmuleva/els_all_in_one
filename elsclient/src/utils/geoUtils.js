/**
 * Geolocation Utilities
 * Haversine formula for calculating distance between two coordinates
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    // Handle null or undefined values
    if (!lat1 || !lon1 || !lat2 || !lon2) {
        return null;
    }

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export function formatDistance(distanceKm) {
    if (distanceKm === null || distanceKm === undefined) {
        return 'Unknown';
    }

    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    }

    return `${distanceKm.toFixed(1)} km`;
}

/**
 * Get distance category for styling
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Category: 'near', 'medium', 'far'
 */
export function getDistanceCategory(distanceKm) {
    if (distanceKm === null || distanceKm === undefined) {
        return 'unknown';
    }

    if (distanceKm < 1) return 'near';
    if (distanceKm < 5) return 'medium';
    return 'far';
}
