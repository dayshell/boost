import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useLang } from "../LangContext";
import { useLocation } from "wouter";

type Section = "account" | "preferences" | "billing";

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

/* ── Deposit row ─────────────────────────────────── */
type DepositMethod = "card-visa" | "card-mc" | "btc" | "eth" | "usdt" | "sol";

interface Deposit {
  id: string;
  method: DepositMethod;
  label: string;
  sublabel: string;
  amount: number;
  currency: string;
  date: string;
  status: "completed" | "pending";
}

const DEPOSITS: Deposit[] = [
  { id: "1", method: "btc",      label: "Bitcoin",         sublabel: "0.00072 BTC",     amount: 47.20,  currency: "USD", date: "18 мая 2026",    status: "completed" },
  { id: "2", method: "card-visa",label: "Visa",            sublabel: "**** **** **** 4242", amount: 99.99,  currency: "USD", date: "14 мая 2026",    status: "completed" },
  { id: "3", method: "eth",      label: "Ethereum",        sublabel: "0.0143 ETH",      amount: 35.50,  currency: "USD", date: "8 мая 2026",     status: "completed" },
  { id: "4", method: "usdt",     label: "USDT TRC-20",     sublabel: "75 USDT",         amount: 75.00,  currency: "USD", date: "1 мая 2026",     status: "completed" },
  { id: "5", method: "card-mc", label: "Mastercard",      sublabel: "**** **** **** 5555", amount: 49.99,  currency: "USD", date: "22 апр. 2026",   status: "completed" },
  { id: "6", method: "sol",      label: "Solana",          sublabel: "0.41 SOL",        amount: 28.00,  currency: "USD", date: "15 апр. 2026",   status: "completed" },
];

const METHOD_ICONS: Record<DepositMethod, React.ReactNode> = {
  "card-visa": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#1a3a8a"/>
      <text x="12" y="15.5" textAnchor="middle" fill="white" fontSize="7" fontWeight="800" fontFamily="Arial">VISA</text>
    </svg>
  ),
  "card-mc": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#252525"/>
      <circle cx="9" cy="12" r="5" fill="#eb001b"/>
      <circle cx="15" cy="12" r="5" fill="#f79e1b"/>
      <path d="M12 7.8a5 5 0 0 1 0 8.4A5 5 0 0 1 12 7.8z" fill="#ff5f00"/>
    </svg>
  ),
  btc: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#f7931a"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Arial">₿</text>
    </svg>
  ),
  eth: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#627eea"/>
      <path d="M12 4.5L6.5 12.2l5.5 3.2 5.5-3.2L12 4.5z" fill="white" opacity="0.8"/>
      <path d="M12 17.1L6.5 13.4l5.5 6.1 5.5-6.1L12 17.1z" fill="white"/>
    </svg>
  ),
  usdt: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#26a17b"/>
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="Arial">₮</text>
    </svg>
  ),
  sol: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#9945ff"/>
      <path d="M7 15.5h8.5l1.5-1.5H8.5L7 15.5zm0-3.5h8.5l1.5-1.5H8.5L7 12zm1.5-5L7 8.5h8.5L17 7H8.5z" fill="white"/>
    </svg>
  ),
};

function DepositRow({ deposit, isRu }: { deposit: Deposit; isRu: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "16px 20px",
      borderRadius: 12,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      transition: "background 0.15s, border-color 0.15s",
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)";
      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)";
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
    }}
    >
      {/* Method icon with glow background */}
      <div style={{
        flexShrink: 0,
        width: 40, height: 40,
        borderRadius: 10,
        background: "rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {METHOD_ICONS[deposit.method]}
      </div>

      {/* Label */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#f0f0ee", marginBottom: 3 }}>
          {deposit.label}
        </div>
        <div style={{ fontSize: 12, color: "rgba(240,240,238,0.35)", fontVariantNumeric: "tabular-nums" }}>
          {deposit.sublabel}
        </div>
      </div>

      {/* Date */}
      <div style={{ fontSize: 12, color: "rgba(240,240,238,0.3)", flexShrink: 0, textAlign: "right" }}>
        {deposit.date}
      </div>

      {/* Status badge */}
      <div style={{
        flexShrink: 0,
        display: "flex", alignItems: "center", gap: 5,
        background: "rgba(74,222,128,0.08)",
        border: "1px solid rgba(74,222,128,0.18)",
        borderRadius: 20,
        padding: "3px 10px",
      }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: "#4ade80", letterSpacing: "0.02em" }}>
          {isRu ? "Зачислено" : "Completed"}
        </span>
      </div>

      {/* Amount */}
      <div style={{ flexShrink: 0, textAlign: "right", minWidth: 80 }}>
        <div style={{
          fontSize: 15, fontWeight: 700, color: "#f0f0ee",
          fontVariantNumeric: "tabular-nums",
        }}>
          +${deposit.amount.toFixed(2)}
        </div>
        <div style={{ fontSize: 11, color: "rgba(240,240,238,0.3)", marginTop: 2 }}>
          USD
        </div>
      </div>
    </div>
  );
}

const USD_TO_RUB = 90;

export default function Settings() {
  const { user, logout } = useAuth();
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const [section, setSection] = useState<Section>("account");
  const isRu = lang === "ru";
  const [balance, setBalance] = useState<number>(() => {
    try { return parseFloat(localStorage.getItem("boost_balance") ?? "0") || 0; } catch { return 0; }
  });
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const totalDeposited = DEPOSITS.reduce((s, d) => s + d.amount, 0);

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
      <main style={{ flex: 1, padding: "48px 64px", maxWidth: 720 }}>

        {/* ACCOUNT */}
        {section === "account" && (
          <>
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

            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ee", margin: "0 0 4px" }}>
                {isRu ? "Личные данные" : "Personal details"}
              </h2>
              <SettingRow label={isRu ? "Имя" : "Name"} value={user.name} action actionLabel={isRu ? "Изменить" : "Edit"} />
              <SettingRow label={isRu ? "Email адрес" : "Email address"} value={user.email} action actionLabel={isRu ? "Изменить" : "Edit"} />

              {/* Balance row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#f0f0ee", marginBottom: 4 }}>{isRu ? "Баланс" : "Balance"}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#f0f0ee", fontVariantNumeric: "tabular-nums" }}>
                    {isRu ? `₽${Math.round(balance * USD_TO_RUB).toLocaleString("ru-RU")}` : `$${balance.toFixed(2)}`}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <button
                    onClick={() => setShowTopUp(v => !v)}
                    style={{ height: 36, padding: "0 16px", borderRadius: 9, border: "none", cursor: "pointer", background: "#f0f0ee", color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 13 }}
                  >
                    {isRu ? "Пополнить" : "Top up"}
                  </button>
                  {showTopUp && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <input
                        type="number" min="1" placeholder={isRu ? "Сумма $" : "Amount $"}
                        value={topUpAmount}
                        onChange={e => setTopUpAmount(e.target.value)}
                        style={{ width: 100, height: 34, padding: "0 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "#f0f0ee", fontFamily: "var(--app-font-sans)", fontSize: 13, outline: "none" }}
                      />
                      <button
                        onClick={() => {
                          const amt = parseFloat(topUpAmount);
                          if (!amt || amt <= 0) return;
                          const nb = balance + amt;
                          setBalance(nb);
                          localStorage.setItem("boost_balance", String(nb));
                          setTopUpAmount("");
                          setShowTopUp(false);
                        }}
                        style={{ height: 34, padding: "0 14px", borderRadius: 8, border: "none", cursor: "pointer", background: "#4ade80", color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 13 }}
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <SettingRow label={isRu ? "Пароль" : "Password"} value={isRu ? "Пароль не задан" : "No password yet"} action actionLabel={isRu ? "Создать" : "Create new"} />
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ee", margin: "0 0 4px" }}>
                {isRu ? "Управление аккаунтом" : "Manage account"}
              </h2>
              <SettingRow
                label={isRu ? "Удалить аккаунт" : "Delete account"}
                value={isRu ? "Навсегда удалить ваш аккаунт Boost." : "Permanently delete your Boost account."}
                action actionLabel={isRu ? "Удалить" : "Delete"}
                actionColor="#e5533a"
                onAction={() => { logout(); navigate("/"); }}
              />
            </section>
          </>
        )}

        {/* PREFERENCES */}
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

        {/* BILLING */}
        {section === "billing" && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0f0ee", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                {isRu ? "Тариф и оплата" : "Plan & Billing"}
              </h2>
              <p style={{ fontSize: 14, color: "rgba(240,240,238,0.4)", margin: 0 }}>
                {isRu ? "История пополнений вашего баланса." : "Your deposit history."}
              </p>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
              {[
                {
                  label: isRu ? "Всего пополнено" : "Total deposited",
                  value: `$${totalDeposited.toFixed(2)}`,
                  sub: `${DEPOSITS.length} ${isRu ? "транзакций" : "transactions"}`,
                  accent: "#f0f0ee",
                },
                {
                  label: isRu ? "Последнее пополнение" : "Last deposit",
                  value: `$${DEPOSITS[0].amount.toFixed(2)}`,
                  sub: DEPOSITS[0].date,
                  accent: "#f0f0ee",
                },
                {
                  label: isRu ? "Средний депозит" : "Average deposit",
                  value: `$${(totalDeposited / DEPOSITS.length).toFixed(2)}`,
                  sub: isRu ? "на транзакцию" : "per transaction",
                  accent: "#f0f0ee",
                },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, padding: "18px 20px",
                }}>
                  <div style={{ fontSize: 12, color: "rgba(240,240,238,0.38)", marginBottom: 10, fontWeight: 500 }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: stat.accent, letterSpacing: "-0.02em", marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(240,240,238,0.28)" }}>
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Section label */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 12,
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,240,238,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {isRu ? "История" : "History"}
              </span>
              <span style={{
                fontSize: 12, color: "rgba(240,240,238,0.3)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20, padding: "3px 10px",
              }}>
                {DEPOSITS.length} {isRu ? "записей" : "entries"}
              </span>
            </div>

            {/* Deposit list — individual cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DEPOSITS.map(d => <DepositRow key={d.id} deposit={d} isRu={isRu} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
