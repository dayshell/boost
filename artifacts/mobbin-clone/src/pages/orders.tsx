import { useState, useEffect } from "react";
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

const GAME_COLORS: Record<string, { bg: string; text: string }> = {
  "CS2":      { bg: "rgba(255,171,0,0.12)",  text: "#ffab00" },
  "Dota 2":   { bg: "rgba(218,55,55,0.12)",  text: "#e05050" },
  "Valorant": { bg: "rgba(255,70,85,0.12)",  text: "#ff4655" },
};

/* ── Seed data ──────────────────────────────────── */
const SEED_BOOSTS: Boost[] = [
  {
    id: "seed-1",
    authorName: "Артём K.",
    authorEmail: "artem@example.com",
    game: "CS2",
    currentElo: "Silver 3",
    desiredElo: "Gold Nova 2",
    contact: "@artem_boost",
    description: "Аккаунт чистый, без банов. Хочу побыстрее — готов к овертайму. Играю на ноутбуке, поэтому пингует иногда.",
    timeFrom: "10:00",
    timeTo: "23:00",
    budget: "35.00",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "seed-2",
    authorName: "Maksim_D",
    authorEmail: "maks@example.com",
    game: "Valorant",
    currentElo: "Iron 2",
    desiredElo: "Bronze 3",
    contact: "discord: maks#4421",
    description: "Нужно поднять до Bronze 3 как можно скорее, платить готов сразу после буста.",
    timeFrom: "18:00",
    timeTo: "02:00",
    budget: "28.00",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "seed-3",
    authorName: "SerpentX",
    authorEmail: "serp@example.com",
    game: "Dota 2",
    currentElo: "1 800 MMR",
    desiredElo: "2 500 MMR",
    contact: "@serpentx_dota",
    description: "",
    timeFrom: "09:00",
    timeTo: "21:00",
    budget: "60.00",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "seed-4",
    authorName: "nika_val",
    authorEmail: "nika@example.com",
    game: "Valorant",
    currentElo: "Silver 1",
    desiredElo: "Platinum 1",
    contact: "t.me/nika_boost",
    description: "Хочу в платину до конца сезона. Смотреть не буду, просто хочу результат. Аккаунт с 300+ матчами.",
    timeFrom: "11:00",
    timeTo: "20:00",
    budget: "90.00",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: "seed-5",
    authorName: "ProPlayerZero",
    authorEmail: "zero@example.com",
    game: "CS2",
    currentElo: "MG1",
    desiredElo: "DMG",
    contact: "@zero_cs2",
    description: "Аккаунт старый, Prime статус есть. Играть желательно в пиковые часы.",
    timeFrom: "20:00",
    timeTo: "01:00",
    budget: "50.00",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "seed-6",
    authorName: "ivannn99",
    authorEmail: "ivan99@example.com",
    game: "Dota 2",
    currentElo: "3 100 MMR",
    desiredElo: "4 000 MMR",
    contact: "vk.com/ivannn99",
    description: "900 MMR разрыв, понимаю что дорого. Бюджет обсуждаем.",
    timeFrom: "14:00",
    timeTo: "22:00",
    budget: "120.00",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "seed-7",
    authorName: "DimaTwitch",
    authorEmail: "dima@example.com",
    game: "CS2",
    currentElo: "GN4",
    desiredElo: "Master Guardian Elite",
    contact: "discord: dima#7731",
    description: "Стримлю иногда — желательно не удалять игровую историю.",
    timeFrom: "00:00",
    timeTo: "06:00",
    budget: "42.00",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

function loadBoosts(): Boost[] {
  try {
    const raw = localStorage.getItem("boost_boosts");
    if (raw) return JSON.parse(raw);
    // First load — seed test data
    localStorage.setItem("boost_boosts", JSON.stringify(SEED_BOOSTS));
    return SEED_BOOSTS;
  } catch { return SEED_BOOSTS; }
}
export function saveBoosts(boosts: Boost[]) {
  localStorage.setItem("boost_boosts", JSON.stringify(boosts));
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

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 44, padding: "0 14px",
    borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#f0f0ee", fontFamily: "var(--app-font-sans)", fontSize: 14,
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: "rgba(240,240,238,0.5)",
    letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 6, display: "block",
  };

  function handleSubmit() {
    const err: Record<string, boolean> = {};
    if (!currentElo.trim()) err.currentElo = true;
    if (!desiredElo.trim()) err.desiredElo = true;
    if (!contact.trim()) err.contact = true;
    if (!budget.trim()) err.budget = true;
    if (Object.keys(err).length) { setErrors(err); return; }

    const boost: Boost = {
      id: Date.now().toString(),
      authorName: user?.name ?? "User",
      authorEmail: user?.email ?? "",
      game,
      currentElo: currentElo.trim(),
      desiredElo: desiredElo.trim(),
      contact: contact.trim(),
      description: description.trim(),
      timeFrom,
      timeTo,
      budget: budget.trim(),
      createdAt: new Date().toISOString(),
    };
    const all = loadBoosts();
    all.unshift(boost);
    saveBoosts(all);
    onCreated(boost);
    onClose();
  }

  const modal = (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{
        width: "100%", maxWidth: 560,
        background: "#161616",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20,
        boxShadow: "0 40px 120px rgba(0,0,0,0.8)",
        overflow: "hidden",
        maxHeight: "90vh", display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 24px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#f0f0ee", letterSpacing: "-0.02em" }}>
              {isRu ? "Новая заявка на буст" : "New Boost Request"}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(240,240,238,0.4)" }}>
              {isRu ? "Заполните детали буста" : "Fill in boost details"}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: "50%", border: "none",
            background: "rgba(255,255,255,0.08)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(240,240,238,0.6)",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Game */}
          <div>
            <label style={labelStyle}>{isRu ? "Игра" : "Game"}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {GAMES.map(g => {
                const active = game === g;
                const col = GAME_COLORS[g];
                return (
                  <button key={g} onClick={() => setGame(g)} style={{
                    flex: 1, height: 42, borderRadius: 10, border: "none", cursor: "pointer",
                    background: active ? col.bg : "rgba(255,255,255,0.04)",
                    color: active ? col.text : "rgba(240,240,238,0.5)",
                    fontFamily: "var(--app-font-sans)", fontWeight: active ? 700 : 500, fontSize: 13,
                    transition: "all 0.15s",
                    outline: active ? `1.5px solid ${col.text}40` : "none",
                    outlineOffset: "1px",
                  }}>
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ELO row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ ...labelStyle, color: errors.currentElo ? "#e05050" : "rgba(240,240,238,0.5)" }}>
                {isRu ? "Текущее эло / ранг" : "Current elo / rank"}
              </label>
              <input
                value={currentElo} onChange={e => { setCurrentElo(e.target.value); setErrors(p => ({ ...p, currentElo: false })); }}
                placeholder={isRu ? "напр. Silver 2" : "e.g. Silver 2"}
                style={{ ...inputStyle, borderColor: errors.currentElo ? "#e05050" : "rgba(255,255,255,0.1)" }}
                onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                onBlur={e => (e.target.style.borderColor = errors.currentElo ? "#e05050" : "rgba(255,255,255,0.1)")}
              />
            </div>
            <div>
              <label style={{ ...labelStyle, color: errors.desiredElo ? "#e05050" : "rgba(240,240,238,0.5)" }}>
                {isRu ? "Желаемое эло / ранг" : "Desired elo / rank"}
              </label>
              <input
                value={desiredElo} onChange={e => { setDesiredElo(e.target.value); setErrors(p => ({ ...p, desiredElo: false })); }}
                placeholder={isRu ? "напр. Gold Nova 3" : "e.g. Gold Nova 3"}
                style={{ ...inputStyle, borderColor: errors.desiredElo ? "#e05050" : "rgba(255,255,255,0.1)" }}
                onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                onBlur={e => (e.target.style.borderColor = errors.desiredElo ? "#e05050" : "rgba(255,255,255,0.1)")}
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <label style={{ ...labelStyle, color: errors.contact ? "#e05050" : "rgba(240,240,238,0.5)" }}>
              {isRu ? "Контакт для связи" : "Contact"}
            </label>
            <input
              value={contact} onChange={e => { setContact(e.target.value); setErrors(p => ({ ...p, contact: false })); }}
              placeholder="Telegram, Discord, VK…"
              style={{ ...inputStyle, borderColor: errors.contact ? "#e05050" : "rgba(255,255,255,0.1)" }}
              onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
              onBlur={e => (e.target.style.borderColor = errors.contact ? "#e05050" : "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>{isRu ? "Описание (необязательно)" : "Description (optional)"}</label>
            <textarea
              value={description} onChange={e => setDescription(e.target.value)}
              placeholder={isRu ? "Расскажите подробнее о вашем аккаунте или пожеланиях…" : "Tell more about your account or requirements…"}
              rows={3}
              style={{
                ...inputStyle, height: "auto", padding: "12px 14px",
                resize: "vertical", lineHeight: 1.5,
              }}
            />
          </div>

          {/* Time range */}
          <div>
            <label style={labelStyle}>{isRu ? "Время буста (МСК)" : "Boost time (MSK)"}</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center" }}>
              <input
                type="time" value={timeFrom} onChange={e => setTimeFrom(e.target.value)}
                style={{ ...inputStyle, colorScheme: "dark" }}
              />
              <span style={{ color: "rgba(240,240,238,0.3)", fontSize: 14, textAlign: "center" }}>—</span>
              <input
                type="time" value={timeTo} onChange={e => setTimeTo(e.target.value)}
                style={{ ...inputStyle, colorScheme: "dark" }}
              />
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(240,240,238,0.3)" }}>
              {isRu ? "Когда бустер может заходить в ваш аккаунт" : "When booster can access your account"}
            </p>
          </div>

          {/* Budget */}
          <div>
            <label style={{ ...labelStyle, color: errors.budget ? "#e05050" : "rgba(240,240,238,0.5)" }}>
              {isRu ? "Бюджет (USD)" : "Budget (USD)"}
            </label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                color: "rgba(240,240,238,0.4)", fontSize: 14, pointerEvents: "none",
              }}>$</span>
              <input
                value={budget} onChange={e => { setBudget(e.target.value); setErrors(p => ({ ...p, budget: false })); }}
                placeholder="0.00" type="number" min="0" step="0.01"
                style={{ ...inputStyle, paddingLeft: 28, borderColor: errors.budget ? "#e05050" : "rgba(255,255,255,0.1)" }}
                onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                onBlur={e => (e.target.style.borderColor = errors.budget ? "#e05050" : "rgba(255,255,255,0.1)")}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px 20px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex", gap: 10, flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            flex: 1, height: 46, borderRadius: 12,
            background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer",
            color: "rgba(240,240,238,0.6)", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14,
            transition: "background 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          >
            {isRu ? "Отмена" : "Cancel"}
          </button>
          <button onClick={handleSubmit} style={{
            flex: 2, height: 46, borderRadius: 12,
            background: "#f0f0ee", border: "none", cursor: "pointer",
            color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 14,
            transition: "opacity 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            {isRu ? "Разместить заявку" : "Post Boost Request"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

/* ── Boost card ─────────────────────────────────── */
function BoostCard({ boost, onClick }: { boost: Boost; onClick: () => void }) {
  const { lang } = useLang();
  const isRu = lang === "ru";
  const [hov, setHov] = useState(false);
  const col = GAME_COLORS[boost.game];

  const now = Date.now();
  const created = new Date(boost.createdAt).getTime();
  const diffMin = Math.round((now - created) / 60000);
  let timeLabel: string;
  if (diffMin < 1) timeLabel = isRu ? "только что" : "just now";
  else if (diffMin < 60) timeLabel = isRu ? `${diffMin} мин. назад` : `${diffMin}m ago`;
  else if (diffMin < 1440) {
    const h = Math.round(diffMin / 60);
    timeLabel = isRu ? `${h} ч. назад` : `${h}h ago`;
  } else {
    timeLabel = new Date(boost.createdAt).toLocaleDateString(isRu ? "ru-RU" : "en-US", { day: "numeric", month: "short" });
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#1c1c1c" : "#171717",
        border: `1px solid ${hov ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16, padding: "18px 22px",
        cursor: "pointer", transition: "all 0.15s",
        display: "flex", alignItems: "center", gap: 18,
      }}
    >
      {/* Game badge */}
      <div style={{
        width: 50, height: 50, borderRadius: 13, flexShrink: 0,
        background: col.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {boost.game === "Valorant" ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 18L12 4l8 14H4z" fill={col.text} opacity="0.9"/>
          </svg>
        ) : boost.game === "CS2" ? (
          <span style={{ fontSize: 12, fontWeight: 800, color: col.text, fontFamily: "var(--app-font-sans)", letterSpacing: "-0.02em" }}>CS2</span>
        ) : (
          <span style={{ fontSize: 11, fontWeight: 800, color: col.text, fontFamily: "var(--app-font-sans)" }}>D2</span>
        )}
      </div>

      {/* Main info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#f0f0ee" }}>
            {boost.authorName}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
            background: col.bg, color: col.text, flexShrink: 0,
          }}>
            {boost.game}
          </span>
        </div>
        {/* Elo arrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <span style={{ color: "rgba(240,240,238,0.45)", fontVariantNumeric: "tabular-nums" }}>{boost.currentElo}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(240,240,238,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
          <span style={{ color: col.text, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{boost.desiredElo}</span>
        </div>
      </div>

      {/* Right: budget + time */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ee", fontVariantNumeric: "tabular-nums", marginBottom: 3 }}>
          ${Number(boost.budget).toFixed(2)}
        </div>
        <div style={{ fontSize: 11, color: "rgba(240,240,238,0.28)" }}>{timeLabel}</div>
      </div>

      {/* Chevron */}
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(240,240,238,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  );
}

/* ── Boosts page ────────────────────────────────── */
export default function Boosts() {
  const { user } = useAuth();
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const isRu = lang === "ru";

  const [boosts, setBoosts] = useState<Boost[]>(loadBoosts);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState(SearchContext.value);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  useEffect(() => {
    return SearchContext.subscribe(v => setSearch(v));
  }, []);

  const filtered = search.trim()
    ? boosts.filter(b => {
        const q = search.toLowerCase();
        return (
          b.game.toLowerCase().includes(q) ||
          b.currentElo.toLowerCase().includes(q) ||
          b.desiredElo.toLowerCase().includes(q) ||
          b.authorName.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
        );
      })
    : boosts;

  if (!user) return null;

  return (
    <div style={{ minHeight: "100dvh", background: "#111111", fontFamily: "var(--app-font-sans)" }}>
      <Navbar />

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#f0f0ee", letterSpacing: "-0.025em" }}>
              {isRu ? "Заявки на буст" : "Boost Requests"}
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "rgba(240,240,238,0.4)" }}>
              {search
                ? (isRu ? `${filtered.length} по запросу «${search}»` : `${filtered.length} results for "${search}"`)
                : (isRu ? `${filtered.length} активных заявок` : `${filtered.length} active requests`)}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              height: 44, padding: "0 22px", borderRadius: 12,
              background: "#f0f0ee", border: "none", cursor: "pointer",
              color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 14,
              display: "flex", alignItems: "center", gap: 8,
              transition: "opacity 0.15s", flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {isRu ? "Создать заявку" : "New Request"}
          </button>
        </div>

        {/* Active search chip */}
        {search && (
          <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "rgba(240,240,238,0.35)" }}>
              {isRu ? "Фильтр:" : "Filter:"}
            </span>
            <span style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.08)", borderRadius: 20,
              padding: "4px 12px", fontSize: 13, color: "#f0f0ee",
            }}>
              {search}
              <button onClick={() => { setSearch(""); SearchContext.emit(""); }} style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: "rgba(240,240,238,0.45)", display: "flex",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </span>
          </div>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 24px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{search ? "🔍" : "🎮"}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ee", marginBottom: 8 }}>
              {search ? (isRu ? "Ничего не найдено" : "No results") : (isRu ? "Заявок пока нет" : "No requests yet")}
            </div>
            <div style={{ fontSize: 14, color: "rgba(240,240,238,0.4)", marginBottom: 24 }}>
              {search
                ? (isRu ? "Попробуйте другой запрос" : "Try a different search")
                : (isRu ? "Создайте первую заявку на буст" : "Post your first boost request")}
            </div>
            {!search && (
              <button onClick={() => setShowCreate(true)} style={{
                height: 42, padding: "0 20px", borderRadius: 10,
                background: "#f0f0ee", border: "none", cursor: "pointer",
                color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14,
              }}>
                {isRu ? "Создать заявку" : "Post request"}
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(b => (
              <BoostCard key={b.id} boost={b} onClick={() => navigate(`/boosts/${b.id}`)} />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateBoostModal
          onClose={() => setShowCreate(false)}
          onCreated={b => setBoosts(prev => [b, ...prev])}
        />
      )}
    </div>
  );
}
