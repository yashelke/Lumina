import React from 'react';
import { motion } from 'framer-motion';
import './LogoPage.css';

const AnimatedLogo = () => (
  <motion.div
    className="logo-icon"
    animate={{ rotate: [0, 360] }}
    transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 0 }}
  >
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Outer hexagon ring */}
      <motion.path
        d="M18 2L32 10V26L18 34L4 26V10L18 2Z"
        stroke="url(#gradient1)"
        strokeWidth="2"
        fill="none"
        animate={{
          pathLength: [0, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          pathLength: { duration: 2, repeat: Infinity, ease: 'linear', repeatType: 'loop' },
          opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' },
        }}
        initial={{ pathLength: 0 }}
      />

      {/* Inner circle */}
      <motion.circle
        cx="18"
        cy="18"
        r="8"
        fill="url(#gradient2)"
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
      />

      {/* Center dot */}
      <motion.circle
        cx="18"
        cy="18"
        r="3"
        fill="#fff"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
      />

      <defs>
        <linearGradient id="gradient1" x1="4" y1="2" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00bfff" />
          <stop offset="50%" stopColor="#0080ff" />
          <stop offset="100%" stopColor="#00e5ff" />
        </linearGradient>
        <radialGradient id="gradient2" cx="18" cy="18" r="8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0080ff" stopOpacity="0.3" />
        </radialGradient>
      </defs>
    </svg>
  </motion.div>
);

export default function LogoPage() {
  return (
    <motion.div
      className="logo-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Ambient glow orbs */}
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      <div className="logo-content">
        {/* Animated logo icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <AnimatedLogo />
        </motion.div>

        {/* App name */}
        <motion.h1
          className="logo-title"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
        >
          Lumina.
        </motion.h1>

        {/* Tagline */}
        {/* <motion.p
          className="logo-tagline"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 1.3 }}
        >
          Your intelligent AI companion
        </motion.p> */}

        {/* Progress bar — fills over ~10 seconds */}
        <motion.div className="loading-bar-track">
          <motion.div
            className="loading-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 9.5, ease: 'linear', delay: 0.5 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}