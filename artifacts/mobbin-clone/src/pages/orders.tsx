import { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import { useLang } from "../LangContext";
import { useTheme } from "../ThemeContext";
import { useLocation } from "wouter";
import Navbar, { SearchContext } from "../components/Navbar";
import { createPortal } from "react-dom";

export interface Boost {
  id: string;
  authorName: string;
  authorEmail: string;
  game: "CS2" | "Dota 2" | "Valorant";
  cs2Mode?: "faceit" | "premier" | "mm";
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
const USD_TO_RUB = 90;

const GAME_COLORS: Record<string, { accent: string; dim: string }> = {
  "CS2":      { accent: "#ffab00", dim: "rgba(255,171,0,0.18)" },
  "Dota 2":   { accent: "#e05050", dim: "rgba(218,55,55,0.18)" },
  "Valorant": { accent: "#ff4655", dim: "rgba(255,70,85,0.18)" },
};

const GAME_LOGO: Record<string, string> = {
  "CS2":      "/games/cs2_new.png",
  "Dota 2":   "/games/dota2_new.png",
  "Valorant": "/games/valorant_new.png",
};

const RANKS: Record<string, string[]> = {
  "CS2": [
    "Silver I","Silver II","Silver III","Silver IV","Silver Elite","Silver Elite Master",
    "Gold Nova I","Gold Nova II","Gold Nova III","Gold Nova Master",
    "Master Guardian I","Master Guardian II","Master Guardian Elite","Distinguished Master Guardian",
    "Legendary Eagle","Legendary Eagle Master","Supreme Master First Class","Global Elite",
  ],
  "Dota 2": [
    "Herald 1","Herald 2","Herald 3","Herald 4","Herald 5",
    "Guardian 1","Guardian 2","Guardian 3","Guardian 4","Guardian 5",
    "Crusader 1","Crusader 2","Crusader 3","Crusader 4","Crusader 5",
    "Archon 1","Archon 2","Archon 3","Archon 4","Archon 5",
    "Legend 1","Legend 2","Legend 3","Legend 4","Legend 5",
    "Ancient 1","Ancient 2","Ancient 3","Ancient 4","Ancient 5",
    "Divine 1","Divine 2","Divine 3","Divine 4","Divine 5",
    "Immortal",
  ],
  "Valorant": [
    "Iron 1","Iron 2","Iron 3",
    "Bronze 1","Bronze 2","Bronze 3",
    "Silver 1","Silver 2","Silver 3",
    "Gold 1","Gold 2","Gold 3",
    "Platinum 1","Platinum 2","Platinum 3",
    "Diamond 1","Diamond 2","Diamond 3",
    "Ascendant 1","Ascendant 2","Ascendant 3",
    "Immortal 1","Immortal 2","Immortal 3",
    "Radiant",
  ],
};

const MAX_BUDGET = 300;

/* ── Seed data ──────────────────────────────────── */
const SEED_BOOSTS: Boost[] = [
  { id: "seed-1", authorName: "Артём K.", authorEmail: "artem@example.com", game: "CS2", currentElo: "Silver 3", desiredElo: "Gold Nova 2", contact: "@artem_boost", description: "Аккаунт чистый, без банов. Хочу побыстрее — готов к овертайму.", timeFrom: "10:00", timeTo: "23:00", budget: "35.00", createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
  { id: "seed-2", authorName: "Maksim_D", authorEmail: "maks@example.com", game: "Valorant", currentElo: "Iron 2", desiredElo: "Bronze 3", contact: "discord: maks#4421", description: "Нужно поднять до Bronze 3 как можно скорее.", timeFrom: "18:00", timeTo: "02:00", budget: "28.00", createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: "seed-3", authorName: "SerpentX", authorEmail: "serp@example.com", game: "Dota 2", currentElo: "Ancient", desiredElo: "Divine", contact: "@serpentx_dota", description: "Жду быстрого буста, аккаунт готов.", timeFrom: "09:00", timeTo: "21:00", budget: "60.00", createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "seed-4", authorName: "nika_val", authorEmail: "nika@example.com", game: "Valorant", currentElo: "Silver 1", desiredElo: "Platinum 1", contact: "t.me/nika_boost", description: "Хочу в платину до конца сезона. Аккаунт с 300+ матчами.", timeFrom: "11:00", timeTo: "20:00", budget: "90.00", createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { id: "seed-5", authorName: "ProPlayerZero", authorEmail: "zero@example.com", game: "CS2", currentElo: "MG1", desiredElo: "DMG", contact: "@zero_cs2", description: "Аккаунт старый, Prime статус есть.", timeFrom: "20:00", timeTo: "01:00", budget: "50.00", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: "seed-6", authorName: "ivannn99", authorEmail: "ivan99@example.com", game: "Dota 2", currentElo: "Legend", desiredElo: "Ancient", contact: "vk.com/ivannn99", description: "900 MMR разрыв, бюджет обсуждаем.", timeFrom: "14:00", timeTo: "22:00", budget: "120.00", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: "seed-7", authorName: "DimaTwitch", authorEmail: "dima@example.com", game: "CS2", currentElo: "GN4", desiredElo: "MGE", contact: "discord: dima#7731", description: "Стримлю иногда — желательно не удалять игровую историю.", timeFrom: "00:00", timeTo: "06:00", budget: "42.00", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
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

function isNew(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() < 1000 * 60 * 60 * 3;
}

/* ── Card preview SVG ────────────────────────────── */
function CardPreview({ boost }: { boost: Boost }) {
  const col = GAME_COLORS[boost.game];
  const bgMap: Record<string, string> = {
    "CS2": "#0d1117", "Dota 2": "#0c0e13", "Valorant": "#0f0e14",
  };
  const bg = bgMap[boost.game];
  return (
    <svg viewBox="0 0 280 175" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%", height: "100%" }}>
      <rect width="280" height="175" fill={bg}/>
      <rect width="280" height="26" fill="rgba(255,255,255,0.04)"/>
      <circle cx="13" cy="13" r="3" fill="rgba(255,255,255,0.18)"/>
      <circle cx="22" cy="13" r="3" fill="rgba(255,255,255,0.18)"/>
      <circle cx="31" cy="13" r="3" fill="rgba(255,255,255,0.18)"/>
      <rect x="46" y="7" width="120" height="12" rx="3" fill="rgba(255,255,255,0.07)"/>
      <rect x="12" y="38" width="76" height="80" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      <circle cx="50" cy="62" r="17" fill={col.dim} stroke={col.accent} strokeWidth="0.7" strokeOpacity="0.5"/>
      {boost.game === "Valorant" ? <polygon points="50,49 62,75 38,75" fill={col.accent} opacity="0.85"/> :
       boost.game === "CS2" ? <text x="50" y="67" textAnchor="middle" fill={col.accent} fontSize="8" fontWeight="900" fontFamily="Arial">CS2</text> :
       <text x="50" y="67" textAnchor="middle" fill={col.accent} fontSize="9" fontWeight="900" fontFamily="Arial">D2</text>}
      <text x="50" y="100" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="Arial">CURRENT</text>
      <text x="50" y="110" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="7" fontWeight="700" fontFamily="Arial">
        {boost.currentElo.length > 10 ? boost.currentElo.slice(0, 10) : boost.currentElo}
      </text>
      <line x1="96" y1="78" x2="114" y2="78" stroke={col.accent} strokeWidth="1.5" strokeOpacity="0.7"/>
      <polygon points="114,74 120,78 114,82" fill={col.accent} opacity="0.7"/>
      <rect x="124" y="38" width="76" height="80" rx="8" fill={col.dim} stroke={col.accent} strokeWidth="0.5" strokeOpacity="0.4"/>
      <circle cx="162" cy="62" r="17" fill="rgba(0,0,0,0.25)" stroke={col.accent} strokeWidth="1" strokeOpacity="0.8"/>
      {boost.game === "Valorant" ? <polygon points="162,49 174,75 150,75" fill={col.accent}/> :
       boost.game === "CS2" ? <text x="162" y="67" textAnchor="middle" fill={col.accent} fontSize="8" fontWeight="900" fontFamily="Arial">CS2</text> :
       <text x="162" y="67" textAnchor="middle" fill={col.accent} fontSize="9" fontWeight="900" fontFamily="Arial">D2</text>}
      <text x="162" y="100" textAnchor="middle" fill={col.accent} fontSize="6" fontFamily="Arial" opacity="0.8">TARGET</text>
      <text x="162" y="110" textAnchor="middle" fill={col.accent} fontSize="7" fontWeight="700" fontFamily="Arial">
        {boost.desiredElo.length > 10 ? boost.desiredElo.slice(0, 10) : boost.desiredElo}
      </text>
      <rect x="208" y="38" width="60" height="30" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5"/>
      <text x="238" y="49" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="5.5" fontFamily="Arial">BUDGET</text>
      <text x="238" y="61" textAnchor="middle" fill="#f0f0ee" fontSize="11" fontWeight="700" fontFamily="Arial">${Number(boost.budget).toFixed(0)}</text>
      <rect x="208" y="76" width="60" height="24" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
      <text x="238" y="86" textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="5" fontFamily="Arial">MSK TIME</text>
      <text x="238" y="96" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="Arial">{boost.timeFrom}–{boost.timeTo}</text>
      <rect x="12" y="128" width="256" height="7" rx="2.5" fill="rgba(255,255,255,0.06)"/>
      <rect x="12" y="141" width="190" height="6" rx="2" fill="rgba(255,255,255,0.04)"/>
      <rect x="12" y="153" width="130" height="5" rx="2" fill="rgba(255,255,255,0.03)"/>
      <rect x="0" y="172" width="280" height="3" fill={col.accent} opacity="0.4"/>
    </svg>
  );
}

/* ── Game logo image for footer ──────────────────── */
function GameLogoImg({ game, size = 32 }: { game: string; size?: number }) {
  const col = GAME_COLORS[game];
  const r = Math.round(size * 0.28);
  return (
    <div style={{
      width: size, height: size, borderRadius: r, flexShrink: 0,
      background: col.dim, display: "flex", alignItems: "center", justifyContent: "center",
      border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden",
    }}>
      <img src={GAME_LOGO[game]} alt={game} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
    </div>
  );
}

/* ── Boost card — Mobbin structure ───────────────── */
function BoostCard({ boost, onClick, isDark, isRu }: { boost: Boost; onClick: () => void; isDark: boolean; isRu: boolean }) {
  const [hov, setHov] = useState(false);
  const fresh = isNew(boost.createdAt);
  const cardBg = isDark ? "#252525" : "#e8e8e6";
  const textPrimary = isDark ? "#f0f0ee" : "#131415";
  const textSecondary = isDark ? "rgba(240,240,238,0.45)" : "#666660";
  const budgetDisplay = isRu
    ? `₽${Math.round(Number(boost.budget) * USD_TO_RUB).toLocaleString("ru-RU")}`
    : `$${Number(boost.budget).toFixed(0)}`;

  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ cursor: "pointer" }}>
      <div style={{ background: cardBg, borderRadius: 18, padding: 8, transition: "transform 0.15s", transform: hov ? "translateY(-4px)" : "none", position: "relative" }}>
        <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "16/10" }}>
          <CardPreview boost={boost}/>
        </div>
        {fresh && (
          <div style={{ position: "absolute", top: 16, left: 16, background: "#ffffff", color: "#111111", fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", borderRadius: 6, padding: "3px 8px", fontFamily: "var(--app-font-sans)" }}>New</div>
        )}
        <div style={{ position: "absolute", top: 16, right: 16, background: "#ffffff", borderRadius: 7, padding: "3px 9px", fontFamily: "var(--app-font-sans)", fontSize: 11, fontWeight: 700, color: "#111111", letterSpacing: "0.01em", fontVariantNumeric: "tabular-nums" }}>
          {budgetDisplay}
        </div>
      </div>
      <div style={{ padding: "11px 4px 0", display: "flex", alignItems: "flex-start", gap: 10 }}>
        <GameLogoImg game={boost.game} size={32}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 2, lineHeight: 1.3 }}>
            {boost.authorName}
          </div>
          <div style={{ fontSize: 11, color: textSecondary, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.45 }}>
            {boost.description || `${boost.currentElo} → ${boost.desiredElo}`}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Range slider (dual handle) ─────────────────── */
function RangeSlider({ min, max, value, onChange, isDark, accentColor }: {
  min: number; max: number; value: [number, number];
  onChange: (v: [number, number]) => void;
  isDark: boolean; accentColor: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<null | "lo" | "hi">(null);

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  function getValFromX(clientX: number): number {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(min + ratio * (max - min));
  }

  function onMouseDown(handle: "lo" | "hi") {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = handle;
      const move = (ev: MouseEvent) => {
        const v = getValFromX(ev.clientX);
        onChange(handle === "lo" ? [Math.min(v, value[1]), value[1]] : [value[0], Math.max(v, value[0])]);
      };
      const up = () => { dragging.current = null; window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    };
  }

  function onTrackClick(e: React.MouseEvent) {
    if (!trackRef.current) return;
    const v = getValFromX(e.clientX);
    const distLo = Math.abs(v - value[0]);
    const distHi = Math.abs(v - value[1]);
    if (distLo <= distHi) onChange([Math.min(v, value[1]), value[1]]);
    else onChange([value[0], Math.max(v, value[0])]);
  }

  const trackBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const handleBg = isDark ? "#f0f0ee" : "#131415";

  return (
    <div style={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>
      <div ref={trackRef} onClick={onTrackClick} style={{ position: "relative", width: "100%", height: 4, borderRadius: 2, background: trackBg, cursor: "pointer" }}>
        <div style={{ position: "absolute", left: `${pct(value[0])}%`, width: `${pct(value[1]) - pct(value[0])}%`, height: "100%", background: accentColor, borderRadius: 2 }}/>
        {(["lo","hi"] as const).map(h => (
          <div key={h} onMouseDown={onMouseDown(h)} style={{
            position: "absolute", top: "50%",
            left: `${pct(h === "lo" ? value[0] : value[1])}%`,
            transform: "translate(-50%,-50%)",
            width: 14, height: 14, borderRadius: "50%",
            background: handleBg, border: `2px solid ${accentColor}`,
            cursor: "grab", zIndex: 2, boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            transition: "box-shadow 0.1s",
          }}/>
        ))}
      </div>
    </div>
  );
}

/* ── Filter panel (dropdown) ─────────────────────── */
type CS2Mode = "faceit" | "premier" | "mm";

interface FilterState {
  budgetRange: [number, number];
  rankFrom: string[];
  rankTo: string[];
  filterGame: string;
  cs2Mode: CS2Mode | "";
  eloFrom: string;
  eloTo: string;
}

function FilterPanel({ onClose, filters, setFilters, isDark, isRu }: {
  onClose: () => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  isDark: boolean;
  isRu: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState<FilterState>({ ...filters });

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    }
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const bg = isDark ? "#1c1c1c" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const textPrimary = isDark ? "#f0f0ee" : "#131415";
  const textMuted = isDark ? "rgba(240,240,238,0.45)" : "#666660";
  const chipBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const inputBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";

  const selectedGame = local.filterGame !== "all" ? local.filterGame : "";
  const isCS2 = selectedGame === "CS2";
  const accent = selectedGame ? GAME_COLORS[selectedGame].accent : (isDark ? "#f0f0ee" : "#131415");

  // show MM rank chips only for CS2+MM or non-CS2 specific games
  const showRankChips = selectedGame && (
    (isCS2 && local.cs2Mode === "mm") ||
    (!isCS2 && selectedGame !== "")
  );
  const rankList = showRankChips ? (RANKS[selectedGame] ?? []) : [];

  // show ELO/rating number inputs for Faceit/Premier
  const showEloInputs = isCS2 && (local.cs2Mode === "faceit" || local.cs2Mode === "premier");

  const lbl: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10, display: "block" };
  const numInp: React.CSSProperties = {
    width: "100%", height: 38, padding: "0 11px", borderRadius: 8,
    border: `1px solid ${inputBorder}`, background: inputBg,
    color: textPrimary, fontFamily: "var(--app-font-sans)", fontSize: 13,
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
  };

  function apply() { setFilters(local); onClose(); }
  function reset() {
    setLocal({ budgetRange: [0, MAX_BUDGET], rankFrom: [], rankTo: [], filterGame: "all", cs2Mode: "", eloFrom: "", eloTo: "" });
  }
  const dirty = local.budgetRange[0] > 0 || local.budgetRange[1] < MAX_BUDGET
    || local.rankFrom.length > 0 || local.rankTo.length > 0
    || local.filterGame !== "all"
    || !!local.cs2Mode || !!local.eloFrom || !!local.eloTo;

  const CS2_MODES: { id: CS2Mode; label: string; logo: string }[] = [
    { id: "faceit", label: "Faceit", logo: "/games/faceit_icon.svg" },
    { id: "premier", label: "Premier", logo: "/games/premier_icon.svg" },
    { id: "mm", label: isRu ? "ММ" : "MM", logo: "/games/mm_icon.svg" },
  ];

  return (
    <div ref={panelRef} style={{
      position: "absolute", top: "calc(100% + 6px)", right: 0,
      width: 340, background: bg, border: `1px solid ${border}`,
      borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
      zIndex: 200, padding: "18px 18px 14px", fontFamily: "var(--app-font-sans)",
    }}>

      {/* Game selector */}
      <div style={{ marginBottom: isCS2 ? 14 : 20 }}>
        <span style={lbl as React.CSSProperties}>{isRu ? "Игра" : "Game"}</span>
        <div style={{ display: "flex", gap: 5 }}>
          {(["all", ...GAMES] as const).map(g => {
            const active = local.filterGame === g;
            const col = g !== "all" ? GAME_COLORS[g] : null;
            return (
              <button key={g} onClick={() => setLocal(p => ({
                ...p, filterGame: g, rankFrom: [], rankTo: [],
                cs2Mode: "", eloFrom: "", eloTo: "",
              }))}
                style={{
                  flex: 1, height: 28, borderRadius: 7, border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                  background: active ? (col ? col.dim : (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)")) : chipBg,
                  color: active ? (col ? col.accent : textPrimary) : textMuted,
                  fontFamily: "var(--app-font-sans)", fontWeight: active ? 700 : 400, fontSize: 11,
                  transition: "all 0.12s",
                  outline: active ? `1.5px solid ${col ? col.accent : (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.18)")}` : "none",
                  padding: "0 6px",
                }}>
                {g === "all" ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                    <rect x="2" y="2" width="9" height="9" rx="2"/><rect x="13" y="2" width="9" height="9" rx="2" opacity="0.6"/>
                    <rect x="2" y="13" width="9" height="9" rx="2" opacity="0.6"/><rect x="13" y="13" width="9" height="9" rx="2"/>
                  </svg>
                ) : (
                  <img src={GAME_LOGO[g]} alt={g} style={{ width: 13, height: 13, objectFit: "contain", borderRadius: 2, opacity: active ? 1 : 0.55, flexShrink: 0 }}/>
                )}
                {g === "all" ? (isRu ? "Все" : "All") : g}
              </button>
            );
          })}
        </div>
      </div>

      {/* CS2 mode selector */}
      {isCS2 && (
        <div style={{ marginBottom: 20 }}>
          <span style={lbl as React.CSSProperties}>{isRu ? "Режим" : "Mode"}</span>
          <div style={{ display: "flex", gap: 5 }}>
            {CS2_MODES.map(({ id, label, logo }) => {
              const active = local.cs2Mode === id;
              const col = GAME_COLORS["CS2"];
              return (
                <button key={id}
                  onClick={() => setLocal(p => ({
                    ...p,
                    cs2Mode: p.cs2Mode === id ? "" : id,
                    rankFrom: [], rankTo: [],
                    eloFrom: "", eloTo: "",
                  }))}
                  style={{
                    flex: 1, height: 34, borderRadius: 8, border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                    background: active ? col.dim : chipBg,
                    color: active ? col.accent : textMuted,
                    fontFamily: "var(--app-font-sans)", fontWeight: active ? 700 : 500, fontSize: 12,
                    transition: "all 0.12s",
                    outline: active ? `1.5px solid ${col.accent}` : "none",
                  }}>
                  <img src={logo} alt={label} style={{ width: 16, height: 16, objectFit: "contain", borderRadius: 3, flexShrink: 0 }}/>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ELO / Premier rating inputs (Faceit or Premier mode) */}
      {showEloInputs && (
        <div style={{ marginBottom: 20 }}>
          {local.cs2Mode === "faceit" ? (
            <>
              <span style={lbl as React.CSSProperties}>{isRu ? "ELO Faceit" : "Faceit ELO"}</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 6, alignItems: "center" }}>
                <input
                  type="number" min="0" max="5000"
                  value={local.eloFrom}
                  onChange={e => setLocal(p => ({ ...p, eloFrom: e.target.value }))}
                  placeholder={isRu ? "от 100" : "from 100"}
                  style={numInp}
                  onFocus={e => (e.target.style.borderColor = GAME_COLORS["CS2"].accent)}
                  onBlur={e => (e.target.style.borderColor = inputBorder)}
                />
                <span style={{ color: textMuted, fontSize: 13, textAlign: "center", padding: "0 2px" }}>→</span>
                <input
                  type="number" min="0" max="5000"
                  value={local.eloTo}
                  onChange={e => setLocal(p => ({ ...p, eloTo: e.target.value }))}
                  placeholder={isRu ? "до 5000" : "to 5000"}
                  style={numInp}
                  onFocus={e => (e.target.style.borderColor = GAME_COLORS["CS2"].accent)}
                  onBlur={e => (e.target.style.borderColor = inputBorder)}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                <span style={{ fontSize: 10, color: textMuted }}>100 ELO</span>
                <span style={{ fontSize: 10, color: textMuted }}>5000 ELO</span>
              </div>
            </>
          ) : (
            <>
              <span style={lbl as React.CSSProperties}>{isRu ? "Рейтинг Premier" : "Premier Rating"}</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 6, alignItems: "center" }}>
                <input
                  type="number" min="0" max="50000"
                  value={local.eloFrom}
                  onChange={e => setLocal(p => ({ ...p, eloFrom: e.target.value }))}
                  placeholder={isRu ? "от 1000" : "from 1000"}
                  style={numInp}
                  onFocus={e => (e.target.style.borderColor = GAME_COLORS["CS2"].accent)}
                  onBlur={e => (e.target.style.borderColor = inputBorder)}
                />
                <span style={{ color: textMuted, fontSize: 13, textAlign: "center", padding: "0 2px" }}>→</span>
                <input
                  type="number" min="0" max="50000"
                  value={local.eloTo}
                  onChange={e => setLocal(p => ({ ...p, eloTo: e.target.value }))}
                  placeholder={isRu ? "до 30000" : "to 30000"}
                  style={numInp}
                  onFocus={e => (e.target.style.borderColor = GAME_COLORS["CS2"].accent)}
                  onBlur={e => (e.target.style.borderColor = inputBorder)}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                <span style={{ fontSize: 10, color: textMuted }}>0</span>
                <span style={{ fontSize: 10, color: textMuted }}>50 000</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Budget slider */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={lbl as React.CSSProperties}>{isRu ? "Бюджет" : "Budget"}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: textPrimary }}>
            {isRu
              ? `₽${local.budgetRange[0] * USD_TO_RUB} — ${local.budgetRange[1] >= MAX_BUDGET ? `₽${MAX_BUDGET * USD_TO_RUB}+` : `₽${local.budgetRange[1] * USD_TO_RUB}`}`
              : `$${local.budgetRange[0]} — ${local.budgetRange[1] >= MAX_BUDGET ? `$${MAX_BUDGET}+` : `$${local.budgetRange[1]}`}`
            }
          </span>
        </div>
        <RangeSlider
          min={0} max={MAX_BUDGET}
          value={local.budgetRange}
          onChange={v => setLocal(p => ({ ...p, budgetRange: v }))}
          isDark={isDark} accentColor={accent}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 10, color: textMuted }}>{isRu ? "₽0" : "$0"}</span>
          <span style={{ fontSize: 10, color: textMuted }}>{isRu ? `₽${MAX_BUDGET * USD_TO_RUB}+` : `$${MAX_BUDGET}+`}</span>
        </div>
      </div>

      {/* Rank chips — MM mode for CS2, or other games */}
      {rankList.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <span style={lbl as React.CSSProperties}>{isRu ? "Текущий ранг" : "Current rank"}</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, maxHeight: 120, overflowY: "auto" }}>
            {rankList.map(rank => {
              const active = local.rankFrom.includes(rank);
              return (
                <button key={rank} onClick={() => setLocal(p => ({ ...p, rankFrom: p.rankFrom.includes(rank) ? p.rankFrom.filter(r => r !== rank) : [...p.rankFrom, rank] }))}
                  style={{
                    padding: "4px 10px", borderRadius: 20, border: "none", cursor: "pointer",
                    background: active ? accent : chipBg,
                    color: active ? (isDark ? "#111" : "#fff") : textPrimary,
                    fontSize: 11, fontWeight: active ? 600 : 400,
                    fontFamily: "var(--app-font-sans)", transition: "all 0.12s",
                  }}>
                  {rank}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {rankList.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <span style={lbl as React.CSSProperties}>{isRu ? "Желаемый ранг" : "Target rank"}</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, maxHeight: 120, overflowY: "auto" }}>
            {rankList.map(rank => {
              const active = local.rankTo.includes(rank);
              return (
                <button key={rank} onClick={() => setLocal(p => ({ ...p, rankTo: p.rankTo.includes(rank) ? p.rankTo.filter(r => r !== rank) : [...p.rankTo, rank] }))}
                  style={{
                    padding: "4px 10px", borderRadius: 20, border: "none", cursor: "pointer",
                    background: active ? accent : chipBg,
                    color: active ? (isDark ? "#111" : "#fff") : textPrimary,
                    fontSize: 11, fontWeight: active ? 600 : 400,
                    fontFamily: "var(--app-font-sans)", transition: "all 0.12s",
                  }}>
                  {rank}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer buttons */}
      <div style={{ display: "flex", gap: 8, borderTop: `1px solid ${border}`, paddingTop: 12, marginTop: 4 }}>
        <button onClick={reset} disabled={!dirty} style={{ flex: 1, height: 34, borderRadius: 8, border: "none", cursor: dirty ? "pointer" : "default", background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: dirty ? textPrimary : textMuted, fontFamily: "var(--app-font-sans)", fontSize: 12, fontWeight: 600, opacity: dirty ? 1 : 0.5, transition: "opacity 0.12s" }}>
          {isRu ? "Сбросить" : "Reset"}
        </button>
        <button onClick={apply} style={{ flex: 2, height: 34, borderRadius: 8, border: "none", cursor: "pointer", background: accent, color: isDark ? "#111" : "#fff", fontFamily: "var(--app-font-sans)", fontSize: 12, fontWeight: 700, transition: "opacity 0.12s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
          {isRu ? "Применить" : "Apply"}
        </button>
      </div>
    </div>
  );
}

/* ── Create Boost Modal ─────────────────────────── */
function CreateBoostModal({ onClose, onCreated, isDark }: { onClose: () => void; onCreated: (b: Boost) => void; isDark: boolean }) {
  const { user } = useAuth();
  const { lang } = useLang();
  const isRu = lang === "ru";

  const [game, setGame] = useState<Boost["game"]>("CS2");
  const [cs2Mode, setCs2Mode] = useState<CS2Mode>("faceit");
  const [currentElo, setCurrentElo] = useState("");
  const [desiredElo, setDesiredElo] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [timeFrom, setTimeFrom] = useState("10:00");
  const [timeTo, setTimeTo] = useState("22:00");
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const modalBg = isDark ? "#161616" : "#ffffff";
  const inputBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";
  const textPrimary = isDark ? "#f0f0ee" : "#131415";
  const textMuted = isDark ? "rgba(240,240,238,0.45)" : "#666660";
  const dividerColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const col = GAME_COLORS["CS2"];

  const isCS2 = game === "CS2";

  const inp: React.CSSProperties = {
    width: "100%", height: 42, padding: "0 13px", borderRadius: 9, border: `1px solid ${inputBorder}`,
    background: inputBg, color: textPrimary, fontFamily: "var(--app-font-sans)", fontSize: 14,
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
  };
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: textMuted, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 5, display: "block" };

  // Dynamic labels/placeholders based on CS2 mode
  const eloLabels = {
    current: isCS2
      ? cs2Mode === "faceit" ? (isRu ? "Текущее ELO Faceit" : "Current Faceit ELO")
      : cs2Mode === "premier" ? (isRu ? "Текущий рейтинг Premier" : "Current Premier Rating")
      : (isRu ? "Текущий ранг" : "Current rank")
      : (isRu ? "Текущий ранг" : "Current rank"),
    desired: isCS2
      ? cs2Mode === "faceit" ? (isRu ? "Желаемое ELO Faceit" : "Desired Faceit ELO")
      : cs2Mode === "premier" ? (isRu ? "Желаемый рейтинг Premier" : "Desired Premier Rating")
      : (isRu ? "Желаемый ранг" : "Target rank")
      : (isRu ? "Желаемый ранг" : "Target rank"),
    currentPh: isCS2
      ? cs2Mode === "faceit" ? "1000" : cs2Mode === "premier" ? "5000" : RANKS["CS2"][0]
      : game === "Dota 2" ? RANKS["Dota 2"][0] : RANKS["Valorant"][0],
    desiredPh: isCS2
      ? cs2Mode === "faceit" ? "2500" : cs2Mode === "premier" ? "15000" : RANKS["CS2"][4]
      : game === "Dota 2" ? RANKS["Dota 2"][5] : RANKS["Valorant"][3],
    inputType: (isCS2 && (cs2Mode === "faceit" || cs2Mode === "premier")) ? "number" : "text",
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
      game,
      cs2Mode: isCS2 ? cs2Mode : undefined,
      currentElo: currentElo.trim(), desiredElo: desiredElo.trim(),
      contact: contact.trim(), description: description.trim(),
      timeFrom, timeTo, budget: budget.trim(), createdAt: new Date().toISOString(),
    };
    const all = loadBoosts(); all.unshift(boost); saveBoosts(all);
    onCreated(boost); onClose();
  }

  const CS2_MODES_CREATE: { id: CS2Mode; label: string; logo: string }[] = [
    { id: "faceit", label: "Faceit", logo: "/games/faceit_icon.svg" },
    { id: "premier", label: "Premier", logo: "/games/premier_icon.svg" },
    { id: "mm", label: isRu ? "ММ (Matchmaking)" : "MM (Matchmaking)", logo: "/games/mm_icon.svg" },
  ];

  return createPortal(
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 520, background: modalBg, border: `1px solid ${dividerColor}`, borderRadius: 18, boxShadow: "0 40px 100px rgba(0,0,0,0.5)", maxHeight: "92vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px 16px", borderBottom: `1px solid ${dividerColor}`, flexShrink: 0 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: textPrimary, letterSpacing: "-0.02em" }}>{isRu ? "Новая заявка" : "New Boost Request"}</h2>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: textMuted }}>{isRu ? "Заполните детали и разместите заявку" : "Fill in the details and post"}</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: textMuted }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ padding: "18px 22px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Game selector */}
          <div>
            <label style={lbl}>{isRu ? "Игра" : "Game"}</label>
            <div style={{ display: "flex", gap: 7 }}>
              {GAMES.map(g => {
                const active = game === g;
                const gcol = GAME_COLORS[g];
                return (
                  <button key={g} onClick={() => { setGame(g); setCurrentElo(""); setDesiredElo(""); }}
                    style={{ flex: 1, height: 38, borderRadius: 9, border: "none", cursor: "pointer", background: active ? gcol.dim : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"), color: active ? gcol.accent : textMuted, fontFamily: "var(--app-font-sans)", fontWeight: active ? 700 : 400, fontSize: 13, transition: "all 0.12s" }}>
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CS2 mode selector */}
          {isCS2 && (
            <div>
              <label style={lbl}>{isRu ? "Режим CS2" : "CS2 Mode"}</label>
              <div style={{ display: "flex", gap: 6 }}>
                {CS2_MODES_CREATE.map(({ id, label, logo }) => {
                  const active = cs2Mode === id;
                  return (
                    <button key={id} onClick={() => { setCs2Mode(id); setCurrentElo(""); setDesiredElo(""); }}
                      style={{
                        flex: 1, height: 38, borderRadius: 9, border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                        background: active ? col.dim : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"),
                        color: active ? col.accent : textMuted,
                        fontFamily: "var(--app-font-sans)", fontWeight: active ? 700 : 400, fontSize: 12,
                        outline: active ? `1.5px solid ${col.accent}55` : "none",
                        transition: "all 0.12s",
                      }}>
                      <img src={logo} alt={label} style={{ width: 18, height: 18, objectFit: "contain", borderRadius: 4, flexShrink: 0 }}/>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Current / Desired fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ ...lbl, color: errors.currentElo ? "#e05050" : textMuted }}>{eloLabels.current}</label>
              <input
                value={currentElo}
                type={eloLabels.inputType}
                min={eloLabels.inputType === "number" ? 0 : undefined}
                onChange={e => { setCurrentElo(e.target.value); setErrors(p => ({ ...p, currentElo: false })); }}
                placeholder={eloLabels.currentPh}
                style={{ ...inp, borderColor: errors.currentElo ? "#e05050" : inputBorder }}
                onFocus={e => (e.target.style.borderColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)")}
                onBlur={e => (e.target.style.borderColor = errors.currentElo ? "#e05050" : inputBorder)}
              />
            </div>
            <div>
              <label style={{ ...lbl, color: errors.desiredElo ? "#e05050" : textMuted }}>{eloLabels.desired}</label>
              <input
                value={desiredElo}
                type={eloLabels.inputType}
                min={eloLabels.inputType === "number" ? 0 : undefined}
                onChange={e => { setDesiredElo(e.target.value); setErrors(p => ({ ...p, desiredElo: false })); }}
                placeholder={eloLabels.desiredPh}
                style={{ ...inp, borderColor: errors.desiredElo ? "#e05050" : inputBorder }}
                onFocus={e => (e.target.style.borderColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)")}
                onBlur={e => (e.target.style.borderColor = errors.desiredElo ? "#e05050" : inputBorder)}
              />
            </div>
          </div>

          <div>
            <label style={{ ...lbl, color: errors.contact ? "#e05050" : textMuted }}>{isRu ? "Контакт" : "Contact"}</label>
            <input value={contact} onChange={e => { setContact(e.target.value); setErrors(p => ({ ...p, contact: false })); }} placeholder="Telegram, Discord, VK…"
              style={{ ...inp, borderColor: errors.contact ? "#e05050" : inputBorder }}
              onFocus={e => (e.target.style.borderColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)")}
              onBlur={e => (e.target.style.borderColor = errors.contact ? "#e05050" : inputBorder)}/>
          </div>
          <div>
            <label style={lbl}>{isRu ? "Описание (необязательно)" : "Description (optional)"}</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={isRu ? "О вашем аккаунте…" : "About your account…"} rows={2}
              style={{ ...inp, height: "auto", padding: "10px 13px", resize: "vertical", lineHeight: 1.5 }}/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center" }}>
            <div>
              <label style={lbl}>{isRu ? "С" : "From"}</label>
              <input type="time" value={timeFrom} onChange={e => setTimeFrom(e.target.value)} style={{ ...inp, colorScheme: isDark ? "dark" : "light" }}/>
            </div>
            <span style={{ color: textMuted, fontSize: 13, paddingTop: 24 }}>—</span>
            <div>
              <label style={lbl}>{isRu ? "До" : "To"}</label>
              <input type="time" value={timeTo} onChange={e => setTimeTo(e.target.value)} style={{ ...inp, colorScheme: isDark ? "dark" : "light" }}/>
            </div>
          </div>
          <div>
            <label style={{ ...lbl, color: errors.budget ? "#e05050" : textMuted }}>{isRu ? "Бюджет (USD)" : "Budget (USD)"}</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: textMuted, fontSize: 14, pointerEvents: "none" }}>$</span>
              <input value={budget} onChange={e => { setBudget(e.target.value); setErrors(p => ({ ...p, budget: false })); }} placeholder="0.00" type="number" min="0" step="0.01"
                style={{ ...inp, paddingLeft: 26, borderColor: errors.budget ? "#e05050" : inputBorder }}
                onFocus={e => (e.target.style.borderColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)")}
                onBlur={e => (e.target.style.borderColor = errors.budget ? "#e05050" : inputBorder)}/>
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 22px 18px", borderTop: `1px solid ${dividerColor}`, display: "flex", gap: 9, flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, height: 42, borderRadius: 9, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", color: textMuted, fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 13 }}>{isRu ? "Отмена" : "Cancel"}</button>
          <button onClick={submit} style={{ flex: 2, height: 42, borderRadius: 9, background: isDark ? "#f0f0ee" : "#131415", border: "none", cursor: "pointer", color: isDark ? "#111" : "#fff", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 13 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            {isRu ? "Разместить заявку" : "Post Request"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── Game filter tabs ────────────────────────────── */
type GameFilter = "all" | "CS2" | "Dota 2" | "Valorant";

const GAME_TABS: { id: GameFilter; label: string }[] = [
  { id: "all",      label: "All" },
  { id: "CS2",      label: "CS2" },
  { id: "Dota 2",   label: "Dota 2" },
  { id: "Valorant", label: "Valorant" },
];

/* ── Page ─────────────────────────────────────────── */
const DEFAULT_FILTERS: FilterState = { budgetRange: [0, MAX_BUDGET], rankFrom: [], rankTo: [], filterGame: "all", cs2Mode: "", eloFrom: "", eloTo: "" };

export default function Boosts() {
  const { user } = useAuth();
  const { lang } = useLang();
  const { theme } = useTheme();
  const [, navigate] = useLocation();
  const isRu = lang === "ru";
  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [boosts, setBoosts] = useState<Boost[]>(loadBoosts);
  const [gameFilter, setGameFilter] = useState<GameFilter>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [search, setSearch] = useState(SearchContext.value);
  const filterBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!user) navigate("/login"); }, [user]);
  useEffect(() => SearchContext.subscribe((v: string) => setSearch(v)), []);

  const hasActiveFilters = filters.budgetRange[0] > 0 || filters.budgetRange[1] < MAX_BUDGET
    || filters.rankFrom.length > 0 || filters.rankTo.length > 0
    || filters.filterGame !== "all" || !!filters.cs2Mode || !!filters.eloFrom || !!filters.eloTo;

  let list = [...boosts];
  if (gameFilter !== "all") list = list.filter(b => b.game === gameFilter);
  if (filters.filterGame !== "all") list = list.filter(b => b.game === filters.filterGame);
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
  if (filters.budgetRange[0] > 0 || filters.budgetRange[1] < MAX_BUDGET) {
    list = list.filter(b => {
      const n = parseFloat(b.budget);
      return n >= filters.budgetRange[0] && (filters.budgetRange[1] >= MAX_BUDGET || n <= filters.budgetRange[1]);
    });
  }
  // CS2 mode filter
  if (filters.filterGame === "CS2" && filters.cs2Mode) {
    list = list.filter(b => !b.cs2Mode || b.cs2Mode === filters.cs2Mode);
    // ELO/rating range filters for Faceit & Premier
    if ((filters.cs2Mode === "faceit" || filters.cs2Mode === "premier") && (filters.eloFrom || filters.eloTo)) {
      const lo = filters.eloFrom ? parseFloat(filters.eloFrom) : -Infinity;
      const hi = filters.eloTo ? parseFloat(filters.eloTo) : Infinity;
      list = list.filter(b => {
        const cur = parseFloat(b.currentElo);
        if (!isNaN(cur)) return cur >= lo && cur <= hi;
        return true;
      });
    }
  }
  // MM rank chip filters (and non-CS2 game rank filters)
  if (filters.rankFrom.length > 0) list = list.filter(b => filters.rankFrom.includes(b.currentElo));
  if (filters.rankTo.length > 0) list = list.filter(b => filters.rankTo.includes(b.desiredElo));
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!user) return null;

  const pageBg = isDark ? "#111111" : "#f5f5f4";
  const textPrimary = isDark ? "#f0f0ee" : "#131415";
  const textMuted = isDark ? "rgba(240,240,238,0.4)" : "#666660";
  const borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const btnBg = isDark ? "#f0f0ee" : "#131415";
  const btnText = isDark ? "#111" : "#fff";
  const tabActiveBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const tabInactiveColor = isDark ? "rgba(240,240,238,0.4)" : "#666660";

  return (
    <div style={{ minHeight: "100dvh", background: pageBg, fontFamily: "var(--app-font-sans)" }}>
      <Navbar/>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 48px" }}>

        {/* ── Top bar ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${borderColor}`, marginBottom: 24 }}>

          {/* Left: game tabs */}
          <div style={{ display: "flex", gap: 4, padding: "10px 0" }}>
            {GAME_TABS.map(tab => {
              const active = gameFilter === tab.id;
              const gameCol = tab.id !== "all" ? GAME_COLORS[tab.id] : null;
              return (
                <button key={tab.id} onClick={() => setGameFilter(tab.id)} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  height: 34, padding: "0 11px", borderRadius: 20, border: "none",
                  cursor: "pointer", transition: "all 0.15s",
                  background: active ? tabActiveBg : "transparent",
                  color: active ? (gameCol ? gameCol.accent : textPrimary) : tabInactiveColor,
                  fontFamily: "var(--app-font-sans)", fontWeight: active ? 600 : 400, fontSize: 13,
                }}
                onMouseEnter={e => !active && (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)")}
                onMouseLeave={e => !active && (e.currentTarget.style.background = "transparent")}
                >
                  {tab.id === "all" ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="2" y="2" width="9" height="9" rx="2"/><rect x="13" y="2" width="9" height="9" rx="2" opacity="0.6"/>
                      <rect x="2" y="13" width="9" height="9" rx="2" opacity="0.6"/><rect x="13" y="13" width="9" height="9" rx="2"/>
                    </svg>
                  ) : (
                    <img src={GAME_LOGO[tab.id]} alt={tab.label} style={{ width: 16, height: 16, objectFit: "contain", borderRadius: 3, opacity: active ? 1 : 0.6 }}/>
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right: filter + new request */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Filter button with dropdown */}
            <div ref={filterBtnRef} style={{ position: "relative" }}>
              <button onClick={() => setShowFilters(v => !v)} style={{
                height: 34, padding: "0 13px", borderRadius: 8, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600,
                fontFamily: "var(--app-font-sans)", transition: "all 0.12s", border: "none",
                background: hasActiveFilters
                  ? (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)")
                  : (showFilters ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)") : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)")),
                color: hasActiveFilters ? textPrimary : textMuted,
                outline: hasActiveFilters ? `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)"}` : "none",
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                {isRu ? "Фильтры" : "Filters"}
                {hasActiveFilters && (
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: isDark ? "#f0f0ee" : "#131415" }}/>
                )}
              </button>

              {showFilters && (
                <FilterPanel
                  onClose={() => setShowFilters(false)}
                  filters={filters}
                  setFilters={f => { setFilters(f); setShowFilters(false); }}
                  isDark={isDark}
                  isRu={isRu}
                />
              )}
            </div>

            {/* New request */}
            <button onClick={() => setShowCreate(true)} style={{
              height: 34, padding: "0 15px", borderRadius: 8,
              background: btnBg, border: "none", cursor: "pointer",
              color: btnText, fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 13,
              display: "flex", alignItems: "center", gap: 6, transition: "opacity 0.12s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {isRu ? "Новая заявка" : "New Request"}
            </button>
          </div>
        </div>

        {/* Active filter chips row */}
        {(search || hasActiveFilters) && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: textMuted }}>{list.length} {isRu ? "заявок" : "results"}</span>
            {filters.filterGame !== "all" && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, background: GAME_COLORS[filters.filterGame]?.dim ?? (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"), borderRadius: 20, padding: "3px 10px 3px 12px", fontSize: 12, color: GAME_COLORS[filters.filterGame]?.accent ?? textPrimary, fontWeight: 600 }}>
                {filters.filterGame}
                <button onClick={() => setFilters(p => ({ ...p, filterGame: "all", rankFrom: [], rankTo: [] }))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit", display: "flex", opacity: 0.7 }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
            )}
            {search && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", borderRadius: 20, padding: "3px 10px 3px 12px", fontSize: 12, color: textPrimary }}>
                «{search}»
                <button onClick={() => { setSearch(""); SearchContext.emit(""); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: textMuted, display: "flex" }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
            )}
            {(filters.budgetRange[0] > 0 || filters.budgetRange[1] < MAX_BUDGET) && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", borderRadius: 20, padding: "3px 10px 3px 12px", fontSize: 12, color: textPrimary }}>
                ${filters.budgetRange[0]}–{filters.budgetRange[1] >= MAX_BUDGET ? `${MAX_BUDGET}+` : filters.budgetRange[1]}
                <button onClick={() => setFilters(p => ({ ...p, budgetRange: [0, MAX_BUDGET] }))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: textMuted, display: "flex" }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
            )}
            {filters.rankFrom.length > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", borderRadius: 20, padding: "3px 10px 3px 12px", fontSize: 12, color: textPrimary }}>
                {isRu ? "От:" : "From:"} {filters.rankFrom.length === 1 ? filters.rankFrom[0] : `${filters.rankFrom.length} ${isRu ? "рангов" : "ranks"}`}
                <button onClick={() => setFilters(p => ({ ...p, rankFrom: [] }))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: textMuted, display: "flex" }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
            )}
            {filters.rankTo.length > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", borderRadius: 20, padding: "3px 10px 3px 12px", fontSize: 12, color: textPrimary }}>
                {isRu ? "До:" : "To:"} {filters.rankTo.length === 1 ? filters.rankTo[0] : `${filters.rankTo.length} ${isRu ? "рангов" : "ranks"}`}
                <button onClick={() => setFilters(p => ({ ...p, rankTo: [] }))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: textMuted, display: "flex" }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </span>
            )}
            {hasActiveFilters && (
              <button onClick={() => setFilters(DEFAULT_FILTERS)} style={{ fontSize: 11, color: textMuted, background: "none", border: "none", cursor: "pointer", padding: "2px 6px", fontFamily: "var(--app-font-sans)" }}>
                {isRu ? "Сбросить всё" : "Clear all"}
              </button>
            )}
          </div>
        )}

        {/* ── Grid ── */}
        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 24px", borderRadius: 18, background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)", border: `1px solid ${borderColor}` }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>{search || gameFilter !== "all" || hasActiveFilters ? "🔍" : "🎮"}</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: textPrimary, marginBottom: 8 }}>
              {search || gameFilter !== "all" || hasActiveFilters ? (isRu ? "Ничего не найдено" : "No results") : (isRu ? "Заявок пока нет" : "No requests yet")}
            </div>
            <div style={{ fontSize: 13, color: textMuted, marginBottom: 22 }}>
              {(search || gameFilter !== "all" || hasActiveFilters) ? (isRu ? "Попробуйте другой запрос или сбросьте фильтры" : "Try a different search or clear filters") : (isRu ? "Создайте первую заявку" : "Post your first boost request")}
            </div>
            {hasActiveFilters && (
              <button onClick={() => setFilters(DEFAULT_FILTERS)} style={{ height: 36, padding: "0 16px", borderRadius: 9, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)", border: "none", cursor: "pointer", color: textPrimary, fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 13, marginRight: 8 }}>
                {isRu ? "Сбросить фильтры" : "Clear filters"}
              </button>
            )}
            {!search && gameFilter === "all" && !hasActiveFilters && (
              <button onClick={() => setShowCreate(true)} style={{ height: 38, padding: "0 18px", borderRadius: 9, background: btnBg, border: "none", cursor: "pointer", color: btnText, fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 13 }}>
                {isRu ? "Создать заявку" : "Post request"}
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {list.map(b => (
              <BoostCard key={b.id} boost={b} isDark={isDark} isRu={isRu} onClick={() => navigate(`/boosts/${b.id}`)}/>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateBoostModal isDark={isDark} onClose={() => setShowCreate(false)} onCreated={b => setBoosts(prev => [b, ...prev])}/>
      )}
    </div>
  );
}
