import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const LoadingOverlay = ({ isVisible, message = "Signing you in..." }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-300 bg-background/80 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card border border-border rounded-2xl shadow-neumorphic-lg p-8 text-center max-w-sm mx-4"
          >
            {/* Loading Animation */}
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center"
              >
                <Icon 
                  name="Loader2" 
                  size={24} 
                  className="text-primary-foreground"
                />
              </motion.div>
            </div>

            {/* Loading Message */}
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              Please wait
            </h3>
            <p className="text-sm font-body text-muted-foreground">
              {message}
            </p>

            {/* Progress Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {[0, 1, 2]?.map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;