import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const BottomNav = ({ onOpenCreatePost }) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  return (
    <nav className="bottom-nav">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? 'active' : ''}`
        }
      >
        <Home size={22} />
        <span>{t('nav.home')}</span>
      </NavLink>

      <NavLink
        to="/discover"
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? 'active' : ''}`
        }
      >
        <Compass size={22} />
        <span>{t('nav.discover')}</span>
      </NavLink>

      <button
        onClick={onOpenCreatePost}
        className="bottom-nav-item"
        style={{ background: 'transparent' }}
      >
        <PlusCircle size={24} color="#2E7D32" />
        <span>{t('nav.create')}</span>
      </button>

      <NavLink
        to="/messages"
        className={({ isActive }) =>
          `bottom-nav-item ${isActive ? 'active' : ''}`
        }
      >
        <MessageCircle size={22} />
        <span>{t('nav.messages')}</span>
      </NavLink>

      {user && (
        <NavLink
          to={`/profile/${user._id}`}
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <User size={22} />
          <span>{t('nav.profile')}</span>
        </NavLink>
      )}
    </nav>
  );
};

export default BottomNav;
