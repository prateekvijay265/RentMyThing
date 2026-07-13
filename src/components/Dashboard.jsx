import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Heart, User, ShieldCheck, Plus, CheckCircle, Clock, Key, Star, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import ChatModal from './ChatModal';
import { api } from '../api';

const TABS = [
  { id: 'rentals', label: 'My Bookings', icon: ShoppingBag },
  { id: 'listings', label: 'My Gear Listings', icon: Package },
  { id: 'wishlist', label: 'Saved Wishlist', icon: Heart },
  { id: 'profile', label: 'Campus Profile', icon: User },
];

export default function Dashboard({ user, onRefreshUser, onSelectProduct, onViewChange }) {
  const [activeTab, setActiveTab] = useState('rentals');
  const [rentals, setRentals] = useState([]);
  const [listings, setListings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChatRecipient, setActiveChatRecipient] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpBookingId, setOtpBookingId] = useState(null);
  const [otpType, setOtpType] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rData, lData, wData] = await Promise.all([
        api.getMyRentals(),
        api.getMyListings(),
        api.getWishlist(),
      ]);
      setRentals(rData || []);
      setListings(lData || []);
      setWishlist(wData || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleVerifyOtp = async () => {
    if (!otpInput || !otpBookingId) return;
    try {
      if (otpType === 'pickup') {
        await api.verifyPickupOtp(otpBookingId, otpInput);
      } else {
        await api.verifyReturnOtp(otpBookingId, otpInput);
      }
      setOtpBookingId(null);
      setOtpInput('');
      fetchData();
    } catch (err) {
      alert('Verification failed: ' + err.message);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ paddingTop: 80, paddingBottom: 120, textAlign: 'center' }}>
        <h2 className="display-md">Please Sign In</h2>
        <p className="body-md" style={{ marginTop: 12 }}>You need to be logged in to view your campus dashboard.</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: 'calc(100vh - 68px)', paddingBottom: 96 }}>
      {/* Profile Header Banner */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', paddingTop: 48, paddingBottom: 40 }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: 68, height: 68, borderRadius: 20,
                background: 'var(--coral)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 700,
                boxShadow: 'var(--shadow-sm)',
              }}>
                {user.name?.[0]?.toUpperCase() || 'S'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h1 style={{ fontSize: 28, margin: 0 }}>{user.name}</h1>
                  <span className="badge badge-green">
                    <ShieldCheck size={12} /> Verified Campus ID
                  </span>
                </div>
                <p className="body-md" style={{ marginTop: 4 }}>
                  {user.college || 'IIT Delhi'} · {user.hostel || 'Hostel Room'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => onViewChange('list')} className="btn btn-primary">
                <Plus size={15} /> List New Gear (₹)
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: 8, marginTop: 32, overflowX: 'auto' }} className="scrollbar-none">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`btn ${activeTab === id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '10px 18px', fontSize: 13 }}
              >
                <Icon size={15} />
                <span>{label}</span>
                {id === 'rentals' && rentals.length > 0 && (
                  <span style={{
                    padding: '2px 8px', borderRadius: 100,
                    background: activeTab === id ? 'rgba(255,255,255,0.25)' : 'var(--surface-3)',
                    fontSize: 11, fontWeight: 700
                  }}>
                    {rentals.length}
                  </span>
                )}
                {id === 'listings' && listings.length > 0 && (
                  <span style={{
                    padding: '2px 8px', borderRadius: 100,
                    background: activeTab === id ? 'rgba(255,255,255,0.25)' : 'var(--surface-3)',
                    fontSize: 11, fontWeight: 700
                  }}>
                    {listings.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container" style={{ marginTop: 40 }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 220 }} />)}
          </div>
        ) : activeTab === 'rentals' ? (
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>My Active & Past Bookings</h2>
            {rentals.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                <ShoppingBag size={40} color="var(--ink-faint)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: 18 }}>No bookings yet</h3>
                <p className="body-md" style={{ marginTop: 6, marginBottom: 20 }}>Explore campus gear listed by peers around your hostel.</p>
                <button onClick={() => onViewChange('search')} className="btn btn-primary">Browse Campus Gear</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {rentals.map((booking) => (
                  <div key={booking.id} className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span className="badge badge-coral">{booking.status || 'Active'}</span>
                        <span style={{ fontSize: 12, color: 'var(--ink-muted)', fontWeight: 600 }}>Booking #{booking.id}</span>
                      </div>
                      <h4 style={{ fontSize: 18, marginBottom: 4 }}>{booking.productTitle || 'Campus Rental Item'}</h4>
                      <p className="body-sm">
                        <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
                        {booking.startDate} to {booking.endDate} · <strong style={{ color: 'var(--ink)' }}>₹{booking.totalPrice} INR</strong>
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      {booking.pickupOtp && (
                        <div style={{ padding: '8px 14px', borderRadius: 12, background: 'var(--coral-light)', border: '1px solid var(--coral-mid)' }}>
                          <span className="label" style={{ display: 'block', fontSize: 10 }}>Pickup OTP Code</span>
                          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: 'var(--coral)' }}>{booking.pickupOtp}</span>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setOtpBookingId(booking.id);
                          setOtpType('pickup');
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <Key size={13} /> Verify OTP
                      </button>

                      <button
                        onClick={() => setActiveChatRecipient({ id: booking.ownerId || 'host_1', name: booking.ownerName || 'Host Student' })}
                        className="btn btn-secondary btn-sm"
                      >
                        <MessageSquare size={13} /> Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'listings' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22 }}>My Listed Gear</h2>
              <button onClick={() => onViewChange('list')} className="btn btn-primary btn-sm">+ List New Item</button>
            </div>
            {listings.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                <Package size={40} color="var(--ink-faint)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: 18 }}>No gear listed yet</h3>
                <p className="body-md" style={{ marginTop: 6, marginBottom: 20 }}>Start earning ₹ by listing your unused cameras, laptops, or cycles.</p>
                <button onClick={() => onViewChange('list')} className="btn btn-primary">+ List Gear Now</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                {listings.map(p => (
                  <ProductCard key={p.id} product={p} onSelectProduct={onSelectProduct} />
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'wishlist' ? (
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>My Saved Wishlist</h2>
            {wishlist.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                <Heart size={40} color="var(--ink-faint)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: 18 }}>Your wishlist is empty</h3>
                <p className="body-md" style={{ marginTop: 6, marginBottom: 20 }}>Click the heart icon on any gear item to save it for later.</p>
                <button onClick={() => onViewChange('search')} className="btn btn-primary">Browse Gear</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                {wishlist.map(p => (
                  <ProductCard key={p.id} product={p} onSelectProduct={onSelectProduct} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ padding: 32, maxWidth: 600 }}>
            <h3 style={{ fontSize: 20, marginBottom: 16 }}>Campus Verification Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <span className="label">Registered Email</span>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{user.email}</p>
              </div>
              <div>
                <span className="label">Campus</span>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{user.college}</p>
              </div>
              <div>
                <span className="label">Hostel & Room</span>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{user.hostel}</p>
              </div>
              <div>
                <span className="label">Verified Phone</span>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{user.phone || '+91 98765 43210'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* OTP Verification Modal */}
      {otpBookingId && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15,17,23,0.5)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 400, padding: 28, background: 'var(--surface)' }}>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Verify Handover OTP</h3>
            <p className="body-sm" style={{ marginBottom: 20 }}>
              Enter the 4-digit code provided by the other student at pickup/return.
            </p>
            <input
              type="text"
              maxLength={4}
              value={otpInput}
              onChange={e => setOtpInput(e.target.value)}
              placeholder="e.g. 8492"
              className="input"
              style={{ textAlign: 'center', fontSize: 24, letterSpacing: '0.3em', fontFamily: "'Fraunces', serif", marginBottom: 20 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setOtpBookingId(null)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={handleVerifyOtp} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Verify OTP</button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {activeChatRecipient && (
        <ChatModal
          user={user}
          recipient={activeChatRecipient}
          onClose={() => setActiveChatRecipient(null)}
        />
      )}
    </div>
  );
}
