import React from 'react';
import { MessageCircle, Mail } from 'lucide-react';
import { useStore } from '../store/store.jsx';
import { STORE, whatsappLink } from '../data.js';
import logoImg from '../assets/Floweraaine logo.jpg';

export default function Footer() {
  const { navigate, setContactOpen } = useStore();
  
  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="flex items-center">
              <img src={logoImg} alt="Floweraaine" className="h-20 sm:h-28 w-auto object-contain dark:invert transition-all duration-300" />
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--muted-fg)]">
              <strong className="text-[var(--fg)]">About Us:</strong> Floweraaine is an indie artisan gifting studio. Created and engineered by Omith Thilakan, we specialize in bespoke, hand-crafted hampers and keepsakes, tailored to your personal vision.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-fg)]">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><button type="button" onClick={() => navigate('home', 'collection')} className="hover:text-[var(--primary)]">Collection</button></li>
              <li><button type="button" onClick={() => navigate('home', 'bespoke')} className="hover:text-[var(--primary)]">Bespoke hampers</button></li>
              <li><button type="button" onClick={() => navigate('admin')} className="text-[var(--muted-fg)] hover:text-[var(--primary)]">Partner login</button></li>
            </ul>
          </nav>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-fg)]">Reach us</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href={whatsappLink('Hi Floweraaine!')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--primary)]"><MessageCircle className="h-4 w-4" aria-hidden="true" /> {STORE.whatsappDisplay}</a></li>
              <li><a href={`mailto:${STORE.email}`} className="flex items-center gap-2 hover:text-[var(--primary)]"><Mail className="h-4 w-4" aria-hidden="true" /> {STORE.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-2 border-t pt-6 text-xs text-[var(--muted-fg)] sm:flex-row">
          <p>© {new Date().getFullYear()} Floweraaine. Designed & Developed by Omith Thilakan.</p>
          <p>UPI payments only · Delivery exclusively in Kerala</p>
        </div>
      </div>
    </footer>
  );
}