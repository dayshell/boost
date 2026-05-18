const CDN = "https://mobbin.com/_next/static/media";

const testimonials = [
  {
    name: "Sebastian Speier",
    company: "Shop",
    avatar: `${CDN}/sebastian.750424ba.jpeg`,
    companyLogo: `${CDN}/shop.ff5e3e84.png`,
    quote: "Mobbin is a great resource and it always comes in handy to see what the best practices or standards are for mobile patterns in our current landscape.",
  },
  {
    name: "Meng To",
    company: "DesignCode",
    avatar: `${CDN}/meng.fcf87109.png`,
    companyLogo: `${CDN}/designcode.ff2e5bc4.png`,
    quote: "Mobbin is a game-changer for designers looking to step up their understanding of UX and UI design patterns. It's so massive, meticulously organized, has deep user flows and even a figma plugin! It's indispensable in the modern designer's toolbox.",
  },
  {
    name: "Marco Cornacchia",
    company: "Figma",
    avatar: `${CDN}/marco.9fcbcaa5.png`,
    companyLogo: `${CDN}/figma.1633c7c9.png`,
    quote: "Mobbin is one of my favorite resources for product design and ui inspo. I love having access to a ton of \"real world examples\" to see how different apps and companies handle specific UI patterns and flows.",
  },
  {
    name: "Daryl Ginn",
    company: "Endless",
    avatar: `${CDN}/daryl.d4d57329.png`,
    companyLogo: `${CDN}/endless.03c95ba0.png`,
    quote: "Mobbin has quickly become our favourite inspiration resource for designing mobile apps at endless.design, their advanced filtering is unmatched in the inspiration space.",
  },
  {
    name: "Haerin Song",
    company: "Visa",
    avatar: `${CDN}/haerin.683bc17a.jpeg`,
    companyLogo: `${CDN}/visa.f9c2158f.webp`,
    quote: "By using the Mobbin app, I save both my research time and space in my photo galleries filled with random screenshots. I love how easy it is to search for different patterns and copy and paste flows into Figma. It is a wonderful design tool you cannot live without!",
  },
  {
    name: "Rachel How",
    company: null,
    avatar: `${CDN}/rachel.2f387582.jpeg`,
    companyLogo: null,
    quote: "Mobbin is my go-to reference for app & web design. Apart from saving countless hours, it gives me insights on the design patterns, copywriting, and user flows of world-class products. A must-have for creative inspiration and efficiency!",
  },
];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
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
          {t.companyLogo && (
            <div style={{
              position: "absolute",
              bottom: -2,
              right: -2,
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: "2px solid var(--bg-primary)",
              background: "var(--bg-primary)",
              overflow: "hidden",
            }}>
              <img src={t.companyLogo} alt={t.company || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
            </div>
          )}
        </div>
        <div>
          <p className="text-body-bold">{t.name}</p>
          {t.company && <p className="text-compact text-secondary">{t.company}</p>}
        </div>
      </figcaption>
      <blockquote className="text-body">{t.quote}</blockquote>
    </figure>
  );
}

export default function Testimonials() {
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
          What our users are saying.
        </h2>

        <div style={{ columns: "4 240px", columnGap: 16 }}>
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
