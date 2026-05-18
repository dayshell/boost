import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useLang } from "../LangContext";
import { useLocation } from "wouter";
import Navbar, { SearchContext } from "../components/Navbar";
import { createPortal } from "react-dom";

export interface Order {
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

const GAME_ICONS: Record<string, React.ReactNode> = {
  "CS2": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="rgba(255,171,0,0.18)"/>
      <text x="12" y="16.5" textAnchor="middle" fill="#ffab00" fontSize="8" fontWeight="800" fontFamily="Arial">CS2</text>
    </svg>
  ),
  "Dota 2": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="rgba(218,55,55,0.18)"/>
      <text x="12" y="16" textAnchor="middle" fill="#e05050" fontSize="7" fontWeight="800" fontFamily="Arial">DOTA</text>
    </svg>
  ),
  "Valorant": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="rgba(255,70,85,0.18)"/>
      <path d="M5 17L12 5l7 12H5z" fill="#ff4655" opacity="0.9"/>
    </svg>
  ),
};

function loadOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem("boost_orders") || "[]");
  } catch { return []; }
}
function saveOrders(orders: Order[]) {
  localStorage.setItem("boost_orders", JSON.stringify(orders));
}

/* ── Create Order Modal ─────────────────────────── */
function CreateOrderModal({ onClose, onCreated }: { onClose: () => void; onCreated: (o: Order) => void }) {
  const { user } = useAuth();
  const { lang } = useLang();
  const isRu = lang === "ru";

  const [game, setGame] = useState<Order["game"]>("CS2");
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

    const order: Order = {
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
    const all = loadOrders();
    all.unshift(order);
    saveOrders(all);
    onCreated(order);
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
              {isRu ? "Новый заказ" : "New Order"}
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

          {/* Game selector */}
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
              placeholder={isRu ? "Telegram, Discord, VK…" : "Telegram, Discord, VK…"}
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
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "rgba(240,240,238,0.35)", pointerEvents: "none" }}>
                  {isRu ? "с" : "from"}
                </span>
                <input
                  type="time" value={timeFrom} onChange={e => setTimeFrom(e.target.value)}
                  style={{
                    ...inputStyle, paddingLeft: timeFrom ? 36 : 14,
                    colorScheme: "dark",
                  }}
                />
              </div>
              <span style={{ color: "rgba(240,240,238,0.3)", fontSize: 14 }}>—</span>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "rgba(240,240,238,0.35)", pointerEvents: "none" }}>
                  {isRu ? "до" : "to"}
                </span>
                <input
                  type="time" value={timeTo} onChange={e => setTimeTo(e.target.value)}
                  style={{
                    ...inputStyle, paddingLeft: 36,
                    colorScheme: "dark",
                  }}
                />
              </div>
            </div>
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
            {isRu ? "Создать заказ" : "Create Order"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

/* ── Order card ─────────────────────────────────── */
function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const { lang } = useLang();
  const isRu = lang === "ru";
  const [hov, setHov] = useState(false);
  const col = GAME_COLORS[order.game];
  const date = new Date(order.createdAt).toLocaleDateString(isRu ? "ru-RU" : "en-US", { day: "numeric", month: "short" });

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#1c1c1c" : "#171717",
        border: `1px solid ${hov ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16, padding: "20px 24px",
        cursor: "pointer", transition: "all 0.15s",
        display: "flex", alignItems: "center", gap: 20,
      }}
    >
      {/* Game icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        background: col.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800, color: col.text, fontFamily: "var(--app-font-sans)",
        letterSpacing: "0.02em",
      }}>
        {order.game === "Valorant" ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 18L12 4l8 14H4z" fill={col.text} opacity="0.9"/>
          </svg>
        ) : (
          <span>{order.game === "CS2" ? "CS2" : "D2"}</span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#f0f0ee" }}>
            {order.authorName}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
            background: col.bg, color: col.text,
          }}>
            {order.game}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(240,240,238,0.5)" }}>
          <span>{order.currentElo}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
          <span style={{ color: "#f0f0ee", fontWeight: 600 }}>{order.desiredElo}</span>
        </div>
      </div>

      {/* Right */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ee", fontVariantNumeric: "tabular-nums", marginBottom: 4 }}>
          ${Number(order.budget).toFixed(2)}
        </div>
        <div style={{ fontSize: 11, color: "rgba(240,240,238,0.3)" }}>{date}</div>
      </div>

      {/* Arrow */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(240,240,238,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  );
}

/* ── Orders page ────────────────────────────────── */
export default function Orders() {
  const { user } = useAuth();
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const isRu = lang === "ru";

  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState(SearchContext.value);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  useEffect(() => {
    return SearchContext.subscribe(v => setSearch(v));
  }, []);

  const filtered = search.trim()
    ? orders.filter(o => {
        const q = search.toLowerCase();
        return (
          o.game.toLowerCase().includes(q) ||
          o.currentElo.toLowerCase().includes(q) ||
          o.desiredElo.toLowerCase().includes(q) ||
          o.authorName.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
        );
      })
    : orders;

  if (!user) return null;

  return (
    <div style={{ minHeight: "100dvh", background: "#111111", fontFamily: "var(--app-font-sans)" }}>
      <Navbar />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#f0f0ee", letterSpacing: "-0.025em" }}>
              {isRu ? "Заказы" : "Orders"}
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "rgba(240,240,238,0.4)" }}>
              {isRu
                ? `${filtered.length} ${filtered.length === 1 ? "заказ" : "заказов"}`
                : `${filtered.length} order${filtered.length !== 1 ? "s" : ""}`}
              {search && ` — «${search}»`}
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
            {isRu ? "Создать заказ" : "Create order"}
          </button>
        </div>

        {/* Filter chips */}
        {search && (
          <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "rgba(240,240,238,0.4)" }}>
              {isRu ? "Поиск:" : "Search:"}
            </span>
            <span style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.08)", borderRadius: 20,
              padding: "4px 12px", fontSize: 13, color: "#f0f0ee",
            }}>
              {search}
              <button onClick={() => { setSearch(""); SearchContext.emit(""); }} style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: "rgba(240,240,238,0.5)", display: "flex",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </span>
          </div>
        )}

        {/* Order list */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 24px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              {search ? "🔍" : "📋"}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ee", marginBottom: 8 }}>
              {search
                ? (isRu ? "Ничего не найдено" : "No results found")
                : (isRu ? "Заказов пока нет" : "No orders yet")}
            </div>
            <div style={{ fontSize: 14, color: "rgba(240,240,238,0.4)", marginBottom: 24 }}>
              {search
                ? (isRu ? "Попробуйте другой запрос" : "Try a different search")
                : (isRu ? "Создайте первый заказ на буст" : "Create your first boost order")}
            </div>
            {!search && (
              <button onClick={() => setShowCreate(true)} style={{
                height: 42, padding: "0 20px", borderRadius: 10,
                background: "#f0f0ee", border: "none", cursor: "pointer",
                color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14,
              }}>
                {isRu ? "Создать заказ" : "Create order"}
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => navigate(`/orders/${order.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateOrderModal
          onClose={() => setShowCreate(false)}
          onCreated={o => setOrders(prev => [o, ...prev])}
        />
      )}
    </div>
  );
}
