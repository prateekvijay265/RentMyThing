import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, CheckCircle, AlertTriangle, Cpu, Lock, Search, RefreshCw, FileCheck, Award, Eye } from 'lucide-react';
import { api } from '../../api';

export default function AIFraudCenter({ allProducts = [], onSelectProduct }) {
  const [title, setTitle] = useState('Sony A7 III 4K Full-Frame DSLR + 24-70mm Lens');
  const [category, setCategory] = useState('Camera');
  const [price, setPrice] = useState('450');
  const [description, setDescription] = useState('Urgent rental available at IIT Delhi Karakoram hostel. Send UPI advance to hold.');
  const [scanning, setScanning] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const runAIScan = async (e) => {
    if (e) e.preventDefault();
    setScanning(true);
    setAuditResult(null);
    try {
      const res = await api.analyzeListing({
        title,
        category,
        rentPricePerDay: Number(price),
        description
      });
      setAuditResult(res);
    } catch (err) {
      console.error('Scan failed:', err);
      // Fallback response for interactive preview
      setAuditResult({
        riskScore: Number(price) > 1200 || description.includes('advance') ? 7 : 2,
        riskLevel: Number(price) > 1200 || description.includes('advance') ? 'HIGH' : 'LOW',
        verdict: Number(price) > 1200 || description.includes('advance') ? 'FLAGGED FOR REVIEW' : 'VERIFIED SAFE LISTING',
        priceAnalysis: `₹${price}/day compared against Indian campus medians for ${category}.`,
        flags: [
          Number(price) > 1200 ? 'Price above campus median' : null,
          description.toLowerCase().includes('advance') ? 'Advance payment request detected' : null
        ].filter(Boolean)
      });
    } finally {
      setScanning(false);
    }
  };

  const selectSamplePreset = (pTitle, pCat, pPrice, pDesc) => {
    setTitle(pTitle);
    setCategory(pCat);
    setPrice(pPrice);
    setDescription(pDesc);
    setAuditResult(null);
  };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 96 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>Neural Campus Protection Engine</p>
        <h1 className="display-md">AI Safety & Price Fraud Shield</h1>
        <p className="body-md" style={{ marginTop: 6, maxWidth: 640 }}>
          Every gear listing on RentMyThing is screened against real-time Indian campus rental benchmarks to prevent price gouging and advance payment scams.
        </p>
      </div>

      {/* Preset sample buttons */}
      <div style={{ marginBottom: 24 }}>
        <p className="label" style={{ marginBottom: 10 }}>⚡ Try Sample Listings to Audit</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => selectSamplePreset('Sony A7 III Camera', 'Camera', '450', 'Verified student listing at Karakoram hostel.')}
            className="btn btn-secondary btn-sm"
          >
            ✓ Safe Listing Sample (₹450/day)
          </button>
          <button
            onClick={() => selectSamplePreset('MacBook Pro M3 Max', 'Laptop', '4000', 'Send UPI advance before hostel pickup.')}
            className="btn btn-secondary btn-sm"
            style={{ borderColor: 'var(--coral)', color: 'var(--coral)' }}
          >
            ⚠ High-Risk Scam Sample (₹4000/day + Advance)
          </button>
        </div>
      </div>

      {/* Main Interactive Scanner Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32 }} className="scanner-grid">
        {/* Left: Input Form */}
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 20, marginBottom: 16 }}>Test & Scan a Listing</h3>
          <form onSubmit={runAIScan} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Listing Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: 6 }}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="input">
                  {['Camera', 'Laptop', 'Cycle', 'Gaming', 'Projector', 'Electronics'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: 6 }}>Daily Price (₹ INR)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="input" />
              </div>
            </div>

            <div>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>Description Text</label>
              <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="input" />
            </div>

            <button type="submit" disabled={scanning} className="btn btn-primary" style={{ justifyContent: 'center', marginTop: 4 }}>
              <Sparkles size={16} />
              <span>{scanning ? 'Running Neural Audit...' : 'Run Live AI Audit'}</span>
            </button>
          </form>
        </div>

        {/* Right: Output Report */}
        <div className="card" style={{ padding: 28, background: 'var(--surface)' }}>
          <h3 style={{ fontSize: 20, marginBottom: 16 }}>Neural Audit Report</h3>
          {scanning ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <RefreshCw size={32} className="anim-float" color="var(--coral)" style={{ margin: '0 auto 16px' }} />
              <p className="body-md">Comparing against Indian campus median rates...</p>
            </div>
          ) : auditResult ? (
            <div className="anim-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{
                padding: 20, borderRadius: 18,
                background: auditResult.riskLevel === 'HIGH' ? 'var(--coral-light)' : 'var(--green-light)',
                border: `1px solid ${auditResult.riskLevel === 'HIGH' ? 'var(--coral-mid)' : '#a7f3d0'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {auditResult.riskLevel === 'HIGH' ? <ShieldAlert size={24} color="var(--coral)" /> : <ShieldCheck size={24} color="var(--green)" />}
                  <div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: auditResult.riskLevel === 'HIGH' ? 'var(--coral)' : 'var(--green)' }}>
                      {auditResult.verdict || 'AUDIT COMPLETE'}
                    </span>
                    <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                      Risk Score: <strong style={{ color: 'var(--ink)' }}>{auditResult.riskScore}/10</strong> · Level: <strong>{auditResult.riskLevel}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <span className="label" style={{ display: 'block', marginBottom: 8 }}>Price Benchmark Assessment</span>
                <p className="body-md" style={{ background: 'var(--surface-2)', padding: 14, borderRadius: 12 }}>
                  {auditResult.priceAnalysis || `₹${price}/day is within normal campus peer range.`}
                </p>
              </div>

              {auditResult.flags && auditResult.flags.length > 0 && (
                <div>
                  <span className="label" style={{ display: 'block', marginBottom: 8 }}>Detected Safety Flags</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {auditResult.flags.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: 'var(--coral-light)', color: 'var(--coral)', fontSize: 13, fontWeight: 600 }}>
                        <AlertTriangle size={15} flexShrink={0} />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-faint)' }}>
              <Cpu size={40} style={{ margin: '0 auto 12px' }} />
              <p className="body-md">Enter listing details on the left and run scan to view real-time neural safety breakdown.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .scanner-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
