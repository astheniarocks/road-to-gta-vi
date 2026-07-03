import type { TimelineLayoutItem } from "./useTimelineLayout";
import { formatDisplayDate } from "../../utils/dateMath";

type TimelineEventCardProps = {
  item: TimelineLayoutItem;
  isSelected: boolean;
  showThumbnail: boolean;
  onSelect: (id: string) => void;
};

export function TimelineEventCard({ item, isSelected, showThumbnail, onSelect }: TimelineEventCardProps) {
  const importance = item.importance ?? "normal";

  return (
    <article
      aria-labelledby={`timeline-event-title-${item.id}`}
      className={`timeline-event-card importance-${importance} side-${item.side} ${
        isSelected ? "is-selected" : ""
      }`}
      id={`timeline-event-${item.id}`}
      onClick={() => onSelect(item.id)}
      onFocus={() => onSelect(item.id)}
      style={{
        left: item.left,
        top: item.top,
        width: item.width
      }}
      tabIndex={0}
    >
      <div className="timeline-event-copy">
        <h2 className="timeline-event-title" id={`timeline-event-title-${item.id}`}>
          {item.title}
        </h2>
        <p className="timeline-event-date">{formatDisplayDate(item.date)}</p>
      </div>
      {showThumbnail && item.thumbnail ? (
        <img alt="" className="timeline-event-thumbnail" loading="lazy" src={item.thumbnail} />
      ) : null}
    </article>
  );
}
