import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useLang } from "../LangContext";
import { useLocation } from "wouter";

type Section = "account" | "preferences" | "billing" | "team";

const NAV_ITEMS: { key: Section; labelEn: string; labelRu: string; icon: React.ReactNode }[] = [
  {
    key: "account",
    labelEn: "Account",
    labelRu: "Аккаунт",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    key: "preferences",
    labelEn: "Preferences",
    labelRu: "Предпочтения",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
  },
  {
    key: "billing",
    labelEn: "Plan & Billing",
    labelRu: "Тариф и оплата",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    key: "team",
    labelEn: "Team",
    labelRu: "Команда",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

function SettingRow({
  label, value, action, actionLabel, actionColor = "#f0f0ee", onAction,
}: {
  label: string; value: string; action?: boolean; actionLabel?: string;
  actionColor?: string; onAction?: () => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#f0f0ee", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 14, color: "rgba(240,240,238,0.45)" }}>{value}</div>
      </div>
      {action && (
        <button
          onClick={onAction}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14,
            color: actionColor, padding: 0, transition: "opacity 0.15s", flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.65")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default function Settings() {
  const { user, logout } = useAuth();
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const [section, setSection] = useState<Section>("account");
  const isRu = lang === "ru";

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div style={{
      minHeight: "100dvh", background: "#111111",
      display: "flex", fontFamily: "var(--app-font-sans)",
    }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 220, flexShrink: 0, padding: "28px 16px",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex", flexDirection: "column", gap: 4,
      }}>
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 32, padding: "0 8px" }}>
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#f0f0ee" />
            <text x="20" y="28" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="bold" fontSize="24" fill="#111">B</text>
          </svg>
          <span style={{ color: "#f0f0ee", fontWeight: 700, fontSize: 16 }}>Boost</span>
        </a>

        {NAV_ITEMS.map(({ key, labelEn, labelRu, icon }) => {
          const active = section === key;
          return (
            <button
              key={key}
              onClick={() => setSection(key)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8, border: "none",
                cursor: "pointer", textAlign: "left", width: "100%",
                background: active ? "rgba(255,255,255,0.08)" : "transparent",
                color: active ? "#f0f0ee" : "rgba(240,240,238,0.5)",
                fontFamily: "var(--app-font-sans)", fontSize: 14, fontWeight: active ? 600 : 500,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              {icon}
              <span>{isRu ? labelRu : labelEn}</span>
            </button>
          );
        })}
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, padding: "48px 64px", maxWidth: 680 }}>
        {section === "account" && (
          <>
            {/* Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "#1a6b3c",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, fontWeight: 700, color: "#fff", flexShrink: 0,
              }}>
                {user.initial}
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#f0f0ee", marginBottom: 4 }}>{user.name}</div>
                <div style={{ fontSize: 14, color: "rgba(240,240,238,0.45)" }}>{user.email}</div>
              </div>
            </div>

            {/* Personal details */}
            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ee", margin: "0 0 4px" }}>
                {isRu ? "Личные данные" : "Personal details"}
              </h2>
              <div>
                <SettingRow
                  label={isRu ? "Имя" : "Name"}
                  value={user.name}
                  action
                  actionLabel={isRu ? "Изменить" : "Edit"}
                />
                <SettingRow
                  label={isRu ? "Email адрес" : "Email address"}
                  value={user.email}
                  action
                  actionLabel={isRu ? "Изменить" : "Edit"}
                />
                <SettingRow
                  label={isRu ? "Пароль" : "Password"}
                  value={isRu ? "Пароль не задан" : "No password yet"}
                  action
                  actionLabel={isRu ? "Создать" : "Create new"}
                />
              </div>
            </section>

            {/* Manage account */}
            <section>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ee", margin: "0 0 4px" }}>
                {isRu ? "Управление аккаунтом" : "Manage account"}
              </h2>
              <SettingRow
                label={isRu ? "Удалить аккаунт" : "Delete account"}
                value={isRu ? "Навсегда удалить ваш аккаунт Boost." : "Permanently delete your Boost account."}
                action
                actionLabel={isRu ? "Удалить" : "Delete"}
                actionColor="#e5533a"
                onAction={() => { logout(); navigate("/"); }}
              />
            </section>
          </>
        )}

        {section === "preferences" && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ee", marginBottom: 24 }}>
              {isRu ? "Предпочтения" : "Preferences"}
            </h2>
            <p style={{ color: "rgba(240,240,238,0.45)", fontSize: 14 }}>
              {isRu ? "Настройки предпочтений скоро появятся." : "Preference settings coming soon."}
            </p>
          </div>
        )}

        {section === "billing" && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ee", marginBottom: 24 }}>
              {isRu ? "Тариф и оплата" : "Plan & Billing"}
            </h2>
            <p style={{ color: "rgba(240,240,238,0.45)", fontSize: 14 }}>
              {isRu ? "Раздел оплаты скоро появится." : "Billing section coming soon."}
            </p>
          </div>
        )}

        {section === "team" && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ee", marginBottom: 24 }}>
              {isRu ? "Команда" : "Team"}
            </h2>
            <p style={{ color: "rgba(240,240,238,0.45)", fontSize: 14 }}>
              {isRu ? "Раздел команды скоро появится." : "Team section coming soon."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
