import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Star, Sun, Moon, MessageCircle, X, Info, MailCheck, BadgeCheck, ShieldAlert } from 'lucide-react';
import { useStore } from '../store/store.jsx';
import { STORE, whatsappLink } from '../data.js';

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div', ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>{children}</Tag>;
}

export function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--primary)]">
      <span className="h-px w-6 bg-current opacity-60" aria-hidden="true" />
      {children}
    </span>
  );
}

export function LiquidBackground() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMouse({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-90">
      <div className="absolute inset-0 transition-opacity duration-500 ease-out" style={{ background: `radial-gradient(circle 650px at ${mouse.x}% ${mouse.y}%, var(--blob-3), transparent 75%)`, opacity: 0.65 }} />
      <div className="animate-liquid absolute -left-[10%] -top-[10%] h-[45vw] w-[45vw] blur-3xl" style={{ background: 'var(--blob-1)' }} />
      <div className="animate-liquid absolute -right-[12%] top-[20%] h-[40vw] w-[40vw] blur-3xl" style={{ background: 'var(--blob-2)', animationDelay: '-6s' }} />
      <div className="animate-liquid absolute bottom-[-15%] left-[30%] h-[38vw] w-[38vw] blur-3xl" style={{ background: 'var(--blob-3)', animationDelay: '-12s' }} />
    </div>
  );
}

export function Stars({ value, size = 'h-4 w-4' }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} aria-hidden="true" className={size} style={i < value ? { fill: 'var(--accent)', color: 'var(--accent)' } : { color: 'var(--border)' }} />
      ))}
    </div>
  );
}

function getInitialTheme() {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem('floweraaine-theme');
    if (saved) return saved === 'dark';
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(getInitialTheme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try { localStorage.setItem('floweraaine-theme', isDark ? 'dark' : 'light'); } catch {}
  }, [isDark]);

  function toggle(event) {
    const next = !isDark;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduceMotion) { setIsDark(next); return; }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(() => {
      flushSync(() => setIsDark(next));
      document.documentElement.classList.toggle('dark', next);
    });
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`], filter: ['blur(8px) saturate(1.6)', 'blur(0px) saturate(1)'] },
        { duration: 850, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  }

  return (
    <button type="button" onClick={toggle} aria-label="Switch theme" className="glass glass-sheen relative flex h-10 w-10 items-center justify-center rounded-full text-[var(--fg)] transition-transform duration-300 hover:scale-105 active:scale-95">
      <Sun aria-hidden="true" className={`absolute h-[18px] w-[18px] transition-all duration-500 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
      <Moon aria-hidden="true" className={`absolute h-[18px] w-[18px] transition-all duration-500 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
    </button>
  );
}

export function WhatsAppFab() {
  return (
    <a href={whatsappLink("Hi Floweraaine! I'd love some help choosing a gift.")} target="_blank" rel="noopener noreferrer" className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 sm:bottom-8 sm:right-8">
      <span className="glass pointer-events-none hidden translate-x-2 rounded-full px-4 py-2 text-sm font-medium opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 sm:block">Chat with us</span>
      <span className="relative flex h-14 w-14 items-center justify-center">
        <span className="animate-ping-soft absolute inset-0 rounded-full bg-[var(--whatsapp)]" aria-hidden="true" />
        <span className="fl-shadow-wa relative flex h-14 w-14 items-center justify-center rounded-full bg-[var(--whatsapp)] text-white transition-transform duration-300 group-hover:scale-110"><MessageCircle className="h-6 w-6" /></span>
      </span>
    </a>
  );
}

const toastIcons = { mail: MailCheck, success: BadgeCheck, info: Info, error: ShieldAlert };

export function Toaster() {
  const { toasts, dismissToast } = useStore();
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-5 left-5 z-[60] flex w-[min(380px,calc(100%-6.5rem))] flex-col gap-3 sm:bottom-8 sm:left-8">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.kind] ?? Info;
        return (
          <div key={toast.id} role="status" className="glass glass-solid animate-rise pointer-events-auto flex gap-3 rounded-2xl p-4">
            <span className="fl-soft-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--primary)]"><Icon className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1"><p className="text-sm font-medium">{toast.title}</p><p className="mt-0.5 text-xs leading-relaxed text-[var(--muted-fg)]">{toast.body}</p></div>
            <button type="button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss" className="fl-hover self-start rounded-full p-1 text-[var(--muted-fg)]"><X className="h-3.5 w-3.5" /></button>
          </div>
        );
      })}
    </div>
  );
}