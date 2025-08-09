import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/toaster';
import './App.css';

function AppContent() {
  const { token, isAuthenticated } = store.getState().auth;

  useEffect(() => {
    // Connect to WebSocket when authenticated
    if (isAuthenticated && token) {
      import('./services/socketService').then(({ socketService }) => {
        socketService.connect(token);
      });
    }
  }, [isAuthenticated, token]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<HomePage />} />
            <Route path="chat/:wa_id" element={<ChatPage />} />
          </Route>
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
