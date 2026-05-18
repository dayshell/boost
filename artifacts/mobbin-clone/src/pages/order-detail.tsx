import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useLang } from "../LangContext";
import { useAuth } from "../AuthContext";
import Navbar from "../components/Navbar";
import type { Boost } from "./orders";

function loadBoosts(): Boost[] {
  try {
    const raw = localStorage.getItem("boost_boosts");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

const GAME_COLORS: Record<string, { bg: string; text: string }> = {
  "CS2":      { bg: "rgba(255,171,0,0.12)",  text: "#ffab00" },
  "Dota 2":   { bg: "rgba(218,55,55,0.12)",  text: "#e05050" },
  "Valorant": { bg: "rgba(255,70,85,0.12)",  text: "#ff4655" },
};

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: "#1a1a1a",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12, padding: "14px 18px",
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(240,240,238,0.38)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#f0f0ee" }}>
        {value}
      </div>
    </div>
  );
}

export default function BoostDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLang();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const isRu = lang === "ru";
  const [boost, setBoost] = useState<Boost | null>(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const found = loadBoosts().find(b => b.id === id) ?? null;
    setBoost(found);
  }, [id, user]);

  if (!user) return null;

  if (!boost) {
    return (
      <div style={{ minHeight: "100dvh", background: "#111111", fontFamily: "var(--app-font-sans)" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100dvh - 60px)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#f0f0ee", marginBottom: 8 }}>
              {isRu ? "Заявка не найдена" : "Request not found"}
            </div>
            <button onClick={() => navigate("/boosts")} style={{
              marginTop: 8, height: 42, padding: "0 20px", borderRadius: 10,
              background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer",
              color: "#f0f0ee", fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14,
            }}>
              {isRu ? "К заявкам" : "Back to requests"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const col = GAME_COLORS[boost.game];
  const createdDate = new Date(boost.createdAt).toLocaleDateString(isRu ? "ru-RU" : "en-US", {
    day: "numeric", month: "long", year: "numeric",
  });
  const createdTime = new Date(boost.createdAt).toLocaleTimeString(isRu ? "ru-RU" : "en-US", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div style={{ minHeight: "100dvh", background: "#111111", fontFamily: "var(--app-font-sans)" }}>
      <Navbar />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>

        {/* Back */}
        <button
          onClick={() => navigate("/boosts")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(240,240,238,0.4)", fontFamily: "var(--app-font-sans)",
            fontSize: 14, fontWeight: 500, padding: 0, marginBottom: 28,
            transition: "color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#f0f0ee")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,240,238,0.4)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {isRu ? "Все заявки" : "All requests"}
        </button>

        {/* Header card */}
        <div style={{
          background: "#171717", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, padding: "28px", marginBottom: 12,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 22 }}>
            {/* Game icon */}
            <div style={{
              width: 56, height: 56, borderRadius: 14, flexShrink: 0,
              background: col.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {boost.game === "Valorant" ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M4 18L12 4l8 14H4z" fill={col.text} opacity="0.9"/>
                </svg>
              ) : (
                <span style={{ fontSize: 13, fontWeight: 800, color: col.text, fontFamily: "var(--app-font-sans)", letterSpacing: "-0.02em" }}>
                  {boost.game === "CS2" ? "CS2" : "D2"}
                </span>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, flexWrap: "wrap" }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f0f0ee", letterSpacing: "-0.025em" }}>
                  {boost.authorName}
                </h1>
                <span style={{
                  fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                  background: col.bg, color: col.text,
                }}>
                  {boost.game}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(240,240,238,0.3)" }}>
                {createdDate} {isRu ? "в" : "at"} {createdTime}
              </div>
            </div>

            {/* Budget */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#f0f0ee", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                ${Number(boost.budget).toFixed(2)}
              </div>
              <div style={{ fontSize: 12, color: "rgba(240,240,238,0.28)", marginTop: 2 }}>USD</div>
            </div>
          </div>

          {/* ELO progress bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "16px 20px",
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "rgba(240,240,238,0.35)", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {isRu ? "Текущий ранг" : "Current rank"}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(240,240,238,0.6)" }}>
                {boost.currentElo}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={col.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
              <div style={{ width: 56, height: 3, borderRadius: 99, background: `linear-gradient(to right, rgba(240,240,238,0.15), ${col.text})` }} />
            </div>

            <div style={{ flex: 1, textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "rgba(240,240,238,0.35)", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {isRu ? "Желаемый ранг" : "Target rank"}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: col.text }}>
                {boost.desiredElo}
              </div>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <InfoBlock label={isRu ? "Контакт" : "Contact"} value={boost.contact} />
          <InfoBlock
            label={isRu ? "Время буста (МСК)" : "Boost time (MSK)"}
            value={`${boost.timeFrom} — ${boost.timeTo}`}
          />
        </div>

        {/* Description */}
        {boost.description && (
          <div style={{
            background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12, padding: "16px 18px", marginBottom: 10,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(240,240,238,0.35)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
              {isRu ? "Описание" : "Description"}
            </div>
            <div style={{ fontSize: 14, color: "rgba(240,240,238,0.7)", lineHeight: 1.65 }}>
              {boost.description}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{
          marginTop: 20, background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: "20px 22px",
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#f0f0ee", marginBottom: 4 }}>
              {isRu ? "Готовы взяться за буст?" : "Ready to take this boost?"}
            </div>
            <div style={{ fontSize: 13, color: "rgba(240,240,238,0.38)" }}>
              {isRu ? `Свяжитесь с ${boost.authorName}` : `Contact ${boost.authorName} directly`}
            </div>
          </div>
          <button
            onClick={() => {
              const c = boost.contact;
              const url = c.startsWith("http") ? c : c.includes("t.me") ? `https://${c}` : undefined;
              if (url) window.open(url, "_blank");
            }}
            style={{
              height: 44, padding: "0 24px", borderRadius: 12,
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
