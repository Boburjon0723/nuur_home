// ==========================================
// src/services/api/categories.js - CATEGORIES API
// ==========================================
import api from '../api';

/**
 * Barcha kategoriyalarni olish
 */
export const getAllCategories = async () => {
    try {
        const categories = await api.get('/categories');
        return { success: true, categories: categories || [] };
    } catch (error) {
        console.error('getAllCategories API error:', error);
        return { success: false, error: error.message };
    }
};
