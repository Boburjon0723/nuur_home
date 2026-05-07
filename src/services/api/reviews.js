// src/services/api/reviews.js
import api from '../api';

export const getProductReviews = async (productId) => {
    try {
        const res = await api.get(`/reviews/${productId}`);
        if (res.data.success) {
            return {
                success: true,
                reviews: res.data.reviews
            };
        }
        return { success: false, reviews: [] };
    } catch (error) {
        console.error('getProductReviews error:', error);
        return { success: false, reviews: [] };
    }
};

export const addReview = async (reviewData) => {
    try {
        const res = await api.post('/reviews', reviewData);
        if (res.data.success) {
            return { success: true, review: res.data.review };
        }
        return { success: false, error: res.data.error };
    } catch (error) {
        console.error('addReview error:', error);
        return { success: false, error: error.message };
    }
};
