import api from './api';
import { subjectAPI } from './subjects';

export const questionAPI = {
    // Get questions for a specific topic
    getByTopic: async (topicId, level = null) => {
        const params = {
            'filters[topicRef][documentId][$eq]': topicId,
            'populate': '*'
        };
        
        // Filter by level if provided
        if (level) {
            params['filters[level][$eq]'] = level;
        }
        
        const response = await api.get('/questions', { params });
        return response.data;
    },

    // Get questions for a specific subject
    getBySubject: async (subjectId, level = null) => {
        const params = {
            'filters[subjectRef][documentId][$eq]': subjectId,
            'populate': '*'
        };
        
        // Filter by level if provided
        if (level) {
            params['filters[level][$eq]'] = level;
        }
        
        const response = await api.get('/questions', { params });
        return response.data;
    },

    // Get one question from each topic for a subject (for GK3 quiz)
    getOnePerTopicForSubject: async (subjectId, level = null) => {
        // First get all topics for the subject
        const subjectResponse = await subjectAPI.getById(subjectId);
        const topics = subjectResponse.data?.topics || [];
        
        // Fetch one question from each topic
        const questions = [];
        for (const topic of topics) {
            const topicQuestions = await questionAPI.getByTopic(topic.documentId, level);
            if (topicQuestions.data && topicQuestions.data.length > 0) {
                // Pick the first question from this topic
                questions.push(topicQuestions.data[0]);
            }
        }
        
        return { data: questions };
    }
};

