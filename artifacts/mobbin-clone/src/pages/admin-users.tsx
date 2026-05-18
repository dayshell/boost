import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "./admin-layout";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarColor: string;
  balance: number;
  createdAt: string;
  loginLogs: { date: string; ip: string; country: string; device: string }[];
  deposits: { id: string; date: string; amount: number; method: string }[];
  boostIds: string[];
}

export const SEED_USERS: AdminUser[] = [
  {
    id: "user-1", name: "Артём K.", email: "artem@example.com", password: "qwerty123",
    avatarColor: "#ffab00", balance: 150.00,
    createdAt: "2025-11-15T10:00:00Z",
    loginLogs: [
      { date: "2026-05-18T08:23:00Z", ip: "95.31.25.14", country: "🇷🇺 Россия", device: "Chrome / Windows" },
      { date: "2026-05-15T19:45:00Z", ip: "95.31.25.14", country: "🇷🇺 Россия", device: "Chrome / Windows" },
      { date: "2026-05-10T12:11:00Z", ip: "37.214.60.8", country: "🇧🇾 Беларусь", device: "Safari / iPhone" },
    ],
    deposits: [
      { id: "dep-1", date: "2026-05-01T10:00:00Z", amount: 50, method: "Карта" },
      { id: "dep-2", date: "2026-04-15T14:30:00Z", amount: 100, method: "Крипто" },
    ],
    boostIds: ["seed-1", "seed-5"],
  },
  {
    id: "user-2", name: "Maksim_D", email: "maks@example.com", password: "pass1234",
    avatarColor: "#ff4655", balance: 28.50,
    createdAt: "2025-12-01T14:00:00Z",
    loginLogs: [
      { date: "2026-05-17T20:15:00Z", ip: "178.252.10.5", country: "🇷🇺 Россия", device: "Firefox / Windows" },
      { date: "2026-05-12T11:00:00Z", ip: "178.252.10.5", country: "🇷🇺 Россия", device: "Firefox / Windows" },
    ],
    deposits: [
      { id: "dep-3", date: "2026-04-20T09:00:00Z", amount: 30, method: "Карта" },
    ],
    boostIds: ["seed-2"],
  },
  {
    id: "user-3", name: "nika_val", email: "nika@example.com", password: "nike2024!",
    avatarColor: "#a78bfa", balance: 0,
    createdAt: "2026-01-10T09:30:00Z",
    loginLogs: [
      { date: "2026-05-16T17:02:00Z", ip: "109.201.143.7", country: "🇷🇺 Россия", device: "Chrome / macOS" },
      { date: "2026-05-08T14:44:00Z", ip: "109.201.143.7", country: "🇷🇺 Россия", device: "Chrome / macOS" },
    ],
    deposits: [
      { id: "dep-4", date: "2026-05-10T08:00:00Z", amount: 90, method: "Карта" },
    ],
    boostIds: ["seed-4"],
  },
  {
    id: "user-4", name: "SerpentX", email: "serp@example.com", password: "serpent777",
    avatarColor: "#e05050", balance: 320.00,
    createdAt: "2025-10-05T11:00:00Z",
    loginLogs: [
      { date: "2026-05-17T09:30:00Z", ip: "5.101.221.4", country: "🇰🇿 Казахстан", device: "Chrome / Windows" },
      { date: "2026-05-11T21:14:00Z", ip: "5.101.221.4", country: "🇰🇿 Казахстан", device: "Chrome / Windows" },
      { date: "2026-04-30T16:50:00Z", ip: "5.101.221.5", country: "🇰🇿 Казахстан", device: "Edge / Windows" },
    ],
    deposits: [
      { id: "dep-5", date: "2026-05-01T10:00:00Z", amount: 200, method: "Крипто" },
      { id: "dep-6", date: "2026-04-10T16:20:00Z", amount: 180, method: "Крипто" },
    ],
    boostIds: ["seed-3", "seed-6"],
  },
  {
    id: "user-5", name: "Alex_Boost", email: "alex@example.com", password: "alexxx99",
    avatarColor: "#34d399", balance: 5.20,
    createdAt: "2026-02-14T12:00:00Z",
    loginLogs: [
      { date: "2026-05-18T06:11:00Z", ip: "212.48.70.3", country: "🇺🇦 Украина", device: "Chrome / Android" },
    ],
    deposits: [
      { id: "dep-7", date: "2026-03-01T10:00:00Z", amount: 150, method: "Карта" },
    ],
    boostIds: ["seed-8"],
  },
];

export function loadUsers(): AdminUser[] {
  try {
    const raw = localStorage.getItem("boost_admin_users");
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_USERS;
}

export function saveUsers(users: AdminUser[]) {
  localStorage.setItem("boost_admin_users", JSON.stringify(users));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminUsers() {
  const [, navigate] = useLocation();
  const [users] = useState<AdminUser[]>(loadUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <AdminLayout title="Пользователи">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Всего пользователей", value: users.length },
          { label: "Общий баланс", value: `$${users.reduce((s, u) => s + u.balance, 0).toFixed(2)}` },
          { label: "Всего депозитов", value: users.reduce((s, u) => s + u.deposits.length, 0) },
        ].map(s => (
          <div key={s.label} style={{ background: "#1a1a1a", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", padding: "16px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.35)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#f0f0ee" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16, maxWidth: 360 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(240,240,238,0.3)" strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          placeholder="Поиск по имени или email..."
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

      {/* Table */}
      <div style={{ background: "#1a1a1a", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr",
          padding: "11px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)",
          fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.3)", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          <div>Пользователь</div>
          <div>Email</div>
          <div>Баланс</div>
          <div>Бустов</div>
          <div>Регистрация</div>
        </div>
        {filtered.map((u, i) => (
          <div
            key={u.id}
            onClick={() => navigate(`/admin/users/${u.id}`)}
            style={{
              display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr",
              padding: "14px 18px",
              borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              cursor: "pointer", transition: "background 0.12s", alignItems: "center",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                background: u.avatarColor + "22", border: `2px solid ${u.avatarColor}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: u.avatarColor,
              }}>
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f0ee" }}>{u.name}</div>
                <div style={{ fontSize: 11, color: "rgba(240,240,238,0.3)", marginTop: 1 }}>{u.loginLogs.length} входов</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "rgba(240,240,238,0.55)" }}>{u.email}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: u.balance > 0 ? "#4ade80" : "#f0f0ee" }}>
              ${u.balance.toFixed(2)}
            </div>
            <div style={{ fontSize: 14, color: "#f0f0ee" }}>{u.boostIds.length}</div>
            <div style={{ fontSize: 12, color: "rgba(240,240,238,0.35)" }}>{formatDate(u.createdAt)}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
