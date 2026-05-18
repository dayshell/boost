import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { AdminLayout } from "./admin-layout";
import { loadUsers, saveUsers, AdminUser } from "./admin-users";

const GAME_COLORS: Record<string, string> = { "CS2": "#ffab00", "Dota 2": "#e05050", "Valorant": "#ff4655" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.3)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ background: "#1a1a1a", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

const inp: React.CSSProperties = {
  height: 38, padding: "0 12px", borderRadius: 9,
  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
  color: "#f0f0ee", fontFamily: "var(--app-font-sans)", fontSize: 14,
  outline: "none", width: "100%", boxSizing: "border-box" as const,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

const BOOST_SEED_MAP: Record<string, { game: string; from: string; to: string; budget: string; status: string }> = {
  "seed-1": { game: "CS2",      from: "Silver 3",  to: "Gold Nova 2",   budget: "$35",  status: "active" },
  "seed-2": { game: "Valorant", from: "Iron 2",    to: "Bronze 3",      budget: "$28",  status: "active" },
  "seed-3": { game: "Dota 2",   from: "Ancient",   to: "Divine",        budget: "$60",  status: "completed" },
  "seed-4": { game: "Valorant", from: "Silver 1",  to: "Platinum 1",    budget: "$90",  status: "completed" },
  "seed-5": { game: "CS2",      from: "MG1",       to: "DMG",           budget: "$50",  status: "active" },
  "seed-6": { game: "Dota 2",   from: "Legend",    to: "Ancient",       budget: "$120", status: "completed" },
  "seed-7": { game: "CS2",      from: "GN4",       to: "MGE",           budget: "$42",  status: "cancelled" },
  "seed-8": { game: "Valorant", from: "Gold 2",    to: "Diamond 1",     budget: "$150", status: "completed" },
};

export default function AdminUserDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [users, setUsers] = useState<AdminUser[]>(loadUsers);
  const userIndex = users.findIndex(u => u.id === params.id);
  const [form, setForm] = useState<AdminUser | null>(() => users[userIndex] ? { ...users[userIndex] } : null);
  const [saved, setSaved] = useState(false);
  const [balanceEdit, setBalanceEdit] = useState(false);
  const [newBalance, setNewBalance] = useState("");

  if (!form) {
    return (
      <AdminLayout title="Пользователь не найден">
        <div style={{ color: "rgba(240,240,238,0.5)", fontSize: 14 }}>Пользователь с ID {params.id} не найден.</div>
      </AdminLayout>
    );
  }

  function save() {
    if (!form) return;
    const updated = [...users];
    updated[userIndex] = form;
    setUsers(updated);
    saveUsers(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function applyBalance() {
    const val = parseFloat(newBalance);
    if (isNaN(val) || val < 0) return;
    setForm(p => p ? { ...p, balance: val } : p);
    setBalanceEdit(false);
    setNewBalance("");
  }

  function patch(key: keyof AdminUser, value: unknown) {
    setForm(p => p ? { ...p, [key]: value } : p);
  }

  const statusColors: Record<string, string> = {
    active: "#4ade80", completed: "#60a5fa", cancelled: "#f87171",
  };
  const statusLabels: Record<string, string> = {
    active: "Активный", completed: "Выполнен", cancelled: "Отменён",
  };

  return (
    <AdminLayout title={form.name}>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Left column */}
        <div style={{ flex: "0 0 300px" }}>
          {/* Avatar + basic info */}
          <div style={{ background: "#1a1a1a", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", padding: "24px 20px", marginBottom: 16, textAlign: "center" }}>
            {/* Avatar */}
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: form.avatarColor + "22", border: `2.5px solid ${form.avatarColor}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, fontWeight: 700, color: form.avatarColor,
                }}>
                  {form.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Color picker for avatar */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Цвет аватарки
              </div>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                {["#ffab00", "#ff4655", "#e05050", "#60a5fa", "#4ade80", "#a78bfa", "#34d399", "#f87171"].map(c => (
                  <button
                    key={c}
                    onClick={() => patch("avatarColor", c)}
                    style={{
                      width: 22, height: 22, borderRadius: "50%", background: c, border: "none",
                      cursor: "pointer", outline: form.avatarColor === c ? `2px solid ${c}` : "none",
                      outlineOffset: 2, transition: "outline 0.12s",
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f0ee", marginBottom: 4 }}>{form.name}</div>
            <div style={{ fontSize: 13, color: "rgba(240,240,238,0.4)" }}>{form.email}</div>
            <div style={{ fontSize: 12, color: "rgba(240,240,238,0.25)", marginTop: 4 }}>
              с {new Date(form.createdAt).toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}
            </div>
          </div>

          {/* Balance card */}
          <div style={{ background: "#1a1a1a", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", padding: "18px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
              Баланс
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: form.balance > 0 ? "#4ade80" : "#f0f0ee", marginBottom: 12 }}>
              ${form.balance.toFixed(2)}
            </div>
            {balanceEdit ? (
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  autoFocus
                  type="number" min="0" step="0.01"
                  value={newBalance}
                  onChange={e => setNewBalance(e.target.value)}
                  placeholder="0.00"
                  style={{ ...inp, height: 34 }}
                />
                <button onClick={applyBalance} style={{ height: 34, padding: "0 12px", borderRadius: 8, border: "none", cursor: "pointer", background: "#4ade80", color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>✓</button>
                <button onClick={() => setBalanceEdit(false)} style={{ height: 34, padding: "0 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", background: "transparent", color: "rgba(240,240,238,0.5)", fontFamily: "var(--app-font-sans)", fontSize: 13, flexShrink: 0 }}>✕</button>
              </div>
            ) : (
              <button
                onClick={() => { setBalanceEdit(true); setNewBalance(form.balance.toFixed(2)); }}
                style={{ height: 34, padding: "0 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", background: "transparent", color: "rgba(240,240,238,0.55)", fontFamily: "var(--app-font-sans)", fontWeight: 500, fontSize: 13, width: "100%" }}
              >
                Изменить баланс
              </button>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Profile fields */}
          <Section title="Профиль">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {[
                { key: "name" as const, label: "Ник / Имя", type: "text" },
                { key: "email" as const, label: "Email", type: "email" },
                { key: "password" as const, label: "Пароль", type: "text" },
              ].map((f, i) => (
                <div key={f.key} style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)", gridColumn: f.key === "password" ? "1 / -1" : undefined }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 7 }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={String(form[f.key])}
                    onChange={e => patch(f.key, e.target.value)}
                    style={inp}
                  />
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 18px" }}>
              <button
                onClick={save}
                style={{
                  height: 38, padding: "0 20px", borderRadius: 9, border: "none", cursor: "pointer",
                  background: saved ? "#4ade80" : "#f0f0ee", color: "#111",
                  fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 14, transition: "background 0.2s",
                }}
              >
                {saved ? "✓ Сохранено" : "Сохранить изменения"}
              </button>
            </div>
          </Section>

          {/* Login logs */}
          <Section title={`Логи входов (${form.loginLogs.length})`}>
            {form.loginLogs.length === 0 ? (
              <div style={{ padding: "20px 18px", color: "rgba(240,240,238,0.3)", fontSize: 13 }}>Нет входов</div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 1.5fr", padding: "9px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontSize: 10, fontWeight: 700, color: "rgba(240,240,238,0.25)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  <div>Дата</div><div>IP</div><div>Страна</div><div>Устройство</div>
                </div>
                {form.loginLogs.map((log, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 1.5fr", padding: "12px 18px", borderBottom: i < form.loginLogs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
                    <div style={{ fontSize: 13, color: "#f0f0ee" }}>{formatDate(log.date)}</div>
                    <div style={{ fontSize: 12, color: "rgba(240,240,238,0.45)", fontFamily: "monospace" }}>{log.ip}</div>
                    <div style={{ fontSize: 13, color: "rgba(240,240,238,0.65)" }}>{log.country}</div>
                    <div style={{ fontSize: 12, color: "rgba(240,240,238,0.45)" }}>{log.device}</div>
                  </div>
                ))}
              </>
            )}
          </Section>

          {/* Deposits */}
          <Section title={`История депозитов (${form.deposits.length})`}>
            {form.deposits.length === 0 ? (
              <div style={{ padding: "20px 18px", color: "rgba(240,240,238,0.3)", fontSize: 13 }}>Нет депозитов</div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "9px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontSize: 10, fontWeight: 700, color: "rgba(240,240,238,0.25)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  <div>Дата</div><div>Сумма</div><div>Метод</div>
                </div>
                {form.deposits.map((dep, i) => (
                  <div key={dep.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "12px 18px", borderBottom: i < form.deposits.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
                    <div style={{ fontSize: 13, color: "#f0f0ee" }}>{formatDate(dep.date)}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#4ade80" }}>+${dep.amount}</div>
                    <div style={{ fontSize: 12, color: "rgba(240,240,238,0.45)" }}>{dep.method}</div>
                  </div>
                ))}
                <div style={{ padding: "10px 18px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#f0f0ee" }}>
                    Итого: <span style={{ color: "#4ade80" }}>${form.deposits.reduce((s, d) => s + d.amount, 0)}</span>
                  </span>
                </div>
              </>
            )}
          </Section>

          {/* Boosts */}
          <Section title={`Бусты (${form.boostIds.length})`}>
            {form.boostIds.length === 0 ? (
              <div style={{ padding: "20px 18px", color: "rgba(240,240,238,0.3)", fontSize: 13 }}>Нет бустов</div>
            ) : (
              form.boostIds.map((bid, i) => {
                const b = BOOST_SEED_MAP[bid];
                if (!b) return null;
                const gameColor = GAME_COLORS[b.game] ?? "#f0f0ee";
                return (
                  <div
                    key={bid}
                    onClick={() => navigate(`/boosts/${bid}`)}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", borderBottom: i < form.boostIds.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", cursor: "pointer", transition: "background 0.12s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600, color: gameColor, background: gameColor + "22", borderRadius: 6, padding: "3px 9px" }}>{b.game}</span>
                    <span style={{ fontSize: 14, color: "#f0f0ee" }}>{b.from} → {b.to}</span>
                    <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: "#f0f0ee" }}>{b.budget}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, borderRadius: 5, padding: "2px 8px",
                      color: statusColors[b.status], background: statusColors[b.status] + "18",
                    }}>
                      {statusLabels[b.status]}
                    </span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(240,240,238,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                );
              })
            )}
          </Section>
        </div>
      </div>
    </AdminLayout>
  );
}

const statusColors: Record<string, string> = { active: "#4ade80", completed: "#60a5fa", cancelled: "#f87171" };
const statusLabels: Record<string, string> = { active: "Активный", completed: "Выполнен", cancelled: "Отменён" };
