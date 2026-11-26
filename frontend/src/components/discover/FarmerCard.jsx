import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, MessageSquare, UserCheck, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { followUser, unfollowUser } from '../../services/userService';
import { getOrCreateConversation } from '../../services/chatService';

const FarmerCard = ({ farmer, onFollowChange }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(farmer.isFollowing || false);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    try {
      setLoading(true);
      if (isFollowing) {
        await unfollowUser(farmer._id);
        setIsFollowing(false);
        if (onFollowChange) onFollowChange(farmer._id, false);
      } else {
        await followUser(farmer._id);
        setIsFollowing(true);
        if (onFollowChange) onFollowChange(farmer._id, true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating follow status');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    try {
      await getOrCreateConversation(farmer._id);
      navigate('/messages');
    } catch (err) {
      alert('Could not start conversation');
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <Link to={`/profile/${farmer._id}`}>
        {farmer.avatar ? (
          <img
            src={farmer.avatar}
            alt={farmer.name}
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2.5px solid #2E7D32',
              marginBottom: '0.75rem'
            }}
          />
        ) : (
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              backgroundColor: '#C8E6C9',
              color: '#1B5E20',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              marginBottom: '0.75rem'
            }}
          >
            {farmer.name ? farmer.name[0].toUpperCase() : '🌾'}
          </div>
        )}
      </Link>

      <Link
        to={`/profile/${farmer._id}`}
        style={{
          fontWeight: 800,
          fontSize: '1.05rem',
          color: '#1C2826',
          marginBottom: '0.2rem'
        }}
      >
        {farmer.name}
      </Link>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.8rem',
          color: '#5F6D67',
          marginBottom: '0.5rem'
        }}
      >
        <MapPin size={13} color="#2E7D32" />
        <span>
          {farmer.village}, {farmer.district}
        </span>
      </div>

      {farmer.distanceKm !== undefined && (
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#2E7D32',
            backgroundColor: '#E8F5E9',
            padding: '2px 8px',
            borderRadius: '9999px',
            marginBottom: '0.75rem'
          }}
        >
          📍 {farmer.distanceKm} {t('discover.km')} {t('discover.distance')}
        </div>
      )}

      {/* Crops Grown */}
      {farmer.crops && farmer.crops.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '4px',
            marginBottom: '1rem'
          }}
        >
          {farmer.crops.slice(0, 3).map((crop, idx) => (
            <span key={idx} className="crop-tag">
              🌱 {crop}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: 'auto' }}>
        <button
          onClick={handleFollowToggle}
          disabled={loading}
          className={isFollowing ? 'btn-secondary' : 'btn-primary'}
          style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
        >
          {isFollowing ? (
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

        <button
          onClick={handleStartChat}
          className="btn-secondary"
          style={{ padding: '0.5rem 0.75rem' }}
          title={t('chat.title')}
        >
          <MessageSquare size={16} color="#2E7D32" />
        </button>
      </div>
    </div>
  );
};

export default FarmerCard;
