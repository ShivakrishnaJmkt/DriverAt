// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import AuthPage from "./AuthPage.jsx";
import AttendancePage from "./AttendancePage.jsx";
import "./App.css";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // 🔹 Restore user after refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("svpayCurrentUser");
    console.log("savedUser:", savedUser);
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("svpayCurrentUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("svpayCurrentUser");
    setCurrentUser(null);
  };

  return (
    <Router>
      <Routes>
        {!currentUser ? (
          <Route
            path="*"
            element={<AuthPage onLoginSuccess={handleLogin} />}
          />
        ) : (
          <Route
            path="*"
            element={
              <AttendancePage
                user={currentUser}
                onLogout={handleLogout}
              />
            }
          />
        )}
      </Routes>
    </Router>
  );
}
