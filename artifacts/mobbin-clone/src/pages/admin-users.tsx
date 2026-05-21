import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "./admin-layout";
import { useAuth } from "../AuthContext";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "booster" | "admin";
  avatarColor: string;
  balance: number;
  createdAt: string;
  hasPassword: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" });
}

const ROLE_LABELS: Record<string, string> = {
  user: "Пользователь",
  booster: "Бустер",
  admin: "Администратор",
};

const ROLE_COLORS: Record<string, string> = {
  user: "#6b7280",
  booster: "#3b82f6",
  admin: "#ef4444",
};

export default function AdminUsers() {
  const [, navigate] = useLocation();
  const { getAllUsers, changeUserRole } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [changingRole, setChangingRole] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getAllUsers();
      const mapped = data.map((u: any) => ({
        id: u.id,
        name: u.email.split("@")[0],
        email: u.email,
        role: u.role,
        avatarColor: getColorForEmail(u.email),
        balance: parseFloat(u.balance) || 0,
        createdAt: u.createdAt,
        hasPassword: u.hasPassword,
      }));
      setUsers(mapped);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }

  function getColorForEmail(email: string): string {
    const colors = ["#ffab00", "#ff4655", "#a78bfa", "#e05050", "#34d399", "#3b82f6", "#f59e0b"];
    const hash = email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  async function handleRoleChange(userId: number, newRole: "user" | "booster" | "admin") {
    setChangingRole(userId);
    try {
      await changeUserRole(userId, newRole);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || "Ошибка изменения роли");
    } finally {
      setChangingRole(null);
    }
  }

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <AdminLayout title="Пользователи">
        <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(240,240,238,0.3)" }}>
          Загрузка...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Пользователи">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Всего пользователей", value: users.length },
          { label: "Администраторов", value: users.filter(u => u.role === "admin").length },
          { label: "Бустеров", value: users.filter(u => u.role === "booster").length },
          { label: "Общий баланс", value: `$${users.reduce((s, u) => s + u.balance, 0).toFixed(2)}` },
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
          display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1.2fr",
          padding: "11px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)",
          fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.3)", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          <div>Пользователь</div>
          <div>Email</div>
          <div>Баланс</div>
          <div>Роль</div>
          <div>Регистрация</div>
          <div>Действия</div>
        </div>
        {filtered.map((u, i) => (
          <div
            key={u.id}
            onClick={() => navigate(`/admin/users/${u.id}`)}
            style={{
              display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1.2fr",
              padding: "14px 18px",
              borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              transition: "background 0.12s", alignItems: "center",
              cursor: "pointer",
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
                <div style={{ fontSize: 11, color: "rgba(240,240,238,0.3)", marginTop: 1 }}>
                  {u.hasPassword ? "🔒 С паролем" : "🔓 Без пароля"}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "rgba(240,240,238,0.55)" }}>{u.email}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: u.balance > 0 ? "#4ade80" : "#f0f0ee" }}>
              ${u.balance.toFixed(2)}
            </div>
            <div>
              <span style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                background: ROLE_COLORS[u.role] + "22",
                border: `1px solid ${ROLE_COLORS[u.role]}44`,
                color: ROLE_COLORS[u.role],
              }}>
                {ROLE_LABELS[u.role]}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(240,240,238,0.35)" }}>{formatDate(u.createdAt)}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <select
                value={u.role}
                onChange={e => handleRoleChange(u.id, e.target.value as any)}
                disabled={changingRole === u.id}
                style={{
                  height: 32,
                  padding: "0 8px",
                  borderRadius: 7,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#f0f0ee",
                  fontSize: 12,
                  fontFamily: "var(--app-font-sans)",
                  cursor: changingRole === u.id ? "not-allowed" : "pointer",
                  opacity: changingRole === u.id ? 0.5 : 1,
                }}
              >
                <option value="user">User</option>
                <option value="booster">Booster</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
