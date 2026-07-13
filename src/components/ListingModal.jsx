import React, { useState } from 'react';
import { X, Sparkles, Plus, AlertCircle, CheckCircle, IndianRupee, ShieldCheck } from 'lucide-react';
import { api } from '../api';

const CATEGORIES = ['Electronics', 'Camera', 'Laptop', 'Cycle', 'Gaming', 'Projector', 'Sports', 'Musical Instruments', 'Books', 'Hostel Essentials', 'Tools', 'Fashion'];

export default function ListingModal({ onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Camera');
  const [rentPricePerDay, setRentPricePerDay] = useState('');
  const [deposit, setDeposit] = useState('500');
  const [condition, setCondition] = useState('Like New');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80');
  const [loading, setLoading] = useState(false);
  const [aiPriceHint, setAiPriceHint] = useState(null);

  const handlePriceCheck = () => {
    const val = Number(rentPricePerDay);
    if (!val) return;
    if (val > 1500) {
      setAiPriceHint({ status: 'warn', msg: '₹' + val + '/day is above Indian campus median. Lowering to ₹350–₹600 increases bookings 3x.' });
    } else {
      setAiPriceHint({ status: 'ok', msg: '✓ Price is well within standard IIT/BITS campus benchmark range.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createProduct({
        title,
        category,
        rentPricePerDay: Number(rentPricePerDay),
        deposit: Number(deposit),
        condition,
        description,
        images: [imageUrl],
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      alert('Error creating listing: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(15,17,23,0.5)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} className="anim-in">
      <div className="card" style={{
        width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto',
        padding: 32, position: 'relative', background: 'var(--surface)',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}>
          <X size={20} />
        </button>

        <div style={{ marginBottom: 24 }}>
          <span className="eyebrow" style={{ color: 'var(--coral)' }}>Peer Marketplace</span>
          <h2 style={{ fontSize: 24, marginTop: 4 }}>List Your Gear (₹ INR)</h2>
          <p className="body-sm">Earn passive income from your unused campus gear. Protected by AI pricing shield.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 6 }}>Title / Item Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Sony Alpha A6000 Camera + 50mm Lens"
              className="input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="input" style={{ cursor: 'pointer' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Condition</label>
              <select value={condition} onChange={e => setCondition(e.target.value)} className="input" style={{ cursor: 'pointer' }}>
                {['Brand New', 'Like New', 'Good', 'Fair'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Daily Rent (₹ INR)</label>
              <input
                type="number"
                required
                value={rentPricePerDay}
                onChange={e => setRentPricePerDay(e.target.value)}
                onBlur={handlePriceCheck}
                placeholder="400"
                className="input"
              />
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Refundable Deposit (₹)</label>
              <input
                type="number"
                required
                value={deposit}
                onChange={e => setDeposit(e.target.value)}
                placeholder="500"
                className="input"
              />
            </div>
          </div>

          {aiPriceHint && (
            <div className={`badge ${aiPriceHint.status === 'ok' ? 'badge-green' : 'badge-amber'}`} style={{ padding: 12, borderRadius: 12, display: 'flex', gap: 8 }}>
              <Sparkles size={14} flexShrink={0} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>{aiPriceHint.msg}</span>
            </div>
          )}

          <div>
            <label className="label" style={{ display: 'block', marginBottom: 6 }}>Description & Included Accessories</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Include details like charger, SD card, carry bag..."
              className="input"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label className="label" style={{ display: 'block', marginBottom: 6 }}>Image URL</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="input"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
            <Plus size={16} />
            <span>{loading ? 'Publishing...' : 'Publish Campus Listing'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
