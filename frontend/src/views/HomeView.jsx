import React, { useState, useId } from 'react';
import { Sparkles, Gift, ShieldCheck, Truck, ArrowRight, ArrowUpRight, Check, Package, MessageCircle, Mail, Star, Send, Lock, BadgeCheck } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useStore } from '../store/store.jsx';
import { formatINR, hideBrokenImage, whatsappLink, mailtoLink } from '../data.js';
import { Reveal, Eyebrow, Stars } from '../components/SharedUI.jsx';

const pillars = [
  { icon: Sparkles, label: 'Handmade to order' },
  { icon: Gift, label: 'Personalized keepsakes' },
  { icon: ShieldCheck, label: 'Secure UPI payments' },
  { icon: Truck, label: 'Kerala-wide delivery' },
];

function Hero() {
  const { navigate, selectProduct, products } = useStore();
  const trendingProducts = products.filter((p) => p.isTrending);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 md:pt-20">
      <div className="grid items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16">
        <div className="animate-rise min-w-0">
          <Eyebrow>Artisan gifting studio</Eyebrow>
          <h1 className="fl-serif mt-6 text-balance text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Gifts, composed <em className="text-[var(--primary)]">by hand.</em>
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-[var(--muted-fg)]">Luxury hampers, collectible models and keepsakes — each one finished in our studio with your words, your photographs, your occasion.</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => navigate('home', 'collection')} className="fl-shadow-primary flex items-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3.5 text-sm font-medium text-[var(--primary-fg)] hover:gap-3">
              Explore the collection <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => navigate('home', 'bespoke')} className="glass glass-sheen rounded-full px-7 py-3.5 text-sm font-medium">Commission a hamper</button>
          </div>
          <div className="mt-10 flex items-center gap-3 text-sm text-[var(--muted-fg)]"><Stars value={5} /><span><strong className="font-medium text-[var(--fg)]">4.9</strong> from verified Kerala customers</span></div>
        </div>

        <div className="animate-rise relative min-w-0" style={{ animationDelay: '150ms' }}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-[var(--muted)] shadow-2xl group">
            {trendingProducts.length > 0 ? (
              <Swiper 
                modules={[Autoplay, Pagination]} 
                autoplay={{ delay: 3500, disableOnInteraction: false }} 
                pagination={{ clickable: true, dynamicBullets: true }} 
                slidesPerView={1} 
                spaceBetween={0}
                className="h-full w-full overflow-hidden"
              >
                {trendingProducts.map((p) => (
                  <SwiperSlide key={p.id} className="relative h-full w-full cursor-pointer overflow-hidden" onClick={() => selectProduct(p)}>
                    <img src={p.image || p.images?.[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-[4000ms] group-hover:scale-105" onError={hideBrokenImage} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute bottom-16 left-6 right-6 z-10 text-left">
                      <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-[var(--danger)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg"><Star className="h-3 w-3" fill="currentColor" /> Trending</span>
                      <h3 className="fl-serif text-2xl text-white">{p.name}</h3>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-[var(--muted)] text-[var(--muted-fg)]">Loading Catalog...</div>
            )}
          </div>
          {/* Quote Repositioned down and left */}
          <div className="glass absolute -bottom-10 -left-6 sm:-left-10 max-w-[240px] rounded-2xl p-5 z-20 shadow-xl">
            <p className="fl-serif text-lg italic leading-snug">“Every ribbon is tied by hand.”</p>
            <p className="mt-1 text-xs text-[var(--muted-fg)]">— The Floweraaine studio</p>
          </div>
          <div className="glass absolute -right-2 top-6 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium sm:-right-6 z-20">
            <span className="h-2 w-2 rounded-full bg-[var(--success)]" aria-hidden="true" /> Taking orders this week
          </div>
        </div>
      </div>

      <ul className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-[var(--border)] md:grid-cols-4">
        {pillars.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 bg-[var(--bg)] px-5 py-5 text-sm text-[var(--muted-fg)]"><Icon className="h-4 w-4 shrink-0 text-[var(--primary)]" /> {label}</li>
        ))}
      </ul>
    </section>
  );
}

function ProductCard({ product }) {
  const { selectProduct } = useStore();
  const customizable = product.category === 'customizable';

  return (
    <article className="group relative flex h-full flex-col">
      <button type="button" onClick={() => selectProduct(product)} className="relative block aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-[var(--muted)] text-left outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary)]/30">
        <img src={product.image || product.images?.[0]} alt="" onError={hideBrokenImage} className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-60 transition-opacity duration-700 group-hover:opacity-100" />
        <span className={`glass absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] ${customizable ? 'text-[var(--primary)]' : 'text-[var(--fg)]'}`}>
          {customizable ? <Sparkles className="h-3 w-3" /> : <Gift className="h-3 w-3" />} {customizable ? 'Customizable' : 'Ready to gift'}
        </span>
        {product.isTrending && <span className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-full bg-[var(--danger)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg animate-pulse"><Star className="h-3 w-3" fill="currentColor" /> Hot</span>}
        <span className="glass absolute right-4 top-16 flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight className="h-4 w-4" /></span>
        <ul className="absolute inset-x-4 bottom-4 translate-y-4 space-y-1.5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {product.features?.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-xs font-medium text-white"><Check className="h-3.5 w-3.5 shrink-0 text-white/80" /> {feature}</li>
          ))}
        </ul>
      </button>
      <div className="flex flex-1 flex-col px-1 pt-5">
        <div className="flex items-baseline justify-between gap-4"><h3 className="fl-serif text-2xl leading-tight">{product.name}</h3><p className="shrink-0 text-sm font-medium tabular-nums">{formatINR(product.price)}</p></div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted-fg)]">{product.description}</p>
        <button type="button" onClick={() => selectProduct(product)} className="mt-5 inline-flex w-fit items-center gap-2 border-b pb-1 text-sm font-medium transition-all duration-300 hover:gap-3 hover:border-[var(--primary)] hover:text-[var(--primary)]">
          {customizable ? 'Personalize & order' : 'View & order'} <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}

const filters = [
  { value: 'all', label: 'All pieces' },
  { value: 'cars', label: 'Cars & Frames' },
  { value: 'hampers', label: 'Luxury Hampers' },
  { value: 'floral', label: 'Artisan Florals' }
];

function ProductGallery() {
  const [filter, setFilter] = useState('all');
  const activeIndex = filters.findIndex((f) => f.value === filter);
  
  const { products } = useStore();
  const automotiveProducts = products.filter((p) => p.type === 'cars');
  const hamperProducts = products.filter((p) => p.type === 'hampers');
  const floralProducts = products.filter((p) => p.type === 'floral');

  return (
    <section id="collection" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20 sm:px-6">
      <Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-xl"><Eyebrow>The collection</Eyebrow><h2 className="fl-serif mt-5 text-balance text-4xl leading-tight sm:text-5xl">Pieces made to be <em className="text-[var(--primary)]">remembered.</em></h2></div>
        <div role="tablist" className="glass relative grid grid-cols-4 rounded-full p-1 overflow-x-auto">
          <span className="absolute inset-y-1 left-1 rounded-full bg-[var(--fg)] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ width: 'calc((100% - 0.5rem) / 4)', transform: `translateX(${activeIndex * 100}%)` }} />
          {filters.map((f) => (
            <button key={f.value} role="tab" aria-selected={filter === f.value} onClick={() => setFilter(f.value)} className={`relative z-10 whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors duration-500 sm:px-5 sm:text-sm ${filter === f.value ? 'text-[var(--bg)]' : 'text-[var(--muted-fg)] hover:text-[var(--fg)]'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </Reveal>

      {(filter === 'all' || filter === 'cars') && automotiveProducts.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4"><Package className="h-6 w-6 text-[var(--primary)]" /><h3 className="fl-serif text-3xl">Cars & Frames</h3></div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {automotiveProducts.map((product, i) => (<Reveal key={product.id} delay={i * 50} className="h-full"><ProductCard product={product} /></Reveal>))}
          </div>
        </div>
      )}

      {(filter === 'all' || filter === 'hampers') && hamperProducts.length > 0 && (
        <div className="mt-24">
          <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4"><Gift className="h-6 w-6 text-[var(--primary)]" /><h3 className="fl-serif text-3xl">Luxury Hampers</h3></div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {hamperProducts.map((product, i) => (<Reveal key={product.id} delay={i * 50} className="h-full"><ProductCard product={product} /></Reveal>))}
          </div>
        </div>
      )}

      {(filter === 'all' || filter === 'floral') && floralProducts.length > 0 && (
        <div className="mt-24">
          <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4"><Sparkles className="h-6 w-6 text-[var(--primary)]" /><h3 className="fl-serif text-3xl">Artisan Florals</h3></div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {floralProducts.map((product, i) => (<Reveal key={product.id} delay={i * 50} className="h-full"><ProductCard product={product} /></Reveal>))}
          </div>
        </div>
      )}

      <Reveal className="glass mt-24 grid gap-8 rounded-[2rem] p-8 md:grid-cols-[1.4fr_1fr] md:items-center md:p-12">
        <div id="bespoke" className="scroll-mt-32">
          <Eyebrow>Bespoke commissions</Eyebrow><h3 className="fl-serif mt-4 text-balance text-3xl leading-tight sm:text-4xl">Have something specific in mind?</h3>
          <p className="mt-3 max-w-lg leading-relaxed text-[var(--muted-fg)]">Tell us the person, the occasion and your budget. We will sketch a hamper around them and share a preview before we begin crafting.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          <a href={whatsappLink("Hi Floweraaine! I'd like to commission a bespoke hamper.")} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--whatsapp)] px-6 py-3.5 text-sm font-medium text-white transition-transform duration-300 hover:scale-[1.02]"><MessageCircle className="h-4 w-4" /> Order via WhatsApp</a>
          <a href={mailtoLink('Bespoke hamper enquiry', 'Hi Floweraaine,\n\nOccasion:\nRecipient:\nBudget:\nIdeas:\n')} className="fl-hover flex flex-1 items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-medium transition-colors"><Mail className="h-4 w-4" /> Email us</a>
        </div>
      </Reveal>
    </section>
  );
}

function ReviewForm() {
  const { lastVerifiedOrder: order, addReview, pushToast } = useStore();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submittedFor, setSubmittedFor] = useState(null);
  const [error, setError] = useState('');
  const titleId = useId(), bodyId = useId();

  const locked = !order || order.status !== 'verified';
  const submitted = order && submittedFor === order.id;

  function submit(e) {
    e.preventDefault();
    if (!order) return;
    if (title.trim().length < 3 || body.trim().length < 10) return setError('Please add a short title and at least a sentence about your experience.');
    setError('');
    addReview({ id: `r-${Date.now()}`, name: order.customer.name.trim(), city: 'Verified buyer', rating, title: title.trim(), body: body.trim(), product: order.product.name, verified: true });
    setSubmittedFor(order.id); setTitle(''); setBody('');
    pushToast({ kind: 'mail', title: 'Review published', body: `Thank you! A confirmation for order ${order.id} was mailed to ${order.customer.email}.` });
  }

  return (
    <div className="glass relative overflow-hidden rounded-[1.75rem] p-6 sm:p-8 lg:sticky lg:top-28">
      <h3 className="fl-serif text-2xl">Write a review</h3>
      <p className="mt-1 text-sm text-[var(--muted-fg)]">Reviews are reserved for customers with a verified UPI payment.</p>
      {submitted ? (
        <div className="fl-soft-success animate-pop mt-8 rounded-2xl p-6 text-center">
          <BadgeCheck className="mx-auto h-8 w-8 text-[var(--success)]" /><p className="mt-3 font-medium">Your review is live</p><p className="mt-1 text-sm text-[var(--muted-fg)]">We&apos;ve sent a mail update to {order.customer.email}.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6" noValidate>
          <fieldset disabled={locked} className="space-y-5">
            <div>
              <span className="fl-label">Your rating</span>
              <div className="flex gap-1" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star`} onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} className="rounded-md p-0.5 transition-transform hover:scale-110">
                    <Star className="h-7 w-7 transition-colors" style={n <= (hover || rating) ? { fill: 'var(--accent)', color: 'var(--accent)' } : { color: 'var(--border)' }} />
                  </button>
                ))}
              </div>
            </div>
            <div><label htmlFor={titleId} className="fl-label">Headline</label><input id={titleId} value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} className="fl-input" placeholder="Sum it up in a line" /></div>
            <div><label htmlFor={bodyId} className="fl-label">Your experience</label><textarea id={bodyId} rows={4} value={body} maxLength={600} onChange={(e) => setBody(e.target.value)} className="fl-input resize-none" placeholder="How did they react when they opened it?" /></div>
            {error && <p role="alert" className="text-xs text-[var(--danger)]">{error}</p>}
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--fg)] py-3.5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90"><Send className="h-4 w-4" /> Publish review</button>
          </fieldset>
        </form>
      )}
      {locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md" style={{ background: 'color-mix(in oklch, var(--bg) 50%, transparent)' }}>
          <span className="glass flex h-14 w-14 items-center justify-center rounded-full"><Lock className="h-5 w-5" /></span>
          <p className="fl-serif mt-5 text-2xl">Unlocks after verification</p><p className="mt-2 max-w-xs text-sm text-[var(--muted-fg)]">Once your pending order is verified by our studio, you can share your experience here.</p>
        </div>
      )}
    </div>
  );
}

function ReviewsSection() {
  const { reviews } = useStore();
  const average = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 5;

  return (
    <section id="reviews" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20 sm:px-6">
      <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div><Eyebrow>Verified customers</Eyebrow><h2 className="fl-serif mt-5 text-balance text-4xl leading-tight sm:text-5xl">Kind words, <em className="text-[var(--primary)]">kept.</em></h2></div>
        <div className="flex items-center gap-5"><p className="fl-serif text-6xl tabular-nums">{average.toFixed(1)}</p><div><Stars value={Math.round(average)} /><p className="mt-1 text-sm text-[var(--muted-fg)]">{reviews.length} verified reviews</p></div></div>
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
                  <div className="min-w-0"><p className="truncate text-sm font-medium">{review.name}</p><p className="truncate text-xs text-[var(--muted-fg)]">{review.city} · {review.product}</p></div>
                  {review.verified && <span className="fl-soft-success flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-[var(--success)]"><BadgeCheck className="h-3 w-3" /> Verified</span>}
                </footer>
              </article>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={120}><ReviewForm /></Reveal>
      </div>
    </section>
  );
}

export default function HomeView() {
  return (
    <>
      <Hero />
      <ProductGallery />
      <ReviewsSection />
    </>
  );
}