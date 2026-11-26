import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Sun, Moon, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, changeLanguage } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    changeLanguage(nextLang);
  };

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <span style={{ fontSize: '1.45rem' }}>🌾</span>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-emerald)', letterSpacing: '-0.4px' }}>
          {t('appName')}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#0F5132" />}
        </button>

        {/* Language Switcher Pill */}
        <button
          onClick={toggleLanguage}
          className="lang-toggle-btn"
          title="Switch Language / भाषा बदलें"
        >
          <Globe size={15} />
          <span>{i18n.language === 'hi' ? 'English' : 'हिंदी'}</span>
        </button>

        {/* Profile Pill */}
        {user && (
          <Link
            to={`/profile/${user._id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-light)',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              transition: 'all 0.15s ease'
            }}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <UserIcon size={16} color="var(--primary-emerald)" />
            )}
            <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name.split(' ')[0]}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
