import api from './api';

export const quizResultAPI = {
    // Create a new quiz result
    create: async (data) => {
        const response = await api.post('/quiz-results', { data });
        return response.data;
    },

    // Get results for a user (optional for now)
    getUserResults: async (userId) => {
        const response = await api.get(`/quiz-results`, {
            params: {
                'filters[user][id][$eq]': userId,
                'populate': ['quiz', 'topic']
            }
        });
        return response.data;
    }
};
