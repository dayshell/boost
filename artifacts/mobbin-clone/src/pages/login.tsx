import { useState } from "react";
import { useLang } from "../LangContext";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";
import { useLocation } from "wouter";

const col1 = ["/games/cs2_new.png", "/games/dota2_new.png", "/games/valorant_new.png"];
const col2 = ["/games/valorant_new.png", "/games/cs2_new.png", "/games/dota2_new.png"];
const col3 = ["/games/dota2_new.png", "/games/valorant_new.png", "/games/cs2_new.png"];

function CarouselColumn({ images, reverse = false, duration }: { images: string[]; reverse?: boolean; duration: number }) {
  const doubled = [...images, ...images, ...images, ...images];
  return (
    <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        animation: `${reverse ? "scroll-up" : "scroll-down"} ${duration}s linear infinite`,
        willChange: "transform",
      }}>
        {doubled.map((src, i) => (
          <div key={i} style={{
            borderRadius: 14,
            overflow: "hidden",
            flexShrink: 0,
            aspectRatio: "3/4",
            background: "#1c1c1c",
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          }}>
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Login() {
  const { lang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const [, navigate] = useLocation();

  const isRu = lang === "ru";
  const isDark = theme === "dark";

  const formBg    = isDark ? "#111111" : "#ffffff";
  const textColor = isDark ? "#f0f0ee" : "#131415";
  const mutedColor = isDark ? "rgba(240,240,238,0.45)" : "rgba(0,0,0,0.42)";
  const inputBg   = isDark ? "rgba(255,255,255,0.06)" : "#f5f5f3";
  const inputBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.14)";
  const dividerColor = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const sideBorder   = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const toggleBg    = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const toggleBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 44,
    padding: "0 14px",
    borderRadius: 10,
    border: `1px solid ${inputBorder}`,
    background: inputBg,
    color: textColor,
    fontFamily: "var(--app-font-sans)",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  };

  return (
    <>
      <style>{`
        @keyframes scroll-down {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scroll-up {
          0%   { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}</style>

      {/* Full-screen lock — no scroll */}
      <div style={{
        display: "flex",
        height: "100dvh",
        overflow: "hidden",
        background: "#0a0a0a",
      }}>

        {/* ── LEFT: carousel ── */}
        <div style={{
          flex: 1,
          display: "flex",
          gap: 10,
          padding: 14,
          overflow: "hidden",
          position: "relative",
        }}>
          <CarouselColumn images={col1} duration={20} />
          <CarouselColumn images={col2} reverse duration={26} />
          <CarouselColumn images={col3} duration={23} />

          {/* fade top & bottom */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to bottom, #0a0a0a 0px, transparent 120px, transparent calc(100% - 120px), #0a0a0a 100%)",
          }} />
        </div>

        {/* ── RIGHT: form ── */}
        <div style={{
          width: 440,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: formBg,
          borderLeft: `1px solid ${sideBorder}`,
          overflow: "hidden",
        }}>
          {/* top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", flexShrink: 0 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill={isDark ? "#f0f0ee" : "#131415"} />
                <text x="20" y="28" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="bold" fontSize="24" fill={isDark ? "#111" : "#fff"}>B</text>
              </svg>
              <span style={{ color: textColor, fontWeight: 700, fontSize: 16, fontFamily: "var(--app-font-sans)" }}>Boost</span>
            </a>
            <button
              onClick={toggleTheme}
              style={{
                width: 34, height: 34, borderRadius: 9999,
                border: `1px solid ${toggleBorder}`,
                background: toggleBg,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                color: textColor, flexShrink: 0,
              }}
            >
              {isDark ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>

          {/* form body — vertically centered */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 32px",
            overflow: "hidden",
          }}>
            <div style={{ width: "100%", maxWidth: 340 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em", color: textColor, margin: "0 0 8px" }}>
                {isRu ? "Войти в Boost" : "Sign in to Boost"}
              </h1>
              <p style={{ fontSize: 14, color: mutedColor, margin: "0 0 28px" }}>
                {isRu ? "Нет аккаунта?" : "Don't have an account?"}{" "}
                <a href="/register" style={{ color: textColor, textDecoration: "underline", textUnderlineOffset: 3 }}>
                  {isRu ? "Зарегистрироваться" : "Sign up"}
                </a>
              </p>

              {/* Google button */}
              <button
                style={{
                  width: "100%", height: 44, borderRadius: 10,
                  border: `1px solid ${inputBorder}`,
                  background: inputBg,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  fontFamily: "var(--app-font-sans)", fontSize: 14, fontWeight: 500, color: textColor,
                  marginBottom: 20, transition: "opacity 0.15s", boxSizing: "border-box",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.72")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isRu ? "Продолжить с Google" : "Continue with Google"}
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: dividerColor }} />
                <span style={{ fontSize: 12, color: mutedColor }}>{isRu ? "или" : "or"}</span>
                <div style={{ flex: 1, height: 1, background: dividerColor }} />
              </div>

              {/* Email / Password */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (step === "email" && email) {
                    setStep("password");
                  } else if (step === "password") {
                    login(email);
                    navigate("/boosts");
                  }
                }}
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <input
                  type="email" placeholder="Email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)")}
                  onBlur={e => (e.target.style.borderColor = inputBorder)}
                  autoComplete="email"
                />
                {step === "password" && (
                  <input
                    type="password" placeholder={isRu ? "Пароль" : "Password"} value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)")}
                    onBlur={e => (e.target.style.borderColor = inputBorder)}
                    autoComplete="current-password" autoFocus
                  />
                )}
                <button
                  type="submit"
                  style={{
                    width: "100%", height: 44, borderRadius: 10,
                    background: isDark ? "#f0f0ee" : "#131415",
                    color: isDark ? "#111111" : "#ffffff",
                    border: "none", cursor: "pointer",
                    fontFamily: "var(--app-font-sans)", fontSize: 14, fontWeight: 600,
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  {step === "email"
                    ? (isRu ? "Продолжить с email" : "Continue with email")
                    : (isRu ? "Войти" : "Sign in")}
                </button>
              </form>

              {step === "password" && (
                <div style={{ textAlign: "center", marginTop: 14 }}>
                  <a href="#" style={{ fontSize: 13, color: mutedColor, textDecoration: "underline", textUnderlineOffset: 3 }}>
                    {isRu ? "Забыли пароль?" : "Forgot password?"}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* bottom */}
          <div style={{ padding: "16px 32px", textAlign: "center", flexShrink: 0 }}>
            <p style={{ fontSize: 12, color: mutedColor, lineHeight: 1.6, margin: 0 }}>
              {isRu
                ? "Продолжая, вы соглашаетесь с условиями использования."
                : "By continuing, you agree to our Terms of Service and Privacy Policy."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
