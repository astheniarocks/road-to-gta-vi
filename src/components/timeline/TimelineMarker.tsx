import type { CSSProperties } from "react";
import { formatDisplayDate } from "../../utils/dateMath";
import type { TimelineLayoutItem } from "./useTimelineLayout";

type TimelineMarkerProps = {
  item: TimelineLayoutItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

export function TimelineMarker({ item, isSelected, onSelect }: TimelineMarkerProps) {
  const outsideText = item.isOutsideRange ? " outside the configured date range" : "";

  return (
    <button
      aria-label={`${item.title}, ${formatDisplayDate(item.date)}${outsideText}`}
      className={`timeline-marker importance-${item.importance ?? "normal"} ${
        isSelected ? "is-selected" : ""
      } ${item.isOutsideRange ? "is-outside" : ""}`}
      onClick={() => onSelect(item.id)}
      style={{ "--event-color": item.color, left: `${item.adjustedPosition * 100}%` } as CSSProperties}
      type="button"
    >
      <span className="timeline-marker-dot" />
    </button>
  );
}
