// ==========================================
// src/contexts/AuthContext.jsx - AUTH KONTEKST
// ==========================================
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [role, setRole] = useState('user');

    useEffect(() => {
        // LocalStorage dan foydalanuvchini tekshirish
        const checkAuth = () => {
            const savedUser = localStorage.getItem('user');
            const token = localStorage.getItem('auth_token');

            if (savedUser && token) {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setRole(parsedUser.role || 'user');
                setIsAdmin(parsedUser.role === 'ADMIN');
            } else {
                setUser(null);
                setRole('user');
                setIsAdmin(false);
            }
            setLoading(false);
        };

        checkAuth();

        // Storage o'zgarganda (masalan, logout bo'lganda) holatni yangilash
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const value = {
        user,
        loading,
        isAdmin,
        role,
        setUser,
        setIsAdmin,
        setRole
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};