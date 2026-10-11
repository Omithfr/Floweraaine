import React, { useState, useEffect } from 'react';
import { ArrowLeft, LoaderCircle, Package, Clock, BadgeCheck, Star, ChevronDown, ChevronUp, FileImage, Type, ScrollText, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../store/store.jsx';
import { formatINR } from '../data.js';
import { Eyebrow } from '../components/SharedUI.jsx';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

export default function CustomerOrdersView() {
  const { customerUser, navigate, pushToast } = useStore();
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // Tracks which order is clicked open

  // We pull the fetch logic into a reusable function so we can poll it silently
  const fetchOrders = async (silent = false) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/my-orders?email=${customerUser.email}`);
      const data = await res.json();
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      if (!silent) pushToast({ kind: 'error', title: 'Error', body: 'Failed to load your orders.' });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (!customerUser) {
      navigate('home');
      return;
    }

    // 1. Initial Load
    fetchOrders();

    // 2. Real-Time Status Polling (Silently checks every 10 seconds)
    const intervalId = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    // Cleanup interval when the user leaves the page
    return () => clearInterval(intervalId);
  }, [customerUser, navigate, pushToast]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <button onClick={() => navigate('home')} className="fl-hover rounded-full p-2 text-[var(--muted-fg)] transition-transform hover:-translate-x-1">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <Eyebrow>Your Profile</Eyebrow>
          <h1 className="fl-serif mt-2 text-4xl">Order History</h1>
        </div>
      </div>

      <div className="mt-8 animate-fade">
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
            {myOrders.map(order => {
              const isExpanded = expandedId === order._id;
              const hasCustomization = order.customization?.text || order.customization?.note || order.customization?.photoName;

              return (
                <div key={order._id} className="glass flex flex-col rounded-[1.75rem] overflow-hidden transition-all duration-300">
                  {/* MAIN ORDER BAR */}
                  <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-[var(--muted-fg)]">{order.orderId}</span>
                        {order.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-[var(--fg)]">
                            <Clock className="h-3 w-3 animate-pulse" /> Pending Verification
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

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleExpand(order._id)} 
                        className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
                      >
                        Details {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>

                      {order.status === 'verified' && (
                        <button onClick={() => navigate('home', 'reviews')} className="fl-shadow-primary flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-[var(--primary-fg)] transition-transform hover:scale-105">
                          <Star className="h-4 w-4" /> Review
                        </button>
                      )}
                    </div>
                  </div>

                  {/* EXPANDED DETAILS DRAWER */}
                  {isExpanded && (
                    <div className="border-t border-white/10 bg-black/5 px-6 py-6 animate-fade">
                      <div className="grid gap-8 sm:grid-cols-2">
                        {/* Customization Column */}
                        <div>
                          <h4 className="text-xs uppercase tracking-widest text-[var(--muted-fg)] mb-4">Customization Request</h4>
                          {!hasCustomization ? (
                            <p className="text-sm text-[var(--muted-fg)]">Standard ready-to-gift order. No personalizations requested.</p>
                          ) : (
                            <ul className="space-y-4">
                              {order.customization.text && (
                                <li className="flex gap-3">
                                  <Type className="h-4 w-4 shrink-0 text-[var(--primary)] mt-0.5" />
                                  <div>
                                    <p className="text-xs text-[var(--muted-fg)]">Personalized Text</p>
                                    <p className="text-sm font-medium italic mt-0.5">"{order.customization.text}"</p>
                                  </div>
                                </li>
                              )}
                              {order.customization.note && (
                                <li className="flex gap-3">
                                  <ScrollText className="h-4 w-4 shrink-0 text-[var(--primary)] mt-0.5" />
                                  <div>
                                    <p className="text-xs text-[var(--muted-fg)]">Gift Note</p>
                                    <p className="text-sm font-medium mt-0.5">"{order.customization.note}"</p>
                                  </div>
                                </li>
                              )}
                              {order.customization.photoName && (
                                <li className="flex gap-3">
                                  <ImageIcon className="h-4 w-4 shrink-0 text-[var(--primary)] mt-0.5" />
                                  <div>
                                    <p className="text-xs text-[var(--muted-fg)]">Reference Photo</p>
                                    <p className="text-sm font-medium mt-0.5">{order.customization.photoName}</p>
                                  </div>
                                </li>
                              )}
                            </ul>
                          )}
                        </div>

                        {/* Payment / Shipping Column */}
                        <div>
                          <h4 className="text-xs uppercase tracking-widest text-[var(--muted-fg)] mb-4">Order Record</h4>
                          <ul className="space-y-4">
                            <li className="flex gap-3">
                              <FileImage className="h-4 w-4 shrink-0 text-[var(--success)] mt-0.5" />
                              <div>
                                <p className="text-xs text-[var(--muted-fg)]">Payment Proof</p>
                                {order.receiptUrl ? (
                                  <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--success)] hover:underline mt-0.5 inline-block">
                                    View Receipt Image ↗
                                  </a>
                                ) : (
                                  <p className="text-sm font-medium mt-0.5 text-[var(--danger)]">Missing</p>
                                )}
                              </div>
                            </li>
                            <li className="flex gap-3">
                              <Package className="h-4 w-4 shrink-0 text-[var(--muted-fg)] mt-0.5" />
                              <div>
                                <p className="text-xs text-[var(--muted-fg)]">Delivery To</p>
                                <p className="text-sm font-medium mt-0.5">{order.customer.name}</p>
                                <p className="text-sm mt-0.5">{order.customer.address}</p>
                                <p className="text-sm mt-0.5">{order.customer.phone}</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}