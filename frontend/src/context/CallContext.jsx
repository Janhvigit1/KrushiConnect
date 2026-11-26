import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from './SocketContext';
import { AuthContext } from './AuthContext';
import { getIceServers, logCall } from '../services/callService';

export const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  const [callState, setCallState] = useState('idle'); // idle, calling, ringing, connected, ended
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const timerRef = useRef(null);
  const callDurationRef = useRef(0);

  // Initialize Socket Call listeners
  useEffect(() => {
    if (!socket) return;

    // Incoming Call event
    socket.on('call:incoming', (data) => {
      setIncomingCall(data);
      setCallState('ringing');
    });

    // Call Accepted
    socket.on('call:accepted', async ({ callId, acceptedBy }) => {
      setCallState('connected');
      startDurationTimer();

      // Create WebRTC Offer
      try {
        const iceData = await getIceServers();
        const pc = createPeerConnection(iceData.iceServers, acceptedBy, callId);

        // Add local tracks
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => {
            pc.addTrack(track, localStreamRef.current);
          });
        }

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit('webrtc:offer', {
          receiverId: acceptedBy,
          offer,
          callId
        });
      } catch (err) {
        console.error('Error creating WebRTC offer:', err);
      }
    });

    // Call Rejected
    socket.on('call:rejected', () => {
      setCallState('ended');
      cleanupCall();
      setTimeout(() => setCallState('idle'), 2500);
    });

    // Call Ended
    socket.on('call:ended', () => {
      setCallState('ended');
      cleanupCall();
      setTimeout(() => setCallState('idle'), 2500);
    });

    // WebRTC Offer received (by the callee)
    socket.on('webrtc:offer', async ({ callerId, offer, callId }) => {
      try {
        const iceData = await getIceServers();
        const pc = createPeerConnection(iceData.iceServers, callerId, callId);

        // Callee adds local tracks
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => {
            pc.addTrack(track, localStreamRef.current);
          });
        }

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('webrtc:answer', {
          callerId,
          answer,
          callId
        });
      } catch (err) {
        console.error('Error handling WebRTC offer:', err);
      }
    });

    // WebRTC Answer received (by the caller)
    socket.on('webrtc:answer', async ({ responderId, answer }) => {
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        }
      } catch (err) {
        console.error('Error setting remote description from answer:', err);
      }
    });

    // WebRTC ICE Candidate received
    socket.on('webrtc:ice_candidate', async ({ candidate }) => {
      try {
        if (peerConnectionRef.current && candidate) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error('Error adding received ICE candidate:', err);
      }
    });

    return () => {
      socket.off('call:incoming');
      socket.off('call:accepted');
      socket.off('call:rejected');
      socket.off('call:ended');
      socket.off('webrtc:offer');
      socket.off('webrtc:answer');
      socket.off('webrtc:ice_candidate');
    };
  }, [socket]);

  // Create RTCPeerConnection helper
  const createPeerConnection = (iceServers, peerId, callId) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection({ iceServers });

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('webrtc:ice_candidate', {
          targetUserId: peerId,
          candidate: event.candidate,
          callId
        });
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const startDurationTimer = () => {
    clearInterval(timerRef.current);
    callDurationRef.current = 0;
    setCallDuration(0);
    timerRef.current = setInterval(() => {
      callDurationRef.current += 1;
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  // Initiate a call
  const startCall = async (receiver, callType = 'audio') => {
    try {
      setCallState('calling');
      setActiveCall({
        peer: receiver,
        callType
      });

      // Acquire User Media
      const constraints = {
        audio: true,
        video: callType === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      localStreamRef.current = stream;

      socket.emit(
        'call:initiate',
        { receiverId: receiver._id, callType },
        (res) => {
          if (res.error) {
            alert(res.error);
            cleanupCall();
            setCallState('idle');
          } else {
            setActiveCall((prev) => ({ ...prev, callId: res.callId }));
          }
        }
      );
    } catch (err) {
      console.error('Error accessing audio/video hardware:', err);
      alert('Could not access microphone/camera. Please verify permissions.');
      cleanupCall();
      setCallState('idle');
    }
  };

  // Accept incoming call
  const acceptCall = async () => {
    if (!incomingCall) return;

    try {
      setCallState('connected');
      setActiveCall({
        peer: incomingCall.caller,
        callType: incomingCall.callType,
        callId: incomingCall.callId
      });

      const constraints = {
        audio: true,
        video: incomingCall.callType === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      localStreamRef.current = stream;

      startDurationTimer();

      socket.emit('call:accept', {
        callId: incomingCall.callId,
        callerId: incomingCall.caller._id
      });

      setIncomingCall(null);
    } catch (err) {
      console.error('Error answering call:', err);
      rejectCall();
    }
  };

  // Reject incoming call
  const rejectCall = () => {
    if (incomingCall) {
      socket.emit('call:reject', {
        callId: incomingCall.callId,
        callerId: incomingCall.caller._id
      });
      setIncomingCall(null);
      setCallState('idle');
    }
  };

  // End active call
  const endCall = () => {
    const callId = activeCall?.callId || incomingCall?.callId;
    const peerId = activeCall?.peer?._id || incomingCall?.caller?._id;

    if (socket && callId) {
      socket.emit('call:end', { callId, peerId });
    }

    if (activeCall && activeCall.peer) {
      logCall({
        receiverId: activeCall.peer._id,
        callType: activeCall.callType,
        status: 'ended',
        duration: callDurationRef.current
      }).catch((e) => console.warn('Could not log call:', e.message));
    }

    setCallState('ended');
    cleanupCall();
    setTimeout(() => setCallState('idle'), 1500);
  };

  const cleanupCall = () => {
    clearInterval(timerRef.current);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    setActiveCall(null);
    setIncomingCall(null);
    setIsMuted(false);
    setIsVideoDisabled(false);
    setCallDuration(0);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoDisabled(!videoTrack.enabled);
      }
    }
  };

  return (
    <CallContext.Provider
      value={{
        callState,
        incomingCall,
        activeCall,
        localStream,
        remoteStream,
        isMuted,
        isVideoDisabled,
        callDuration,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
