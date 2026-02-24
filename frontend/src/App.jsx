import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import LogoPage from "./pages/LogoPage";
import { UserData } from "./context/UserContext";

// Minimum time (ms) the splash screen is shown
const SPLASH_DURATION = 10500;

const App = () => {
  const { isAuth, loading } = UserData();

  // true  → splash is currently visible
  // false → splash has finished; show main app
  const [showSplash, setShowSplash] = useState(true);
  const [splashTimerDone, setSplashTimerDone] = useState(false);

  // Start the 10.5-second countdown once on mount
  useEffect(() => {
    const timer = setTimeout(() => setSplashTimerDone(true), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // Hide the splash only after BOTH the timer AND the user-fetch are done
  useEffect(() => {
    if (splashTimerDone && !loading) {
      // Small buffer so the exit animation can play before unmounting
      const exitBuffer = setTimeout(() => setShowSplash(false), 600);
      return () => clearTimeout(exitBuffer);
    }
  }, [splashTimerDone, loading]);

  return (
    <>
      {/* AnimatePresence drives the logo-page exit fade */}
      <AnimatePresence mode="wait">
        {showSplash && <LogoPage key="splash" />}
      </AnimatePresence>

      {/* Main app — rendered (but invisible) behind the splash, then takes over */}
      {!showSplash && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isAuth ? <Home /> : <Login />} />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;

