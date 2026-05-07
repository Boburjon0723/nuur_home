// src/services/api/messages.js
import api from '../api';

export const createContactMessage = async (formData) => {
    try {
        const result = await api.post('/messages', formData);
        return { success: true, message: result.message };
    } catch (error) {
        console.error('createContactMessage API error:', error);
        return { success: false, error: error.message };
    }
};
