// src/AuthPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const AuthPage = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Demo users
  const demoUsers = {
    driver1: { pwd: "123", role: "driver", name: "Driver One", empId: "driver1" },
    ravi: { pwd: "1234", role: "driver", name: "Ravi", empId: "ravi" },
    admin: { pwd: "admin", role: "admin", name: "Admin", empId: "admin" },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedUser = username.trim();
    const trimmedPwd = password.trim();

    if (!trimmedUser || !trimmedPwd) {
      setError("Please enter username and password.");
      return;
    }

    // SIGNUP FLOW
    if (isSignup) {
      const users = JSON.parse(localStorage.getItem("credixUsers") || "[]");

      if (users.find((u) => u.username === trimmedUser)) {
        setError("User already exists");
        return;
      }

      const newUser = {
        username: trimmedUser,
        password: trimmedPwd,
        role: "driver",
        name: trimmedUser,
        // ✅ Stable employee id: use username, not password
        empId: trimmedUser,
      };

      users.push(newUser);
      localStorage.setItem("credixUsers", JSON.stringify(users));

      setError("Signup success! Please login.");
      setIsSignup(false);
      setPassword("");
      return;
    }

    // LOGIN FLOW
    const savedUsers = JSON.parse(localStorage.getItem("credixUsers") || "[]");
    const localUser = savedUsers.find(
      (u) => u.username === trimmedUser && u.password === trimmedPwd
    );
    const demoUser = demoUsers[trimmedUser];

    let user = null;

    if (demoUser && demoUser.pwd === trimmedPwd) {
      // ✅ demo user with stable empId
      user = {
        username: trimmedUser,
        password: trimmedPwd,
        role: demoUser.role,
        name: demoUser.name,
        empId: demoUser.empId,
      };
    } else if (localUser) {
      user = localUser;
    }

    if (user) {
      const userData = { ...user, loggedIn: true };
      // ✅ Login state persistence for App.jsx
      localStorage.setItem("svpayCurrentUser", JSON.stringify(userData));
      onLoginSuccess(userData);
      navigate("/"); // or "/attendance" if you use routes
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="auth-page-root">
      <div className="auth-gradient-bg" />

      <div className="auth-shell">
        <div className="auth-brand-side">
          <div className="auth-logo-circle">SV</div>
          <h1 className="auth-title">SVPAY</h1>
          <p className="auth-subtitle">
            Smart attendance & salary tracking for your drivers.
          </p>
          <div className="auth-highlight-card">
            <span>✅</span>
            <div>
              <div className="auth-highlight-title">Secure & persistent</div>
              <div className="auth-highlight-text">
                Your attendance data stays safe even after logout and refresh.
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-side">
          <form className="auth-card" onSubmit={handleSubmit}>
            <h2 className="auth-card-title">
              {isSignup ? "Create driver account" : "Welcome back"}
            </h2>
            <p className="auth-card-subtitle">
              {isSignup
                ? "Sign up once and start tracking your duties."
                : "Login to view and manage your monthly attendance."}
            </p>

            <div className="auth-input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="e.g. driver1 or ravi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Employee ID / password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-primary-btn">
              {isSignup ? "Sign up" : "Log in"}
            </button>

            <div className="auth-toggle-row">
              <span>
                {isSignup ? "Already have an account?" : "New here?"}
              </span>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError("");
                }}
              >
                {isSignup ? "Log in" : "Create account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
