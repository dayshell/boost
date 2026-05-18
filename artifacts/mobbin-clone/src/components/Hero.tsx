import { useState, useEffect } from "react";
import { useLang } from "../LangContext";
import { translations } from "../i18n";

const gameLogos = [
  {
    src: "/games/cs2_new.png",
    alt: "CS2",
    label: "CS2",
    accent: "#f0a030",
    fallbackBg: "#1a2540",
  },
  {
    src: "/games/valorant_new.png",
    alt: "Valorant",
    label: "VALORANT",
    accent: "#ff4655",
    fallbackBg: "#0f1923",
  },
  {
    src: "/games/dota2_new.png",
    alt: "Dota 2",
    label: "DOTA 2",
    accent: "#c23c2a",
    fallbackBg: "#ffffff",
  },
];

function GameLogoStack() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % gameLogos.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 40px", borderRadius: 28 }}>
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
              background: logo.fallbackBg,
              zIndex: isVisible ? 3 - offset : -1,
              opacity: offset === 0 ? 1 : offset === 1 ? 0.5 : offset === 2 ? 0.22 : 0,
              transform: `translateY(${offset * -8}px) scale(${1 - offset * 0.1})`,
              transformOrigin: "center top",
              transition: "all 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: offset === 0
                ? "0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)"
                : "none",
            }}
          >
            <img
              src={logo.src}
              alt={logo.alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function GameBadge({ game }: { game: typeof gameLogos[0] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 24,
        height: 24,
        borderRadius: 7,
        background: game.fallbackBg,
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
      }}>
        <img
          src={game.src}
          alt={game.label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
      </div>
      <span className="text-body-bold" style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{game.label}</span>
    </div>
  );
}

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

        <h1 className="text-showcase" style={{ maxWidth: 700, margin: "0 auto 18px" }}>
          {tr.h1}
        </h1>

        <p className="text-feature text-secondary" style={{ maxWidth: 540, margin: "0 auto 36px" }}>
          {tr.subtitle}
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 72 }}>
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

        <div>
          <p className="text-compact text-secondary" style={{ marginBottom: 20 }}>{tr.trustedBy}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {gameLogos.map(g => <GameBadge key={g.alt} game={g} />)}
            <div style={{ width: 1, height: 18, background: "var(--border-secondary)", margin: "0 4px" }} />
            <span className="text-body-bold" style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
              10 000+ {lang === "ru" ? "игроков" : "players"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
