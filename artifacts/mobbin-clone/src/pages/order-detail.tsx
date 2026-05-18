import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useLang } from "../LangContext";
import { useAuth } from "../AuthContext";
import Navbar from "../components/Navbar";
import type { Order } from "./orders";

function loadOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem("boost_orders") || "[]"); } catch { return []; }
}

const GAME_COLORS: Record<string, { bg: string; text: string }> = {
  "CS2":      { bg: "rgba(255,171,0,0.12)",  text: "#ffab00" },
  "Dota 2":   { bg: "rgba(218,55,55,0.12)",  text: "#e05050" },
  "Valorant": { bg: "rgba(255,70,85,0.12)",  text: "#ff4655" },
};

function InfoBlock({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      background: "#1a1a1a",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12, padding: "14px 18px",
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(240,240,238,0.38)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: accent ? "#f0f0ee" : "#f0f0ee", letterSpacing: "-0.01em" }}>
        {value}
      </div>
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLang();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const isRu = lang === "ru";

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const all = loadOrders();
    const found = all.find(o => o.id === id) ?? null;
    setOrder(found);
  }, [id, user]);

  if (!user) return null;

  if (!order) {
    return (
      <div style={{ minHeight: "100dvh", background: "#111111", fontFamily: "var(--app-font-sans)" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100dvh - 60px)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#f0f0ee", marginBottom: 8 }}>
              {isRu ? "Заказ не найден" : "Order not found"}
            </div>
            <button onClick={() => navigate("/orders")} style={{
              marginTop: 8, height: 42, padding: "0 20px", borderRadius: 10,
              background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer",
              color: "#f0f0ee", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14,
            }}>
              {isRu ? "К заказам" : "Back to orders"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const col = GAME_COLORS[order.game];
  const createdDate = new Date(order.createdAt).toLocaleDateString(isRu ? "ru-RU" : "en-US", {
    day: "numeric", month: "long", year: "numeric",
  });
  const createdTime = new Date(order.createdAt).toLocaleTimeString(isRu ? "ru-RU" : "en-US", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div style={{ minHeight: "100dvh", background: "#111111", fontFamily: "var(--app-font-sans)" }}>
      <Navbar />

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>

        {/* Back */}
        <button
          onClick={() => navigate("/orders")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(240,240,238,0.45)", fontFamily: "var(--app-font-sans)",
            fontSize: 14, fontWeight: 500, padding: 0, marginBottom: 28,
            transition: "color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#f0f0ee")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,240,238,0.45)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {isRu ? "Все заказы" : "All orders"}
        </button>

        {/* Header card */}
        <div style={{
          background: "#171717",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, padding: "28px",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
            {/* Game badge */}
            <div style={{
              width: 56, height: 56, borderRadius: 14, flexShrink: 0,
              background: col.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, color: col.text,
              fontFamily: "var(--app-font-sans)", letterSpacing: "0.02em",
            }}>
              {order.game === "Valorant" ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M4 18L12 4l8 14H4z" fill={col.text} opacity="0.9"/>
                </svg>
              ) : (
                <span>{order.game === "CS2" ? "CS2" : "D2"}</span>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f0f0ee", letterSpacing: "-0.025em" }}>
                  {order.authorName}
                </h1>
                <span style={{
                  fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                  background: col.bg, color: col.text,
                }}>
                  {order.game}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(240,240,238,0.35)" }}>
                {createdDate} {isRu ? "в" : "at"} {createdTime}
              </div>
            </div>

            {/* Budget */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#f0f0ee", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                ${Number(order.budget).toFixed(2)}
              </div>
              <div style={{ fontSize: 12, color: "rgba(240,240,238,0.3)", marginTop: 2 }}>USD</div>
            </div>
          </div>

          {/* ELO progress */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 18px",
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "rgba(240,240,238,0.38)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {isRu ? "Текущий ранг" : "Current rank"}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(240,240,238,0.65)" }}>
                {order.currentElo}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={col.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
              <div style={{ width: 60, height: 3, borderRadius: 99, background: `linear-gradient(to right, rgba(240,240,238,0.2), ${col.text})` }} />
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "rgba(240,240,238,0.38)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {isRu ? "Желаемый ранг" : "Target rank"}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: col.text }}>
                {order.desiredElo}
              </div>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <InfoBlock label={isRu ? "Контакт" : "Contact"} value={order.contact} />
          <InfoBlock
            label={isRu ? "Время буста (МСК)" : "Boost time (MSK)"}
            value={`${order.timeFrom} — ${order.timeTo}`}
          />
        </div>

        {/* Description */}
        {order.description && (
          <div style={{
            background: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12, padding: "16px 18px",
            marginBottom: 10,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(240,240,238,0.38)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
              {isRu ? "Описание" : "Description"}
            </div>
            <div style={{ fontSize: 14, color: "rgba(240,240,238,0.75)", lineHeight: 1.65 }}>
              {order.description}
            </div>
          </div>
        )}

        {/* Contact action */}
        <div style={{
          marginTop: 20,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: "20px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#f0f0ee", marginBottom: 4 }}>
              {isRu ? "Взяться за заказ?" : "Want to take this order?"}
            </div>
            <div style={{ fontSize: 13, color: "rgba(240,240,238,0.4)" }}>
              {isRu ? `Свяжитесь с ${order.authorName} напрямую` : `Contact ${order.authorName} directly`}
            </div>
          </div>
          <button
            onClick={() => {
              const contact = order.contact;
              if (contact.startsWith("http") || contact.includes("t.me") || contact.includes("discord")) {
                window.open(contact.startsWith("http") ? contact : `https://${contact}`, "_blank");
              }
            }}
            style={{
              height: 44, padding: "0 22px", borderRadius: 12,
              background: "#f0f0ee", border: "none", cursor: "pointer",
              color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 14,
              transition: "opacity 0.15s", flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            {isRu ? "Связаться" : "Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}
