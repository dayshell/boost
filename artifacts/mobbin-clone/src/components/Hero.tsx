import { useState, useEffect } from "react";
import { useLang } from "../LangContext";
import { translations } from "../i18n";

function CS2Icon() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#1b2838", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
      <svg viewBox="0 0 48 48" width="62%" height="62%" fill="none">
        <circle cx="24" cy="24" r="10" stroke="#f0c040" strokeWidth="2.5" />
        <line x1="24" y1="4" x2="24" y2="14" stroke="#f0c040" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="34" x2="24" y2="44" stroke="#f0c040" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="4" y1="24" x2="14" y2="24" stroke="#f0c040" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34" y1="24" x2="44" y2="24" stroke="#f0c040" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="24" r="3.5" fill="#f0c040" />
      </svg>
      <span style={{ color: "#f0c040", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", lineHeight: 1 }}>CS2</span>
    </div>
  );
}

function Dota2Icon() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0e0b0b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
      <svg viewBox="0 0 48 48" width="58%" height="58%" fill="none">
        <path d="M24 8C15.16 8 8 15.16 8 24s7.16 16 16 16 16-7.16 16-16S32.84 8 24 8zm0 26a10 10 0 110-20 10 10 0 010 20z" fill="#c23c2a" />
        <path d="M21 18l8 6-8 6V18z" fill="#e05540" />
      </svg>
      <span style={{ color: "#c23c2a", fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", lineHeight: 1 }}>DOTA 2</span>
    </div>
  );
}

function ValorantIcon() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0f1923", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
      <svg viewBox="0 0 48 48" width="62%" height="62%" fill="none">
        <path d="M8 12L24 36L32 24L20 8H8L8 12Z" fill="#ff4655" />
        <path d="M40 12L28 12L36 24L24 36L28 40H40V12Z" fill="#ff4655" opacity="0.5" />
      </svg>
      <span style={{ color: "#ff4655", fontSize: 9, fontWeight: 800, letterSpacing: "0.06em", lineHeight: 1 }}>VALORANT</span>
    </div>
  );
}

const gameLogos = [
  { component: <CS2Icon />, alt: "CS2" },
  { component: <Dota2Icon />, alt: "Dota 2" },
  { component: <ValorantIcon />, alt: "Valorant" },
];

function GameLogoStack() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % gameLogos.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", width: 88, height: 88, margin: "0 auto 36px", borderRadius: 28 }}>
      {gameLogos.map((logo, i) => {
        const offset = (i - currentIndex + gameLogos.length) % gameLogos.length;
        const isVisible = offset < 3;
        return (
          <div
            key={logo.alt}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              overflow: "hidden",
              zIndex: isVisible ? 3 - offset : -1,
              opacity: offset === 0 ? 1 : offset === 1 ? 0.55 : offset === 2 ? 0.25 : 0,
              transform: `translateY(${offset * -7}px) scale(${1 - offset * 0.09})`,
              transformOrigin: "center top",
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            }}
          >
            {logo.component}
          </div>
        );
      })}
    </div>
  );
}

const trustedCompanies = [
  { label: "CS2", color: "#f0c040" },
  { label: "Dota 2", color: "#c23c2a" },
  { label: "Valorant", color: "#ff4655" },
  { label: "10 000+", color: "#6c3bff" },
  { label: "Players", color: "#999993" },
];

export default function Hero() {
  const { lang } = useLang();
  const tr = translations[lang].hero;

  return (
    <section
      style={{
        position: "relative",
        display: "grid",
        placeItems: "center",
        padding: "156px 24px 80px",
        background: "var(--bg-primary)",
        minHeight: "100dvh",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 720 }}>
        <GameLogoStack />

        <h1
          className="text-showcase"
          style={{ maxWidth: 700, margin: "0 auto 16px" }}
        >
          {tr.h1}
        </h1>

        <p
          className="text-feature text-secondary"
          style={{ maxWidth: 540, margin: "0 auto 32px" }}
        >
          {tr.subtitle}
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 64 }}>
          <a href="#" className="btn-inverse">{tr.join}</a>
          <a href="#" className="btn-outline">
            {tr.seePlans}
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 24, height: 24, borderRadius: "50%",
              background: "var(--bg-tertiary)", marginLeft: 2,
            }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15.996 10L3 10" />
                <path d="M9.734 16.318L15.632 9.999L9.734 3.679" />
              </svg>
            </span>
          </a>
        </div>

        {/* Trusted by */}
        <div>
          <p className="text-compact text-secondary" style={{ marginBottom: 20 }}>{tr.trustedBy}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
            {/* CS2 badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: "#1b2838", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 12 12" width="10" height="10"><circle cx="6" cy="6" r="2.5" stroke="#f0c040" strokeWidth="1.2"/><line x1="6" y1="1" x2="6" y2="3.5" stroke="#f0c040" strokeWidth="1.2" strokeLinecap="round"/><line x1="6" y1="8.5" x2="6" y2="11" stroke="#f0c040" strokeWidth="1.2" strokeLinecap="round"/><line x1="1" y1="6" x2="3.5" y2="6" stroke="#f0c040" strokeWidth="1.2" strokeLinecap="round"/><line x1="8.5" y1="6" x2="11" y2="6" stroke="#f0c040" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </div>
              <span className="text-body-bold" style={{ fontSize: 13, color: "var(--text-tertiary)" }}>CS2</span>
            </div>
            {/* Dota 2 badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: "#0e0b0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 12 12" width="10" height="10"><circle cx="6" cy="6" r="4" stroke="#c23c2a" strokeWidth="1.2" fill="none"/><path d="M5 4l3 2-3 2V4z" fill="#c23c2a"/></svg>
              </div>
              <span className="text-body-bold" style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Dota 2</span>
            </div>
            {/* Valorant badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: "#0f1923", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 12 12" width="10" height="10"><path d="M2 3l4 6 2-3-2.5-3H2z" fill="#ff4655"/><path d="M10 3L7.5 3 8 6 6 9l1 0.5 3-6.5z" fill="#ff4655" opacity="0.5"/></svg>
              </div>
              <span className="text-body-bold" style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Valorant</span>
            </div>
            <div style={{ width: 1, height: 16, background: "var(--border-secondary)" }} />
            <span className="text-body-bold" style={{ fontSize: 13, color: "var(--text-tertiary)" }}>10 000+ {lang === "ru" ? "игроков" : "players"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
