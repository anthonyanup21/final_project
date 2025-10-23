import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import Settings from "./pages/Settings";
import useAuthStore from "./store/authStore";
import StegoDecode from "./pages/StegoDecode";

const App = () => {
  const { user, checkAuth, isCheckingAuth,onlineUsers } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Wait until auth check finishes
  if (isCheckingAuth && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }
  console.log(onlineUsers)

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!user ? <SignupPage /> : <Navigate to="/" replace />}
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/settings"
          element={user ? <Settings /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/decode"
          element={<StegoDecode />}
        />
      </Routes>
    </div>
  );
};

export default App;
