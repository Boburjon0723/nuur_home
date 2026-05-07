// src/services/api/siteBenefits.js
import api from '../api';

export const getSiteBenefits = async () => {
    try {
        // Hozircha bo'sh massiv qaytaramiz
        return { success: true, benefits: [] };
    } catch (error) {
        console.error('getSiteBenefits error:', error);
        return { success: false, benefits: [] };
    }
};
