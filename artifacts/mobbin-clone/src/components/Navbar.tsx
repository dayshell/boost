import { useState } from "react";
import { useLang } from "../LangContext";
import { translations } from "../i18n";

function BoostLogo({ size = 30 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
      {/* Purple gradient square with Orbitron B */}
      <div style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.27),
        background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 2px 8px rgba(124,58,237,0.4)",
      }}>
        <span style={{
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 900,
          fontSize: Math.round(size * 0.58),
          color: "#ffffff",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}>B</span>
      </div>
      <span style={{
        fontFamily: "'Orbitron', sans-serif",
        fontWeight: 700,
        fontSize: Math.round(size * 0.6),
        letterSpacing: "0.05em",
        color: "var(--text-primary)",
        lineHeight: 1,
      }}>BOOST</span>
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
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.04em",
            transition: "all 0.18s",
            background: lang === l ? "var(--bg-primary)" : "transparent",
            color: lang === l ? "var(--text-primary)" : "var(--text-tertiary)",
            boxShadow: lang === l ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const { lang } = useLang();
  const tr = translations[lang].nav;
  const [mobileOpen, setMobileOpen] = useState(false);

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
          gap: 20,
          height: 60,
          padding: "8px 20px",
          borderRadius: 9999,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.06)",
          width: "min(660px, calc(100vw - 40px))",
        }}
      >
        <a href="/" style={{ flex: 1, textDecoration: "none" }}>
          <BoostLogo size={30} />
        </a>

        {[tr.pricing, tr.awards, tr.signIn].map((label) => (
          <a
            key={label}
            href="#"
            className="text-body-bold text-primary"
            style={{ textDecoration: "none", whiteSpace: "nowrap", transition: "opacity 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.5")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            {label}
          </a>
        ))}

        <LangToggle />
        <a href="#" className="btn-inverse" style={{ fontSize: 14, flexShrink: 0 }}>{tr.getStarted}</a>
      </nav>

      {/* Mobile nav */}
      <div
        className="md:hidden"
        style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 50,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", height: 56 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <BoostLogo size={26} />
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LangToggle />
            <a href="#" className="btn-inverse" style={{ height: 36, fontSize: 13 }}>{tr.getStarted}</a>
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ border: "none", background: "none", cursor: "pointer", padding: 4 }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#131415" strokeWidth="2">
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
            {[tr.pricing, tr.awards, tr.signIn].map(l => (
              <a key={l} href="#" className="text-body-bold" style={{ padding: "8px 0", textDecoration: "none", color: "var(--text-primary)" }}>{l}</a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
