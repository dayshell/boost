import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useLang } from "../LangContext";
import { useAuth } from "../AuthContext";
import { useTheme } from "../ThemeContext";
import Navbar from "../components/Navbar";
import type { Boost } from "./orders";

function loadBoosts(): Boost[] {
  try {
    const raw = localStorage.getItem("boost_boosts");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

const USD_TO_RUB = 90;

const GAME_COLORS: Record<string, { accent: string; dim: string; glow: string }> = {
  "CS2":      { accent: "#ffab00", dim: "rgba(255,171,0,0.13)",  glow: "rgba(255,171,0,0.22)" },
  "Dota 2":   { accent: "#e05050", dim: "rgba(218,55,55,0.13)",  glow: "rgba(218,55,55,0.22)" },
  "Valorant": { accent: "#ff4655", dim: "rgba(255,70,85,0.13)",  glow: "rgba(255,70,85,0.22)" },
};

const GAME_LOGO: Record<string, string> = {
  "CS2":      "/games/cs2_new.png",
  "Dota 2":   "/games/dota2_new.png",
  "Valorant": "/games/valorant_new.png",
};

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: "16px 18px",
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(240,240,238,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: accent ?? "#f0f0ee", letterSpacing: "-0.01em" }}>
        {value}
      </div>
    </div>
  );
}

export default function BoostDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLang();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [, navigate] = useLocation();
  const isRu = lang === "ru";
  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [boost, setBoost] = useState<Boost | null>(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const found = loadBoosts().find(b => b.id === id) ?? null;
    setBoost(found);
  }, [id, user]);

  if (!user) return null;

  const pageBg = isDark ? "#111111" : "#f5f5f4";
  const cardBg = isDark ? "#181818" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const textPrimary = isDark ? "#f0f0ee" : "#131415";
  const textMuted = isDark ? "rgba(240,240,238,0.38)" : "#888880";

  if (!boost) {
    return (
      <div style={{ minHeight: "100dvh", background: pageBg, fontFamily: "var(--app-font-sans)" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100dvh - 60px)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: textPrimary, marginBottom: 8 }}>
              {isRu ? "Заявка не найдена" : "Request not found"}
            </div>
            <button onClick={() => navigate("/boosts")} style={{
              marginTop: 8, height: 42, padding: "0 20px", borderRadius: 10,
              background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)", border: "none", cursor: "pointer",
              color: textPrimary, fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14,
            }}>
              {isRu ? "К заявкам" : "Back to requests"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const col = GAME_COLORS[boost.game] ?? { accent: "#f0f0ee", dim: "rgba(240,240,238,0.1)", glow: "rgba(240,240,238,0.15)" };
  const budgetDisplay = isRu
    ? `₽${Math.round(Number(boost.budget) * USD_TO_RUB).toLocaleString("ru-RU")}`
    : `$${Number(boost.budget).toFixed(0)}`;
  const createdDate = new Date(boost.createdAt).toLocaleDateString(isRu ? "ru-RU" : "en-US", {
    day: "numeric", month: "long", year: "numeric",
  });
  const createdTime = new Date(boost.createdAt).toLocaleTimeString(isRu ? "ru-RU" : "en-US", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div style={{ minHeight: "100dvh", background: pageBg, fontFamily: "var(--app-font-sans)" }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 64px" }}>

        {/* ── Back button ── */}
        <button
          onClick={() => navigate("/boosts")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "none", border: "none", cursor: "pointer",
            color: textMuted, fontFamily: "var(--app-font-sans)",
            fontSize: 13, fontWeight: 500, padding: 0, marginBottom: 28,
            transition: "color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = textPrimary)}
          onMouseLeave={e => (e.currentTarget.style.color = textMuted)}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {isRu ? "Все заявки" : "All requests"}
        </button>

        {/* ── Hero card ── */}
        <div style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: 24,
          overflow: "hidden",
          marginBottom: 12,
          boxShadow: isDark ? "0 2px 40px rgba(0,0,0,0.35)" : "0 2px 20px rgba(0,0,0,0.07)",
        }}>
          {/* Coloured top strip */}
          <div style={{
            height: 5,
            background: `linear-gradient(to right, ${col.accent}, ${col.glow})`,
          }} />

          <div style={{ padding: "28px 28px 24px" }}>

            {/* Top row: game + author + budget */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 28, flexWrap: "wrap" }}>

              {/* Game logo */}
              <div style={{
                width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                background: col.dim,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1.5px solid ${col.glow}`,
                boxShadow: `0 0 20px ${col.glow}`,
              }}>
                <img src={GAME_LOGO[boost.game]} alt={boost.game}
                  style={{ width: 38, height: 38, objectFit: "contain" }} />
              </div>

              {/* Author & meta */}
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, flexWrap: "wrap" }}>
                  <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: textPrimary, letterSpacing: "-0.03em" }}>
                    {boost.authorName}
                  </h1>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                    background: col.dim, color: col.accent, letterSpacing: "0.03em",
                    border: `1px solid ${col.glow}`,
                  }}>
                    {boost.game}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: textMuted }}>
                  {createdDate} {isRu ? "в" : "at"} {createdTime}
                </div>
              </div>

              {/* Budget pill */}
              <div style={{
                flexShrink: 0, textAlign: "right",
                background: "#ffffff", borderRadius: 12, padding: "8px 18px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 2 }}>
                  {isRu ? "Бюджет" : "Budget"}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#111", letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>
                  {budgetDisplay}
                </div>
              </div>
            </div>

            {/* ── Rank progress block ── */}
            <div style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
              border: `1px solid ${cardBorder}`,
              borderRadius: 16, padding: "20px 24px",
              display: "flex", alignItems: "center", gap: 0,
            }}>
              {/* Current */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                  {isRu ? "Текущий ранг" : "Current rank"}
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                  borderRadius: 10, padding: "8px 14px",
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: textMuted, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, fontWeight: 600, color: textPrimary }}>{boost.currentElo}</span>
                </div>
              </div>

              {/* Arrow */}
              <div style={{ flexShrink: 0, padding: "0 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 80, height: 2, background: `linear-gradient(to right, ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}, ${col.accent})`, borderRadius: 2 }} />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={col.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>

              {/* Target */}
              <div style={{ flex: 1, textAlign: "right" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                  {isRu ? "Желаемый ранг" : "Target rank"}
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: col.dim, borderRadius: 10, padding: "8px 14px",
                  border: `1px solid ${col.glow}`,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.accent, flexShrink: 0, boxShadow: `0 0 6px ${col.accent}` }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: col.accent }}>{boost.desiredElo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Info grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <StatCard label={isRu ? "Контакт" : "Contact"} value={boost.contact} />
          <StatCard
            label={isRu ? "Время (МСК)" : "Time (MSK)"}
            value={`${boost.timeFrom} — ${boost.timeTo}`}
          />
        </div>

        {/* ── Description ── */}
        {boost.description && (
          <div style={{
            background: cardBg, border: `1px solid ${cardBorder}`,
            borderRadius: 16, padding: "20px 22px", marginBottom: 10,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              {isRu ? "О себе" : "About"}
            </div>
            <div style={{ fontSize: 14, color: textPrimary, lineHeight: 1.7, opacity: 0.8 }}>
              {boost.description}
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <div style={{
          background: cardBg, border: `1px solid ${cardBorder}`,
          borderRadius: 20, padding: "24px 26px",
          display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
          marginTop: 4,
        }}>
          {/* Avatar */}
          <div style={{
            width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
            background: col.dim, border: `2px solid ${col.glow}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: col.accent,
          }}>
            {boost.authorName.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginBottom: 3 }}>
              {isRu ? `${boost.authorName} ищет бустера` : `${boost.authorName} is looking for a booster`}
            </div>
            <div style={{ fontSize: 12, color: textMuted }}>
              {isRu ? "Напишите напрямую, чтобы взяться за заявку" : "Reach out directly to take this request"}
            </div>
          </div>

          <button
            onClick={() => {
              const c = boost.contact;
              const url = c.startsWith("http") ? c : c.includes("t.me") ? `https://${c}` : undefined;
              if (url) window.open(url, "_blank");
            }}
            style={{
              height: 46, padding: "0 28px", borderRadius: 12, flexShrink: 0,
              background: col.accent, border: "none", cursor: "pointer",
              color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 800, fontSize: 14,
              letterSpacing: "-0.01em",
              boxShadow: `0 4px 20px ${col.glow}`,
              transition: "opacity 0.15s, transform 0.12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {isRu ? "Написать" : "Contact"}
          </button>
        </div>

      </div>
    </div>
  );
}
