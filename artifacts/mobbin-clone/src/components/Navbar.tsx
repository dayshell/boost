import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLang } from "../LangContext";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";
import { translations } from "../i18n";
import { useLocation } from "wouter";

/* ── Request Game Modal ──────────────────────────── */
function RequestGameModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const isRu = lang === "ru";
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(false);

  const modal = (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div style={{
        width: 380, background: "#1e1e1e", borderRadius: 24,
        padding: "32px 28px 28px", position: "relative",
        boxShadow: "0 32px 100px rgba(0,0,0,0.7)",
        border: "1px solid rgba(255,255,255,0.09)",
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14,
            width: 28, height: 28, borderRadius: "50%",
            border: "none", background: "rgba(255,255,255,0.09)",
            color: "rgba(240,240,238,0.7)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 56, lineHeight: 1 }}>🎮</span>
        </div>

        {/* Title */}
        <h2 style={{
          textAlign: "center", color: "#f0f0ee",
          fontFamily: "var(--app-font-sans)",
          fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em",
          margin: "0 0 24px", lineHeight: 1.35,
        }}>
          {isRu
            ? "Какую игру вы хотите\nчтобы мы добавили на сайт?"
            : "Which game should\nwe add to the site?"}
        </h2>

        {sent ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>✓</div>
            <div style={{ color: "rgba(240,240,238,0.65)", fontSize: 15 }}>
              {isRu ? "Запрос отправлен, спасибо!" : "Request sent, thank you!"}
            </div>
          </div>
        ) : (
          <>
            {/* Styled input */}
            <div style={{
              position: "relative",
              marginBottom: 10,
              borderRadius: 9999,
              background: focused ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.06)",
              border: `1.5px solid ${focused ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.11)"}`,
              transition: "border-color 0.18s, background 0.18s",
              display: "flex", alignItems: "center",
            }}>
              <svg style={{ position: "absolute", left: 16, opacity: 0.35, flexShrink: 0 }}
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#f0f0ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder={isRu ? "Название игры..." : "Game name..."}
                value={value}
                onChange={e => setValue(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoFocus
                style={{
                  width: "100%", height: 50, padding: "0 16px 0 42px",
                  background: "transparent", border: "none", outline: "none",
                  color: "#f0f0ee", fontFamily: "var(--app-font-sans)",
                  fontSize: 15, boxSizing: "border-box",
                }}
              />
            </div>

            <p style={{ fontSize: 12, color: "rgba(240,240,238,0.35)", margin: "0 0 20px 4px" }}>
              {isRu ? "Только одна игра за раз." : "Only one per request."}
            </p>

            <button
              onClick={() => { if (value.trim()) setSent(true); }}
              style={{
                width: "100%", height: 50, borderRadius: 9999,
                background: value.trim() ? "rgba(240,240,238,0.95)" : "rgba(240,240,238,0.18)",
                color: value.trim() ? "#111" : "rgba(240,240,238,0.45)",
                border: "none",
                cursor: value.trim() ? "pointer" : "default",
                fontFamily: "var(--app-font-sans)", fontSize: 15, fontWeight: 600,
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {isRu ? "Продолжить" : "Continue"}
            </button>
          </>
        )}

        {/* Progress bar */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 22 }}>
          <div style={{ width: 32, height: 4, borderRadius: 9999, background: "#f0f0ee" }} />
          <div style={{ width: 32, height: 4, borderRadius: 9999, background: "rgba(240,240,238,0.18)" }} />
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

function BoostLogo({ size = 30 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
        <rect width="40" height="40" rx="11" fill="#0f0f0f" />
        <text x="20" y="29" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="bold" fontSize="26" fill="white" letterSpacing="-1">B</text>
      </svg>
      <span style={{
        fontFamily: "var(--app-font-sans)", fontWeight: 700,
        fontSize: Math.round(size * 0.6), letterSpacing: "-0.01em",
        color: "var(--text-primary)", lineHeight: 1,
      }}>Boost</span>
    </div>
  );
}

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div style={{ display: "flex", background: "var(--bg-tertiary)", borderRadius: 9999, padding: 3, gap: 2 }}>
      {(["en", "ru"] as const).map((l) => (
        <button key={l} onClick={() => setLang(l)} style={{
          height: 26, padding: "0 10px", borderRadius: 9999, border: "none", cursor: "pointer",
          fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 12, transition: "all 0.18s",
          background: lang === l ? "var(--bg-primary)" : "transparent",
          color: lang === l ? "var(--text-primary)" : "var(--text-tertiary)",
          boxShadow: lang === l ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
        }}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ── Profile dropdown ─────────────────────────────── */
function ProfileMenu({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme() as { theme: string; setTheme: (t: "light" | "dark" | "system") => void; toggleTheme: () => void };
  const { lang, setLang } = useLang();
  const [, navigate] = useLocation();
  const isRu = lang === "ru";
  const [showRequestGame, setShowRequestGame] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const menuBg = "#1c1c1c";
  const menuBorder = "rgba(255,255,255,0.09)";
  const itemColor = "#f0f0ee";
  const mutedColor = "rgba(240,240,238,0.45)";
  const divider = <div style={{ height: 1, background: menuBorder, margin: "6px 0" }} />;

  function MenuItem({
    icon, label, badge, arrow, onClick,
  }: {
    icon?: React.ReactNode; label: string; badge?: string; arrow?: boolean; onClick?: () => void;
  }) {
    const [hov, setHov] = useState(false);
    return (
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={onClick}
        style={{
          display: "flex", alignItems: "center", gap: 10, width: "100%",
          padding: "8px 14px", border: "none", borderRadius: 8, cursor: "pointer",
          background: hov ? "rgba(255,255,255,0.06)" : "transparent",
          color: itemColor, fontFamily: "var(--app-font-sans)", fontSize: 14, fontWeight: 500,
          textAlign: "left", transition: "background 0.12s",
        }}
      >
        {icon && <span style={{ opacity: 0.6, flexShrink: 0, display: "flex" }}>{icon}</span>}
        <span style={{ flex: 1 }}>{label}</span>
        {badge && (
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "1px 6px", borderRadius: 9999,
            background: "rgba(255,255,255,0.12)", color: itemColor,
          }}>{badge}</span>
        )}
        {arrow && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={mutedColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
          </svg>
        )}
      </button>
    );
  }

  const themeOptions: { key: "light" | "dark" | "system"; icon: React.ReactNode }[] = [
    {
      key: "light",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        </svg>
      ),
    },
    {
      key: "dark",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
    },
    {
      key: "system",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
  ];

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: 70,
        right: 20,
        width: 280,
        background: menuBg,
        border: `1px solid ${menuBorder}`,
        borderRadius: 14,
        boxShadow: "0 8px 40px rgba(0,0,0,0.55)",
        zIndex: 1000,
        overflow: "hidden",
        padding: "8px 6px",
      }}
    >
      {/* User info */}
      <div style={{ padding: "10px 14px 12px" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: itemColor, marginBottom: 2 }}>
          {user?.name ?? "User"}
        </div>
        <div style={{ fontSize: 12, color: mutedColor, marginBottom: 12 }}>
          {user?.email ?? ""}
        </div>
        <button style={{
          width: "100%", height: 34, borderRadius: 9999,
          background: "rgba(255,255,255,0.09)", border: "none",
          color: itemColor, fontFamily: "var(--app-font-sans)", fontSize: 13, fontWeight: 600,
          cursor: "pointer", transition: "opacity 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.72")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          {isRu ? "Настроить профиль" : "Set up profile"}
        </button>
      </div>

      {divider}

      <MenuItem
        icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>}
        label={isRu ? "Запросить игру" : "Request game"}
        onClick={() => setShowRequestGame(true)}
      />
      <MenuItem
        icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>}
        label={isRu ? "Настройки" : "Settings"}
        onClick={() => { navigate("/settings"); onClose(); }}
      />

      {divider}

      {/* Theme picker */}
      <div style={{ display: "flex", alignItems: "center", padding: "6px 14px", gap: 0 }}>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: itemColor }}>
          {isRu ? "Тема" : "Theme"}
        </span>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.07)", borderRadius: 9999, padding: 3, gap: 2 }}>
          {themeOptions.map(({ key, icon }) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              style={{
                width: 28, height: 28, borderRadius: 9999, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: theme === key ? "rgba(255,255,255,0.15)" : "transparent",
                color: theme === key ? itemColor : mutedColor,
                transition: "all 0.15s",
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Language picker */}
      <div style={{ display: "flex", alignItems: "center", padding: "6px 14px", gap: 0 }}>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: itemColor }}>
          {isRu ? "Язык" : "Language"}
        </span>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.07)", borderRadius: 9999, padding: 3, gap: 2 }}>
          {(["en", "ru"] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                height: 28, padding: "0 10px", borderRadius: 9999, border: "none", cursor: "pointer",
                fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 11,
                background: lang === l ? "rgba(255,255,255,0.15)" : "transparent",
                color: lang === l ? itemColor : mutedColor,
                transition: "all 0.15s",
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {divider}

      <MenuItem label="Changelog" />
      <MenuItem label={isRu ? "Блог" : "Blog"} />
      <MenuItem label={isRu ? "Вакансии" : "Careers"} arrow />
      <MenuItem label={isRu ? "Поддержка" : "Support"} arrow />

      {divider}

      <MenuItem
        label={isRu ? "Выйти" : "Log out"}
        onClick={() => { logout(); navigate("/"); onClose(); }}
      />

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 14px 4px", flexWrap: "wrap" }}>
        {["Privacy", "Terms", "Copyright"].map(l => (
          <a key={l} href="#" style={{ fontSize: 11, color: mutedColor, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = itemColor)}
            onMouseLeave={e => (e.currentTarget.style.color = mutedColor)}>{l}</a>
        ))}
        <a href="https://t.me/" target="_blank" rel="noopener" style={{ marginLeft: "auto", color: mutedColor, display: "flex" }}
          onMouseEnter={e => (e.currentTarget.style.color = itemColor)}
          onMouseLeave={e => (e.currentTarget.style.color = mutedColor)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </a>
      </div>

      {showRequestGame && (
        <RequestGameModal onClose={() => setShowRequestGame(false)} />
      )}
    </div>
  );
}

/* ── Avatar button ───────────────────────────────── */
function ProfileButton() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#1a6b3c",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 15,
          flexShrink: 0, transition: "opacity 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        {user.initial}
      </button>
      {open && <ProfileMenu onClose={() => setOpen(false)} />}
    </>
  );
}

/* ── Navbar ──────────────────────────────────────── */
export default function Navbar() {
  const { lang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const tr = translations[lang].nav;
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = user
    ? [{ label: tr.pricing, href: "#pricing" }]
    : [
        { label: tr.pricing, href: "#pricing" },
        { label: tr.signIn, href: "/login" },
      ];

  return (
    <>
      {/* Desktop floating pill nav */}
      <nav
        className="hidden md:flex"
        style={{
          position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 50, alignItems: "center", gap: 24, height: 60, padding: "8px 20px",
          borderRadius: 9999, background: "var(--bg-glass-nav)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 0 0 1px var(--border-primary)",
          width: "min(580px, calc(100vw - 40px))",
        }}
      >
        <a href="/" style={{ flex: 1, textDecoration: "none" }}>
          <BoostLogo size={30} />
        </a>

        {navLinks.map(({ label, href }) => (
          <a key={label} href={href}
            className="text-body-bold text-primary"
            style={{ textDecoration: "none", whiteSpace: "nowrap", transition: "opacity 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.45")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            {label}
          </a>
        ))}

        <LangToggle />

        {/* Theme toggle (only when not logged in, since logged-in users use dropdown) */}
        {!user && (
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              width: 32, height: 32, borderRadius: 9999, border: "none", cursor: "pointer",
              background: "var(--bg-tertiary)", display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0, color: "var(--text-primary)",
            }}
          >
            {theme === "light" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              </svg>
            )}
          </button>
        )}

        <ProfileButton />
      </nav>

      {/* Mobile nav */}
      <div
        className="md:hidden"
        style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 50,
          background: "var(--bg-glass-nav)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-primary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", height: 56 }}>
          <a href="/" style={{ textDecoration: "none" }}><BoostLogo size={26} /></a>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LangToggle />
            <ProfileButton />
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ border: "none", background: "none", cursor: "pointer", padding: 4 }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--text-primary)" strokeWidth="2">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div style={{ padding: "8px 16px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} className="text-body-bold" style={{ padding: "8px 0", textDecoration: "none", color: "var(--text-primary)" }}>{label}</a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
