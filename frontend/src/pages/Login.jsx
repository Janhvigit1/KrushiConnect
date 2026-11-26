import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, Globe, Lock, Mail, CheckCircle2, ShieldCheck, Heart, MessageCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { t, i18n } = useTranslation();
  const { login, changeLanguage } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('auth.fillAllFields'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    const next = i18n.language === 'hi' ? 'en' : 'hi';
    changeLanguage(next);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 10% 20%, #E8F5E9 0%, #F8FAF8 90%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative'
      }}
    >
      {/* Top Floating Language Toggle */}
      <div style={{ position: 'absolute', top: '24px', right: '28px', zIndex: 10 }}>
        <button
          onClick={toggleLanguage}
          className="lang-toggle-btn"
          style={{
            boxShadow: '0 4px 12px rgba(15, 81, 50, 0.08)',
            padding: '0.5rem 1rem'
          }}
        >
          <Globe size={16} color="#059669" />
          <span>{i18n.language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}</span>
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3.5rem',
          maxWidth: '960px',
          width: '100%'
        }}
      >
        {/* Left Visual Hero Mockup (Desktop Instagram Showcase) */}
        <div
          className="login-hero-showcase"
          style={{
            flex: '1 1 420px',
            maxWidth: '430px',
            display: window.innerWidth <= 840 ? 'none' : 'block',
            position: 'relative'
          }}
        >
          {/* Mockup Instagram Phone Frame */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '36px',
              border: '10px solid #1E293B',
              boxShadow: '0 25px 60px -15px rgba(15, 81, 50, 0.25)',
              overflow: 'hidden',
              position: 'relative',
              height: '560px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Top Phone Speaker Bar */}
            <div
              style={{
                height: '24px',
                background: '#1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ width: '45px', height: '4px', background: '#475569', borderRadius: '4px' }} />
            </div>

            {/* App Header inside Mockup */}
            <div
              style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sprout size={20} color="#059669" />
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0F5132' }}>KrushiConnect</span>
              </div>
              <span style={{ fontSize: '0.7rem', background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                Live Feed
              </span>
            </div>

            {/* Stories Tray in Mockup */}
            <div style={{ display: 'flex', gap: '8px', padding: '0.65rem 0.85rem', overflow: 'hidden', borderBottom: '1px solid #F1F5F9' }}>
              {[
                { name: 'Ramesh', img: '🌾', ring: true },
                { name: 'Suresh', img: '🌱', ring: true },
                { name: 'Kavita', img: '🌻', ring: true },
                { name: 'Anil', img: '🌽', ring: false }
              ].map((s, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      padding: '2px',
                      background: s.ring ? 'linear-gradient(45deg, #F59E0B, #10B981, #047857)' : '#CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#F8FAF8', border: '2px solid #FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                      {s.img}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#475569' }}>{s.name}</span>
                </div>
              ))}
            </div>

            {/* Sample Post in Mockup */}
            <div style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#15803D', fontSize: '0.85rem' }}>
                  RP
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>Ramesh Patel</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748B' }}>Nashik, Maharashtra • Wheat Crop</div>
                </div>
              </div>

              <div
                style={{
                  height: '180px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexDirection: 'column',
                  gap: '6px',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
                }}
              >
                <span style={{ fontSize: '2.5rem' }}>🌾</span>
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Bumper Wheat Harvest</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>#OrganicFarming #KisanCommunity</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', color: '#334155' }}>
                <Heart size={18} fill="#E11D48" color="#E11D48" />
                <MessageCircle size={18} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, marginLeft: 'auto', color: '#059669' }}>
                  244 Likes
                </span>
              </div>

              {/* Realistic Floating Badge */}
              <div
                style={{
                  marginTop: 'auto',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                <ShieldCheck size={18} color="#059669" />
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#334155' }}>
                  10,000+ Verified Next-Gen Indian Farmers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Instagram-Style Login Card */}
        <div style={{ flex: '1 1 380px', maxWidth: '400px', width: '100%' }}>
          <div
            className="card"
            style={{
              padding: '2.25rem 2rem',
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 12px 36px -4px rgba(15, 81, 50, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
              backgroundColor: '#FFFFFF',
              position: 'relative'
            }}
          >
            {/* Header Branding */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #059669 0%, #0F5132 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem auto',
                  boxShadow: '0 8px 20px rgba(5, 150, 105, 0.28)'
                }}
              >
                <Sprout size={32} />
              </div>
              <h1
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  background: 'linear-gradient(135deg, #0F5132 0%, #059669 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.2rem'
                }}
              >
                {t('appName')}
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
                {t('auth.loginSubtitle')}
              </p>
            </div>

            {error && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#FFF1F2',
                  color: '#BE123C',
                  border: '1px solid #FECDD3',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '1.25rem'
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t('auth.email')}</label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={18}
                    color="#94A3B8"
                    style={{ position: 'absolute', left: '14px', top: '13px' }}
                  />
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '42px' }}
                    placeholder={t('auth.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">{t('auth.password')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={18}
                    color="#94A3B8"
                    style={{ position: 'absolute', left: '14px', top: '13px' }}
                  />
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '42px' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}
                disabled={loading}
              >
                {loading ? t('auth.loggingIn') : t('auth.login')}
              </button>
            </form>
          </div>

          {/* Bottom Card for Register Switch */}
          <div
            className="card"
            style={{
              padding: '1.25rem',
              textAlign: 'center',
              borderRadius: '18px',
              fontSize: '0.9rem',
              color: '#475569',
              border: '1px solid #E2E8F0'
            }}
          >
            {t('auth.noAccount')}{' '}
            <Link
              to="/register"
              style={{ color: '#059669', fontWeight: 800, textDecoration: 'none' }}
            >
              {t('auth.registerNow')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
