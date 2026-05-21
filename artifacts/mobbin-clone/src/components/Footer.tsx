import { useState } from "react";
import { useLocation } from "wouter";
import { useLang } from "../LangContext";
import { translations } from "../i18n";
import { BecomeBoosterModal } from "./BecomeBoosterModal";

function BoostLogoWhite() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: "linear-gradient(135deg, #6c3bff 0%, #a855f7 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="17" height="20" viewBox="0 0 18 22" fill="white">
          <path d="M2 1H12C15.3137 1 18 3.68629 18 7C18 8.76607 17.2321 10.3538 16.0186 11.4648C17.2714 12.5445 18 14.1837 18 16C18 19.3137 15.3137 22 12 22H2V1ZM5 4V10H12C13.6569 10 15 8.65685 15 7C15 5.34315 13.6569 4 12 4H5ZM5 13V19H12C13.6569 19 15 17.6569 15 16C15 14.3431 13.6569 13 12 13H5Z" />
        </svg>
      </div>
      <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.03em", color: "#fff" }}>BOOST</span>
    </div>
  );
}

export default function Footer() {
  const { lang } = useLang();
  const [, navigate] = useLocation();
  const tr = translations[lang].footer;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const becomeBoosterText = lang === "ru" ? "Стать бустером" : "Become a Booster";

  const handleLinkClick = (link: string, e: React.MouseEvent) => {
    if (link === becomeBoosterText) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <footer
        className="dark-section"
        style={{ padding: "72px 48px 28px", background: "#0f1011" }}
      >
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr auto auto",
          gap: "0 60px",
          alignItems: "start",
        }}>
          {/* Logo + tagline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <button
              onClick={() => navigate("/")}
              style={{
                display: "inline-block",
                textDecoration: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <BoostLogoWhite />
            </button>
            <p className="text-body" style={{ color: "#999993", maxWidth: 260 }}>{tr.tagline}</p>
          </div>

          {/* Links column 1 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tr.links1.map((link) => (
              <a key={link} href="#" className="text-body-bold" style={{ width: "fit-content" }}>{link}</a>
            ))}
          </div>

          {/* Links column 2 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tr.links2.map((link) => (
              <a
                key={link}
                href="#"
                className="text-body-bold"
                style={{ width: "fit-content" }}
                onClick={(e) => handleLinkClick(link, e)}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          maxWidth: 1280, margin: "40px auto 0",
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
        }}>
          <p className="text-compact" style={{ color: "#999993" }}>{tr.copy}</p>
          <div style={{ display: "flex", gap: 32 }}>
            <a href="#" className="text-compact" style={{ color: "#999993" }}>{tr.privacy}</a>
            <a href="#" className="text-compact" style={{ color: "#999993" }}>{tr.terms}</a>
          </div>
        </div>
      </footer>

      {isModalOpen && <BecomeBoosterModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
