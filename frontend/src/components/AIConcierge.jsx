import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, ArrowRight, LoaderCircle, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/store.jsx';
import { formatINR, hideBrokenImage } from '../data.js';

export default function AIConcierge() {
  const { products, selectProduct } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initial Greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ 
        type: 'bot', 
        text: "Hello! I am the Floweraaine Concierge. ✧\n\nWho are we treating today?", 
        options: ["My Partner", "A Family Member", "A Friend", "A Colleague"] 
      }]);
    }
  }, [isOpen, messages.length]);

  const handleOptionClick = (option) => {
    // 1. Add user's choice to chat
    setMessages(prev => [...prev, { type: 'user', text: option }]);
    setIsTyping(true);

    // 2. Simulate AI "thinking" delay
    setTimeout(() => {
      setIsTyping(false);
      
      if (step === 0) {
        setMessages(prev => [...prev, { type: 'bot', text: `Lovely. What occasion are we celebrating?`, options: ["Birthday", "Anniversary", "Wedding", "Just Because"] }]);
        setStep(1);
      } else if (step === 1) {
        setMessages(prev => [...prev, { type: 'bot', text: "Perfect. And what is your budget range?", options: ["Under ₹2000", "₹2000 - ₹4000", "Over ₹4000"] }]);
        setStep(2);
      } else if (step === 2) {
        setIsTyping(true);
        // Simulate searching the catalog
        setTimeout(() => {
           let recommended = products[0];
           if (products && products.length > 0) {
               if (option.includes("Under")) {
                 recommended = products.find(p => p.price <= 2000) || products[0];
               } else if (option.includes("Over")) {
                 recommended = products.find(p => p.price >= 4000) || products[products.length - 1];
               } else {
                 recommended = products.find(p => p.price > 2000 && p.price < 4000) || products[0];
               }
           }

           setIsTyping(false);
           setMessages(prev => [...prev, {
             type: 'bot',
             text: "I have browsed our studio and found the perfect piece for you.",
             product: recommended
           }]);
           setStep(3);
        }, 1500);
      }
    }, 800);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Optional: Keep chat history, or reset it. We'll keep it so they don't lose their recommendation.
  };

  const resetChat = () => {
    setMessages([]);
    setStep(0);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button (Bottom Left) */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`group fixed bottom-5 left-5 z-50 flex items-center gap-3 sm:bottom-8 sm:left-8 transition-transform duration-500 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Concierge"
      >
        <span className="relative flex h-14 w-14 items-center justify-center">
          <span className="animate-ping-soft absolute inset-0 rounded-full bg-[var(--primary)] opacity-40" />
          <span className="fl-shadow-primary relative flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-fg)] transition-transform duration-300 group-hover:scale-110">
            <Sparkles className="h-6 w-6" />
          </span>
        </span>
        <span className="glass pointer-events-none hidden -translate-x-2 rounded-full px-4 py-2 text-sm font-medium opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
          Gifting Concierge
        </span>
      </button>

      {/* Chat Interface Modal */}
      <div className={`fixed bottom-5 left-5 sm:bottom-8 sm:left-8 z-[60] w-[calc(100vw-2.5rem)] sm:w-[380px] transition-all duration-500 origin-bottom-left ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-50 opacity-0 pointer-events-none'}`}>
        <div className="glass glass-solid flex flex-col h-[550px] max-h-[80vh] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[var(--bg)]/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-fg)]">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h3 className="fl-serif text-lg leading-none">Studio Concierge</h3>
                <p className="text-[10px] uppercase tracking-widest text-[var(--primary)] mt-1">AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               {step === 3 && (
                 <button onClick={() => { setMessages([]); setStep(0); }} className="fl-hover p-2 rounded-full text-[var(--muted-fg)]" aria-label="Restart Quiz">
                   <ArrowLeft className="h-4 w-4" />
                 </button>
               )}
               <button onClick={handleClose} className="fl-hover p-2 rounded-full text-[var(--muted-fg)]">
                 <X className="h-5 w-5" />
               </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[color-mix(in_oklch,var(--muted)_30%,transparent)] scrollbar-hide">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'} animate-fade`}>
                <div className={`px-5 py-3.5 max-w-[85%] text-sm leading-relaxed rounded-2xl ${msg.type === 'user' ? 'bg-[var(--fg)] text-[var(--bg)] rounded-tr-sm' : 'glass rounded-tl-sm'}`}>
                  {msg.text.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}
                </div>
                
                {/* Options Buttons */}
                {msg.options && index === messages.length - 1 && (
                  <div className="flex flex-col gap-2 mt-4 w-full animate-rise">
                    {msg.options.map((opt) => (
                      <button 
                        key={opt} 
                        onClick={() => handleOptionClick(opt)}
                        className="text-left px-5 py-3 rounded-xl border border-[var(--primary)] text-[var(--primary)] text-sm font-medium transition-colors hover:bg-[var(--primary)] hover:text-[var(--primary-fg)]"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Product Recommendation Card */}
                {msg.product && (
                  <div className="mt-4 w-full max-w-[280px] animate-rise">
                    <div className="glass overflow-hidden rounded-[1.5rem] group cursor-pointer" onClick={() => { handleClose(); selectProduct(msg.product); }}>
                      <div className="aspect-[4/5] relative overflow-hidden">
                        <img src={msg.product.image || msg.product.images?.[0]} alt={msg.product.name} onError={hideBrokenImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="glass absolute right-3 bottom-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                           <ArrowRight className="h-4 w-4 text-[var(--fg)]" />
                        </span>
                      </div>
                      <div className="p-4 bg-[var(--bg)]">
                        <p className="text-xs uppercase tracking-widest text-[var(--muted-fg)]">{msg.product.type}</p>
                        <h4 className="fl-serif text-lg mt-1 truncate">{msg.product.name}</h4>
                        <p className="font-medium text-sm mt-1">{formatINR(msg.product.price)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start animate-fade">
                <div className="glass px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted-fg)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted-fg)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted-fg)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area (Disabled since it's a guided flow) */}
          <div className="p-4 border-t border-white/10 bg-[var(--bg)]">
            <div className="flex items-center justify-center text-xs text-[var(--muted-fg)]">
              Powered by Floweraaine AI
            </div>
          </div>

        </div>
      </div>
    </>
  );
}