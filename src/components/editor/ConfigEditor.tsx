import { useEffect, useMemo, useState } from "react";
import { TimelineBar } from "../timeline/TimelineBar";
import { siteConfig } from "../../data/siteConfig";
import { cloneConfig } from "../../data/defaultConfig";
import type { SiteConfig, TimelineEvent, ValidationIssue } from "../../types/config";
import { clearDraftConfig, loadDraftConfig, saveDraftConfig } from "../../storage/configStorage";
import { sortEventsByDate } from "../../utils/dateMath";
import { validateConfig } from "../../utils/configValidation";
import { normalizeConfig } from "../../utils/configNormalization";
import { ImageSourcePicker } from "./ImageSourcePicker";
import { EventEditor } from "./EventEditor";
import { ThemeEditor } from "./ThemeEditor";
import { ConfigImportExport } from "./ConfigImportExport";

const tabs = [
  { id: "timeline", label: "Timeline" },
  { id: "events", label: "Events" },
  { id: "hero", label: "Hero" },
  { id: "background", label: "Background" },
  { id: "theme", label: "Theme" },
  { id: "config", label: "Config" },
  { id: "preview", label: "Preview" }
] as const;

type TabId = (typeof tabs)[number]["id"];

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `event-${Date.now()}`;
}

function createEvent(existingCount: number): TimelineEvent {
  return {
    id: `event-${existingCount + 1}-${Date.now()}`,
    title: "New Event",
    date: "2026-01-01",
    description: "",
    thumbnail: "",
    link: "",
    importance: "normal",
    preferredPlacement: "auto",
    category: ""
  };
}

function ValidationSummary({ issues }: { issues: ValidationIssue[] }) {
  if (!issues.length) {
    return <p className="validation-empty">No validation issues found.</p>;
  }

  return (
    <div className="validation-summary" aria-live="polite">
      <p className="validation-title">Validation</p>
      <ul>
        {issues.map((issue, index) => (
          <li className={`validation-${issue.severity}`} key={`${issue.message}-${index}`}>
            <strong>{issue.severity === "error" ? "Error" : "Warning"}:</strong> {issue.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ConfigEditor() {
  const [config, setConfig] = useState<SiteConfig>(() =>
    normalizeConfig(loadDraftConfig() ?? cloneConfig(siteConfig), siteConfig)
  );
  const [activeTab, setActiveTab] = useState<TabId>("timeline");
  const [status, setStatus] = useState("Draft loaded locally.");
  const issues = useMemo(() => validateConfig(config), [config]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      saveDraftConfig(config);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [config]);

  function updateConfig(nextConfig: SiteConfig) {
    setConfig(nextConfig);
  }

  function updateEvent(index: number, event: TimelineEvent) {
    setConfig((current) => ({
      ...current,
      events: current.events.map((item, itemIndex) => (itemIndex === index ? event : item))
    }));
  }

  function addEvent() {
    setConfig((current) => ({
      ...current,
      events: [...current.events, createEvent(current.events.length)]
    }));
    setActiveTab("events");
  }

  function deleteEvent(index: number) {
    setConfig((current) => ({
      ...current,
      events: current.events.filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  function duplicateEvent(index: number) {
    setConfig((current) => {
      const source = current.events[index];

      if (!source) {
        return current;
      }

      const duplicate: TimelineEvent = {
        ...source,
        id: `${slugify(source.title)}-${Date.now()}`,
        title: `${source.title} Copy`
      };

      return {
        ...current,
        events: [...current.events.slice(0, index + 1), duplicate, ...current.events.slice(index + 1)]
      };
    });
  }

  function sortEvents() {
    setConfig((current) => ({ ...current, events: sortEventsByDate(current.events) }));
  }

  function saveDraftNow() {
    saveDraftConfig(config);
    setStatus("Draft saved locally in this browser.");
  }

  function resetToPublished() {
    const resetConfig = cloneConfig(siteConfig);
    setConfig(resetConfig);
    saveDraftConfig(resetConfig);
    setStatus("Draft reset to the published config.");
  }

  function clearDraft() {
    clearDraftConfig();
    const resetConfig = cloneConfig(siteConfig);
    setConfig(resetConfig);
    setStatus("Local draft cleared. The editor is showing the published config.");
  }

  return (
    <div className="editor-page">
      <header className="editor-header">
        <div>
          <p className="page-kicker">Local editor</p>
          <h1>Road to VI config editor</h1>
          <p>
            This editor saves changes locally in your browser. It does not publish changes to the live
            site by itself.
          </p>
        </div>
        <div className="editor-status panel" role="status">
          {status}
        </div>
      </header>

      <section className="publishing-panel panel" aria-labelledby="publishing-title">
        <h2 id="publishing-title">How publishing works</h2>
        <p>
          This editor saves changes locally in your browser. It does not publish changes to the live site
          by itself.
        </p>
        <p>
          To publish changes, export the config, add any images to public/assets, update
          src/data/siteConfig.ts, commit to GitHub, and let Vercel redeploy the site.
        </p>
      </section>

      <div className="editor-tabs" role="tablist" aria-label="Editor sections">
        {tabs.map((tab) => (
          <button
            aria-controls={`editor-panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            className={`editor-tab ${activeTab === tab.id ? "is-active" : ""}`}
            id={`editor-tab-${tab.id}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`editor-tab-${activeTab}`}
        className="editor-tab-panel"
        id={`editor-panel-${activeTab}`}
        role="tabpanel"
      >
        {activeTab === "timeline" ? (
          <section className="editor-section panel" aria-labelledby="timeline-settings-title">
            <div className="editor-section-header">
              <p className="editor-kicker">Timeline</p>
              <h2 id="timeline-settings-title">Timeline settings</h2>
            </div>
            <div className="form-grid">
              <label className="field-label">
                Site title
                <input
                  type="text"
                  value={config.siteTitle}
                  onChange={(event) => updateConfig({ ...config, siteTitle: event.target.value })}
                />
              </label>
              <label className="field-label">
                Start date
                <input
                  type="date"
                  value={config.startDate}
                  onChange={(event) => updateConfig({ ...config, startDate: event.target.value })}
                />
              </label>
              <label className="field-label">
                End date
                <input
                  type="date"
                  value={config.endDate}
                  onChange={(event) => updateConfig({ ...config, endDate: event.target.value })}
                />
              </label>
              <label className="field-label">
                Mobile thumbnail breakpoint
                <input
                  min={320}
                  step={10}
                  type="number"
                  value={config.timeline.mobileThumbnailBreakpoint}
                  onChange={(event) =>
                    updateConfig({
                      ...config,
                      timeline: {
                        ...config.timeline,
                        mobileThumbnailBreakpoint: Number(event.target.value)
                      }
                    })
                  }
                />
              </label>
            </div>
            <div className="toggle-grid">
              <label className="toggle-label">
                <input
                  checked={config.timeline.showThumbnails}
                  type="checkbox"
                  onChange={(event) =>
                    updateConfig({
                      ...config,
                      timeline: { ...config.timeline, showThumbnails: event.target.checked }
                    })
                  }
                />
                Show event thumbnails
              </label>
              <label className="toggle-label">
                <input
                  checked={config.navigation.showEditorLink}
                  type="checkbox"
                  onChange={(event) =>
                    updateConfig({
                      ...config,
                      navigation: { ...config.navigation, showEditorLink: event.target.checked }
                    })
                  }
                />
                Show editor link in sidebar
              </label>
              <label className="toggle-label">
                <input
                  checked={config.navigation.showGamesLink}
                  type="checkbox"
                  onChange={(event) =>
                    updateConfig({
                      ...config,
                      navigation: { ...config.navigation, showGamesLink: event.target.checked }
                    })
                  }
                />
                Show games links in sidebar
              </label>
            </div>
            <button className="button" type="button" onClick={resetToPublished}>
              Reset to defaults
            </button>
          </section>
        ) : null}

        {activeTab === "events" ? (
          <EventEditor
            config={config}
            onAdd={addEvent}
            onDelete={deleteEvent}
            onDuplicate={duplicateEvent}
            onSort={sortEvents}
            onUpdate={updateEvent}
          />
        ) : null}

        {activeTab === "hero" ? (
          <section className="editor-section panel" aria-labelledby="hero-settings-title">
            <div className="editor-section-header">
              <p className="editor-kicker">Hero</p>
              <h2 id="hero-settings-title">Logo and hero image</h2>
            </div>
            <ImageSourcePicker
              label="Hero image source"
              previewAlt={config.hero.altText || "Hero image preview"}
              suggestedAssetPath="/assets/logos/vi-logo.png"
              value={config.hero.image ?? ""}
              onChange={(value) => updateConfig({ ...config, hero: { ...config.hero, image: value } })}
            />
            <div className="form-grid">
              <label className="field-label">
                Alt text
                <input
                  type="text"
                  value={config.hero.altText}
                  onChange={(event) =>
                    updateConfig({ ...config, hero: { ...config.hero, altText: event.target.value } })
                  }
                />
              </label>
              <label className="field-label">
                Max height desktop
                <input
                  min={80}
                  type="number"
                  value={config.hero.maxHeightDesktop}
                  onChange={(event) =>
                    updateConfig({
                      ...config,
                      hero: { ...config.hero, maxHeightDesktop: Number(event.target.value) }
                    })
                  }
                />
              </label>
              <label className="field-label">
                Max height mobile
                <input
                  min={60}
                  type="number"
                  value={config.hero.maxHeightMobile}
                  onChange={(event) =>
                    updateConfig({
                      ...config,
                      hero: { ...config.hero, maxHeightMobile: Number(event.target.value) }
                    })
                  }
                />
              </label>
              <label className="field-label">
                Fit
                <select
                  value={config.hero.fit}
                  onChange={(event) =>
                    updateConfig({
                      ...config,
                      hero: { ...config.hero, fit: event.target.value as SiteConfig["hero"]["fit"] }
                    })
                  }
                >
                  <option value="contain">Contain</option>
                  <option value="cover">Cover</option>
                </select>
              </label>
              <label className="field-label">
                Position
                <select
                  value={config.hero.position}
                  onChange={(event) =>
                    updateConfig({
                      ...config,
                      hero: {
                        ...config.hero,
                        position: event.target.value as SiteConfig["hero"]["position"]
                      }
                    })
                  }
                >
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                </select>
              </label>
            </div>
          </section>
        ) : null}

        {activeTab === "background" ? (
          <section className="editor-section panel" aria-labelledby="background-settings-title">
            <div className="editor-section-header">
              <p className="editor-kicker">Background</p>
              <h2 id="background-settings-title">Image and overlay</h2>
            </div>
            <ImageSourcePicker
              label="Background image source"
              previewAlt="Background image preview"
              suggestedAssetPath="/assets/backgrounds/vice-bg.jpg"
              value={config.background.image ?? ""}
              onChange={(value) =>
                updateConfig({ ...config, background: { ...config.background, image: value } })
              }
            />
            <div className="form-grid">
              <label className="field-label">
                Fit
                <select
                  value={config.background.fit}
                  onChange={(event) =>
                    updateConfig({
                      ...config,
                      background: {
                        ...config.background,
                        fit: event.target.value as SiteConfig["background"]["fit"]
                      }
                    })
                  }
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                </select>
              </label>
              <label className="field-label">
                Position
                <input
                  placeholder="center"
                  type="text"
                  value={config.background.position}
                  onChange={(event) =>
                    updateConfig({
                      ...config,
                      background: { ...config.background, position: event.target.value }
                    })
                  }
                />
              </label>
              <label className="field-label">
                Overlay colour
                <input
                  type="text"
                  value={config.background.overlayColor}
                  onChange={(event) =>
                    updateConfig({
                      ...config,
                      background: { ...config.background, overlayColor: event.target.value }
                    })
                  }
                />
              </label>
              <label className="field-label">
                Overlay opacity
                <input
                  max={1}
                  min={0}
                  step={0.01}
                  type="range"
                  value={config.background.overlayOpacity}
                  onChange={(event) =>
                    updateConfig({
                      ...config,
                      background: { ...config.background, overlayOpacity: Number(event.target.value) }
                    })
                  }
                />
                <span className="range-value">{config.background.overlayOpacity.toFixed(2)}</span>
              </label>
              <label className="field-label">
                Blur
                <input
                  min={0}
                  step={1}
                  type="number"
                  value={config.background.blur}
                  onChange={(event) =>
                    updateConfig({
                      ...config,
                      background: { ...config.background, blur: Number(event.target.value) }
                    })
                  }
                />
              </label>
            </div>
          </section>
        ) : null}

        {activeTab === "theme" ? (
          <ThemeEditor
            theme={config.theme}
            onChange={(theme) => updateConfig({ ...config, theme })}
          />
        ) : null}

        {activeTab === "config" ? (
          <ConfigImportExport
            config={config}
            issues={issues}
            onClearDraft={clearDraft}
            onImport={setConfig}
            onResetToPublished={resetToPublished}
            onSaveDraft={saveDraftNow}
            onStatus={setStatus}
          />
        ) : null}

        {activeTab === "preview" ? (
          <section className="editor-section panel preview-section" aria-labelledby="preview-title">
            <div className="editor-section-header">
              <p className="editor-kicker">Preview</p>
              <h2 id="preview-title">Draft timeline preview</h2>
            </div>
            <TimelineBar config={config} previewLabel="Local draft preview" />
          </section>
        ) : null}
      </div>

      <ValidationSummary issues={issues} />
    </div>
  );
}
