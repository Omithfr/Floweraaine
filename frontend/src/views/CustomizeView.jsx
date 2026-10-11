import React, { useId } from 'react';
import { ArrowLeft, ArrowRight, Check, ImagePlus, Minus, Plus, X, MessageCircle, Mail } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useStore } from '../store/store.jsx';
import { formatINR, hideBrokenImage, buildOrderMessage, whatsappLink, mailtoLink, OCCASIONS } from '../data.js';
import { Eyebrow } from '../components/SharedUI.jsx';

export default function CustomizeView() {
  const { selectedProduct: product, customization, setCustomization, quantity, setQuantity, navigate, customerUser, setShowAuthModal, pushToast } = useStore();
  const textId = useId();
  const noteId = useId();
  const photoId = useId();

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="fl-serif text-4xl">Choose a piece to begin</h1>
        <button type="button" onClick={() => navigate('home', 'collection')} className="mt-8 rounded-full bg-[var(--primary)] px-7 py-3 text-sm font-medium text-[var(--primary-fg)]">
          Browse the collection
        </button>
      </div>
    );
  }

  const customizable = product.category === 'customizable';
  const message = buildOrderMessage(product, quantity, customization);
  const productImages = Array.isArray(product.images) && product.images.length > 1 ? product.images : null;

  function handlePhoto(file) {
    if (!file || !file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) return;
    if (customization.photoUrl) URL.revokeObjectURL(customization.photoUrl);
    setCustomization({ photoUrl: URL.createObjectURL(file), photoName: file.name });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16">
      <button type="button" onClick={() => navigate('home', 'collection')} className="group mb-10 flex items-center gap-2 text-sm text-[var(--muted-fg)] transition-colors hover:text-[var(--fg)]">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
        Return to boutique
      </button>

      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="animate-rise md:sticky md:top-28 md:self-start min-w-0">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-[var(--muted)] shadow-2xl">
            {productImages ? (
              <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true, dynamicBullets: true }} className="h-full w-full !pb-0">
                {productImages.map((imgSrc, idx) => (
                  <SwiperSlide key={idx} className="h-full w-full">
                    <img src={imgSrc} alt={`${product.name} perspective ${idx + 1}`} onError={hideBrokenImage} className="h-full w-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <img src={product.image || product.images?.[0]} alt={product.name} onError={hideBrokenImage} className="h-full w-full object-cover" />
            )}

            {customization.photoUrl && (
              <div className="glass animate-pop pointer-events-none absolute bottom-4 right-4 z-20 w-28 rotate-3 rounded-xl p-1.5">
                <img src={customization.photoUrl} alt="Your uploaded reference" className="aspect-square w-full rounded-lg object-cover" />
              </div>
            )}
            {customization.text && (
              <div className="glass fl-serif animate-fade pointer-events-none absolute bottom-4 left-4 z-20 max-w-[60%] rounded-xl px-4 py-2 text-lg italic">
                {customization.text}
              </div>
            )}
          </div>
        </div>

        <div className="animate-rise min-w-0" style={{ animationDelay: '120ms' }}>
          <Eyebrow>{customizable ? 'Customization studio' : 'Ready to gift'}</Eyebrow>
          <h1 className="fl-serif mt-4 text-balance text-4xl leading-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-3 text-xl tabular-nums">{formatINR(product.price)}</p>
          <p className="mt-5 leading-relaxed text-[var(--muted-fg)]">{product.description}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {product.features?.map((f) => (
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
                  const active = customization.occasion === o;
                  return (
                    <button key={o} type="button" aria-pressed={active} onClick={() => setCustomization({ occasion: active ? '' : o })} className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${active ? 'bg-[var(--fg)] text-[var(--bg)]' : 'border text-[var(--muted-fg)] hover:text-[var(--fg)]'}`}>
                      {o}
                    </button>
                  );
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
                  <input id={textId} type="text" maxLength={40} value={customization.text} onChange={(e) => setCustomization({ text: e.target.value })} className="fl-input" placeholder="A name, a date, a number plate…" />
                </div>

                <div>
                  <span className="fl-label">Reference photograph</span>
                  {customization.photoName ? (
                    <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
                      <span className="truncate text-sm">{customization.photoName}</span>
                      <button type="button" aria-label="Remove photo" onClick={() => {
                        if (customization.photoUrl) URL.revokeObjectURL(customization.photoUrl);
                        setCustomization({ photoUrl: null, photoName: null });
                      }} className="fl-hover rounded-full p-1 text-[var(--muted-fg)] hover:text-[var(--fg)]">
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
              <textarea id={noteId} rows={3} maxLength={200} value={customization.note} onChange={(e) => setCustomization({ note: e.target.value })} className="fl-input resize-none" placeholder="We'll write this by hand on a linen card." />
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-6">
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
            onClick={() => {
              if (!customerUser) {
                pushToast({ kind: 'info', title: 'Sign In Required', body: 'Please log in to secure your order.' });
                setShowAuthModal(true);
              } else {
                navigate('checkout');
              }
            }} 
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
  );
}