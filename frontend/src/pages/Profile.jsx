import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Edit3,
  Camera,
  MessageSquare,
  UserCheck,
  UserPlus,
  X
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  followUser,
  unfollowUser
} from '../services/userService';
import { getOrCreateConversation } from '../services/chatService';
import PostCard from '../components/feed/PostCard';
import { deletePost } from '../services/postService';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user: currentUser, updateUser } = useContext(AuthContext);

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editVillage, setEditVillage] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editState, setEditState] = useState('');
  const [editCrops, setEditCrops] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const isOwner = currentUser && id === currentUser._id;

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile(id);
      setProfileUser(data.user);
      setEditName(data.user.name || '');
      setEditBio(data.user.bio || '');
      setEditVillage(data.user.village || '');
      setEditDistrict(data.user.district || '');
      setEditState(data.user.state || '');
      setEditCrops(data.user.crops ? data.user.crops.join(', ') : '');
    } catch (err) {
      console.error('Error fetching farmer profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleFollowToggle = async () => {
    try {
      if (profileUser.isFollowing) {
        await unfollowUser(profileUser._id);
        setProfileUser((prev) => ({
          ...prev,
          isFollowing: false,
          followersCount: Math.max(0, (prev.followersCount || 1) - 1)
        }));
      } else {
        await followUser(profileUser._id);
        setProfileUser((prev) => ({
          ...prev,
          isFollowing: true,
          followersCount: (prev.followersCount || 0) + 1
        }));
      }
    } catch (err) {
      alert('Error updating follow status');
    }
  };

  const handleStartChat = async () => {
    try {
      await getOrCreateConversation(profileUser._id);
      navigate('/messages');
    } catch (err) {
      alert('Could not start chat');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setAvatarUploading(true);
      const res = await uploadAvatar(profileUser._id, file);
      setProfileUser((prev) => ({ ...prev, avatar: res.avatar }));
      updateUser({ avatar: res.avatar });
    } catch (err) {
      alert('Failed to upload profile photo');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateUserProfile(profileUser._id, {
        name: editName,
        bio: editBio,
        village: editVillage,
        district: editDistrict,
        state: editState,
        crops: editCrops
      });
      setProfileUser((prev) => ({ ...prev, ...res.user }));
      updateUser(res.user);
      setIsEditOpen(false);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(postId);
      setProfileUser((prev) => ({
        ...prev,
        posts: prev.posts?.filter((p) => p._id !== postId)
      }));
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#5F6D67' }}>
        {t('common.loading')}
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Farmer profile not found</h3>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Header Card */}
      <div className="card" style={{ padding: '1.75rem', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: window.innerWidth <= 600 ? 'column' : 'row',
            alignItems: 'center',
            gap: '1.5rem'
          }}
        >
          {/* Avatar with Upload Badge for Owner */}
          <div style={{ position: 'relative' }}>
            {profileUser.avatar ? (
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #2E7D32'
                }}
              />
            ) : (
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#C8E6C9',
                  color: '#1B5E20',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem'
                }}
              >
                {profileUser.name[0].toUpperCase()}
              </div>
            )}

            {isOwner && (
              <label
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#2E7D32',
                  color: '#FFFFFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px solid #FFFFFF'
                }}
                title={t('profile.changeAvatar')}
              >
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {/* Farmer Details */}
          <div style={{ flex: 1, textAlign: window.innerWidth <= 600 ? 'center' : 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: window.innerWidth <= 600 ? 'center' : 'flex-start' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C2826' }}>
                {profileUser.name}
              </h2>
              {isOwner && (
                <button
                  onClick={() => setIsEditOpen(true)}
                  style={{
                    backgroundColor: '#E8F5E9',
                    color: '#2E7D32',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Edit3 size={13} />
                  <span>{t('profile.editProfile')}</span>
                </button>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.85rem',
                color: '#5F6D67',
                marginTop: '0.2rem',
                justifyContent: window.innerWidth <= 600 ? 'center' : 'flex-start'
              }}
            >
              <MapPin size={15} color="#2E7D32" />
              <span>
                {profileUser.village}, {profileUser.district}, {profileUser.state}
              </span>
            </div>

            {profileUser.bio && (
              <p style={{ fontSize: '0.9rem', color: '#1C2826', margin: '0.6rem 0' }}>
                {profileUser.bio}
              </p>
            )}

            {/* Crops Cultivated */}
            {profileUser.crops && profileUser.crops.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '0.5rem 0', justifyContent: window.innerWidth <= 600 ? 'center' : 'flex-start' }}>
                {profileUser.crops.map((c, i) => (
                  <span key={i} className="crop-tag">
                    🌱 {c}
                  </span>
                ))}
              </div>
            )}

            {/* Counters */}
            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                marginTop: '0.75rem',
                justifyContent: window.innerWidth <= 600 ? 'center' : 'flex-start'
              }}
            >
              <div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1B5E20' }}>
                  {profileUser.posts?.length || 0}
                </span>{' '}
                <span style={{ fontSize: '0.85rem', color: '#5F6D67' }}>
                  {t('profile.posts')}
                </span>
              </div>

              <div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1B5E20' }}>
                  {profileUser.followersCount || 0}
                </span>{' '}
                <span style={{ fontSize: '0.85rem', color: '#5F6D67' }}>
                  {t('profile.followers')}
                </span>
              </div>

              <div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1B5E20' }}>
                  {profileUser.followingCount || 0}
                </span>{' '}
                <span style={{ fontSize: '0.85rem', color: '#5F6D67' }}>
                  {t('profile.following')}
                </span>
              </div>
            </div>

            {/* Action buttons when viewing other farmers */}
            {!isOwner && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: window.innerWidth <= 600 ? 'center' : 'flex-start' }}>
                <button
                  onClick={handleFollowToggle}
                  className={profileUser.isFollowing ? 'btn-secondary' : 'btn-primary'}
                >
                  {profileUser.isFollowing ? (
                    <>
                      <UserCheck size={16} />
                      <span>{t('discover.following')}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>{t('discover.follow')}</span>
                    </>
                  )}
                </button>

                <button onClick={handleStartChat} className="btn-secondary">
                  <MessageSquare size={16} color="#2E7D32" />
                  <span>{t('chat.title')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Farmer's Posts Feed */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1B5E20', margin: '1.5rem 0 1rem 0' }}>
        {t('profile.posts')} ({profileUser.posts?.length || 0})
      </h3>

      {profileUser.posts?.length === 0 ? (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: '#8E9B94' }}>
          {t('feed.noPosts')}
        </div>
      ) : (
        profileUser.posts?.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onDeletePost={handleDeletePost}
          />
        ))
      )}

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="modal-overlay" onClick={() => setIsEditOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                borderBottom: '1px solid #E0E7E2',
                paddingBottom: '0.75rem'
              }}
            >
              <h3 style={{ fontWeight: 800, color: '#1B5E20' }}>
                {t('profile.editProfile')}
              </h3>
              <button onClick={() => setIsEditOpen(false)} style={{ background: 'none' }}>
                <X size={20} color="#5F6D67" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">{t('auth.fullName')}</label>
                <input
                  type="text"
                  className="form-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('profile.bio')}</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder={t('profile.bioPlaceholder')}
                  maxLength={500}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">{t('auth.village')}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editVillage}
                    onChange={(e) => setEditVillage(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('auth.district')}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('auth.state')}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('auth.cropsGrown')}</label>
                <input
                  type="text"
                  className="form-input"
                  value={editCrops}
                  onChange={(e) => setEditCrops(e.target.value)}
                  placeholder="e.g. Wheat, Cotton, Soybean"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEditOpen(false)}
                >
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? t('profile.saving') : t('profile.saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
