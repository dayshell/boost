import { useState } from "react";
import { useLang } from "@/LangContext";
import { useLocation } from "wouter";

const CDN = "https://bytescale.mobbin.com/FW25bBB/image/mobbin.com/prod";
const FLOW_CDN = `${CDN}/trending_filter_tags/mobile_images`;
const PAT_CDN = `${CDN}/static/dictionary/patterns`;

type FlowCard = {
  id: string;
  title: string;
  titleRu: string;
  count: number;
  bg: string;
  back: string;
  front: string;
  tag: string;
};

const FLOWS: FlowCard[] = [
  {
    id: "signup",
    title: "Sign Up",
    titleRu: "Регистрация",
    count: 8,
    bg: `${FLOW_CDN}/flows-4dcde8ff-4c4d-465f-a8a5-2a39ae75a89e.png`,
    back: `${PAT_CDN}/signup_02.png?f=webp&w=400`,
    front: `${PAT_CDN}/signup_01.png?f=webp&w=400`,
    tag: "signup",
  },
  {
    id: "login",
    title: "Login",
    titleRu: "Вход",
    count: 6,
    bg: `${FLOW_CDN}/flows-54d72e91-2073-4ce4-852d-478f4413fdbe.png`,
    back: `${PAT_CDN}/login_02.png?f=webp&w=400`,
    front: `${PAT_CDN}/login_01.png?f=webp&w=400`,
    tag: "login",
  },
  {
    id: "home",
    title: "Home",
    titleRu: "Главная",
    count: 12,
    bg: `${FLOW_CDN}/flows-d62d1419-e02a-4b34-ad56-de9595cee77b.png`,
    back: `${PAT_CDN}/home_02.png?f=webp&w=400`,
    front: `${PAT_CDN}/home_01.png?f=webp&w=400`,
    tag: "home",
  },
  {
    id: "checkout",
    title: "Checkout",
    titleRu: "Оплата",
    count: 9,
    bg: `${FLOW_CDN}/flows-4dcde8ff-4c4d-465f-a8a5-2a39ae75a89e.png`,
    back: `${PAT_CDN}/checkout_02.png?f=webp&w=400`,
    front: `${PAT_CDN}/checkout_01.png?f=webp&w=400`,
    tag: "checkout",
  },
  {
    id: "filtering",
    title: "Filtering & Sorting",
    titleRu: "Фильтры и сортировка",
    count: 7,
    bg: `${FLOW_CDN}/flows-54d72e91-2073-4ce4-852d-478f4413fdbe.png`,
    back: `${PAT_CDN}/signup_02.png?f=webp&w=400`,
    front: `${PAT_CDN}/signup_01.png?f=webp&w=400`,
    tag: "filtering",
  },
  {
    id: "profile",
    title: "Editing Profile",
    titleRu: "Редактирование профиля",
    count: 5,
    bg: `${FLOW_CDN}/flows-d62d1419-e02a-4b34-ad56-de9595cee77b.png`,
    back: `${PAT_CDN}/login_02.png?f=webp&w=400`,
    front: `${PAT_CDN}/login_01.png?f=webp&w=400`,
    tag: "profile",
  },
  {
    id: "onboarding",
    title: "Onboarding",
    titleRu: "Онбординг",
    count: 11,
    bg: `${FLOW_CDN}/flows-4dcde8ff-4c4d-465f-a8a5-2a39ae75a89e.png`,
    back: `${PAT_CDN}/home_02.png?f=webp&w=400`,
    front: `${PAT_CDN}/home_01.png?f=webp&w=400`,
    tag: "onboarding",
  },
  {
    id: "logging-in",
    title: "Logging In",
    titleRu: "Авторизация",
    count: 4,
    bg: `${FLOW_CDN}/flows-54d72e91-2073-4ce4-852d-478f4413fdbe.png`,
    back: `${PAT_CDN}/checkout_02.png?f=webp&w=400`,
    front: `${PAT_CDN}/checkout_01.png?f=webp&w=400`,
    tag: "logging-in",
  },
  {
    id: "settings",
    title: "Settings",
    titleRu: "Настройки",
    count: 6,
    bg: `${FLOW_CDN}/flows-d62d1419-e02a-4b34-ad56-de9595cee77b.png`,
    back: `${PAT_CDN}/signup_02.png?f=webp&w=400`,
    front: `${PAT_CDN}/signup_01.png?f=webp&w=400`,
    tag: "settings",
  },
];

const ALL_TAGS = ["signup", "login", "home", "checkout", "filtering", "profile", "onboarding", "logging-in", "settings"];

const TAG_LABELS: Record<string, { en: string; ru: string }> = {
  signup: { en: "Sign Up", ru: "Регистрация" },
  login: { en: "Login", ru: "Вход" },
  home: { en: "Home", ru: "Главная" },
  checkout: { en: "Checkout", ru: "Оплата" },
  filtering: { en: "Filtering & Sorting", ru: "Фильтры" },
  profile: { en: "Editing Profile", ru: "Профиль" },
  onboarding: { en: "Onboarding", ru: "Онбординг" },
  "logging-in": { en: "Logging In", ru: "Авторизация" },
  settings: { en: "Settings", ru: "Настройки" },
};

function FlowCard({ card, isRu }: { card: FlowCard; isRu: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: "var(--card-bg)",
        height: 290,
        cursor: "pointer",
        transition: "box-shadow 0.2s ease",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.18)" : "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      {/* Background flow wireframe */}
      <img
        src={card.bg}
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "right center",
          filter: "invert(1)",
          opacity: 0.13,
          pointerEvents: "none",
        }}
      />

      {/* Title */}
      <div style={{ position: "absolute", top: 18, left: 18, zIndex: 2 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          {isRu ? card.titleRu : card.title}
        </p>
        <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>
          {card.count} {isRu ? "экранов" : "screens"}
        </p>
      </div>

      {/* Back floating screenshot */}
      <img
        src={card.back}
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          right: "35%",
          bottom: hovered ? "calc(-22% + 16px)" : "-22%",
          width: "33%",
          borderRadius: 10,
          boxShadow: hovered
            ? "0px 8px 24px rgba(0,0,0,0.18)"
            : "0px 4px 12px rgba(0,0,0,0.08)",
          transition: "bottom 0.25s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.25s ease",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      {/* Front floating screenshot */}
      <img
        src={card.front}
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          right: "10%",
          bottom: hovered ? "calc(-13% + 16px)" : "-13%",
          width: "33%",
          maxWidth: "none",
          borderRadius: 10,
          boxShadow: hovered
            ? "0px 8px 24px rgba(0,0,0,0.18)"
            : "0px 4px 12px rgba(0,0,0,0.08)",
          transition: "bottom 0.25s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.25s ease",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />
    </div>
  );
}

export default function FlowsPage() {
  const { lang } = useLang();
  const isRu = lang === "ru";
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"screens" | "flows">("flows");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const filtered = FLOWS.filter(f => {
    const matchesTag = selectedTags.size === 0 || selectedTags.has(f.tag);
    const q = search.toLowerCase();
    const matchesSearch = q === "" || f.title.toLowerCase().includes(q) || f.titleRu.toLowerCase().includes(q);
    return matchesTag && matchesSearch;
  });

  return (
    <div style={{
      display: "flex",
      height: "100dvh",
      background: "var(--bg-primary)",
      fontFamily: "var(--app-font-sans)",
      overflow: "hidden",
    }}>
      <style>{`
        :root { --card-bg: var(--bg-secondary); }
        .dark :root, .dark { --card-bg: #1c1c1e; }
        .flows-sidebar-tag:hover { background: var(--bg-tertiary) !important; }
        .flows-tab:hover { color: var(--text-primary) !important; }
      `}</style>

      {/* ── Left Sidebar ─────────────────────────────────────── */}
      <aside style={{
        width: 260,
        flexShrink: 0,
        borderRight: "1px solid var(--border-primary)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        padding: "0 0 24px",
      }}>
        {/* Back button */}
        <div style={{ padding: "14px 16px 10px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 13, color: "var(--text-secondary)",
              background: "none", border: "none", cursor: "pointer",
              padding: "4px 0",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 16L6 10L12 4" />
            </svg>
            {isRu ? "Назад" : "Back"}
          </button>
        </div>

        {/* App info */}
        <div style={{ padding: "8px 16px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, overflow: "hidden", flexShrink: 0,
            background: "#131415", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>B</span>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Boost</p>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 1 }}>
              {isRu ? "Игровой буст" : "Game boosting"}
            </p>
          </div>
        </div>

        {/* Screens / Flows tabs */}
        <div style={{
          display: "flex",
          margin: "0 12px 16px",
          background: "var(--bg-tertiary)",
          borderRadius: 8,
          padding: 3,
          gap: 2,
        }}>
          {(["screens", "flows"] as const).map(tab => (
            <button
              key={tab}
              className="flows-tab"
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                height: 28,
                fontSize: 12,
                fontWeight: 500,
                color: activeTab === tab ? "var(--text-primary)" : "var(--text-tertiary)",
                background: activeTab === tab ? "var(--bg-primary)" : "transparent",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
                boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.10)" : "none",
              }}
            >
              {tab === "screens" ? (isRu ? "Экраны" : "Screens") : (isRu ? "Флоу" : "Flows")}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--border-primary)", margin: "0 16px 16px" }} />

        {/* Tags */}
        <div style={{ padding: "0 12px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 4px 8px" }}>
            {isRu ? "Теги" : "Tags"}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {ALL_TAGS.map(tag => {
              const active = selectedTags.has(tag);
              return (
                <button
                  key={tag}
                  className="flows-sidebar-tag"
                  onClick={() => toggleTag(tag)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "6px 8px", borderRadius: 7,
                    background: active ? "var(--bg-tertiary)" : "transparent",
                    border: "none", cursor: "pointer",
                    transition: "background 0.12s",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 13, color: active ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: active ? 600 : 400 }}>
                    {isRu ? TAG_LABELS[tag].ru : TAG_LABELS[tag].en}
                  </span>
                  {active && (
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "var(--text-primary)", flexShrink: 0,
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 20px",
          borderBottom: "1px solid var(--border-primary)",
          flexShrink: 0,
          background: "var(--bg-primary)",
        }}>
          {/* Search */}
          <div style={{
            flex: 1, maxWidth: 340,
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--bg-secondary)",
            borderRadius: 8, padding: "0 12px", height: 34,
          }}>
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-tertiary)", flexShrink: 0 }}>
              <circle cx="9" cy="9" r="6" /><path d="M14 14l4 4" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isRu ? "Поиск флоу..." : "Search flows..."}
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                fontSize: 13, color: "var(--text-primary)",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", padding: 0, lineHeight: 1 }}>
                ✕
              </button>
            )}
          </div>

          {/* Count */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {isRu ? "Флоу" : "Flows"}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)",
              background: "var(--bg-tertiary)", borderRadius: 5, padding: "2px 6px",
            }}>
              {filtered.length}
            </span>
          </div>

          {/* Sort */}
          <button style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 12, color: "var(--text-secondary)",
            background: "var(--bg-secondary)", border: "none", borderRadius: 7,
            padding: "6px 10px", cursor: "pointer",
          }}>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5h14M6 10h8M9 15h2" />
            </svg>
            {isRu ? "Сортировка" : "Sort"}
          </button>
        </div>

        {/* Tag pills */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "10px 20px",
          borderBottom: "1px solid var(--border-primary)",
          overflowX: "auto", flexShrink: 0,
          scrollbarWidth: "none",
        }}>
          <button
            onClick={() => setSelectedTags(new Set())}
            style={{
              flexShrink: 0, height: 28, padding: "0 12px", borderRadius: 999,
              fontSize: 12, fontWeight: 500, cursor: "pointer",
              background: selectedTags.size === 0 ? "var(--bg-inverse)" : "var(--bg-secondary)",
              color: selectedTags.size === 0 ? "var(--text-inverse)" : "var(--text-secondary)",
              border: "none", transition: "background 0.15s, color 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {isRu ? "Все" : "All"}
          </button>
          {ALL_TAGS.map(tag => {
            const active = selectedTags.has(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  flexShrink: 0, height: 28, padding: "0 12px", borderRadius: 999,
                  fontSize: 12, fontWeight: 500, cursor: "pointer",
                  background: active ? "var(--bg-inverse)" : "var(--bg-secondary)",
                  color: active ? "var(--text-inverse)" : "var(--text-secondary)",
                  border: "none", transition: "background 0.15s, color 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {isRu ? TAG_LABELS[tag].ru : TAG_LABELS[tag].en}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "20px",
        }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-tertiary)", fontSize: 14 }}>
              {isRu ? "Ничего не найдено" : "No flows found"}
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 12,
            }}>
              {filtered.map(card => (
                <FlowCard key={card.id} card={card} isRu={isRu} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
