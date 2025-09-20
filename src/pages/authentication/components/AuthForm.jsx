import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';


const AuthForm = ({ onAuthenticate, onToggleMode, isLogin = true }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const mockCredentials = {
    email: 'user@mintai.com',
    password: 'wellness123'
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData?.displayName) {
        newErrors.displayName = 'Display name is required';
      }

      if (!formData?.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData?.acceptTerms) {
        newErrors.acceptTerms = 'Please accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isLogin) {
        // Check mock credentials for login
        if (formData?.email === mockCredentials?.email && formData?.password === mockCredentials?.password) {
          const userData = {
            id: '1',
            email: formData?.email,
            name: 'Wellness User',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            joinedDate: new Date()?.toISOString(),
            preferences: {
              theme: 'light',
              notifications: true,
              autoRotate: true
            }
          };
          onAuthenticate(userData);
        } else {
          setErrors({
            general: `Invalid credentials. Use ${mockCredentials?.email} / ${mockCredentials?.password}`
          });
        }
      } else {
        // Registration success
        const userData = {
          id: '1',
          email: formData?.email,
          name: formData?.displayName,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
          joinedDate: new Date()?.toISOString(),
          preferences: {
            theme: 'light',
            notifications: true,
            autoRotate: true
          }
        };
        onAuthenticate(userData);
      }
    } catch (error) {
      setErrors({
        general: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setIsLoading(true);
    
    try {
      // Simulate social auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: '1',
        email: `user@${provider}.com`,
        name: `${provider} User`,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        joinedDate: new Date()?.toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          autoRotate: true
        }
      };
      onAuthenticate(userData);
    } catch (error) {
      setErrors({
        general: 'Social authentication failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display Name (Registration only) */}
        {!isLogin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Input
              label="Display Name"
              type="text"
              placeholder="How should we call you?"
              value={formData?.displayName}
              onChange={(e) => handleInputChange('displayName', e?.target?.value)}
              error={errors?.displayName}
              required={!isLogin}
              className="mb-4"
            />
          </motion.div>
        )}

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
        />

        {/* Password */}
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={(e) => handleInputChange('password', e?.target?.value)}
          error={errors?.password}
          required
        />

        {/* Confirm Password (Registration only) */}
        {!isLogin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData?.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
              error={errors?.confirmPassword}
              required={!isLogin}
              className="mb-4"
            />
          </motion.div>
        )}

        {/* Terms Acceptance (Registration only) */}
        {!isLogin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <Checkbox
              label="I agree to the Terms of Service and Privacy Policy"
              checked={formData?.acceptTerms}
              onChange={(e) => handleInputChange('acceptTerms', e?.target?.checked)}
              error={errors?.acceptTerms}
              required={!isLogin}
            />
          </motion.div>
        )}

        {/* General Error */}
        {errors?.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-error/10 border border-error/20 rounded-lg"
          >
            <p className="text-sm text-error font-body">{errors?.general}</p>
          </motion.div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          iconName={isLogin ? "LogIn" : "UserPlus"}
          iconPosition="left"
          className="mt-6"
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </Button>

        {/* Toggle Mode */}
        <div className="text-center">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-sm font-body text-muted-foreground hover:text-primary transition-spring"
          >
            {isLogin ? "New here? Create Account" : "Already have an account? Sign In"}
          </button>
        </div>

        {/* Social Authentication */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground font-caption">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialAuth('google')}
            disabled={isLoading}
            iconName="Chrome"
            iconPosition="left"
            iconSize={18}
          >
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialAuth('apple')}
            disabled={isLoading}
            iconName="Apple"
            iconPosition="left"
            iconSize={18}
          >
            Apple
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AuthForm;