import React, { useState } from 'react';
import { ShieldCheck, LogOut, Plus, Menu, X } from 'lucide-react';

export default function Navbar({ currentView, onViewChange, user, onOpenAuthModal, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Explore' },
    { id: 'search', label: 'Search Gear' },
    { id: 'requests', label: 'Demand Hub' },
    { id: 'map', label: 'Live Map' },
    { id: 'ai', label: 'AI Safety Center' },
  ];

  const go = (id) => {
    onViewChange(id);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('rt_user');
    localStorage.removeItem('rt_token');
    onLogout?.();
    go('home');
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 68,
        }}>
          {/* Logo */}
          <div
            onClick={() => go('home')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'var(--coral)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', boxShadow: '0 2px 8px rgba(235,94,40,0.25)',
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <span style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--ink)',
                display: 'block',
                lineHeight: 1.1,
              }}>
                RentMyThing
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Campus India
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => go(id)}
                style={{
                  background: currentView === id ? 'var(--surface-2)' : 'transparent',
                  color: currentView === id ? 'var(--coral)' : 'var(--ink-soft)',
                  border: 'none',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: currentView === id ? 600 : 500,
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.2s',
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
                    padding: '6px 14px 6px 6px',
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

                {/* Explicit Desktop Log Out Button */}
                <button
                  onClick={handleLogout}
                  title="Sign out of account"
                  className="btn btn-secondary btn-sm hidden-mobile"
                  style={{ padding: '7px 12px', color: '#dc2626', borderColor: '#fca5a5' }}
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
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
          position: 'fixed',
          top: 68,
          left: 0, right: 0,
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 20px 24px',
          zIndex: 890,
          boxShadow: 'var(--shadow-md)',
        }} className="anim-in">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => go(id)}
                style={{
                  background: currentView === id ? 'var(--surface-2)' : 'transparent',
                  color: currentView === id ? 'var(--coral)' : 'var(--ink)',
                  border: 'none',
                  padding: '12px 14px',
                  textAlign: 'left',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: currentView === id ? 600 : 500,
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </nav>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => go('list')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Plus size={15} />
              List Gear
            </button>
            {user ? (
              <>
                <button
                  onClick={() => go('dashboard')}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Dashboard ({user.name})
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', color: '#dc2626', borderColor: '#fca5a5' }}
                >
                  <LogOut size={15} />
                  Log Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMobileOpen(false); onOpenAuthModal(); }}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
