// ==========================================
// src/services/api/orders.js - ORDERS API
// ==========================================
import api from '../api';

/**
 * Yangi buyurtma yaratish
 */
export const createOrder = async (orderData) => {
    try {
        // Backend'ga mos formatga keltirish
        const payload = {
            customer_name: orderData.customerInfo.name,
            customer_phone: orderData.customerInfo.phone,
            customer_address: orderData.customerInfo.address || '',
            total: orderData.totalPrice,
            note: orderData.customerInfo.notes || '',
            payment_status: orderData.payment_status || 'unpaid',
            payment_method_detail: orderData.paymentMethodDetail || null,
            source: orderData.source || 'website',
            customer_id: orderData.userId !== 'guest' ? orderData.userId : null,
            order_items: orderData.products.map(item => ({
                product_id: item.id,
                product_name: typeof item.name === 'object' ? item.name.uz : item.name,
                quantity: Number(item.quantity),
                product_price: Number(item.price),
                color: item.selectedColor || item.color || null,
                size: item.size || null,
                image_url: item.image || item.image_url || null
            }))
        };

        const result = await api.post('/orders', payload);
        return { success: true, orderId: result.id || result.orderId };
    } catch (error) {
        console.error('createOrder API error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Foydalanuvchi buyurtmalarini olish
 */
export const getUserOrders = async (userId) => {
    try {
        const data = await api.get(`/orders/customer/${userId}`);
        return { success: true, orders: data || [] };
    } catch (error) {
        console.error('getUserOrders API error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Buyurtmani ID bo'yicha olish
 */
export const getOrderById = async (orderId) => {
    try {
        const order = await api.get(`/orders/${orderId}`);
        return { success: true, order };
    } catch (error) {
        console.error('getOrderById API error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * To'lov chekini yuklash
 */
export const uploadReceipt = async (orderId, file) => {
    try {
        const formData = new FormData();
        formData.append('files', file);

        const uploadResult = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/upload/multiple`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });

        const uploadData = await uploadResult.json();
        if (!uploadResult.ok) throw new Error(uploadData.message || 'Fayl yuklashda xatolik');
        const receiptUrl = uploadData.urls?.[0];
        if (!receiptUrl) throw new Error('Fayl yuklashda xatolik');

        await api.put(`/orders/${orderId}`, { receipt_url: receiptUrl });

        return { success: true, url: receiptUrl };
    } catch (error) {
        console.error('uploadReceipt API error:', error);
        return { success: false, error: error.message };
    }
};

