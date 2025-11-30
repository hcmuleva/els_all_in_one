import api from './api';

export const nearMeAPI = {
    /**
     * Get all users with their addresses
     * @returns {Promise} List of users with home_address populated
     */
    getAllUsersWithAddresses: async () => {
        try {
            const response = await api.get('/users', {
                params: {
                    populate: 'home_address'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching users with addresses:', error);
            throw error;
        }
    },

    /**
     * Get current user's address
     * @param {number} userId - Current user ID
     * @returns {Promise} User with address data
     */
    getCurrentUserAddress: async (userId) => {
        try {
            const response = await api.get(`/users/${userId}`, {
                params: {
                    populate: 'home_address'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching current user address:', error);
            throw error;
        }
    }
};

export default nearMeAPI;
