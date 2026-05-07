// ==========================================
// src/services/api/auth.js - AUTH API SERVIS
// ==========================================
import api from '../api';

/**
 * Ro'yxatdan o'tish
 */
export const register = async (userData) => {
    try {
        const payload = {
            email: userData.email,
            password: userData.password,
            fullname: userData.name,
            phone: userData.phone,
            address: userData.address || ''
        };
        const result = await api.post('/auth/register', payload);
        if (result.token) {
            localStorage.setItem('auth_token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        return { success: true, user: result.user };
    } catch (error) {
        console.error('Register API error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Login
 */
export const login = async (email, password) => {
    try {
        const result = await api.post('/auth/login', { email, password });
        if (result.token) {
            localStorage.setItem('auth_token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        return { success: true, user: result.user };
    } catch (error) {
        console.error('Login API error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Parolni tiklash (email yuborish)
 */
export const resetPassword = async (email) => {
    try {
        const result = await api.post('/auth/reset-password', { email });
        return { success: true, message: result.message };
    } catch (error) {
        console.error('ResetPassword API error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Profilni yangilash
 */
export const updateProfile = async (profileData) => {
    try {
        const result = await api.put('/auth/profile', profileData);
        if (result.user) {
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        return { success: true, user: result.user };
    } catch (error) {
        console.error('UpdateProfile API error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Parolni o'zgartirish
 */
export const changePassword = async (currentPassword, newPassword) => {
    try {
        await api.put('/auth/change-password', { currentPassword, newPassword });
        return { success: true };
    } catch (error) {
        console.error('ChangePassword API error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Chiqish
 */
export const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return { success: true };
};
