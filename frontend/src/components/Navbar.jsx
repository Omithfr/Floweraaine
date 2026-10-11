import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '../store/store.jsx';
import { ThemeToggle } from './SharedUI.jsx';
import logoImg from '../assets/Floweraaine logo.jpg';

export default function Navbar() {
  const { navigate, selectedProduct, quantity, setContactOpen, customerUser, setShowAuthModal, handleLogout } = useStore();
  const bagCount = selectedProduct ? quantity : 0;
  const linkClass = 'fl-hover rounded-full px-4 py-2 text-sm text-[var(--muted-fg)] transition-colors hover:text-[var(--fg)]';

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <nav aria-label="Primary" className="glass mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full py-2 pl-6 pr-2">
        <button type="button" onClick={() => navigate('home')} className="transition-opacity hover:opacity-70 flex items-center">
          <img src={logoImg} alt="Floweraaine" className="h-12 sm:h-16 w-auto object-contain dark:invert transition-all duration-300" />
        </button>
        <div className="hidden items-center gap-1 md:flex">
          <button type="button" onClick={() => navigate('home', 'collection')} className={linkClass}>Collection</button>
          <button type="button" onClick={() => navigate('home', 'reviews')} className={linkClass}>Reviews</button>
          <button type="button" onClick={() => setContactOpen(true)} className={linkClass}>Contact</button>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {customerUser ? (
            <div className="relative group flex items-center h-12">
              <button className="text-sm font-medium tracking-wide text-[var(--fg)] hover:opacity-70 transition-opacity">
                Hi, {customerUser.name.split(' ')[0]}
              </button>
              <div className="absolute right-0 top-full pt-2 w-48 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-xl overflow-hidden">
                  <button onClick={() => navigate('my-orders')} className="w-full text-left px-4 py-3 text-sm text-[var(--muted-fg)] hover:text-[var(--fg)] hover:bg-[var(--muted)] transition">
                    My Orders
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-[var(--danger)] hover:bg-[var(--muted)] transition border-t border-[var(--border)]">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setShowAuthModal(true)} className="text-sm font-medium tracking-wide text-[var(--muted-fg)] hover:text-[var(--fg)] transition ml-2 sm:ml-0">
              Sign In
            </button>
          )}

          <ThemeToggle />
          
          <button type="button" onClick={() => navigate('checkout')} className="relative flex items-center gap-2 rounded-full bg-[var(--fg)] px-4 py-2.5 text-sm font-medium text-[var(--bg)] transition-transform duration-300 hover:scale-[1.03] active:scale-95">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Bag</span>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-semibold text-[var(--primary-fg)] transition-all duration-500 ${bagCount ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
              {bagCount}
              <span className="sr-only"> items in bag</span>
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}