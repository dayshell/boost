import { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import { useLang } from "../LangContext";
import { useLocation } from "wouter";
import Navbar, { SearchContext } from "../components/Navbar";
import { createPortal } from "react-dom";

export interface Boost {
  id: string;
  authorName: string;
  authorEmail: string;
  game: "CS2" | "Dota 2" | "Valorant";
  currentElo: string;
  desiredElo: string;
  contact: string;
  description: string;
  timeFrom: string;
  timeTo: string;
  budget: string;
  createdAt: string;
}

const GAMES = ["CS2", "Dota 2", "Valorant"] as const;

const GAME_COLORS: Record<string, { accent: string; dim: string; gradient: string }> = {
  "CS2":      { accent: "#ffab00", dim: "rgba(255,171,0,0.18)",  gradient: "radial-gradient(ellipse at 30% 40%, rgba(255,171,0,0.22) 0%, transparent 65%), radial-gradient(ellipse at 75% 65%, rgba(255,140,0,0.12) 0%, transparent 55%)" },
  "Dota 2":   { accent: "#e05050", dim: "rgba(218,55,55,0.18)",  gradient: "radial-gradient(ellipse at 30% 40%, rgba(200,40,40,0.25) 0%, transparent 65%), radial-gradient(ellipse at 75% 65%, rgba(160,30,30,0.15) 0%, transparent 55%)" },
  "Valorant": { accent: "#ff4655", dim: "rgba(255,70,85,0.18)",  gradient: "radial-gradient(ellipse at 30% 40%, rgba(255,50,70,0.25) 0%, transparent 65%), radial-gradient(ellipse at 75% 65%, rgba(200,30,50,0.15) 0%, transparent 55%)" },
};

/* ── Seed data ──────────────────────────────────── */
const SEED_BOOSTS: Boost[] = [
  { id: "seed-1", authorName: "Артём K.", authorEmail: "artem@example.com", game: "CS2", currentElo: "Silver 3", desiredElo: "Gold Nova 2", contact: "@artem_boost", description: "Аккаунт чистый, без банов. Хочу побыстрее — готов к овертайму.", timeFrom: "10:00", timeTo: "23:00", budget: "35.00", createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
  { id: "seed-2", authorName: "Maksim_D", authorEmail: "maks@example.com", game: "Valorant", currentElo: "Iron 2", desiredElo: "Bronze 3", contact: "discord: maks#4421", description: "Нужно поднять до Bronze 3 как можно скорее.", timeFrom: "18:00", timeTo: "02:00", budget: "28.00", createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: "seed-3", authorName: "SerpentX", authorEmail: "serp@example.com", game: "Dota 2", currentElo: "1 800 MMR", desiredElo: "2 500 MMR", contact: "@serpentx_dota", description: "Жду быстрого буста, аккаунт готов.", timeFrom: "09:00", timeTo: "21:00", budget: "60.00", createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "seed-4", authorName: "nika_val", authorEmail: "nika@example.com", game: "Valorant", currentElo: "Silver 1", desiredElo: "Platinum 1", contact: "t.me/nika_boost", description: "Хочу в платину до конца сезона. Аккаунт с 300+ матчами.", timeFrom: "11:00", timeTo: "20:00", budget: "90.00", createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { id: "seed-5", authorName: "ProPlayerZero", authorEmail: "zero@example.com", game: "CS2", currentElo: "MG1", desiredElo: "DMG", contact: "@zero_cs2", description: "Аккаунт старый, Prime статус есть.", timeFrom: "20:00", timeTo: "01:00", budget: "50.00", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: "seed-6", authorName: "ivannn99", authorEmail: "ivan99@example.com", game: "Dota 2", currentElo: "3 100 MMR", desiredElo: "4 000 MMR", contact: "vk.com/ivannn99", description: "900 MMR разрыв, бюджет обсуждаем.", timeFrom: "14:00", timeTo: "22:00", budget: "120.00", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: "seed-7", authorName: "DimaTwitch", authorEmail: "dima@example.com", game: "CS2", currentElo: "GN4", desiredElo: "Master Guardian Elite", contact: "discord: dima#7731", description: "Стримлю иногда — желательно не удалять игровую историю.", timeFrom: "00:00", timeTo: "06:00", budget: "42.00", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
  { id: "seed-8", authorName: "Alex_Boost", authorEmail: "alex@example.com", game: "Valorant", currentElo: "Gold 2", desiredElo: "Diamond 1", contact: "@alex_val", description: "Нужно до Даймонда, готов ждать неделю.", timeFrom: "12:00", timeTo: "23:00", budget: "150.00", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
];

function loadBoosts(): Boost[] {
  try {
    const raw = localStorage.getItem("boost_boosts");
    if (raw) return JSON.parse(raw);
    localStorage.setItem("boost_boosts", JSON.stringify(SEED_BOOSTS));
    return SEED_BOOSTS;
  } catch { return SEED_BOOSTS; }
}
export function saveBoosts(boosts: Boost[]) {
  localStorage.setItem("boost_boosts", JSON.stringify(boosts));
}

function timeAgo(dateStr: string, isRu: boolean): string {
  const diff = Math.round((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return isRu ? "только что" : "just now";
  if (diff < 60) return isRu ? `${diff} мин.` : `${diff}m ago`;
  if (diff < 1440) { const h = Math.round(diff / 60); return isRu ? `${h} ч.` : `${h}h ago`; }
  const d = Math.round(diff / 1440); return isRu ? `${d} д.` : `${d}d ago`;
}

function isNew(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() < 1000 * 60 * 60 * 3;
}

/* ── Game logo icon ──────────────────────────────── */
function GameLogo({ game, size = 28 }: { game: string; size?: number }) {
  const col = GAME_COLORS[game];
  const r = Math.round(size * 0.25);
  return (
    <div style={{
      width: size, height: size, borderRadius: r, flexShrink: 0,
      background: col.dim,
      display: "flex", alignItems: "center", justifyContent: "center",
      border: `1px solid rgba(255,255,255,0.07)`,
    }}>
      {game === "Valorant" ? (
        <svg width={size * 0.48} height={size * 0.48} viewBox="0 0 20 20" fill="none">
          <path d="M3 17L10 3l7 14H3z" fill={col.accent}/>
        </svg>
      ) : game === "CS2" ? (
        <span style={{ fontSize: size * 0.28, fontWeight: 800, color: col.accent, fontFamily: "var(--app-font-sans)", letterSpacing: "-0.04em", lineHeight: 1 }}>CS2</span>
      ) : (
        <span style={{ fontSize: size * 0.3, fontWeight: 800, color: col.accent, fontFamily: "var(--app-font-sans)", lineHeight: 1 }}>D2</span>
      )}
    </div>
  );
}

/* ── Card preview: mini game-stats screenshot ────── */
function CardPreview({ boost }: { boost: Boost }) {
  const col = GAME_COLORS[boost.game];
  // Simulate a browser screenshot background per game
  const bgColors: Record<string, string> = {
    "CS2":      "#0d1117",
    "Dota 2":   "#0c0e13",
    "Valorant": "#0f0e14",
  };
  const bg = bgColors[boost.game];

  return (
    <svg
      viewBox="0 0 280 180"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {/* Background */}
      <rect width="280" height="180" fill={bg}/>

      {/* Top bar (simulated browser/app bar) */}
      <rect width="280" height="28" fill="rgba(255,255,255,0.04)"/>
      <circle cx="14" cy="14" r="3.5" fill="rgba(255,255,255,0.15)"/>
      <circle cx="24" cy="14" r="3.5" fill="rgba(255,255,255,0.15)"/>
      <circle cx="34" cy="14" r="3.5" fill="rgba(255,255,255,0.15)"/>
      {/* URL bar */}
      <rect x="50" y="8" width="130" height="12" rx="3" fill="rgba(255,255,255,0.07)"/>

      {/* Main content area */}
      {/* Left: rank card */}
      <rect x="14" y="40" width="74" height="74" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      {/* Rank icon circle */}
      <circle cx="51" cy="65" r="16" fill={col.dim} stroke={col.accent} strokeWidth="0.8" strokeOpacity="0.6"/>
      {/* Game symbol in rank circle */}
      {boost.game === "Valorant" ? (
        <polygon points="51,52 62,76 40,76" fill={col.accent} opacity="0.9"/>
      ) : boost.game === "CS2" ? (
        <text x="51" y="69" textAnchor="middle" fill={col.accent} fontSize="8" fontWeight="800" fontFamily="Arial">CS2</text>
      ) : (
        <text x="51" y="69" textAnchor="middle" fill={col.accent} fontSize="8" fontWeight="800" fontFamily="Arial">D2</text>
      )}
      {/* Rank label */}
      <text x="51" y="103" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="6.5" fontFamily="Arial">CURRENT</text>
      <text x="51" y="112" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="7.5" fontWeight="bold" fontFamily="Arial">
        {boost.currentElo.length > 9 ? boost.currentElo.slice(0, 9) : boost.currentElo}
      </text>

      {/* Arrow between ranks */}
      <line x1="96" y1="77" x2="112" y2="77" stroke={col.accent} strokeWidth="1.5" strokeOpacity="0.8"/>
      <polygon points="112,73 118,77 112,81" fill={col.accent} opacity="0.8"/>

      {/* Right: target rank card */}
      <rect x="122" y="40" width="74" height="74" rx="8" fill={col.dim} stroke={col.accent} strokeWidth="0.5" strokeOpacity="0.5"/>
      <circle cx="159" cy="65" r="16" fill="rgba(0,0,0,0.3)" stroke={col.accent} strokeWidth="1"/>
      {boost.game === "Valorant" ? (
        <polygon points="159,52 170,76 148,76" fill={col.accent}/>
      ) : boost.game === "CS2" ? (
        <text x="159" y="69" textAnchor="middle" fill={col.accent} fontSize="8" fontWeight="800" fontFamily="Arial">CS2</text>
      ) : (
        <text x="159" y="69" textAnchor="middle" fill={col.accent} fontSize="8" fontWeight="800" fontFamily="Arial">D2</text>
      )}
      <text x="159" y="103" textAnchor="middle" fill={col.accent} fontSize="6.5" fontFamily="Arial" opacity="0.8">TARGET</text>
      <text x="159" y="112" textAnchor="middle" fill={col.accent} fontSize="7.5" fontWeight="bold" fontFamily="Arial">
        {boost.desiredElo.length > 9 ? boost.desiredElo.slice(0, 9) : boost.desiredElo}
      </text>

      {/* Budget pill */}
      <rect x="206" y="40" width="60" height="28" rx="6" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
      <text x="236" y="49" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="5.5" fontFamily="Arial">BUDGET</text>
      <text x="236" y="61" textAnchor="middle" fill="#f0f0ee" fontSize="10" fontWeight="bold" fontFamily="Arial">${Number(boost.budget).toFixed(0)}</text>

      {/* Time block */}
      <rect x="206" y="76" width="60" height="22" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
      <text x="236" y="85" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="5" fontFamily="Arial">TIME (MSK)</text>
      <text x="236" y="94" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="7" fontFamily="Arial">{boost.timeFrom}–{boost.timeTo}</text>

      {/* Bottom description bar */}
      <rect x="14" y="126" width="252" height="8" rx="3" fill="rgba(255,255,255,0.06)"/>
      <rect x="14" y="140" width="180" height="6" rx="2" fill="rgba(255,255,255,0.04)"/>
      <rect x="14" y="152" width="120" height="6" rx="2" fill="rgba(255,255,255,0.03)"/>

      {/* Accent line at bottom */}
      <rect x="0" y="176" width="280" height="4" fill={col.accent} opacity="0.35"/>
    </svg>
  );
}

/* ── Boost card — Mobbin-style ───────────────────── */
function BoostCard({ boost, onClick }: { boost: Boost; onClick: () => void }) {
  const { lang } = useLang();
  const isRu = lang === "ru";
  const [hov, setHov] = useState(false);
  const col = GAME_COLORS[boost.game];
  const fresh = isNew(boost.createdAt);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#1c1c1c",
        borderRadius: 16, overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov
          ? "0 0 0 1px rgba(255,255,255,0.12), 0 16px 40px rgba(0,0,0,0.5)"
          : "0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* ── Preview area — looks like a screenshot ── */}
      <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
        <CardPreview boost={boost} />

        {/* "New" badge — top left */}
        {fresh && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            background: "#f0f0ee", color: "#111",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.03em",
            borderRadius: 6, padding: "3px 7px",
            fontFamily: "var(--app-font-sans)",
          }}>
            New
          </div>
        )}

        {/* Bookmark icon — top right */}
        <div style={{
          position: "absolute", top: 9, right: 9,
          width: 26, height: 26, borderRadius: 6,
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: hov ? 1 : 0,
          transition: "opacity 0.15s",
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
      </div>

      {/* ── Card footer — exactly like Mobbin ── */}
      <div style={{
        padding: "12px 14px 14px",
        display: "flex", alignItems: "flex-start", gap: 10,
      }}>
        <GameLogo game={boost.game} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: "#f0f0ee",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            marginBottom: 3, lineHeight: 1.3,
          }}>
            {boost.authorName}
          </div>
          <div style={{
            fontSize: 11, color: "rgba(240,240,238,0.4)",
            overflow: "hidden", textOverflow: "ellipsis",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            lineHeight: 1.45,
          }}>
            {boost.description || `${boost.currentElo} → ${boost.desiredElo}`}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Filter dropdown ─────────────────────────────── */
function FilterDropdown({ activeGame, onSelect, onClose }: {
  activeGame: string | null;
  onSelect: (g: string | null) => void;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const isRu = lang === "ru";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{
      position: "absolute", top: "calc(100% + 6px)", right: 0,
      background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "5px", minWidth: 150,
      boxShadow: "0 12px 40px rgba(0,0,0,0.55)", zIndex: 200,
    }}>
      {([null, "CS2", "Dota 2", "Valorant"] as (string | null)[]).map(opt => {
        const active = activeGame === opt;
        const col = opt ? GAME_COLORS[opt] : null;
        return (
          <button key={opt ?? "all"} onClick={() => { onSelect(opt); onClose(); }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 9,
              padding: "8px 10px", borderRadius: 7, border: "none", cursor: "pointer",
              background: active ? "rgba(255,255,255,0.08)" : "transparent",
              color: active ? "#f0f0ee" : "rgba(240,240,238,0.5)",
              fontFamily: "var(--app-font-sans)", fontSize: 13, fontWeight: active ? 600 : 400,
              textAlign: "left", transition: "background 0.1s",
            }}
            onMouseEnter={e => !active && (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            onMouseLeave={e => !active && (e.currentTarget.style.background = "transparent")}
          >
            {opt ? <GameLogo game={opt} size={18} /> : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
            )}
            {opt ?? (isRu ? "Все игры" : "All games")}
            {active && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={col?.accent ?? "#f0f0ee"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "auto" }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Create Boost Modal ─────────────────────────── */
function CreateBoostModal({ onClose, onCreated }: { onClose: () => void; onCreated: (b: Boost) => void }) {
  const { user } = useAuth();
  const { lang } = useLang();
  const isRu = lang === "ru";

  const [game, setGame] = useState<Boost["game"]>("CS2");
  const [currentElo, setCurrentElo] = useState("");
  const [desiredElo, setDesiredElo] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [timeFrom, setTimeFrom] = useState("10:00");
  const [timeTo, setTimeTo] = useState("22:00");
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const inp: React.CSSProperties = {
    width: "100%", height: 42, padding: "0 13px",
    borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#f0f0ee", fontFamily: "var(--app-font-sans)", fontSize: 14,
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
  };
  const lbl: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: "rgba(240,240,238,0.45)",
    letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 5, display: "block",
  };

  function submit() {
    const err: Record<string, boolean> = {};
    if (!currentElo.trim()) err.currentElo = true;
    if (!desiredElo.trim()) err.desiredElo = true;
    if (!contact.trim()) err.contact = true;
    if (!budget.trim()) err.budget = true;
    if (Object.keys(err).length) { setErrors(err); return; }
    const boost: Boost = {
      id: Date.now().toString(), authorName: user?.name ?? "User", authorEmail: user?.email ?? "",
      game, currentElo: currentElo.trim(), desiredElo: desiredElo.trim(),
      contact: contact.trim(), description: description.trim(),
      timeFrom, timeTo, budget: budget.trim(), createdAt: new Date().toISOString(),
    };
    const all = loadBoosts(); all.unshift(boost); saveBoosts(all);
    onCreated(boost); onClose();
  }

  return createPortal(
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        width: "100%", maxWidth: 520, background: "#161616",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18,
        boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
        maxHeight: "92vh", display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#f0f0ee", letterSpacing: "-0.02em" }}>
              {isRu ? "Новая заявка" : "New Boost Request"}
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(240,240,238,0.35)" }}>
              {isRu ? "Заполните детали и разместите заявку" : "Fill in the details and post"}
            </p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(240,240,238,0.6)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ padding: "18px 22px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={lbl}>{isRu ? "Игра" : "Game"}</label>
            <div style={{ display: "flex", gap: 7 }}>
              {GAMES.map(g => {
                const active = game === g;
                const col = GAME_COLORS[g];
                return (
                  <button key={g} onClick={() => setGame(g)} style={{
                    flex: 1, height: 38, borderRadius: 9, border: "none", cursor: "pointer",
                    background: active ? col.dim : "rgba(255,255,255,0.04)",
                    color: active ? col.accent : "rgba(240,240,238,0.4)",
                    fontFamily: "var(--app-font-sans)", fontWeight: active ? 700 : 400, fontSize: 13,
                    transition: "all 0.12s", outline: active ? `1px solid ${col.dim}` : "none", outlineOffset: 1,
                  }}>{g}</button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ ...lbl, color: errors.currentElo ? "#e05050" : "rgba(240,240,238,0.45)" }}>
                {isRu ? "Текущий ранг" : "Current rank"}
              </label>
              <input value={currentElo} onChange={e => { setCurrentElo(e.target.value); setErrors(p => ({ ...p, currentElo: false })); }} placeholder="Silver 2"
                style={{ ...inp, borderColor: errors.currentElo ? "#e05050" : "rgba(255,255,255,0.1)" }}
                onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.28)")}
                onBlur={e => (e.target.style.borderColor = errors.currentElo ? "#e05050" : "rgba(255,255,255,0.1)")} />
            </div>
            <div>
              <label style={{ ...lbl, color: errors.desiredElo ? "#e05050" : "rgba(240,240,238,0.45)" }}>
                {isRu ? "Желаемый ранг" : "Target rank"}
              </label>
              <input value={desiredElo} onChange={e => { setDesiredElo(e.target.value); setErrors(p => ({ ...p, desiredElo: false })); }} placeholder="Gold Nova 3"
                style={{ ...inp, borderColor: errors.desiredElo ? "#e05050" : "rgba(255,255,255,0.1)" }}
                onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.28)")}
                onBlur={e => (e.target.style.borderColor = errors.desiredElo ? "#e05050" : "rgba(255,255,255,0.1)")} />
            </div>
          </div>

          <div>
            <label style={{ ...lbl, color: errors.contact ? "#e05050" : "rgba(240,240,238,0.45)" }}>{isRu ? "Контакт" : "Contact"}</label>
            <input value={contact} onChange={e => { setContact(e.target.value); setErrors(p => ({ ...p, contact: false })); }} placeholder="Telegram, Discord, VK…"
              style={{ ...inp, borderColor: errors.contact ? "#e05050" : "rgba(255,255,255,0.1)" }}
              onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.28)")}
              onBlur={e => (e.target.style.borderColor = errors.contact ? "#e05050" : "rgba(255,255,255,0.1)")} />
          </div>

          <div>
            <label style={lbl}>{isRu ? "Описание (необязательно)" : "Description (optional)"}</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder={isRu ? "Расскажите о вашем аккаунте…" : "About your account…"} rows={2}
              style={{ ...inp, height: "auto", padding: "10px 13px", resize: "vertical", lineHeight: 1.5 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center" }}>
            <div>
              <label style={lbl}>{isRu ? "С" : "From"}</label>
              <input type="time" value={timeFrom} onChange={e => setTimeFrom(e.target.value)} style={{ ...inp, colorScheme: "dark" }} />
            </div>
            <span style={{ color: "rgba(240,240,238,0.2)", fontSize: 13, paddingTop: 24 }}>—</span>
            <div>
              <label style={lbl}>{isRu ? "До" : "To"}</label>
              <input type="time" value={timeTo} onChange={e => setTimeTo(e.target.value)} style={{ ...inp, colorScheme: "dark" }} />
            </div>
          </div>

          <div>
            <label style={{ ...lbl, color: errors.budget ? "#e05050" : "rgba(240,240,238,0.45)" }}>{isRu ? "Бюджет (USD)" : "Budget (USD)"}</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(240,240,238,0.3)", fontSize: 14, pointerEvents: "none" }}>$</span>
              <input value={budget} onChange={e => { setBudget(e.target.value); setErrors(p => ({ ...p, budget: false })); }} placeholder="0.00" type="number" min="0" step="0.01"
                style={{ ...inp, paddingLeft: 26, borderColor: errors.budget ? "#e05050" : "rgba(255,255,255,0.1)" }}
                onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.28)")}
                onBlur={e => (e.target.style.borderColor = errors.budget ? "#e05050" : "rgba(255,255,255,0.1)")} />
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 22px 18px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 9, flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, height: 42, borderRadius: 9, background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", color: "rgba(240,240,238,0.55)", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 13 }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          >{isRu ? "Отмена" : "Cancel"}</button>
          <button onClick={submit} style={{ flex: 2, height: 42, borderRadius: 9, background: "#f0f0ee", border: "none", cursor: "pointer", color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 13, transition: "opacity 0.12s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >{isRu ? "Разместить заявку" : "Post Request"}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── Page ─────────────────────────────────────────── */
export default function Boosts() {
  const { user } = useAuth();
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const isRu = lang === "ru";

  const [boosts, setBoosts] = useState<Boost[]>(loadBoosts);
  const [tab, setTab] = useState<"latest" | "popular">("latest");
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState(SearchContext.value);

  useEffect(() => { if (!user) navigate("/login"); }, [user]);
  useEffect(() => SearchContext.subscribe(v => setSearch(v)), []);

  let list = [...boosts];
  if (activeGame) list = list.filter(b => b.game === activeGame);
  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(b =>
      b.game.toLowerCase().includes(q) ||
      b.currentElo.toLowerCase().includes(q) ||
      b.desiredElo.toLowerCase().includes(q) ||
      b.authorName.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q)
    );
  }
  list = tab === "popular"
    ? list.sort((a, b) => Number(b.budget) - Number(a.budget))
    : list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!user) return null;

  return (
    <div style={{ minHeight: "100dvh", background: "#111111", fontFamily: "var(--app-font-sans)" }}>
      <Navbar />

      {/* ── Content ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 40px" }}>

        {/* ── Tab bar — exactly like Mobbin ── */}
        <div style={{
          display: "flex", alignItems: "stretch",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          marginBottom: 20,
        }}>
          {/* Tabs left */}
          <div style={{ display: "flex", gap: 20, flex: 1 }}>
            {(["latest", "popular"] as const).map(t => {
              const active = tab === t;
              const label = t === "latest" ? (isRu ? "Свежие" : "Latest") : (isRu ? "Популярные" : "Most popular");
              return (
                <button key={t} onClick={() => setTab(t)} style={{
                  background: "none", border: "none", cursor: "pointer", padding: "14px 0",
                  fontFamily: "var(--app-font-sans)", fontSize: 14,
                  fontWeight: active ? 500 : 400,
                  color: active ? "#f0f0ee" : "rgba(240,240,238,0.4)",
                  position: "relative", transition: "color 0.15s",
                }}>
                  {label}
                  {active && (
                    <div style={{
                      position: "absolute", bottom: -1, left: 0, right: 0,
                      height: 1.5, background: "#f0f0ee", borderRadius: 99,
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Controls right */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Filter */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowFilter(v => !v)} style={{
                height: 34, padding: "0 13px", borderRadius: 8,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer", color: activeGame ? "#f0f0ee" : "rgba(240,240,238,0.55)",
                fontFamily: "var(--app-font-sans)", fontSize: 13, fontWeight: 400,
                display: "flex", alignItems: "center", gap: 6,
                transition: "background 0.12s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              >
                {/* Filter icon — two sliders like Mobbin */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="6" r="2"/><line x1="2" y1="6" x2="7" y2="6"/><line x1="11" y1="6" x2="22" y2="6"/>
                  <circle cx="15" cy="12" r="2"/><line x1="2" y1="12" x2="13" y2="12"/><line x1="17" y1="12" x2="22" y2="12"/>
                  <circle cx="9" cy="18" r="2"/><line x1="2" y1="18" x2="7" y2="18"/><line x1="11" y1="18" x2="22" y2="18"/>
                </svg>
                {isRu ? "Фильтр" : "Filter"}
                {activeGame && (
                  <span style={{ background: GAME_COLORS[activeGame].dim, color: GAME_COLORS[activeGame].accent, borderRadius: 20, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>
                    {activeGame}
                  </span>
                )}
              </button>
              {showFilter && <FilterDropdown activeGame={activeGame} onSelect={setActiveGame} onClose={() => setShowFilter(false)} />}
            </div>

            {/* New request */}
            <button onClick={() => setShowCreate(true)} style={{
              height: 34, padding: "0 14px", borderRadius: 8,
              background: "#f0f0ee", border: "none", cursor: "pointer",
              color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 13,
              display: "flex", alignItems: "center", gap: 6, transition: "opacity 0.12s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {isRu ? "Новая заявка" : "New Request"}
            </button>
          </div>
        </div>

        {/* active search chip */}
        {search && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: "rgba(240,240,238,0.3)" }}>{isRu ? `${list.length} по запросу` : `${list.length} for`}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "3px 10px 3px 12px", fontSize: 12, color: "rgba(240,240,238,0.6)" }}>
              «{search}»
              <button onClick={() => { setSearch(""); SearchContext.emit(""); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "rgba(240,240,238,0.4)", display: "flex" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </span>
          </div>
        )}

        {/* ── Grid ── */}
        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 24px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>{search || activeGame ? "🔍" : "🎮"}</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#f0f0ee", marginBottom: 8 }}>
              {search || activeGame ? (isRu ? "Ничего не найдено" : "No results") : (isRu ? "Заявок пока нет" : "No requests yet")}
            </div>
            <div style={{ fontSize: 13, color: "rgba(240,240,238,0.35)", marginBottom: 22 }}>
              {(search || activeGame) ? (isRu ? "Попробуйте другой запрос или сбросьте фильтр" : "Try a different search or clear filters") : (isRu ? "Создайте первую заявку" : "Post your first boost request")}
            </div>
            {!search && !activeGame && (
              <button onClick={() => setShowCreate(true)} style={{ height: 38, padding: "0 18px", borderRadius: 9, background: "#f0f0ee", border: "none", cursor: "pointer", color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 13 }}>
                {isRu ? "Создать заявку" : "Post request"}
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12,
          }}>
            {list.map(b => (
              <BoostCard key={b.id} boost={b} onClick={() => navigate(`/boosts/${b.id}`)} />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateBoostModal onClose={() => setShowCreate(false)} onCreated={b => setBoosts(prev => [b, ...prev])} />
      )}
    </div>
  );
}
