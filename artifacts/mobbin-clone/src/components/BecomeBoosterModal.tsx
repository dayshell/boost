import { useState } from "react";
import { createPortal } from "react-dom";
import { useLang } from "../LangContext";

export function BecomeBoosterModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const isRu = lang === "ru";
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    email: "", telegram: "", games: [] as string[], experience: "", ranks: "", rate: "", about: "", otherProfiles: "",
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
      if (!form.email.trim()) err.email = true;
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
                  <label style={{ ...lbl, color: errors.email ? "#e05050" : "rgba(240,240,238,0.45)" }}>
                    {isRu ? "Email с платформы" : "Email from platform"}
                  </label>
                  <input value={form.email} onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: false })); }}
                    placeholder={isRu ? "your@email.com" : "your@email.com"} autoFocus type="email"
                    style={errors.email ? errInp : inp}
                    onFocus={e => !errors.email && (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                    onBlur={e => !errors.email && (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
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
                  <label style={lbl}>{isRu ? "Профили на других ресурсах (необязательно)" : "Profiles on other platforms (optional)"}</label>
                  <textarea value={form.otherProfiles} onChange={e => setForm(p => ({ ...p, otherProfiles: e.target.value }))}
                    placeholder={isRu ? "Укажите ссылки на профили, где вы занимаетесь бустом..." : "Provide links to your profiles on other boosting platforms..."}
                    rows={2}
                    style={{ ...inp, height: "auto", padding: "10px 14px", resize: "none", lineHeight: 1.55 }}
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
                      <span style={{ color: "rgba(240,240,238,0.45)" }}>{isRu ? "Email" : "Email"}</span>
                      <span style={{ color: "#f0f0ee", fontWeight: 600 }}>{form.email}</span>
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
