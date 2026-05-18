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

const GAME_COLORS: Record<string, { accent: string; dim: string; glow: string; bg: string }> = {
  "CS2":      { accent: "#ffab00", dim: "rgba(255,171,0,0.15)",  glow: "rgba(255,171,0,0.3)", bg: "#0d1117" },
  "Dota 2":   { accent: "#e05050", dim: "rgba(218,55,55,0.15)",  glow: "rgba(218,55,55,0.3)", bg: "#0c0e13" },
  "Valorant": { accent: "#ff4655", dim: "rgba(255,70,85,0.15)",  glow: "rgba(255,70,85,0.3)", bg: "#0f0e14" },
};

const GAME_LOGO: Record<string, string> = {
  "CS2":      "/games/cs2_new.png",
  "Dota 2":   "/games/dota2_new.png",
  "Valorant": "/games/valorant_new.png",
};

/* ── SVG preview for a boost card ───────────────── */
function MiniPreview({ boost }: { boost: Boost }) {
  const col = GAME_COLORS[boost.game] ?? { accent: "#888", dim: "rgba(128,128,128,0.15)", bg: "#111" };
  const bgMap: Record<string, string> = { "CS2": "#0d1117", "Dota 2": "#0c0e13", "Valorant": "#0f0e14" };
  const bg = bgMap[boost.game] ?? "#111";
  return (
    <svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%", height: "100%" }}>
      <rect width="280" height="200" fill={bg}/>
      <rect width="280" height="26" fill="rgba(255,255,255,0.04)"/>
      <circle cx="13" cy="13" r="3" fill="rgba(255,255,255,0.18)"/>
      <circle cx="22" cy="13" r="3" fill="rgba(255,255,255,0.18)"/>
      <circle cx="31" cy="13" r="3" fill="rgba(255,255,255,0.18)"/>
      <rect x="46" y="7" width="120" height="12" rx="3" fill="rgba(255,255,255,0.07)"/>
      <rect x="12" y="42" width="76" height="86" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      <circle cx="50" cy="70" r="19" fill={col.dim} stroke={col.accent} strokeWidth="0.8" strokeOpacity="0.5"/>
      <text x="50" y="75" textAnchor="middle" fill={col.accent} fontSize="9" fontWeight="900" fontFamily="Arial">
        {boost.game === "CS2" ? "CS2" : boost.game === "Dota 2" ? "D2" : "VAL"}
      </text>
      <text x="50" y="108" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="Arial">CURRENT</text>
      <text x="50" y="118" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="6.5" fontWeight="700" fontFamily="Arial">
        {boost.currentElo.length > 10 ? boost.currentElo.slice(0, 10) : boost.currentElo}
      </text>
      <line x1="96" y1="85" x2="114" y2="85" stroke={col.accent} strokeWidth="1.5" strokeOpacity="0.7"/>
      <polygon points="114,81 120,85 114,89" fill={col.accent} opacity="0.7"/>
      <rect x="124" y="42" width="76" height="86" rx="8" fill={col.dim} stroke={col.accent} strokeWidth="0.5" strokeOpacity="0.4"/>
      <circle cx="162" cy="70" r="19" fill="rgba(0,0,0,0.25)" stroke={col.accent} strokeWidth="1.2" strokeOpacity="0.9"/>
      <text x="162" y="75" textAnchor="middle" fill={col.accent} fontSize="9" fontWeight="900" fontFamily="Arial">
        {boost.game === "CS2" ? "CS2" : boost.game === "Dota 2" ? "D2" : "VAL"}
      </text>
      <text x="162" y="108" textAnchor="middle" fill={col.accent} fontSize="6" fontFamily="Arial" opacity="0.8">TARGET</text>
      <text x="162" y="118" textAnchor="middle" fill={col.accent} fontSize="6.5" fontWeight="700" fontFamily="Arial">
        {boost.desiredElo.length > 10 ? boost.desiredElo.slice(0, 10) : boost.desiredElo}
      </text>
      <rect x="208" y="42" width="60" height="34" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5"/>
      <text x="238" y="55" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="5.5" fontFamily="Arial">BUDGET</text>
      <text x="238" y="69" textAnchor="middle" fill="#f0f0ee" fontSize="12" fontWeight="700" fontFamily="Arial">${Number(boost.budget).toFixed(0)}</text>
      <rect x="12" y="138" width="256" height="7" rx="2.5" fill="rgba(255,255,255,0.06)"/>
      <rect x="12" y="151" width="190" height="6" rx="2" fill="rgba(255,255,255,0.04)"/>
      <rect x="12" y="163" width="130" height="5" rx="2" fill="rgba(255,255,255,0.03)"/>
      <rect x="0" y="197" width="280" height="3" fill={col.accent} opacity="0.45"/>
    </svg>
  );
}

/* ── Rank visual (big center panel) ─────────────── */
function RankVisual({ boost, col }: { boost: Boost; col: typeof GAME_COLORS[string] }) {
  return (
    <div style={{
      background: col.bg, borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.07)",
      position: "relative", overflow: "hidden",
      minHeight: 360, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${col.accent}15 1px, transparent 0)`,
        backgroundSize: "28px 28px", opacity: 0.5,
      }}/>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 320, height: 320, borderRadius: "50%",
        background: `radial-gradient(circle, ${col.glow} 0%, transparent 70%)`,
        pointerEvents: "none",
      }}/>
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 28, padding: "40px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%",
              background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
            }}>
              <img src={GAME_LOGO[boost.game]} alt={boost.game} style={{ width: 52, height: 52, objectFit: "contain", opacity: 0.55 }}/>
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>Current</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontFamily: "var(--app-font-sans)", maxWidth: 120, textAlign: "center" }}>{boost.currentElo}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 64, height: 2, background: `linear-gradient(to right, rgba(255,255,255,0.12), ${col.accent})`, borderRadius: 2 }}/>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: `${col.accent}20`, border: `1.5px solid ${col.accent}55`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 18px ${col.glow}`,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={col.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
            <div style={{ width: 64, height: 2, background: `linear-gradient(to right, ${col.accent}, rgba(255,255,255,0.12))`, borderRadius: 2 }}/>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%",
              background: `${col.accent}18`, border: `2px solid ${col.accent}50`,
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
              boxShadow: `0 0 28px ${col.glow}`,
            }}>
              <img src={GAME_LOGO[boost.game]} alt={boost.game} style={{ width: 52, height: 52, objectFit: "contain" }}/>
            </div>
            <div style={{ fontSize: 9, color: `${col.accent}99`, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>Target</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: col.accent, fontFamily: "var(--app-font-sans)", maxWidth: 120, textAlign: "center" }}>{boost.desiredElo}</div>
          </div>
        </div>
        <div style={{ width: "75%", maxWidth: 280 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Progress</span>
            <span style={{ fontSize: 9, color: col.accent, fontWeight: 700 }}>0%</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)" }}>
            <div style={{ width: "0%", height: "100%", borderRadius: 2, background: `linear-gradient(to right, ${col.accent}, ${col.glow})` }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────── */
export default function BoostDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLang();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [, navigate] = useLocation();
  const isRu = lang === "ru";
  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [boost, setBoost] = useState<Boost | null>(null);
  const [allBoosts, setAllBoosts] = useState<Boost[]>([]);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"screens" | "flows">("screens");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const all = loadBoosts();
    setAllBoosts(all);
    setBoost(all.find(b => b.id === id) ?? null);
  }, [id, user]);

  if (!user) return null;

  const pageBg = isDark ? "#111111" : "#f5f5f4";
  const textPrimary = isDark ? "#f0f0ee" : "#131415";
  const textMuted = isDark ? "rgba(240,240,238,0.4)" : "#888";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";

  /* Not found */
  if (!boost) {
    return (
      <div style={{ minHeight: "100dvh", background: pageBg, fontFamily: "var(--app-font-sans)" }}>
        <Navbar/>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100dvh - 60px)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: textPrimary, marginBottom: 8 }}>
              {isRu ? "Заявка не найдена" : "Request not found"}
            </div>
            <button onClick={() => navigate("/boosts")} style={{
              marginTop: 8, height: 42, padding: "0 20px", borderRadius: 10,
              background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
              border: "none", cursor: "pointer", color: textPrimary,
              fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14,
            }}>
              {isRu ? "К заявкам" : "Back to requests"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const col = GAME_COLORS[boost.game] ?? { accent: "#f0f0ee", dim: "rgba(240,240,238,0.1)", glow: "rgba(240,240,238,0.15)", bg: "#111" };
  const budgetDisplay = isRu
    ? `₽${Math.round(Number(boost.budget) * USD_TO_RUB).toLocaleString("ru-RU")}`
    : `$${Number(boost.budget).toFixed(0)}`;
  const createdDate = new Date(boost.createdAt).toLocaleDateString(isRu ? "ru-RU" : "en-US", { day: "numeric", month: "long", year: "numeric" });
  const similar = allBoosts.filter(b => b.id !== boost.id && b.game === boost.game);
  const tabContent = activeTab === "screens" ? [boost, ...similar].slice(0, 12) : similar.slice(0, 9);

  return (
    <div style={{ minHeight: "100dvh", background: pageBg, fontFamily: "var(--app-font-sans)" }}>
      <Navbar/>

      {/* ── Page content ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* ── App header section (Mobbin style) ── */}
        <div style={{ marginBottom: 20 }}>

          {/* Icon */}
          <div style={{
            width: 86, height: 86, borderRadius: 22, marginBottom: 14, flexShrink: 0,
            background: `linear-gradient(135deg, ${col.bg} 0%, ${col.dim} 100%)`,
            border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : borderColor}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 24px ${col.glow}`,
            overflow: "hidden",
          }}>
            <img src={GAME_LOGO[boost.game]} alt={boost.game} style={{ width: 52, height: 52, objectFit: "contain" }}/>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <h1 style={{
              margin: 0, padding: 0, fontFamily: "var(--app-font-sans)",
              fontSize: 30, fontWeight: 800, letterSpacing: "-0.025em",
              color: textPrimary, lineHeight: 1.15,
            }}>
              {boost.authorName} —<br/>
              <span style={{ color: textPrimary }}>{boost.game} {isRu ? "Буст" : "Boost"}</span>
            </h1>
          </div>

          {/* CTA Banner */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
            border: `1px solid ${borderColor}`,
            borderRadius: 10, padding: "11px 16px", marginBottom: 18,
            flexWrap: "wrap", gap: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: "0.06em",
                background: col.accent, color: "#111", borderRadius: 5, padding: "2px 7px",
                textTransform: "uppercase", flexShrink: 0,
              }}>
                {boost.game}
              </span>
              <span style={{ fontSize: 13, color: textMuted, fontFamily: "var(--app-font-sans)" }}>
                {isRu
                  ? `Свяжитесь с бустером для получения заявки — `
                  : `Contact the booster to take this request — `}
                <span style={{ color: col.accent, fontWeight: 600 }}>{boost.contact}</span>
              </span>
            </div>
            <button
              onClick={() => {
                const c = boost.contact;
                const url = c.startsWith("http") ? c : c.startsWith("@") ? `https://t.me/${c.slice(1)}` : undefined;
                if (url) window.open(url, "_blank");
              }}
              style={{
                height: 30, padding: "0 14px", borderRadius: 7, border: "none", cursor: "pointer",
                background: col.accent, color: "#111",
                fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 12,
                flexShrink: 0, transition: "opacity 0.12s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {isRu ? "Написать" : "Contact"}
            </button>
          </div>

          {/* Metadata row */}
          <div style={{ display: "flex", gap: 28, marginBottom: 16, flexWrap: "wrap" }}>
            {[
              { label: isRu ? "Игра" : "Game",      value: boost.game },
              { label: isRu ? "Бюджет" : "Budget",  value: budgetDisplay },
              { label: isRu ? "Текущий" : "Current", value: boost.currentElo },
              { label: isRu ? "Цель" : "Target",    value: boost.desiredElo },
              { label: isRu ? "Дата" : "Posted",    value: createdDate },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: textMuted, fontFamily: "var(--app-font-sans)", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, fontFamily: "var(--app-font-sans)" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => setSaved(v => !v)}
              style={{
                height: 34, padding: "0 16px", borderRadius: 8,
                background: saved ? col.dim : (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"),
                border: saved ? `1px solid ${col.accent}50` : `1px solid ${borderColor}`,
                color: saved ? col.accent : textPrimary,
                cursor: "pointer", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 13,
                display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              {isRu ? "Сохранить" : "Save"}
            </button>
            <button style={{
              height: 34, width: 34, borderRadius: 8,
              background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
              border: `1px solid ${borderColor}`,
              color: textMuted, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = textPrimary)}
            onMouseLeave={e => (e.currentTarget.style.color = textMuted)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Tab bar (Mobbin style) ── */}
        <div style={{
          display: "flex", alignItems: "center",
          borderBottom: `1px solid ${borderColor}`,
          marginBottom: 24, gap: 2,
        }}>
          {/* Tabs */}
          {(["screens", "flows"] as const).map(tab => {
            const isActive = activeTab === tab;
            const labels: Record<string, string> = {
              screens: isRu ? "Экраны" : "Screens",
              flows: isRu ? "Флоу" : "Flows",
            };
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                height: 42, padding: "0 14px", border: "none", cursor: "pointer",
                background: "transparent", fontFamily: "var(--app-font-sans)",
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? textPrimary : textMuted,
                borderBottom: isActive ? `2px solid ${textPrimary}` : "2px solid transparent",
                marginBottom: -1, transition: "color 0.15s",
              }}>
                {labels[tab]}
              </button>
            );
          })}

          {/* Divider */}
          <div style={{ width: 1, height: 18, background: borderColor, margin: "0 8px" }}/>

          {/* View dropdown pill */}
          <button style={{
            height: 30, padding: "0 10px", borderRadius: 7,
            border: `1px solid ${borderColor}`,
            background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 12, fontWeight: 500, color: textMuted, fontFamily: "var(--app-font-sans)",
          }}>
            {isRu ? "Сетка" : "Grid"}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Clock icon */}
          <button style={{
            width: 30, height: 30, borderRadius: 7, border: `1px solid ${borderColor}`,
            background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: textMuted,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </button>

          {/* Filter icon */}
          <button style={{
            width: 30, height: 30, borderRadius: 7, border: `1px solid ${borderColor}`,
            background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: textMuted,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
          </button>

          {/* Count label (right) */}
          <div style={{ marginLeft: "auto", fontSize: 11, color: textMuted, fontFamily: "var(--app-font-sans)" }}>
            {isRu ? `Показано ${tabContent.length} экранов` : `Showing ${tabContent.length} screens`}
          </div>
        </div>

        {/* ── Screen grid ── */}
        {activeTab === "screens" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {/* First card = RankVisual (large, spans column) */}
            <ScreenCard
              boost={boost}
              col={col}
              isMain
              isDark={isDark}
              onClick={() => {}}
            />
            {tabContent.slice(1).map(b => (
              <ScreenCard
                key={b.id}
                boost={b}
                col={GAME_COLORS[b.game] ?? col}
                isDark={isDark}
                onClick={() => navigate(`/boosts/${b.id}`)}
              />
            ))}
            {/* Description card if present */}
            {boost.description && <DescriptionCard text={boost.description} col={col} isDark={isDark}/>}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {similar.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 0", color: textMuted, fontSize: 14, fontFamily: "var(--app-font-sans)" }}>
                {isRu ? "Похожих заявок пока нет" : "No similar requests yet"}
              </div>
            ) : similar.map(b => (
              <ScreenCard
                key={b.id}
                boost={b}
                col={GAME_COLORS[b.game] ?? col}
                isDark={isDark}
                onClick={() => navigate(`/boosts/${b.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Screen card ─────────────────────────────────── */
function ScreenCard({ boost, col, isMain = false, isDark, onClick }: {
  boost: Boost; col: typeof GAME_COLORS[string]; isMain?: boolean; isDark: boolean; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  const cardBg = isDark ? "#1a1a1a" : "#e4e4e2";
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 18, overflow: "hidden", cursor: onClick ? "pointer" : "default",
        background: cardBg,
        transform: hov && !isMain ? "translateY(-4px)" : "none",
        transition: "transform 0.18s",
        position: "relative",
      }}
    >
      {/* Highlight chip */}
      {isMain && (
        <div style={{
          position: "absolute", top: 12, left: 12, zIndex: 2,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
          borderRadius: 6, padding: "3px 9px",
          fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "0.03em",
        }}>
          Highlight
        </div>
      )}
      <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
        {isMain ? (
          <RankVisualMini boost={boost} col={col}/>
        ) : (
          <MiniPreview boost={boost}/>
        )}
      </div>
      {/* Footer */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? "#f0f0ee" : "#131415", fontFamily: "var(--app-font-sans)", marginBottom: 3 }}>
          {boost.authorName}
        </div>
        <div style={{ fontSize: 11, color: isDark ? "rgba(240,240,238,0.4)" : "#888", fontFamily: "var(--app-font-sans)" }}>
          {boost.currentElo} → {boost.desiredElo}
        </div>
      </div>
    </div>
  );
}

/* ── Inline rank visual for the main screen card ── */
function RankVisualMini({ boost, col }: { boost: Boost; col: typeof GAME_COLORS[string] }) {
  return (
    <div style={{
      width: "100%", height: "100%", background: col.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${col.accent}18 1px, transparent 0)`,
        backgroundSize: "24px 24px",
      }}/>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 260, height: 260, borderRadius: "50%",
        background: `radial-gradient(circle, ${col.glow} 0%, transparent 70%)`,
      }}/>
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 20, padding: "20px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px",
          }}>
            <img src={GAME_LOGO[boost.game]} alt="" style={{ width: 38, height: 38, objectFit: "contain", opacity: 0.55 }}/>
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Current</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontFamily: "var(--app-font-sans)", maxWidth: 90, textAlign: "center" }}>{boost.currentElo}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: 44, height: 2, background: `linear-gradient(to right, rgba(255,255,255,0.1), ${col.accent})`, borderRadius: 2 }}/>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: `${col.accent}22`, border: `1.5px solid ${col.accent}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 12px ${col.glow}`,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={col.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
          <div style={{ width: 44, height: 2, background: `linear-gradient(to right, ${col.accent}, rgba(255,255,255,0.1))`, borderRadius: 2 }}/>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: `${col.accent}18`, border: `2px solid ${col.accent}50`,
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px",
            boxShadow: `0 0 20px ${col.glow}`,
          }}>
            <img src={GAME_LOGO[boost.game]} alt="" style={{ width: 38, height: 38, objectFit: "contain" }}/>
          </div>
          <div style={{ fontSize: 9, color: `${col.accent}99`, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Target</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: col.accent, fontFamily: "var(--app-font-sans)", maxWidth: 90, textAlign: "center" }}>{boost.desiredElo}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Description card ────────────────────────────── */
function DescriptionCard({ text, col, isDark }: { text: string; col: typeof GAME_COLORS[string]; isDark: boolean }) {
  return (
    <div style={{
      borderRadius: 18, overflow: "hidden",
      background: isDark ? "#1a1a1a" : "#e4e4e2",
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${col.accent}, ${col.glow})` }}/>
      <div style={{ padding: "18px 18px 20px" }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: isDark ? "rgba(240,240,238,0.3)" : "#aaa", marginBottom: 8, fontFamily: "var(--app-font-sans)" }}>
          Notes
        </div>
        <div style={{ fontSize: 13, color: isDark ? "rgba(240,240,238,0.75)" : "#444", fontFamily: "var(--app-font-sans)", lineHeight: 1.55 }}>
          {text}
        </div>
      </div>
    </div>
  );
}
