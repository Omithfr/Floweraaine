import React, { useState } from 'react';

export default function CustomerAuth({ onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Use dynamic API base to work locally and on Render
  const API_BASE = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://floweraaine.onrender.com');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();

      if (data.success) {
        // Save auth data locally
        localStorage.setItem('customerToken', data.token);
        localStorage.setItem('customerData', JSON.stringify(data.user));
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Failed to reach the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-[#140a0f] border border-white/10 rounded-2xl w-full max-w-md p-8 relative shadow-2xl">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition">
          ✕
        </button>

        <h2 className="text-3xl font-serif text-[#fdfbf7] mb-2">
          {isLogin ? 'Welcome back' : 'Join Floweraaine'}
        </h2>
        <p className="text-sm text-[#fdfbf7]/60 mb-6">
          {isLogin ? 'Sign in to track your bespoke orders.' : 'Create an account to track your orders and save preferences.'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1 tracking-wider uppercase">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition"
                placeholder="Omith Thilakan"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1 tracking-wider uppercase">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition"
              placeholder="hello@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1 tracking-wider uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#fdfbf7] text-[#140a0f] font-medium py-3 rounded-xl mt-4 hover:bg-white transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-sm text-white/50 hover:text-white transition"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

      </div>
    </div>
  );
}