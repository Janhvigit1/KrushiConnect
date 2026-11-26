import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, Globe, Navigation, CheckCircle2, Lock, Mail, User, MapPin } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { t, i18n } = useTranslation();
  const { register, changeLanguage } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    village: '',
    district: '',
    state: '',
    crops: '',
    preferredLanguage: i18n.language || 'en',
    latitude: undefined,
    longitude: undefined
  });

  const [geoCaptured, setGeoCaptured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCaptureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }));
          setGeoCaptured(true);
        },
        (err) => {
          alert('Could not retrieve location. Standard regional lookup will be used.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.village ||
      !formData.district ||
      !formData.state
    ) {
      setError(t('auth.fillAllFields'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    const next = i18n.language === 'hi' ? 'en' : 'hi';
    changeLanguage(next);
    setFormData((prev) => ({ ...prev, preferredLanguage: next }));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 85% 15%, #E8F5E9 0%, #F8FAF8 90%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
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

      <div style={{ maxWidth: '520px', width: '100%' }}>
        <div
          className="card"
          style={{
            padding: '2.5rem 2.25rem',
            borderRadius: '28px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 16px 40px -6px rgba(15, 81, 50, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
            backgroundColor: '#FFFFFF'
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
              {t('auth.register')}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
              {t('auth.registerSubtitle')}
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
              <label className="form-label">{t('auth.fullName')} *</label>
              <div style={{ position: 'relative' }}>
                <User
                  size={18}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '14px', top: '13px' }}
                />
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder={t('auth.fullNamePlaceholder')}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('auth.email')} *</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '14px', top: '13px' }}
                />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder={t('auth.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">{t('auth.password')} *</label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={18}
                    color="#94A3B8"
                    style={{ position: 'absolute', left: '14px', top: '13px' }}
                  />
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    style={{ paddingLeft: '42px' }}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('auth.confirmPassword')} *</label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={18}
                    color="#94A3B8"
                    style={{ position: 'absolute', left: '14px', top: '13px' }}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    style={{ paddingLeft: '42px' }}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">{t('auth.village')} *</label>
                <input
                  type="text"
                  name="village"
                  className="form-input"
                  placeholder={t('auth.villagePlaceholder')}
                  value={formData.village}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('auth.district')} *</label>
                <input
                  type="text"
                  name="district"
                  className="form-input"
                  placeholder={t('auth.districtPlaceholder')}
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('auth.state')} *</label>
                <input
                  type="text"
                  name="state"
                  className="form-input"
                  placeholder={t('auth.statePlaceholder')}
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('auth.cropsGrown')}</label>
              <input
                type="text"
                name="crops"
                className="form-input"
                placeholder={t('auth.cropsPlaceholder')}
                value={formData.crops}
                onChange={handleChange}
              />
            </div>

            {/* Geolocation Tag */}
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={handleCaptureLocation}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '12px',
                  border: geoCaptured ? '1.5px solid #10B981' : '1.5px dashed #A7F3D0',
                  backgroundColor: geoCaptured ? '#ECFDF5' : '#F8FAF8',
                  color: geoCaptured ? '#065F46' : '#059669',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.15s ease'
                }}
              >
                {geoCaptured ? (
                  <>
                    <CheckCircle2 size={18} color="#059669" />
                    <span>Farm Coordinates Attached (Nashik Region)</span>
                  </>
                ) : (
                  <>
                    <Navigation size={18} color="#059669" />
                    <span>Auto-Attach Farm Location via GPS</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}
              disabled={loading}
            >
              {loading ? t('auth.registering') : t('auth.register')}
            </button>
          </form>
        </div>

        {/* Bottom Card for Login Link */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            textAlign: 'center',
            borderRadius: '18px',
            fontSize: '0.9rem',
            color: '#475569',
            border: '1px solid #E2E8F0',
            marginTop: '1rem'
          }}
        >
          {t('auth.haveAccount')}{' '}
          <Link
            to="/login"
            style={{ color: '#059669', fontWeight: 800, textDecoration: 'none' }}
          >
            {t('auth.loginNow')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
