import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { seedReviews, products as localProducts } from '../data.js';

// Enhanced check to safely catch both localhost and local IP addresses for live production
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : '';
const emptyCustomization = { occasion: '', text: '', note: '', photoUrl: null, photoName: null };

export const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [view, setView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customization, setCustomizationState] = useState(emptyCustomization);
  const [quantity, setQuantityState] = useState(1);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState(seedReviews);
  const [contactOpen, setContactOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  // --- DYNAMIC PRODUCTS STATE ---
  // Falls back to data.js initially, then overrides with MongoDB data
  const [products, setProducts] = useState(localProducts); 

  // --- CUSTOMER AUTHENTICATION STATE ---
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [customerUser, setCustomerUserState] = useState(() => {
    try {
      const savedUser = localStorage.getItem('customerData');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch { return null; }
  });

  // --- FETCH PRODUCTS FROM MONGODB ---
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      if (data.success && data.products && data.products.length > 0) {
        // Map MongoDB _id to id so the frontend doesn't break
        const mappedProducts = data.products.map(p => ({ ...p, id: p._id }));
        setProducts(mappedProducts);
      }
    } catch (err) {
      console.error('Failed to fetch catalog from database:', err);
    }
  }, []);

  // Fetch products on initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- BROWSER HISTORY API (BACK BUTTON FIX) ---
  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state && e.state.view) {
        setView(e.state.view);
      } else {
        setView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setCustomerUser = useCallback((user) => {
    setCustomerUserState(user);
  }, []);

  const navigate = useCallback((next, anchor) => {
    setView(next);
    // Push the state to browser history
    window.history.pushState({ view: next }, '', `/${next === 'home' ? '' : next}`);
    
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }),
    );
  }, []);

  const selectProduct = useCallback((product) => {
    setSelectedProduct(product);
    setCustomizationState(emptyCustomization);
    setQuantityState(1);
    navigate('customize');
  }, [navigate]);

  const setCustomization = useCallback((patch) => setCustomizationState((prev) => ({ ...prev, ...patch })), []);
  const setQuantity = useCallback((q) => setQuantityState(Math.min(10, Math.max(1, Math.round(q)))), []);
  
  const dismissToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  const pushToast = useCallback((toast) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { ...toast, id }]);
    window.setTimeout(() => dismissToast(id), 6500);
  }, [dismissToast]);

  const addOrder = useCallback((order) => setOrders((prev) => [order, ...prev]), []);

  const approveOrder = useCallback((orderId) => {
    setOrders((prev) => prev.map(o => o.id === orderId ? { ...o, status: 'verified' } : o));
    pushToast({ kind: 'success', title: 'Order Approved', body: `Order ${orderId} has been verified.` });
  }, [pushToast]);

  const addReview = useCallback((review) => setReviews((prev) => [review, ...prev]), []);

  const handleLogout = useCallback(() => {
    setCustomerUserState(null);
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerData');
    pushToast({ kind: 'info', title: 'Signed out', body: 'You have been successfully signed out.' });
    navigate('home');
  }, [pushToast, navigate]);

  const value = useMemo(() => ({
    view, navigate, selectedProduct, selectProduct, customization, setCustomization, quantity, setQuantity,
    orders, addOrder, approveOrder, lastVerifiedOrder: orders.find(o => o.status === 'verified') ?? null,
    reviews, addReview, contactOpen, setContactOpen, toasts, pushToast, dismissToast,
    customerUser, setCustomerUser, showAuthModal, setShowAuthModal, handleLogout,
    products, fetchProducts // Exposing dynamic products and the fetch trigger
  }), [view, navigate, selectedProduct, selectProduct, customization, setCustomization, quantity, setQuantity,
    orders, addOrder, approveOrder, reviews, addReview, contactOpen, toasts, pushToast, dismissToast,
    customerUser, setCustomerUser, showAuthModal, setShowAuthModal, handleLogout, products, fetchProducts]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}