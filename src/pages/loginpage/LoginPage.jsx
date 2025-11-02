import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import AuthBackground from '../authentication/components/AuthBackground';
import WelcomeHeader from '../authentication/components/WelcomeHeader';
import LoadingOverlay from '../authentication/components/LoadingOverlay';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, currentUser, loading: authLoading } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate('/main-dashboard', { replace: true });
    }
  }, [currentUser, authLoading, navigate]);

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    setError(null);
    setShowError(false);

    try {
      await signInWithGoogle();
      // Navigation will happen automatically via useEffect when currentUser changes
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Handle different error types
      let errorMessage = 'Failed to sign in. Please try again.';
      
      if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups for this site and try again.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in cancelled. Please try again when ready.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email. Please use a different sign-in method.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setShowError(true);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Auto-hide error after 5 seconds
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  // Don't show login page while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AuthBackground>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <WelcomeHeader isLogin={true} />

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 space-y-3"
          >
            {[
              { icon: 'Brain', text: 'AI-Powered Wellness Support' },
              { icon: 'Heart', text: 'Personalized Mental Health Journey' },
              { icon: 'Shield', text: 'Private & Secure' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name={feature.icon} size={14} className="text-primary" />
                </div>
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Google Sign In Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            <Button
              onClick={handleGoogleSignIn}
              disabled={isAuthenticating}
              className="w-full h-14 text-base font-medium shadow-neumorphic-md hover:shadow-neumorphic-lg transition-all duration-300 group relative overflow-hidden"
              variant="default"
            >
              <motion.div
                className="flex items-center justify-center gap-3"
                whileTap={{ scale: 0.98 }}
              >
                {isAuthenticating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Icon name="Loader2" size={20} className="text-primary-foreground" />
                    </motion.div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    {/* Google Icon */}
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </motion.div>

              {/* Button hover effect */}
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </Button>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {showError && error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                  <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive mb-1">Sign-in Failed</p>
                    <p className="text-xs text-muted-foreground">{error}</p>
                  </div>
                  <button
                    onClick={() => setShowError(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to MintAI's{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </motion.div>

          {/* Decorative Bottom Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 flex justify-center"
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </motion.div>
        </motion.div>
      </AuthBackground>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={isAuthenticating}
        message="Signing you in with Google..."
      />
    </>
  );
};

export default LoginPage;
