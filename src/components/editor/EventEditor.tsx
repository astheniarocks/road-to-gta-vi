import type { SiteConfig, TimelineEvent } from "../../types/config";
import { parseDateOnly } from "../../utils/dateMath";
import { ImageSourcePicker } from "./ImageSourcePicker";

type EventEditorProps = {
  config: SiteConfig;
  onAdd: () => void;
  onDelete: (index: number) => void;
  onDuplicate: (index: number) => void;
  onSort: () => void;
  onUpdate: (index: number, event: TimelineEvent) => void;
};

function isOutsideRange(eventDate: string, startDate: string, endDate: string): boolean {
  const event = parseDateOnly(eventDate);
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (!event || !start || !end) {
    return false;
  }

  return event.getTime() < start.getTime() || event.getTime() > end.getTime();
}

export function EventEditor({ config, onAdd, onDelete, onDuplicate, onSort, onUpdate }: EventEditorProps) {
  return (
    <section className="editor-section panel" aria-labelledby="event-editor-title">
      <div className="editor-section-header with-actions">
        <div>
          <p className="editor-kicker">Events</p>
          <h2 id="event-editor-title">Timeline events</h2>
        </div>
        <div className="button-row">
          <button className="button" type="button" onClick={onSort}>
            Sort by date
          </button>
          <button className="button primary" type="button" onClick={onAdd}>
            Add Event
          </button>
        </div>
      </div>

      <div className="event-editor-list">
        {config.events.map((event, index) => {
          const outside = isOutsideRange(event.date, config.startDate, config.endDate);

          return (
            <article className="event-editor-card" key={`${event.id}-${index}`}>
              <div className="event-editor-card-header">
                <div>
                  <p className="event-number">Event {index + 1}</p>
                  <h3>{event.title || "Untitled event"}</h3>
                </div>
                <div className="button-row">
                  <button className="button" type="button" onClick={() => onDuplicate(index)}>
                    Duplicate
                  </button>
                  <button className="button danger" type="button" onClick={() => onDelete(index)}>
                    Delete
                  </button>
                </div>
              </div>

              {outside ? (
                <p className="inline-warning">This event is outside the timeline range and will be clamped visually.</p>
              ) : null}

              <div className="form-grid">
                <label className="field-label">
                  Event ID
                  <input
                    type="text"
                    value={event.id}
                    onChange={(input) => onUpdate(index, { ...event, id: input.target.value })}
                  />
                </label>
                <label className="field-label">
                  Title
                  <input
                    type="text"
                    value={event.title}
                    onChange={(input) => onUpdate(index, { ...event, title: input.target.value })}
                  />
                </label>
                <label className="field-label">
                  Date
                  <input
                    type="date"
                    value={event.date}
                    onChange={(input) => onUpdate(index, { ...event, date: input.target.value })}
                  />
                </label>
                <label className="field-label">
                  Link
                  <input
                    placeholder="https://example.com"
                    type="url"
                    value={event.link ?? ""}
                    onChange={(input) => onUpdate(index, { ...event, link: input.target.value })}
                  />
                </label>
                <label className="field-label">
                  Importance
                  <select
                    value={event.importance ?? "normal"}
                    onChange={(input) =>
                      onUpdate(index, {
                        ...event,
                        importance: input.target.value as TimelineEvent["importance"]
                      })
                    }
                  >
                    <option value="minor">Minor</option>
                    <option value="normal">Normal</option>
                    <option value="major">Major</option>
                  </select>
                </label>
                <label className="field-label">
                  Preferred placement
                  <select
                    value={event.preferredPlacement ?? "auto"}
                    onChange={(input) =>
                      onUpdate(index, {
                        ...event,
                        preferredPlacement: input.target.value as TimelineEvent["preferredPlacement"]
                      })
                    }
                  >
                    <option value="auto">Auto</option>
                    <option value="below">Below</option>
                    <option value="above">Above</option>
                  </select>
                </label>
                <label className="field-label">
                  Category
                  <input
                    placeholder="Trailer, news, launch"
                    type="text"
                    value={event.category ?? ""}
                    onChange={(input) => onUpdate(index, { ...event, category: input.target.value })}
                  />
                </label>
              </div>

              <label className="field-label">
                Description
                <textarea
                  rows={3}
                  value={event.description ?? ""}
                  onChange={(input) => onUpdate(index, { ...event, description: input.target.value })}
                />
              </label>

              <ImageSourcePicker
                label="Thumbnail source"
                previewAlt=""
                suggestedAssetPath="/assets/events/trailer-2.jpg"
                value={event.thumbnail ?? ""}
                onChange={(value) => onUpdate(index, { ...event, thumbnail: value })}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}
