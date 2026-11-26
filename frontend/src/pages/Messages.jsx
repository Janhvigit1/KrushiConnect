import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';
import { getConversations } from '../services/chatService';
import { SocketContext } from '../context/SocketContext';

const Messages = () => {
  const { t } = useTranslation();
  const { socket } = useContext(SocketContext);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchConversationsList = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data.conversations || []);
      if (data.conversations?.length > 0 && !activeConversation && window.innerWidth > 768) {
        setActiveConversation(data.conversations[0]);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversationsList();
  }, []);

  // Listen to new conversation updates from socket
  useEffect(() => {
    if (!socket) return;

    const handleConversationUpdated = (data) => {
      fetchConversationsList();
    };

    socket.on('conversation:updated', handleConversationUpdated);

    return () => {
      socket.off('conversation:updated', handleConversationUpdated);
    };
  }, [socket]);

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        height: 'calc(100vh - 120px)',
        minHeight: '540px',
        margin: 0,
        overflow: 'hidden'
      }}
    >
      {/* Sidebar Conversation List (hidden on small screen when viewing active chat) */}
      <div
        style={{
          width: window.innerWidth <= 768 && activeConversation ? '0%' : '320px',
          display: window.innerWidth <= 768 && activeConversation ? 'none' : 'block',
          height: '100%',
          flexShrink: 0
        }}
      >
        <ConversationList
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={(conv) => setActiveConversation(conv)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Chat Window */}
      <div
        style={{
          flex: 1,
          display:
            window.innerWidth <= 768 && !activeConversation ? 'none' : 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <ChatWindow
          conversation={activeConversation}
          onBack={
            window.innerWidth <= 768
              ? () => setActiveConversation(null)
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default Messages;
