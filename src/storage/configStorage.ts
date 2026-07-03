import type { SiteConfig } from "../types/config";

const DRAFT_KEY = "road-to-vi:draft-config";

export function loadDraftConfig(): SiteConfig | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as SiteConfig) : null;
  } catch {
    return null;
  }
}

export function saveDraftConfig(config: SiteConfig): void {
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(config));
}

export function clearDraftConfig(): void {
  window.localStorage.removeItem(DRAFT_KEY);
}

export function hasDraftConfig(): boolean {
  return window.localStorage.getItem(DRAFT_KEY) !== null;
}
