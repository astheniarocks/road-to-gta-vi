type TimelineProgressProps = {
  percent: string;
  startDate: string;
  endDate: string;
};

export function TimelineProgress({ percent, startDate, endDate }: TimelineProgressProps) {
  return (
    <div className="timeline-progress" aria-live="polite">
      <p className="timeline-progress-label">{percent}% Complete</p>
      <p className="timeline-progress-range">
        {startDate} to {endDate}
      </p>
    </div>
  );
}
