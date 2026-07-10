import { useEffect, useMemo, useState } from "react";

type TimelineProgressProps = {
  percent: string;
  startDate: string;
  endDate: string;
  endDateValue: string;
};

function getCountdown(endDateValue: string, now = new Date()) {
  const end = new Date(`${endDateValue}T00:00:00`);
  const remaining = Math.max(0, end.getTime() - now.getTime());
  const totalSeconds = Math.floor(remaining / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalMinutes, totalSeconds };
}

export function TimelineProgress({ percent, startDate, endDate, endDateValue }: TimelineProgressProps) {
  const [now, setNow] = useState(() => new Date());
  const countdown = useMemo(() => getCountdown(endDateValue, now), [endDateValue, now]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="timeline-progress" aria-live="polite">
      <p className="timeline-progress-label">{percent}% Complete</p>
      <p className="timeline-progress-range">
        {startDate} to {endDate}
      </p>
      <div className="timeline-countdown" aria-label="Countdown to launch">
        <div className="timeline-countdown-row">
          <span>{countdown.days.toLocaleString()}</span>
          <strong>Days Left</strong>
        </div>
        <div className="timeline-countdown-row">
          <span>{String(countdown.hours).padStart(2, "0")}</span>
          <strong>Hours Left</strong>
        </div>
        <div className="timeline-countdown-row">
          <span>{String(countdown.minutes).padStart(2, "0")}</span>
          <strong>Minutes Left</strong>
        </div>
        <div className="timeline-countdown-row">
          <span>{String(countdown.seconds).padStart(2, "0")}</span>
          <strong>Seconds Left</strong>
        </div>
        <div className="timeline-countdown-row timeline-countdown-row-wide">
          <span>{countdown.totalMinutes.toLocaleString()}</span>
          <strong>Total Minutes Left</strong>
        </div>
        <div className="timeline-countdown-row timeline-countdown-row-wide">
          <span>{countdown.totalSeconds.toLocaleString()}</span>
          <strong>Total Seconds Left</strong>
        </div>
      </div>
    </div>
  );
}
