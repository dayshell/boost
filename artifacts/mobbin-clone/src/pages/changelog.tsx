import Navbar from "../components/Navbar";
import { useTheme } from "../ThemeContext";
import { useLang } from "../LangContext";

/* ── Changelog entries ─────────────────────────── */
const ENTRIES = [
  {
    date: "May 15, 2026",
    dateRu: "15 мая 2026",
    image: "https://bytescale.mobbin.com/FW25bBB/image/mobbin.com/prod/content/products/8a8c2719-255d-4073-8e26-d5280376475f.webp?f=webp&w=1200&q=85&fit=shrink-cover",
    sections: [
      {
        title: "New boost card design",
        titleRu: "Новый дизайн карточек бустов",
        body: "We've completely redesigned boost cards to feel more like a modern app library — each card now shows the full rank progression, budget badge, and game identity at a glance.",
        bodyRu: "Мы полностью переработали карточки бустов — теперь каждая карточка отображает полный прогресс по рангу, значок бюджета и идентификатор игры с первого взгляда.",
        items: [
          { bold: "Rank progression", boldRu: "Прогресс по рангу", text: " — current and target rank shown with a directional arrow and game-accent color.", textRu: " — текущий и целевой ранги отображаются со стрелкой и акцентным цветом игры." },
          { bold: "Budget badge", boldRu: "Значок бюджета", text: " — now floats inside the card background, just like on Mobbin.", textRu: " — теперь находится внутри фона карточки, как в Mobbin." },
        ],
      },
      {
        title: "Other improvements",
        titleRu: "Другие улучшения",
        body: "",
        bodyRu: "",
        items: [
          { bold: "", boldRu: "", text: "Dark mode is now applied consistently across all pages including the boost detail view.", textRu: "Тёмная тема теперь применяется последовательно на всех страницах, включая детали буста." },
          { bold: "", boldRu: "", text: "Category pills on the boosts page no longer have a border — cleaner, more like the reference design.", textRu: "Пилюли категорий на странице бустов больше не имеют обводки — чище и ближе к эталонному дизайну." },
        ],
      },
      {
        title: "Fixes",
        titleRu: "Исправления",
        body: "",
        bodyRu: "",
        items: [
          { bold: "", boldRu: "", text: "Fixed 'isRu is not defined' runtime error in the logged-out navbar when the Flows link was added.", textRu: "Исправлена ошибка 'isRu is not defined' в незалогиненном navbar при добавлении ссылки на Flows." },
        ],
      },
    ],
  },
  {
    date: "Apr 3, 2026",
    dateRu: "3 апр 2026",
    image: "https://bytescale.mobbin.com/FW25bBB/image/mobbin.com/prod/content/products/636ef5f3-7294-445c-9bd5-4d531e2d7c2d.webp?f=webp&w=1200&q=85&fit=shrink-cover",
    sections: [
      {
        title: "Boost detail page — Mobbin style",
        titleRu: "Детальная страница буста — стиль Mobbin",
        body: "The boost detail page is now a faithful recreation of the Mobbin app detail layout. You'll find a square game icon, a large two-line title, a contact banner, metadata row, and a full screen grid.",
        bodyRu: "Страница деталей буста теперь точно повторяет макет Mobbin. Здесь квадратная иконка игры, крупный двустрочный заголовок, баннер контакта, строка метаданных и полная сетка экранов.",
        items: [
          { bold: "Screens tab", boldRu: "Вкладка Screens", text: " — shows the rank visual highlight card plus all similar boosts in a 3-column grid.", textRu: " — показывает визуализацию ранга плюс похожие бусты в сетке из 3 колонок." },
          { bold: "Flows tab", boldRu: "Вкладка Flows", text: " — lists similar requests from the same game.", textRu: " — отображает похожие заявки из той же игры." },
          { bold: "Sticky tab bar", boldRu: "Липкий таб-бар", text: " — includes Grid dropdown, clock, and filter icons, exactly as in the reference.", textRu: " — включает переключатель Grid, иконки часов и фильтра, как в эталоне." },
        ],
      },
    ],
  },
  {
    date: "Mar 10, 2026",
    dateRu: "10 мар 2026",
    image: "https://bytescale.mobbin.com/FW25bBB/image/mobbin.com/prod/content/products/f75f2b43-6e51-48a8-9e64-6cd93df77a29.webp?f=webp&w=1200&q=85&fit=shrink-cover",
    sections: [
      {
        title: "Game filter redesign",
        titleRu: "Редизайн фильтра игр",
        body: "The boosts page top bar now follows the Mobbin flows grid layout — no sidebar, no second search, just a clean count badge, Filters button, New Request button, and a category pill row.",
        bodyRu: "Шапка страницы бустов теперь повторяет макет сетки Mobbin — без боковой панели и второго поиска, только счётчик, кнопки Filters и New Request, и строка пилюль категорий.",
        items: [
          { bold: "Removed", boldRu: "Убрано", text: " — Sort button and duplicate search input.", textRu: " — кнопка Sort и дублирующийся поиск." },
          { bold: "Added", boldRu: "Добавлено", text: " — clean pill tabs for All · CS2 · Valorant · Dota 2 without borders.", textRu: " — чистые пилюли All · CS2 · Valorant · Dota 2 без обводки." },
        ],
      },
      {
        title: "Fixes",
        titleRu: "Исправления",
        body: "",
        bodyRu: "",
        items: [
          { bold: "", boldRu: "", text: "Game logo images now use local PNGs instead of external CDN links that may go offline.", textRu: "Логотипы игр теперь используют локальные PNG вместо внешних CDN-ссылок." },
        ],
      },
    ],
  },
  {
    date: "Feb 1, 2026",
    dateRu: "1 фев 2026",
    image: "https://bytescale.mobbin.com/FW25bBB/image/mobbin.com/prod/content/products/7b4ae0f8-7ade-4eb5-82c7-e2a8553ddc9e.webp?f=webp&w=1200&q=85&fit=shrink-cover",
    sections: [
      {
        title: "Language & theme support",
        titleRu: "Поддержка языка и темы",
        body: "The app now fully supports Russian and English with a simple EN/RU toggle in the navbar. Dark mode works across all pages and components.",
        bodyRu: "Приложение теперь полностью поддерживает русский и английский языки с переключателем EN/RU в navbar. Тёмная тема работает на всех страницах и компонентах.",
        items: [
          { bold: "i18n", boldRu: "i18n", text: " — all UI text including nav, boost cards, detail page, and modals is translated.", textRu: " — весь UI-текст, включая nav, карточки бустов, детальную страницу и модалы, переведён." },
          { bold: "Theme persistence", boldRu: "Сохранение темы", text: " — your theme preference is remembered across sessions.", textRu: " — ваш выбор темы сохраняется между сессиями." },
        ],
      },
    ],
  },
];

export default function Changelog() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const isRu = lang === "ru";
  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const pageBg = isDark ? "#111111" : "#ffffff";
  const textPrimary = isDark ? "#f0f0ee" : "#111111";
  const textMuted = isDark ? "rgba(240,240,238,0.38)" : "#aaaaaa";
  const textBody = isDark ? "rgba(240,240,238,0.75)" : "#333333";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e5e5";

  return (
    <div style={{ minHeight: "100dvh", background: pageBg, fontFamily: "var(--app-font-sans)" }}>
      <Navbar />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "56px 32px 120px" }}>

        {/* ── Page title ── */}
        <h1 style={{
          margin: "0 0 12px",
          fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em",
          color: textPrimary, fontFamily: "var(--app-font-sans)", lineHeight: 1.1,
        }}>
          {isRu ? "История изменений" : "Changelog"}
        </h1>

        {/* Separator */}
        <div style={{ height: 1, background: borderColor, marginBottom: 0 }}/>

        {/* ── Entries ── */}
        {ENTRIES.map((entry, i) => (
          <div key={i}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "160px 1fr",
              gap: "0 48px",
              padding: "56px 0",
            }}>
              {/* Date column */}
              <div style={{
                paddingTop: 4,
                fontSize: 13, fontWeight: 500,
                color: textMuted, fontFamily: "var(--app-font-sans)",
                lineHeight: 1.5,
              }}>
                {isRu ? entry.dateRu : entry.date}
              </div>

              {/* Content column */}
              <div style={{ minWidth: 0 }}>

                {/* Screenshot */}
                <div style={{
                  borderRadius: 16, overflow: "hidden",
                  background: isDark ? "#1e1e1e" : "#f2f2f0",
                  marginBottom: 32,
                  border: `1px solid ${borderColor}`,
                }}>
                  <img
                    src={entry.image}
                    alt=""
                    style={{ display: "block", width: "100%", height: "auto", maxHeight: 380, objectFit: "cover" }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                </div>

                {/* Sections */}
                {entry.sections.map((section, si) => (
                  <div key={si} style={{ marginBottom: si < entry.sections.length - 1 ? 32 : 0 }}>
                    <h2 style={{
                      margin: "0 0 10px",
                      fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em",
                      color: textPrimary, fontFamily: "var(--app-font-sans)", lineHeight: 1.2,
                    }}>
                      {isRu ? section.titleRu : section.title}
                    </h2>

                    {(isRu ? section.bodyRu : section.body) && (
                      <p style={{
                        margin: "0 0 14px",
                        fontSize: 15, lineHeight: 1.65,
                        color: textBody, fontFamily: "var(--app-font-sans)",
                      }}>
                        {isRu ? section.bodyRu : section.body}
                      </p>
                    )}

                    {section.items.length > 0 && (
                      <ul style={{ margin: "0", padding: "0 0 0 18px", listStyle: "disc" }}>
                        {section.items.map((item, ii) => (
                          <li key={ii} style={{
                            fontSize: 15, lineHeight: 1.65,
                            color: textBody, fontFamily: "var(--app-font-sans)",
                            marginBottom: 6,
                          }}>
                            {(isRu ? item.boldRu : item.bold) && (
                              <strong style={{ color: textPrimary }}>
                                {isRu ? item.boldRu : item.bold}
                              </strong>
                            )}
                            {isRu ? item.textRu : item.text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Separator between entries */}
            {i < ENTRIES.length - 1 && (
              <div style={{ height: 1, background: borderColor }}/>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
