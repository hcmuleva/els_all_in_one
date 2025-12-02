import api from './api';

export const subjectAPI = {
    getAll: async () => {
        const response = await api.get('/subjects', {
            params: {
                populate: {
                    topics: {
                        populate: ['contents', 'subject']
                    }
                }
            }
        });
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/subjects/${id}`, {
            params: {
                populate: {
                    topics: {
                        populate: ['contents', 'subject']
                    }
                }
            }
        });
        return response.data;
    }
};

// Convenience export for backwards compatibility
export const fetchSubjectsWithContent = async () => {
    const result = await subjectAPI.getAll();
    return result.data;
};
