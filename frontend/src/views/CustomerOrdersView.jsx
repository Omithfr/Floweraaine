import React, { useState, useEffect } from 'react';
import { ArrowLeft, LoaderCircle, Package, Clock, BadgeCheck, Star } from 'lucide-react';
import { useStore } from '../store/store.jsx';
import { formatINR } from '../data.js';
import { Eyebrow } from '../components/SharedUI.jsx';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

export default function CustomerOrdersView() {
  const { customerUser, navigate, pushToast } = useStore();
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerUser) {
      navigate('home');
      return;
    }
    fetch(`${API_BASE}/api/orders/my-orders?email=${customerUser.email}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setMyOrders(data.orders);
        setLoading(false);
      })
      .catch(() => {
        pushToast({ kind: 'error', title: 'Error', body: 'Failed to load your orders.' });
        setLoading(false);
      });
  }, [customerUser, navigate, pushToast]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <button onClick={() => navigate('home')} className="fl-hover rounded-full p-2 text-[var(--muted-fg)]">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <Eyebrow>Your Profile</Eyebrow>
          <h1 className="fl-serif mt-2 text-4xl">Order History</h1>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <LoaderCircle className="h-8 w-8 animate-spin text-[var(--primary)]" />
          </div>
        ) : myOrders.length === 0 ? (
          <div className="glass rounded-[2rem] p-16 text-center text-[var(--muted-fg)]">
            <Package className="mx-auto h-12 w-12 opacity-50" />
            <h2 className="fl-serif mt-6 text-2xl text-[var(--fg)]">No orders yet</h2>
            <p className="mt-2">When you commission a piece, you can track its status here.</p>
            <button onClick={() => navigate('home', 'collection')} className="mt-6 rounded-full bg-[var(--fg)] px-6 py-3 text-sm font-medium text-[var(--bg)] transition-transform hover:scale-105">
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {myOrders.map(order => (
              <div key={order._id} className="glass flex flex-col gap-6 rounded-[1.75rem] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-[var(--muted-fg)]">{order.orderId}</span>
                    {order.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-[var(--fg)]">
                        <Clock className="h-3 w-3" /> Pending Verification
                      </span>
                    ) : (
                      <span className="fl-soft-success inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-[var(--success)]">
                        <BadgeCheck className="h-3 w-3" /> Approved & Crafting
                      </span>
                    )}
                  </div>
                  <h3 className="fl-serif mt-3 text-2xl">{order.product.name}</h3>
                  <p className="mt-1 text-sm text-[var(--muted-fg)]">Qty: {order.quantity} · Total: {formatINR(order.total)}</p>
                </div>
                {order.status === 'verified' && (
                  <button onClick={() => navigate('home', 'reviews')} className="fl-shadow-primary flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-[var(--primary-fg)] transition-transform hover:scale-105">
                    <Star className="h-4 w-4" /> Review Piece
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}