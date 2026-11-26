import React, { useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Video,
  Send,
  Check,
  CheckCheck,
  ArrowLeft
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { CallContext } from '../../context/CallContext';
import { getMessages } from '../../services/chatService';

const ChatWindow = ({ conversation, onBack }) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { socket, isUserOnline } = useContext(SocketContext);
  const { startCall } = useContext(CallContext);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const recipient = conversation?.otherParticipant;
  const isOnline = recipient ? isUserOnline(recipient._id) : false;

  // Load message history
  useEffect(() => {
    if (!conversation) return;

    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const data = await getMessages(conversation._id);
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();

    // Join Socket conversation room
    if (socket) {
      socket.emit('conversation:join', { conversationId: conversation._id });
    }

    return () => {
      if (socket) {
        socket.emit('conversation:leave', { conversationId: conversation._id });
      }
    };
  }, [conversation, socket]);

  // Listen to incoming real-time socket events
  useEffect(() => {
    if (!socket || !conversation) return;

    const handleMessageReceived = (newMessage) => {
      if (newMessage.conversation.toString() === conversation._id.toString()) {
        setMessages((prev) => [...prev, newMessage]);

        // Send read receipt if received from the other party
        if (newMessage.sender._id.toString() !== user._id.toString()) {
          socket.emit('message:read', {
            conversationId: conversation._id,
            messageId: newMessage._id
          });
        }
      }
    };

    const handleTypingStatus = (data) => {
      if (data.conversationId === conversation._id && data.userId !== user._id) {
        setIsTyping(data.isTyping);
        setTypingUser(data.name || '');
      }
    };

    const handleReadReceipt = (data) => {
      if (data.conversationId === conversation._id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId
              ? { ...msg, readAt: data.readAt }
              : msg
          )
        );
      }
    };

    socket.on('message:received', handleMessageReceived);
    socket.on('typing:status', handleTypingStatus);
    socket.on('message:read_receipt', handleReadReceipt);

    return () => {
      socket.off('message:received', handleMessageReceived);
      socket.off('typing:status', handleTypingStatus);
      socket.off('message:read_receipt', handleReadReceipt);
    };
  }, [socket, conversation, user]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    // Typing emission
    if (socket && conversation) {
      socket.emit('typing:start', { conversationId: conversation._id });

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing:stop', { conversationId: conversation._id });
      }, 1500);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socket || !conversation) return;

    const text = inputText.trim();
    setInputText('');

    if (socket) {
      socket.emit('typing:stop', { conversationId: conversation._id });
      socket.emit(
        'message:send',
        { conversationId: conversation._id, text },
        (res) => {
          if (res.error) {
            console.error('Failed to deliver message:', res.error);
          }
        }
      );
    }
  };

  const formatMessageTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!conversation) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F4F7F4',
          color: '#8E9B94',
          padding: '2rem'
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
        <h3 style={{ fontWeight: 700, color: '#1B5E20' }}>{t('chat.title')}</h3>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {t('chat.noConversations')}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#EFEAE2' // WhatsApp style soft background
      }}
    >
      {/* Recipient Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E0E7E2',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{ background: 'none', color: '#1C2826', padding: '4px' }}
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <div style={{ position: 'relative' }}>
            {recipient?.avatar ? (
              <img
                src={recipient.avatar}
                alt={recipient.name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#C8E6C9',
                  color: '#2E7D32',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {recipient?.name ? recipient.name[0].toUpperCase() : '🌾'}
              </div>
            )}
            {isOnline && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#4CAF50',
                  borderRadius: '50%',
                  border: '2px solid #FFFFFF'
                }}
              />
            )}
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1C2826' }}>
              {recipient?.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: isOnline ? '#2E7D32' : '#8E9B94' }}>
              {isOnline ? t('chat.online') : t('chat.offline')} • {recipient?.village},{' '}
              {recipient?.district}
            </div>
          </div>
        </div>

        {/* Audio / Video Calling Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => startCall(recipient, 'audio')}
            className="btn-secondary"
            style={{ padding: '0.45rem 0.75rem', borderRadius: '50%' }}
            title={t('chat.voiceCall')}
          >
            <Phone size={18} color="#2E7D32" />
          </button>

          <button
            onClick={() => startCall(recipient, 'video')}
            className="btn-secondary"
            style={{ padding: '0.45rem 0.75rem', borderRadius: '50%' }}
            title={t('chat.videoCall')}
          >
            <Video size={18} color="#2E7D32" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        {loadingHistory ? (
          <div style={{ textAlign: 'center', color: '#8E9B94', fontSize: '0.85rem' }}>
            {t('common.loading')}
          </div>
        ) : messages.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              margin: 'auto',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              color: '#5F6D67',
              fontSize: '0.85rem'
            }}
          >
            {t('chat.noMessages')}
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender?._id?.toString() === user?._id?.toString();

            return (
              <div
                key={msg._id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '72%',
                  backgroundColor: isMe ? '#D9FDD3' : '#FFFFFF',
                  padding: '0.5rem 0.8rem',
                  borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '0.9rem', color: '#111B21', wordBreak: 'break-word' }}>
                  {msg.text}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '4px',
                    fontSize: '0.65rem',
                    color: '#667781',
                    marginTop: '2px'
                  }}
                >
                  <span>{formatMessageTime(msg.createdAt)}</span>
                  {isMe && (
                    <span>
                      {msg.readAt ? (
                        <CheckCheck size={14} color="#53BDEB" />
                      ) : msg.deliveredAt ? (
                        <CheckCheck size={14} color="#667781" />
                      ) : (
                        <Check size={14} color="#667781" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div
            style={{
              alignSelf: 'flex-start',
              backgroundColor: '#FFFFFF',
              padding: '0.4rem 0.8rem',
              borderRadius: '12px',
              fontSize: '0.8rem',
              color: '#2E7D32',
              fontStyle: 'italic',
              boxShadow: '0 1px 1px rgba(0,0,0,0.08)'
            }}
          >
            {typingUser || recipient?.name} {t('chat.typing')}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <form
        onSubmit={handleSendMessage}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.75rem 1rem',
          backgroundColor: '#F0F2F5',
          borderTop: '1px solid #E0E7E2'
        }}
      >
        <input
          type="text"
          className="form-input"
          placeholder={t('chat.typeMessage')}
          value={inputText}
          onChange={handleInputChange}
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderRadius: '9999px',
            padding: '0.65rem 1rem'
          }}
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: inputText.trim() ? '#2E7D32' : '#C8E6C9',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
