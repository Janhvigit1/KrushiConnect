import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Trash2,
  Ban,
  UserCheck,
  UserX,
  ArrowLeft,
  RefreshCw,
  Eye,
  MessageSquare,
  Heart,
  PhoneCall,
  Sparkles,
  Layers,
  MapPin
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import {
  getDashboardStats,
  getAdminUsers,
  updateUserStatus,
  toggleUserVerification,
  updateUserRole,
  deleteUserByAdmin,
  getAdminPosts,
  deletePostByAdmin,
  getAdminStories,
  deleteStoryByAdmin
} from '../services/adminService';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'posts', 'stories'
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Users Tab State
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);

  // Posts Tab State
  const [posts, setPosts] = useState([]);
  const [postSearch, setPostSearch] = useState('');
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Stories Tab State
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(false);

  const [actionMessage, setActionMessage] = useState('');

  // Protect route client-side as well
  useEffect(() => {
    if (user && user.role !== 'admin') {
      alert('Access restricted to Platform Administrators only.');
      navigate('/');
    }
  }, [user, navigate]);

  // Load Dashboard Stats
  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const data = await getDashboardStats();
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Load Users
  const loadUsers = async (page = 1) => {
    try {
      setLoadingUsers(true);
      const data = await getAdminUsers({
        search: userSearch,
        role: userRoleFilter,
        status: userStatusFilter,
        page,
        limit: 15
      });
      setUsers(data.users || []);
      setUserTotalPages(data.pages || 1);
      setUserPage(page);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load Posts
  const loadPosts = async () => {
    try {
      setLoadingPosts(true);
      const data = await getAdminPosts({ search: postSearch });
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Load Stories
  const loadStories = async () => {
    try {
      setLoadingStories(true);
      const data = await getAdminStories();
      setStories(data.stories || []);
    } catch (err) {
      console.error('Failed to load stories:', err);
    } finally {
      setLoadingStories(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') loadUsers(1);
    if (activeTab === 'posts') loadPosts();
    if (activeTab === 'stories') loadStories();
  }, [activeTab]);

  const showFeedback = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 3500);
  };

  // Handlers for User Actions
  const handleToggleStatus = async (farmer) => {
    const nextStatus = farmer.status === 'banned' ? 'active' : 'banned';
    const confirmMsg = nextStatus === 'banned'
      ? `Are you sure you want to suspend and ban farmer "${farmer.name}"? They will lose platform access immediately.`
      : `Re-activate farmer "${farmer.name}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await updateUserStatus(farmer._id, nextStatus);
      showFeedback(`Farmer ${farmer.name} is now ${nextStatus.toUpperCase()}`);
      loadUsers(userPage);
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update farmer status');
    }
  };

  const handleToggleVerify = async (farmer) => {
    try {
      await toggleUserVerification(farmer._id);
      showFeedback(`Verified checkmark toggled for ${farmer.name}`);
      loadUsers(userPage);
      loadStats();
    } catch (err) {
      alert('Failed to update verification');
    }
  };

  const handleToggleRole = async (farmer) => {
    const nextRole = farmer.role === 'admin' ? 'farmer' : 'admin';
    if (!window.confirm(`Change ${farmer.name}'s role to ${nextRole.toUpperCase()}?`)) return;

    try {
      await updateUserRole(farmer._id, nextRole);
      showFeedback(`Role updated to ${nextRole} for ${farmer.name}`);
      loadUsers(userPage);
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleDeleteUser = async (farmer) => {
    if (!window.confirm(`PERMANENTLY delete farmer "${farmer.name}" and ALL their posts, comments, and stories? This cannot be undone.`)) return;

    try {
      await deleteUserByAdmin(farmer._id);
      showFeedback(`Farmer ${farmer.name} deleted.`);
      loadUsers(userPage);
      loadStats();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  // Handlers for Post Actions
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Remove this post from KrushiConnect? Associated likes and comments will also be purged.')) return;

    try {
      await deletePostByAdmin(postId);
      showFeedback('Post successfully removed by Administrator.');
      loadPosts();
      loadStats();
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  // Handlers for Story Actions
  const handleDeleteStory = async (storyId) => {
    if (!window.confirm('Delete this active story immediately?')) return;

    try {
      await deleteStoryByAdmin(storyId);
      showFeedback('Story purged.');
      loadStories();
      loadStats();
    } catch (err) {
      alert('Failed to delete story');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Banner Header */}
      <div
        className="card"
        style={{
          padding: '1.5rem 1.75rem',
          borderRadius: '24px',
          marginBottom: '1.75rem',
          background: 'linear-gradient(135deg, #0F5132 0%, #064E3B 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 8px 30px rgba(15, 81, 50, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Shield size={28} color="#F59E0B" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.3px', margin: 0, color: '#FFF' }}>
                KrushiConnect Admin Console
              </h1>
              <span
                style={{
                  backgroundColor: '#F59E0B',
                  color: '#000',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}
              >
                RBAC ACTIVE
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', opacity: 0.9, marginTop: '2px', color: '#E2E8F0' }}>
              Full platform governance, user lookup, content moderation, and real-time agricultural telemetry.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => {
              loadStats();
              if (activeTab === 'users') loadUsers(userPage);
              if (activeTab === 'posts') loadPosts();
            }}
            className="btn-secondary"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFF',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '9999px',
              padding: '0.5rem 1rem',
              fontSize: '0.82rem'
            }}
          >
            <RefreshCw size={14} />
            <span>Refresh Telemetry</span>
          </button>

          <Link
            to="/"
            className="btn-primary"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0F5132',
              borderRadius: '9999px',
              padding: '0.5rem 1.15rem',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}
          >
            <ArrowLeft size={16} />
            <span>Farmer View</span>
          </Link>
        </div>
      </div>

      {/* Action Toast Alert */}
      {actionMessage && (
        <div
          style={{
            backgroundColor: '#059669',
            color: '#FFF',
            padding: '0.75rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.15rem',
          marginBottom: '1.75rem'
        }}
      >
        <div className="card" style={{ padding: '1.25rem', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Registered Farmers</span>
            <Users size={18} color="var(--primary-emerald)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem' }}>
            {loadingStats ? '...' : stats?.totalUsers || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px', fontWeight: 600 }}>
            Active: {stats?.activeUsers || 0} • Banned: {stats?.bannedUsers || 0}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Posts & Crop Updates</span>
            <FileText size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem' }}>
            {loadingStats ? '...' : stats?.totalPosts || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
            Likes: {stats?.totalLikes || 0} • Comments: {stats?.totalComments || 0}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Active 24h Stories</span>
            <Clock size={18} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem' }}>
            {loadingStats ? '...' : stats?.totalStories || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8B5CF6', marginTop: '4px', fontWeight: 600 }}>
            MongoDB TTL Index Active
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Verified Badges</span>
            <CheckCircle2 size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.35rem' }}>
            {loadingStats ? '...' : stats?.verifiedUsers || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
            Certified Lead Farmers
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.65rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '0.85rem',
          marginBottom: '1.5rem'
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.55rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            backgroundColor: activeTab === 'overview' ? 'var(--primary-emerald)' : 'var(--bg-surface-subtle)',
            color: activeTab === 'overview' ? '#FFFFFF' : 'var(--text-main)'
          }}
        >
          Overview & Telemetry
        </button>

        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '0.55rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            backgroundColor: activeTab === 'users' ? 'var(--primary-emerald)' : 'var(--bg-surface-subtle)',
            color: activeTab === 'users' ? '#FFFFFF' : 'var(--text-main)'
          }}
        >
          Farmer Directory ({stats?.totalUsers || 0})
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          style={{
            padding: '0.55rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            backgroundColor: activeTab === 'posts' ? 'var(--primary-emerald)' : 'var(--bg-surface-subtle)',
            color: activeTab === 'posts' ? '#FFFFFF' : 'var(--text-main)'
          }}
        >
          Post Moderation ({stats?.totalPosts || 0})
        </button>

        <button
          onClick={() => setActiveTab('stories')}
          style={{
            padding: '0.55rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            backgroundColor: activeTab === 'stories' ? 'var(--primary-emerald)' : 'var(--bg-surface-subtle)',
            color: activeTab === 'stories' ? '#FFFFFF' : 'var(--text-main)'
          }}
        >
          24h Stories ({stats?.totalStories || 0})
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & SYSTEM TELEMETRY */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
              System Health & Architecture Status
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DATABASE STATUS</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
                  MongoDB Connected (Resilient Engine)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Indexes: 2dsphere, compound likes, TTL stories
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>REAL-TIME ENGINE</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                  Socket.IO Active on Port 5001
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  STUN: stun.l.google.com:19302 (WebRTC P2P)
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>AGRICULTURAL AI ENGINE</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#8B5CF6', marginTop: '4px' }}>
                  Meta Llama 3 (8B) / ICAR RAG
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  8 Indian state agronomy profiles grounded
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: FARMERS DIRECTORY & USER MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <div>
          {/* Search & Filter Toolbar */}
          <div
            className="card"
            style={{
              padding: '1.15rem 1.5rem',
              borderRadius: '20px',
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search farmers by name, email, village, or district..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadUsers(1)}
                style={{ paddingLeft: '40px', borderRadius: '9999px', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                className="form-input"
                value={userRoleFilter}
                onChange={(e) => {
                  setUserRoleFilter(e.target.value);
                  setTimeout(() => loadUsers(1), 50);
                }}
                style={{ borderRadius: '9999px', fontSize: '0.82rem', padding: '0.45rem 1rem' }}
              >
                <option value="all">All Roles</option>
                <option value="farmer">Farmer</option>
                <option value="admin">Administrator</option>
              </select>

              <select
                className="form-input"
                value={userStatusFilter}
                onChange={(e) => {
                  setUserStatusFilter(e.target.value);
                  setTimeout(() => loadUsers(1), 50);
                }}
                style={{ borderRadius: '9999px', fontSize: '0.82rem', padding: '0.45rem 1rem' }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="banned">Suspended / Banned</option>
              </select>

              <button onClick={() => loadUsers(1)} className="btn-primary" style={{ borderRadius: '9999px', fontSize: '0.82rem', padding: '0.45rem 1.15rem' }}>
                Search
              </button>
            </div>
          </div>

          {/* Farmers Table */}
          <div className="card" style={{ borderRadius: '20px', overflow: 'hidden', padding: 0 }}>
            {loadingUsers ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                Loading farmers directory...
              </div>
            ) : users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No farmers found matching query.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-surface-subtle)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Farmer Profile</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Location & Crops</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Role</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Status</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((f) => (
                      <tr key={f._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: '#ECFDF5',
                                color: '#059669',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                flexShrink: 0
                              }}
                            >
                              {f.avatar ? (
                                <img src={f.avatar} alt={f.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                              ) : (
                                f.name[0]?.toUpperCase()
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>{f.name}</span>
                                {f.isVerified && <CheckCircle2 size={14} color="#059669" fill="#DCFCE7" title="Verified Farmer" />}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{f.email}</div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                            {f.village}, {f.district} ({f.state})
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {f.crops?.slice(0, 3).join(', ') || 'General Farming'}
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              backgroundColor: f.role === 'admin' ? '#EDE9FE' : '#F1F5F9',
                              color: f.role === 'admin' ? '#7C3AED' : '#475569'
                            }}
                          >
                            {f.role?.toUpperCase()}
                          </span>
                        </td>

                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              backgroundColor: f.status === 'banned' ? '#FEE2E2' : '#DCFCE7',
                              color: f.status === 'banned' ? '#B91C1C' : '#15803D'
                            }}
                          >
                            {f.status === 'banned' ? 'SUSPENDED' : 'ACTIVE'}
                          </span>
                        </td>

                        <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                            {/* Toggle Verified Badge */}
                            <button
                              onClick={() => handleToggleVerify(f)}
                              title={f.isVerified ? 'Remove verification' : 'Grant verified badge'}
                              style={{
                                padding: '5px 8px',
                                borderRadius: '8px',
                                background: 'var(--bg-surface-subtle)',
                                border: '1px solid var(--border-light)',
                                color: f.isVerified ? '#059669' : 'var(--text-muted)',
                                fontSize: '0.72rem',
                                fontWeight: 700
                              }}
                            >
                              {f.isVerified ? '✓ Verified' : '+ Verify'}
                            </button>

                            {/* Ban / Unban Button */}
                            <button
                              onClick={() => handleToggleStatus(f)}
                              title={f.status === 'banned' ? 'Re-activate farmer' : 'Suspend account'}
                              style={{
                                padding: '5px 8px',
                                borderRadius: '8px',
                                background: f.status === 'banned' ? '#DCFCE7' : '#FEE2E2',
                                border: 'none',
                                color: f.status === 'banned' ? '#15803D' : '#DC2626',
                                fontSize: '0.72rem',
                                fontWeight: 700
                              }}
                            >
                              {f.status === 'banned' ? 'Unban' : 'Ban'}
                            </button>

                            {/* Promote / Demote */}
                            <button
                              onClick={() => handleToggleRole(f)}
                              title={f.role === 'admin' ? 'Demote to farmer' : 'Promote to admin'}
                              style={{
                                padding: '5px 8px',
                                borderRadius: '8px',
                                background: 'var(--bg-surface-subtle)',
                                border: '1px solid var(--border-light)',
                                color: 'var(--text-main)',
                                fontSize: '0.72rem'
                              }}
                            >
                              {f.role === 'admin' ? 'Demote' : 'Make Admin'}
                            </button>

                            {/* Delete User */}
                            <button
                              onClick={() => handleDeleteUser(f)}
                              title="Permanently Delete User"
                              style={{
                                padding: '5px 8px',
                                borderRadius: '8px',
                                background: 'none',
                                color: '#EF4444'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CONTENT MODERATION (POSTS) */}
      {/* ========================================================= */}
      {activeTab === 'posts' && (
        <div>
          <div
            className="card"
            style={{
              padding: '1.15rem 1.5rem',
              borderRadius: '20px',
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              className="form-input"
              placeholder="Search posts by keywords..."
              value={postSearch}
              onChange={(e) => setPostSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadPosts()}
              style={{ flex: 1, borderRadius: '9999px', fontSize: '0.85rem' }}
            />
            <button onClick={loadPosts} className="btn-primary" style={{ borderRadius: '9999px', fontSize: '0.82rem' }}>
              Filter
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loadingPosts ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading posts...</div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No posts found.</div>
            ) : (
              posts.map((p) => (
                <div
                  key={p._id}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1.25rem'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        {p.author?.name || 'Deleted Farmer'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        • {p.author?.village}, {p.author?.district}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                      {p.text}
                    </p>

                    {p.images && p.images.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', marginTop: '0.75rem' }}>
                        {p.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="Crop update"
                            style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>❤️ {p.likesCount || 0} Likes</span>
                      <span>💬 {p.commentsCount || 0} Comments</span>
                      <span>📅 {new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePost(p._id)}
                    className="btn-danger"
                    style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={13} />
                    <span>Delete Post</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: STORIES MODERATION */}
      {/* ========================================================= */}
      {activeTab === 'stories' && (
        <div>
          <div className="card" style={{ padding: '1.5rem', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Active 24-Hour Stories Queue
            </h3>

            {loadingStories ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading active stories...</div>
            ) : stories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No active stories currently uploaded.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {stories.map((s) => (
                  <div
                    key={s._id}
                    style={{
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-light)',
                      position: 'relative',
                      background: '#000'
                    }}
                  >
                    <img src={s.mediaUrl} alt="Story" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '0.75rem'
                      }}
                    >
                      <button
                        onClick={() => handleDeleteStory(s._id)}
                        style={{
                          alignSelf: 'flex-end',
                          backgroundColor: '#EF4444',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Purge Story"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div>
                        <div style={{ color: '#FFF', fontWeight: 700, fontSize: '0.8rem' }}>{s.user?.name}</div>
                        <div style={{ color: '#CBD5E1', fontSize: '0.68rem' }}>Expires in 24h (TTL)</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
