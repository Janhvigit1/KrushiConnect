import React, { useState, useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { CallProvider } from './context/CallContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Header from './components/layout/Header';
import CallModal from './components/call/CallModal';
import CreatePostModal from './components/feed/CreatePostModal';
import KrushiAiModal from './components/ai/KrushiAiModal';

import Home from './pages/Home';
import Discover from './pages/Discover';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

import { Bot, Sparkles } from 'lucide-react';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary-emerald)',
          fontWeight: 700,
          background: 'var(--bg-app)'
        }}
      >
        🌾 KrushiConnect Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main App Layout
const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage || !isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <Navbar
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenAi={() => setIsAiModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <Header onOpenAi={() => setIsAiModalOpen(true)} />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discover"
            element={
              <ProtectedRoute>
                <Discover />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Floating Krushi AI Assistant Button (Bottom Right) */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 80
        }}
      >
        <button
          onClick={() => setIsAiModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #0F5132 100%)',
            color: '#FFFFFF',
            padding: '0.65rem 1.15rem',
            borderRadius: '9999px',
            boxShadow: '0 8px 24px rgba(5, 150, 105, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            fontWeight: 800,
            fontSize: '0.9rem',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          title="Ask Krushi AI / कृषि मित्र से पूछें"
        >
          <Bot size={20} />
          <span>Krushi AI</span>
          <Sparkles size={14} color="#FBBF24" />
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenCreatePost={() => setIsCreatePostOpen(true)} />

      {/* Global WebRTC Voice / Video Call Modal */}
      <CallModal />

      {/* Global Quick Create Post Modal */}
      {isCreatePostOpen && (
        <CreatePostModal
          onClose={() => setIsCreatePostOpen(false)}
          onPostCreated={() => {
            setIsCreatePostOpen(false);
            window.location.href = '/';
          }}
        />
      )}

      {/* Krushi AI Farming Assistant Modal */}
      <KrushiAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <CallProvider>
            <AppContent />
          </CallProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
