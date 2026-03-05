import { useState } from "react";

const floatKeyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes coinFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-12px) rotate(5deg); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 136, 0.15); }
    50% { box-shadow: 0 0 40px rgba(0, 255, 136, 0.35); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes dotPulse {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
`;

export default function Register({ onRegister, onGoLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focused, setFocused] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, walletAddress }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("userId", data.data.id);
        localStorage.setItem("userName", data.data.name);
        setSuccess("Account created! Redirecting...");
        setTimeout(() => {
          if (onRegister) onRegister({ name: data.data.name, id: data.data.id });
        }, 1000);
      } else {
        setError(data.error || "Registration failed. Try again.");
      }
    } catch (err) {
      setError("Cannot reach server. Is backend running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    background: focused === field ? "#1a1e2e" : "#0f1117",
    border: `1px solid ${focused === field ? "#00ff88" : "#1e2335"}`,
    borderRadius: "12px",
    padding: "13px 14px 13px 42px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
    boxShadow: focused === field ? "0 0 0 3px rgba(0,255,136,0.08)" : "none",
  });

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    color: "#6b7280",
    marginBottom: "8px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  };

  return (
    <>
      <style>{floatKeyframes}</style>
      <div style={{
        minHeight: "100vh",
        background: "#0b0d14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: "32px 0",
      }}>

        {/* Grid background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }} />

        {/* Radial glow */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px", height: "700px",
          background: "radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Floating dots left */}
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: "6px", height: "6px",
            borderRadius: "50%",
            background: "#00ff88",
            opacity: 0.25,
            top: `${15 + i * 17}%`,
            left: `${8 + i * 5}%`,
            animation: `dotPulse ${2 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
        {/* Floating dots right */}
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: "4px", height: "4px",
            borderRadius: "50%",
            background: "#00ff88",
            opacity: 0.2,
            top: `${20 + i * 20}%`,
            right: `${6 + i * 4}%`,
            animation: `dotPulse ${1.8 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }} />
        ))}

        {/* Main card */}
        <div style={{
          width: "100%",
          maxWidth: "420px",
          margin: "0 16px",
          animation: "fadeSlideUp 0.6s ease forwards",
        }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px", height: "64px",
              background: "linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)",
              borderRadius: "18px",
              fontSize: "28px",
              marginBottom: "16px",
              animation: "coinFloat 3s ease-in-out infinite",
              boxShadow: "0 0 32px rgba(0,255,136,0.3)",
            }}>💰</div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "28px",
              fontWeight: 800,
              color: "#ffffff",
              margin: "0 0 4px 0",
              letterSpacing: "-0.5px",
            }}>CoinStash</h1>
            <p style={{
              color: "#5a6478",
              fontSize: "13px",
              fontWeight: 400,
              margin: 0,
              letterSpacing: "0.5px",
            }}>SPARE CHANGE. BIG FUTURE.</p>
          </div>

          {/* Card */}
          <div style={{
            background: "#13161f",
            border: "1px solid #1e2335",
            borderRadius: "20px",
            padding: "36px 32px",
            animation: "pulseGlow 4s ease-in-out infinite",
          }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#ffffff",
              margin: "0 0 6px 0",
            }}>Create an account</h2>
            <p style={{
              color: "#4a5568",
              fontSize: "13px",
              margin: "0 0 28px 0",
            }}>Start saving your spare change today</p>

            {/* Error */}
            {error && (
              <div style={{
                background: "rgba(255, 75, 75, 0.1)",
                border: "1px solid rgba(255, 75, 75, 0.3)",
                borderRadius: "10px",
                padding: "10px 14px",
                marginBottom: "20px",
                color: "#ff6b6b",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div style={{
                background: "rgba(0, 255, 136, 0.08)",
                border: "1px solid rgba(0, 255, 136, 0.25)",
                borderRadius: "10px",
                padding: "10px 14px",
                marginBottom: "20px",
                color: "#00ff88",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <span>✅</span> {success}
              </div>
            )}

            {/* Name */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Full Name <span style={{ color: "#ff6b6b" }}>*</span></label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.4 }}>👤</span>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused("")}
                  placeholder="Alex Chen"
                  style={inputStyle("name")}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Email <span style={{ color: "#ff6b6b" }}>*</span></label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.4 }}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  placeholder="alex@university.edu"
                  style={inputStyle("email")}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Password <span style={{ color: "#ff6b6b" }}>*</span></label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.4 }}>🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="Min. 6 characters"
                  style={{ ...inputStyle("password"), paddingRight: "44px" }}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: "14px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    cursor: "pointer", fontSize: "16px",
                    opacity: 0.5, padding: 0,
                  }}
                >{showPass ? "🙈" : "👁️"}</button>
              </div>
            </div>

            {/* Wallet Address (optional) */}
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>
                Wallet Address{" "}
                <span style={{ color: "#3a4055", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>(optional)</span>
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.4 }}>🔗</span>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={e => setWalletAddress(e.target.value)}
                  onFocus={() => setFocused("wallet")}
                  onBlur={() => setFocused("")}
                  placeholder="0x... (connect later if unsure)"
                  style={inputStyle("wallet")}
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading
                  ? "#1a2a1f"
                  : "linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)",
                border: "none",
                borderRadius: "12px",
                color: loading ? "#00ff88" : "#0a1a0f",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.3px",
                boxShadow: loading ? "none" : "0 4px 20px rgba(0,255,136,0.25)",
              }}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center",
              gap: "12px", margin: "24px 0",
            }}>
              <div style={{ flex: 1, height: "1px", background: "#1e2335" }} />
              <span style={{ color: "#3a4055", fontSize: "12px" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "#1e2335" }} />
            </div>

            {/* Login link */}
            <p style={{ textAlign: "center", color: "#4a5568", fontSize: "13px", margin: 0 }}>
              Already have an account?{" "}
              <button
                onClick={onGoLogin}
                style={{
                  background: "none", border: "none",
                  color: "#00ff88", fontSize: "13px",
                  fontWeight: 500, cursor: "pointer",
                  padding: 0, fontFamily: "'DM Sans', sans-serif",
                }}
              >Sign in</button>
            </p>
          </div>

          {/* Bottom stats */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            marginTop: "28px",
          }}>
            {[
              { label: "Students Saving", value: "12,400+" },
              { label: "Total Saved", value: "$2.1M" },
              { label: "Avg. Trust Score", value: "680" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#00ff88",
                }}>{stat.value}</div>
                <div style={{
                  fontSize: "10px",
                  color: "#3a4055",
                  marginTop: "2px",
                  letterSpacing: "0.3px",
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
