export type TimelineEvent = {
  id: string;
  title: string;
  date: string;
  description?: string;
  thumbnail?: string;
  link?: string;
  importance?: "minor" | "normal" | "major";
  preferredPlacement?: "auto" | "above" | "below";
  category?: string;
};

export type SiteConfig = {
  siteTitle: string;
  startDate: string;
  endDate: string;
  hero: {
    image?: string;
    altText: string;
    maxHeightDesktop: number;
    maxHeightMobile: number;
    fit: "contain" | "cover";
    position: "center" | "top" | "bottom";
  };
  background: {
    image?: string;
    overlayColor: string;
    overlayOpacity: number;
    blur: number;
    position: string;
    fit: "cover" | "contain";
  };
  theme: {
    accentColor: string;
    barTrackColor: string;
    barFillColor: string;
    textColor: string;
    mutedTextColor: string;
    cardBackground: string;
    cardBorder: string;
  };
  timeline: {
    showThumbnails: boolean;
    mobileThumbnailBreakpoint: number;
    eventCollisionMode: "auto-lanes";
  };
  navigation: {
    showEditorLink: boolean;
    showGamesLink: boolean;
  };
  events: TimelineEvent[];
};

export type ValidationSeverity = "error" | "warning";

export type ValidationIssue = {
  severity: ValidationSeverity;
  message: string;
  field?: string;
};
