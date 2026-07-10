import { type CSSProperties, useEffect, useRef, useState } from "react";
import type { SiteConfig } from "../../types/config";
import { calculateTimelineProgress, formatDisplayDate } from "../../utils/dateMath";
import { TimelineEventCard } from "./TimelineEventCard";
import { TimelineMarker } from "./TimelineMarker";
import { TimelineProgress } from "./TimelineProgress";
import { useTimelineLayout } from "./useTimelineLayout";

type TimelineBarProps = {
  config: SiteConfig;
  previewLabel?: string;
};

export function TimelineBar({ config, previewLabel }: TimelineBarProps) {
  const progress = calculateTimelineProgress(config.startDate, config.endDate);
  const [selectedEventId, setSelectedEventId] = useState(config.events[0]?.id ?? "");
  const [containerWidth, setContainerWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window === "undefined" ? 900 : window.innerHeight
  );
  const stageRef = useRef<HTMLDivElement | null>(null);
  const layout = useTimelineLayout(config, containerWidth);
  const shouldShowThumbnails =
    config.timeline.showThumbnails && containerWidth > config.timeline.mobileThumbnailBreakpoint;
  const useCompactEventList = containerWidth <= 520 || viewportHeight <= 620;

  useEffect(() => {
    const element = stageRef.current;

    if (!element) {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(element);
    setContainerWidth(element.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleResize() {
      setViewportHeight(window.innerHeight);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!config.events.some((event) => event.id === selectedEventId)) {
      setSelectedEventId(config.events[0]?.id ?? "");
    }
  }, [config.events, selectedEventId]);

  const percent = (progress * 100).toFixed(2);
  const timelineStyle = {
    "--bar-track-color": config.theme.barTrackColor,
    "--bar-fill-color": config.theme.barFillColor,
    "--card-background": config.theme.cardBackground,
    "--card-border": config.theme.cardBorder,
    "--accent-pink": config.theme.accentColor,
    "--accent-cyan": "#32d8ff",
    "--text-strong": config.theme.textColor,
    "--text-muted": config.theme.mutedTextColor
  } as CSSProperties;

  return (
    <section
      className={`timeline-panel ${useCompactEventList ? "is-compact-events" : ""}`}
      aria-label={previewLabel ?? "GTA VI timeline progress"}
      style={timelineStyle}
    >
      {previewLabel ? <p className="timeline-preview-label">{previewLabel}</p> : null}
      <TimelineProgress
        endDateValue={config.endDate}
        endDate={formatDisplayDate(config.endDate)}
        percent={percent}
        startDate={formatDisplayDate(config.startDate)}
      />
      <div
        className="timeline-stage"
        ref={stageRef}
        style={{
          minHeight: layout.stageHeight
        }}
      >
        <div
          className="timeline-bar-row"
          style={{
            left: layout.trackLeft,
            top: layout.barTop,
            width: layout.trackWidth
          }}
        >
          <div className="timeline-bar-track">
            <div
              className="timeline-bar-fill"
              style={
                {
                  "--progress-width": `${progress * 100}%`
                } as CSSProperties
              }
            />
            {useCompactEventList
              ? null
              : layout.items.map((item) => (
                  <TimelineMarker
                    isSelected={item.id === selectedEventId}
                    item={item}
                    key={item.id}
                    onSelect={setSelectedEventId}
                  />
                ))}
          </div>
        </div>
      </div>
      <div className="timeline-event-list" aria-label="Timeline events list">
        {layout.items.map((item) => (
          <TimelineEventCard
            isSelected={item.id === selectedEventId}
            item={item}
            key={item.id}
            onSelect={setSelectedEventId}
            showThumbnail={shouldShowThumbnails}
          />
        ))}
      </div>
    </section>
  );
}
