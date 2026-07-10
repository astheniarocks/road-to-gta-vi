import type { CSSProperties } from "react";
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
  const cardContent = (
    <>
      <div className="timeline-event-dot-wrap" aria-hidden="true">
        <span className="timeline-event-list-dot" />
      </div>
      <div className="timeline-event-body">
        <div className="timeline-event-copy">
          <div className="timeline-event-meta">
            <p className="timeline-event-date">{formatDisplayDate(item.date)}</p>
            {item.category ? <span className="timeline-event-category">{item.category}</span> : null}
          </div>
          <h2 className="timeline-event-title" id={`timeline-event-title-${item.id}`}>
            {item.title}
          </h2>
          {item.description ? <p className="timeline-event-description">{item.description}</p> : null}
        </div>
        {showThumbnail && item.thumbnail ? (
          <img alt="" className="timeline-event-thumbnail" loading="lazy" src={item.thumbnail} />
        ) : null}
        {item.link ? (
          <a className="timeline-event-link" href={item.link} rel="noreferrer" target="_blank">
            Read more
          </a>
        ) : null}
      </div>
    </>
  );

  return (
    <article
      aria-labelledby={`timeline-event-title-${item.id}`}
      className={`timeline-event-card importance-${importance} ${isSelected ? "is-selected" : ""}`}
      id={`timeline-event-${item.id}`}
      onClick={() => onSelect(item.id)}
      onFocus={() => onSelect(item.id)}
      style={{ "--event-color": item.color } as CSSProperties}
      tabIndex={0}
    >
      {cardContent}
    </article>
  );
}
