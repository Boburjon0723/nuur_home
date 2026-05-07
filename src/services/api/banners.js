// src/services/api/banners.js
import api from '../api';

export const getActiveBanners = async () => {
    try {
        // Backend'da bannerlar yo'llari bo'lsa api.get('/banners') ishlatiladi
        // Hozircha bo'sh massiv qaytaramiz
        return { success: true, banners: [] };
    } catch (error) {
        console.error('getActiveBanners error:', error);
        return { success: false, banners: [] };
    }
};
