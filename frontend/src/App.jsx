import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, Check, Clock, Copy, Gift, ImagePlus, Info,
  LoaderCircle, Lock, Mail, MailCheck, MapPin, MessageCircle, Minus, Moon, Package, Phone, Plus,
  Send, ShieldAlert, ShieldCheck, ShoppingBag, Smartphone, Sparkles, Star, Sun, Truck, X,
  FileImage
} from 'lucide-react'

/* =========================================================================
   STYLES — theme tokens, liquid glass, animations
   ========================================================================= */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

:root {
  color-scheme: light;
  --bg: oklch(0.975 0.008 75);
  --fg: oklch(0.22 0.02 30);
  --muted: oklch(0.945 0.012 70);
  --muted-fg: oklch(0.5 0.02 40);
  --primary: oklch(0.42 0.11 15);
  --primary-fg: oklch(0.98 0.008 75);
  --accent: oklch(0.74 0.09 78);
  --success: oklch(0.55 0.11 155);
  --whatsapp: oklch(0.66 0.17 150);
  --danger: oklch(0.577 0.2 27);
  --border: oklch(0.9 0.012 70);
  --glass-tint: oklch(1 0 0 / 0.55);
  --glass-edge: oklch(1 0 0 / 0.7);
  --glass-shadow: oklch(0.3 0.05 30 / 0.08);
  --blob-1: rgba(244, 164, 186, 0.35);
  --blob-2: rgba(253, 224, 137, 0.3);
  --blob-3: rgba(244, 114, 182, 0.25);
}
.dark {
  color-scheme: dark;
  --bg: oklch(0.155 0.012 30);
  --fg: oklch(0.95 0.01 75);
  --muted: oklch(0.24 0.014 30);
  --muted-fg: oklch(0.7 0.015 60);
  --primary: oklch(0.8 0.08 15);
  --primary-fg: oklch(0.18 0.02 25);
  --accent: oklch(0.8 0.08 80);
  --success: oklch(0.72 0.12 155);
  --whatsapp: oklch(0.7 0.17 150);
  --danger: oklch(0.65 0.19 25);
  --border: oklch(1 0 0 / 0.1);
  --glass-tint: oklch(0.22 0.015 30 / 0.5);
  --glass-edge: oklch(1 0 0 / 0.12);
  --glass-shadow: oklch(0 0 0 / 0.4);
  --blob-1: rgba(136, 19, 55, 0.35);
  --blob-2: rgba(180, 83, 9, 0.25);
  --blob-3: rgba(157, 23, 77, 0.3);
}

*, *::before, *::after { border-color: var(--border); }
html { scroll-behavior: smooth; }
html, body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: background-color .6s ease, color .6s ease;
}
::selection { background: color-mix(in oklch, var(--primary) 25%, transparent); }

.fl-serif { font-family: 'Cormorant Garamond', ui-serif, Georgia, serif; }
.fl-hover:hover { background: color-mix(in oklch, var(--fg) 6%, transparent); }
.fl-soft-primary { background: color-mix(in oklch, var(--primary) 10%, transparent); }
.fl-soft-success { background: color-mix(in oklch, var(--success) 12%, transparent); }
.fl-soft-accent { background: color-mix(in oklch, var(--accent) 14%, transparent); border-color: color-mix(in oklch, var(--accent) 40%, transparent); }
.fl-soft-wa { background: color-mix(in oklch, var(--whatsapp) 12%, transparent); }
.fl-soft-wa:hover { background: color-mix(in oklch, var(--whatsapp) 20%, transparent); }
.fl-shadow-primary { box-shadow: 0 12px 30px -10px color-mix(in oklch, var(--primary) 45%, transparent); transition: box-shadow .3s ease, gap .3s ease, transform .3s ease; }
.fl-shadow-primary:hover { box-shadow: 0 18px 40px -10px color-mix(in oklch, var(--primary) 60%, transparent); }
.fl-shadow-wa { box-shadow: 0 14px 34px -10px color-mix(in oklch, var(--whatsapp) 55%, transparent); }
.fl-input {
  width: 100%; border-radius: .75rem; border: 1px solid var(--border);
  background: color-mix(in oklch, var(--bg) 60%, transparent); color: var(--fg);
  padding: .75rem 1rem; font-size: .875rem; outline: none; transition: border-color .2s, box-shadow .2s;
}
.fl-input::placeholder { color: color-mix(in oklch, var(--muted-fg) 75%, transparent); }
.fl-input:focus { border-color: color-mix(in oklch, var(--primary) 50%, transparent); box-shadow: 0 0 0 4px color-mix(in oklch, var(--primary) 12%, transparent); }
.fl-input:disabled { opacity: .6; }
.fl-label { display: block; margin-bottom: .5rem; font-size: .7rem; font-weight: 500; text-transform: uppercase; letter-spacing: .18em; color: var(--muted-fg); }

.glass {
  background: var(--glass-tint);
  backdrop-filter: blur(22px) saturate(170%);
  -webkit-backdrop-filter: blur(22px) saturate(170%);
  border: 1px solid var(--glass-edge);
  box-shadow: inset 0 1px 0 0 var(--glass-edge), 0 20px 50px -20px var(--glass-shadow);
}
.glass-solid { background: color-mix(in oklch, var(--bg) 82%, transparent); }
.glass-sheen { position: relative; overflow: hidden; isolation: isolate; }
.glass-sheen::after {
  content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: linear-gradient(115deg, transparent 30%, oklch(1 0 0 / .35) 48%, transparent 62%);
  transform: translateX(-120%); transition: transform 1.1s cubic-bezier(.22,1,.36,1);
}
.glass-sheen:hover::after { transform: translateX(120%); }

@keyframes liquid-drift {
  0%,100% { transform: translate(0,0) scale(1); border-radius: 42% 58% 63% 37% / 41% 44% 56% 59%; }
  33% { transform: translate(6%,-8%) scale(1.08); border-radius: 58% 42% 38% 62% / 55% 38% 62% 45%; }
  66% { transform: translate(-5%,6%) scale(.95); border-radius: 38% 62% 54% 46% / 62% 55% 45% 38%; }
}
@keyframes rise-in { from { opacity: 0; transform: translateY(24px); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }
@keyframes pop-in { from { opacity: 0; transform: scale(.95); } to { opacity: 1; transform: none; } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes ping-soft { 0% { transform: scale(1); opacity: .55; } 100% { transform: scale(1.7); opacity: 0; } }

.animate-liquid { animation: liquid-drift 18s ease-in-out infinite; }
.animate-rise { animation: rise-in .9s cubic-bezier(.22,1,.36,1) both; }
.animate-pop { animation: pop-in .5s cubic-bezier(.22,1,.36,1) both; }
.animate-fade { animation: fade-in .7s ease both; }
.animate-ping-soft { animation: ping-soft 2.4s cubic-bezier(0,0,.2,1) infinite; }

.reveal { opacity: 0; transform: translateY(28px); filter: blur(4px); transition: opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1), filter .9s cubic-bezier(.22,1,.36,1); }
.reveal.is-visible { opacity: 1; transform: none; filter: none; }

dialog.fl-dialog::backdrop { background: rgb(0 0 0 / .4); backdrop-filter: blur(4px); }
dialog.fl-dialog[open] { animation: pop-in .5s cubic-bezier(.22,1,.36,1) both; }

::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .reveal { opacity: 1; transform: none; filter: none; }
}
`

/* =========================================================================
   DATA
   ========================================================================= */
const STORE = {
  name: 'Floweraaine',
  upiId: 'owner@upi',
  whatsappNumber: '919999999999',
  whatsappDisplay: '+91 99999 99999',
  email: 'hello@floweraaine.com',
  hours: 'Mon – Sat, 10am – 8pm IST',
  city: 'Handcrafted in India · Pan-India delivery',
  adminPassword: 'admin123',
}

const HERO_IMAGE = '/product images/bmw-hamper.jpg'

const products = [
  {
    id: 0,
    name: 'Test Payment (1 Rs)',
    price: 1,
    image: '/product images/4x4-frame.jpg', 
    description: 'A 1 Rupee placeholder item to safely test the UPI checkout and UTR verification flow.',
    features: ['Live Payment Test', '1 INR Transaction', 'Instant Verification'],
    category: 'standard',
  },
  {
    id: 1,
    name: 'BMW M4 Hamper Box',
    price: 2000,
    image: '/product images/bmw-hamper.jpg',
    description: 'A premium gifting experience featuring a detailed BMW M4 model, presented in a luxury box with scented blue roses.',
    features: ['Includes Car Model', 'Scented Roses', 'Luxury Gift Box'],
    category: 'customizable',
  },
  {
    id: 2,
    name: 'BMW M4 Diecast Model',
    price: 1580,
    image: '/product images/bmw-m4.jpg',
    description: 'Highly detailed interactive model. Available in Blue, Black, and Red.',
    features: ['2-Door, Bonnet & Dickey Opening', 'Horn & Sound Effects', 'Headlight Blinking'],
    category: 'standard',
  },
  {
    id: 3,
    name: 'Porsche 911 Frame',
    price: 730,
    image: '/product images/porsche.jpg',
    description: 'Classic Porsche model beautifully mounted on a customized display frame.',
    features: ['2-Door Opening Feature', 'Detailed Interior', 'Display Frame Included'],
    category: 'standard',
  },
  {
    id: 4,
    name: 'Trolly Hamper',
    price: 2500,
    image: '/product images/trolly-hamper.jpg',
    description: 'A unique mini-trolley suitcase packed with chocolates, personal photos, and premium gifts.',
    features: ['Mini Trolley Case', 'Custom Photos', 'Assorted Chocolates'],
    category: 'customizable',
  },
  {
    id: 5,
    name: 'Customized Hampers',
    price: 1499,
    image: '/product images/custom-hamper1.jpg',
    description: 'Tailor-made gift hampers for birthdays, anniversaries, and special occasions.',
    features: ['Custom Chocolates', 'Personalized Messages', 'Elegant Packaging'],
    category: 'customizable',
  },
  {
    id: 6,
    name: '4 x 4 Photo Frame',
    price: 160,
    image: '/product images/4x4-frame.jpg',
    description: 'A minimalist 4x4 inch frame perfect for showcasing your favorite memories.',
    features: ['4x4 Inch Size', 'Premium White Finish', 'Ready to Gift'],
    category: 'standard',
  },
]

const seedReviews = [
  { id: 'r1', name: 'Ananya R.', city: 'Bengaluru', rating: 5, title: 'He opened it twice just to smell the roses', body: 'The BMW hamper was beyond what the photos promised. Every detail felt considered — the ribbon, the card, even the way the roses were arranged around the model.', product: 'BMW M4 Hamper Box', verified: true },
  { id: 'r2', name: 'Karthik S.', city: 'Chennai', rating: 5, title: 'A keepsake, not a gift', body: 'Ordered the trolly hamper with our photos for my parents’ anniversary. Mum cried. Payment via UPI was effortless and the team kept me updated on WhatsApp.', product: 'Trolly Hamper', verified: true },
  { id: 'r3', name: 'Meera P.', city: 'Pune', rating: 4, title: 'Beautifully finished frame', body: 'The Porsche frame now sits on my partner’s desk. The interior detail is lovely. Delivery took a day longer than expected but was worth the wait.', product: 'Porsche 911 Frame', verified: true },
  { id: 'r4', name: 'Rohan D.', city: 'Mumbai', rating: 5, title: 'They took my vague idea and made it perfect', body: 'I only knew I wanted dark chocolates and a handwritten note. The custom hamper they composed felt genuinely personal.', product: 'Customized Hampers', verified: true },
]

const OCCASIONS = ['Birthday', 'Anniversary', 'Proposal', 'Graduation', 'Just Because']

const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

const whatsappLink = (message) => `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`
const mailtoLink = (subject, body) =>
  `mailto:${STORE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

function buildOrderMessage(product, quantity, c) {
  return [
    `Hi Floweraaine! I'd like to order:`,
    `• ${product.name} × ${quantity} (${formatINR(product.price * quantity)})`,
    c.occasion && `• Occasion: ${c.occasion}`,
    c.text && `• Personalized text: "${c.text}"`,
    c.note && `• Gift note: "${c.note}"`,
    c.photoName && `• I have a reference photo (${c.photoName}) to share.`,
  ].filter(Boolean).join('\n')
}

const hideBrokenImage = (e) => { e.currentTarget.style.opacity = '0' }

/* =========================================================================
   STORE (React context)
   ========================================================================= */
const emptyCustomization = { occasion: '', text: '', note: '', photoUrl: null, photoName: null }
const StoreContext = createContext(null)

function StoreProvider({ children }) {
  const [view, setView] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [customization, setCustomizationState] = useState(emptyCustomization)
  const [quantity, setQuantityState] = useState(1)
  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState(seedReviews)
  const [contactOpen, setContactOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  const navigate = useCallback((next, anchor) => {
    setView(next)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        else window.scrollTo({ top: 0, behavior: 'smooth' })
      }),
    )
  }, [])

  const selectProduct = useCallback((product) => {
    setSelectedProduct(product)
    setCustomizationState(emptyCustomization)
    setQuantityState(1)
    navigate('customize')
  }, [navigate])

  const setCustomization = useCallback((patch) => setCustomizationState((prev) => ({ ...prev, ...patch })), [])
  const setQuantity = useCallback((q) => setQuantityState(Math.min(10, Math.max(1, Math.round(q)))), [])
  const dismissToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), [])
  const pushToast = useCallback((toast) => {
    const id = ++toastId.current
    setToasts((prev) => [...prev, { ...toast, id }])
    window.setTimeout(() => dismissToast(id), 6500)
  }, [dismissToast])
  
  const addOrder = useCallback((order) => setOrders((prev) => [order, ...prev]), [])
  
  const approveOrder = useCallback((orderId) => {
    setOrders((prev) => prev.map(o => o.id === orderId ? { ...o, status: 'verified' } : o))
    pushToast({ kind: 'success', title: 'Order Approved', body: `Order ${orderId} has been verified.` })
  }, [pushToast])

  const addReview = useCallback((review) => setReviews((prev) => [review, ...prev]), [])

  const value = useMemo(() => ({
    view, navigate, selectedProduct, selectProduct, customization, setCustomization, quantity, setQuantity,
    orders, addOrder, approveOrder, lastVerifiedOrder: orders.find(o => o.status === 'verified') ?? null, 
    reviews, addReview, contactOpen, setContactOpen, toasts, pushToast, dismissToast,
  }), [view, navigate, selectedProduct, selectProduct, customization, setCustomization, quantity, setQuantity,
    orders, addOrder, approveOrder, reviews, addReview, contactOpen, toasts, pushToast, dismissToast])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

/* =========================================================================
   PRIMITIVES
   ========================================================================= */
function Reveal({ children, className = '', delay = 0, as: Tag = 'div', ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('is-visible')
        observer.disconnect()
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}

function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--primary)]">
      <span className="h-px w-6 bg-current opacity-60" aria-hidden="true" />
      {children}
    </span>
  )
}

function LiquidBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-90">
      <div className="animate-liquid absolute -left-[10%] -top-[10%] h-[45vw] w-[45vw] blur-3xl" style={{ background: 'var(--blob-1)' }} />
      <div className="animate-liquid absolute -right-[12%] top-[20%] h-[40vw] w-[40vw] blur-3xl" style={{ background: 'var(--blob-2)', animationDelay: '-6s' }} />
      <div className="animate-liquid absolute bottom-[-15%] left-[30%] h-[38vw] w-[38vw] blur-3xl" style={{ background: 'var(--blob-3)', animationDelay: '-12s' }} />
    </div>
  )
}

function Stars({ value, size = 'h-4 w-4' }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={size}
          style={i < value ? { fill: 'var(--accent)', color: 'var(--accent)' } : { color: 'var(--border)' }}
        />
      ))}
    </div>
  )
}

/* =========================================================================
   THEME TOGGLE — liquid circular reveal via View Transitions API
   ========================================================================= */
function getInitialTheme() {
  if (typeof window === 'undefined') return false
  try {
    const saved = localStorage.getItem('floweraaine-theme')
    if (saved) return saved === 'dark'
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    try { localStorage.setItem('floweraaine-theme', isDark ? 'dark' : 'light') } catch {}
  }, [isDark])

  function toggle(event) {
    const next = !isDark
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduceMotion) {
      setIsDark(next)
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    const transition = document.startViewTransition(() => {
      flushSync(() => setIsDark(next))
      document.documentElement.classList.toggle('dark', next)
    })
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
          filter: ['blur(8px) saturate(1.6)', 'blur(0px) saturate(1)'],
        },
        { duration: 850, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="glass glass-sheen relative flex h-10 w-10 items-center justify-center rounded-full text-[var(--fg)] transition-transform duration-300 hover:scale-105 active:scale-95"
    >
      <Sun aria-hidden="true" className={`absolute h-[18px] w-[18px] transition-all duration-500 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
      <Moon aria-hidden="true" className={`absolute h-[18px] w-[18px] transition-all duration-500 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
    </button>
  )
}

/* =========================================================================
   NAVBAR
   ========================================================================= */
function Navbar() {
  const { navigate, selectedProduct, quantity, setContactOpen } = useStore()
  const bagCount = selectedProduct ? quantity : 0
  const linkClass = 'fl-hover rounded-full px-4 py-2 text-sm text-[var(--muted-fg)] transition-colors hover:text-[var(--fg)]'

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <nav aria-label="Primary" className="glass mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full py-2 pl-6 pr-2">
        <button type="button" onClick={() => navigate('home')} className="fl-serif text-2xl italic tracking-wide transition-opacity hover:opacity-70">
          Floweraaine<span className="text-[var(--primary)]">.</span>
        </button>
        <div className="hidden items-center gap-1 md:flex">
          <button type="button" onClick={() => navigate('home', 'collection')} className={linkClass}>Collection</button>
          <button type="button" onClick={() => navigate('home', 'reviews')} className={linkClass}>Reviews</button>
          <button type="button" onClick={() => setContactOpen(true)} className={linkClass}>Contact</button>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => navigate('checkout')}
            className="relative flex items-center gap-2 rounded-full bg-[var(--fg)] px-4 py-2.5 text-sm font-medium text-[var(--bg)] transition-transform duration-300 hover:scale-[1.03] active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span>Bag</span>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-semibold text-[var(--primary-fg)] transition-all duration-500 ${bagCount ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
              {bagCount}
              <span className="sr-only"> items in bag</span>
            </span>
          </button>
        </div>
      </nav>
    </header>
  )
}

/* =========================================================================
   HERO
   ========================================================================= */
const pillars = [
  { icon: Sparkles, label: 'Handmade to order' },
  { icon: Gift, label: 'Personalized keepsakes' },
  { icon: ShieldCheck, label: 'Secure UPI payments' },
  { icon: Truck, label: 'Pan-India delivery' },
]

function Hero() {
  const { navigate } = useStore()
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 md:pt-20">
      <div className="grid items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16">
        <div className="animate-rise">
          <Eyebrow>Artisan gifting studio</Eyebrow>
          <h1 className="fl-serif mt-6 text-balance text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Gifts, composed <em className="text-[var(--primary)]">by hand.</em>
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-[var(--muted-fg)]">
            Luxury hampers, collectible models and keepsakes — each one finished in our studio with your words, your photographs, your occasion.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('home', 'collection')}
              className="fl-shadow-primary flex items-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3.5 text-sm font-medium text-[var(--primary-fg)] hover:gap-3"
            >
              Explore the collection
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => navigate('home', 'bespoke')} className="glass glass-sheen rounded-full px-7 py-3.5 text-sm font-medium">
              Commission a hamper
            </button>
          </div>
          <div className="mt-10 flex items-center gap-3 text-sm text-[var(--muted-fg)]">
            <Stars value={5} />
            <span><strong className="font-medium text-[var(--fg)]">4.9</strong> from verified customers</span>
          </div>
        </div>

        <div className="animate-rise relative" style={{ animationDelay: '150ms' }}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[var(--muted)] shadow-2xl">
            <img
              src={HERO_IMAGE}
              alt="Ivory gift boxes with silk ribbons and blush roses in soft morning light"
              className="h-full w-full object-cover transition-transform duration-[2000ms] hover:scale-105"
              onError={(e) => { e.currentTarget.src = products[1].image }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>
          <div className="glass absolute -bottom-6 -left-4 max-w-[220px] rounded-2xl p-4 sm:-left-8">
            <p className="fl-serif text-lg italic leading-snug">“Every ribbon is tied by hand.”</p>
            <p className="mt-1 text-xs text-[var(--muted-fg)]">— The Floweraaine studio</p>
          </div>
          <div className="glass absolute -right-2 top-6 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium sm:-right-6">
            <span className="h-2 w-2 rounded-full bg-[var(--success)]" aria-hidden="true" />
            Taking orders this week
          </div>
        </div>
      </div>

      <ul className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-[var(--border)] md:grid-cols-4">
        {pillars.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 bg-[var(--bg)] px-5 py-5 text-sm text-[var(--muted-fg)]">
            <Icon className="h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </section>
  )
}

/* =========================================================================
   PRODUCT CARD + GALLERY
   ========================================================================= */
function ProductCard({ product }) {
  const { selectProduct } = useStore()
  const customizable = product.category === 'customizable'

  return (
    <article className="group relative flex h-full flex-col">
      <button
        type="button"
        onClick={() => selectProduct(product)}
        aria-label={`${customizable ? 'Personalize' : 'View'} ${product.name}`}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-[var(--muted)] text-left outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary)]/30"
      >
        <img
          src={product.image}
          alt=""
          onError={hideBrokenImage}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-60 transition-opacity duration-700 group-hover:opacity-100" />

        <span className={`glass absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] ${customizable ? 'text-[var(--primary)]' : 'text-[var(--fg)]'}`}>
          {customizable ? <Sparkles className="h-3 w-3" aria-hidden="true" /> : <Gift className="h-3 w-3" aria-hidden="true" />}
          {customizable ? 'Customizable' : 'Ready to gift'}
        </span>

        <span aria-hidden="true" className="glass absolute right-4 top-4 flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>

        <ul className="absolute inset-x-4 bottom-4 translate-y-4 space-y-1.5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {product.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-xs font-medium text-white">
              <Check className="h-3.5 w-3.5 shrink-0 text-white/80" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </button>

      <div className="flex flex-1 flex-col px-1 pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="fl-serif text-2xl leading-tight">{product.name}</h3>
          <p className="shrink-0 text-sm font-medium tabular-nums">{formatINR(product.price)}</p>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted-fg)]">{product.description}</p>
        <button
          type="button"
          onClick={() => selectProduct(product)}
          className="mt-5 inline-flex w-fit items-center gap-2 border-b pb-1 text-sm font-medium transition-all duration-300 hover:gap-3 hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          {customizable ? 'Personalize & order' : 'View & order'}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}

const filters = [
  { value: 'all', label: 'All pieces' },
  { value: 'customizable', label: 'Custom hampers' },
  { value: 'standard', label: 'Ready to gift' },
]

function ProductGallery() {
  const [filter, setFilter] = useState('all')
  const visible = filter === 'all' ? products : products.filter((p) => p.category === filter)
  const activeIndex = filters.findIndex((f) => f.value === filter)

  return (
    <section id="collection" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20 sm:px-6">
      <Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-xl">
          <Eyebrow>The collection</Eyebrow>
          <h2 className="fl-serif mt-5 text-balance text-4xl leading-tight sm:text-5xl">
            Pieces made to be <em className="text-[var(--primary)]">remembered.</em>
          </h2>
          <p className="mt-4 leading-relaxed text-[var(--muted-fg)]">
            Choose a ready-to-gift piece, or a hamper we finish with your photographs, names and message.
          </p>
        </div>

        <div role="tablist" aria-label="Filter products" className="glass relative grid grid-cols-3 rounded-full p-1">
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 rounded-full bg-[var(--fg)] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{ width: 'calc((100% - 0.5rem) / 3)', transform: `translateX(${activeIndex * 100}%)` }}
          />
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`relative z-10 whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors duration-500 sm:px-5 sm:text-sm ${filter === f.value ? 'text-[var(--bg)]' : 'text-[var(--muted-fg)] hover:text-[var(--fg)]'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Reveal>

      <div key={filter} className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product, i) => (
          <div key={product.id} className="animate-rise" style={{ animationDelay: `${i * 80}ms` }}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <Reveal className="glass mt-24 grid gap-8 rounded-[2rem] p-8 md:grid-cols-[1.4fr_1fr] md:items-center md:p-12">
        <div id="bespoke" className="scroll-mt-32">
          <Eyebrow>Bespoke commissions</Eyebrow>
          <h3 className="fl-serif mt-4 text-balance text-3xl leading-tight sm:text-4xl">Have something specific in mind?</h3>
          <p className="mt-3 max-w-lg leading-relaxed text-[var(--muted-fg)]">
            Tell us the person, the occasion and your budget. We will sketch a hamper around them and share a preview before we begin crafting.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          <a
            href={whatsappLink("Hi Floweraaine! I'd like to commission a bespoke hamper.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--whatsapp)] px-6 py-3.5 text-sm font-medium text-white transition-transform duration-300 hover:scale-[1.02]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Order via WhatsApp
          </a>
          <a
            href={mailtoLink('Bespoke hamper enquiry', 'Hi Floweraaine,\n\nOccasion:\nRecipient:\nBudget:\nIdeas:\n')}
            className="fl-hover flex flex-1 items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-medium transition-colors"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email us
          </a>
        </div>
      </Reveal>
    </section>
  )
}

/* =========================================================================
   CUSTOMIZE VIEW
   ========================================================================= */
function CustomizeView() {
  const { selectedProduct: product, customization, setCustomization, quantity, setQuantity, navigate } = useStore()
  const textId = useId()
  const noteId = useId()
  const photoId = useId()

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="fl-serif text-4xl">Choose a piece to begin</h1>
        <button type="button" onClick={() => navigate('home', 'collection')} className="mt-8 rounded-full bg-[var(--primary)] px-7 py-3 text-sm font-medium text-[var(--primary-fg)]">
          Browse the collection
        </button>
      </div>
    )
  }

  const customizable = product.category === 'customizable'
  const message = buildOrderMessage(product, quantity, customization)

  function handlePhoto(file) {
    if (!file || !file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) return
    if (customization.photoUrl) URL.revokeObjectURL(customization.photoUrl)
    setCustomization({ photoUrl: URL.createObjectURL(file), photoName: file.name })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16">
      <button type="button" onClick={() => navigate('home', 'collection')} className="group mb-10 flex items-center gap-2 text-sm text-[var(--muted-fg)] transition-colors hover:text-[var(--fg)]">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
        Return to boutique
      </button>

      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="animate-rise md:sticky md:top-28 md:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[var(--muted)] shadow-2xl">
            <img src={product.image} alt={product.name} onError={hideBrokenImage} className="h-full w-full object-cover" />
            {customization.photoUrl && (
              <div className="glass animate-pop absolute bottom-4 right-4 w-28 rotate-3 rounded-xl p-1.5">
                <img src={customization.photoUrl} alt="Your uploaded reference" className="aspect-square w-full rounded-lg object-cover" />
              </div>
            )}
            {customization.text && (
              <div className="glass fl-serif animate-fade absolute bottom-4 left-4 max-w-[60%] rounded-xl px-4 py-2 text-lg italic">
                {customization.text}
              </div>
            )}
          </div>
        </div>

        <div className="animate-rise" style={{ animationDelay: '120ms' }}>
          <Eyebrow>{customizable ? 'Customization studio' : 'Ready to gift'}</Eyebrow>
          <h1 className="fl-serif mt-4 text-balance text-4xl leading-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-3 text-xl tabular-nums">{formatINR(product.price)}</p>
          <p className="mt-5 leading-relaxed text-[var(--muted-fg)]">{product.description}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-[var(--muted-fg)]">
                <Check className="h-3 w-3 text-[var(--primary)]" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>

          <div className="glass mt-10 space-y-7 rounded-[1.75rem] p-6 sm:p-8">
            <fieldset>
              <legend className="fl-label">Occasion</legend>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((o) => {
                  const active = customization.occasion === o
                  return (
                    <button
                      key={o}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCustomization({ occasion: active ? '' : o })}
                      className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${active ? 'bg-[var(--fg)] text-[var(--bg)]' : 'border text-[var(--muted-fg)] hover:text-[var(--fg)]'}`}
                    >
                      {o}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {customizable && (
              <>
                <div>
                  <div className="flex items-baseline justify-between">
                    <label htmlFor={textId} className="fl-label">Personalized text</label>
                    <span className="text-xs tabular-nums text-[var(--muted-fg)]">{customization.text.length}/40</span>
                  </div>
                  <input
                    id={textId}
                    type="text"
                    maxLength={40}
                    value={customization.text}
                    onChange={(e) => setCustomization({ text: e.target.value })}
                    className="fl-input"
                    placeholder="A name, a date, a number plate…"
                  />
                </div>

                <div>
                  <span className="fl-label">Reference photograph</span>
                  {customization.photoName ? (
                    <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
                      <span className="truncate text-sm">{customization.photoName}</span>
                      <button
                        type="button"
                        aria-label="Remove photo"
                        onClick={() => {
                          if (customization.photoUrl) URL.revokeObjectURL(customization.photoUrl)
                          setCustomization({ photoUrl: null, photoName: null })
                        }}
                        className="fl-hover rounded-full p-1 text-[var(--muted-fg)] hover:text-[var(--fg)]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor={photoId} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-8 text-center transition-colors hover:border-[var(--primary)]">
                      <ImagePlus className="mb-3 h-6 w-6 text-[var(--muted-fg)]" aria-hidden="true" />
                      <span className="text-sm font-medium">Upload a favourite memory</span>
                      <span className="mt-1 text-xs text-[var(--muted-fg)]">JPG or PNG, up to 8MB</span>
                    </label>
                  )}
                  <input id={photoId} type="file" accept="image/*" className="sr-only" onChange={(e) => handlePhoto(e.target.files?.[0])} />
                </div>
              </>
            )}

            <div>
              <label htmlFor={noteId} className="fl-label">
                Handwritten gift note <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                id={noteId}
                rows={3}
                maxLength={200}
                value={customization.note}
                onChange={(e) => setCustomization({ note: e.target.value })}
                className="fl-input resize-none"
                placeholder="We'll write this by hand on a linen card."
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="fl-label !mb-0">Quantity</span>
              <div className="flex items-center gap-1 rounded-full border p-1">
                <button type="button" onClick={() => setQuantity(quantity - 1)} aria-label="Decrease quantity" disabled={quantity <= 1} className="fl-hover flex h-8 w-8 items-center justify-center rounded-full disabled:opacity-30">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity" disabled={quantity >= 10} className="fl-hover flex h-8 w-8 items-center justify-center rounded-full disabled:opacity-30">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('checkout')}
            className="fl-shadow-primary group mt-6 flex w-full items-center justify-between rounded-full bg-[var(--primary)] py-4 pl-7 pr-2 text-[var(--primary-fg)]"
          >
            <span className="font-medium">Continue to checkout · {formatINR(product.price * quantity)}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="fl-soft-wa flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-medium text-[var(--whatsapp)] transition-colors">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Order via WhatsApp
            </a>
            <a href={mailtoLink(`Order enquiry: ${product.name}`, message)} className="fl-hover flex items-center justify-center gap-2 rounded-full border py-3.5 text-sm font-medium transition-colors">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   UPI PAYMENT
   ========================================================================= */
const upiSteps = [
  'Scan the QR with any UPI app — GPay, PhonePe, Paytm or your bank app.',
  'Confirm the amount and payee name “Floweraaine” before paying.',
  'Copy the 12-digit UTR / transaction ID from your payment receipt.',
  'Upload a screenshot of the successful payment.',
  'Submit below. We confirm on WhatsApp instantly.',
]

function UpiPayment({ amount, orderId, status, onVerify }) {
  const [txnId, setTxnId] = useState('')
  const [receiptUrl, setReceiptUrl] = useState(null)
  const [receiptName, setReceiptName] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const inputId = useId()
  const fileId = useId()
  const errorId = useId()

  const upiUri = `upi://pay?pa=${encodeURIComponent(STORE.upiId)}&pn=${encodeURIComponent(STORE.name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Order ${orderId}`)}`
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=368x368&margin=0&color=1f1715&data=${encodeURIComponent(upiUri)}`

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(STORE.upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  function handleReceipt(file) {
    if (!file || !file.type.startsWith('image/')) return
    if (receiptUrl) URL.revokeObjectURL(receiptUrl)
    setReceiptUrl(URL.createObjectURL(file))
    setReceiptName(file.name)
    setError('')
  }

  function submit(e) {
    e.preventDefault()
    const clean = txnId.replace(/\s/g, '')
    if (!/^\d{12}$/.test(clean)) {
      setError('Enter the 12-digit UTR number shown on your UPI receipt.')
      return
    }
    if (!receiptUrl) {
      setError('Please upload a screenshot of your successful payment receipt.')
      return
    }
    setError('')
    onVerify({ txnId: clean, receiptUrl })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-center">
        <div className="relative rounded-[1.5rem] bg-white p-5 shadow-xl">
          <img src={qrSrc} width={184} height={184} alt={`UPI QR code to pay ${formatINR(amount)} to ${STORE.name}`} className="h-[184px] w-[184px]" />
          <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-fg)] shadow-lg">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
        <p className="fl-serif mt-4 text-3xl tabular-nums">{formatINR(amount)}</p>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-fg)]">Ref · {orderId}</p>

        <div className="mt-4 flex w-full items-center justify-between gap-2 rounded-full border py-1 pl-4 pr-1">
          <span className="truncate font-mono text-xs">{STORE.upiId}</span>
          <button type="button" onClick={copyUpi} className="fl-hover flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium">
            {copied ? <Check className="h-3 w-3" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <a href={upiUri} className="fl-hover mt-3 flex w-full items-center justify-center gap-2 rounded-full border py-2.5 text-xs font-medium lg:hidden">
          <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
          Open in UPI app
        </a>
      </div>

      <div>
        <h4 className="text-sm font-medium">How to pay</h4>
        <ol className="mt-4 space-y-3">
          {upiSteps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-[var(--muted-fg)]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium text-[var(--fg)]">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>

        <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
          <div>
            <label htmlFor={inputId} className="fl-label">12-Digit UPI Transaction ID (UTR)</label>
            <input
              id={inputId}
              inputMode="numeric"
              autoComplete="off"
              maxLength={14}
              value={txnId}
              onChange={(e) => setTxnId(e.target.value.replace(/[^\d\s]/g, ''))}
              placeholder="e.g. 412345678901"
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              disabled={status !== 'idle'}
              className="fl-input font-mono tracking-widest"
            />
          </div>

          <div>
            <span className="fl-label">Payment Screenshot</span>
            {receiptName ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 bg-[color-mix(in_oklch,var(--success)_10%,transparent)]">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileImage className="h-4 w-4 shrink-0 text-[var(--success)]" />
                  <span className="truncate text-sm font-medium">{receiptName}</span>
                </div>
                <button
                  type="button"
                  aria-label="Remove receipt"
                  onClick={() => {
                    if (receiptUrl) URL.revokeObjectURL(receiptUrl)
                    setReceiptUrl(null)
                    setReceiptName(null)
                  }}
                  className="fl-hover rounded-full p-1 text-[var(--muted-fg)] hover:text-[var(--fg)]"
                  disabled={status !== 'idle'}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label htmlFor={fileId} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-6 text-center transition-colors hover:border-[var(--primary)]">
                <ImagePlus className="mb-2 h-5 w-5 text-[var(--muted-fg)]" aria-hidden="true" />
                <span className="text-sm font-medium">Upload receipt screenshot</span>
              </label>
            )}
            <input id={fileId} type="file" accept="image/*" className="sr-only" onChange={(e) => handleReceipt(e.target.files?.[0])} disabled={status !== 'idle'} />
          </div>

          <button
            type="submit"
            disabled={status !== 'idle'}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--fg)] px-6 py-3.5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === 'verifying' ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                Submitting for Verification...
              </>
            ) : 'Submit Payment Proof'}
          </button>
          {error && <p id={errorId} role="alert" className="text-center text-xs text-[var(--danger)]">{error}</p>}
        </form>
      </div>
    </div>
  )
}

/* =========================================================================
   CHECKOUT VIEW
   ========================================================================= */
const makeOrderId = () => `FLW-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

function Step({ number, title, done, locked, children }) {
  return (
    <section className={`glass rounded-[1.75rem] p-6 transition-opacity duration-500 sm:p-8 ${locked ? 'opacity-70' : ''}`}>
      <h2 className="mb-6 flex items-center gap-3 text-lg font-medium">
        <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors duration-500 ${done ? 'bg-[var(--success)] text-white' : 'border'}`}>
          {done ? <BadgeCheck className="h-4 w-4" aria-hidden="true" /> : number}
        </span>
        <span className="fl-serif text-2xl">{title}</span>
      </h2>
      {children}
    </section>
  )
}

function OrderConfirmed({ order, onReview }) {
  const pending = order.status === 'pending'
  const waMessage = `Hi Floweraaine! I have paid ${formatINR(order.total)} for Order ${order.id}. UTR: ${order.txnId}. Please find my payment screenshot attached.`

  return (
    <div className="animate-pop space-y-6">
      <div className="glass rounded-[1.75rem] p-8 text-center">
        <span className="relative mx-auto flex h-16 w-16 items-center justify-center">
          {pending ? (
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)] text-white">
              <Clock className="h-8 w-8" aria-hidden="true" />
            </span>
          ) : (
            <>
              <span className="animate-ping-soft absolute inset-0 rounded-full bg-[var(--success)] opacity-40" aria-hidden="true" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)] text-white">
                <BadgeCheck className="h-8 w-8" aria-hidden="true" />
              </span>
            </>
          )}
        </span>
        <h2 className="fl-serif mt-6 text-3xl">{pending ? 'Verification Pending' : 'Payment verified'}</h2>
        <p className="mt-2 text-[var(--muted-fg)]">
          Order <strong className="font-medium text-[var(--fg)]">{order.id}</strong> {pending ? 'has been submitted. We are verifying your receipt.' : 'is confirmed. Our studio begins crafting today.'}
        </p>
        <p className="mt-1 font-mono text-xs text-[var(--muted-fg)]">UTR {order.txnId}</p>
      </div>

      {pending ? (
        <div className="glass border-[var(--whatsapp)] overflow-hidden rounded-[1.75rem] bg-[color-mix(in_oklch,var(--whatsapp)_5%,transparent)]">
          <div className="space-y-4 px-6 py-6 text-sm leading-relaxed text-center">
            <h3 className="fl-serif text-2xl text-[var(--whatsapp)]">One last step!</h3>
            <p className="text-[var(--fg)]">
              To expedite your order, please click below to open WhatsApp and <strong className="font-semibold">attach the screenshot</strong> you just uploaded.
            </p>
            <a 
              href={whatsappLink(waMessage)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--whatsapp)] py-4 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Send Screenshot on WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="glass overflow-hidden rounded-[1.75rem]">
            <div className="flex items-center gap-3 border-b px-6 py-4">
              <MailCheck className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-sm font-medium">Mail update · sent to {order.customer.email}</span>
            </div>
            <div className="space-y-3 px-6 py-6 text-sm leading-relaxed">
              <p className="text-xs text-[var(--muted-fg)]">From: {STORE.email}</p>
              <p className="fl-serif text-xl">Your Floweraaine order is confirmed</p>
              <p className="text-[var(--muted-fg)]">
                Dear {order.customer.name.split(' ')[0]}, we&apos;ve received your UPI payment of {formatINR(order.total)} for {order.product.name}. We&apos;ll share a preview on WhatsApp before dispatch.
              </p>
            </div>
          </div>
          <button type="button" onClick={onReview} className="fl-shadow-primary flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] py-4 text-sm font-medium text-[var(--primary-fg)]">
            <Star className="h-4 w-4" aria-hidden="true" />
            Share a verified review
          </button>
        </>
      )}
    </div>
  )
}

function CheckoutView() {
  const { selectedProduct: product, quantity, customization, navigate, addOrder, pushToast } = useStore()
  const [orderId] = useState(makeOrderId)
  const [details, setDetails] = useState({ name: '', email: '', phone: '', address: '' })
  const [policyAgreed, setPolicyAgreed] = useState(false)
  const [status, setStatus] = useState('idle')
  const [order, setOrder] = useState(null)
  const nameId = useId()
  const emailId = useId()
  const phoneId = useId()
  const addressId = useId()

  if (!product) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <span className="glass flex h-16 w-16 items-center justify-center rounded-full">
          <ShoppingBag className="h-6 w-6 text-[var(--muted-fg)]" aria-hidden="true" />
        </span>
        <h1 className="fl-serif mt-6 text-4xl">Your bag is empty</h1>
        <p className="mt-3 text-[var(--muted-fg)]">Choose a piece from the collection to begin.</p>
        <button type="button" onClick={() => navigate('home', 'collection')} className="mt-8 rounded-full bg-[var(--primary)] px-7 py-3 text-sm font-medium text-[var(--primary-fg)]">
          Browse the collection
        </button>
      </div>
    )
  }

  const total = product.price * quantity
  const detailsValid =
    details.name.trim().length > 1 &&
    /^\S+@\S+\.\S+$/.test(details.email) &&
    /^[6-9]\d{9}$/.test(details.phone.replace(/\D/g, '').slice(-10)) &&
    details.address.trim().length > 8
  const paymentUnlocked = detailsValid && policyAgreed
  const message = `${buildOrderMessage(product, quantity, customization)}\n• Order ref: ${orderId}`

  function handleVerify({ txnId, receiptUrl }) {
    setStatus('verifying')
    window.setTimeout(() => {
      const newOrder = {
        id: orderId, product, quantity, total, customization, customer: details, txnId, receiptUrl,
        status: 'pending', createdAt: new Date().toISOString(),
      }
      addOrder(newOrder)
      setOrder(newOrder)
      setStatus('verified') 
      pushToast({ kind: 'info', title: 'Payment Submitted', body: `Order ${orderId} is pending studio verification.` })
    }, 1500)
  }

  const update = (key) => (e) => setDetails((d) => ({ ...d, [key]: e.target.value }))

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16">
      <div className="animate-rise">
        <Eyebrow>Secure checkout</Eyebrow>
        <h1 className="fl-serif mt-4 text-4xl sm:text-5xl">{status === 'verified' && order?.status === 'verified' ? 'Thank you.' : status === 'verified' ? 'Just one step left.' : 'Almost yours.'}</h1>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {status === 'verified' && order ? (
            <OrderConfirmed order={order} onReview={() => navigate('home', 'reviews')} />
          ) : (
            <>
              <Step number={1} title="Delivery details" done={detailsValid}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={nameId} className="fl-label">Full name</label>
                    <input id={nameId} autoComplete="name" value={details.name} onChange={update('name')} className="fl-input" placeholder="Priya Sharma" />
                  </div>
                  <div>
                    <label htmlFor={phoneId} className="fl-label">Mobile</label>
                    <input id={phoneId} type="tel" autoComplete="tel" value={details.phone} onChange={update('phone')} className="fl-input" placeholder="98765 43210" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={emailId} className="fl-label">Email for order updates</label>
                    <input id={emailId} type="email" autoComplete="email" value={details.email} onChange={update('email')} className="fl-input" placeholder="you@example.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={addressId} className="fl-label">Delivery address</label>
                    <textarea id={addressId} rows={2} autoComplete="street-address" value={details.address} onChange={update('address')} className="fl-input resize-none" placeholder="House, street, city, PIN code" />
                  </div>
                </div>
              </Step>

              <Step number={2} title="Payment policy" done={policyAgreed}>
                <label className="fl-soft-accent flex cursor-pointer items-start gap-4 rounded-2xl border p-5">
                  <input
                    type="checkbox"
                    checked={policyAgreed}
                    onChange={(e) => setPolicyAgreed(e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span className="flex gap-3 text-sm leading-relaxed">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                    <span>
                      Each piece is crafted to order, so there is <strong className="font-semibold">no Cash on Delivery</strong>. I agree to pay upfront via UPI.
                    </span>
                  </span>
                </label>
              </Step>

              <Step number={3} title="Pay via UPI" done={false} locked={!paymentUnlocked}>
                {paymentUnlocked ? (
                  <div className="animate-rise">
                    <UpiPayment amount={total} orderId={orderId} status={status} onVerify={handleVerify} />
                  </div>
                ) : (
                  <p className="flex items-center gap-3 rounded-2xl border border-dashed px-5 py-6 text-sm text-[var(--muted-fg)]">
                    <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Complete your details and accept the payment policy to reveal your UPI QR code.
                  </p>
                )}
              </Step>
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass rounded-[1.75rem] p-6">
            <h2 className="fl-label">Order summary</h2>
            <div className="mt-2 flex gap-4">
              <img src={product.image} alt="" onError={hideBrokenImage} className="h-20 w-20 shrink-0 rounded-xl bg-[var(--muted)] object-cover" />
              <div className="min-w-0 flex-1">
                <p className="fl-serif text-xl leading-tight">{product.name}</p>
                <p className="mt-1 text-sm text-[var(--muted-fg)]">Qty {quantity}</p>
                {customization.text && <p className="mt-1 truncate text-xs italic text-[var(--muted-fg)]">“{customization.text}”</p>}
              </div>
            </div>
            <dl className="mt-6 space-y-2 border-t pt-5 text-sm">
              <div className="flex justify-between"><dt className="text-[var(--muted-fg)]">Subtotal</dt><dd className="tabular-nums">{formatINR(total)}</dd></div>
              <div className="flex justify-between"><dt className="text-[var(--muted-fg)]">Gift wrapping</dt><dd>Complimentary</dd></div>
              <div className="flex justify-between"><dt className="text-[var(--muted-fg)]">Delivery</dt><dd>Free</dd></div>
              <div className="flex justify-between border-t pt-4 text-base font-medium">
                <dt>Total</dt>
                <dd className="fl-serif text-2xl tabular-nums">{formatINR(total)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}

/* =========================================================================
   REVIEWS
   ========================================================================= */
function ReviewForm() {
  const { lastVerifiedOrder: order, addReview, pushToast, navigate } = useStore()
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submittedFor, setSubmittedFor] = useState(null)
  const [error, setError] = useState('')
  const titleId = useId()
  const bodyId = useId()

  const locked = !order || order.status !== 'verified'
  const submitted = order && submittedFor === order.id

  function submit(e) {
    e.preventDefault()
    if (!order) return
    if (title.trim().length < 3 || body.trim().length < 10) {
      setError('Please add a short title and at least a sentence about your experience.')
      return
    }
    setError('')
    addReview({
      id: `r-${Date.now()}`,
      name: order.customer.name.trim(),
      city: 'Verified buyer',
      rating,
      title: title.trim(),
      body: body.trim(),
      product: order.product.name,
      verified: true,
    })
    setSubmittedFor(order.id)
    setTitle('')
    setBody('')
    pushToast({ kind: 'mail', title: 'Review published', body: `Thank you! A confirmation for order ${order.id} was mailed to ${order.customer.email}.` })
  }

  return (
    <div className="glass relative overflow-hidden rounded-[1.75rem] p-6 sm:p-8 lg:sticky lg:top-28">
      <h3 className="fl-serif text-2xl">Write a review</h3>
      <p className="mt-1 text-sm text-[var(--muted-fg)]">Reviews are reserved for customers with a verified UPI payment.</p>

      {submitted ? (
        <div className="fl-soft-success animate-pop mt-8 rounded-2xl p-6 text-center">
          <BadgeCheck className="mx-auto h-8 w-8 text-[var(--success)]" aria-hidden="true" />
          <p className="mt-3 font-medium">Your review is live</p>
          <p className="mt-1 text-sm text-[var(--muted-fg)]">We&apos;ve sent a mail update to {order.customer.email}.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6" noValidate>
          <fieldset disabled={locked} className="space-y-5">
            <div>
              <span className="fl-label">Your rating</span>
              <div className="flex gap-1" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => {
                  const lit = n <= (hover || rating)
                  return (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={rating === n}
                      aria-label={`${n} star${n > 1 ? 's' : ''}`}
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHover(n)}
                      className="rounded-md p-0.5 transition-transform hover:scale-110"
                    >
                      <Star aria-hidden="true" className="h-7 w-7 transition-colors" style={lit ? { fill: 'var(--accent)', color: 'var(--accent)' } : { color: 'var(--border)' }} />
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label htmlFor={titleId} className="fl-label">Headline</label>
              <input id={titleId} value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} className="fl-input" placeholder="Sum it up in a line" />
            </div>
            <div>
              <label htmlFor={bodyId} className="fl-label">Your experience</label>
              <textarea id={bodyId} rows={4} value={body} maxLength={600} onChange={(e) => setBody(e.target.value)} className="fl-input resize-none" placeholder="How did they react when they opened it?" />
            </div>
            {error && <p role="alert" className="text-xs text-[var(--danger)]">{error}</p>}
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--fg)] py-3.5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90">
              <Send className="h-4 w-4" aria-hidden="true" />
              Publish review
            </button>
          </fieldset>
        </form>
      )}

      {locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md" style={{ background: 'color-mix(in oklch, var(--bg) 50%, transparent)' }}>
          <span className="glass flex h-14 w-14 items-center justify-center rounded-full">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="fl-serif mt-5 text-2xl">Unlocks after verification</p>
          <p className="mt-2 max-w-xs text-sm text-[var(--muted-fg)]">Once your pending order is verified by our studio, you can share your experience here.</p>
          <button type="button" onClick={() => navigate('home', 'collection')} className="mt-6 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-medium text-[var(--primary-fg)]">
            Shop the collection
          </button>
        </div>
      )}
    </div>
  )
}

function ReviewsSection() {
  const { reviews } = useStore()
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  return (
    <section id="reviews" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20 sm:px-6">
      <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <Eyebrow>Verified customers</Eyebrow>
          <h2 className="fl-serif mt-5 text-balance text-4xl leading-tight sm:text-5xl">
            Kind words, <em className="text-[var(--primary)]">kept.</em>
          </h2>
        </div>
        <div className="flex items-center gap-5">
          <p className="fl-serif text-6xl tabular-nums">{average.toFixed(1)}</p>
          <div>
            <Stars value={Math.round(average)} />
            <p className="mt-1 text-sm text-[var(--muted-fg)]">{reviews.length} verified reviews</p>
          </div>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_400px]">
        <ul className="grid gap-5 sm:grid-cols-2">
          {reviews.slice(0, 6).map((review, i) => (
            <Reveal as="li" key={review.id} delay={i * 70}>
              <article className="glass glass-sheen flex h-full flex-col rounded-[1.5rem] p-6 transition-transform duration-500 hover:-translate-y-1">
                <Stars value={review.rating} size="h-3.5 w-3.5" />
                <h3 className="fl-serif mt-4 text-xl leading-snug">“{review.title}”</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-fg)]">{review.body}</p>
                <footer className="mt-6 flex items-center justify-between gap-3 border-t pt-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{review.name}</p>
                    <p className="truncate text-xs text-[var(--muted-fg)]">{review.city} · {review.product}</p>
                  </div>
                  {review.verified && (
                    <span className="fl-soft-success flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-[var(--success)]">
                      <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                      Verified
                    </span>
                  )}
                </footer>
              </article>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={120}>
          <ReviewForm />
        </Reveal>
      </div>
    </section>
  )
}

/* =========================================================================
   ADMIN VIEW
   ========================================================================= */
function AdminView() {
  const { orders, approveOrder } = useStore()
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState(false)
  const passwordId = useId()

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (password === STORE.adminPassword) setAuthed(true)
            else setError(true)
          }}
          className="glass animate-rise rounded-[2rem] p-8"
        >
          <span className="glass flex h-12 w-12 items-center justify-center rounded-full">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="fl-serif mt-6 text-3xl">Partner login</h1>
          <p className="mb-6 mt-1 text-sm text-[var(--muted-fg)]">Studio access to verify UPI orders.</p>
          <label htmlFor={passwordId} className="fl-label">Password</label>
          <input
            id={passwordId}
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            className="fl-input"
            aria-invalid={error}
          />
          {error && <p role="alert" className="mt-2 text-xs text-[var(--danger)]">Incorrect password.</p>}
          <button type="submit" className="mt-6 w-full rounded-full bg-[var(--fg)] py-3.5 text-sm font-medium text-[var(--bg)]">
            Access dashboard
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Eyebrow>Studio dashboard</Eyebrow>
      <h1 className="fl-serif mt-4 text-4xl">Orders</h1>
      <div className="glass mt-8 overflow-x-auto rounded-[1.75rem]">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-20 text-center text-[var(--muted-fg)]">
            <Package className="h-8 w-8" aria-hidden="true" />
            <p className="mt-4">No orders in this session yet.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b text-xs uppercase tracking-[0.16em] text-[var(--muted-fg)]">
              <tr>
                {['Order', 'Customer', 'Item', 'Payment Details', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="px-6 py-4 font-mono text-xs">{o.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{o.customer.name}</p>
                    <p className="text-xs text-[var(--muted-fg)]">{o.customer.phone}</p>
                  </td>
                  <td className="px-6 py-4">{o.product.name} × {o.quantity}</td>
                  <td className="px-6 py-4">
                    <p className="tabular-nums font-medium">{formatINR(o.total)}</p>
                    <p className="text-xs font-mono text-[var(--muted-fg)]">UTR: {o.txnId}</p>
                    {o.receiptUrl && (
                      <a href={o.receiptUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline">
                        <FileImage className="h-3 w-3" /> View Receipt
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {o.status === 'pending' ? (
                      <button 
                        onClick={() => approveOrder(o.id)}
                        className="rounded-full bg-[var(--fg)] px-4 py-2 text-xs font-medium text-[var(--bg)] transition-transform hover:scale-105 active:scale-95"
                      >
                        Approve Order
                      </button>
                    ) : (
                      <span className="fl-soft-success inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--success)]">
                        <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

/* =========================================================================
   CONTACT MODAL (native <dialog>)
   ========================================================================= */
function ContactModal() {
  const { contactOpen, setContactOpen, pushToast } = useStore()
  const dialogRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', topic: 'Order support', message: '' })
  const nameId = useId()
  const emailId = useId()
  const topicId = useId()
  const messageId = useId()
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (contactOpen && !dialog.open) dialog.showModal()
    if (!contactOpen && dialog.open) dialog.close()
  }, [contactOpen])

  function submit(e) {
    e.preventDefault()
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    window.location.href = mailtoLink(`${form.topic} — ${form.name}`, body)
    pushToast({ kind: 'mail', title: 'Opening your mail app', body: 'Your message is drafted to our support team.' })
    setContactOpen(false)
  }

  const channels = [
    { icon: MessageCircle, label: 'WhatsApp', value: STORE.whatsappDisplay, href: whatsappLink('Hi Floweraaine! I need some help.'), external: true },
    { icon: Mail, label: 'Email', value: STORE.email, href: `mailto:${STORE.email}` },
    { icon: Phone, label: 'Call', value: STORE.whatsappDisplay, href: `tel:+${STORE.whatsappNumber}` },
  ]

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={() => setContactOpen(false)}
      onClick={(e) => { if (e.target === e.currentTarget) setContactOpen(false) }}
      className="fl-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(920px,calc(100%-2rem))] overflow-y-auto rounded-[2rem] bg-transparent p-0 text-[var(--fg)]"
    >
      <div className="glass glass-solid grid rounded-[2rem] md:grid-cols-[1fr_1.2fr]">
        <div className="border-b p-8 md:border-b-0 md:border-r">
          <h2 id={titleId} className="fl-serif text-4xl">Contact &amp; support</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-fg)]">
            Questions about an order, a custom idea, or a payment? A real person from our studio will reply.
          </p>
          <ul className="mt-8 space-y-3">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center gap-4 rounded-2xl border p-4 transition-colors hover:border-[var(--primary)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-fg)]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.18em] text-[var(--muted-fg)]">{label}</span>
                    <span className="block text-sm font-medium">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-2 text-sm text-[var(--muted-fg)]">
            <p className="flex items-center gap-2"><Clock className="h-4 w-4" aria-hidden="true" />{STORE.hours}</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" />{STORE.city}</p>
          </div>
        </div>

        <form onSubmit={submit} className="relative space-y-4 p-8">
          <button type="button" onClick={() => setContactOpen(false)} aria-label="Close contact form" className="fl-hover absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full">
            <X className="h-4 w-4" />
          </button>
          <p className="fl-serif pr-10 text-2xl">Send us a note</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={nameId} className="fl-label">Name</label>
              <input id={nameId} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="fl-input" />
            </div>
            <div>
              <label htmlFor={emailId} className="fl-label">Email</label>
              <input id={emailId} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="fl-input" />
            </div>
          </div>
          <div>
            <label htmlFor={topicId} className="fl-label">Topic</label>
            <select id={topicId} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="fl-input">
              <option>Order support</option>
              <option>Payment verification</option>
              <option>Custom hamper request</option>
              <option>Corporate gifting</option>
            </select>
          </div>
          <div>
            <label htmlFor={messageId} className="fl-label">Message</label>
            <textarea id={messageId} required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="fl-input resize-none" />
          </div>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] py-3.5 text-sm font-medium text-[var(--primary-fg)]">
            <Send className="h-4 w-4" aria-hidden="true" />
            Send message
          </button>
        </form>
      </div>
    </dialog>
  )
}

/* =========================================================================
   FOOTER, WHATSAPP FAB, TOASTER
   ========================================================================= */
function Footer() {
  const { navigate, setContactOpen } = useStore()
  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="fl-serif text-4xl italic">Floweraaine<span className="text-[var(--primary)]">.</span></p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--muted-fg)]">
              An artisan gifting studio crafting hampers and keepsakes by hand, one order at a time.
            </p>
            <button type="button" onClick={() => setContactOpen(true)} className="glass glass-sheen mt-6 rounded-full px-6 py-3 text-sm font-medium">
              Contact &amp; support
            </button>
          </div>
          <nav aria-label="Footer">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-fg)]">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><button type="button" onClick={() => navigate('home', 'collection')} className="hover:text-[var(--primary)]">Collection</button></li>
              <li><button type="button" onClick={() => navigate('home', 'bespoke')} className="hover:text-[var(--primary)]">Bespoke hampers</button></li>
              <li><button type="button" onClick={() => navigate('home', 'reviews')} className="hover:text-[var(--primary)]">Reviews</button></li>
              <li><button type="button" onClick={() => navigate('admin')} className="text-[var(--muted-fg)] hover:text-[var(--primary)]">Partner login</button></li>
            </ul>
          </nav>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-fg)]">Reach us</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={whatsappLink('Hi Floweraaine!')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--primary)]">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" /> {STORE.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${STORE.email}`} className="flex items-center gap-2 hover:text-[var(--primary)]">
                  <Mail className="h-4 w-4" aria-hidden="true" /> {STORE.email}
                </a>
              </li>
              <li className="text-[var(--muted-fg)]">{STORE.hours}</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-2 border-t pt-6 text-xs text-[var(--muted-fg)] sm:flex-row">
          <p>© {new Date().getFullYear()} Floweraaine. Crafted with care in India.</p>
          <p>UPI payments only · No cash on delivery</p>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Hi Floweraaine! I'd love some help choosing a gift.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Floweraaine on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 sm:bottom-8 sm:right-8"
    >
      <span className="glass pointer-events-none hidden translate-x-2 rounded-full px-4 py-2 text-sm font-medium opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
        Chat with us
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center">
        <span className="animate-ping-soft absolute inset-0 rounded-full bg-[var(--whatsapp)]" aria-hidden="true" />
        <span className="fl-shadow-wa relative flex h-14 w-14 items-center justify-center rounded-full bg-[var(--whatsapp)] text-white transition-transform duration-300 group-hover:scale-110">
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </span>
      </span>
    </a>
  )
}

const toastIcons = { mail: MailCheck, success: BadgeCheck, info: Info }

function Toaster() {
  const { toasts, dismissToast } = useStore()
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-5 left-5 z-[60] flex w-[min(380px,calc(100%-6.5rem))] flex-col gap-3 sm:bottom-8 sm:left-8">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.kind] ?? Info
        return (
          <div key={toast.id} role="status" className="glass glass-solid animate-rise pointer-events-auto flex gap-3 rounded-2xl p-4">
            <span className="fl-soft-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--primary)]">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{toast.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted-fg)]">{toast.body}</p>
            </div>
            <button type="button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification" className="fl-hover self-start rounded-full p-1 text-[var(--muted-fg)]">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

/* =========================================================================
   APP
   ========================================================================= */
function Views() {
  const { view } = useStore()
  return (
    <main key={view} className="animate-fade">
      {view === 'home' && (
        <>
          <Hero />
          <ProductGallery />
          <ReviewsSection />
        </>
      )}
      {view === 'customize' && <CustomizeView />}
      {view === 'checkout' && <CheckoutView />}
      {view === 'admin' && <AdminView />}
    </main>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <style>{GLOBAL_CSS}</style>
      <div className="relative min-h-screen text-[var(--fg)]">
        <LiquidBackground />
        <Navbar />
        <Views />
        <Footer />
        <WhatsAppFab />
        <ContactModal />
        <Toaster />
      </div>
    </StoreProvider>
  )
}