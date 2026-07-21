import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0); // decimal representation, e.g. 0.20 for 20%
    const { token, triggerStatsUpdate, fetchUserProfile } = useAuth();
    // Load cart from storage on startup
    useEffect(() => {
        const savedCart = localStorage.getItem('playrunners_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse saved cart:', e);
            }
        }
    }, []);
    // Save cart to local storage when changed
    const saveCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem('playrunners_cart', JSON.stringify(newCart));
    };
    const addToCart = (game) => {
        if (cart.some(item => item.id === game.id)) {
            return { success: false, message: 'Game already in your arsenal!' };
        }
        const newCart = [...cart, game];
        saveCart(newCart);
        return { success: true, message: 'Added to your arsenal!' };
    };
    const removeFromCart = (gameId) => {
        const newCart = cart.filter(item => item.id !== gameId);
        saveCart(newCart);
    };
    const clearCart = () => {
        saveCart([]);
        setCoupon('');
        setDiscount(0);
    };
    const applyDiscount = (code) => {
        if (code.toUpperCase() === 'GGWP') {
            setCoupon('GGWP');
            setDiscount(0.20); // 20% off
            return { success: true, message: 'Coupon GGWP applied! 20% discount activated.' };
        }
        return { success: false, message: 'Invalid coupon code.' };
    };
    const getSubtotal = () => {
        return cart.reduce((total, item) => total + parseFloat(item.price), 0);
    };
    const getTax = () => {
        const subtotal = getSubtotal();
        const discounted = subtotal * (1 - discount);
        return discounted * 0.08; // 8% estimated tax
    };
    const getTotal = () => {
        const subtotal = getSubtotal();
        const discounted = subtotal * (1 - discount);
        const tax = discounted * 0.08;
        return discounted + tax;
    };
    const checkout = async () => {
        if (!token) {
            return { success: false, error: 'Please log in to purchase.' };
        }
        if (cart.length === 0) {
            return { success: false, error: 'Your cart is empty.' };
        }
        try {
            const res = await fetch('http://localhost:5000/api/orders/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cartItems: cart,
                    totalAmount: getTotal()
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Checkout process failed.');
            }
            // Clear local state
            clearCart();

            // Update profile stats (user gets 500 XP and status updates on purchase)
            await triggerStatsUpdate({ xp_gain: 500, hours_gain: 10, matches_gain: 0 });
            await fetchUserProfile(); // Refresh user details
            return { success: true, message: 'Checkout completed successfully! View your library.' };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };
    return (
        <CartContext.Provider
            value={{
                cart,
                coupon,
                discount,
                addToCart,
                removeFromCart,
                clearCart,
                applyDiscount,
                getSubtotal,
                getTax,
                getTotal,
                checkout
            }}
        >
            {children}
        </CartContext.Provider>
    );
};