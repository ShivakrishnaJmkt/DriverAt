import { useState } from "react";

export default function AuthPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }
    
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = users.find((u) => 
      u.username === username && u.password === password
    );
    
    if (validUser) {
      onLoginSuccess(validUser);
      console.log("Login successful:", validUser);
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "48px 40px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#1f2937",
          textAlign: "center",
          marginBottom: "32px"
        }}>
          Log in
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "16px",
                backgroundColor: "#f9fafb",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "16px",
                backgroundColor: "#f9fafb",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#2563eb";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#3b82f6";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Log in
          </button>
        </div>

        <p style={{
          textAlign: "center",
          marginTop: "24px",
          color: "#6b7280",
          fontSize: "14px"
        }}>
          Log in to Sign up
        </p>
      </div>
    </div>
  );
}
