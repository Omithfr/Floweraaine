import React, { useState, useEffect } from 'react';
import { Lock, LoaderCircle, Package, BarChart3, Clock, PlusCircle, FileImage, BadgeCheck, Edit, Trash2, X } from 'lucide-react';
import { useStore } from '../store/store.jsx';
import { formatINR } from '../data.js';

// Enhanced check to safely catch both localhost and local IP addresses
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : '';

function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--primary)]">
      <span className="h-px w-6 bg-current opacity-60" aria-hidden="true" />
      {children}
    </span>
  );
}

export default function AdminView() {
  const { pushToast, fetchProducts } = useStore();
  const [dbOrders, setDbOrders] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [adminTab, setAdminTab] = useState('orders');

  // Product Form State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [prodForm, setProdForm] = useState({ name: '', price: '', description: '', category: 'ready', type: 'hampers', features: '', isTrending: false });
  const [prodFile, setProdFile] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);

  const authed = !!token;

  const handleLogin = async (e) => {
    e.preventDefault(); setError(false); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (data.success) { setToken(data.token); pushToast({ kind: 'success', title: 'Access Granted', body: 'Welcome to the super admin dashboard.' }); } 
      else { setError(true); }
    } catch (err) { setError(true); pushToast({ kind: 'error', title: 'Connection Error', body: 'Failed to reach Floweraaine servers.' }); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (authed) {
      setLoading(true);
      fetch(`${API_BASE}/api/orders`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setDbOrders(data);
          else { pushToast({ kind: 'error', title: 'Authentication Failed', body: data.message || 'Invalid token.' }); setToken(null); }
          setLoading(false);
        })
        .catch(err => { pushToast({ kind: 'error', title: 'Database Error', body: 'Failed to fetch orders.' }); setLoading(false); });

      // Fetch products for the Admin view
      fetchAdminProducts();
    }
  }, [authed, token, pushToast]);

  const fetchAdminProducts = () => {
    fetch(`${API_BASE}/api/products`)
      .then(res => res.json())
      .then(data => { if(data.success) setDbProducts(data.products); });
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${id}/approve`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) { setDbOrders(prev => prev.map(o => o.orderId === id ? { ...o, status: 'verified' } : o)); pushToast({ kind: 'success', title: 'Order Approved', body: `Order ${id} is verified in the database.` }); } 
      else { pushToast({ kind: 'error', title: 'Action Denied', body: result.message || 'Unauthorized.' }); }
    } catch(e) { pushToast({ kind: 'error', title: 'Update Failed', body: 'Could not approve order.' }); }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setProdForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      type: product.type,
      features: product.features.join(', '),
      isTrending: product.isTrending
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if(!window.confirm("Are you sure you want to completely delete this product?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if(data.success) {
        pushToast({ kind: 'success', title: 'Deleted', body: 'Product removed from database.' });
        fetchAdminProducts();
        fetchProducts(); // Refresh global store
      } else {
        pushToast({ kind: 'error', title: 'Error', body: data.message });
      }
    } catch (e) { pushToast({ kind: 'error', title: 'Server Error', body: 'Failed to delete.' }); }
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault(); setAddingProduct(true);
    let imageUrl = '';
    
    // Upload image if a new one was selected
    if (prodFile) {
      const fd = new FormData(); fd.append('image', prodFile);
      try {
        const upRes = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: fd });
        const upData = await upRes.json();
        if (upData.success) imageUrl = upData.url;
      } catch (err) { pushToast({ kind: 'error', title: 'Upload Failed', body: 'Could not upload image to Cloudinary.' }); }
    }

    const featureArray = prodForm.features.split(',').map(s => s.trim()).filter(Boolean);
    const payload = { ...prodForm, price: Number(prodForm.price), features: featureArray };
    if (imageUrl) payload.image = imageUrl; // Only override image if a new one was uploaded
    
    const url = editingId ? `${API_BASE}/api/products/${editingId}` : `${API_BASE}/api/products`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        pushToast({ kind: 'success', title: `Product ${editingId ? 'Updated' : 'Added'}`, body: `${prodForm.name} is now live.` });
        setProdForm({ name: '', price: '', description: '', category: 'ready', type: 'hampers', features: '', isTrending: false });
        setProdFile(null);
        setEditingId(null);
        setShowProductForm(false);
        fetchAdminProducts(); // Refresh local admin list
        fetchProducts(); // Refresh global store for customers
      } else { pushToast({ kind: 'error', title: 'Error', body: data.message }); }
    } catch (err) { pushToast({ kind: 'error', title: 'Server Error', body: 'Failed to save product.' }); } 
    finally { setAddingProduct(false); }
  };

  const verifiedOrders = dbOrders.filter(o => o.status === 'verified');
  const totalRevenue = verifiedOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = dbOrders.length - verifiedOrders.length;

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <form onSubmit={handleLogin} className="glass animate-rise rounded-[2rem] p-8">
          <span className="glass flex h-12 w-12 items-center justify-center rounded-full"><Lock className="h-5 w-5" aria-hidden="true" /></span>
          <h1 className="fl-serif mt-6 text-3xl">Partner login</h1>
          <p className="mb-6 mt-1 text-sm text-[var(--muted-fg)]">Super Admin Studio Access.</p>
          <label className="fl-label">Password</label>
          <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(false); }} className="fl-input" aria-invalid={error} disabled={loading} />
          {error && <p role="alert" className="mt-2 text-xs text-[var(--danger)]">Invalid credentials.</p>}
          <button type="submit" disabled={loading || !password} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--fg)] py-3.5 text-sm font-medium text-[var(--bg)] disabled:opacity-50">
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Access dashboard'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <Eyebrow>Super Admin</Eyebrow>
          <div className="mt-4 flex items-center gap-3"><h1 className="fl-serif text-4xl">Studio Dashboard</h1>{loading && <LoaderCircle className="h-5 w-5 animate-spin text-[var(--muted-fg)]" />}</div>
        </div>
        <button onClick={() => setToken(null)} className="self-start sm:self-end text-sm font-medium text-[var(--danger)] hover:underline">Sign out</button>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4 mb-8 overflow-x-auto">
        <button onClick={() => setAdminTab('orders')} className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${adminTab === 'orders' ? 'text-[var(--fg)] border-b-2 border-[var(--fg)]' : 'text-[var(--muted-fg)] hover:text-[var(--fg)]'}`}>Order Fulfillment</button>
        <button onClick={() => setAdminTab('products')} className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${adminTab === 'products' ? 'text-[var(--fg)] border-b-2 border-[var(--fg)]' : 'text-[var(--muted-fg)] hover:text-[var(--fg)]'}`}>Manage Catalog</button>
        <button onClick={() => setAdminTab('analytics')} className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${adminTab === 'analytics' ? 'text-[var(--fg)] border-b-2 border-[var(--fg)]' : 'text-[var(--muted-fg)] hover:text-[var(--fg)]'}`}>Analytics</button>
      </div>
      
      {/* TAB 1: ORDERS */}
      {adminTab === 'orders' && (
        <div className="glass overflow-x-auto rounded-[1.75rem] animate-fade">
          {dbOrders.length === 0 && !loading ? (
            <div className="flex flex-col items-center px-6 py-20 text-center text-[var(--muted-fg)]"><Package className="h-8 w-8" aria-hidden="true" /><p className="mt-4">No orders in the database yet.</p></div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b text-xs uppercase tracking-[0.16em] text-[var(--muted-fg)]">
                <tr>{['Order', 'Customer', 'Item', 'Payment', 'Status'].map((h) => <th key={h} className="px-6 py-4 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {dbOrders.map((o) => (
                  <tr key={o._id || o.orderId} className="border-b last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{o.orderId}</td>
                    <td className="px-6 py-4"><p className="font-medium">{o.customer.name}</p><p className="text-xs text-[var(--muted-fg)]">{o.customer.phone}</p></td>
                    <td className="px-6 py-4">{o.product.name} × {o.quantity}</td>
                    <td className="px-6 py-4">
                      <p className="tabular-nums font-medium">{formatINR(o.total)}</p>
                      {o.receiptUrl && <a href={o.receiptUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline"><FileImage className="h-3 w-3" /> View Receipt</a>}
                    </td>
                    <td className="px-6 py-4">
                      {o.status === 'pending' ? <button onClick={() => handleApprove(o.orderId)} className="rounded-full bg-[var(--fg)] px-4 py-2 text-xs font-medium text-[var(--bg)] transition-transform hover:scale-105 active:scale-95">Approve Order</button> : <span className="fl-soft-success inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--success)]"><BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 2: MANAGE CATALOG */}
      {adminTab === 'products' && (
        <div className="animate-fade space-y-8">
          
          {/* List Existing Products */}
          {!showProductForm && (
            <div className="glass rounded-[1.75rem] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="fl-serif text-2xl">Current Catalog</h2>
                <button onClick={() => { setEditingId(null); setProdForm({ name: '', price: '', description: '', category: 'ready', type: 'hampers', features: '', isTrending: false }); setShowProductForm(true); }} className="flex items-center gap-2 rounded-full bg-[var(--fg)] px-4 py-2 text-sm font-medium text-[var(--bg)] transition-transform hover:scale-105">
                  <PlusCircle className="h-4 w-4" /> Add New Product
                </button>
              </div>
              
              {dbProducts.length === 0 ? (
                <p className="text-center text-[var(--muted-fg)] py-10">No products in database. Add one to get started.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {dbProducts.map(p => (
                    <div key={p._id} className="flex items-center justify-between p-4 border rounded-2xl bg-white/5">
                      <div className="flex items-center gap-4">
                        {p.image && <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />}
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-[var(--muted-fg)]">{formatINR(p.price)} · {p.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditClick(p)} className="fl-hover p-2 rounded-full text-[var(--muted-fg)] hover:text-[var(--primary)]"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteProduct(p._id)} className="fl-hover p-2 rounded-full text-[var(--muted-fg)] hover:text-[var(--danger)]"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add / Edit Form */}
          {showProductForm && (
            <div className="glass max-w-3xl rounded-[1.75rem] p-8 relative">
              <button onClick={() => setShowProductForm(false)} className="absolute top-6 right-6 fl-hover p-2 rounded-full"><X className="h-5 w-5" /></button>
              <div className="flex items-center gap-3 mb-6"><Edit className="h-6 w-6 text-[var(--primary)]" /><h2 className="fl-serif text-2xl">{editingId ? 'Edit Product' : 'Publish New Product'}</h2></div>
              <form onSubmit={handleAddOrUpdateProduct} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><label className="fl-label">Product Name</label><input required value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} className="fl-input" placeholder="e.g. Vintage Aston Martin Frame" /></div>
                  <div><label className="fl-label">Price (INR)</label><input required type="number" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} className="fl-input" placeholder="e.g. 4500" /></div>
                  <div className="sm:col-span-2"><label className="fl-label">Description</label><textarea required rows={3} value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} className="fl-input resize-none" placeholder="Describe the item..." /></div>
                  <div><label className="fl-label">Category</label><select value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})} className="fl-input"><option value="ready">Ready to gift</option><option value="customizable">Customizable</option></select></div>
                  <div><label className="fl-label">Type</label><select value={prodForm.type} onChange={e => setProdForm({...prodForm, type: e.target.value})} className="fl-input"><option value="cars">Cars & Frames</option><option value="hampers">Luxury Hampers</option><option value="floral">Artisan Florals</option></select></div>
                  <div className="sm:col-span-2"><label className="fl-label">Features (Comma separated)</label><input required value={prodForm.features} onChange={e => setProdForm({...prodForm, features: e.target.value})} className="fl-input" placeholder="Die-cast model, Custom license plate, Premium LED..." /></div>
                  <div>
                    <span className="fl-label">Product Image {editingId && '(Leave blank to keep existing)'}</span>
                    <input type={editingId ? "file" : "file"} required={!editingId} accept="image/*" onChange={e => setProdFile(e.target.files[0])} className="block w-full text-sm text-[var(--muted-fg)] file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--fg)] hover:file:bg-white/20" />
                  </div>
                  <div className="flex items-center h-full pt-4"><label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={prodForm.isTrending} onChange={e => setProdForm({...prodForm, isTrending: e.target.checked})} className="h-5 w-5 rounded border-white/20 bg-white/5 accent-[var(--danger)]" /><span className="text-sm font-medium">Mark as Trending (Hot Badge)</span></label></div>
                </div>
                <button type="submit" disabled={addingProduct} className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] py-3.5 text-sm font-medium text-[var(--primary-fg)] transition-opacity hover:opacity-90 disabled:opacity-50">
                  {addingProduct ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <PlusCircle className="h-5 w-5" />} {addingProduct ? 'Saving to Database...' : 'Save Product'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ANALYTICS */}
      {adminTab === 'analytics' && (
        <div className="grid gap-6 sm:grid-cols-3 animate-fade">
          <div className="glass rounded-[1.75rem] p-8 flex flex-col justify-between h-40"><div className="flex items-center justify-between"><span className="text-sm uppercase tracking-widest text-[var(--muted-fg)]">Total Revenue</span><BarChart3 className="h-5 w-5 text-[var(--success)]" /></div><p className="fl-serif text-4xl">{formatINR(totalRevenue)}</p></div>
          <div className="glass rounded-[1.75rem] p-8 flex flex-col justify-between h-40"><div className="flex items-center justify-between"><span className="text-sm uppercase tracking-widest text-[var(--muted-fg)]">Total Orders</span><Package className="h-5 w-5 text-[var(--primary)]" /></div><p className="fl-serif text-4xl">{dbOrders.length}</p></div>
          <div className="glass rounded-[1.75rem] p-8 flex flex-col justify-between h-40"><div className="flex items-center justify-between"><span className="text-sm uppercase tracking-widest text-[var(--muted-fg)]">Pending Approval</span><Clock className="h-5 w-5 text-[var(--danger)]" /></div><p className="fl-serif text-4xl">{pendingCount}</p></div>
        </div>
      )}
    </div>
  );
}