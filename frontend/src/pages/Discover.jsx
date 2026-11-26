import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Navigation, Filter, Sprout, AtSign, Users, MapPin, X } from 'lucide-react';
import FarmerCard from '../components/discover/FarmerCard';
import { discoverFarmers, discoverNearby } from '../services/discoverService';

const Discover = () => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'username', 'crop', 'nearby'
  const [usernameQuery, setUsernameQuery] = useState('');
  const [crop, setCrop] = useState('');
  const [radius, setRadius] = useState(25);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nearbyActive, setNearbyActive] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  // Primary search function
  const handleSearch = async (tab = activeTab, isNearby = false) => {
    try {
      setLoading(true);
      setLocationStatus('');

      if (tab === 'nearby' || isNearby) {
        if (!navigator.geolocation) {
          alert('Geolocation is not supported by your browser');
          return;
        }

        setLocationStatus('Detecting farm GPS coordinates...');
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            const data = await discoverNearby(latitude, longitude, radius);
            setFarmers(data.farmers || []);
            setNearbyActive(true);
            setLoading(false);
            setLocationStatus('');
          },
          async (err) => {
            console.warn('Geolocation fallback:', err.message);
            setLocationStatus('GPS unavailable. Showing regional farmers.');
            const data = await discoverNearby(undefined, undefined, radius);
            setFarmers(data.farmers || []);
            setNearbyActive(true);
            setLoading(false);
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        setNearbyActive(false);
        const data = await discoverFarmers(usernameQuery, crop);
        setFarmers(data.farmers || []);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error discovering farmers:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('all', false);
  }, []);

  const popularCrops = [
    'Wheat',
    'Cotton',
    'Rice',
    'Soybean',
    'Sugarcane',
    'Maize',
    'Onion',
    'Tomato'
  ];

  return (
    <div>
      {/* Instagram-style Explore Header & Search Bar */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          borderRadius: '24px',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Search size={22} color="var(--primary-emerald)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
            {t('discover.title')}
          </h2>
        </div>

        {/* Instagram Search by Username / Name Input */}
        <div style={{ position: 'relative', marginBottom: '1.15rem' }}>
          <AtSign
            size={18}
            color="var(--primary-emerald)"
            style={{ position: 'absolute', left: '14px', top: '14px' }}
          />
          <input
            type="text"
            className="form-input"
            style={{
              paddingLeft: '44px',
              paddingRight: usernameQuery ? '40px' : '16px',
              borderRadius: '9999px',
              fontSize: '0.95rem',
              backgroundColor: 'var(--bg-surface-subtle)'
            }}
            placeholder="Search by username or farmer name (e.g. @ramesh_patel, Suresh)..."
            value={usernameQuery}
            onChange={(e) => {
              setUsernameQuery(e.target.value);
              discoverFarmers(e.target.value, crop).then((res) => setFarmers(res.farmers || []));
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch('username')}
          />
          {usernameQuery && (
            <button
              onClick={() => {
                setUsernameQuery('');
                discoverFarmers('', crop).then((res) => setFarmers(res.farmers || []));
              }}
              style={{
                position: 'absolute',
                right: '12px',
                top: '12px',
                background: 'none',
                color: 'var(--text-muted)'
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Instagram Search Tabs: All | Accounts | Crops | Nearby */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '0.75rem',
            marginBottom: '1rem',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}
        >
          <button
            onClick={() => {
              setActiveTab('all');
              setCrop('');
              handleSearch('all', false);
            }}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'all' ? 'var(--primary-emerald)' : 'var(--bg-surface-subtle)',
              color: activeTab === 'all' ? '#FFFFFF' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Users size={15} />
            <span>All Farmers</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('crop');
              handleSearch('crop', false);
            }}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'crop' ? 'var(--primary-emerald)' : 'var(--bg-surface-subtle)',
              color: activeTab === 'crop' ? '#FFFFFF' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Sprout size={15} />
            <span>Search by Crop</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('nearby');
              handleSearch('nearby', true);
            }}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'nearby' ? 'var(--primary-emerald)' : 'var(--bg-surface-subtle)',
              color: activeTab === 'nearby' ? '#FFFFFF' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Navigation size={15} />
            <span>Nearby Farmers (GPS)</span>
          </button>
        </div>

        {/* Crops Filter Sub-Bar when Crop tab is active */}
        {activeTab === 'crop' && (
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Filter Crop:
            </span>
            {popularCrops.map((cName) => (
              <button
                key={cName}
                onClick={() => {
                  const newCrop = crop === cName ? '' : cName;
                  setCrop(newCrop);
                  discoverFarmers(usernameQuery, newCrop).then((res) => setFarmers(res.farmers || []));
                }}
                style={{
                  backgroundColor: crop === cName ? 'var(--primary-emerald)' : 'var(--bg-surface-subtle)',
                  color: crop === cName ? '#FFFFFF' : 'var(--primary-emerald)',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: '1px solid var(--border-light)'
                }}
              >
                🌱 {cName}
              </button>
            ))}
          </div>
        )}

        {/* Nearby Radius Selector when Nearby tab is active */}
        {activeTab === 'nearby' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Search Radius:
            </span>
            <select
              value={radius}
              onChange={(e) => {
                const r = parseInt(e.target.value, 10);
                setRadius(r);
                discoverNearby(undefined, undefined, r).then((res) => setFarmers(res.farmers || []));
              }}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--bg-surface-subtle)',
                fontWeight: 700,
                color: 'var(--text-main)'
              }}
            >
              <option value={10}>10 km</option>
              <option value={25}>25 km (Default)</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
            </select>
          </div>
        )}

        {locationStatus && (
          <div style={{ fontSize: '0.8rem', color: '#D97706', marginTop: '0.5rem', fontWeight: 600 }}>
            📍 {locationStatus}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
          Found {farmers.length} {farmers.length === 1 ? 'farmer' : 'farmers'}
        </span>
      </div>

      {/* Farmers Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
          {t('common.loading')}
        </div>
      ) : farmers.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', borderRadius: '24px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🔍</div>
          <h3 style={{ color: 'var(--text-main)' }}>{t('discover.noFarmersFound')}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Try searching another username, handle, crop name or broadening your GPS radius.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {farmers.map((farmer) => (
            <FarmerCard key={farmer._id} farmer={farmer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Discover;
