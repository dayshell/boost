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
  "CS2":      { accent: "#ffab00", dim: "rgba(255,171,0,0.13)",  glow: "rgba(255,171,0,0.25)", bg: "#0d1117" },
  "Dota 2":   { accent: "#e05050", dim: "rgba(218,55,55,0.13)",  glow: "rgba(218,55,55,0.25)", bg: "#0c0e13" },
  "Valorant": { accent: "#ff4655", dim: "rgba(255,70,85,0.13)",  glow: "rgba(255,70,85,0.25)", bg: "#0f0e14" },
};

const GAME_LOGO: Record<string, string> = {
  "CS2":      "/games/cs2_new.png",
  "Dota 2":   "/games/dota2_new.png",
  "Valorant": "/games/valorant_new.png",
};

/* ── Rank visualization panel ────────────────────── */
function RankVisual({ boost, col }: { boost: Boost; col: typeof GAME_COLORS[string] }) {
  const screens = [
    { id: 0, label: "Progress", icon: "📈" },
    { id: 1, label: "Details", icon: "📋" },
    { id: 2, label: "Timeline", icon: "⏱" },
  ];
  const [activeScreen, setActiveScreen] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%" }}>
      {/* Main viewer */}
      <div style={{
        flex: 1, background: col.bg,
        borderRadius: "16px 16px 0 0",
        border: `1px solid rgba(255,255,255,0.08)`,
        borderBottom: "none",
        position: "relative", overflow: "hidden",
        minHeight: 380,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* Subtle grid background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle at 1px 1px, ${col.accent}18 1px, transparent 0)`,
          backgroundSize: "32px 32px",
          opacity: 0.4,
        }} />

        {/* Glow center */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 300, height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${col.glow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {activeScreen === 0 && (
          /* Progress view */
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 32, padding: "40px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {/* Current rank */}
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: 90, height: 90, borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: `2px solid rgba(255,255,255,0.12)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 10, margin: "0 auto 10px",
                }}>
                  <img src={GAME_LOGO[boost.game]} alt={boost.game} style={{ width: 48, height: 48, objectFit: "contain", opacity: 0.6 }} />
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Current</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontFamily: "var(--app-font-sans)", maxWidth: 110, textAlign: "center" }}>
                  {boost.currentElo}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 60, height: 2, background: `linear-gradient(to right, rgba(255,255,255,0.15), ${col.accent})`, borderRadius: 2 }} />
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `${col.accent}22`, border: `1.5px solid ${col.accent}66`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 0 16px ${col.glow}`,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={col.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
                <div style={{ width: 60, height: 2, background: `linear-gradient(to right, ${col.accent}, rgba(255,255,255,0.15))`, borderRadius: 2 }} />
              </div>

              {/* Target rank */}
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: 90, height: 90, borderRadius: "50%",
                  background: `${col.accent}18`,
                  border: `2px solid ${col.accent}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 10px",
                  boxShadow: `0 0 24px ${col.glow}`,
                }}>
                  <img src={GAME_LOGO[boost.game]} alt={boost.game} style={{ width: 48, height: 48, objectFit: "contain" }} />
                </div>
                <div style={{ fontSize: 10, color: `${col.accent}99`, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Target</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: col.accent, fontFamily: "var(--app-font-sans)", maxWidth: 110, textAlign: "center" }}>
                  {boost.desiredElo}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ width: "80%", maxWidth: 300 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Progress</span>
                <span style={{ fontSize: 10, color: col.accent, fontWeight: 700 }}>0%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)" }}>
                <div style={{ width: "0%", height: "100%", borderRadius: 2, background: `linear-gradient(to right, ${col.accent}, ${col.glow})` }} />
              </div>
            </div>
          </div>
        )}

        {activeScreen === 1 && (
          /* Details view */
          <div style={{ position: "relative", zIndex: 1, padding: "32px 28px", width: "100%", boxSizing: "border-box" }}>
            {[
              { label: "Game", value: boost.game },
              { label: "Current Rank", value: boost.currentElo },
              { label: "Target Rank", value: boost.desiredElo },
              { label: "Budget", value: `$${Number(boost.budget).toFixed(0)}` },
              { label: "Available", value: `${boost.timeFrom} – ${boost.timeTo}` },
              { label: "Contact", value: boost.contact },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f0f0ee", fontFamily: "var(--app-font-sans)" }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {activeScreen === 2 && (
          /* Timeline view */
          <div style={{ position: "relative", zIndex: 1, padding: "32px 28px", width: "100%", boxSizing: "border-box" }}>
            {[
              { status: "done", label: "Request posted", time: new Date(boost.createdAt).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }) },
              { status: "active", label: "Waiting for booster", time: "Now" },
              { status: "pending", label: "Boost in progress", time: "—" },
              { status: "pending", label: "Rank achieved", time: "—" },
            ].map(({ status, label, time }, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: status === "done" ? col.accent : status === "active" ? `${col.accent}33` : "rgba(255,255,255,0.06)",
                    border: status === "active" ? `2px solid ${col.accent}` : "2px solid transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: status === "active" ? `0 0 10px ${col.glow}` : "none",
                  }}>
                    {status === "done" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    {status === "active" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.accent }} />}
                  </div>
                  {i < 3 && <div style={{ width: 1, height: 24, background: status === "done" ? `${col.accent}44` : "rgba(255,255,255,0.07)", marginTop: 4 }} />}
                </div>
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: status === "pending" ? "rgba(255,255,255,0.3)" : "#f0f0ee", fontFamily: "var(--app-font-sans)", marginBottom: 2 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{time}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nav arrows */}
        {activeScreen > 0 && (
          <button onClick={() => setActiveScreen(s => s - 1)} style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#f0f0ee", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        )}
        {activeScreen < screens.length - 1 && (
          <button onClick={() => setActiveScreen(s => s + 1)} style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#f0f0ee", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        )}

        {/* Screen label top-right */}
        <div style={{
          position: "absolute", top: 14, left: 14,
          background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, padding: "4px 10px",
          fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.55)",
          fontFamily: "var(--app-font-sans)", letterSpacing: "0.03em",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span>{screens[activeScreen].icon}</span>
          <span>{screens[activeScreen].label}</span>
        </div>

        {/* Screen counter */}
        <div style={{
          position: "absolute", top: 14, right: 14,
          fontSize: 11, color: "rgba(255,255,255,0.3)",
          fontFamily: "var(--app-font-sans)",
        }}>
          {activeScreen + 1} / {screens.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div style={{
        display: "flex", gap: 8, padding: "10px 12px",
        background: "rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderTop: "none",
        borderRadius: "0 0 16px 16px",
      }}>
        {screens.map((s, i) => (
          <button key={s.id} onClick={() => setActiveScreen(i)} style={{
            flex: 1, height: 52, borderRadius: 8, border: "none", cursor: "pointer",
            background: i === activeScreen ? `${col.accent}18` : "rgba(255,255,255,0.05)",
            outline: i === activeScreen ? `1.5px solid ${col.accent}55` : "none",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 3, transition: "all 0.15s",
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>{s.icon}</span>
            <span style={{
              fontSize: 9, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
              color: i === activeScreen ? col.accent : "rgba(255,255,255,0.35)",
              fontFamily: "var(--app-font-sans)",
            }}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Similar boost card ───────────────────────────── */
function SimilarCard({ boost, onClick, col }: { boost: Boost; onClick: () => void; col: typeof GAME_COLORS[string] }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 10,
      padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)",
      background: hov ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
      cursor: "pointer", textAlign: "left", transition: "all 0.15s",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: col.dim, border: `1px solid ${col.glow}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <img src={GAME_LOGO[boost.game]} alt={boost.game} style={{ width: 20, height: 20, objectFit: "contain" }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#f0f0ee", fontFamily: "var(--app-font-sans)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 1 }}>
          {boost.authorName}
        </div>
        <div style={{ fontSize: 10, color: "rgba(240,240,238,0.35)", fontFamily: "var(--app-font-sans)" }}>
          {boost.currentElo} → {boost.desiredElo}
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: col.accent, fontFamily: "var(--app-font-sans)", flexShrink: 0 }}>
        ${Number(boost.budget).toFixed(0)}
      </div>
    </button>
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

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const all = loadBoosts();
    setAllBoosts(all);
    const found = all.find(b => b.id === id) ?? null;
    setBoost(found);
  }, [id, user]);

  if (!user) return null;

  if (!boost) {
    return (
      <div style={{ minHeight: "100dvh", background: "#111111", fontFamily: "var(--app-font-sans)" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100dvh - 60px)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#f0f0ee", marginBottom: 8 }}>
              {isRu ? "Заявка не найдена" : "Request not found"}
            </div>
            <button onClick={() => navigate("/boosts")} style={{
              marginTop: 8, height: 42, padding: "0 20px", borderRadius: 10,
              background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer",
              color: "#f0f0ee", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14,
            }}>
              {isRu ? "К заявкам" : "Back to requests"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const col = GAME_COLORS[boost.game] ?? { accent: "#f0f0ee", dim: "rgba(240,240,238,0.1)", glow: "rgba(240,240,238,0.15)", bg: "#111111" };
  const budgetDisplay = isRu
    ? `₽${Math.round(Number(boost.budget) * USD_TO_RUB).toLocaleString("ru-RU")}`
    : `$${Number(boost.budget).toFixed(0)}`;

  const createdDate = new Date(boost.createdAt).toLocaleDateString(isRu ? "ru-RU" : "en-US", {
    day: "numeric", month: "long", year: "numeric",
  });

  const similar = allBoosts.filter(b => b.id !== boost.id && b.game === boost.game).slice(0, 4);

  return (
    <div style={{ minHeight: "100dvh", background: "#111111", fontFamily: "var(--app-font-sans)" }}>
      <Navbar />

      {/* ── Sticky sub-header (Mobbin style) ── */}
      <div style={{
        position: "sticky", top: 60, zIndex: 40,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(17,17,17,0.92)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 20px",
          height: 52, display: "flex", alignItems: "center", gap: 12,
        }}>
          {/* Breadcrumb */}
          <button onClick={() => navigate("/boosts")} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            display: "flex", alignItems: "center", gap: 5,
            color: "rgba(240,240,238,0.4)", fontFamily: "var(--app-font-sans)", fontSize: 13, fontWeight: 500,
            transition: "color 0.15s", flexShrink: 0,
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f0f0ee")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,240,238,0.4)")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {isRu ? "Бусты" : "Boosts"}
          </button>

          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 16, lineHeight: 1 }}>/</span>

          <span style={{ fontSize: 13, fontWeight: 600, color: "#f0f0ee", fontFamily: "var(--app-font-sans)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {boost.authorName}
          </span>

          {/* Game badge */}
          <span style={{
            flexShrink: 0, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
            background: col.dim, color: col.accent, letterSpacing: "0.04em",
            border: `1px solid ${col.glow}`,
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <img src={GAME_LOGO[boost.game]} alt={boost.game} style={{ width: 12, height: 12, objectFit: "contain" }} />
            {boost.game}
          </span>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {/* Save button */}
            <button onClick={() => setSaved(v => !v)} style={{
              height: 32, padding: "0 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
              background: saved ? `${col.accent}18` : "rgba(255,255,255,0.05)",
              color: saved ? col.accent : "rgba(240,240,238,0.6)",
              cursor: "pointer", fontFamily: "var(--app-font-sans)", fontSize: 12, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {isRu ? "Сохранить" : "Save"}
            </button>

            {/* Share button */}
            <button style={{
              height: 32, width: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)", color: "rgba(240,240,238,0.6)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main two-column layout ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 64px", display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* ── Left sidebar (Mobbin style) ── */}
        <div style={{ width: 290, flexShrink: 0, position: "sticky", top: 122 }}>

          {/* App identity card */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18, overflow: "hidden",
            marginBottom: 12,
          }}>
            {/* Game color top bar */}
            <div style={{ height: 3, background: `linear-gradient(90deg, ${col.accent}, ${col.glow})` }} />

            <div style={{ padding: "20px 18px 18px" }}>
              {/* Avatar + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 14, flexShrink: 0,
                  background: col.dim, border: `2px solid ${col.glow}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, fontWeight: 700, color: col.accent, fontFamily: "var(--app-font-sans)",
                  boxShadow: `0 0 20px ${col.glow}`,
                }}>
                  {boost.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f0ee", fontFamily: "var(--app-font-sans)", letterSpacing: "-0.02em", marginBottom: 2 }}>
                    {boost.authorName}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(240,240,238,0.35)", fontFamily: "var(--app-font-sans)" }}>
                    {createdDate}
                  </div>
                </div>
              </div>

              {/* Game platform badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "5px 10px",
                  background: col.dim, borderRadius: 8, border: `1px solid ${col.glow}`,
                }}>
                  <img src={GAME_LOGO[boost.game]} alt={boost.game} style={{ width: 16, height: 16, objectFit: "contain" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: col.accent, fontFamily: "var(--app-font-sans)" }}>{boost.game}</span>
                </div>
                <div style={{
                  padding: "5px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: 11, color: "rgba(240,240,238,0.45)", fontFamily: "var(--app-font-sans)",
                }}>
                  {isRu ? "Буст" : "Boost"}
                </div>
              </div>

              {/* Budget highlight */}
              <div style={{
                background: "rgba(255,255,255,0.04)", borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.07)", padding: "12px 14px",
                marginBottom: 14,
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(240,240,238,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                  {isRu ? "Бюджет" : "Budget"}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#f0f0ee", fontFamily: "var(--app-font-sans)", letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>
                  {budgetDisplay}
                </div>
              </div>

              {/* Meta rows */}
              {[
                { icon: "🎯", label: isRu ? "Текущий" : "Current", value: boost.currentElo },
                { icon: "🏆", label: isRu ? "Цель" : "Target", value: boost.desiredElo },
                { icon: "⏰", label: isRu ? "Время" : "Hours", value: `${boost.timeFrom}–${boost.timeTo}` },
                { icon: "📡", label: isRu ? "Контакт" : "Contact", value: boost.contact },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 0",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  fontSize: 12,
                }}>
                  <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
                  <span style={{ color: "rgba(240,240,238,0.35)", fontFamily: "var(--app-font-sans)", flexShrink: 0, minWidth: 52 }}>{label}</span>
                  <span style={{
                    color: "#f0f0ee", fontFamily: "var(--app-font-sans)", fontWeight: 600,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{value}</span>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <div style={{ padding: "0 18px 18px" }}>
              <button
                onClick={() => {
                  const c = boost.contact;
                  const url = c.startsWith("http") ? c : c.includes("t.me") ? `https://${c}` : undefined;
                  if (url) window.open(url, "_blank");
                }}
                style={{
                  width: "100%", height: 44, borderRadius: 11, border: "none", cursor: "pointer",
                  background: col.accent, color: "#111",
                  fontFamily: "var(--app-font-sans)", fontWeight: 800, fontSize: 14, letterSpacing: "-0.01em",
                  boxShadow: `0 4px 24px ${col.glow}`,
                  transition: "opacity 0.15s, transform 0.12s",
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {isRu ? "Взяться за заявку" : "Take this request"}
              </button>
            </div>
          </div>

          {/* Similar boosts (Mobbin "Flows" section) */}
          {similar.length > 0 && (
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 18, padding: "16px 14px",
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: "rgba(240,240,238,0.35)",
                letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10,
                padding: "0 2px",
              }}>
                {isRu ? "Похожие заявки" : "Similar requests"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {similar.map(b => (
                  <SimilarCard
                    key={b.id} boost={b}
                    col={GAME_COLORS[b.game] ?? col}
                    onClick={() => navigate(`/boosts/${b.id}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Main content area ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Screen viewer */}
          <RankVisual boost={boost} col={col} />

          {/* Description section */}
          {boost.description && (
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "20px 22px", marginTop: 12,
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: "rgba(240,240,238,0.35)",
                letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10,
              }}>
                {isRu ? "О заявке" : "About"}
              </div>
              <p style={{
                margin: 0, fontSize: 14, color: "rgba(240,240,238,0.75)",
                lineHeight: 1.7, fontFamily: "var(--app-font-sans)",
              }}>
                {boost.description}
              </p>
            </div>
          )}

          {/* Tags / metadata chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 }}>
            {[
              boost.game,
              `${boost.currentElo} → ${boost.desiredElo}`,
              `${boost.timeFrom}–${boost.timeTo}`,
              isRu ? "Быстрый буст" : "Fast boost",
              isRu ? "Безопасно" : "Safe",
            ].map(tag => (
              <span key={tag} style={{
                padding: "6px 12px", borderRadius: 20,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                fontSize: 11, color: "rgba(240,240,238,0.5)", fontFamily: "var(--app-font-sans)",
                fontWeight: 500,
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* About section (Mobbin style "About X" panel) */}
          <div style={{
            marginTop: 12,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, padding: "20px 22px",
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: "rgba(240,240,238,0.35)",
              letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14,
            }}>
              {isRu ? "Детали заявки" : "Request Details"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: isRu ? "Игра" : "Game", value: boost.game, accent: col.accent },
                { label: isRu ? "Бюджет" : "Budget", value: budgetDisplay, accent: col.accent },
                { label: isRu ? "Текущий ранг" : "Current Rank", value: boost.currentElo },
                { label: isRu ? "Желаемый ранг" : "Target Rank", value: boost.desiredElo, accent: col.accent },
                { label: isRu ? "Доступно" : "Available", value: `${boost.timeFrom} – ${boost.timeTo}` },
                { label: isRu ? "Размещено" : "Posted", value: createdDate },
              ].map(({ label, value, accent }) => (
                <div key={label} style={{
                  background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "14px 16px",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(240,240,238,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: accent ?? "#f0f0ee", fontFamily: "var(--app-font-sans)", letterSpacing: "-0.01em" }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
