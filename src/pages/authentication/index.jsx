import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthBackground from './components/AuthBackground';
import WelcomeHeader from './components/WelcomeHeader';
import AuthForm from './components/AuthForm';
import LoadingOverlay from './components/LoadingOverlay';

const Authentication = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const savedUser = localStorage.getItem('mintai_user');
    if (savedUser) {
      navigate('/main-dashboard', { replace: true });
    }
  }, [navigate]);

  const handleAuthenticate = async (userData) => {
    setIsAuthenticating(true);
    
    try {
      // Save user data to localStorage
      localStorage.setItem('mintai_user', JSON.stringify(userData));
      localStorage.setItem('mintai_auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('mintai_login_timestamp', new Date()?.toISOString());

      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to dashboard
      navigate('/main-dashboard', { replace: true });
    } catch (error) {
      console.error('Authentication error:', error);
      setIsAuthenticating(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <AuthBackground>
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <WelcomeHeader isLogin={isLogin} />
            <AuthForm
              isLogin={isLogin}
              onAuthenticate={handleAuthenticate}
              onToggleMode={handleToggleMode}
            />
          </motion.div>
        </AnimatePresence>
      </AuthBackground>
      <LoadingOverlay
        isVisible={isAuthenticating}
        message={isLogin ? "Signing you in..." : "Creating your account..."}
      />
    </>
  );
};

export default Authentication;