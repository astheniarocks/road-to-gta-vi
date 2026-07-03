import type { SiteConfig, ValidationIssue } from "../types/config";
import { isDateOnly, parseDateOnly } from "./dateMath";
import { isLocalPreviewReference } from "./assetHelpers";

const COLOR_PATTERN =
  /^(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\([^)]+\)|hsla?\([^)]+\)|[a-zA-Z]+)$/;

function addIssue(
  issues: ValidationIssue[],
  severity: ValidationIssue["severity"],
  message: string,
  field?: string
): void {
  issues.push({ severity, message, field });
}

export function validateConfig(config: SiteConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!config.siteTitle.trim()) {
    addIssue(issues, "error", "Site title is required.", "siteTitle");
  }

  if (!isDateOnly(config.startDate)) {
    addIssue(issues, "error", "Start date must use YYYY-MM-DD format.", "startDate");
  }

  if (!isDateOnly(config.endDate)) {
    addIssue(issues, "error", "End date must use YYYY-MM-DD format.", "endDate");
  }

  const start = parseDateOnly(config.startDate);
  const end = parseDateOnly(config.endDate);

  if (start && end && end.getTime() <= start.getTime()) {
    addIssue(issues, "error", "End date must be after the start date.", "endDate");
  }

  if (config.hero.image && !config.hero.altText.trim()) {
    addIssue(issues, "warning", "Hero alt text is recommended when a hero image is set.", "hero.altText");
  }

  if (isLocalPreviewReference(config.hero.image)) {
    addIssue(
      issues,
      "warning",
      "Hero image is a local preview reference. Add the file to public/assets before publishing.",
      "hero.image"
    );
  }

  if (isLocalPreviewReference(config.background.image)) {
    addIssue(
      issues,
      "warning",
      "Background image is a local preview reference. Add the file to public/assets before publishing.",
      "background.image"
    );
  }

  if (config.background.overlayOpacity < 0 || config.background.overlayOpacity > 1) {
    addIssue(issues, "error", "Overlay opacity must be between 0 and 1.", "background.overlayOpacity");
  }

  if (config.background.blur < 0) {
    addIssue(issues, "error", "Background blur cannot be negative.", "background.blur");
  }

  Object.entries(config.theme).forEach(([key, value]) => {
    if (!value.trim()) {
      addIssue(issues, "error", `Theme colour ${key} cannot be empty.`, `theme.${key}`);
    } else if (!COLOR_PATTERN.test(value.trim())) {
      addIssue(issues, "warning", `Theme colour ${key} may not be a valid CSS colour.`, `theme.${key}`);
    }
  });

  const seenIds = new Set<string>();

  config.events.forEach((event, index) => {
    const label = event.title || `event ${index + 1}`;

    if (!event.id.trim()) {
      addIssue(issues, "error", `Missing ID for ${label}.`, `events.${index}.id`);
    } else if (seenIds.has(event.id)) {
      addIssue(issues, "error", `Duplicate event ID: ${event.id}.`, `events.${index}.id`);
    }

    seenIds.add(event.id);

    if (!event.title.trim()) {
      addIssue(issues, "error", `Missing title for event ${index + 1}.`, `events.${index}.title`);
    }

    if (!event.date.trim()) {
      addIssue(issues, "error", `Missing date for ${label}.`, `events.${index}.date`);
    } else if (!isDateOnly(event.date)) {
      addIssue(issues, "error", `${label} must use a date in YYYY-MM-DD format.`, `events.${index}.date`);
    } else if (start && end) {
      const eventDate = parseDateOnly(event.date);

      if (eventDate && (eventDate.getTime() < start.getTime() || eventDate.getTime() > end.getTime())) {
        addIssue(
          issues,
          "warning",
          `${label} is outside the configured timeline range and will be clamped visually.`,
          `events.${index}.date`
        );
      }
    }

    if (event.thumbnail && isLocalPreviewReference(event.thumbnail)) {
      addIssue(
        issues,
        "warning",
        `${label} uses a local preview thumbnail. Add the file to public/assets before publishing.`,
        `events.${index}.thumbnail`
      );
    }
  });

  return issues;
}

export function hasBlockingIssues(issues: ValidationIssue[]): boolean {
  return issues.some((issue) => issue.severity === "error");
}
