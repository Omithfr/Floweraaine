import React, { useState, useId } from 'react';
import { BadgeCheck, Clock, MailCheck, MessageCircle, Star, Lock, ShieldAlert, ShoppingBag, LoaderCircle, Smartphone, Check, Copy, FileImage, ImagePlus, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/store.jsx';
import { formatINR, hideBrokenImage, whatsappLink, STORE } from '../data.js';
import { Eyebrow } from '../components/SharedUI.jsx';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
const makeOrderId = () => `FLW-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

const upiSteps = [
  'Scan the QR with any UPI app — GPay, PhonePe, Paytm or your bank app.',
  'Confirm the amount and payee name “Floweraaine” before paying.',
  'Take a screenshot of the successful payment receipt.',
  'Upload the screenshot below and submit.',
];

function UpiPayment({ amount, orderId, status, onVerify }) {
  const [receiptUrl, setReceiptUrl] = useState(null);
  const [receiptName, setReceiptName] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileId = useId();
  const errorId = useId();

  const upiUri = `upi://pay?pa=${encodeURIComponent(STORE.upiId)}&pn=${encodeURIComponent(STORE.name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Order ${orderId}`)}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=368x368&margin=0&color=1f1715&data=${encodeURIComponent(upiUri)}`;

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(STORE.upiId.replace('@upi', ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  function handleReceipt(file) {
    if (!file || !file.type.startsWith('image/')) return;
    if (receiptUrl) URL.revokeObjectURL(receiptUrl);
    setReceiptUrl(URL.createObjectURL(file));
    setReceiptName(file.name);
    setReceiptFile(file);
    setError('');
  }

  function submit(e) {
    e.preventDefault();
    if (!receiptUrl) {
      setError('Please upload a screenshot of your successful payment receipt.');
      return;
    }
    setError('');
    onVerify({ receiptFile, receiptUrl });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-center">
        <div className="relative rounded-[1.5rem] bg-white p-5 shadow-xl">
          <img src={qrSrc} width={184} height={184} alt="UPI QR code" className="h-[184px] w-[184px]" />
          <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-fg)] shadow-lg">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
        <p className="fl-serif mt-4 text-3xl tabular-nums">{formatINR(amount)}</p>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-fg)]">Ref · {orderId}</p>

        <div className="mt-4 flex w-full items-center justify-between gap-2 rounded-full border py-1 pl-4 pr-1">
          <span className="truncate font-mono text-xs">{STORE.upiId.replace('@upi', '')}</span>
          <button type="button" onClick={copyUpi} className="fl-hover flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium">
            {copied ? <Check className="h-3 w-3" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <a href={upiUri} className="fl-hover mt-3 flex w-full items-center justify-center gap-2 rounded-full border py-2.5 text-xs font-medium lg:hidden">
          <Smartphone className="h-3.5 w-3.5" aria-hidden="true" /> Open in UPI app
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
            <span className="fl-label">Payment Screenshot</span>
            {receiptName ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 bg-[color-mix(in_oklch,var(--success)_10%,transparent)]">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileImage className="h-4 w-4 shrink-0 text-[var(--success)]" />
                  <span className="truncate text-sm font-medium">{receiptName}</span>
                </div>
                <button type="button" aria-label="Remove receipt" onClick={() => {
                  if (receiptUrl) URL.revokeObjectURL(receiptUrl);
                  setReceiptUrl(null); setReceiptName(null); setReceiptFile(null);
                }} className="fl-hover rounded-full p-1 text-[var(--muted-fg)] hover:text-[var(--fg)]" disabled={status !== 'idle'}>
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

          <button type="submit" disabled={status !== 'idle'} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--fg)] px-6 py-3.5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-60">
            {status === 'verifying' ? (
              <><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> Submitting for Verification...</>
            ) : 'Submit Payment Proof'}
          </button>
          {error && <p id={errorId} role="alert" className="text-center text-xs text-[var(--danger)]">{error}</p>}
        </form>
      </div>
    </div>
  );
}

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
  );
}

function OrderConfirmed({ order, onReview }) {
  const pending = order.status === 'pending';
  const waMessage = `Hi Floweraaine! I have paid ${formatINR(order.total)} for Order ${order.id}. Please find my payment screenshot attached.`;

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
      </div>

      {pending ? (
        <div className="glass border-[var(--whatsapp)] overflow-hidden rounded-[1.75rem] bg-[color-mix(in_oklch,var(--whatsapp)_5%,transparent)]">
          <div className="space-y-4 px-6 py-6 text-sm leading-relaxed text-center">
            <h3 className="fl-serif text-2xl text-[var(--whatsapp)]">One last step!</h3>
            <p className="text-[var(--fg)]">
              To expedite your order, please click below to open WhatsApp and <strong className="font-semibold">attach the screenshot</strong> you just uploaded.
            </p>
            <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--whatsapp)] py-4 text-sm font-medium text-white transition-transform hover:scale-[1.02]">
              <MessageCircle className="h-5 w-5" aria-hidden="true" /> Send Screenshot on WhatsApp
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
                Dear {order.customer.name.split(' ')[0]}, we've received your UPI payment of {formatINR(order.total)} for {order.product.name}. We'll share a preview on WhatsApp before dispatch.
              </p>
            </div>
          </div>
          <button type="button" onClick={onReview} className="fl-shadow-primary flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] py-4 text-sm font-medium text-[var(--primary-fg)]">
            <Star className="h-4 w-4" aria-hidden="true" /> Share a verified review
          </button>
        </>
      )}
    </div>
  );
}

export default function CheckoutView() {
  const { selectedProduct: product, quantity, customization, navigate, addOrder, pushToast, customerUser } = useStore();
  const [orderId] = useState(makeOrderId);
  const [details, setDetails] = useState({ name: customerUser?.name || '', email: customerUser?.email || '', phone: '', address: '', state: 'Kerala' });
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [status, setStatus] = useState('idle');
  const [order, setOrder] = useState(null);
  
  const nameId = useId(); const emailId = useId(); const phoneId = useId(); const addressId = useId(); const stateId = useId();

  if (!product) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <span className="glass flex h-16 w-16 items-center justify-center rounded-full"><ShoppingBag className="h-6 w-6 text-[var(--muted-fg)]" aria-hidden="true" /></span>
        <h1 className="fl-serif mt-6 text-4xl">Your bag is empty</h1>
        <p className="mt-3 text-[var(--muted-fg)]">Choose a piece from the collection to begin.</p>
        <button type="button" onClick={() => navigate('home', 'collection')} className="mt-8 rounded-full bg-[var(--primary)] px-7 py-3 text-sm font-medium text-[var(--primary-fg)]">Browse the collection</button>
      </div>
    );
  }

  const total = product.price * quantity;
  const detailsValid = details.name.trim().length > 1 && /^\S+@\S+\.\S+$/.test(details.email) && /^\d{10}$/.test(details.phone) && details.state === 'Kerala' && details.address.trim().length > 8;
  const paymentUnlocked = detailsValid && policyAgreed;

  async function handleVerify({ receiptFile, receiptUrl }) {
    setStatus('verifying');
    let finalReceiptUrl = receiptUrl;

    if (receiptFile) {
      const formData = new FormData();
      formData.append('image', receiptFile);
      try {
        const uploadRes = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.success) { finalReceiptUrl = uploadData.url; }
      } catch (err) { console.error('Cloudinary receipt upload failed:', err); }
    }

    const orderPayload = {
      orderId,
      customer: details,
      product: { name: product.name, price: product.price },
      quantity,
      total,
      customization: { occasion: customization.occasion, text: customization.text, note: customization.note, photoName: customization.photoName },
      receiptUrl: finalReceiptUrl
    };

    try {
      const response = await fetch(`${API_BASE}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderPayload) });
      const result = await response.json();
      if (result.success) {
        const dbOrder = { ...result.order, id: result.order.orderId }; 
        addOrder(dbOrder); setOrder(dbOrder); setStatus('verified'); 
        pushToast({ kind: 'success', title: 'Payment Submitted', body: `Order ${orderId} secured in database.` });
      } else {
        setStatus('idle'); pushToast({ kind: 'error', title: 'Order Failed', body: result.message });
      }
    } catch (error) {
      setStatus('idle'); pushToast({ kind: 'error', title: 'Connection Error', body: 'Failed to reach Floweraaine servers.' });
    }
  }

  const update = (key) => (e) => setDetails((d) => ({ ...d, [key]: e.target.value }));

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
                  <div><label htmlFor={nameId} className="fl-label">Full name</label><input id={nameId} autoComplete="name" value={details.name} onChange={update('name')} className="fl-input" placeholder="Priya Sharma" /></div>
                  <div><label htmlFor={phoneId} className="fl-label">Mobile (10 Digits)</label><input id={phoneId} type="tel" maxLength={10} autoComplete="tel" value={details.phone} onChange={(e) => setDetails(d => ({ ...d, phone: e.target.value.replace(/\D/g, '') }))} className="fl-input" placeholder="e.g. 9745082273" /></div>
                  <div className="sm:col-span-2"><label htmlFor={emailId} className="fl-label">Email for order updates</label><input id={emailId} type="email" autoComplete="email" value={details.email} onChange={update('email')} className="fl-input" placeholder="you@example.com" /></div>
                  <div className="sm:col-span-2">
                    <label htmlFor={stateId} className="fl-label">Shipping State</label>
                    <select id={stateId} value={details.state} onChange={update('state')} className="fl-input appearance-none bg-[var(--muted)]"><option value="Kerala">Kerala (Exclusive)</option></select>
                    <p className="mt-1 text-xs text-[var(--danger)]">We currently only fulfill orders within Kerala.</p>
                  </div>
                  <div className="sm:col-span-2"><label htmlFor={addressId} className="fl-label">Delivery address</label><textarea id={addressId} rows={2} autoComplete="street-address" value={details.address} onChange={update('address')} className="fl-input resize-none" placeholder="House, street, city, PIN code" /></div>
                </div>
              </Step>

              <Step number={2} title="Payment policy" done={policyAgreed}>
                <label className="fl-soft-accent flex cursor-pointer items-start gap-4 rounded-2xl border p-5">
                  <input type="checkbox" checked={policyAgreed} onChange={(e) => setPolicyAgreed(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0" style={{ accentColor: 'var(--primary)' }} />
                  <span className="flex gap-3 text-sm leading-relaxed"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" /><span>Each piece is crafted to order, so there is <strong className="font-semibold">no Cash on Delivery</strong>. I agree to pay upfront via UPI.</span></span>
                </label>
              </Step>

              <Step number={3} title="Pay via UPI" done={false} locked={!paymentUnlocked}>
                {paymentUnlocked ? (
                  <div className="animate-rise"><UpiPayment amount={total} orderId={orderId} status={status} onVerify={handleVerify} /></div>
                ) : (
                  <p className="flex items-center gap-3 rounded-2xl border border-dashed px-5 py-6 text-sm text-[var(--muted-fg)]"><Lock className="h-4 w-4 shrink-0" aria-hidden="true" /> Complete your details and accept the payment policy to reveal your UPI QR code.</p>
                )}
              </Step>
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass rounded-[1.75rem] p-6">
            <h2 className="fl-label">Order summary</h2>
            <div className="mt-2 flex gap-4">
              <img src={product.image || product.images?.[0]} alt="" onError={hideBrokenImage} className="h-20 w-20 shrink-0 rounded-xl bg-[var(--muted)] object-cover" />
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
              <div className="flex justify-between border-t pt-4 text-base font-medium"><dt>Total</dt><dd className="fl-serif text-2xl tabular-nums">{formatINR(total)}</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}