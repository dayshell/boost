const CDN = "https://mobbin.com/_next/static/media";

export default function FeaturesSection() {
  return (
    <section style={{ padding: "80px 24px", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 className="text-spotlight" style={{ maxWidth: 500, margin: "0 auto" }}>
            From inspiration to creation.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            {
              title: "Save to collections",
              desc: "Bookmark any screen or flow to your personal collections and stay organised.",
              img: `${CDN}/cosmos.45db1f27.webp`,
              bg: "#f0f0ee",
            },
            {
              title: "Export to Figma",
              desc: "Send screens directly to Figma with our plugin. One click, zero friction.",
              img: `${CDN}/shop.ff5e3e84.png`,
              bg: "#f0eef8",
            },
            {
              title: "Share with your team",
              desc: "Collaborate with your team through shared workspaces and linked collections.",
              img: `${CDN}/airbnb.b34b1209.webp`,
              bg: "#eef4f0",
            },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                borderRadius: 24,
                overflow: "hidden",
                background: f.bg,
                padding: "40px 40px 0",
                minHeight: 360,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3 className="text-title-2" style={{ marginBottom: 12 }}>{f.title}</h3>
              <p className="text-body text-secondary" style={{ marginBottom: 32, flex: 1 }}>{f.desc}</p>
              <div style={{ marginTop: "auto", borderRadius: "16px 16px 0 0", overflow: "hidden", height: 200 }}>
                <img
                  src={f.img}
                  alt={f.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
