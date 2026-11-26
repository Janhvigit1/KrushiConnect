import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Compass,
  PlusSquare,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Sprout,
  Bot,
  Sparkles,
  Shield
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = ({ onOpenCreatePost, onOpenAi }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <div className="brand-section">
        <div className="brand-icon">
          <Sprout size={24} />
        </div>
        <div>
          <div className="brand-title">{t('appName')}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {t('appTagline')}
          </div>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Home size={22} />
          <span>{t('nav.home')}</span>
        </NavLink>

        <NavLink
          to="/discover"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Compass size={22} />
          <span>{t('nav.discover')}</span>
        </NavLink>

        <button
          onClick={onOpenCreatePost}
          className="nav-item"
          style={{ width: '100%', textAlign: 'left', background: 'transparent' }}
        >
          <PlusSquare size={22} />
          <span>{t('nav.create')}</span>
        </button>

        {/* Krushi AI Advisor Link */}
        <button
          onClick={onOpenAi}
          className="nav-item"
          style={{
            width: '100%',
            textAlign: 'left',
            background: 'transparent',
            color: 'var(--primary-emerald)',
            fontWeight: 700
          }}
        >
          <Bot size={22} color="var(--primary-emerald)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{i18n.language === 'hi' ? 'कृषि AI मित्र' : 'Krushi AI'}</span>
            <Sparkles size={13} color="#F59E0B" />
          </div>
        </button>

        <NavLink
          to="/messages"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <MessageCircle size={22} />
          <span>{t('nav.messages')}</span>
        </NavLink>

        {user && (
          <NavLink
            to={`/profile/${user._id}`}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <User size={22} />
            <span>{t('nav.profile')}</span>
          </NavLink>
        )}

        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Settings size={22} />
          <span>{t('nav.settings')}</span>
        </NavLink>

        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={{ color: '#F59E0B', fontWeight: 800 }}
          >
            <Shield size={22} color="#F59E0B" />
            <span>Admin Console</span>
          </NavLink>
        )}
      </nav>

      {user && (
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <button
            onClick={logout}
            className="nav-item"
            style={{
              width: '100%',
              color: '#EF4444',
              background: 'transparent'
            }}
          >
            <LogOut size={20} />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Navbar;
