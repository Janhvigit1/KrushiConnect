import React, { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff
} from 'lucide-react';
import { CallContext } from '../../context/CallContext';

const CallModal = () => {
  const { t } = useTranslation();
  const {
    callState,
    incomingCall,
    activeCall,
    localStream,
    remoteStream,
    isMuted,
    isVideoDisabled,
    callDuration,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo
  } = useContext(CallContext);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Bind media streams to HTML5 video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callState]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, callState]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Case 1: Incoming Call Notification (Ringing on receiver side)
  if (callState === 'ringing' && incomingCall) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
          padding: '1.25rem',
          zIndex: 200,
          border: '2px solid #2E7D32',
          maxWidth: '320px',
          width: '90%'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#C8E6C9',
              color: '#1B5E20',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}
          >
            {incomingCall.caller?.name ? incomingCall.caller.name[0].toUpperCase() : '🌾'}
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1C2826' }}>
              {incomingCall.caller?.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#2E7D32', fontWeight: 600 }}>
              {incomingCall.callType === 'video'
                ? t('call.incomingVideo')
                : t('call.incomingVoice')}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={acceptCall}
            style={{
              flex: 1,
              backgroundColor: '#2E7D32',
              color: '#FFFFFF',
              padding: '0.6rem',
              borderRadius: '10px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Phone size={18} />
            <span>{t('call.accept')}</span>
          </button>

          <button
            onClick={rejectCall}
            style={{
              flex: 1,
              backgroundColor: '#E53935',
              color: '#FFFFFF',
              padding: '0.6rem',
              borderRadius: '10px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <PhoneOff size={18} />
            <span>{t('call.reject')}</span>
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Outgoing Call (Calling / Ringing on caller side)
  if (callState === 'calling' && activeCall) {
    return (
      <div className="modal-overlay">
        <div
          className="modal-content"
          style={{
            textAlign: 'center',
            backgroundColor: '#1E2D24',
            color: '#FFFFFF',
            maxWidth: '380px',
            padding: '2.5rem 1.5rem'
          }}
        >
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: '#2E7D32',
              margin: '0 auto 1.25rem auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              border: '3px solid #81C784'
            }}
          >
            {activeCall.peer?.name ? activeCall.peer.name[0].toUpperCase() : '🌾'}
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            {activeCall.peer?.name}
          </h3>
          <p style={{ color: '#A5D6A7', fontSize: '0.9rem', marginBottom: '2rem' }}>
            {t('call.calling')}
          </p>

          <button
            onClick={endCall}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#E53935',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}
          >
            <PhoneOff size={26} />
          </button>
        </div>
      </div>
    );
  }

  // Case 3: Connected Active Call (Voice or Video)
  if (callState === 'connected' && activeCall) {
    const isVideoCall = activeCall.callType === 'video';

    return (
      <div className="modal-overlay">
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: isVideoCall ? '800px' : '420px',
            height: isVideoCall ? '85vh' : 'auto',
            maxHeight: '650px',
            backgroundColor: '#1A231E',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}
        >
          {/* Video Streams Container */}
          {isVideoCall ? (
            <div style={{ flex: 1, position: 'relative', backgroundColor: '#000000' }}>
              {/* Remote full video */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Local PiP video preview */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '140px',
                  height: '190px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid #FFFFFF',
                  backgroundColor: '#263238',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}
              >
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          ) : (
            /* Voice Call Screen */
            <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: '#FFFFFF' }}>
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#2E7D32',
                  margin: '0 auto 1.5rem auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.8rem',
                  border: '4px solid #81C784',
                  boxShadow: '0 0 25px rgba(46, 125, 50, 0.5)'
                }}
              >
                {activeCall.peer?.name ? activeCall.peer.name[0].toUpperCase() : '🌾'}
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                {activeCall.peer?.name}
              </h3>
              <p style={{ color: '#81C784', fontWeight: 700, fontSize: '1.1rem' }}>
                {formatDuration(callDuration)}
              </p>
            </div>
          )}

          {/* Call Controls Bar */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'rgba(26, 35, 30, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem'
            }}
          >
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: isMuted ? '#E53935' : 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={isMuted ? t('call.unmute') : t('call.mute')}
            >
              {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            {/* Camera Toggle Button (for video call) */}
            {isVideoCall && (
              <button
                onClick={toggleVideo}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: isVideoDisabled ? '#E53935' : 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={isVideoDisabled ? t('call.cameraOn') : t('call.cameraOff')}
              >
                {isVideoDisabled ? <VideoOff size={22} /> : <Video size={22} />}
              </button>
            )}

            {/* End Call Button */}
            <button
              onClick={endCall}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#E53935',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={t('call.endCall')}
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 4: Call Ended Notification
  if (callState === 'ended') {
    return (
      <div className="modal-overlay">
        <div
          className="modal-content"
          style={{
            textAlign: 'center',
            backgroundColor: '#1E2D24',
            color: '#FFFFFF',
            maxWidth: '300px',
            padding: '2rem'
          }}
        >
          <PhoneOff size={36} color="#E53935" style={{ margin: '0 auto 1rem auto' }} />
          <h4>{t('call.callEnded')}</h4>
        </div>
      </div>
    );
  }

  return null;
};

export default CallModal;
