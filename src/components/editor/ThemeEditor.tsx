import type { SiteConfig } from "../../types/config";

type ThemeEditorProps = {
  theme: SiteConfig["theme"];
  onChange: (theme: SiteConfig["theme"]) => void;
};

const themeFields: Array<{ key: keyof SiteConfig["theme"]; label: string }> = [
  { key: "accentColor", label: "Accent colour" },
  { key: "barTrackColor", label: "Loading bar track colour" },
  { key: "barFillColor", label: "Loading bar fill colour" },
  { key: "textColor", label: "Text colour" },
  { key: "mutedTextColor", label: "Muted text colour" },
  { key: "cardBackground", label: "Card background" },
  { key: "cardBorder", label: "Card border" }
];

function isHexColour(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function ThemeEditor({ theme, onChange }: ThemeEditorProps) {
  function updateField(key: keyof SiteConfig["theme"], value: string) {
    onChange({ ...theme, [key]: value });
  }

  return (
    <section className="editor-section panel" aria-labelledby="theme-settings-title">
      <div className="editor-section-header">
        <p className="editor-kicker">Theme</p>
        <h2 id="theme-settings-title">Colours</h2>
      </div>
      <div className="theme-grid">
        {themeFields.map((field) => (
          <label className="field-label theme-field" key={field.key}>
            {field.label}
            <span className="theme-field-row">
              <span
                aria-hidden="true"
                className="colour-swatch"
                style={{ background: theme[field.key] }}
              />
              <input
                type="text"
                value={theme[field.key]}
                onChange={(event) => updateField(field.key, event.target.value)}
              />
              {isHexColour(theme[field.key]) ? (
                <input
                  aria-label={`${field.label} colour picker`}
                  className="native-colour-input"
                  type="color"
                  value={theme[field.key]}
                  onChange={(event) => updateField(field.key, event.target.value)}
                />
              ) : null}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
