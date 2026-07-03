import { useMemo } from "react";
import type { SiteConfig, TimelineEvent } from "../../types/config";
import { calculateEventPosition, sortEventsByDate } from "../../utils/dateMath";

export type TimelineLayoutItem = TimelineEvent & {
  position: number;
  rawPosition: number;
  isOutsideRange: boolean;
  side: "above" | "below";
  laneIndex: number;
  markerX: number;
  cardHeight: number;
  left: number;
  top: number;
  width: number;
};

type Lane = {
  side: "above" | "below";
  index: number;
  occupiedRanges: Array<{ left: number; right: number }>;
};

type TimelineLayout = {
  items: TimelineLayoutItem[];
  aboveSpace: number;
  belowSpace: number;
  barTop: number;
  stageHeight: number;
  cardWidth: number;
  trackLeft: number;
  trackWidth: number;
};

function clampPx(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getCardWidth(containerWidth: number): number {
  if (containerWidth < 520) {
    return clampPx(containerWidth * 0.44, 132, 164);
  }

  if (containerWidth < 820) {
    return clampPx(containerWidth * 0.28, 156, 196);
  }

  return clampPx(containerWidth * 0.18, 178, 224);
}

function getLaneHeight(containerWidth: number, viewportHeight: number): number {
  if (containerWidth < 520) {
    return viewportHeight < 700 ? 68 : 82;
  }

  if (containerWidth < 820) {
    return viewportHeight < 700 ? 78 : 98;
  }

  if (viewportHeight < 680) {
    return 74;
  }

  if (viewportHeight < 780) {
    return 86;
  }

  return 106;
}

function getCardHeight(containerWidth: number): number {
  if (containerWidth < 520) {
    return 58;
  }

  return 62;
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

function rangesOverlap(a: { left: number; right: number }, b: { left: number; right: number }, gap: number) {
  return a.left < b.right + gap && b.left < a.right + gap;
}

function findOpenLane(lanes: Lane[], range: { left: number; right: number }, gap: number, maxIndex: number) {
  return lanes.find(
    (lane) =>
      lane.index < maxIndex && !lane.occupiedRanges.some((occupied) => rangesOverlap(occupied, range, gap))
  );
}

function getCardGapFromBar(viewportHeight: number): number {
  if (viewportHeight < 680) {
    return 42;
  }

  if (viewportHeight < 780) {
    return 48;
  }

  return 58;
}

function getStageTailSpace(viewportHeight: number): number {
  if (viewportHeight < 680) {
    return 58;
  }

  if (viewportHeight < 780) {
    return 76;
  }

  return 108;
}

export function useTimelineLayout(
  config: SiteConfig,
  containerWidth: number,
  viewportHeight: number
): TimelineLayout {
  return useMemo(() => {
    const safeWidth = Math.max(containerWidth, 320);
    const scalePadding = getScalePadding(safeWidth);
    const trackLeft = scalePadding;
    const trackWidth = Math.max(160, safeWidth - scalePadding * 2);
    const markerInset = Math.min(getMarkerInset(safeWidth), trackWidth / 2);
    const markerRange = Math.max(1, trackWidth - markerInset * 2);
    const cardWidth = getCardWidth(safeWidth);
    const cardHeight = getCardHeight(safeWidth);
    const laneHeight = getLaneHeight(safeWidth, viewportHeight);
    const cardGapFromBar = getCardGapFromBar(viewportHeight);
    const stageTailSpace = getStageTailSpace(viewportHeight);
    const gap = safeWidth < 520 ? 10 : 16;
    const lanes: Record<"above" | "below", Lane[]> = { above: [], below: [] };

    function createLane(side: "above" | "below"): Lane {
      const lane: Lane = { side, index: lanes[side].length, occupiedRanges: [] };
      lanes[side].push(lane);
      return lane;
    }

    function placeEvent(event: TimelineEvent): TimelineLayoutItem {
      const position = calculateEventPosition(event.date, config.startDate, config.endDate);
      const center = trackLeft + markerInset + position.clamped * markerRange;
      const left = clampPx(center - cardWidth / 2, 0, Math.max(0, safeWidth - cardWidth));
      const range = { left, right: left + cardWidth };
      const preferred = event.preferredPlacement ?? "auto";
      const allowPreferredAbove = preferred === "above";
      let selectedLane: Lane | undefined;

      selectedLane = findOpenLane(lanes.below, range, gap, Number.POSITIVE_INFINITY);

      if (!selectedLane && lanes.below.length === 0) {
        selectedLane = createLane("below");
      }

      if (!selectedLane && !allowPreferredAbove) {
        selectedLane = findOpenLane(lanes.above, range, gap, Number.POSITIVE_INFINITY);
      }

      if (!selectedLane && allowPreferredAbove) {
        selectedLane = findOpenLane(lanes.above, range, gap, Number.POSITIVE_INFINITY);
      }

      if (!selectedLane) {
        selectedLane = createLane(allowPreferredAbove ? "above" : "below");
      }

      selectedLane.occupiedRanges.push(range);

      return {
        ...event,
        position: (center - trackLeft) / trackWidth,
        rawPosition: position.raw,
        isOutsideRange: position.isOutsideRange,
        side: selectedLane.side,
        laneIndex: selectedLane.index,
        markerX: center,
        cardHeight,
        left,
        top: 0,
        width: cardWidth
      };
    }

    const placed = sortEventsByDate(config.events).map(placeEvent);
    const aboveSpace = Math.max(
      lanes.above.length * laneHeight + 12,
      safeWidth < 520 ? 30 : viewportHeight < 780 ? 38 : 50
    );
    const belowSpace = Math.max(
      lanes.below.length * laneHeight + 26,
      safeWidth < 520 ? 108 : viewportHeight < 780 ? 120 : 148
    );
    const barTop = aboveSpace + (viewportHeight < 780 ? 20 : 32);

    const items = placed.map((item) => ({
      ...item,
      top:
        item.side === "above"
          ? aboveSpace - (item.laneIndex + 1) * laneHeight + 8
          : barTop + cardGapFromBar + item.laneIndex * laneHeight
    }));

    return {
      items,
      aboveSpace,
      belowSpace,
      barTop,
      stageHeight: aboveSpace + belowSpace + stageTailSpace,
      cardWidth,
      trackLeft,
      trackWidth
    };
  }, [config, containerWidth, viewportHeight]);
}
