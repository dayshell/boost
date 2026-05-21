export type Lang = "en" | "ru";

export const translations = {
  en: {
    nav: {
      pricing: "Pricing",
      signIn: "Sign in",
      getStarted: "Get started",
    },
    hero: {
      h1: "Boost your rank. Dominate the game.",
      subtitle: "Professional boosting for CS2, Dota 2, and Valorant — fast, safe, and guaranteed results.",
      join: "Join",
      seePlans: "Read reviews",
      trustedBy: "Trusted by thousands of players worldwide",
    },
    library: {
      heading: "A growing library of",
      orders: "orders completed",
      players: "players boosted",
      games: "games supported",
    },
    search: {
      heading: "Find the right boost in seconds.",
      tabs: ["Rank Boost", "Placement Matches", "Win Boost", "Coaching"],
    },
    flows: {
      heading: "Explore the full boosting journey.",
    },
    features: {
      heading: "From order to rank up.",
      cards: [
        { title: "Save to wishlist", desc: "Bookmark your desired rank and get notified when prices drop." },
        { title: "Export progress", desc: "Track your rank history and share your achievements with friends." },
        { title: "Team collaboration", desc: "Duo boost with a pro player — experience and rank up together." },
      ],
    },
    testimonials: {
      heading: "What our players are saying.",
    },
    join: {
      heading: "Never lose MMR to bad teammates again.",
      subtitle: "Use BOOST for free as long as you like or unlock full access with any of our paid plans.",
      join: "Join",
      seePlans: "See our plans",
    },
    footer: {
      tagline: "Climb the ranked ladder with BOOST.",
      links1: ["Explore", "Games", "Changelog", "Blog"],
      links2: ["Contact", "Help center", "Become a Booster", "Telegram"],
      copy: "© BOOST 2024–2026. All rights reserved",
      privacy: "Privacy policy",
      terms: "Terms",
    },
  },
  ru: {
    nav: {
      pricing: "Тарифы",
      signIn: "Войти",
      getStarted: "Начать",
    },
    hero: {
      h1: "Прокачай свой ранг.\nДоминируй в игре.",
      subtitle: "Профессиональный буст в CS2, Dota 2 и Valorant — быстро, безопасно, с гарантией результата.",
      join: "Вступить",
      seePlans: "Посмотреть отзывы",
      trustedBy: "Нам доверяют тысячи игроков по всему миру",
    },
    library: {
      heading: "Постоянно растущая база",
      orders: "выполненных заказов",
      players: "прокачанных игроков",
      games: "поддерживаемых игр",
    },
    search: {
      heading: "Найди нужный буст за секунды.",
      tabs: ["Буст рейтинга", "Отборочные матчи", "Буст побед", "Коучинг"],
    },
    flows: {
      heading: "Изучи весь процесс прокачки.",
    },
    features: {
      heading: "От заказа до повышения ранга.",
      cards: [
        { title: "Сохрани в избранное", desc: "Отметь желаемый ранг и получи уведомление о снижении цены." },
        { title: "Экспорт прогресса", desc: "Отслеживай историю ранга и делись достижениями с друзьями." },
        { title: "Командный буст", desc: "Играй дуэтом с про-игроком — получи опыт и рейтинг вместе." },
      ],
    },
    testimonials: {
      heading: "Что говорят наши игроки.",
    },
    join: {
      heading: "Хватит терять MMR из-за плохих союзников.",
      subtitle: "Используй BOOST бесплатно сколько угодно или открой полный доступ по одному из платных тарифов.",
      join: "Вступить",
      seePlans: "Тарифы",
    },
    footer: {
      tagline: "Поднимайся в рейтинге с BOOST.",
      links1: ["Игры", "Каталог", "Обновления", "Блог"],
      links2: ["Контакты", "Помощь", "Стать бустером", "Telegram"],
      copy: "© BOOST 2024–2026. Все права защищены",
      privacy: "Политика конфиденциальности",
      terms: "Условия",
    },
  },
} as const;

export function t(lang: Lang, key: string): string {
  const keys = key.split(".");
  let val: unknown = translations[lang];
  for (const k of keys) {
    if (val && typeof val === "object") val = (val as Record<string, unknown>)[k];
    else return key;
  }
  return typeof val === "string" ? val : key;
}
