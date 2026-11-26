import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, RefreshCw, Sparkles, TrendingUp, UserPlus, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import StoriesBar from '../components/stories/StoriesBar';
import StoryViewerModal from '../components/stories/StoryViewerModal';
import CreateStoryModal from '../components/stories/CreateStoryModal';
import PostCard from '../components/feed/PostCard';
import CreatePostModal from '../components/feed/CreatePostModal';
import { getFeed, deletePost } from '../services/postService';
import { getStoriesFeed } from '../services/storyService';
import { discoverFarmers } from '../services/discoverService';
import { followUser } from '../services/userService';

const Home = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [usersWithStories, setUsersWithStories] = useState([]);
  const [suggestedFarmers, setSuggestedFarmers] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Modals state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [activeStoryGroup, setActiveStoryGroup] = useState(null);

  // Fetch feed posts
  const fetchFeed = async (pageNum = 1) => {
    try {
      setLoadingPosts(true);
      const data = await getFeed(pageNum, 10);
      if (pageNum === 1) {
        setPosts(data.posts || []);
      } else {
        setPosts((prev) => [...prev, ...(data.posts || [])]);
      }
      setHasMore(pageNum < (data.pages || 1));
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Fetch stories feed
  const fetchStories = async () => {
    try {
      const data = await getStoriesFeed();
      setUsersWithStories(data.usersWithStories || []);
    } catch (err) {
      console.error('Error fetching stories:', err);
    }
  };

  // Fetch suggested farmers for sidebar
  const fetchSuggestions = async () => {
    try {
      const data = await discoverFarmers();
      setSuggestedFarmers(data.farmers?.slice(0, 5) || []);
    } catch (err) {
      console.warn('Could not load suggestions:', err.message);
    }
  };

  useEffect(() => {
    fetchFeed(1);
    fetchStories();
    fetchSuggestions();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const handleQuickFollow = async (farmerId) => {
    try {
      await followUser(farmerId);
      setSuggestedFarmers((prev) =>
        prev.map((f) => (f._id === farmerId ? { ...f, isFollowing: true } : f))
      );
      fetchFeed(1);
    } catch (err) {
      alert('Failed to follow farmer');
    }
  };

  return (
    <div className="feed-layout-grid">
      {/* Left Main Stream */}
      <div>
        {/* Instagram Stories Carousel */}
        <StoriesBar
          usersWithStories={usersWithStories}
          onSelectUserStories={(group) => setActiveStoryGroup(group)}
          onOpenCreateStory={() => setIsCreateStoryOpen(true)}
        />

        {/* Instagram "Create Post" Card with Farmer's Avatar */}
        <div
          className="card"
          style={{
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            cursor: 'pointer',
            borderRadius: '20px',
            boxShadow: '0 4px 16px -2px rgba(15, 81, 50, 0.05)',
            marginBottom: '1.75rem'
          }}
          onClick={() => setIsCreatePostOpen(true)}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem'
              }}
            >
              {user?.name ? user.name[0].toUpperCase() : '🌾'}
            </div>
          )}

          <div
            style={{
              flex: 1,
              backgroundColor: '#F1F5F2',
              borderRadius: '9999px',
              padding: '0.75rem 1.25rem',
              color: '#64748B',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'background-color 0.15s ease'
            }}
          >
            {t('feed.createPost')}
          </div>

          <button
            className="btn-primary"
            style={{ padding: '0.55rem 1.15rem', borderRadius: '9999px', fontSize: '0.85rem' }}
          >
            <PlusCircle size={16} />
            <span>{t('nav.create')}</span>
          </button>
        </div>

        {/* Posts Feed */}
        {loadingPosts && page === 1 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: '#64748B' }}>
            <RefreshCw size={28} className="spin-animation" color="#059669" style={{ margin: '0 auto 0.75rem auto' }} />
            <div style={{ fontWeight: 600 }}>{t('common.loading')}</div>
          </div>
        ) : posts.length === 0 ? (
          <div
            className="card"
            style={{ padding: '3.5rem 1.5rem', textAlign: 'center', borderRadius: '24px' }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🌾</div>
            <h3 style={{ fontWeight: 800, color: '#0F5132', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              {t('feed.title')}
            </h3>
            <p style={{ maxWidth: '420px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6 }}>
              {t('feed.noPosts')}
            </p>
            <button onClick={() => setIsCreatePostOpen(true)} className="btn-primary">
              <PlusCircle size={18} />
              <span>{t('feed.createPost')}</span>
            </button>
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDeletePost={handleDeletePost}
              />
            ))}

            {hasMore && (
              <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                <button
                  onClick={() => fetchFeed(page + 1)}
                  className="btn-secondary"
                  disabled={loadingPosts}
                >
                  {loadingPosts ? t('common.loading') : 'Load More Posts'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Instagram-style Profile & Suggestions Panel */}
      <div className="sidebar-suggestions-panel" style={{ position: 'sticky', top: '90px' }}>
        {/* Current Farmer Mini Profile */}
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              padding: '0.5rem 0'
            }}
          >
            <Link to={`/profile/${user._id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.2rem'
                  }}
                >
                  {user.name ? user.name[0].toUpperCase() : '🌾'}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {user.village}, {user.district}
                </div>
              </div>
            </Link>

            <Link
              to={`/profile/${user._id}`}
              style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-emerald)' }}
            >
              View Profile
            </Link>
          </div>
        )}

        {/* Suggestions For You Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Suggested Farmers
          </span>
          <Link
            to="/discover"
            style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}
          >
            See All
          </Link>
        </div>

        {/* Suggested Farmers List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
          {suggestedFarmers.map((f) => (
            <div
              key={f._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Link
                to={`/profile/${f._id}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#DCFCE7',
                    color: '#15803D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    flexShrink: 0
                  }}
                >
                  {f.name ? f.name[0].toUpperCase() : '🌾'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '140px'
                    }}
                  >
                    {f.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '140px'
                    }}
                  >
                    {f.crops?.slice(0, 2).join(', ') || `${f.village}, ${f.district}`}
                  </div>
                </div>
              </Link>

              <button
                onClick={() => handleQuickFollow(f._id)}
                disabled={f.isFollowing}
                style={{
                  background: 'none',
                  color: f.isFollowing ? 'var(--text-muted)' : 'var(--primary-emerald)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: f.isFollowing ? 'default' : 'pointer'
                }}
              >
                {f.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>

        {/* Trending Agricultural Tags */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            borderRadius: '18px',
            backgroundColor: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <TrendingUp size={16} color="var(--primary-emerald)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-emerald)' }}>
              Trending in Agriculture
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>#WheatHarvest2026</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>1.4k farmers posting</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>#OrganicFertilizer</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>820 discussions</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>#NashikOnionMandi</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>612 updates</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '1.25rem', lineHeight: 1.5 }}>
          © 2026 KrushiConnect • Dedicated Farmer Social Network • Made for Next-Generation Indian Farmers
        </div>
      </div>

      {/* Modals */}
      {isCreatePostOpen && (
        <CreatePostModal
          onClose={() => setIsCreatePostOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {isCreateStoryOpen && (
        <CreateStoryModal
          onClose={() => setIsCreateStoryOpen(false)}
          onStoryCreated={() => fetchStories()}
        />
      )}

      {activeStoryGroup && (
        <StoryViewerModal
          userGroup={activeStoryGroup}
          onClose={() => setActiveStoryGroup(null)}
          onStoryDeleted={() => fetchStories()}
        />
      )}
    </div>
  );
};

export default Home;
