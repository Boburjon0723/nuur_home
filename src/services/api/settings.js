// src/services/api/settings.js
import api from '../api';

export const getSettings = async () => {
    try {
        const res = await api.get('/settings');
        if (res.success) {
            return {
                success: true,
                settings: res.settings
            };
        }
        return { success: false, error: res.error };
    } catch (error) {
        console.error('getSettings error:', error);
        return { success: false, error: error.message };
    }
};
