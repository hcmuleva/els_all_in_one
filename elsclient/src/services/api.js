import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

// Create axios instance
const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token expiration
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ==================== AUTH APIs ====================
export const authAPI = {
    login: async (identifier, password) => {
        const response = await api.post('/auth/local', {
            identifier,
            password,
        });
        return response.data;
    },

    register: async (username, email, password) => {
        const response = await api.post('/auth/local/register', {
            username,
            email,
            password,
        });
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/users/me', {
            params: {
                populate: '*',
            },
        });
        return response.data;
    },
};

// ==================== ORG APIs ====================
export const orgAPI = {
    getAll: async () => {
        const response = await api.get('/orgs', {
            params: {
                populate: '*',
            },
        });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/orgs/${id}`, {
            params: {
                populate: '*',
            },
        });
        return response.data;
    },
};

// ==================== KIT APIs ====================
export const kitAPI = {
    getAll: async (orgId = null) => {
        const params = {
            populate: ['images', 'org', 'kitlevels'],
        };
        if (orgId) {
            params.filters = { org: { id: orgId } };
        }
        const response = await api.get('/kits', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/kits/${id}`, {
            params: {
                populate: ['images', 'org', 'kitlevels', 'kitlevels.lessons'],
            },
        });
        return response.data;
    },
};

// ==================== LESSON APIs ====================
export const lessonAPI = {
    getAll: async (kitId = null, kitlevelId = null) => {
        const params = {
            populate: ['lesson_multimedia', 'kit', 'kitlevel', 'resources'],
        };
        const filters = {};
        if (kitId) filters.kit = { id: kitId };
        if (kitlevelId) filters.kitlevel = { id: kitlevelId };
        if (Object.keys(filters).length > 0) {
            params.filters = filters;
        }
        const response = await api.get('/lessons', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/lessons/${id}`, {
            params: {
                populate: ['lesson_multimedia', 'kit', 'kitlevel', 'resources'],
            },
        });
        return response.data;
    },
};

// ==================== USER LESSON APIs ====================
export const userLessonAPI = {
    getMy: async () => {
        const response = await api.get('/user-lessons', {
            params: {
                populate: ['lesson', 'lesson.lesson_multimedia', 'user', 'org'],
            },
        });
        return response.data;
    },

    updateProgress: async (id, progress, isCompleted = false) => {
        const response = await api.put(`/user-lessons/${id}`, {
            data: {
                progress,
                is_completed: isCompleted,
            },
        });
        return response.data;
    },

    create: async (lessonId, orgId) => {
        const response = await api.post('/user-lessons', {
            data: {
                lesson: lessonId,
                org: orgId,
                progress: 0,
                is_active: true,
                is_completed: false,
                is_locked: false,
            },
        });
        return response.data;
    },
};

// ==================== QUIZ APIs ====================
export const quizAPI = {
    getAll: async (kitId = null) => {
        const params = {
            populate: ['questions', 'kits'],
        };
        if (kitId) {
            params.filters = { kits: { id: kitId } };
        }
        const response = await api.get('/quizzes', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/quizzes/${id}`, {
            params: {
                populate: ['questions', 'questions.choices', 'kits'],
            },
        });
        return response.data;
    },
};

// ==================== QUIZ RESULT APIs ====================
export const quizResultAPI = {
    getMy: async () => {
        const response = await api.get('/quiz-results', {
            params: {
                populate: ['quiz', 'user'],
            },
        });
        return response.data;
    },

    submit: async (quizId, answers, score, totalQuestions) => {
        const response = await api.post('/quiz-results', {
            data: {
                quiz: quizId,
                answers,
                score,
                totalQuestions,
                completedAt: new Date().toISOString(),
            },
        });
        return response.data;
    },
};

// ==================== KIT PROGRESS APIs ====================
export const kitProgressAPI = {
    getMy: async () => {
        const response = await api.get('/kitprogresses', {
            params: {
                populate: ['kit', 'kitlevel', 'users_permissions_user', 'org'],
            },
        });
        return response.data;
    },

    create: async (kitId, kitlevelId, orgId) => {
        const response = await api.post('/kitprogresses', {
            data: {
                kit: kitId,
                kitlevel: kitlevelId,
                org: orgId,
                kit_status: 'in-progress',
                started_at: new Date().toISOString(),
            },
        });
        return response.data;
    },

    update: async (id, status, notes = null) => {
        const data = {
            kit_status: status,
        };
        if (status === 'completed') {
            data.completed_at = new Date().toISOString();
        }
        if (notes) {
            data.notes = notes;
        }
        const response = await api.put(`/kitprogresses/${id}`, { data });
        return response.data;
    },
};

// ==================== SUBSCRIPTION APIs ====================
export const subscriptionAPI = {
    getMy: async () => {
        const response = await api.get('/kitsubscriptions', {
            params: {
                populate: ['kit', 'pricing', 'users_permissions_user', 'org'],
            },
        });
        return response.data;
    },
};

// ==================== TEAM APIs ====================
export const teamAPI = {
    getAll: async () => {
        const response = await api.get('/teams', {
            params: {
                populate: ['org'],
            },
        });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/teams/${id}`, {
            params: {
                populate: ['players', 'org'],
            },
        });
        return response.data;
    },
};

export default api;
