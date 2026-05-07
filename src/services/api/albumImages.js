// src/services/api/albumImages.js
import api from '../api';

export const getAlbumImages = async () => {
    try {
        const data = await api.get('/album');
        return { success: true, images: data || [] };
    } catch (error) {
        console.error('getAlbumImages API error:', error);
        return { success: false, error: error.message };
    }
};
