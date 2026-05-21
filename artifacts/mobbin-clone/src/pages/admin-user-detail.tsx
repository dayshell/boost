import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { AdminLayout } from "./admin-layout";

const API_URL = "http://localhost:3000";

interface UserDetail {
  user: {
    id: number;
    email: string;
    nickname: string | null;
    role: string;
    balance: number;
    isBanned: boolean;
    hasPassword: boolean;
    createdAt: string;
  };
  loginLogs: Array<{
    id: number;
    ipAddress: string;
    country: string | null;
    city: string | null;
    device: string | null;
    browser: string | null;
    createdAt: string;
  }>;
  activityLogs: Array<{
    id: number;
    action: string;
    details: any;
    ipAddress: string | null;
    createdAt: string;
  }>;
  ban: {
    id: number;
    reason: string;
    bannedUntil: string | null;
    isPermanent: boolean;
    createdAt: string;
  } | null;
}

export default function AdminUserDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Edit states
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameValue, setNicknameValue] = useState("");
  const [editingBalance, setEditingBalance] = useState(false);
  const [balanceValue, setBalanceValue] = useState("");
  
  // Ban modal
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState<number | null>(null);
  const [isPermanent, setIsPermanent] = useState(false);

  useEffect(() => {
    loadUserDetails();
  }, [params.id]);

  async function loadUserDetails() {
    try {
      const token = localStorage.getItem("boost_token");
      const res = await fetch(`${API_URL}/api/admin/users/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setData(result);
      setEmailValue(result.user.email);
      setNicknameValue(result.user.nickname || "");
      setBalanceValue(result.user.balance);
    } catch (err: any) {
      alert(err.message || "Ошибка загрузки");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(field: string, value: any) {
    try {
      const token = localStorage.getItem("boost_token");
      const res = await fetch(`${API_URL}/api/admin/users/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      await loadUserDetails();
    } catch (err: any) {
      alert(err.message || "Ошибка обновления");
    }
  }

  async function handleBan() {
    if (!banReason.trim()) {
      alert("Укажите причину бана");
      return;
    }

    try {
      const token = localStorage.getItem("boost_token");
      const res = await fetch(`${API_URL}/api/admin/users/${params.id}/ban`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: banReason,
          duration: banDuration,
          isPermanent,
        }),
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setShowBanModal(false);
      await loadUserDetails();
    } catch (err: any) {
      alert(err.message || "Ошибка бана");
    }
  }

  async function handleUnban() {
    try {
      const token = localStorage.getItem("boost_token");
      const res = await fetch(`${API_URL}/api/admin/users/${params.id}/unban`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      await loadUserDetails();
    } catch (err: any) {
      alert(err.message || "Ошибка разбана");
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <AdminLayout title="Загрузка...">
        <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(240,240,238,0.3)" }}>
          Загрузка...
        </div>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout title="Пользователь не найден">
        <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(240,240,238,0.3)" }}>
          Пользователь не найден
        </div>
      </AdminLayout>
    );
  }

  const { user, loginLogs, activityLogs, ban } = data;

  return (
    <AdminLayout title={`Пользователь: ${user.nickname || user.email}`}>
      <button
        onClick={() => navigate("/admin/users")}
        style={{
          marginBottom: 24,
          padding: "8px 16px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
          color: "#f0f0ee",
          cursor: "pointer",
          fontFamily: "var(--app-font-sans)",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        ← Назад к списку
      </button>

      {/* User Info Card */}
      <div style={{ background: "#1a1a1a", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", padding: "24px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 700,
            color: "#fff",
          }}>
            {(user.nickname || user.email).charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0f0ee", margin: "0 0 4px" }}>
              {user.nickname || user.email.split("@")[0]}
            </h2>
            <div style={{ fontSize: 14, color: "rgba(240,240,238,0.45)" }}>
              ID: {user.id} • Зарегистрирован: {formatDate(user.createdAt)}
            </div>
          </div>
          {user.isBanned ? (
            <button
              onClick={handleUnban}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                background: "#4ade80",
                color: "#111",
                cursor: "pointer",
                fontFamily: "var(--app-font-sans)",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Разбанить
            </button>
          ) : (
            <button
              onClick={() => setShowBanModal(true)}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                background: "#ef4444",
                color: "#fff",
                cursor: "pointer",
                fontFamily: "var(--app-font-sans)",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Забанить
            </button>
          )}
        </div>

        {/* Ban Info */}
        {ban && user.isBanned && (
          <div style={{
            padding: "12px 16px",
            borderRadius: 10,
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", marginBottom: 4 }}>
              🚫 Пользователь забанен
            </div>
            <div style={{ fontSize: 13, color: "rgba(240,240,238,0.6)" }}>
              Причина: {ban.reason}
            </div>
            {ban.isPermanent ? (
              <div style={{ fontSize: 13, color: "rgba(240,240,238,0.6)" }}>
                Тип: Перманентный бан
              </div>
            ) : ban.bannedUntil ? (
              <div style={{ fontSize: 13, color: "rgba(240,240,238,0.6)" }}>
                До: {formatDate(ban.bannedUntil)}
              </div>
            ) : null}
          </div>
        )}

        {/* Editable Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.3)", marginBottom: 6, textTransform: "uppercase" }}>
              Email
            </div>
            {editingEmail ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="email"
                  value={emailValue}
                  onChange={e => setEmailValue(e.target.value)}
                  style={{
                    flex: 1,
                    height: 36,
                    padding: "0 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#f0f0ee",
                    fontSize: 14,
                    fontFamily: "var(--app-font-sans)",
                  }}
                />
                <button
                  onClick={() => {
                    updateUser("email", emailValue);
                    setEditingEmail(false);
                  }}
                  style={{
                    padding: "0 12px",
                    borderRadius: 8,
                    border: "none",
                    background: "#4ade80",
                    color: "#111",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setEmailValue(user.email);
                    setEditingEmail(false);
                  }}
                  style={{
                    padding: "0 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#f0f0ee",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: "#f0f0ee" }}>{user.email}</span>
                <button
                  onClick={() => setEditingEmail(true)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#f0f0ee",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Изменить
                </button>
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.3)", marginBottom: 6, textTransform: "uppercase" }}>
              Никнейм
            </div>
            {editingNickname ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={nicknameValue}
                  onChange={e => setNicknameValue(e.target.value)}
                  style={{
                    flex: 1,
                    height: 36,
                    padding: "0 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#f0f0ee",
                    fontSize: 14,
                    fontFamily: "var(--app-font-sans)",
                  }}
                />
                <button
                  onClick={() => {
                    updateUser("nickname", nicknameValue);
                    setEditingNickname(false);
                  }}
                  style={{
                    padding: "0 12px",
                    borderRadius: 8,
                    border: "none",
                    background: "#4ade80",
                    color: "#111",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setNicknameValue(user.nickname || "");
                    setEditingNickname(false);
                  }}
                  style={{
                    padding: "0 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#f0f0ee",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: "#f0f0ee" }}>{user.nickname || "—"}</span>
                <button
                  onClick={() => setEditingNickname(true)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#f0f0ee",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Изменить
                </button>
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.3)", marginBottom: 6, textTransform: "uppercase" }}>
              Баланс
            </div>
            {editingBalance ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="number"
                  value={balanceValue}
                  onChange={e => setBalanceValue(e.target.value)}
                  style={{
                    flex: 1,
                    height: 36,
                    padding: "0 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#f0f0ee",
                    fontSize: 14,
                    fontFamily: "var(--app-font-sans)",
                  }}
                />
                <button
                  onClick={() => {
                    updateUser("balance", parseFloat(balanceValue));
                    setEditingBalance(false);
                  }}
                  style={{
                    padding: "0 12px",
                    borderRadius: 8,
                    border: "none",
                    background: "#4ade80",
                    color: "#111",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setBalanceValue(user.balance.toString());
                    setEditingBalance(false);
                  }}
                  style={{
                    padding: "0 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#f0f0ee",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: "#f0f0ee", fontWeight: 700 }}>${user.balance}</span>
                <button
                  onClick={() => setEditingBalance(true)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#f0f0ee",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Изменить
                </button>
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.3)", marginBottom: 6, textTransform: "uppercase" }}>
              Роль
            </div>
            <span style={{ fontSize: 14, color: "#f0f0ee" }}>{user.role}</span>
          </div>
        </div>
      </div>

      {/* Login Logs */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f0ee", marginBottom: 12 }}>
          Логи входа ({loginLogs.length})
        </h3>
        <div style={{ background: "#1a1a1a", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
          {loginLogs.length === 0 ? (
            <div style={{ padding: "24px", textAlign: "center", color: "rgba(240,240,238,0.3)", fontSize: 14 }}>
              Нет логов входа
            </div>
          ) : (
            loginLogs.slice(0, 10).map((log, i) => (
              <div
                key={log.id}
                style={{
                  padding: "12px 18px",
                  borderBottom: i < Math.min(loginLogs.length, 10) - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: 12,
                  fontSize: 13,
                }}
              >
                <div>
                  <div style={{ color: "rgba(240,240,238,0.4)", fontSize: 11, marginBottom: 2 }}>IP</div>
                  <div style={{ color: "#f0f0ee" }}>{log.ipAddress}</div>
                </div>
                <div>
                  <div style={{ color: "rgba(240,240,238,0.4)", fontSize: 11, marginBottom: 2 }}>Локация</div>
                  <div style={{ color: "#f0f0ee" }}>{log.country || "—"} {log.city ? `/ ${log.city}` : ""}</div>
                </div>
                <div>
                  <div style={{ color: "rgba(240,240,238,0.4)", fontSize: 11, marginBottom: 2 }}>Устройство</div>
                  <div style={{ color: "#f0f0ee" }}>{log.device || "—"}</div>
                </div>
                <div>
                  <div style={{ color: "rgba(240,240,238,0.4)", fontSize: 11, marginBottom: 2 }}>Время</div>
                  <div style={{ color: "#f0f0ee" }}>{formatDate(log.createdAt)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Activity Logs */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f0ee", marginBottom: 12 }}>
          Логи активности ({activityLogs.length})
        </h3>
        <div style={{ background: "#1a1a1a", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
          {activityLogs.length === 0 ? (
            <div style={{ padding: "24px", textAlign: "center", color: "rgba(240,240,238,0.3)", fontSize: 14 }}>
              Нет логов активности
            </div>
          ) : (
            activityLogs.slice(0, 20).map((log, i) => (
              <div
                key={log.id}
                style={{
                  padding: "12px 18px",
                  borderBottom: i < Math.min(activityLogs.length, 20) - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 13,
                }}
              >
                <div>
                  <div style={{ color: "#f0f0ee", fontWeight: 600, marginBottom: 2 }}>{log.action}</div>
                  {log.ipAddress && (
                    <div style={{ color: "rgba(240,240,238,0.4)", fontSize: 12 }}>IP: {log.ipAddress}</div>
                  )}
                </div>
                <div style={{ color: "rgba(240,240,238,0.4)", fontSize: 12 }}>
                  {formatDate(log.createdAt)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ban Modal */}
      {showBanModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowBanModal(false)}
        >
          <div
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: "32px",
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f0ee", margin: "0 0 8px" }}>
              Забанить пользователя
            </h2>
            <p style={{ fontSize: 14, color: "rgba(240,240,238,0.45)", margin: "0 0 24px" }}>
              Укажите причину и длительность бана
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,240,238,0.6)", display: "block", marginBottom: 6 }}>
                Причина бана
              </label>
              <textarea
                value={banReason}
                onChange={e => setBanReason(e.target.value)}
                placeholder="Например: Нарушение правил сервиса"
                style={{
                  width: "100%",
                  height: 80,
                  padding: "12px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#f0f0ee",
                  fontFamily: "var(--app-font-sans)",
                  fontSize: 14,
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={isPermanent}
                  onChange={e => setIsPermanent(e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                <span style={{ fontSize: 14, color: "#f0f0ee" }}>Перманентный бан</span>
              </label>
            </div>

            {!isPermanent && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,240,238,0.6)", display: "block", marginBottom: 6 }}>
                  Длительность (секунды)
                </label>
                <input
                  type="number"
                  value={banDuration || ""}
                  onChange={e => setBanDuration(parseInt(e.target.value) || null)}
                  placeholder="Например: 86400 (1 день)"
                  style={{
                    width: "100%",
                    height: 44,
                    padding: "0 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#f0f0ee",
                    fontFamily: "var(--app-font-sans)",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ fontSize: 12, color: "rgba(240,240,238,0.4)", marginTop: 4 }}>
                  1 час = 3600, 1 день = 86400, 1 неделя = 604800
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowBanModal(false)}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#f0f0ee",
                  cursor: "pointer",
                  fontFamily: "var(--app-font-sans)",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleBan}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 10,
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  cursor: "pointer",
                  fontFamily: "var(--app-font-sans)",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Забанить
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
