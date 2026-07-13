import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight, Key, ExternalLink } from 'lucide-react';
import { api } from '../api';
import { getGoogleClientId, saveGoogleClientId, triggerGoogleSignIn } from '../googleAuth';

export default function AuthModal({ onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('IIT Delhi - Hauz Khas Campus');
  const [hostel, setHostel] = useState('Karakoram Hostel, Room 214');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Client ID Setup Modal state
  const [showClientIdConfig, setShowClientIdConfig] = useState(false);
  const [clientIdInput, setClientIdInput] = useState(getGoogleClientId());

  const indianCampuses = [
    'IIT Delhi - Hauz Khas Campus',
    'IIT Bombay - Powai Campus',
    'BITS Pilani - Vidya Vihar Campus',
    'IIT Madras - Adyar Campus',
    'IIM Bangalore - Bannerghatta Campus',
    'IIT Kharagpur - Kharagpur Campus',
    'Delhi University - North Campus',
    'VIT Vellore Main Campus',
  ];

  const handleGoogleSuccess = async (googleUser) => {
    setGoogleLoading(true);
    setError('');
    try {
      const res = await api.googleAuth({
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture || googleUser.avatar,
        googleId: googleUser.sub || googleUser.email,
      });
      onSuccess(res.user);
    } catch (err) {
      setError('Google sign-in failed: ' + err.message);
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (err) => {
    setGoogleLoading(false);
    if (err.message === 'MISSING_CLIENT_ID') {
      setShowClientIdConfig(true);
    } else {
      setError(err.message || 'Google sign-in failed');
    }
  };

  const handleGoogleClick = () => {
    setGoogleLoading(true);
    setError('');
    const currentId = getGoogleClientId();
    if (!currentId) {
      setGoogleLoading(false);
      setShowClientIdConfig(true);
      return;
    }
    triggerGoogleSignIn(handleGoogleSuccess, handleGoogleError);
  };

  const handleSaveClientId = (e) => {
    e.preventDefault();
    if (!clientIdInput.trim()) return;
    saveGoogleClientId(clientIdInput.trim());
    setShowClientIdConfig(false);
    // Immediately launch real Google Sign In
    triggerGoogleSignIn(handleGoogleSuccess, handleGoogleError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let res;
      if (isLogin) {
        res = await api.login(email);
      } else {
        res = await api.register({ email, name, college, hostel, phone });
      }
      onSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleFastLogin = async (testEmail) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.login(testEmail);
      onSuccess(res.user);
    } catch (err) {
      setError('Login failed. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(15,17,23,0.5)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} className="anim-in">
      <div className="card" style={{
        width: '100%', maxWidth: 440, maxHeight: '92vh', overflowY: 'auto',
        padding: 32, position: 'relative', background: 'var(--surface)',
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'var(--coral-light)', color: 'var(--coral)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', border: '1px solid var(--coral-mid)',
          }}>
            <ShieldCheck size={24} />
          </div>
          <h2 style={{ fontSize: 24, marginBottom: 6 }}>{isLogin ? 'Sign In to Campus' : 'Create Student Account'}</h2>
          <p className="body-sm">Verified Indian campus peer rental network across IIT, BITS & IIM</p>
        </div>

        {/* Google Sign-In Button */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={handleGoogleClick}
            disabled={googleLoading}
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{googleLoading ? 'Signing in...' : 'Sign in with Google'}</span>
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span className="label" style={{ fontSize: 10 }}>or institutional email</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {error && (
          <div className="badge badge-coral" style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 12 }}>
            {error}
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 4 }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="student@iitd.ac.in"
              className="input"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Aravind Sharma"
                  className="input"
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: 4 }}>Campus / Institute</label>
                <select value={college} onChange={e => setCollege(e.target.value)} className="input" style={{ cursor: 'pointer' }}>
                  {indianCampuses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 4 }}>Hostel & Room</label>
                  <input type="text" value={hostel} onChange={e => setHostel(e.target.value)} placeholder="Karakoram, Rm 214" className="input" />
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 4 }}>Phone (India)</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="input" />
                </div>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
            <span>{loading ? 'Verifying...' : isLogin ? 'Sign In to Marketplace' : 'Create Verified Student Account'}</span>
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--coral)' }}
          >
            {isLogin ? 'New to RentMyThing? Create campus account →' : 'Already registered? Sign in →'}
          </button>
        </div>

        {/* Quick test profiles */}
        <div className="card-flat" style={{ padding: 16, marginTop: 20 }}>
          <p className="label" style={{ marginBottom: 10 }}>⚡ Quick Test Profiles</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { email: 'aravind.sharma@iitd.ac.in', name: 'Aravind (IITD Host)' },
              { email: 'priya.nair@iitb.ac.in', name: 'Priya (IITB Borrower)' },
              { email: 'rohan.verma@pilani.bits-pilani.ac.in', name: 'Rohan (BITS Pilani)' },
              { email: 'admin@rentmything.in', name: 'Admin Control' },
            ].map(({ email: e, name: n }) => (
              <button
                key={e}
                type="button"
                onClick={() => handleFastLogin(e)}
                style={{
                  padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border)',
                  background: 'var(--surface)', textAlign: 'left', cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', display: 'block' }}>{n}</span>
                <span style={{ fontSize: 10, color: 'var(--ink-muted)' }}>{e.split('@')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real Google OAuth Client ID Configuration Modal */}
      {showClientIdConfig && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1200,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div className="card anim-in" style={{
            width: '100%', maxWidth: 440, background: 'var(--surface)',
            padding: 28, position: 'relative'
          }}>
            <button onClick={() => setShowClientIdConfig(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Key size={20} color="var(--coral)" />
              <h3 style={{ fontSize: 18, margin: 0 }}>Connect Real Google Accounts</h3>
            </div>

            <p className="body-sm" style={{ marginBottom: 16 }}>
              To display your **real Chrome Google accounts** in Google's official Sign-In popup, enter your Google OAuth Client ID for your domain/localhost.
            </p>

            <form onSubmit={handleSaveClientId} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: 4 }}>Google OAuth Client ID</label>
                <input
                  type="text"
                  value={clientIdInput}
                  onChange={e => setClientIdInput(e.target.value)}
                  placeholder="xxxxxxx.apps.googleusercontent.com"
                  className="input"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Save & Open Chrome Google Accounts
              </button>
            </form>

            <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: 'var(--surface-2)', fontSize: 12 }}>
              <p style={{ margin: '0 0 6px', fontWeight: 600 }}>Need a Client ID? (Takes 30s):</p>
              <ol style={{ margin: 0, paddingLeft: 18, color: 'var(--ink-soft)' }}>
                <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" style={{ color: 'var(--coral)', textDecoration: 'underline' }}>Google Cloud Console → Credentials</a></li>
                <li>Create OAuth 2.0 Client ID (Web application)</li>
                <li>Add Authorized JavaScript origin: <code>{window.location?.origin || 'http://localhost:5173'}</code></li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
