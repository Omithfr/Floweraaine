import React from 'react';
import { StoreProvider, useStore } from './store/store.jsx';
import { LiquidBackground, WhatsAppFab, Toaster } from './components/SharedUI.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ContactModal from './components/ContactModal.jsx';
import CustomerAuth from './CustomerAuth.jsx';

import HomeView from './views/HomeView.jsx';
import CustomizeView from './views/CustomizeView.jsx';
import CheckoutView from './views/CheckoutView.jsx';
import AdminView from './views/AdminView.jsx';
import CustomerOrdersView from './views/CustomerOrdersView.jsx';

function Views() {
  const { view } = useStore();
  
  return (
    <main key={view} className="animate-fade">
      {view === 'home' && <HomeView />}
      {view === 'customize' && <CustomizeView />}
      {view === 'checkout' && <CheckoutView />}
      {view === 'admin' && <AdminView />}
      {view === 'my-orders' && <CustomerOrdersView />}
    </main>
  );
}

function AuthModalWrapper() {
  const { showAuthModal, setShowAuthModal, setCustomerUser } = useStore();
  if (!showAuthModal) return null;
  return <CustomerAuth onClose={() => setShowAuthModal(false)} onLoginSuccess={(user) => setCustomerUser(user)} />;
}

export default function App() {
  return (
    <StoreProvider>
      <div className="relative min-h-screen text-[var(--fg)]">
        <LiquidBackground />
        <Navbar />
        <Views />
        <Footer />
        <WhatsAppFab />
        <ContactModal />
        <Toaster />
        <AuthModalWrapper />
      </div>
    </StoreProvider>
  );
}