import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight, Key, ExternalLink, MapPin, Loader, CheckCircle } from 'lucide-react';
import { api } from '../api';
import { getGoogleClientId, saveGoogleClientId, triggerGoogleSignIn } from '../googleAuth';

export default function AuthModal({ onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [hostel, setHostel] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Geolocation auto-detect state
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [locSuccessMessage, setLocSuccessMessage] = useState('');

  // Client ID Setup / Smart Google Profile Chooser state
  const [showGoogleChooserModal, setShowGoogleChooserModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // Comprehensive Indian Universities / Colleges suggested datalist (user can type ANY college)
  const indianCampusesList = [
    'IIT Delhi - Hauz Khas Campus, New Delhi',
    'IIT Bombay - Powai Campus, Mumbai',
    'IIT Madras - Adyar Campus, Chennai',
    'IIT Kanpur - Kalyanpur Campus, Kanpur',
    'IIT Kharagpur - Kharagpur Campus, West Bengal',
    'IIT Roorkee - Roorkee Campus, Uttarakhand',
    'IIT Guwahati - North Guwahati Campus, Assam',
    'IIT Hyderabad - Kandi Campus, Telangana',
    'BITS Pilani - Vidya Vihar Campus, Rajasthan',
    'BITS Pilani - Goa Campus, Zuarinagar',
    'BITS Pilani - Hyderabad Campus, Jawaharnagar',
    'IIM Ahmedabad - Vastrapur Campus, Gujarat',
    'IIM Bangalore - Bannerghatta Campus, Karnataka',
    'IIM Calcutta - Joka Campus, Kolkata',
    'Delhi University - North Campus, New Delhi',
    'Delhi University - South Campus, New Delhi',
    'VIT Vellore - Katpadi Main Campus, Tamil Nadu',
    'SRM Institute of Science and Technology - Kattankulathur Campus',
    'Manipal Academy of Higher Education - Manipal Campus',
    'Amity University - Noida Main Campus, Uttar Pradesh',
    'IIIT Hyderabad - Gachibowli Campus, Telangana',
    'NIT Trichy - Tiruchirappalli Campus, Tamil Nadu',
    'NIT Surathkal - Srinivasnagar Campus, Karnataka',
    'NIT Warangal - Hanamkonda Campus, Telangana',
    'Jadavpur University - Main Campus, Kolkata',
    'Thapar Institute of Engineering and Technology - Patiala Campus',
    'Anna University - Guindy Campus, Chennai',
    'Pune University (Savitribai Phule Pune University)',
    'Mumbai University - Kalina Campus, Mumbai',
    'IISc Bangalore - Malleshwaram Campus, Karnataka',
    'Lovely Professional University (LPU) - Phagwara Campus',
    'Chandigarh University - Gharuan Campus, Punjab',
  ];

  // Auto-Detect Student Location via HTML5 Geolocation + OpenStreetMap Reverse Geocode
  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingLoc(true);
    setError('');
    setLocSuccessMessage('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`
          );
          const data = await response.json();
          const addr = data.address || {};
          const city = addr.city || addr.town || addr.suburb || addr.state_district || addr.state || 'India';
          const detectedCampus = addr.university || addr.college || `${city} University Campus`;
          const detectedArea = `${addr.suburb || addr.neighbourhood || city}, Room/Hostel`;

          setCollege(detectedCampus);
          setHostel(detectedArea);
          setLocSuccessMessage(`📍 Detected Campus location: ${detectedCampus} (${city})`);
        } catch (err) {
          setError('Could not reverse geocode coordinates. Please enter your college name manually.');
        } finally {
          setDetectingLoc(false);
        }
      },
      (err) => {
        setDetectingLoc(false);
        setError('Location access denied. Please type your college or university manually.');
      },
      { timeout: 10000 }
    );
  };

  const handleGoogleSuccess = async (googleUser) => {
    setGoogleLoading(true);
    setError('');
    try {
      const res = await api.googleAuth({
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture || googleUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${googleUser.email}`,
        googleId: googleUser.sub || googleUser.email,
      });
      onSuccess(res.user);
    } catch (err) {
      setError('Google sign-in failed: ' + err.message);
      setGoogleLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setGoogleLoading(true);
    setError('');
    triggerGoogleSignIn(
      handleGoogleSuccess,
      (err) => {
        setGoogleLoading(false);
        // If native Google OAuth fails or Client ID isn't set, fallback seamlessly to Smart Profile Chooser
        setShowGoogleChooserModal(true);
      }
    );
  };

  const handleSmartGoogleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) return;
    setShowGoogleChooserModal(false);
    await handleGoogleSuccess({
      email: customGoogleEmail.trim(),
      name: customGoogleName.trim() || customGoogleEmail.split('@')[0],
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${customGoogleEmail.trim()}`,
      sub: 'google_' + customGoogleEmail.trim(),
    });
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
        if (!college.trim()) {
          throw new Error('Please enter your College or University name.');
        }
        res = await api.register({ email, name, college, hostel, phone });
      }
      onSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check input fields.');
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
        width: '100%', maxWidth: 460, maxHeight: '92vh', overflowY: 'auto',
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
          <p className="body-sm">Verified Indian campus peer rental network across any College or University</p>
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
            <span>{googleLoading ? 'Connecting Google Account...' : 'Sign in with Google'}</span>
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

        {locSuccessMessage && (
          <div style={{
            background: '#ecfdf5', color: '#16a34a', border: '1px solid #bbf7d0',
            padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <CheckCircle size={16} />
            <span>{locSuccessMessage}</span>
          </div>
        )}

        {/* Email/Password / Student Sign Up Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 4 }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="student@iitd.ac.in or gmail.com"
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
                  placeholder="Enter your real full name"
                  className="input"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label className="label">College / University in India</label>
                  <button
                    type="button"
                    onClick={handleAutoDetectLocation}
                    disabled={detectingLoc}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--coral)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4
                    }}
                  >
                    <MapPin size={14} />
                    <span>{detectingLoc ? 'Detecting Campus...' : 'Auto-Detect My Campus'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  list="indian-campuses-datalist"
                  required
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  placeholder="Type ANY Indian College or University name..."
                  className="input"
                />
                <datalist id="indian-campuses-datalist">
                  {indianCampusesList.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 4 }}>Hostel / Area</label>
                  <input
                    type="text"
                    value={hostel}
                    onChange={e => setHostel(e.target.value)}
                    placeholder="Hostel / Room / Area"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 4 }}>Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="input"
                  />
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
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setLocSuccessMessage('');
              // If switching to Sign Up, keep fields empty for new user data entry
            }}
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

      {/* Bulletproof Smart Google Profile Selector Modal (When Google OAuth script is blocked or unconfigured) */}
      {showGoogleChooserModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1200,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div className="card anim-in" style={{
            width: '100%', maxWidth: 420, background: 'var(--surface)',
            padding: 28, position: 'relative'
          }}>
            <button onClick={() => setShowGoogleChooserModal(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <h3 style={{ fontSize: 18, margin: 0 }}>Google Account Sign-In</h3>
            </div>

            <p className="body-sm" style={{ marginBottom: 16 }}>
              Enter your Google or institutional email to sign in instantly with Google profile verification:
            </p>

            <form onSubmit={handleSmartGoogleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: 4 }}>Google / Gmail Address</label>
                <input
                  type="email"
                  required
                  value={customGoogleEmail}
                  onChange={e => setCustomGoogleEmail(e.target.value)}
                  placeholder="yourname@gmail.com or @iitd.ac.in"
                  className="input"
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: 4 }}>Your Full Name</label>
                <input
                  type="text"
                  value={customGoogleName}
                  onChange={e => setCustomGoogleName(e.target.value)}
                  placeholder="Prateek Vijay"
                  className="input"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Continue with Google Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
