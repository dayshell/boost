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

const GAME_COLORS: Record<string, { accent: string; dim: string }> = {
  "CS2":      { accent: "#ffab00", dim: "rgba(255,171,0,0.18)" },
  "Dota 2":   { accent: "#e05050", dim: "rgba(218,55,55,0.18)" },
  "Valorant": { accent: "#ff4655", dim: "rgba(255,70,85,0.18)" },
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

function isNew(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() < 1000 * 60 * 60 * 3;
}

/* ── Game logo SVGs ──────────────────────────────── */
function LogoAll({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor" opacity="0.9"/>
      <rect x="13" y="2" width="9" height="9" rx="2" fill="currentColor" opacity="0.65"/>
      <rect x="2" y="13" width="9" height="9" rx="2" fill="currentColor" opacity="0.65"/>
      <rect x="13" y="13" width="9" height="9" rx="2" fill="currentColor" opacity="0.9"/>
    </svg>
  );
}

function LogoCS2({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 8v8c0 6.6 5.1 12.8 12 14 6.9-1.2 12-7.4 12-14V8L16 2z" fill={color} opacity="0.15"/>
      <path d="M16 2L4 8v8c0 6.6 5.1 12.8 12 14 6.9-1.2 12-7.4 12-14V8L16 2z" stroke={color} strokeWidth="1.5" fill="none"/>
      <circle cx="16" cy="16" r="3" fill={color}/>
      <line x1="16" y1="8" x2="16" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="21" x2="16" y2="24" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="16" x2="11" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="21" y1="16" x2="24" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function LogoDota2({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 3 L29 10 V22 L16 29 L3 22 V10 Z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.12"/>
      <text x="16" y="21" textAnchor="middle" fill={color} fontSize="11" fontWeight="900" fontFamily="Arial Black,Arial">D2</text>
    </svg>
  );
}

function LogoValorant({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M3 26L14 4h4L7 26H3z" fill={color}/>
      <path d="M13 26L24 4h4l-11 22h-4z" fill={color} opacity="0.55"/>
    </svg>
  );
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
      {/* Browser bar */}
      <rect width="280" height="26" fill="rgba(255,255,255,0.04)"/>
      <circle cx="13" cy="13" r="3" fill="rgba(255,255,255,0.18)"/>
      <circle cx="22" cy="13" r="3" fill="rgba(255,255,255,0.18)"/>
      <circle cx="31" cy="13" r="3" fill="rgba(255,255,255,0.18)"/>
      <rect x="46" y="7" width="120" height="12" rx="3" fill="rgba(255,255,255,0.07)"/>
      {/* Current rank box */}
      <rect x="12" y="38" width="76" height="80" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      <circle cx="50" cy="62" r="17" fill={col.dim} stroke={col.accent} strokeWidth="0.7" strokeOpacity="0.5"/>
      {boost.game === "Valorant" ? <polygon points="50,49 62,75 38,75" fill={col.accent} opacity="0.85"/> :
       boost.game === "CS2" ? <text x="50" y="67" textAnchor="middle" fill={col.accent} fontSize="8" fontWeight="900" fontFamily="Arial">CS2</text> :
       <text x="50" y="67" textAnchor="middle" fill={col.accent} fontSize="9" fontWeight="900" fontFamily="Arial">D2</text>}
      <text x="50" y="100" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="Arial">CURRENT</text>
      <text x="50" y="110" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="7" fontWeight="700" fontFamily="Arial">
        {boost.currentElo.length > 10 ? boost.currentElo.slice(0, 10) : boost.currentElo}
      </text>
      {/* Arrow */}
      <line x1="96" y1="78" x2="114" y2="78" stroke={col.accent} strokeWidth="1.5" strokeOpacity="0.7"/>
      <polygon points="114,74 120,78 114,82" fill={col.accent} opacity="0.7"/>
      {/* Target rank box */}
      <rect x="124" y="38" width="76" height="80" rx="8" fill={col.dim} stroke={col.accent} strokeWidth="0.5" strokeOpacity="0.4"/>
      <circle cx="162" cy="62" r="17" fill="rgba(0,0,0,0.25)" stroke={col.accent} strokeWidth="1" strokeOpacity="0.8"/>
      {boost.game === "Valorant" ? <polygon points="162,49 174,75 150,75" fill={col.accent}/> :
       boost.game === "CS2" ? <text x="162" y="67" textAnchor="middle" fill={col.accent} fontSize="8" fontWeight="900" fontFamily="Arial">CS2</text> :
       <text x="162" y="67" textAnchor="middle" fill={col.accent} fontSize="9" fontWeight="900" fontFamily="Arial">D2</text>}
      <text x="162" y="100" textAnchor="middle" fill={col.accent} fontSize="6" fontFamily="Arial" opacity="0.8">TARGET</text>
      <text x="162" y="110" textAnchor="middle" fill={col.accent} fontSize="7" fontWeight="700" fontFamily="Arial">
        {boost.desiredElo.length > 10 ? boost.desiredElo.slice(0, 10) : boost.desiredElo}
      </text>
      {/* Budget */}
      <rect x="208" y="38" width="60" height="30" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5"/>
      <text x="238" y="49" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="5.5" fontFamily="Arial">BUDGET</text>
      <text x="238" y="61" textAnchor="middle" fill="#f0f0ee" fontSize="11" fontWeight="700" fontFamily="Arial">${Number(boost.budget).toFixed(0)}</text>
      {/* Time */}
      <rect x="208" y="76" width="60" height="24" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
      <text x="238" y="86" textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="5" fontFamily="Arial">MSK TIME</text>
      <text x="238" y="96" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="Arial">{boost.timeFrom}–{boost.timeTo}</text>
      {/* Description lines */}
      <rect x="12" y="128" width="256" height="7" rx="2.5" fill="rgba(255,255,255,0.06)"/>
      <rect x="12" y="141" width="190" height="6" rx="2" fill="rgba(255,255,255,0.04)"/>
      <rect x="12" y="153" width="130" height="5" rx="2" fill="rgba(255,255,255,0.03)"/>
      {/* Bottom accent */}
      <rect x="0" y="172" width="280" height="3" fill={col.accent} opacity="0.4"/>
    </svg>
  );
}

/* ── Game icon for card footer ───────────────────── */
function GameLogo({ game, size = 32 }: { game: string; size?: number }) {
  const col = GAME_COLORS[game];
  const r = Math.round(size * 0.28);
  return (
    <div style={{
      width: size, height: size, borderRadius: r, flexShrink: 0,
      background: col.dim, display: "flex", alignItems: "center", justifyContent: "center",
      border: "1px solid rgba(255,255,255,0.08)",
    }}>
      {game === "CS2" ? <LogoCS2 size={size * 0.58} color={col.accent}/> :
       game === "Dota 2" ? <LogoDota2 size={size * 0.6} color={col.accent}/> :
       <LogoValorant size={size * 0.6} color={col.accent}/>}
    </div>
  );
}

/* ── Boost card — EXACT Mobbin structure ─────────── */
function BoostCard({ boost, onClick, isDark }: { boost: Boost; onClick: () => void; isDark: boolean }) {
  const [hov, setHov] = useState(false);
  const fresh = isNew(boost.createdAt);

  const cardBg = isDark ? "#252525" : "#e8e8e6";
  const textPrimary = isDark ? "#f0f0ee" : "#131415";
  const textSecondary = isDark ? "rgba(240,240,238,0.45)" : "#666660";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ cursor: "pointer" }}
    >
      {/* ── Gray card container (like Mobbin) ── */}
      <div style={{
        background: cardBg,
        borderRadius: 18, padding: 8,
        transition: "transform 0.15s",
        transform: hov ? "translateY(-4px)" : "none",
        position: "relative",
      }}>
        {/* Screenshot preview inside with own border-radius */}
        <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "16/10" }}>
          <CardPreview boost={boost}/>
        </div>

        {/* "New" badge — absolute top-left of card */}
        {fresh && (
          <div style={{
            position: "absolute", top: 16, left: 16,
            background: isDark ? "#f0f0ee" : "#131415",
            color: isDark ? "#111" : "#fff",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
            borderRadius: 6, padding: "3px 8px",
            fontFamily: "var(--app-font-sans)",
          }}>New</div>
        )}

        {/* Bookmark icon — top-right */}
        <div style={{
          position: "absolute", top: 16, right: 16,
          width: 26, height: 26, borderRadius: 7,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: hov ? 1 : 0, transition: "opacity 0.15s",
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
      </div>

      {/* ── Footer OUTSIDE the card — exactly like Mobbin ── */}
      <div style={{
        padding: "11px 4px 0",
        display: "flex", alignItems: "flex-start", gap: 10,
      }}>
        <GameLogo game={boost.game} size={32}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: textPrimary,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            marginBottom: 2, lineHeight: 1.3,
          }}>
            {boost.authorName}
          </div>
          <div style={{
            fontSize: 11, color: textSecondary,
            overflow: "hidden", textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            lineHeight: 1.45,
          }}>
            {boost.description || `${boost.currentElo} → ${boost.desiredElo}`}
          </div>
        </div>
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

  const inp: React.CSSProperties = {
    width: "100%", height: 42, padding: "0 13px",
    borderRadius: 9, border: `1px solid ${inputBorder}`,
    background: inputBg, color: textPrimary,
    fontFamily: "var(--app-font-sans)", fontSize: 14,
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
  };
  const lbl: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: textMuted,
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
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        width: "100%", maxWidth: 520, background: modalBg,
        border: `1px solid ${dividerColor}`, borderRadius: 18,
        boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
        maxHeight: "92vh", display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px 16px", borderBottom: `1px solid ${dividerColor}`, flexShrink: 0 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: textPrimary, letterSpacing: "-0.02em" }}>
              {isRu ? "Новая заявка" : "New Boost Request"}
            </h2>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: textMuted }}>
              {isRu ? "Заполните детали и разместите заявку" : "Fill in the details and post"}
            </p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: textMuted }}>
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
                    background: active ? col.dim : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"),
                    color: active ? col.accent : textMuted,
                    fontFamily: "var(--app-font-sans)", fontWeight: active ? 700 : 400, fontSize: 13,
                    transition: "all 0.12s", outline: active ? `1px solid ${col.dim}` : "none", outlineOffset: 1,
                  }}>{g}</button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ ...lbl, color: errors.currentElo ? "#e05050" : textMuted }}>{isRu ? "Текущий ранг" : "Current rank"}</label>
              <input value={currentElo} onChange={e => { setCurrentElo(e.target.value); setErrors(p => ({ ...p, currentElo: false })); }} placeholder="Silver 2"
                style={{ ...inp, borderColor: errors.currentElo ? "#e05050" : inputBorder }}
                onFocus={e => (e.target.style.borderColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)")}
                onBlur={e => (e.target.style.borderColor = errors.currentElo ? "#e05050" : inputBorder)}/>
            </div>
            <div>
              <label style={{ ...lbl, color: errors.desiredElo ? "#e05050" : textMuted }}>{isRu ? "Желаемый ранг" : "Target rank"}</label>
              <input value={desiredElo} onChange={e => { setDesiredElo(e.target.value); setErrors(p => ({ ...p, desiredElo: false })); }} placeholder="Gold Nova 3"
                style={{ ...inp, borderColor: errors.desiredElo ? "#e05050" : inputBorder }}
                onFocus={e => (e.target.style.borderColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)")}
                onBlur={e => (e.target.style.borderColor = errors.desiredElo ? "#e05050" : inputBorder)}/>
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
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder={isRu ? "О вашем аккаунте…" : "About your account…"} rows={2}
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
          <button onClick={onClose} style={{ flex: 1, height: 42, borderRadius: 9, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", color: textMuted, fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 13 }}>
            {isRu ? "Отмена" : "Cancel"}
          </button>
          <button onClick={submit} style={{ flex: 2, height: 42, borderRadius: 9, background: isDark ? "#f0f0ee" : "#131415", border: "none", cursor: "pointer", color: isDark ? "#111" : "#fff", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 13, transition: "opacity 0.12s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >{isRu ? "Разместить заявку" : "Post Request"}</button>
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

function GameTabIcon({ id, size = 20 }: { id: GameFilter; size?: number }) {
  if (id === "all")      return <LogoAll size={size}/>;
  if (id === "CS2")      return <LogoCS2 size={size} color="currentColor"/>;
  if (id === "Dota 2")   return <LogoDota2 size={size} color="currentColor"/>;
  return <LogoValorant size={size} color="currentColor"/>;
}

/* ── Page ─────────────────────────────────────────── */
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
  const [search, setSearch] = useState(SearchContext.value);

  useEffect(() => { if (!user) navigate("/login"); }, [user]);
  useEffect(() => SearchContext.subscribe(v => setSearch(v)), []);

  let list = [...boosts];
  if (gameFilter !== "all") list = list.filter(b => b.game === gameFilter);
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
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!user) return null;

  const pageBg     = isDark ? "#111111" : "#f5f5f4";
  const textPrimary = isDark ? "#f0f0ee" : "#131415";
  const textMuted   = isDark ? "rgba(240,240,238,0.4)" : "#666660";
  const borderColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const btnBg       = isDark ? "#f0f0ee" : "#131415";
  const btnText     = isDark ? "#111" : "#fff";
  const tabActiveBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const tabInactiveColor = isDark ? "rgba(240,240,238,0.4)" : "#666660";

  return (
    <div style={{ minHeight: "100dvh", background: pageBg, fontFamily: "var(--app-font-sans)" }}>
      <Navbar/>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 48px" }}>

        {/* ── Top bar ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${borderColor}`, paddingBottom: 0, marginBottom: 24,
        }}>
          {/* Game filter tabs with logos */}
          <div style={{ display: "flex", gap: 4, padding: "10px 0" }}>
            {GAME_TABS.map(tab => {
              const active = gameFilter === tab.id;
              const gameCol = tab.id !== "all" ? GAME_COLORS[tab.id] : null;
              return (
                <button
                  key={tab.id}
                  onClick={() => setGameFilter(tab.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    height: 34, padding: "0 13px", borderRadius: 20, border: "none",
                    cursor: "pointer", transition: "all 0.15s",
                    background: active ? tabActiveBg : "transparent",
                    color: active
                      ? (gameCol ? gameCol.accent : textPrimary)
                      : tabInactiveColor,
                    fontFamily: "var(--app-font-sans)", fontWeight: active ? 600 : 400, fontSize: 13,
                  }}
                  onMouseEnter={e => !active && (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)")}
                  onMouseLeave={e => !active && (e.currentTarget.style.background = "transparent")}
                >
                  <GameTabIcon id={tab.id} size={16}/>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* New request button */}
          <button
            onClick={() => setShowCreate(true)}
            style={{
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

        {/* Active search chip */}
        {search && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <span style={{ fontSize: 12, color: textMuted }}>{isRu ? `${list.length} по запросу` : `${list.length} for`}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", borderRadius: 20, padding: "3px 10px 3px 12px", fontSize: 12, color: textPrimary }}>
              «{search}»
              <button onClick={() => { setSearch(""); SearchContext.emit(""); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: textMuted, display: "flex" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </span>
          </div>
        )}

        {/* ── Grid — 4 columns, Mobbin exact ── */}
        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 24px", borderRadius: 18, background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)", border: `1px solid ${borderColor}` }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>{search || gameFilter !== "all" ? "🔍" : "🎮"}</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: textPrimary, marginBottom: 8 }}>
              {search || gameFilter !== "all" ? (isRu ? "Ничего не найдено" : "No results") : (isRu ? "Заявок пока нет" : "No requests yet")}
            </div>
            <div style={{ fontSize: 13, color: textMuted, marginBottom: 22 }}>
              {(search || gameFilter !== "all") ? (isRu ? "Попробуйте другой запрос или сбросьте фильтр" : "Try a different search or clear filters") : (isRu ? "Создайте первую заявку" : "Post your first boost request")}
            </div>
            {!search && gameFilter === "all" && (
              <button onClick={() => setShowCreate(true)} style={{ height: 38, padding: "0 18px", borderRadius: 9, background: btnBg, border: "none", cursor: "pointer", color: btnText, fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 13 }}>
                {isRu ? "Создать заявку" : "Post request"}
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}>
            {list.map(b => (
              <BoostCard key={b.id} boost={b} isDark={isDark} onClick={() => navigate(`/boosts/${b.id}`)}/>
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
