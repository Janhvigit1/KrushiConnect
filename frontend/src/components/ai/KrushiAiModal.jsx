import React, { useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RefreshCw,
  HelpCircle,
  Sprout
} from 'lucide-react';
import { askAiAssistant, getAiSuggestions } from '../../services/aiService';
import { ThemeContext } from '../../context/ThemeContext';

const KrushiAiModal = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { isDark } = useContext(ThemeContext);

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text:
        i18n.language === 'hi'
          ? 'राम राम किसान भाई! 🙏 मैं आपका **कृषि AI मित्र** हूँ। आप मुझसे किसी भी फसल की बीमारी, जैविक खाद, सिंचाई या सरकारी योजनाओं के बारे में पूछ सकते हैं।'
          : 'Hello Kisan Friend! 🙏 I am your **Krushi AI Assistant**. Ask me anything about crop diseases, pest remedies, organic fertilizers, irrigation, or PM schemes!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      getAiSuggestions()
        .then((data) => setSuggestions(data.suggestions || []))
        .catch((e) => console.warn('Could not load suggestions:', e.message));
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText = inputQuery) => {
    const q = queryText.trim();
    if (!q || loading) return;

    // Add user message to thread
    const userMsg = {
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const data = await askAiAssistant(q, i18n.language || 'hi');
      const aiMsg = {
        sender: 'ai',
        text: data.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        sender: 'ai',
        text:
          i18n.language === 'hi'
            ? 'क्षमा करें, नेटवर्क में समस्या आ रही है। कृपया पुनः प्रयास करें।'
            : 'Sorry, could not connect right now. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Text-to-Speech: Voice readout for farmers
  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown stars/bullets for clean audio
    const cleanText = text.replace(/[*_#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '580px',
          height: '85vh',
          maxHeight: '700px',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chatbot Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #0F5132 100%)',
            color: '#FFFFFF',
            padding: '1.1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255, 255, 255, 0.4)'
              }}
            >
              <Bot size={24} color="#FFF" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                  {i18n.language === 'hi' ? 'कृषि AI मित्र' : 'Krushi AI Assistant'}
                </span>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#4ADE80',
                    display: 'inline-block'
                  }}
                  title="Online"
                />
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                {i18n.language === 'hi'
                  ? 'फसल, कीट-रोग व सरकारी योजनाओं का डिजिटल विशेषज्ञ'
                  : '24/7 Digital Farming, Pest & Schemes Expert'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (isSpeaking) window.speechSynthesis.cancel();
              onClose();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              padding: '6px',
              borderRadius: '50%'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages Stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {messages.map((msg, idx) => {
            const isAi = msg.sender === 'ai';

            return (
              <div
                key={idx}
                style={{
                  alignSelf: isAi ? 'flex-start' : 'flex-end',
                  maxWidth: '86%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div
                  style={{
                    backgroundColor: isAi ? 'var(--bg-surface)' : 'var(--primary-emerald)',
                    color: isAi ? 'var(--text-main)' : '#FFFFFF',
                    padding: '0.85rem 1.1rem',
                    borderRadius: isAi ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                    boxShadow: 'var(--shadow-subtle)',
                    border: isAi ? '1px solid var(--border-light)' : 'none',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line'
                  }}
                >
                  {msg.text}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    alignSelf: isAi ? 'flex-start' : 'flex-end',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    padding: '0 4px'
                  }}
                >
                  <span>{msg.time}</span>

                  {isAi && (
                    <>
                      {/* Copy button */}
                      <button
                        onClick={() => handleCopy(msg.text, idx)}
                        style={{ background: 'none', color: 'var(--text-muted)' }}
                        title="Copy answer"
                      >
                        {copiedIdx === idx ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                      </button>

                      {/* Text-to-speech speaker button */}
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        style={{ background: 'none', color: isSpeaking ? '#059669' : 'var(--text-muted)' }}
                        title={isSpeaking ? 'Stop listening' : 'Listen to answer / आवाज में सुनें'}
                      >
                        {isSpeaking ? <VolumeX size={13} color="#E11D48" /> : <Volume2 size={13} />}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div
              style={{
                alignSelf: 'flex-start',
                backgroundColor: 'var(--bg-surface)',
                padding: '0.75rem 1.1rem',
                borderRadius: '18px 18px 18px 4px',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--primary-emerald)'
              }}
            >
              <RefreshCw size={16} className="spin-animation" />
              <span>
                {i18n.language === 'hi' ? 'कृषि मित्र उत्तर तैयार कर रहा है...' : 'Krushi AI is analyzing farm advice...'}
              </span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {suggestions.length > 0 && (
          <div
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--bg-surface)',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}
          >
            {suggestions.map((s, i) => {
              const text = i18n.language === 'hi' ? s.text_hi : s.text_en;
              return (
                <button
                  key={i}
                  onClick={() => handleSend(text)}
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    color: 'var(--primary-emerald)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '9999px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  🌱 {text}
                </button>
              );
            })}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.85rem 1.15rem',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-light)'
          }}
        >
          <input
            type="text"
            className="form-input"
            placeholder={
              i18n.language === 'hi'
                ? 'फसल, खाद या कीट-रोग का सवाल यहाँ पूछें...'
                : 'Ask any farming, crop or fertilizer question here...'
            }
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              borderRadius: '9999px',
              padding: '0.65rem 1.15rem',
              fontSize: '0.9rem'
            }}
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="btn-primary"
            style={{
              width: '42px',
              height: '42px',
              padding: 0,
              borderRadius: '50%',
              flexShrink: 0
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default KrushiAiModal;
