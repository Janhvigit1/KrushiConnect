import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const StoriesBar = ({ usersWithStories = [], onSelectUserStories, onOpenCreateStory }) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  // Check if current user has active stories
  const currentUserStoryGroup = usersWithStories.find(
    (g) => g.user._id.toString() === user?._id.toString()
  );

  return (
    <div className="stories-container">
      {/* Current User Add / View Story Item */}
      <div className="story-item" onClick={currentUserStoryGroup ? () => onSelectUserStories(currentUserStoryGroup) : onOpenCreateStory}>
        <div style={{ position: 'relative' }}>
          <div
            className={`story-avatar-ring ${
              currentUserStoryGroup
                ? currentUserStoryGroup.hasUnviewed
                  ? ''
                  : 'viewed'
                : ''
            }`}
            style={{
              background: currentUserStoryGroup ? undefined : '#E0E7E2'
            }}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="story-avatar" />
            ) : (
              <div
                className="story-avatar"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: '#2E7D32',
                  fontSize: '1.1rem'
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : '🌾'}
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenCreateStory();
            }}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: '#2E7D32',
              color: '#FFFFFF',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #FFFFFF'
            }}
            title={t('stories.newStory')}
          >
            <Plus size={14} strokeWidth={3} />
          </button>
        </div>
        <span className="story-username">{t('stories.addStory')}</span>
      </div>

      {/* Other Farmers' Stories */}
      {usersWithStories
        .filter((g) => g.user._id.toString() !== user?._id.toString())
        .map((group) => (
          <div
            key={group.user._id}
            className="story-item"
            onClick={() => onSelectUserStories(group)}
          >
            <div
              className={`story-avatar-ring ${
                group.hasUnviewed ? '' : 'viewed'
              }`}
            >
              {group.user.avatar ? (
                <img
                  src={group.user.avatar}
                  alt={group.user.name}
                  className="story-avatar"
                />
              ) : (
                <div
                  className="story-avatar"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#2E7D32',
                    fontSize: '1.1rem'
                  }}
                >
                  {group.user.name[0].toUpperCase()}
                </div>
              )}
            </div>
            <span className="story-username">{group.user.name.split(' ')[0]}</span>
          </div>
        ))}
    </div>
  );
};

export default StoriesBar;
