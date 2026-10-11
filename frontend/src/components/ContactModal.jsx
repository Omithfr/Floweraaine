import React, { useEffect, useRef, useState, useId } from 'react';
import { X, Send, MessageCircle, Mail, Phone } from 'lucide-react';
import { useStore } from '../store/store.jsx';
import { STORE, mailtoLink, whatsappLink } from '../data.js';

export default function ContactModal() {
  const { contactOpen, setContactOpen, pushToast } = useStore();
  const dialogRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', topic: 'Order support', message: '' });
  
  const nameId = useId(); const emailId = useId(); const topicId = useId(); const messageId = useId(); const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (contactOpen && !dialog.open) dialog.showModal();
    if (!contactOpen && dialog.open) dialog.close();
  }, [contactOpen]);

  function submit(e) {
    e.preventDefault();
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.location.href = mailtoLink(`${form.topic} — ${form.name}`, body);
    pushToast({ kind: 'mail', title: 'Opening your mail app', body: 'Your message is drafted to our support team.' });
    setContactOpen(false);
  }

  const channels = [
    { icon: MessageCircle, label: 'WhatsApp', value: STORE.whatsappDisplay, href: whatsappLink('Hi Floweraaine! I need some help.'), external: true },
    { icon: Mail, label: 'Email', value: STORE.email, href: `mailto:${STORE.email}` },
    { icon: Phone, label: 'Call', value: STORE.whatsappDisplay, href: `tel:+${STORE.whatsappNumber}` },
  ];

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} onClose={() => setContactOpen(false)} onClick={(e) => { if (e.target === e.currentTarget) setContactOpen(false); }} className="fl-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(920px,calc(100%-2rem))] overflow-y-auto rounded-[2rem] bg-transparent p-0 text-[var(--fg)]">
      <div className="glass glass-solid grid rounded-[2rem] md:grid-cols-[1fr_1.2fr]">
        <div className="border-b p-8 md:border-b-0 md:border-r">
          <h2 id={titleId} className="fl-serif text-4xl">Contact &amp; support</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-fg)]">Questions about an order, a custom idea, or a payment? A real person from our studio will reply.</p>
          <ul className="mt-8 space-y-3">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label}>
                <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group flex items-center gap-4 rounded-2xl border p-4 transition-colors hover:border-[var(--primary)]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-fg)]"><Icon className="h-4 w-4" aria-hidden="true" /></span>
                  <span><span className="block text-xs uppercase tracking-[0.18em] text-[var(--muted-fg)]">{label}</span><span className="block text-sm font-medium">{value}</span></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="relative space-y-4 p-8">
          <button type="button" onClick={() => setContactOpen(false)} aria-label="Close contact form" className="fl-hover absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full"><X className="h-4 w-4" /></button>
          <p className="fl-serif pr-10 text-2xl">Send us a note</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor={nameId} className="fl-label">Name</label><input id={nameId} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="fl-input" /></div>
            <div><label htmlFor={emailId} className="fl-label">Email</label><input id={emailId} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="fl-input" /></div>
          </div>
          <div>
            <label htmlFor={topicId} className="fl-label">Topic</label>
            <select id={topicId} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="fl-input">
              <option>Order support</option><option>Payment verification</option><option>Custom hamper request</option><option>Corporate gifting</option>
            </select>
          </div>
          <div><label htmlFor={messageId} className="fl-label">Message</label><textarea id={messageId} required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="fl-input resize-none" /></div>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] py-3.5 text-sm font-medium text-[var(--primary-fg)]"><Send className="h-4 w-4" aria-hidden="true" /> Send message</button>
        </form>
      </div>
    </dialog>
  );
}