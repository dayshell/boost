const CDN = "https://mobbin.com/_next/static/media";

const appLogos = [
  { src: `${CDN}/chatgpt.ca41d0c2.webp`, alt: "ChatGPT" },
  { src: `${CDN}/headspace.b6ad42a9.webp`, alt: "Headspace" },
  { src: `${CDN}/nike.e36df995.webp`, alt: "Nike" },
  { src: `${CDN}/dropbox.b8e44d6f.png`, alt: "Dropbox" },
  { src: `${CDN}/creme.6dedf9f9.webp`, alt: "Creme" },
  { src: `${CDN}/cosmos.45db1f27.webp`, alt: "Cosmos" },
  { src: `${CDN}/mailchimp.847b7b4b.webp`, alt: "Mailchimp" },
  { src: `${CDN}/airbnb.b34b1209.webp`, alt: "Airbnb" },
  { src: `${CDN}/retro.754d946a.webp`, alt: "Retro" },
  { src: `${CDN}/loom.ce86ce82.webp`, alt: "Loom" },
  { src: `${CDN}/wise.da9d8274.webp`, alt: "Wise" },
  { src: `${CDN}/shop.ff5e3e84.png`, alt: "Shop" },
  { src: `${CDN}/uber.e4559041.webp`, alt: "Uber" },
];

const stats = [
  { value: "1\u00a0654", label: "apps" },
  { value: "572\u00a0200", label: "screens" },
  { value: "130\u00a0600", label: "flows" },
];

function AppLogo({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: 22,
        overflow: "hidden",
        flexShrink: 0,
        ...style,
      }}
    >
      <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
    </div>
  );
}

export default function LibrarySection() {
  return (
    <section
      style={{
        position: "relative",
        background: "var(--bg-primary)",
        padding: "80px 24px",
        overflow: "hidden",
        minHeight: 400,
      }}
    >
      {/* Background floating logos */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          flexWrap: "wrap",
          padding: 40,
          opacity: 0.12,
          pointerEvents: "none",
        }}
      >
        {[...appLogos, ...appLogos].map((logo, i) => (
          <AppLogo key={i} src={logo.src} alt={logo.alt} />
        ))}
      </div>

      {/* Stats */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <h2 className="text-title-1" style={{ marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" }}>
          A growing library of
        </h2>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-secondary)",
                borderRadius: 20,
                padding: "20px 32px",
                minWidth: 160,
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div className="text-spotlight" style={{ lineHeight: 1 }}>{s.value}</div>
              <div className="text-body text-secondary" style={{ marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
