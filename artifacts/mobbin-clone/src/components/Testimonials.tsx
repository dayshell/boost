import { useLang } from "@/LangContext";

const testimonials = [
  {
    name: "ShadowStrike",
    rank: "CS2 Global Elite",
    avatar: "https://i.pravatar.cc/150?img=12",
    quote: {
      ru: "Профессиональный подход к работе. Буст выполнен качественно и в срок. Бустер был вежлив, отвечал на все вопросы. Рекомендую!",
      en: "Professional approach to work. Boost completed with quality and on time. Booster was polite and answered all questions. Highly recommend!",
    },
  },
  {
    name: "PhoenixRising",
    rank: "Valorant Immortal",
    avatar: "https://i.pravatar.cc/150?img=33",
    quote: {
      ru: "Отличный сервис! Заказывал буст с Платины до Иммортала. Все прошло быстро и безопасно. Аккаунт в полном порядке, спасибо команде!",
      en: "Excellent service! Ordered boost from Platinum to Immortal. Everything went quickly and safely. Account is in perfect condition, thanks to the team!",
    },
  },
  {
    name: "CyberWolf",
    rank: "Dota 2 Divine",
    avatar: "https://i.pravatar.cc/150?img=68",
    quote: {
      ru: "Пользуюсь услугами уже второй раз. Всегда качественно, быстро и конфиденциально. Бустеры высокого уровня, видно что профессионалы своего дела.",
      en: "Using the service for the second time. Always quality, fast and confidential. High-level boosters, you can see they are professionals.",
    },
  },
  {
    name: "NightHawk",
    rank: "League of Legends Diamond",
    avatar: "https://i.pravatar.cc/150?img=47",
    quote: {
      ru: "Очень довольна результатом! Поднялась с Золота до Платины за 3 дня. Поддержка всегда на связи, отвечают быстро. Буду обращаться еще!",
      en: "Very satisfied with the result! Climbed from Gold to Platinum in 3 days. Support is always available and responds quickly. Will use again!",
    },
  },
  {
    name: "IronFist",
    rank: "CS2 Supreme",
    avatar: "https://i.pravatar.cc/150?img=52",
    quote: {
      ru: "Надежный сервис с адекватными ценами. Буст прошел без проблем, все конфиденциально. Бустер играл аккуратно, без подозрительных действий. Рекомендую!",
      en: "Reliable service with reasonable prices. Boost went smoothly, everything confidential. Booster played carefully without suspicious actions. Recommend!",
    },
  },
  {
    name: "DragonSlayer",
    rank: "Valorant Radiant",
    avatar: "https://i.pravatar.cc/150?img=15",
    quote: {
      ru: "Лучший сервис буста, которым я пользовался. Быстро, качественно, безопасно. Достиг Радианта благодаря профессиональной команде. Спасибо!",
      en: "Best boosting service I've used. Fast, quality, safe. Reached Radiant thanks to the professional team. Thank you!",
    },
  },
];

function TestimonialCard({ t, lang }: { t: typeof testimonials[0]; lang: "en" | "ru" }) {
  return (
    <figure
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        background: "var(--bg-primary)",
        border: "1px solid var(--border-secondary)",
        breakInside: "avoid",
      }}
    >
      <figcaption style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden" }}>
            <img
              src={t.avatar}
              alt={`Avatar of ${t.name}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              loading="lazy"
            />
          </div>
        </div>
        <div>
          <p className="text-body-bold">{t.name}</p>
          <p className="text-compact text-secondary">{t.rank}</p>
        </div>
      </figcaption>
      <blockquote className="text-body">{t.quote[lang]}</blockquote>
    </figure>
  );
}

export default function Testimonials() {
  const { lang } = useLang();

  return (
    <section id="testimonials" style={{
      padding: "80px 24px",
      background: "var(--bg-primary)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Fade at bottom */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "35%",
        background: "linear-gradient(to top, var(--bg-primary), transparent)",
        zIndex: 1,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <h2 className="text-spotlight" style={{ textAlign: "center", maxWidth: 500, margin: "0 auto 48px", textWrap: "balance" }}>
          {lang === "ru" ? "Отзывы наших клиентов" : "What our players are saying"}
        </h2>

        <div style={{ columns: "4 240px", columnGap: 16 }}>
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
