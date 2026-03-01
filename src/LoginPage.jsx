// LoginPage.jsx
import React, { useState } from "react";
import "./login.css";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // firebase.auth().signInWithEmailAndPassword(email, password)
    //   .then(onLogin)
    //   .catch(showError);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">SV</div>
        <h2 className="auth-title">Login</h2>
        <p className="auth-sub">Sign in to continue to SVPay</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="auth-btn">Login</button>
        </form>

        <button className="auth-secondary">Use biometric login</button>

        <p className="auth-footer">
          New user? <a href="/signup">Create an account</a>
        </p>
      </div>
    </div>
  );
}
