import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { SocketContext } from '../../context/SocketContext';

const ConversationList = ({
  conversations,
  activeConversation,
  onSelectConversation,
  searchQuery,
  onSearchChange
}) => {
  const { t } = useTranslation();
  const { isUserOnline } = useContext(SocketContext);

  const filtered = conversations.filter((c) => {
    const name = c.otherParticipant?.name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E0E7E2'
      }}
    >
      {/* Search Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #E0E7E2' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1B5E20', marginBottom: '0.75rem' }}>
          {t('chat.title')}
        </h2>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            color="#8E9B94"
            style={{ position: 'absolute', left: '10px', top: '10px' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '32px', fontSize: '0.85rem' }}
            placeholder={t('chat.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#8E9B94', fontSize: '0.9rem' }}>
            {t('chat.noConversations')}
          </div>
        ) : (
          filtered.map((conv) => {
            const isOnline = isUserOnline(conv.otherParticipant?._id);
            const isSelected = activeConversation?._id === conv._id;

            return (
              <div
                key={conv._id}
                onClick={() => onSelectConversation(conv)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  borderBottom: '1px solid #F1F8E9',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#E8F5E9' : '#FFFFFF',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {/* Avatar with Online Badge */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  {conv.otherParticipant?.avatar ? (
                    <img
                      src={conv.otherParticipant.avatar}
                      alt={conv.otherParticipant.name}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: '#C8E6C9',
                        color: '#2E7D32',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem'
                      }}
                    >
                      {conv.otherParticipant?.name
                        ? conv.otherParticipant.name[0].toUpperCase()
                        : '🌾'}
                    </div>
                  )}

                  {isOnline && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#4CAF50',
                        borderRadius: '50%',
                        border: '2px solid #FFFFFF'
                      }}
                    />
                  )}
                </div>

                {/* Info & Last Message */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: '2px'
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: '#1C2826',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {conv.otherParticipant?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#8E9B94' }}>
                      {formatTime(conv.lastMessageAt || conv.updatedAt)}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.85rem',
                        color: conv.unreadCount > 0 ? '#1B5E20' : '#5F6D67',
                        fontWeight: conv.unreadCount > 0 ? 700 : 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '180px'
                      }}
                    >
                      {conv.lastMessage?.text || 'Start chatting...'}
                    </div>

                    {conv.unreadCount > 0 && (
                      <span
                        style={{
                          backgroundColor: '#2E7D32',
                          color: '#FFFFFF',
                          borderRadius: '9999px',
                          padding: '2px 7px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                      >
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
