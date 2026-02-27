import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import LogoPage from "./pages/LogoPage";
import StudioPage from "./pages/StudioPage.jsx";
import { UserData } from "./context/UserContext";

// Minimum time (ms) the splash screen is shown
const SPLASH_DURATION = 3000;

// Key used to remember that the splash has already played this session
const SPLASH_SEEN_KEY = "lumina_splash_seen";

const App = () => {
  const { isAuth, loading } = UserData();

  // Skip splash entirely if it has already played in this browser session
  const alreadySeen = sessionStorage.getItem(SPLASH_SEEN_KEY) === "1";

  // true  → splash is currently visible
  // false → splash has finished; show main app
  const [showSplash, setShowSplash] = useState(!alreadySeen);
  const [splashTimerDone, setSplashTimerDone] = useState(alreadySeen);

  // Start the countdown only when we actually need to show the splash
  useEffect(() => {
    if (alreadySeen) return;
    const timer = setTimeout(() => setSplashTimerDone(true), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // Hide the splash only after BOTH the timer AND the user-fetch are done
  useEffect(() => {
    if (splashTimerDone && !loading) {
      // Mark as seen so future refreshes skip the splash
      sessionStorage.setItem(SPLASH_SEEN_KEY, "1");
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
            <Route path="/studio" element={<StudioPage />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;

