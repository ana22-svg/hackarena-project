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
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes dotPulse {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
`;

export default function Login({ onLogin, onGoRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");
  const [showPass, setShowPass] = useState(false);

const handleSubmit = async () => {
  setError("");
  if (!email || !password) {
    setError("Please fill in all fields.");
    return;
  }
  setLoading(true);
  try {
    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("userId", data.data.id);
      localStorage.setItem("userName", data.data.name);
      if (onLogin) onLogin({ name: data.data.name, id: data.data.id });
    } else {
      setError(data.error || "Invalid credentials.");
    }
  } catch (err) {
    setError("Cannot reach server. Is backend running on port 5000?");
  } finally {
    setLoading(false);
  }
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

        {/* Floating decorative dots */}
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

          {/* Logo area */}
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
            }}>Welcome back</h2>
            <p style={{
              color: "#4a5568",
              fontSize: "13px",
              margin: "0 0 28px 0",
            }}>Sign in to your account</p>

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

            {/* Email field */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 500,
                color: "#6b7280",
                marginBottom: "8px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}>Email</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: "14px", top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "16px",
                  opacity: 0.4,
                }}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  placeholder="alex@university.edu"
                  style={{
                    width: "100%",
                    background: focused === "email" ? "#1a1e2e" : "#0f1117",
                    border: `1px solid ${focused === "email" ? "#00ff88" : "#1e2335"}`,
                    borderRadius: "12px",
                    padding: "13px 14px 13px 42px",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s",
                    boxSizing: "border-box",
                    boxShadow: focused === "email" ? "0 0 0 3px rgba(0,255,136,0.08)" : "none",
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#6b7280",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}>Password</label>
                <button onClick={() => {}} style={{
                  background: "none", border: "none",
                  color: "#00ff88", fontSize: "12px",
                  cursor: "pointer", padding: 0,
                  fontFamily: "'DM Sans', sans-serif",
                }}>Forgot password?</button>
              </div>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute",
                  left: "14px", top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "16px",
                  opacity: 0.4,
                }}>🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    background: focused === "password" ? "#1a1e2e" : "#0f1117",
                    border: `1px solid ${focused === "password" ? "#00ff88" : "#1e2335"}`,
                    borderRadius: "12px",
                    padding: "13px 44px 13px 42px",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s",
                    boxSizing: "border-box",
                    boxShadow: focused === "password" ? "0 0 0 3px rgba(0,255,136,0.08)" : "none",
                  }}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: "14px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    cursor: "pointer", fontSize: "16px",
                    opacity: 0.5, padding: 0,
                  }}
                >{showPass ? "🙈" : "👁️"}</button>
              </div>
            </div>

            {/* Login button */}
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
              {loading ? "Signing in..." : "Sign In →"}
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

            {/* Register link */}
            <p style={{
              textAlign: "center",
              color: "#4a5568",
              fontSize: "13px",
              margin: 0,
            }}>
              New to CoinStash?{" "}
              <button
                onClick={onGoRegister}
                style={{
                  background: "none", border: "none",
                  color: "#00ff88", fontSize: "13px",
                  fontWeight: 500, cursor: "pointer",
                  padding: 0, fontFamily: "'DM Sans', sans-serif",
                }}
              >Create an account</button>
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