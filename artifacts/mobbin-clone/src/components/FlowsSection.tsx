const CDN = "https://mobbin.com/_next/static/media";

const flowScreens = [
  { src: `${CDN}/shop.ff5e3e84.png`, step: "1" },
  { src: `${CDN}/airbnb.b34b1209.webp`, step: "2" },
  { src: `${CDN}/loom.ce86ce82.webp`, step: "3" },
  { src: `${CDN}/cosmos.45db1f27.webp`, step: "4" },
  { src: `${CDN}/headspace.b6ad42a9.webp`, step: "5" },
];

export default function FlowsSection() {
  return (
    <section style={{ padding: "80px 24px", background: "var(--bg-secondary)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 className="text-spotlight" style={{ maxWidth: 550, margin: "0 auto" }}>
            Explore entire user journeys with flows.
          </h2>
        </div>

        <div style={{ overflow: "hidden", borderRadius: 24, background: "var(--bg-primary)", padding: 40 }}>
          {/* Flow path visual */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
            {flowScreens.map((screen, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: 140,
                      height: 300,
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)",
                    }}
                  >
                    <img src={screen.src} alt={`Step ${screen.step}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {screen.step}
                  </div>
                </div>
                {i < flowScreens.length - 1 && (
                  <div style={{ width: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)" }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15.996 10L3 10" />
                      <path d="M9.734 16.318L15.632 9.999L9.734 3.679" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p className="text-body-bold" style={{ marginBottom: 4 }}>Instagram · Onboarding</p>
              <p className="text-compact text-secondary">5 screens · iOS</p>
            </div>
            <a href="/flows" className="btn-outline" style={{ height: 36, fontSize: 13 }}>View all flows</a>
          </div>
        </div>
      </div>
    </section>
  );
}
