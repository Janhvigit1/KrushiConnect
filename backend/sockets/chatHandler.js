import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

export const registerChatHandlers = (io, socket, onlineUsers) => {
  const userId = socket.user._id.toString();

  // Join a specific conversation room
  socket.on('conversation:join', async ({ conversationId }) => {
    try {
      const conv = await Conversation.findById(conversationId);
      if (!conv) return;

      const isParticipant = conv.participants.some(
        (p) => p.toString() === userId
      );

      if (isParticipant) {
        socket.join(conversationId);
      }
    } catch (err) {
      console.error('Error joining conversation:', err.message);
    }
  });

  // Leave conversation room
  socket.on('conversation:leave', ({ conversationId }) => {
    socket.leave(conversationId);
  });

  // Send message
  socket.on('message:send', async ({ conversationId, text }, callback) => {
    try {
      if (!text || text.trim().length === 0) {
        if (callback) callback({ error: 'Text cannot be empty' });
        return;
      }

      const conv = await Conversation.findById(conversationId);
      if (!conv) {
        if (callback) callback({ error: 'Conversation not found' });
        return;
      }

      const isParticipant = conv.participants.some(
        (p) => p.toString() === userId
      );
      if (!isParticipant) {
        if (callback) callback({ error: 'Unauthorized participant' });
        return;
      }

      // Create message in database
      const message = await Message.create({
        conversation: conversationId,
        sender: socket.user._id,
        text: text.trim(),
        deliveredAt: new Date()
      });

      // Update last message on conversation
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        lastMessageAt: new Date()
      });

      const populatedMessage = await Message.findById(message._id).populate(
        'sender',
        'name avatar'
      );

      // Emit to everyone in the conversation room
      io.to(conversationId).emit('message:received', populatedMessage);

      // Notify recipient's private user room for unread badges and notifications
      const recipientId = conv.participants
        .find((p) => p.toString() !== userId)
        ?.toString();

      if (recipientId) {
        io.to(`user:${recipientId}`).emit('conversation:updated', {
          conversationId,
          lastMessage: populatedMessage,
          unread: true
        });
      }

      if (callback) callback({ success: true, message: populatedMessage });
    } catch (err) {
      console.error('Error sending message:', err.message);
      if (callback) callback({ error: err.message });
    }
  });

  // Typing indicators
  socket.on('typing:start', ({ conversationId }) => {
    socket.to(conversationId).emit('typing:status', {
      conversationId,
      userId,
      name: socket.user.name,
      isTyping: true
    });
  });

  socket.on('typing:stop', ({ conversationId }) => {
    socket.to(conversationId).emit('typing:status', {
      conversationId,
      userId,
      isTyping: false
    });
  });

  // Message read receipt
  socket.on('message:read', async ({ conversationId, messageId }) => {
    try {
      await Message.findByIdAndUpdate(messageId, { readAt: new Date() });
      socket.to(conversationId).emit('message:read_receipt', {
        conversationId,
        messageId,
        readBy: userId,
        readAt: new Date()
      });
    } catch (err) {
      console.error('Error updating read status:', err.message);
    }
  });
};
