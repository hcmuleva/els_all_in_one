import api from './api';

export const quizAPI = {
    // Get quiz for a specific topic
    getByTopic: async (topicId) => {
        const response = await api.get(`/quizzes`, {
            params: {
                'filters[topic][documentId][$eq]': topicId,
                'populate': 'questions'
            }
        });
        return response.data;
    },

    // Get single quiz by ID with questions
    getById: async (id) => {
        const response = await api.get(`/quizzes`, {
            params: {
                'filters[id][$eq]': id,
                'populate': 'questions'
            }
        });
        // Return the first item from the list response
        return { data: response.data.data[0] };
    },

    // Get all quizzes
    getAll: async () => {
        const response = await api.get('/quizzes?populate=questions');
        return response.data;
    }
};

// Convenience function
export const fetchQuizForTopic = async (topicId) => {
    const data = await quizAPI.getByTopic(topicId);
    return data.data && data.data.length > 0 ? data.data[0] : null;
};
