import api from './api';

export const subjectAPI = {
    getAll: async () => {
        const response = await api.get('/subjects', {
            params: {
                populate: {
                    topics: {
                        populate: ['contents']
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
