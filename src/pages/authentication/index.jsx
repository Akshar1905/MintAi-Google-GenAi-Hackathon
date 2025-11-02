import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import AuthBackground from './components/AuthBackground';
import WelcomeHeader from './components/WelcomeHeader';
import LoadingOverlay from './components/LoadingOverlay';

const Authentication = () => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      await signInWithGoogle();
      navigate('/main-dashboard', { replace: true });
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <>
      <AuthBackground>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <WelcomeHeader />
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-gray-700 py-3 px-6 rounded-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-shadow"
          >
            <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </motion.div>
      </AuthBackground>
      <LoadingOverlay
        isVisible={isAuthenticating}
        message="Signing in with Google..."
      />
    </>
  );
};

export default Authentication;