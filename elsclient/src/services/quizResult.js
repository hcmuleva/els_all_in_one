import api from './api';

export const quizResultAPI = {
    // Create a new quiz result
    create: async (data) => {
        const response = await api.post('/quiz-results', { data });
        return response.data;
    },

    // Get results for current user
    getMyResults: async () => {
        const response = await api.get(`/quiz-results`, {
            params: {
                'populate': ['quiz', 'topic', 'subject'],
                'sort': 'createdAt:desc'
            }
        });
        return response.data;
    },

    // Get results for a specific user (for admin/analytics)
    getUserResults: async (userId) => {
        const response = await api.get(`/quiz-results`, {
            params: {
                'filters[student][id][$eq]': userId,
                'populate': ['quiz', 'topic', 'subject'],
                'sort': 'createdAt:desc'
            }
        });
        return response.data;
    }
};
