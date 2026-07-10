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
    image: "/assets/backgrounds/grassrivers.png",
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
      description: "",
      thumbnail: "",
      link: "",
      importance: "major",
      preferredPlacement: "below",
      category: ""
    },
    {
      id: "gta-vi-leak",
      title: "GTA VI Development Leak",
      date: "2022-09-18",
      description: "",
      thumbnail: "",
      link: "",
      importance: "major",
      preferredPlacement: "below",
      category: ""
    },
    {
      id: "trailer-1",
      title: "Trailer 1",
      date: "2023-12-05",
      description: "",
      thumbnail: "/assets/events/trailer1.jpg",
      link: "",
      importance: "major",
      preferredPlacement: "below",
      category: ""
    },
    {
      id: "delay-1-fardiar-returns",
      title: "Delay 1 / Fardiar Returns",
      date: "2025-05-02",
      description: "",
      thumbnail: "",
      link: "",
      importance: "major",
      preferredPlacement: "below",
      category: ""
    },
    {
      id: "trailer-2",
      title: "Trailer 2",
      date: "2025-05-06",
      description: "",
      thumbnail: "/assets/events/trailer2.jpg",
      link: "",
      importance: "major",
      preferredPlacement: "below",
      category: ""
    },
    {
      id: "delay-2",
      title: "Delay 2",
      date: "2025-11-06",
      description: "",
      thumbnail: "",
      link: "",
      importance: "major",
      preferredPlacement: "below",
      category: ""
    },
    {
      id: "cover-preorders",
      title: "Cover x Pre-Orders",
      date: "2026-06-18",
      description: "",
      thumbnail: "",
      link: "",
      importance: "major",
      preferredPlacement: "below",
      category: ""
    },
    {
      id: "screenshots-editions",
      title: "Screenshots x Editions",
      date: "2026-06-18",
      description: "",
      thumbnail: "",
      link: "",
      importance: "major",
      preferredPlacement: "below",
      category: ""
    },
    {
      id: "pre-orders-begin",
      title: "Pre-Orders Begin",
      date: "2026-06-25",
      description: "",
      thumbnail: "",
      link: "",
      importance: "major",
      preferredPlacement: "below",
      category: ""
    },
    {
      id: "launch",
      title: "Launch",
      date: "2026-11-19",
      description: "",
      thumbnail: "",
      link: "",
      importance: "major",
      preferredPlacement: "auto",
      category: ""
    }
  ]
};

export default siteConfig;
