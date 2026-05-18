import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "./admin-layout";
import type { Boost } from "./orders";

const GAME_COLORS: Record<string, { accent: string; dim: string }> = {
  "CS2":      { accent: "#ffab00", dim: "rgba(255,171,0,0.15)" },
  "Dota 2":   { accent: "#e05050", dim: "rgba(218,55,55,0.15)" },
  "Valorant": { accent: "#ff4655", dim: "rgba(255,70,85,0.15)" },
};

interface BoostWithStatus extends Boost {
  status: "active" | "completed" | "cancelled";
}

const HISTORY_SEED: BoostWithStatus[] = [
  { id: "seed-1", status: "active", authorName: "Артём K.", authorEmail: "artem@example.com", game: "CS2", currentElo: "Silver 3", desiredElo: "Gold Nova 2", contact: "@artem_boost", description: "Аккаунт чистый, без банов.", timeFrom: "10:00", timeTo: "23:00", budget: "35.00", createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
  { id: "seed-2", status: "active", authorName: "Maksim_D", authorEmail: "maks@example.com", game: "Valorant", currentElo: "Iron 2", desiredElo: "Bronze 3", contact: "discord: maks#4421", description: "Нужно поднять до Bronze 3.", timeFrom: "18:00", timeTo: "02:00", budget: "28.00", createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: "seed-3", status: "completed", authorName: "SerpentX", authorEmail: "serp@example.com", game: "Dota 2", currentElo: "Ancient", desiredElo: "Divine", contact: "@serpentx_dota", description: "Жду быстрого буста.", timeFrom: "09:00", timeTo: "21:00", budget: "60.00", createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "seed-4", status: "completed", authorName: "nika_val", authorEmail: "nika@example.com", game: "Valorant", currentElo: "Silver 1", desiredElo: "Platinum 1", contact: "t.me/nika_boost", description: "Хочу в платину до конца сезона.", timeFrom: "11:00", timeTo: "20:00", budget: "90.00", createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { id: "seed-5", status: "active", authorName: "ProPlayerZero", authorEmail: "zero@example.com", game: "CS2", currentElo: "MG1", desiredElo: "DMG", contact: "@zero_cs2", description: "Аккаунт старый, Prime.", timeFrom: "20:00", timeTo: "01:00", budget: "50.00", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: "seed-6", status: "completed", authorName: "ivannn99", authorEmail: "ivan99@example.com", game: "Dota 2", currentElo: "Legend", desiredElo: "Ancient", contact: "vk.com/ivannn99", description: "900 MMR разрыв.", timeFrom: "14:00", timeTo: "22:00", budget: "120.00", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: "seed-7", status: "cancelled", authorName: "DimaTwitch", authorEmail: "dima@example.com", game: "CS2", currentElo: "GN4", desiredElo: "MGE", contact: "discord: dima#7731", description: "Стримлю иногда.", timeFrom: "00:00", timeTo: "06:00", budget: "42.00", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
  { id: "seed-8", status: "completed", authorName: "Alex_Boost", authorEmail: "alex@example.com", game: "Valorant", currentElo: "Gold 2", desiredElo: "Diamond 1", contact: "@alex_val", description: "Нужно до Даймонда.", timeFrom: "12:00", timeTo: "23:00", budget: "150.00", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
  { id: "hist-1", status: "completed", authorName: "Kirill_Pro", authorEmail: "kirill@example.com", game: "CS2", currentElo: "Silver Elite", desiredElo: "Master Guardian I", contact: "@kirill_cs", description: "Быстрый буст нужен.", timeFrom: "12:00", timeTo: "22:00", budget: "45.00", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString() },
  { id: "hist-2", status: "completed", authorName: "svetlana_v", authorEmail: "sveta@example.com", game: "Valorant", currentElo: "Bronze 2", desiredElo: "Gold 1", contact: "@sveta_val", description: "Хочу в голду.", timeFrom: "15:00", timeTo: "23:00", budget: "75.00", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
];

function loadHistory(): BoostWithStatus[] {
  try {
    const raw = localStorage.getItem("boost_history");
    if (raw) return JSON.parse(raw);
  } catch {}
  return HISTORY_SEED;
}

function StatusBadge({ status }: { status: BoostWithStatus["status"] }) {
  const map = {
    active:    { label: "Активный",   color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
    completed: { label: "Выполнен",   color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
    cancelled: { label: "Отменён",    color: "#f87171", bg: "rgba(248,113,113,0.1)" },
  };
  const s = map[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, borderRadius: 6, padding: "3px 9px",
      fontSize: 12, fontWeight: 600, color: s.color,
    }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: s.color }} />
      {s.label}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60 * 60 * 1000) return `${Math.round(diff / 60000)} мин. назад`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.round(diff / 3600000)} ч. назад`;
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminBoosts() {
  const [, navigate] = useLocation();
  const [boosts] = useState<BoostWithStatus[]>(loadHistory);
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "cancelled">("all");
  const [search, setSearch] = useState("");

  const filtered = boosts.filter(b => {
    if (filter !== "all" && b.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return b.authorName.toLowerCase().includes(q) || b.game.toLowerCase().includes(q) || b.authorEmail.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    all: boosts.length,
    active: boosts.filter(b => b.status === "active").length,
    completed: boosts.filter(b => b.status === "completed").length,
    cancelled: boosts.filter(b => b.status === "cancelled").length,
  };

  const filterTabs: Array<{ id: typeof filter; label: string }> = [
    { id: "all", label: `Все (${counts.all})` },
    { id: "active", label: `Активные (${counts.active})` },
    { id: "completed", label: `Выполненные (${counts.completed})` },
    { id: "cancelled", label: `Отменённые (${counts.cancelled})` },
  ];

  return (
    <AdminLayout title="История бустов">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Всего", value: counts.all, color: "#f0f0ee" },
          { label: "Активных", value: counts.active, color: "#4ade80" },
          { label: "Выполнено", value: counts.completed, color: "#60a5fa" },
          { label: "Отменено", value: counts.cancelled, color: "#f87171" },
        ].map(s => (
          <div key={s.label} style={{ background: "#1a1a1a", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", padding: "16px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.35)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(240,240,238,0.3)" strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder="Поиск по имени, игре, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", height: 38, padding: "0 12px 0 36px", borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
              color: "#f0f0ee", fontFamily: "var(--app-font-sans)", fontSize: 13, outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {filterTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              style={{
                height: 36, padding: "0 14px", borderRadius: 8, border: "none", cursor: "pointer",
                background: filter === t.id ? "rgba(255,255,255,0.12)" : "transparent",
                color: filter === t.id ? "#f0f0ee" : "rgba(240,240,238,0.4)",
                fontFamily: "var(--app-font-sans)", fontWeight: filter === t.id ? 600 : 400, fontSize: 13,
                transition: "all 0.12s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#1a1a1a", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1fr 1fr",
          padding: "11px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.3)", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          <div>Автор</div>
          <div>Игра</div>
          <div>Маршрут</div>
          <div>Сумма</div>
          <div>Статус</div>
          <div>Дата</div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: "48px 18px", textAlign: "center", color: "rgba(240,240,238,0.3)", fontSize: 14 }}>
            Ничего не найдено
          </div>
        ) : filtered.map((b, i) => {
          const col = GAME_COLORS[b.game];
          return (
            <div
              key={b.id}
              onClick={() => navigate(`/boosts/${b.id}`)}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1fr 1fr",
                padding: "14px 18px",
                borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                cursor: "pointer", transition: "background 0.12s", alignItems: "center",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f0ee" }}>{b.authorName}</div>
                <div style={{ fontSize: 12, color: "rgba(240,240,238,0.35)", marginTop: 2 }}>{b.authorEmail}</div>
              </div>
              <div>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: col.accent,
                  background: col.dim, borderRadius: 6, padding: "3px 9px",
                }}>
                  {b.game}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(240,240,238,0.65)" }}>
                {b.currentElo} → {b.desiredElo}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f0ee" }}>
                ${Number(b.budget).toFixed(0)}
              </div>
              <div><StatusBadge status={b.status} /></div>
              <div style={{ fontSize: 12, color: "rgba(240,240,238,0.35)" }}>{formatDate(b.createdAt)}</div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
