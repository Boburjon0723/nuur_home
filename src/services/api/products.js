// ==========================================
// src/services/api/products.js - BACKEND API BILAN ISHLASH
// ==========================================
import api from '../api';

/**
 * Barcha faol mahsulotlarni olish
 */
export const getAllProducts = async (onlyActive = true) => {
    try {
        const data = await api.get('/products');
        // Backend'dan kelayotgan formatni Frontend'ga moslash
        const products = (data.products || data || []).map(p => ({
            ...p,
            price: Number(p.sale_price || p.price || 0),
            // Backendda 'category' obyekti ichida 'name' bor
            category: p.category?.name || p.category_id || '',
            // Ba'zi joylarda 'categories' (plural) kutishi mumkin, uni ham string sifatida saqlaymiz
            categories: p.category ? { name: p.category.name } : null,
            images: Array.isArray(p.images) ? p.images : (p.image_url ? [p.image_url] : [])
        }));

        return { success: true, products };
    } catch (error) {
        console.error('getAllProducts API error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Bitta mahsulotni ID bo'yicha olish
 */
export const getProductById = async (productId) => {
    try {
        const product = await api.get(`/products/${productId}`);
        return {
            success: true,
            product: {
                ...product,
                price: Number(product.sale_price || product.price || 0),
                // Backendda 'category' obyekti ichida 'name' bor
                category: product.category?.name || product.category_id || '',
                // Ba'zi joylarda 'categories' kutishi mumkin
                categories: product.category ? { name: product.category.name } : null,
                images: Array.isArray(product.images) ? product.images : (product.image_url ? [product.image_url] : [])
            }
        };
    } catch (error) {
        console.error('getProductById API error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Barcha ranglar kutubxonasini olish
 */
export const getAllColors = async () => {
    try {
        const colors = await api.get('/colors');
        return { success: true, colors: colors || [] };
    } catch (error) {
        console.error('getAllColors API error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Qidiruv
 */
export const searchProducts = async (searchTerm) => {
    try {
        const data = await api.get(`/products/search?q=${searchTerm}`);
        return { success: true, products: data || [] };
    } catch (error) {
        console.error('searchProducts API error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * ID'lar ro'yxati bo'yicha mahsulotlarni olish
 */
export const getProductsByIds = async (ids) => {
    try {
        if (!ids || ids.length === 0) return { success: true, products: [] };
        const res = await api.get(`/products/by-ids?ids=${ids.join(',')}`);
        return { success: true, products: res || [] };
    } catch (error) {
        console.error('getProductsByIds API error:', error);
        return { success: false, error: error.message };
    }
};
