import { useState } from "react";
import { useLang } from "../LangContext";
import { translations } from "../i18n";

function BoostLogo({ size = 28 }: { size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: 8,
      background: "linear-gradient(135deg, #6c3bff 0%, #a855f7 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      <svg width={size * 0.6} height={size * 0.7} viewBox="0 0 18 22" fill="white">
        <path d="M2 1H12C15.3137 1 18 3.68629 18 7C18 8.76607 17.2321 10.3538 16.0186 11.4648C17.2714 12.5445 18 14.1837 18 16C18 19.3137 15.3137 22 12 22H2V1ZM5 4V10H12C13.6569 10 15 8.65685 15 7C15 5.34315 13.6569 4 12 4H5ZM5 13V19H12C13.6569 19 15 17.6569 15 16C15 14.3431 13.6569 13 12 13H5Z" />
      </svg>
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
          className="text-compact"
          style={{
            height: 26,
            padding: "0 10px",
            borderRadius: 9999,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 12,
            transition: "all 0.18s",
            background: lang === l ? "var(--bg-primary)" : "transparent",
            color: lang === l ? "var(--text-primary)" : "var(--text-tertiary)",
            boxShadow: lang === l ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
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
          display: "flex",
          alignItems: "center",
          gap: 20,
          height: 60,
          padding: "8px 20px",
          borderRadius: 9999,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.06)",
          width: "min(640px, calc(100vw - 40px))",
        }}
      >
        {/* Logo */}
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", flex: 1 }}>
          <BoostLogo size={30} />
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            BOOST
          </span>
        </a>

        <a href="#" className="text-body-bold text-primary" style={{ textDecoration: "none", whiteSpace: "nowrap", transition: "opacity 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.55")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
          {tr.pricing}
        </a>
        <a href="#" className="text-body-bold text-primary" style={{ textDecoration: "none", whiteSpace: "nowrap", transition: "opacity 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.55")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
          {tr.awards}
        </a>
        <a href="#" className="text-body-bold text-primary" style={{ textDecoration: "none", whiteSpace: "nowrap", transition: "opacity 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.55")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
          {tr.signIn}
        </a>

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
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <BoostLogo size={26} />
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>BOOST</span>
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
