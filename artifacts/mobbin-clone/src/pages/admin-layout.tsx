import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../AuthContext";
import { useSiteSettings } from "../SiteSettingsContext";

const NAV_ITEMS = [
  {
    id: "settings",
    path: "/admin/settings",
    label: "Настройки сайта",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
  {
    id: "boosts",
    path: "/admin/boosts",
    label: "История бустов",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    id: "users",
    path: "/admin/users",
    label: "Пользователи",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const { user, logout } = useAuth();
  const { settings } = useSiteSettings();
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Редирект для не-админов
    if (!user) {
      navigate("/login");
    } else if (!user.isAdmin) {
      navigate("/boosts");
    }
  }, [user, navigate]);

  // Показываем загрузку пока проверяем
  if (!user || !user.isAdmin) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--app-font-sans)",
      }}>
        <div style={{ color: "rgba(240,240,238,0.3)", fontSize: 14 }}>
          Загрузка...
        </div>
      </div>
    );
  }

  const currentSection = NAV_ITEMS.find(n => location.startsWith(n.path))?.id ?? "settings";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0d0d0d", fontFamily: "var(--app-font-sans)" }}>
      {/* Sidebar */}
      <div style={{
        width: 232, flexShrink: 0, background: "#111111",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, background: settings.primaryColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 18, color: "#fff", flexShrink: 0,
            }}>
              {settings.logoLetter}
            </div>
            <span style={{ color: "#f0f0ee", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>
              {settings.siteName}
            </span>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(255,171,0,0.12)", border: "1px solid rgba(255,171,0,0.2)",
            borderRadius: 6, padding: "2px 8px",
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#ffab00" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#ffab00", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Admin Panel
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "10px 10px", flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(240,240,238,0.25)", letterSpacing: "0.06em", textTransform: "uppercase", padding: "8px 8px 6px" }}>
            Управление
          </div>
          {NAV_ITEMS.map(item => {
            const active = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "9px 10px", borderRadius: 9, border: "none", cursor: "pointer",
                  background: active ? "rgba(255,255,255,0.08)" : "transparent",
                  color: active ? "#f0f0ee" : "rgba(240,240,238,0.5)",
                  fontFamily: "var(--app-font-sans)", fontWeight: active ? 600 : 400, fontSize: 14,
                  textAlign: "left", transition: "all 0.12s", marginBottom: 2,
                }}
                onMouseEnter={e => !active && (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={e => !active && (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ opacity: active ? 1 : 0.6, display: "flex" }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}

          <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 10 }}>
            <button
              onClick={() => navigate("/boosts")}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "9px 10px", borderRadius: 9, border: "none", cursor: "pointer",
                background: "transparent", color: "rgba(240,240,238,0.4)",
                fontFamily: "var(--app-font-sans)", fontWeight: 400, fontSize: 14,
                textAlign: "left", transition: "all 0.12s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              На сайт
            </button>
          </div>
        </nav>

        {/* User */}
        <div style={{
          padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: "#1e1e1e",
            border: "1.5px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#f0f0ee", flexShrink: 0,
          }}>
            {user.initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f0ee", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: "rgba(240,240,238,0.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.email}
            </div>
          </div>
          <button
            onClick={logout}
            title="Выйти"
            style={{
              width: 28, height: 28, borderRadius: 7, border: "none", cursor: "pointer",
              background: "rgba(255,255,255,0.06)", color: "rgba(240,240,238,0.45)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,80,80,0.15)"; e.currentTarget.style.color = "#ff5050"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(240,240,238,0.45)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        {/* Header */}
        <div style={{
          padding: "20px 32px", borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "#111111", position: "sticky", top: 0, zIndex: 10,
        }}>
          <h1 style={{ margin: 0, color: "#f0f0ee", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {title}
          </h1>
        </div>
        <div style={{ padding: "28px 32px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
