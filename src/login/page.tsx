import React, { useState } from "react";
import SignUpPage from "../signup/page"; // ตรวจสอบ path ให้ถูกต้อง
import bgImage from "../assets/bgImage.png";
import bgloginFull from "../assets/bglogin_full.png"; // ตรวจสอบ path ให้ถูกต้อง
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // เพิ่ม import icons

type LoginPageProps = {
  onLogin: (user_id: number) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);


  const handleSignUpSuccess = () => {
    setShowSignUp(false);
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!username.trim() || !password.trim()) {
      setError("Enter your username and password");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        // ทำสิ่งที่ต้องการเมื่อ login สำเร็จ
        setMessage(data.message || "เข้าสู่ระบบสำเร็จ");
        setUsername("");
        setPassword("");
        onLogin(data.user_id);
      } else {
        setError(data.error || "Incorrect username or password");
      }
    } catch {
      setError("An error occurred while connecting to the server");
    }
  };

  if (showSignUp) {
    return (
      <div>
        <SignUpPage onSignUpSuccess={handleSignUpSuccess} />
      </div>
    );
  }

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
        fontFamily: "Inria Serif, serif", // เพิ่มบรรทัดนี้
      }}
    >
      {/* กล่องรูป bglogin */}
      <div
        style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundImage: `url(${bgloginFull})`,
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
            width: "900px",        // เพิ่มความกว้าง
            maxWidth: "98vw",      // จำกัดความกว้างสูงสุด
            minWidth: "400px",     // เพิ่มความกว้างขั้นต่ำ
            maxHeight: "95vh",
            minHeight: "500px",
            overflow: "auto",
        }}
    >
        <h2
          style={{
            color: "#000",
            textAlign: "right",
            width: "58%",
            fontSize: 50,
            fontWeight: 400,
            fontFamily: "Inria Serif, serif",
            marginBottom: 0,
            marginTop: 40, // ขยับลงมาอีก
          }}
        >
          Log In
        </h2>
        <form onSubmit={handleLogin} style={{ width: "80%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end" }}>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginBottom: 12,
              marginTop: 24,
              color: "#000",
              textAlign: "left",
              width: "50%",
              fontSize: 20, // ปรับขนาดตัวอักษร
              fontFamily: "Inria Serif, serif", // ใช้ Inria Serif
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
                width: "100%",
                alignSelf: "flex-end",
                padding: 12,
                marginTop: 4,
                borderRadius: 8,
                border: "1px solid #bdbdbd",
                fontSize: "1.1rem",
                background: "#fff",
                color: "#333",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "Inria Serif, serif", // ใช้ Inria Serif
              }}
            />
          </label>
          {/* Password input with eye icon */}
          <label
            style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                marginBottom: 12,
                marginTop: 8,
                color: "#000",
                textAlign: "left",
                width: "50%",
                fontSize: 20,
                fontFamily: "Inria Serif, serif",
            }}
            >
            Password
            <div style={{ width: "100%", position: "relative", display: "flex", alignItems: "center" }}>
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                    width: "100%",
                    alignSelf: "flex-end",
                    padding: "12px 40px 12px 12px",  // เพิ่ม paddingRight เพื่อเว้นที่ปุ่มตา
                    marginTop: 4,
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

          {error && <p style={{ color: "red", marginTop: 8 ,textAlign: "left", width: "38%" }}>{error}</p>}  

          <button
            type="submit"
            style={{
              width: "35%",
              alignSelf: "flex-end",
              marginRight: "6%",
              padding: 10,
              backgroundColor: "#d0b3c9",
              border: "none",
              borderRadius: 24,
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: 32,
              fontSize: 22, // เพิ่มขนาดตัวอักษรในปุ่ม
            }}
          >
            log in
          </button>
        </form>
        

        <p style={{ marginTop: 55, color: "#000", textAlign: "right", width: "65%", fontSize: 18 }}>
          Don’t have account?{" "}
          <button
            onClick={() => setShowSignUp(true)}
            style={{
              color: "#d7a8bc",
              textDecoration: "underline",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontSize: 18, // เพิ่มขนาดปุ่ม Sign up
            }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}