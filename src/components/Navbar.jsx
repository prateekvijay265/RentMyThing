import React, { useState, useEffect } from 'react';
import { Search, MapPin, Plus, LogOut, Menu, X, LayoutDashboard, Cpu, List, Compass, ClipboardList, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

const LINKS = [
  { id: 'home',     label: 'Home' },
  { id: 'search',   label: 'Browse Gear' },
  { id: 'map',      label: 'Campus Map' },
  { id: 'aifraud',  label: 'AI Safety' },
  { id: 'requests', label: 'Request Hub' },
];

export default function Navbar({ activeView, onViewChange, user, onOpenAuthModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const go = (id) => { onViewChange(id); setMobileOpen(false); };
  const handleLogout = () => { localStorage.removeItem('rt_token'); window.location.reload(); };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'all 0.25s ease',
      }}>
        <div className="container" style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>

          {/* Logo */}
          <div onClick={() => go('home')}>
            <Logo size="md" showTagline={false} />
          </div>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }} className="hidden-mobile">
            {LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`nav-link ${activeView === id ? 'active' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 14px',
                  fontSize: 13,
                  fontWeight: activeView === id ? 700 : 500,
                  color: activeView === id ? 'var(--coral)' : 'var(--ink-soft)',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '-0.01em',
                  transition: 'color 0.2s',
                  borderRadius: 8,
                }}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <button onClick={() => go('list')} className="btn btn-primary btn-sm hidden-mobile">
              <Plus size={14} />
              List Gear
            </button>

            {user ? (
              <>
                <button
                  onClick={() => go('dashboard')}
                  title="Dashboard"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px 6px 6px',
                    borderRadius: 100,
                    border: '1.5px solid var(--border)',
                    background: 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--coral)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  className="hidden-mobile"
                >
                  <div style={{
                    height: 28, width: 28, borderRadius: '50%',
                    background: 'var(--coral)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, fontFamily: "'Inter', sans-serif",
                    flexShrink: 0,
                  }}>
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', fontFamily: "'Inter', sans-serif" }}>
                    {user.name?.split(' ')[0]}
                  </span>
                </button>
                <button onClick={handleLogout} title="Sign out" className="btn btn-ghost btn-sm hidden-mobile" style={{ padding: '8px 10px' }}>
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <button onClick={onOpenAuthModal} className="btn btn-secondary btn-sm hidden-mobile">
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: 10,
                border: '1.5px solid var(--border)',
                background: 'var(--surface)',
                cursor: 'pointer',
              }}
              className="mobile-menu-btn"
            >
              {mobileOpen ? <X size={18} color="var(--ink)" /> : <Menu size={18} color="var(--ink)" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0, zIndex: 99,
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          padding: '16px 24px 24px',
          animation: 'slideDown 0.25s ease both',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {LINKS.map(({ id, label }) => (
              <button key={id} onClick={() => go(id)} style={{
                display: 'flex', alignItems: 'center',
                padding: '12px 16px', borderRadius: 12, border: 'none',
                background: activeView === id ? 'var(--coral-light)' : 'transparent',
                color: activeView === id ? 'var(--coral)' : 'var(--ink-soft)',
                fontSize: 14, fontWeight: activeView === id ? 700 : 500,
                cursor: 'pointer', textAlign: 'left',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.15s ease',
              }}>
                {label}
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0 8px' }} />
            <button onClick={() => { go('list'); }} className="btn btn-primary" style={{ justifyContent: 'center' }}>
              <Plus size={15} /> + List Gear (₹)
            </button>
            {!user && (
              <button onClick={() => { onOpenAuthModal(); setMobileOpen(false); }} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1023px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
