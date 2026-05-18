import { createContext, useContext, useState, ReactNode } from "react";

export interface SiteSettings {
  siteName: string;
  logoLetter: string;
  primaryColor: string;
  accentColor: string;
  seoTitle: string;
  seoDescription: string;
  faviconEmoji: string;
  footerText: string;
  socialTelegram: string;
  socialDiscord: string;
  maintenanceMode: boolean;
}

const DEFAULTS: SiteSettings = {
  siteName: "Boost",
  logoLetter: "B",
  primaryColor: "#0f0f0f",
  accentColor: "#ffab00",
  seoTitle: "Boost — Game Boosting Service",
  seoDescription: "Professional boosting for CS2, Dota 2, and Valorant — fast, safe, and guaranteed results.",
  faviconEmoji: "🎮",
  footerText: "© 2026 Boost. All rights reserved.",
  socialTelegram: "https://t.me/boost",
  socialDiscord: "https://discord.gg/boost",
  maintenanceMode: false,
};

function loadSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem("boost_site_settings");
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULTS;
}

interface SiteSettingsCtx {
  settings: SiteSettings;
  updateSettings: (patch: Partial<SiteSettings>) => void;
  resetSettings: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsCtx>({
  settings: DEFAULTS,
  updateSettings: () => {},
  resetSettings: () => {},
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(loadSettings);

  function updateSettings(patch: Partial<SiteSettings>) {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem("boost_site_settings", JSON.stringify(next));
      return next;
    });
  }

  function resetSettings() {
    localStorage.removeItem("boost_site_settings");
    setSettings(DEFAULTS);
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
