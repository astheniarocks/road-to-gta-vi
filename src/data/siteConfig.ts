import type { SiteConfig } from "../types/config";

export const siteConfig: SiteConfig = {
  siteTitle: "Road to VI",
  startDate: "2022-02-04",
  endDate: "2026-11-19",
  hero: {
    image: "/assets/logos/official-gta-vi-logo.png",
    altText: "GTA VI logo",
    maxHeightDesktop: 260,
    maxHeightMobile: 170,
    fit: "contain",
    position: "center"
  },
  background: {
    image: "/assets/backgrounds/jason-and-lucia-motel-landscape.jpg",
    overlayColor: "#07040b",
    overlayOpacity: 0.7,
    blur: 0,
    position: "center",
    fit: "cover"
  },
  theme: {
    accentColor: "#ff4fd8",
    barTrackColor: "#241728",
    barFillColor: "linear-gradient(90deg, #32d8ff 0%, #5a8cff 38%, #ff4fd8 100%)",
    textColor: "#fff7fb",
    mutedTextColor: "#cdbccc",
    cardBackground: "rgba(21, 14, 25, 0.88)",
    cardBorder: "rgba(255, 255, 255, 0.18)"
  },
  timeline: {
    showThumbnails: true,
    mobileThumbnailBreakpoint: 520,
    eventCollisionMode: "auto-lanes"
  },
  navigation: {
    showEditorLink: true,
    showGamesLink: true
  },
  events: [
    {
      id: "rockstar-announcement",
      title: "Rockstar Confirms Next GTA",
      date: "2022-02-04",
      description: "Rockstar confirms active development of the next Grand Theft Auto.",
      thumbnail: "",
      importance: "major",
      preferredPlacement: "below"
    },
    {
      id: "gta-vi-leak",
      title: "GTA VI Development Leak",
      date: "2022-09-18",
      description: "Major in-development footage leak appears online.",
      thumbnail: "",
      importance: "major",
      preferredPlacement: "below"
    },
    {
      id: "trailer-1",
      title: "Trailer 1",
      date: "2023-12-05",
      description: "Rockstar releases Trailer 1 for Grand Theft Auto VI.",
      thumbnail: "",
      importance: "major",
      preferredPlacement: "below"
    },
    {
      id: "launch",
      title: "Launch",
      date: "2026-11-19",
      description: "Grand Theft Auto VI launch date.",
      thumbnail: "",
      importance: "major",
      preferredPlacement: "auto"
    }
  ]
};

export default siteConfig;
