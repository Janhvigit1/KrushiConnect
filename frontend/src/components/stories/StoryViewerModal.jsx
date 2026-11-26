import React, { useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight, Trash2, Eye } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { markStoryViewed, deleteStory } from '../../services/storyService';

const StoryViewerModal = ({ userGroup, onClose, onStoryDeleted }) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const stories = userGroup?.stories || [];
  const currentStory = stories[currentIndex];
  const timerRef = useRef(null);
  const isOwnStory = userGroup?.user?._id.toString() === user?._id.toString();

  useEffect(() => {
    if (!currentStory) return;

    // Mark current story as viewed
    if (!isOwnStory && !currentStory.isViewed) {
      markStoryViewed(currentStory._id).catch((e) =>
        console.warn('Could not record story view:', e.message)
      );
    }

    setProgress(0);
    clearInterval(timerRef.current);

    const stepMs = 50;
    const totalMs = 5000;
    const increment = (stepMs / totalMs) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, currentStory]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    try {
      await deleteStory(currentStory._id);
      if (onStoryDeleted) onStoryDeleted(currentStory._id);
      if (stories.length <= 1) {
        onClose();
      } else {
        handleNext();
      }
    } catch (err) {
      alert('Failed to delete story');
    }
  };

  if (!currentStory) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          maxHeight: '920px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#111111',
          overflow: 'hidden'
        }}
      >
        {/* Progress Bars */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            gap: '4px',
            zIndex: 20
          }}
        >
          {stories.map((s, idx) => (
            <div
              key={s._id}
              style={{
                flex: 1,
                height: '3px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  height: '100%',
                  backgroundColor: '#FFFFFF',
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                  transition: idx === currentIndex ? 'width 0.05s linear' : 'none'
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '14px',
            right: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 20,
            color: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img
              src={userGroup.user.avatar || 'https://via.placeholder.com/40'}
              alt={userGroup.user.name}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #FFFFFF'
              }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {userGroup.user.name}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                {userGroup.user.village}, {userGroup.user.district}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isOwnStory && (
              <button
                onClick={handleDelete}
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  color: '#FF5252',
                  padding: '6px',
                  borderRadius: '50%'
                }}
                title={t('stories.deleteStory')}
              >
                <Trash2 size={18} />
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'rgba(0,0,0,0.5)',
                color: '#FFFFFF',
                padding: '6px',
                borderRadius: '50%'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Media Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {currentStory.mediaType === 'video' ? (
            <video
              src={currentStory.mediaUrl}
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <img
              src={currentStory.mediaUrl}
              alt="Farmer story"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )}

          {/* Left/Right Tap Zones */}
          <div
            onClick={handlePrev}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '35%',
              cursor: 'pointer'
            }}
          />
          <div
            onClick={handleNext}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '35%',
              cursor: 'pointer'
            }}
          />

          {/* Nav buttons */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: '10px',
                background: 'rgba(0,0,0,0.4)',
                color: '#FFFFFF',
                padding: '8px',
                borderRadius: '50%'
              }}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '10px',
              background: 'rgba(0,0,0,0.4)',
              color: '#FFFFFF',
              padding: '8px',
              borderRadius: '50%'
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Caption & View Count */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '16px',
            right: '16px',
            zIndex: 20,
            color: '#FFFFFF',
            textAlign: 'center'
          }}
        >
          {currentStory.caption && (
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                marginBottom: '8px',
                display: 'inline-block',
                maxWidth: '90%'
              }}
            >
              {currentStory.caption}
            </div>
          )}

          {isOwnStory && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                fontSize: '0.8rem',
                opacity: 0.9
              }}
            >
              <Eye size={14} />
              <span>
                {currentStory.viewers?.length || 0} {t('stories.views')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryViewerModal;
