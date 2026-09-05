import { useState } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  Navigate 
} from 'react-router-dom';
import { 
  ShoppingCart, 
  Upload, 
  QrCode, 
  CheckCircle, 
  Package, 
  Store, 
  ArrowLeft, 
  Image as ImageIcon, 
  ShieldAlert, 
  Heart, 
  Check, 
  Lock 
} from 'lucide-react';

// --- MOCK DATABASE ---
const products = [
  { 
    id: 1, 
    name: "BMW M4 Hamper Box", 
    price: 2000, 
    image: "/bmw-hamper.jpg", 
    description: "A premium gifting experience featuring a detailed BMW M4 model, presented in a luxury box with scented blue roses.", 
    features: ["Includes Car Model", "Scented Roses", "Luxury Gift Box"] 
  },
  { 
    id: 2, 
    name: "BMW M4 Diecast Model", 
    price: 1580, 
    image: "/bmw-m4.jpg", 
    description: "Highly detailed interactive model. Available in Blue, Black, and Red.", 
    features: ["2-Door, Bonnet & Dickey Opening", "Horn & Sound Effects", "Headlight Blinking"] 
  },
  { 
    id: 3, 
    name: "Porsche 911 Frame", 
    price: 730, 
    image: "/porsche.jpg", 
    description: "Classic Porsche model beautifully mounted on a customized display frame.", 
    features: ["2-Door Opening Feature", "Detailed Interior", "Display Frame Included"] 
  },
  { 
    id: 4, 
    name: "Trolly Hamper", 
    price: 2500, 
    image: "/trolly-hamper.jpg", 
    description: "A unique mini-trolley suitcase packed with chocolates, personal photos, and premium gifts.", 
    features: ["Mini Trolley Case", "Custom Photos", "Assorted Chocolates"] 
  },
  { 
    id: 5, 
    name: "Customized Hampers", 
    price: 1499, 
    image: "/custom-hamper.jpg", 
    description: "Tailor-made gift hampers for birthdays, anniversaries, and special occasions.", 
    features: ["Custom Chocolates", "Personalized Messages", "Elegant Packaging"] 
  },
  { 
    id: 6, 
    name: "4 x 4 Photo Frame", 
    price: 160, 
    image: "/4x4-frame.jpg", 
    description: "A minimalist 4x4 inch frame perfect for showcasing your favorite memories.", 
    features: ["4x4 Inch Size", "Premium White Finish", "Ready to Gift"] 
  }
];

// --- 1. GLOBAL NAVBAR ---
function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm px-8 py-5 flex justify-between items-center sticky top-0 z-50 border-b border-stone-100">
      <Link 
        to="/" 
        className="text-3xl font-serif italic tracking-wide text-rose-900 hover:text-rose-700 transition"
      >
        Floweraaine.
      </Link>
      <div className="flex gap-6 items-center">
        <Link 
          to="/" 
          className="text-stone-500 hover:text-stone-900 font-medium flex items-center gap-2 transition"
        >
          <Store size={18}/> Boutique
        </Link>
        <Link 
          to="/checkout" 
          className="bg-rose-600 text-white px-5 py-2.5 rounded-full hover:bg-rose-700 transition flex items-center gap-2 font-medium shadow-md shadow-rose-200"
        >
          <ShoppingCart size={18}/> Cart
        </Link>
      </div>
    </nav>
  );
}

// --- 2. STOREFRONT PAGE ---
function Storefront({ setSelectedProduct }) {
  const navigate = useNavigate();
  return (
    <div className="animate-in fade-in duration-700 max-w-6xl mx-auto p-6">
      <div className="text-center mb-16 mt-8">
        <span className="text-rose-600 font-semibold tracking-widest uppercase text-sm flex justify-center items-center gap-2 mb-3">
          <Heart size={16} className="fill-rose-600" /> Handmade for you
        </span>
        <h2 className="text-5xl font-serif text-stone-900 mb-6">Artisan Gifting, Personalized.</h2>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Every piece is crafted with care. Select a product below to step into our customization studio.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-100 flex flex-col group">
            <div className="overflow-hidden h-56 bg-stone-100 flex-shrink-0">
              <img 
                src={p.image} 
                alt={p.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                onError={(e) => {e.target.src="https://placehold.co/600x400/f5f5f4/a8a29e?text=Image+Pending"}} 
              />
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-stone-800">{p.name}</h3>
              <p className="text-rose-600 mt-2 font-medium text-lg mb-4">₹{p.price}</p>
              <p className="text-sm text-stone-500 mb-6 flex-grow">{p.description}</p>
              <ul className="space-y-2 mb-6 text-sm text-stone-600 font-medium">
                {p.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" /> {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => { 
                  setSelectedProduct(p); 
                  navigate('/customize'); 
                }}
                className="mt-auto w-full bg-stone-100 text-stone-800 py-3 rounded-2xl font-semibold hover:bg-rose-600 hover:text-white transition-colors duration-300"
              >
                Personalize & Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 3. CUSTOMIZATION PAGE ---
function Customize({ selectedProduct }) {
  const navigate = useNavigate();
  if (!selectedProduct) return <Navigate to="/" />;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">
      <div className="bg-white p-10 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 animate-in slide-in-from-bottom-8 duration-700">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-stone-400 mb-8 hover:text-stone-800 font-medium transition"
        >
          <ArrowLeft size={20} /> Return to Boutique
        </button>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2">
             <img 
               src={selectedProduct.image} 
               alt="Preview" 
               className="w-full rounded-2xl object-cover shadow-sm border border-stone-100 h-96" 
               onError={(e) => {e.target.src="https://placehold.co/600x400/f5f5f4/a8a29e?text=Image+Pending"}}
             />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <span className="text-rose-500 font-semibold tracking-widest uppercase text-xs mb-2">
              Customization Studio
            </span>
            <h2 className="text-4xl font-serif text-stone-900">{selectedProduct.name}</h2>
            <p className="text-2xl font-medium text-stone-600 mt-3">₹{selectedProduct.price}</p>
            
            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-3">
                  Your Personalized Text
                </label>
                <input 
                  type="text" 
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-stone-800 focus:ring-2 focus:ring-rose-200 outline-none placeholder:text-stone-400" 
                  placeholder="e.g., A special date, name, or vehicle number..." 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-3">
                  Reference Photograph
                </label>
                <div className="border-2 border-dashed border-stone-200 bg-stone-50 rounded-2xl p-8 flex flex-col items-center justify-center text-stone-500 cursor-pointer hover:bg-rose-50 transition-all">
                  <Upload size={32} className="mb-4 text-stone-300" />
                  <span className="text-sm font-semibold text-stone-700">Click to upload your favorite memory</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/checkout')} 
                className="w-full bg-rose-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-rose-700 transition-all shadow-lg flex justify-center items-center"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 4. CHECKOUT PAGE ---
function Checkout({ selectedProduct }) {
  const [policyAgreed, setPolicyAgreed] = useState(false);
  return (
    <div className="max-w-2xl mx-auto p-6 mt-8">
      <div className="bg-white p-10 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 animate-in fade-in duration-500">
        <h2 className="text-3xl font-serif text-stone-900 mb-8 text-center">Secure Checkout</h2>
        
        <div className="bg-stone-50 p-6 rounded-2xl mb-8 border border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-stone-500 uppercase text-xs tracking-widest mb-1">
              Order Summary
            </h3>
            <span className="text-lg font-medium text-stone-800">
              {selectedProduct ? selectedProduct.name : "Custom Order"}
            </span>
          </div>
          <span className="text-2xl font-serif text-rose-600">
            ₹{selectedProduct ? selectedProduct.price : "0"}
          </span>
        </div>

        <div className="space-y-4 mb-10">
          <h3 className="font-semibold text-stone-800 flex items-center gap-2">
            <ShieldAlert size={18} className="text-amber-500"/> Before we begin crafting...
          </h3>
          <label className="flex items-start gap-4 p-5 border border-amber-200 bg-amber-50/50 rounded-2xl cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 accent-amber-600 rounded" 
              onChange={(e) => setPolicyAgreed(e.target.checked)} 
            />
            <span className="text-sm text-amber-900 font-medium leading-relaxed">
              I understand there is <strong>no Cash on Delivery (COD)</strong>. I agree to upfront payment via UPI.
            </span>
          </label>
        </div>

        {policyAgreed ? (
          <div className="border border-emerald-100 bg-emerald-50/50 rounded-3xl p-10 text-center animate-in zoom-in-95 duration-500">
             <div className="bg-white p-4 rounded-2xl shadow-sm inline-block mb-6">
               <QrCode size={100} className="text-stone-800" />
             </div>
             <p className="font-serif text-2xl text-emerald-900 mb-2">Scan to Pay via UPI</p>
             <p className="text-emerald-700 mb-8 font-mono text-sm bg-emerald-100 inline-block px-4 py-1.5 rounded-lg border border-emerald-200">
               upi://pay?pa=owner@upi&pn=Floweraaine&am={selectedProduct ? selectedProduct.price : "0"}
             </p>
             
             <div className="border-2 border-dashed border-emerald-200 bg-white rounded-2xl p-8 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all flex flex-col items-center group">
               <ImageIcon size={32} className="mb-3 text-emerald-300 group-hover:text-emerald-500 transition-colors" />
               <span className="text-sm font-semibold text-emerald-800">Attach Payment Screenshot (Required)</span>
             </div>
             <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-emerald-700 transition-all mt-8 flex justify-center items-center gap-2 shadow-lg shadow-emerald-200/50">
               <CheckCircle size={22} /> Confirm My Order
             </button>
          </div>
        ) : (
          <div className="bg-stone-100 text-stone-500 p-8 rounded-2xl text-center text-sm font-medium border border-dashed">
            Please accept the policy above.
          </div>
        )}
      </div>
    </div>
  );
}

// --- 5. SECURE ADMIN PORTAL ---
function AdminHub() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-stone-100 w-full max-w-md text-center">
          <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={30} className="text-rose-600" />
          </div>
          <h2 className="text-2xl font-serif text-stone-900 mb-2">Studio Access</h2>
          <p className="text-stone-500 text-sm mb-8">Enter your partner credentials to view orders.</p>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..." 
            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-center text-stone-800 mb-4 outline-none focus:ring-2 focus:ring-rose-200"
          />
          <button 
            onClick={() => { 
              if(password === 'admin123') setIsAuthenticated(true); 
              else alert('Incorrect Password'); 
            }}
            className="w-full bg-stone-900 text-white py-4 rounded-xl font-semibold hover:bg-rose-600 transition-colors"
          >
            Unlock Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-serif text-stone-900 mb-8 flex items-center gap-3">
        <Package className="text-rose-600"/> Studio Dashboard
      </h2>
      <div className="bg-white shadow-xl shadow-stone-200/40 rounded-3xl overflow-hidden border border-stone-100">
        <div className="p-8 text-stone-500 text-center">
          Admin order table goes here (Hidden safely behind auth!)
        </div>
      </div>
    </div>
  );
}

// --- MAIN ROUTER APP ---
export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-rose-200 flex flex-col justify-between">
        <div>
          <Navbar />
          <Routes>
            <Route 
              path="/" 
              element={<Storefront setSelectedProduct={setSelectedProduct} />} 
            />
            <Route 
              path="/customize" 
              element={<Customize selectedProduct={selectedProduct} />} 
            />
            <Route 
              path="/checkout" 
              element={<Checkout selectedProduct={selectedProduct} />} 
            />
            <Route 
              path="/admin" 
              element={<AdminHub />} 
            />
          </Routes>
        </div>
        
        {/* DISCRETE FOOTER */}
        <footer className="py-8 text-center text-stone-400 text-sm mt-20 border-t border-stone-200">
          <p>© 2026 Floweraaine. All rights reserved.</p>
          <Link 
            to="/admin" 
            className="hover:text-stone-800 transition mt-2 inline-block"
          >
            Partner Login
          </Link>
        </footer>
      </div>
    </BrowserRouter>
  );
}