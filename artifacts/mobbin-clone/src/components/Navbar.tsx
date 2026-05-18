import { useState } from "react";
import { useLang } from "../LangContext";
import { useTheme } from "../ThemeContext";
import { translations } from "../i18n";

function BoostLogo({ size = 30 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect width="40" height="40" rx="11" fill="#0f0f0f" />
        <text
          x="20"
          y="29"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="bold"
          fontSize="26"
          fill="white"
          letterSpacing="-1"
        >B</text>
      </svg>
      <span style={{
        fontFamily: "var(--app-font-sans)",
        fontWeight: 700,
        fontSize: Math.round(size * 0.6),
        letterSpacing: "-0.01em",
        color: "var(--text-primary)",
        lineHeight: 1,
      }}>Boost</span>
    </div>
  );
}

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div style={{
      display: "flex",
      background: "rgba(0,0,0,0.06)",
      borderRadius: 9999,
      padding: 3,
      gap: 2,
    }}>
      {(["en", "ru"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            height: 26,
            padding: "0 10px",
            borderRadius: 9999,
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--app-font-sans)",
            fontWeight: 600,
            fontSize: 12,
            transition: "all 0.18s",
            background: lang === l ? "#ffffff" : "transparent",
            color: lang === l ? "var(--text-primary)" : "var(--text-tertiary)",
            boxShadow: lang === l ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        width: 32, height: 32, borderRadius: 9999,
        border: "none", cursor: "pointer",
        background: "rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "background 0.15s",
        color: "var(--text-primary)",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.12)")}
      onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.06)")}
    >
      {theme === "light" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const { lang } = useLang();
  const tr = translations[lang].nav;
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [tr.pricing, tr.signIn];

  return (
    <>
      {/* Desktop floating pill nav */}
      <nav
        className="hidden md:flex"
        style={{
          position: "absolute",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          alignItems: "center",
          gap: 24,
          height: 60,
          padding: "8px 20px",
          borderRadius: 9999,
          background: "rgba(242,242,240,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.07)",
          width: "min(580px, calc(100vw - 40px))",
        }}
      >
        <a href="/" style={{ flex: 1, textDecoration: "none" }}>
          <BoostLogo size={30} />
        </a>

        {navLinks.map((label) => (
          <a
            key={label}
            href="#"
            className="text-body-bold text-primary"
            style={{ textDecoration: "none", whiteSpace: "nowrap", transition: "opacity 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.45")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            {label}
          </a>
        ))}

        <LangToggle />
        <ThemeToggle />
      </nav>

      {/* Mobile nav */}
      <div
        className="md:hidden"
        style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 50,
          background: "rgba(242,242,240,0.95)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", height: 56 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <BoostLogo size={26} />
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LangToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ border: "none", background: "none", cursor: "pointer", padding: 4 }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--text-primary)" strokeWidth="2">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div style={{ padding: "8px 16px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map(l => (
              <a key={l} href="#" className="text-body-bold" style={{ padding: "8px 0", textDecoration: "none", color: "var(--text-primary)" }}>{l}</a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
