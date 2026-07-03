import type { SiteConfig, TimelineEvent } from "../types/config";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function numberValue(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function booleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function optionValue<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback;
}

function normalizeEvent(value: unknown, fallbackDate: string, index: number): TimelineEvent {
  const event = isRecord(value) ? value : {};

  return {
    id: stringValue(event.id, `event-${index + 1}`),
    title: stringValue(event.title, "Untitled event"),
    date: stringValue(event.date, fallbackDate),
    description: stringValue(event.description, ""),
    thumbnail: stringValue(event.thumbnail, ""),
    link: stringValue(event.link, ""),
    importance: optionValue(event.importance, ["minor", "normal", "major"] as const, "normal"),
    preferredPlacement: optionValue(event.preferredPlacement, ["auto", "above", "below"] as const, "auto"),
    category: stringValue(event.category, "")
  };
}

export function normalizeConfig(value: unknown, fallback: SiteConfig): SiteConfig {
  const input = isRecord(value) ? value : {};
  const hero = isRecord(input.hero) ? input.hero : {};
  const background = isRecord(input.background) ? input.background : {};
  const theme = isRecord(input.theme) ? input.theme : {};
  const timeline = isRecord(input.timeline) ? input.timeline : {};
  const navigation = isRecord(input.navigation) ? input.navigation : {};
  const events = Array.isArray(input.events)
    ? input.events.map((event, index) => normalizeEvent(event, fallback.startDate, index))
    : fallback.events;

  return {
    siteTitle: stringValue(input.siteTitle, fallback.siteTitle),
    startDate: stringValue(input.startDate, fallback.startDate),
    endDate: stringValue(input.endDate, fallback.endDate),
    hero: {
      image: stringValue(hero.image, fallback.hero.image ?? ""),
      altText: stringValue(hero.altText, fallback.hero.altText),
      maxHeightDesktop: numberValue(hero.maxHeightDesktop, fallback.hero.maxHeightDesktop),
      maxHeightMobile: numberValue(hero.maxHeightMobile, fallback.hero.maxHeightMobile),
      fit: optionValue(hero.fit, ["contain", "cover"] as const, fallback.hero.fit),
      position: optionValue(hero.position, ["center", "top", "bottom"] as const, fallback.hero.position)
    },
    background: {
      image: stringValue(background.image, fallback.background.image ?? ""),
      overlayColor: stringValue(background.overlayColor, fallback.background.overlayColor),
      overlayOpacity: numberValue(background.overlayOpacity, fallback.background.overlayOpacity),
      blur: numberValue(background.blur, fallback.background.blur),
      position: stringValue(background.position, fallback.background.position),
      fit: optionValue(background.fit, ["cover", "contain"] as const, fallback.background.fit)
    },
    theme: {
      accentColor: stringValue(theme.accentColor, fallback.theme.accentColor),
      barTrackColor: stringValue(theme.barTrackColor, fallback.theme.barTrackColor),
      barFillColor: stringValue(theme.barFillColor, fallback.theme.barFillColor),
      textColor: stringValue(theme.textColor, fallback.theme.textColor),
      mutedTextColor: stringValue(theme.mutedTextColor, fallback.theme.mutedTextColor),
      cardBackground: stringValue(theme.cardBackground, fallback.theme.cardBackground),
      cardBorder: stringValue(theme.cardBorder, fallback.theme.cardBorder)
    },
    timeline: {
      showThumbnails: booleanValue(timeline.showThumbnails, fallback.timeline.showThumbnails),
      mobileThumbnailBreakpoint: numberValue(
        timeline.mobileThumbnailBreakpoint,
        fallback.timeline.mobileThumbnailBreakpoint
      ),
      eventCollisionMode: "auto-lanes"
    },
    navigation: {
      showEditorLink: booleanValue(navigation.showEditorLink, fallback.navigation.showEditorLink),
      showGamesLink: booleanValue(navigation.showGamesLink, fallback.navigation.showGamesLink)
    },
    events
  };
}
