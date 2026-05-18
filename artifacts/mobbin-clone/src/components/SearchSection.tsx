import { useState } from "react";

const CDN = "https://mobbin.com/_next/static/media";

const tabs = ["Screens", "UI Elements", "Flows", "Text in Screenshot"];

const screenImages = [
  { src: `${CDN}/shop.ff5e3e84.png`, label: "Profile" },
  { src: `${CDN}/airbnb.b34b1209.webp`, label: "Onboarding" },
  { src: `${CDN}/loom.ce86ce82.webp`, label: "Home" },
  { src: `${CDN}/cosmos.45db1f27.webp`, label: "Search" },
  { src: `${CDN}/headspace.b6ad42a9.webp`, label: "Settings" },
  { src: `${CDN}/wise.da9d8274.webp`, label: "Payment" },
  { src: `${CDN}/nike.e36df995.webp`, label: "Feed" },
  { src: `${CDN}/dropbox.b8e44d6f.png`, label: "Dashboard" },
  { src: `${CDN}/retro.754d946a.webp`, label: "Login" },
  { src: `${CDN}/chatgpt.ca41d0c2.webp`, label: "Chat" },
];

export default function SearchSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section style={{ padding: "80px 0", background: "var(--bg-primary)", overflow: "hidden" }}>
      <div style={{ textAlign: "center", padding: "0 24px", marginBottom: 32 }}>
        <h2 className="text-spotlight" style={{ maxWidth: 550, margin: "0 auto 24px" }}>
          Find design patterns in seconds.
        </h2>

        {/* Segmented control */}
        <div
          style={{
            display: "inline-flex",
            background: "var(--bg-tertiary)",
            borderRadius: 9999,
            padding: 4,
            gap: 2,
            height: 44,
            alignItems: "center",
          }}
        >
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="text-body-bold"
              style={{
                height: 36,
                padding: "0 12px",
                borderRadius: 9999,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                background: activeTab === i ? "var(--bg-primary)" : "transparent",
                color: activeTab === i ? "var(--text-primary)" : "var(--text-tertiary)",
                boxShadow: activeTab === i ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
                whiteSpace: "nowrap",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Screens marquee */}
      <div style={{ marginTop: 48, overflow: "hidden" }}>
        <div
          className="ticker-track"
          style={{
            display: "flex",
            gap: 24,
            width: "max-content",
          }}
        >
          {[...screenImages, ...screenImages, ...screenImages].map((img, i) => (
            <figure key={i} style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <figcaption className="text-body-bold" style={{ textAlign: "center", fontSize: 14 }}>{img.label}</figcaption>
              <div
                style={{
                  width: 160,
                  height: 346,
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "var(--bg-secondary)",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
                }}
              >
                <img src={img.src} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
