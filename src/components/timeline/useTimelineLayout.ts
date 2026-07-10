import { useMemo } from "react";
import type { SiteConfig, TimelineEvent } from "../../types/config";
import { calculateEventPosition, sortEventsByDate } from "../../utils/dateMath";

const EVENT_COLORS = [
  "#32d8ff",
  "#ff4fd8",
  "#ffe15c",
  "#6cff8f",
  "#ff8b3d",
  "#9a7cff",
  "#ff5f7e",
  "#47f0c9",
  "#f7a6ff",
  "#7ee3ff"
];

export type TimelineLayoutItem = TimelineEvent & {
  position: number;
  rawPosition: number;
  adjustedPosition: number;
  isOutsideRange: boolean;
  markerX: number;
  color: string;
};

type TimelineLayout = {
  items: TimelineLayoutItem[];
  stageHeight: number;
  barTop: number;
  trackLeft: number;
  trackWidth: number;
};

function clampPx(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getScalePadding(containerWidth: number): number {
  if (containerWidth < 520) {
    return 22;
  }

  if (containerWidth < 820) {
    return 42;
  }

  return clampPx(containerWidth * 0.075, 72, 108);
}

function getMarkerInset(containerWidth: number): number {
  return containerWidth < 520 ? 13 : 18;
}

function getMinimumMarkerGap(containerWidth: number): number {
  if (containerWidth < 520) {
    return 24;
  }

  if (containerWidth < 820) {
    return 28;
  }

  return 34;
}

function getEventColor(id: string, index: number): string {
  let hash = 0;

  for (let charIndex = 0; charIndex < id.length; charIndex += 1) {
    hash = (hash * 31 + id.charCodeAt(charIndex)) >>> 0;
  }

  return EVENT_COLORS[(hash + index) % EVENT_COLORS.length];
}

function spreadMarkers(rawCenters: number[], minGap: number, minX: number, maxX: number): number[] {
  if (rawCenters.length === 0) {
    return [];
  }

  const centers = rawCenters.map((center) => clampPx(center, minX, maxX));

  for (let index = 1; index < centers.length; index += 1) {
    const required = centers[index - 1] + minGap;

    if (centers[index] < required) {
      centers[index] = required;
    }
  }

  for (let index = centers.length - 1; index >= 0; index -= 1) {
    const overflow = centers[index] - maxX;

    if (overflow > 0) {
      centers[index] -= overflow;

      for (let backIndex = index - 1; backIndex >= 0; backIndex -= 1) {
        const allowed = centers[backIndex + 1] - minGap;

        if (centers[backIndex] > allowed) {
          centers[backIndex] = allowed;
        }
      }
    }
  }

  return centers.map((center) => clampPx(center, minX, maxX));
}

export function useTimelineLayout(config: SiteConfig, containerWidth: number): TimelineLayout {
  return useMemo(() => {
    const safeWidth = Math.max(containerWidth, 320);
    const scalePadding = getScalePadding(safeWidth);
    const trackLeft = scalePadding;
    const trackWidth = Math.max(160, safeWidth - scalePadding * 2);
    const markerInset = Math.min(getMarkerInset(safeWidth), trackWidth / 2);
    const markerMinX = trackLeft + markerInset;
    const markerMaxX = trackLeft + trackWidth - markerInset;
    const markerRange = Math.max(1, markerMaxX - markerMinX);
    const sortedEvents = sortEventsByDate(config.events);
    const positionedEvents = sortedEvents.map((event) => ({
      event,
      position: calculateEventPosition(event.date, config.startDate, config.endDate)
    }));
    const rawCenters = positionedEvents.map(({ position }) => markerMinX + position.clamped * markerRange);
    const desiredGap = getMinimumMarkerGap(safeWidth);
    const availableGap = rawCenters.length > 1 ? markerRange / (rawCenters.length - 1) : desiredGap;
    const adjustedCenters = spreadMarkers(rawCenters, Math.min(desiredGap, availableGap), markerMinX, markerMaxX);

    const items = positionedEvents.map(({ event, position }, index) => {
      const markerX = adjustedCenters[index] ?? rawCenters[index] ?? markerMinX;

      return {
        ...event,
        position: position.clamped,
        rawPosition: position.raw,
        adjustedPosition: (markerX - trackLeft) / trackWidth,
        isOutsideRange: position.isOutsideRange,
        markerX,
        color: getEventColor(event.id, index)
      };
    });

    return {
      items,
      stageHeight: safeWidth < 520 ? 34 : 42,
      barTop: 0,
      trackLeft,
      trackWidth
    };
  }, [config, containerWidth]);
}
