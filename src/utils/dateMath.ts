import type { TimelineEvent } from "../types/config";

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isDateOnly(value: string): boolean {
  if (!DATE_ONLY_PATTERN.test(value)) {
    return false;
  }

  const parsed = parseDateOnly(value);
  return parsed !== null && formatDateInput(parsed) === value;
}

export function parseDateOnly(value: string): Date | null {
  if (!DATE_ONLY_PATTERN.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

export function todayAsDateOnly(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12));
}

export function formatDateInput(date: Date): string {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(value: string): string {
  const date = parseDateOnly(value);

  if (!date) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateTimelineProgress(
  startDate: string,
  endDate: string,
  currentDate = todayAsDateOnly()
): number {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (!start || !end || end.getTime() <= start.getTime()) {
    return 0;
  }

  return clamp((currentDate.getTime() - start.getTime()) / (end.getTime() - start.getTime()));
}

export function calculateEventPosition(
  eventDate: string,
  startDate: string,
  endDate: string
): { raw: number; clamped: number; isOutsideRange: boolean } {
  const event = parseDateOnly(eventDate);
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (!event || !start || !end || end.getTime() <= start.getTime()) {
    return { raw: 0, clamped: 0, isOutsideRange: true };
  }

  const raw = (event.getTime() - start.getTime()) / (end.getTime() - start.getTime());

  return {
    raw,
    clamped: clamp(raw),
    isOutsideRange: raw < 0 || raw > 1
  };
}

export function sortEventsByDate(events: TimelineEvent[]): TimelineEvent[] {
  return [...events].sort((a, b) => {
    const first = parseDateOnly(a.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const second = parseDateOnly(b.date)?.getTime() ?? Number.MAX_SAFE_INTEGER;

    if (first !== second) {
      return first - second;
    }

    return a.title.localeCompare(b.title);
  });
}
