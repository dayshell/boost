import { useLang } from "../LangContext";
import { translations } from "../i18n";

const CDN = "https://mobbin.com/_next/static/media";

const marqueeApps = [
  { src: `${CDN}/shop.ff5e3e84.png`, alt: "Shop" },
  { src: `${CDN}/airbnb.b34b1209.webp`, alt: "Airbnb" },
  { src: `${CDN}/loom.ce86ce82.webp`, alt: "Loom" },
  { src: `${CDN}/cosmos.45db1f27.webp`, alt: "Cosmos" },
  { src: `${CDN}/headspace.b6ad42a9.webp`, alt: "Headspace" },
  { src: `${CDN}/wise.da9d8274.webp`, alt: "Wise" },
  { src: `${CDN}/nike.e36df995.webp`, alt: "Nike" },
  { src: `${CDN}/dropbox.b8e44d6f.png`, alt: "Dropbox" },
  { src: `${CDN}/retro.754d946a.webp`, alt: "Retro" },
  { src: `${CDN}/chatgpt.ca41d0c2.webp`, alt: "ChatGPT" },
  { src: `${CDN}/mailchimp.847b7b4b.webp`, alt: "Mailchimp" },
  { src: `${CDN}/creme.6dedf9f9.webp`, alt: "Creme" },
  { src: `${CDN}/uber.e4559041.webp`, alt: "Uber" },
];

function AppLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{ width: 64, height: 64, borderRadius: 18, overflow: "hidden", flexShrink: 0 }}>
      <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
    </div>
  );
}

export default function JoinSection() {
  const { lang } = useLang();
  const tr = translations[lang].join;

  return (
    <section style={{ padding: "80px 0", background: "var(--bg-primary)", textAlign: "center" }}>
      <div style={{ padding: "0 24px", marginBottom: 40 }}>
        <h2 className="text-spotlight" style={{ maxWidth: 460, margin: "0 auto 16px" }}>{tr.heading}</h2>
        <p className="text-body text-secondary" style={{ maxWidth: 420, margin: "0 auto 32px" }}>{tr.subtitle}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <a href="#" className="btn-inverse">{tr.join}</a>
          <a href="#" className="btn-outline">
            {tr.seePlans}
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: "var(--bg-tertiary)" }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15.996 10L3 10" /><path d="M9.734 16.318L15.632 9.999L9.734 3.679" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, overflow: "hidden", marginTop: 40 }}>
        <div style={{ position: "relative" }}>
          <div className="ticker-track" style={{ display: "flex", gap: 16, width: "max-content" }}>
            {[...marqueeApps, ...marqueeApps].map((app, i) => <AppLogo key={i} src={app.src} alt={app.alt} />)}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div className="ticker-track-reverse" style={{ display: "flex", gap: 16, width: "max-content" }}>
            {[...marqueeApps.slice(5), ...marqueeApps.slice(0, 5), ...marqueeApps.slice(5), ...marqueeApps.slice(0, 5)].map((app, i) => <AppLogo key={i} src={app.src} alt={app.alt} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
