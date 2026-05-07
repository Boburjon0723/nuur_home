import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getSettings } from '../services/api/settings';
import { mapAuthUserToAppUser } from '../utils/mapAuthUser';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showAuth, setShowAuth] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [settings, setSettings] = useState({
        site_name: 'Nuur Home',
        logo_url: '/favicon.svg',
        phone: '',
        address: '',
        work_hours: '',
        telegram_url: '',
        instagram_url: '',
        facebook_url: '',
        latitude: null,
        longitude: null
    });

    // LocalStorage dan yuklash va Settings yuklash
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedFavorites = localStorage.getItem('favorites');

        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

        // Load user from localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setCurrentUser(JSON.parse(savedUser));
            } catch (err) {
                console.error('Failed to parse user from localStorage:', err);
            }
        }

        const fetchSettings = async () => {
            const result = await getSettings();
            if (result.success) {
                setSettings(result.settings);
            }
        };
        fetchSettings();
    }, []);

    // LocalStorage ga saqlash
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }, [recentlyViewed]);

    // Recently viewed - ProductPage da mahsulot ko'rilganda qo'shiladi
    // useCallback: useEffect dependency bo'lsa har renderda yangi ref bo'lmasin (cheksiz loop oldini olish)
    const addToRecentlyViewed = useCallback((productId) => {
        if (!productId) return;
        setRecentlyViewed(prev => {
            if (prev[0] === productId) return prev;
            const filtered = prev.filter(id => id !== productId);
            return [productId, ...filtered].slice(0, 10);
        });
    }, []);

    const addToCart = useCallback((product, quantity = 1, selectedColor = null) => {
        setCart(prev => {
            const colorToUse = selectedColor || product.color || (product.colors && product.colors[0]);
            const cartItemId = `${product.id}-${colorToUse || 'default'}`;

            const existing = prev.find(item => item.cartItemId === cartItemId);
            if (existing) {
                return prev.map(item =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity, selectedColor: colorToUse, cartItemId }];
        });
    }, []);

    const removeFromCart = useCallback((cartItemId) => {
        setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    }, []);

    const updateQuantity = useCallback((cartItemId, quantity) => {
        setCart((prev) => {
            const item = prev.find((i) => i.cartItemId === cartItemId);
            const min = item?.is_kg ? 0.001 : 1;
            const q = Number(quantity);
            if (!Number.isFinite(q) || q < min) return prev;
            return prev.map((it) =>
                it.cartItemId === cartItemId ? { ...it, quantity: q } : it
            );
        });
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const calculatePrice = useCallback((product, quantity) => {
        if (!product || !product.priceRanges) return product?.price || 0;
        const range = product.priceRanges.find(r => quantity >= r.min && quantity <= r.max);
        const discount = range ? range.discount : 0;
        return product.price * (1 - discount / 100);
    }, []);

    const getTotalPrice = useCallback(() => {
        return cart.reduce((total, item) => {
            return total + calculatePrice(item, item.quantity) * item.quantity;
        }, 0);
    }, [cart, calculatePrice]);

    const getCartCount = useCallback(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    const toggleFavorite = useCallback((productId) => {
        setFavorites(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    }, []);

    const isFavorite = useCallback((productId) => {
        return favorites.includes(productId);
    }, [favorites]);

    const value = useMemo(
        () => ({
            currentUser,
            setCurrentUser,
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            calculatePrice,
            getTotalPrice,
            getCartCount,
            favorites,
            toggleFavorite,
            isFavorite,
            selectedProduct,
            setSelectedProduct,
            showAuth,
            setShowAuth,
            isLogin,
            setIsLogin,
            showPasswordRecovery,
            setShowPasswordRecovery,
            searchQuery,
            setSearchQuery,
            selectedCategory,
            setSelectedCategory,
            recentlyViewed,
            addToRecentlyViewed,
            settings,
            setSettings
        }),
        [
            currentUser,
            cart,
            favorites,
            selectedProduct,
            showAuth,
            isLogin,
            showPasswordRecovery,
            searchQuery,
            selectedCategory,
            recentlyViewed,
            settings,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            calculatePrice,
            getTotalPrice,
            getCartCount,
            toggleFavorite,
            isFavorite,
            addToRecentlyViewed
        ]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

