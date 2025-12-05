import api from './api';
import { questionAPI } from './question';

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

// Convenience function - tries to find existing quiz, otherwise creates virtual quiz from questions
export const fetchQuizForTopic = async (topicId, level = null) => {
    console.log(`[fetchQuizForTopic] Fetching quiz for topic: ${topicId}, level: ${level}`);
    
    // First, try to find an existing quiz entity
    try {
        const quizData = await quizAPI.getByTopic(topicId);
        console.log(`[fetchQuizForTopic] Quiz entity response:`, quizData);
        
        if (quizData.data && quizData.data.length > 0) {
            console.log(`[fetchQuizForTopic] Found existing quiz entity`);
            return quizData.data[0];
        }
    } catch (error) {
        console.warn(`[fetchQuizForTopic] Error fetching quiz entity:`, error);
    }

    // If no quiz entity exists, fetch questions directly from topic
    console.log(`[fetchQuizForTopic] No quiz entity found, fetching questions directly from topic`);
    try {
        const questionsData = await questionAPI.getByTopic(topicId, level);
        console.log(`[fetchQuizForTopic] Questions response:`, questionsData);
        
        if (!questionsData.data || questionsData.data.length === 0) {
            console.log(`[fetchQuizForTopic] No questions found for topic ${topicId} at level ${level}`);
            return null;
        }

        console.log(`[fetchQuizForTopic] Found ${questionsData.data.length} questions, creating virtual quiz`);

        // Create a virtual quiz object from the questions
        // This matches the structure expected by QuizView component
        const virtualQuiz = {
            id: `virtual-${topicId}-${level || 'all'}`,
            documentId: `virtual-${topicId}-${level || 'all'}`,
            title: 'Topic Quiz',
            description: 'Quiz generated from topic questions',
            questions: questionsData.data.map(q => ({
                id: q.id || q.documentId,
                documentId: q.documentId,
                questionText: q.questionText,
                questionType: q.questionType,
                options: q.options,
                correctAnswers: q.correctAnswers,
                explanation: q.explanation,
                points: q.points || 1,
                marks: q.points || 1,
                difficulty: q.difficulty,
                level: q.level,
                ...q // Include all other fields
            })),
            timeLimit: 3600, // Default 60 minutes
            difficulty: 'medium'
        };

        console.log(`[fetchQuizForTopic] Created virtual quiz with ${virtualQuiz.questions.length} questions`);
        return virtualQuiz;
    } catch (error) {
        console.error(`[fetchQuizForTopic] Error fetching questions:`, error);
        throw error;
    }
};
