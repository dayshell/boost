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

/* ── Become Booster Modal ────────────────────────── */
function BecomeBoosterModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const isRu = lang === "ru";
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "", telegram: "", games: [] as string[], experience: "", ranks: "", rate: "", about: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const GAMES = ["CS2", "Dota 2", "Valorant"];
  const GAME_COLORS: Record<string, string> = { "CS2": "#ffab00", "Dota 2": "#e05050", "Valorant": "#ff4655" };

  const steps = isRu
    ? ["О вас", "Опыт", "Условия"]
    : ["About you", "Experience", "Terms"];

  function toggleGame(g: string) {
    setForm(p => ({
      ...p,
      games: p.games.includes(g) ? p.games.filter(x => x !== g) : [...p.games, g],
    }));
  }

  function validateStep() {
    const err: Record<string, boolean> = {};
    if (step === 0) {
      if (!form.name.trim()) err.name = true;
      if (!form.telegram.trim()) err.telegram = true;
      if (form.games.length === 0) err.games = true;
    } else if (step === 1) {
      if (!form.experience.trim()) err.experience = true;
      if (!form.ranks.trim()) err.ranks = true;
    } else if (step === 2) {
      if (!form.rate.trim()) err.rate = true;
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    if (step < 2) setStep(s => s + 1);
    else setSent(true);
  }

  const inp: React.CSSProperties = {
    width: "100%", height: 44, padding: "0 14px", borderRadius: 10,
    border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
    color: "#f0f0ee", fontFamily: "var(--app-font-sans)", fontSize: 14,
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
  };
  const lbl: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.45)",
    letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7, display: "block",
  };
  const errInp: React.CSSProperties = { ...inp, borderColor: "#e05050" };

  const modal = (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.78)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        padding: 20,
      }}
    >
      <div style={{
        width: "100%", maxWidth: 460,
        background: "linear-gradient(145deg, #1a1a1a 0%, #161616 100%)",
        borderRadius: 24, boxShadow: "0 40px 120px rgba(0,0,0,0.75)",
        border: "1px solid rgba(255,255,255,0.09)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Top accent stripe */}
        <div style={{ height: 3, background: "linear-gradient(90deg, #f0f0ee 0%, rgba(240,240,238,0.3) 100%)" }} />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            width: 30, height: 30, borderRadius: "50%",
            border: "none", background: "rgba(255,255,255,0.08)",
            color: "rgba(240,240,238,0.6)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s", zIndex: 2,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {sent ? (
          <div style={{ padding: "48px 32px 44px", textAlign: "center" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(74,222,128,0.12)", border: "2px solid rgba(74,222,128,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", fontSize: 32,
            }}>⚡</div>
            <h2 style={{ color: "#f0f0ee", fontFamily: "var(--app-font-sans)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", margin: "0 0 10px" }}>
              {isRu ? "Заявка отправлена!" : "Application sent!"}
            </h2>
            <p style={{ color: "rgba(240,240,238,0.5)", fontSize: 14, lineHeight: 1.6, margin: "0 0 28px" }}>
              {isRu ? "Мы рассмотрим вашу заявку и свяжемся с вами в течение 24 часов." : "We'll review your application and reach out within 24 hours."}
            </p>
            <button onClick={onClose} style={{
              width: "100%", height: 48, borderRadius: 12,
              background: "#f0f0ee", border: "none", cursor: "pointer",
              color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 15,
            }}>
              {isRu ? "Закрыть" : "Close"}
            </button>
          </div>
        ) : (
          <div style={{ padding: "28px 28px 24px" }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>⚡</div>
                <div>
                  <h2 style={{ margin: 0, color: "#f0f0ee", fontFamily: "var(--app-font-sans)", fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em" }}>
                    {isRu ? "Стать бустером" : "Become a Booster"}
                  </h2>
                  <p style={{ margin: 0, color: "rgba(240,240,238,0.4)", fontSize: 12 }}>
                    {isRu ? "Зарабатывай на своём мастерстве" : "Earn from your skills"}
                  </p>
                </div>
              </div>

              {/* Step indicators */}
              <div style={{ display: "flex", gap: 4, marginTop: 16 }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ flex: 1 }}>
                    <div style={{
                      height: 3, borderRadius: 9999,
                      background: i <= step ? "#f0f0ee" : "rgba(255,255,255,0.12)",
                      transition: "background 0.3s",
                    }} />
                    <div style={{ fontSize: 10, color: i === step ? "#f0f0ee" : "rgba(240,240,238,0.3)", marginTop: 5, fontFamily: "var(--app-font-sans)", fontWeight: i === step ? 700 : 400, transition: "color 0.3s" }}>
                      {s}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 0: About you */}
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ ...lbl, color: errors.name ? "#e05050" : "rgba(240,240,238,0.45)" }}>
                    {isRu ? "Имя / Никнейм" : "Name / Nickname"}
                  </label>
                  <input value={form.name} onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: false })); }}
                    placeholder={isRu ? "Ваш игровой ник" : "Your in-game nickname"} autoFocus
                    style={errors.name ? errInp : inp}
                    onFocus={e => !errors.name && (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                    onBlur={e => !errors.name && (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
                <div>
                  <label style={{ ...lbl, color: errors.telegram ? "#e05050" : "rgba(240,240,238,0.45)" }}>
                    Telegram
                  </label>
                  <input value={form.telegram} onChange={e => { setForm(p => ({ ...p, telegram: e.target.value })); setErrors(p => ({ ...p, telegram: false })); }}
                    placeholder="@username"
                    style={errors.telegram ? errInp : inp}
                    onFocus={e => !errors.telegram && (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                    onBlur={e => !errors.telegram && (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
                <div>
                  <label style={{ ...lbl, color: errors.games ? "#e05050" : "rgba(240,240,238,0.45)" }}>
                    {isRu ? "Игры" : "Games"} {errors.games && <span style={{ color: "#e05050", textTransform: "none", letterSpacing: 0 }}>— {isRu ? "выберите хотя бы одну" : "select at least one"}</span>}
                  </label>
                  <div style={{ display: "flex", gap: 7 }}>
                    {GAMES.map(g => {
                      const active = form.games.includes(g);
                      const color = GAME_COLORS[g];
                      return (
                        <button key={g} onClick={() => { toggleGame(g); setErrors(p => ({ ...p, games: false })); }}
                          style={{
                            flex: 1, height: 38, borderRadius: 9, border: "none", cursor: "pointer",
                            background: active ? `${color}22` : "rgba(255,255,255,0.05)",
                            color: active ? color : "rgba(240,240,238,0.45)",
                            fontFamily: "var(--app-font-sans)", fontWeight: active ? 700 : 400, fontSize: 12,
                            outline: active ? `1.5px solid ${color}55` : "none",
                            transition: "all 0.12s",
                          }}>
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Experience */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ ...lbl, color: errors.experience ? "#e05050" : "rgba(240,240,238,0.45)" }}>
                    {isRu ? "Опыт буста (лет)" : "Boosting experience (years)"}
                  </label>
                  <input value={form.experience} onChange={e => { setForm(p => ({ ...p, experience: e.target.value })); setErrors(p => ({ ...p, experience: false })); }}
                    placeholder={isRu ? "Например: 2 года" : "e.g. 2 years"} autoFocus
                    style={errors.experience ? errInp : inp}
                    onFocus={e => !errors.experience && (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                    onBlur={e => !errors.experience && (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
                <div>
                  <label style={{ ...lbl, color: errors.ranks ? "#e05050" : "rgba(240,240,238,0.45)" }}>
                    {isRu ? "Максимальный ранг" : "Highest rank achieved"}
                  </label>
                  <input value={form.ranks} onChange={e => { setForm(p => ({ ...p, ranks: e.target.value })); setErrors(p => ({ ...p, ranks: false })); }}
                    placeholder={isRu ? "Например: Global Elite, Immortal" : "e.g. Global Elite, Radiant"}
                    style={errors.ranks ? errInp : inp}
                    onFocus={e => !errors.ranks && (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                    onBlur={e => !errors.ranks && (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
                <div>
                  <label style={lbl}>{isRu ? "О себе (необязательно)" : "About yourself (optional)"}</label>
                  <textarea value={form.about} onChange={e => setForm(p => ({ ...p, about: e.target.value }))}
                    placeholder={isRu ? "Расскажите о своём опыте, подходе..." : "Tell us about your experience, approach..."}
                    rows={3}
                    style={{ ...inp, height: "auto", padding: "10px 14px", resize: "none", lineHeight: 1.55 }}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Terms */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ ...lbl, color: errors.rate ? "#e05050" : "rgba(240,240,238,0.45)" }}>
                    {isRu ? "Желаемая ставка ($ / час)" : "Desired rate ($ / hour)"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(240,240,238,0.35)", fontSize: 14, pointerEvents: "none" }}>$</span>
                    <input value={form.rate} onChange={e => { setForm(p => ({ ...p, rate: e.target.value })); setErrors(p => ({ ...p, rate: false })); }}
                      placeholder="0" type="number" min="0" autoFocus
                      style={{ ...(errors.rate ? errInp : inp), paddingLeft: 28 }}
                      onFocus={e => !errors.rate && (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                      onBlur={e => !errors.rate && (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>
                </div>

                {/* Summary card */}
                <div style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)", padding: "14px 16px",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(240,240,238,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
                    {isRu ? "Ваши данные" : "Your summary"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "rgba(240,240,238,0.45)" }}>{isRu ? "Имя" : "Name"}</span>
                      <span style={{ color: "#f0f0ee", fontWeight: 600 }}>{form.name}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "rgba(240,240,238,0.45)" }}>{isRu ? "Игры" : "Games"}</span>
                      <span style={{ color: "#f0f0ee", fontWeight: 600 }}>{form.games.join(", ")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "rgba(240,240,238,0.45)" }}>{isRu ? "Ранг" : "Rank"}</span>
                      <span style={{ color: "#f0f0ee", fontWeight: 600 }}>{form.ranks}</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.15)" }}>
                  <div style={{ fontSize: 12, color: "rgba(74,222,128,0.85)", lineHeight: 1.55 }}>
                    {isRu
                      ? "Нажимая «Отправить», вы соглашаетесь с правилами платформы и подтверждаете, что ваш аккаунт не использовался для читерства."
                      : "By submitting, you agree to platform rules and confirm your account has not been used for cheating."}
                  </div>
                </div>
              </div>
            )}

            {/* Footer buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} style={{
                  height: 48, padding: "0 20px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: "rgba(255,255,255,0.07)", color: "rgba(240,240,238,0.7)",
                  fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 14, flexShrink: 0,
                }}>
                  ←
                </button>
              )}
              <button onClick={next} style={{
                flex: 1, height: 48, borderRadius: 12, border: "none", cursor: "pointer",
                background: "#f0f0ee", color: "#111",
                fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 15,
                transition: "opacity 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                {step < 2 ? (isRu ? "Далее" : "Continue") : (isRu ? "Отправить заявку" : "Submit Application")}
              </button>
            </div>

            {/* Step dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
              {steps.map((_, i) => (
                <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 9999, background: i === step ? "#f0f0ee" : "rgba(255,255,255,0.2)", transition: "all 0.3s" }} />
              ))}
            </div>
          </div>
        )}
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
const USD_TO_RUB = 90;

function ProfileMenu({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme() as { theme: string; setTheme: (t: "light" | "dark" | "system") => void; toggleTheme: () => void };
  const { lang, setLang } = useLang();
  const [, navigate] = useLocation();
  const isRu = lang === "ru";
  const [showRequestGame, setShowRequestGame] = useState(false);
  const [showBecomeBooster, setShowBecomeBooster] = useState(false);
  const [balance, setBalance] = useState<number>(() => {
    try { return parseFloat(localStorage.getItem("boost_balance") ?? "0") || 0; } catch { return 0; }
  });
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

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

        {/* Balance row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "8px 12px" }}>
          <div>
            <div style={{ fontSize: 10, color: mutedColor, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>
              {isRu ? "Баланс" : "Balance"}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: itemColor, fontVariantNumeric: "tabular-nums" }}>
              {isRu ? `₽${Math.round(balance * USD_TO_RUB).toLocaleString("ru-RU")}` : `$${balance.toFixed(2)}`}
            </div>
          </div>
          <button
            onClick={() => setShowTopUp(v => !v)}
            style={{ height: 28, padding: "0 12px", borderRadius: 8, border: "none", cursor: "pointer", background: "#f0f0ee", color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 12, flexShrink: 0 }}
          >
            {isRu ? "Пополнить" : "Top up"}
          </button>
        </div>

        {/* Top-up input (inline) */}
        {showTopUp && (
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <input
              type="number" min="1"
              placeholder={isRu ? "Сумма в $" : "Amount $"}
              value={topUpAmount}
              onChange={e => setTopUpAmount(e.target.value)}
              autoFocus
              style={{ flex: 1, height: 32, padding: "0 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.07)", color: itemColor, fontFamily: "var(--app-font-sans)", fontSize: 13, outline: "none" }}
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
              style={{ height: 32, padding: "0 12px", borderRadius: 8, border: "none", cursor: "pointer", background: "#4ade80", color: "#111", fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 13 }}
            >
              OK
            </button>
          </div>
        )}

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
                width: 36, height: 28, borderRadius: 9999, border: "none", cursor: "pointer",
                fontFamily: "var(--app-font-sans)", fontWeight: 600, fontSize: 11,
                background: lang === l ? "rgba(255,255,255,0.15)" : "transparent",
                color: lang === l ? itemColor : mutedColor,
                transition: "all 0.15s",
                display: "flex", alignItems: "center", justifyContent: "center",
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
      <MenuItem
        label="Стать бустером"
        arrow
        onClick={() => setShowBecomeBooster(true)}
      />
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
      {showBecomeBooster && (
        <BecomeBoosterModal onClose={() => setShowBecomeBooster(false)} />
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

/* ── Icon button helper ──────────────────────────── */
function IconBtn({ children, title, onClick }: { children: React.ReactNode; title?: string; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 36, height: 36, borderRadius: 9999, border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        background: hov ? "var(--bg-primary-hover)" : "transparent",
        color: hov ? "var(--text-primary)" : "var(--text-secondary)",
        transition: "background 0.15s, color 0.15s",
      }}
    >
      {children}
    </button>
  );
}

/* ── Logged-in app header ────────────────────────── */
export const SearchContext = (window as any).__boostSearchCtx ?? (() => {
  const listeners: Array<(v: string) => void> = [];
  const ctx = {
    value: "",
    subscribe: (fn: (v: string) => void) => { listeners.push(fn); return () => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); }; },
    emit: (v: string) => { ctx.value = v; listeners.forEach(fn => fn(v)); },
  };
  (window as any).__boostSearchCtx = ctx;
  return ctx;
})();

function AppHeader() {
  const { lang } = useLang();
  const isRu = lang === "ru";
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState(SearchContext.value);

  function handleSearch(v: string) {
    setSearchVal(v);
    SearchContext.emit(v);
  }

  return (
    <header style={{
      position: "sticky", top: 0, left: 0, right: 0, zIndex: 50,
      height: 60,
      background: "var(--bg-glass-nav)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border-secondary)",
      display: "flex", alignItems: "center",
      padding: "0 24px", gap: 16,
    }}>
      {/* Left spacer */}
      <div style={{ flex: 1 }} />

      {/* Search bar — centered */}
      <div style={{
        width: "100%", maxWidth: 480,
        display: "flex", alignItems: "center", gap: 10,
        height: 40, borderRadius: 9999,
        background: searchFocused ? "var(--bg-tertiary)" : "var(--bg-secondary)",
        padding: "0 16px",
        transition: "background 0.18s",
        cursor: "text",
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={searchVal}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder={isRu ? "Поиск по игре, эло…" : "Search by game, elo…"}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "var(--text-primary)", fontFamily: "var(--app-font-sans)", fontSize: 14,
          }}
        />
        {searchVal && (
          <button onClick={() => handleSearch("")} style={{
            flexShrink: 0, background: "none", border: "none", cursor: "pointer",
            color: "var(--text-tertiary)", display: "flex", padding: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
        {/* scan/filter icon */}
        <button style={{
          flexShrink: 0, background: "none", border: "none", cursor: "pointer",
          color: "var(--text-tertiary)", display: "flex", padding: 0, transition: "color 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-secondary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M6 12h12M10 18h4"/>
          </svg>
        </button>
      </div>

      {/* Right spacer + icons */}
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4 }}>
        <IconBtn title={isRu ? "Уведомления" : "Notifications"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </IconBtn>
        <div style={{ marginLeft: 4 }}>
          <ProfileButton />
        </div>
      </div>
    </header>
  );
}

/* ── Navbar ──────────────────────────────────────── */
export default function Navbar() {
  const { lang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const tr = translations[lang].nav;
  const [mobileOpen, setMobileOpen] = useState(false);

  // When logged in — show the full-width app header
  if (user) {
    return <AppHeader />;
  }

  const navLinks = [
    { label: tr.signIn, href: "/login" },
  ];

  return (
    <>
      {/* Desktop floating pill nav (logged-out only) */}
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
      </nav>

      {/* Mobile nav (logged-out only) */}
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
