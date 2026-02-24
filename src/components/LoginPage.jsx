import { useState } from "react";

export default function AuthPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = users.find(
      (u) => u.username === username && u.password === password
    );
    if (validUser) onLoginSuccess(validUser);
    else alert("Invalid username or password");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #4f46e5, #8b5cf6, #ec4899)",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: "30px",
          padding: "40px",
          maxWidth: "400px",
          width: "100%",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "white",
            fontSize: "2.5rem",
            marginBottom: "30px",
          }}
        >
          Driver Login
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Username */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{
              padding: "16px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              fontSize: "1rem",
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.background = "rgba(255,255,255,0.4)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.3)";
              e.target.style.background = "rgba(255,255,255,0.2)";
            }}
          />

          {/* Password */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                padding: "16px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.2)",
                color: "white",
                fontSize: "1rem",
                outline: "none",
                width: "100%",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.background = "rgba(255,255,255,0.4)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.3)";
                e.target.style.background = "rgba(255,255,255,0.2)";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            style={{
              padding: "16px",
              borderRadius: "20px",
              border: "none",
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              color: "white",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 14px rgba(59,130,246,0.4)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 8px 25px rgba(59,130,246,0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 14px rgba(59,130,246,0.4)";
            }}
          >
            Log In
          </button>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "28px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.3)",
            color: "white",
            fontSize: "14px",
          }}
        >
          Don't have an account? <span style={{ fontWeight: "bold", cursor: "pointer" }}>Sign Up</span>
        </div>
      </div>
    </div>
  );
}