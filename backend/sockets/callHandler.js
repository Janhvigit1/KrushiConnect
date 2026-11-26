import Call from '../models/Call.js';

export const registerCallHandlers = (io, socket, activeCalls) => {
  const currentUserId = socket.user._id.toString();

  // Initiate call
  socket.on('call:initiate', async ({ receiverId, callType }, callback) => {
    try {
      if (!receiverId || receiverId === currentUserId) {
        if (callback) callback({ error: 'Invalid call recipient' });
        return;
      }

      // Create initial call record in database
      const call = await Call.create({
        caller: currentUserId,
        receiver: receiverId,
        callType: callType || 'audio',
        status: 'calling',
        startedAt: new Date()
      });

      const callData = {
        callId: call._id.toString(),
        caller: {
          _id: currentUserId,
          name: socket.user.name,
          avatar: socket.user.avatar,
          village: socket.user.village,
          district: socket.user.district
        },
        receiverId,
        callType: callType || 'audio'
      };

      activeCalls.set(call._id.toString(), {
        ...callData,
        startTime: Date.now()
      });

      // Ring receiver's room
      io.to(`user:${receiverId}`).emit('call:incoming', callData);

      if (callback) callback({ success: true, callId: call._id.toString() });
    } catch (err) {
      console.error('Error initiating call:', err.message);
      if (callback) callback({ error: err.message });
    }
  });

  // Accept call
  socket.on('call:accept', async ({ callId, callerId }) => {
    try {
      await Call.findByIdAndUpdate(callId, { status: 'accepted' });
      io.to(`user:${callerId}`).emit('call:accepted', {
        callId,
        acceptedBy: currentUserId
      });
    } catch (err) {
      console.error('Error accepting call:', err.message);
    }
  });

  // Reject call
  socket.on('call:reject', async ({ callId, callerId }) => {
    try {
      await Call.findByIdAndUpdate(callId, {
        status: 'rejected',
        endedAt: new Date()
      });
      activeCalls.delete(callId);

      io.to(`user:${callerId}`).emit('call:rejected', {
        callId,
        rejectedBy: currentUserId
      });
    } catch (err) {
      console.error('Error rejecting call:', err.message);
    }
  });

  // End call
  socket.on('call:end', async ({ callId, peerId }) => {
    try {
      const activeCall = activeCalls.get(callId);
      let duration = 0;
      if (activeCall && activeCall.startTime) {
        duration = Math.round((Date.now() - activeCall.startTime) / 1000);
      }

      await Call.findByIdAndUpdate(callId, {
        status: 'ended',
        endedAt: new Date(),
        duration
      });

      activeCalls.delete(callId);

      if (peerId) {
        io.to(`user:${peerId}`).emit('call:ended', {
          callId,
          endedBy: currentUserId,
          duration
        });
      }
    } catch (err) {
      console.error('Error ending call:', err.message);
    }
  });

  // WebRTC Signaling: Offer
  socket.on('webrtc:offer', ({ receiverId, offer, callId }) => {
    io.to(`user:${receiverId}`).emit('webrtc:offer', {
      callerId: currentUserId,
      offer,
      callId
    });
  });

  // WebRTC Signaling: Answer
  socket.on('webrtc:answer', ({ callerId, answer, callId }) => {
    io.to(`user:${callerId}`).emit('webrtc:answer', {
      responderId: currentUserId,
      answer,
      callId
    });
  });

  // WebRTC Signaling: ICE Candidate
  socket.on('webrtc:ice_candidate', ({ targetUserId, candidate, callId }) => {
    io.to(`user:${targetUserId}`).emit('webrtc:ice_candidate', {
      senderId: currentUserId,
      candidate,
      callId
    });
  });
};
