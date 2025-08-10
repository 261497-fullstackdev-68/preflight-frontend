import React, { useState } from "react";
import bgImage from "../assets/bgImage.png";
import bgsignupFull from "../assets/bgsignup_full.png";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // เพิ่ม import icons

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all required fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "Username already exists.");
      }
    } catch {
      setError("An error occurred while connecting to the server");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 0,
        fontFamily: "Inria Serif, serif",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundImage: `url(${bgsignupFull})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 1,
          padding: 40,
          borderRadius: 10,
          boxShadow: "0 0 15px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "900px",
          maxWidth: "98vw",
          minWidth: "400px",
          maxHeight: "95vh",
          minHeight: "500px",
          overflow: "auto",
        }}
      >
        <h2
          style={{
            color: "#000",
            textAlign: "left",
            width: "65%",
            fontSize: 50,
            fontWeight: 400,
            fontFamily: "Inria Serif, serif",
            marginBottom: 0,
            marginTop: 30,
          }}
        >
          Sign Up
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "80%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginBottom: 12,
              marginTop: 10,
              color: "#000",
              textAlign: "left",
              width: "105%",
              fontSize: 18,
              fontFamily: "Inria Serif, serif",
            }}
          >
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              style={{
                width: "50%",
                alignSelf: "flex-start",
                padding: 12,
                marginTop: 3,
                borderRadius: 8,
                border: "1px solid #bdbdbd",
                fontSize: "1.1rem",
                background: "#fff",
                color: "#333",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "Inria Serif, serif",
              }}
            />
          </label>
          {/* Password input with eye icon */}
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginBottom: 12,
              marginTop: 10,
              color: "#000",
              textAlign: "left",
              width: "105%",
              fontSize: 18,
              fontFamily: "Inria Serif, serif",
              position: "relative",
            }}
          >
            Password
            <div style={{ width: "50%", position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 12,
                  marginTop: 3,
                  borderRadius: 8,
                  border: "1px solid #bdbdbd",
                  fontSize: "1.1rem",
                  background: "#fff",
                  color: "#333",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "Inria Serif, serif",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 16,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 22,
                  padding: 0,
                }}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiFillEye color="black" /> : <AiFillEyeInvisible color="black" />}
              </button>
            </div>
          </label>
          {/* Confirm Password input with icon */}
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginBottom: 12,
              marginTop: 10,
              color: "#000",
              textAlign: "left",
              width: "105%",
              fontSize: 18,
              fontFamily: "Inria Serif, serif",
              position: "relative",
            }}
          >
            Confirm Password
            <div style={{ width: "50%", position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 12,
                  marginTop: 3,
                  borderRadius: 8,
                  border: "1px solid #bdbdbd",
                  fontSize: "1.1rem",
                  background: "#fff",
                  color: "#333",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "Inria Serif, serif",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 16,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 22,
                  padding: 0,
                }}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <AiFillEye color="black" /> : <AiFillEyeInvisible color="black" />}
              </button>
            </div>
          </label>

          {error && (
            <div style={{ color: "red", marginTop: 8, textAlign: "left", width: "91%", fontFamily: "Inria Serif, serif" }}>{error}</div>
          )}

          <button
            type="submit"
            style={{
              width: "35%",
              alignSelf: "flex-start",
              marginLeft: "3%",
              padding: 10,
              backgroundColor: "#d0b3c9",
              border: "none",
              borderRadius: 24,
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: 30,
              fontSize: 22,
              fontFamily: "Inria Serif, serif",
            }}
          >
            Sign up
          </button>
          {message && (
            <div style={{ color: "green", marginTop: 16, textAlign: "left", width: "90%", fontFamily: "Inria Serif, serif" }}>{message}</div>
          )}
        </form>
      </div>
    </div>
  );
}