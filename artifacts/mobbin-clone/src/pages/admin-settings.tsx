import { useState } from "react";
import { AdminLayout } from "./admin-layout";
import { useSiteSettings, SiteSettings } from "../SiteSettingsContext";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,240,238,0.35)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 14 }}>
        {title}
      </div>
      <div style={{ background: "#1a1a1a", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#f0f0ee" }}>{label}</div>
        {hint && <div style={{ fontSize: 12, color: "rgba(240,240,238,0.35)", marginTop: 2 }}>{hint}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

const inp: React.CSSProperties = {
  height: 36, padding: "0 12px", borderRadius: 9,
  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
  color: "#f0f0ee", fontFamily: "var(--app-font-sans)", fontSize: 13,
  outline: "none", minWidth: 220,
};

const textAreaStyle: React.CSSProperties = {
  padding: "10px 12px", borderRadius: 9,
  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
  color: "#f0f0ee", fontFamily: "var(--app-font-sans)", fontSize: 13,
  outline: "none", width: 320, resize: "vertical", minHeight: 72,
};

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: 36, height: 36, padding: 3, borderRadius: 9,
          border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
          cursor: "pointer",
        }}
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ ...inp, width: 100, minWidth: 100 }}
      />
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
        background: value ? "#ffab00" : "rgba(255,255,255,0.12)",
        position: "relative", transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3, left: value ? 23 : 3, transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }} />
    </button>
  );
}

export default function AdminSettings() {
  const { settings, updateSettings, resetSettings } = useSiteSettings();
  const [local, setLocal] = useState<SiteSettings>({ ...settings });
  const [saved, setSaved] = useState(false);

  function patch(key: keyof SiteSettings, value: unknown) {
    setLocal(p => ({ ...p, [key]: value }));
  }

  function save() {
    updateSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AdminLayout title="Настройки сайта">
      <div style={{ maxWidth: 720 }}>

        <Section title="Брендинг">
          <Row label="Название сервиса" hint="Отображается в шапке и заголовке">
            <input style={inp} value={local.siteName} onChange={e => patch("siteName", e.target.value)} placeholder="Boost" />
          </Row>
          <Row label="Буква логотипа" hint="Первая буква в иконке лого">
            <input style={{ ...inp, minWidth: 72, width: 72, textAlign: "center", fontWeight: 700, fontSize: 16 }} value={local.logoLetter} maxLength={2} onChange={e => patch("logoLetter", e.target.value)} />
          </Row>
          <Row label="Фавикон (эмодзи)" hint="Иконка вкладки браузера">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 28 }}>{local.faviconEmoji}</div>
              <input style={{ ...inp, minWidth: 80, width: 80, textAlign: "center", fontSize: 20 }} value={local.faviconEmoji} maxLength={2} onChange={e => patch("faviconEmoji", e.target.value)} />
            </div>
          </Row>
          <Row label="Превью лого">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: local.primaryColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 22, color: "#fff",
              }}>
                {local.logoLetter}
              </div>
              <span style={{ color: "#f0f0ee", fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" }}>{local.siteName}</span>
            </div>
          </Row>
        </Section>

        <Section title="Цвета темы">
          <Row label="Основной цвет" hint="Цвет логотипа и кнопок">
            <ColorInput value={local.primaryColor} onChange={v => patch("primaryColor", v)} />
          </Row>
          <Row label="Акцентный цвет" hint="Цвет выделения и активных элементов">
            <ColorInput value={local.accentColor} onChange={v => patch("accentColor", v)} />
          </Row>
          <Row label="Превью цветов">
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: local.primaryColor, border: "1px solid rgba(255,255,255,0.1)" }} />
              <div style={{ width: 36, height: 36, borderRadius: 9, background: local.accentColor, border: "1px solid rgba(255,255,255,0.1)" }} />
              <div style={{
                height: 36, padding: "0 14px", borderRadius: 9, background: local.accentColor,
                display: "flex", alignItems: "center", fontSize: 13, fontWeight: 700, color: "#111",
              }}>Кнопка</div>
            </div>
          </Row>
        </Section>

        <Section title="SEO-настройки">
          <Row label="Title страницы" hint="<title> в браузерной вкладке">
            <input style={inp} value={local.seoTitle} onChange={e => patch("seoTitle", e.target.value)} placeholder="Boost — Game Boosting" />
          </Row>
          <Row label="Meta Description" hint="Описание для поисковиков">
            <textarea
              style={textAreaStyle}
              value={local.seoDescription}
              onChange={e => patch("seoDescription", e.target.value)}
              placeholder="Профессиональный буст..."
            />
          </Row>
        </Section>

        <Section title="Дополнительно">
          <Row label="Текст футера">
            <input style={inp} value={local.footerText} onChange={e => patch("footerText", e.target.value)} />
          </Row>
          <Row label="Telegram">
            <input style={inp} value={local.socialTelegram} onChange={e => patch("socialTelegram", e.target.value)} placeholder="https://t.me/..." />
          </Row>
          <Row label="Discord">
            <input style={inp} value={local.socialDiscord} onChange={e => patch("socialDiscord", e.target.value)} placeholder="https://discord.gg/..." />
          </Row>
          <Row label="Режим обслуживания" hint="Закрывает сайт для обычных пользователей">
            <Toggle value={local.maintenanceMode} onChange={v => patch("maintenanceMode", v)} />
          </Row>
        </Section>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={save}
            style={{
              height: 40, padding: "0 24px", borderRadius: 10, border: "none", cursor: "pointer",
              background: saved ? "#4ade80" : "#f0f0ee", color: "#111",
              fontFamily: "var(--app-font-sans)", fontWeight: 700, fontSize: 14,
              transition: "background 0.2s",
            }}
          >
            {saved ? "✓ Сохранено" : "Сохранить"}
          </button>
          <button
            onClick={() => { resetSettings(); setLocal({ ...settings }); }}
            style={{
              height: 40, padding: "0 20px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
              background: "transparent", color: "rgba(240,240,238,0.5)",
              fontFamily: "var(--app-font-sans)", fontWeight: 500, fontSize: 14,
            }}
          >
            Сбросить
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
