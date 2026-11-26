import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Globe,
  User,
  LogOut,
  Check,
  Shield,
  Archive,
  Bookmark,
  Activity,
  Smartphone,
  Clock,
  Bell,
  Camera,
  Mic,
  MapPin,
  Users,
  ChevronRight,
  Sun,
  Moon,
  Lock,
  Eye,
  Calendar,
  Share2
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, changeLanguage } = useContext(AuthContext);
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);

  // Active settings sub-section: 'privacy', 'archive', 'saved', 'activity', 'permissions', 'language', 'account'
  const [activeSection, setActiveSection] = useState('privacy');

  // Account Privacy state
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [showActivityStatus, setShowActivityStatus] = useState(true);
  const [allowStorySharing, setAllowStorySharing] = useState(true);

  // Time Management state
  const [dailyTimeLimit, setDailyTimeLimit] = useState(45); // in minutes
  const [sleepModeEnabled, setSleepModeEnabled] = useState(true);

  // Device permissions state
  const [locationPerm, setLocationPerm] = useState('Allowed');
  const [notificationPerm, setNotificationPerm] = useState('Enabled');
  const [cameraPerm, setCameraPerm] = useState('Allowed');
  const [contactsPerm, setContactsPerm] = useState('Synced (8 contacts found)');

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
  };

  const handleLogoutClick = () => {
    if (window.confirm(t('settings.logoutConfirm'))) {
      logout();
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem', letterSpacing: '-0.3px' }}>
        {t('settings.title')}
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '260px 1fr',
          gap: '1.5rem',
          alignItems: 'start'
        }}
      >
        {/* Left Settings Instagram Navigation Menu */}
        <div className="card" style={{ padding: '0.75rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {/* Account Privacy */}
            <div
              className={`settings-menu-item ${activeSection === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveSection('privacy')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Shield size={18} color="var(--primary-emerald)" />
                <span>Account Privacy</span>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>

            {/* Archive */}
            <div
              className={`settings-menu-item ${activeSection === 'archive' ? 'active' : ''}`}
              onClick={() => setActiveSection('archive')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Archive size={18} color="var(--primary-emerald)" />
                <span>Archive</span>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>

            {/* Saved Bookmarks */}
            <div
              className={`settings-menu-item ${activeSection === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveSection('saved')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Bookmark size={18} color="var(--primary-emerald)" />
                <span>Saved Posts</span>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>

            {/* Your Activity & Time Management */}
            <div
              className={`settings-menu-item ${activeSection === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveSection('activity')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Activity size={18} color="var(--primary-emerald)" />
                <span>Your Activity</span>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>

            {/* Device Permissions */}
            <div
              className={`settings-menu-item ${activeSection === 'permissions' ? 'active' : ''}`}
              onClick={() => setActiveSection('permissions')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Smartphone size={18} color="var(--primary-emerald)" />
                <span>Device Permissions</span>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>

            {/* Appearance (Theme) */}
            <div
              className={`settings-menu-item ${activeSection === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveSection('appearance')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {isDark ? <Moon size={18} color="#F59E0B" /> : <Sun size={18} color="var(--primary-emerald)" />}
                <span>Dark / Light Mode</span>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>

            {/* Language */}
            <div
              className={`settings-menu-item ${activeSection === 'language' ? 'active' : ''}`}
              onClick={() => setActiveSection('language')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Globe size={18} color="var(--primary-emerald)" />
                <span>Display Language</span>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>

            {/* Account Info */}
            <div
              className={`settings-menu-item ${activeSection === 'account' ? 'active' : ''}`}
              onClick={() => setActiveSection('account')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <User size={18} color="var(--primary-emerald)" />
                <span>Account Info</span>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <button
              onClick={handleLogoutClick}
              className="btn-danger"
              style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }}
            >
              <LogOut size={16} />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </div>

        {/* Right Content Panel for Selected Setting */}
        <div className="card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
          {/* SECTION 1: ACCOUNT PRIVACY */}
          {activeSection === 'privacy' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Shield size={22} color="var(--primary-emerald)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Account Privacy</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Private Account Switch */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Private Farmer Account</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      When your account is private, only farmers you approve can see your field photos, crops, and stories.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPrivateAccount}
                    onChange={(e) => setIsPrivateAccount(e.target.checked)}
                    style={{ width: '20px', height: '20px', accentColor: '#059669', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ height: '1px', background: 'var(--border-light)' }} />

                {/* Activity Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Show Activity Status</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Allow farmers you follow and anyone you message to see when you were last active or currently online.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showActivityStatus}
                    onChange={(e) => setShowActivityStatus(e.target.checked)}
                    style={{ width: '20px', height: '20px', accentColor: '#059669', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ height: '1px', background: 'var(--border-light)' }} />

                {/* Story Sharing */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Allow Story Sharing</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Let other farmers share your 24-hour farming stories in direct messages.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowStorySharing}
                    onChange={(e) => setAllowStorySharing(e.target.checked)}
                    style={{ width: '20px', height: '20px', accentColor: '#059669', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: ARCHIVE */}
          {activeSection === 'archive' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Archive size={22} color="var(--primary-emerald)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Archive</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    border: '1.5px solid var(--border-light)',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📖</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Stories Archive</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Past 24-hr stories automatically preserved privately for your farm journal.
                  </div>
                </div>

                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    border: '1.5px solid var(--border-light)',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🌾</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Posts Archive</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Crop updates hidden from feed without permanently deleting them.
                  </div>
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                ℹ️ Only you can view your archived stories and posts. You can restore them to your profile anytime.
              </div>
            </div>
          )}

          {/* SECTION 3: SAVED POSTS */}
          {activeSection === 'saved' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Bookmark size={22} color="var(--primary-emerald)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Saved Farm Posts & Crop Tips</h3>
              </div>

              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>📑</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                  All Posts & Crop Techniques Saved
                </div>
                <p style={{ fontSize: '0.85rem', maxWidth: '380px', margin: '0.5rem auto 1.25rem auto' }}>
                  When you tap the bookmark icon on any post in your feed, it is saved here for quick reference during sowing or harvest.
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  Browse Home Feed
                </button>
              </div>
            </div>
          )}

          {/* SECTION 4: YOUR ACTIVITY & TIME MANAGEMENT */}
          {activeSection === 'activity' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Activity size={22} color="var(--primary-emerald)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Your Activity & Time Management</h3>
              </div>

              {/* Daily Average Widget */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(15, 81, 50, 0.05) 100%)',
                  border: '1.5px solid var(--border-light)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Daily Average
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-emerald)' }}>
                    38 mins
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Time spent on KrushiConnect networking today
                  </div>
                </div>
                <Clock size={36} color="var(--primary-emerald)" />
              </div>

              {/* Time Management Controls */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                Manage Your Screen Time in the Field
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Daily Break Reminder:</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-emerald)' }}>
                      {dailyTimeLimit} minutes
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="15"
                    value={dailyTimeLimit}
                    onChange={(e) => setDailyTimeLimit(e.target.value)}
                    style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    We will remind you to take a break and focus on field work once your time is up.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Farmer Sleep Mode (Quiet Hours)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Mute non-urgent notifications between 10:00 PM and 5:00 AM for early morning farming.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={sleepModeEnabled}
                    onChange={(e) => setSleepModeEnabled(e.target.checked)}
                    style={{ width: '20px', height: '20px', accentColor: '#059669', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: DEVICE PERMISSIONS */}
          {activeSection === 'permissions' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Smartphone size={22} color="var(--primary-emerald)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Device Permissions</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MapPin size={20} color="var(--primary-emerald)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Location (GPS)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Used for finding nearby farmers in your district/taluka</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: '3px 10px', borderRadius: '999px' }}>
                    {locationPerm}
                  </span>
                </div>

                {/* Notifications */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Bell size={20} color="var(--primary-emerald)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alerts for incoming calls, chat messages, and post comments</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: '3px 10px', borderRadius: '999px' }}>
                    {notificationPerm}
                  </span>
                </div>

                {/* Camera */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Camera size={20} color="var(--primary-emerald)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Camera</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Required for WebRTC video calling and taking field photos</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: '3px 10px', borderRadius: '999px' }}>
                    {cameraPerm}
                  </span>
                </div>

                {/* Microphone */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Mic size={20} color="var(--primary-emerald)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Microphone</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Required for peer-to-peer farmer voice calls</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: '3px 10px', borderRadius: '999px' }}>
                    Allowed
                  </span>
                </div>

                {/* Contacts */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Users size={20} color="var(--primary-emerald)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Contacts</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Discover fellow village farmers from your phonebook</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: '3px 10px', borderRadius: '999px' }}>
                    {contactsPerm}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: DARK / LIGHT MODE APPEARANCE */}
          {activeSection === 'appearance' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {isDark ? <Moon size={22} color="#F59E0B" /> : <Sun size={22} color="var(--primary-emerald)" />}
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Dark & Light Theme</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* Light Theme Card */}
                <div
                  onClick={() => !isDark || toggleTheme()}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    border: `2px solid ${!isDark ? 'var(--primary-emerald)' : 'var(--border-light)'}`,
                    backgroundColor: !isDark ? 'var(--bg-surface-subtle)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Sun size={24} color="#059669" />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Light Mode</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daylight Farm View</div>
                    </div>
                  </div>
                  {!isDark && <Check size={20} color="var(--primary-emerald)" strokeWidth={3} />}
                </div>

                {/* Dark Theme Card */}
                <div
                  onClick={() => isDark || toggleTheme()}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    border: `2px solid ${isDark ? 'var(--primary-emerald)' : 'var(--border-light)'}`,
                    backgroundColor: isDark ? 'var(--bg-surface-subtle)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Moon size={24} color="#F59E0B" />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Dark Mode</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Night / Low Light View</div>
                    </div>
                  </div>
                  {isDark && <Check size={20} color="var(--primary-emerald)" strokeWidth={3} />}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: LANGUAGE */}
          {activeSection === 'language' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Globe size={22} color="var(--primary-emerald)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Display Language</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* English */}
                <div
                  onClick={() => handleLanguageSelect('en')}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    border: `2px solid ${i18n.language === 'en' ? 'var(--primary-emerald)' : 'var(--border-light)'}`,
                    backgroundColor: i18n.language === 'en' ? 'var(--bg-surface-subtle)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>English</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Default Language</div>
                  </div>
                  {i18n.language === 'en' && <Check size={20} color="var(--primary-emerald)" strokeWidth={3} />}
                </div>

                {/* Hindi */}
                <div
                  onClick={() => handleLanguageSelect('hi')}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    border: `2px solid ${i18n.language === 'hi' ? 'var(--primary-emerald)' : 'var(--border-light)'}`,
                    backgroundColor: i18n.language === 'hi' ? 'var(--bg-surface-subtle)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>हिंदी (Hindi)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>भारतीय किसान भाषा</div>
                  </div>
                  {i18n.language === 'hi' && <Check size={20} color="var(--primary-emerald)" strokeWidth={3} />}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: ACCOUNT INFO */}
          {activeSection === 'account' && user && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <User size={22} color="var(--primary-emerald)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Account Details</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{t('auth.fullName')}</span>
                  <span style={{ fontWeight: 600 }}>{user.name}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{t('auth.email')}</span>
                  <span style={{ fontWeight: 600 }}>{user.email}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{t('profile.location')}</span>
                  <span style={{ fontWeight: 600 }}>{user.village}, {user.district}, {user.state}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{t('auth.cropsGrown')}</span>
                  <span style={{ fontWeight: 600 }}>{user.crops?.join(', ') || 'Wheat, Cotton'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
