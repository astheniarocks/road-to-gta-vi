import { useState } from "react";
import type { SiteConfig, ValidationIssue } from "../../types/config";
import { downloadTextFile } from "../../utils/assetHelpers";
import { hasBlockingIssues } from "../../utils/configValidation";
import { normalizeConfig } from "../../utils/configNormalization";

type ConfigImportExportProps = {
  config: SiteConfig;
  issues: ValidationIssue[];
  onClearDraft: () => void;
  onImport: (config: SiteConfig) => void;
  onResetToPublished: () => void;
  onSaveDraft: () => void;
  onStatus: (message: string) => void;
};

function configToTypeScript(config: SiteConfig): string {
  return `import type { SiteConfig } from "../types/config";

export const siteConfig: SiteConfig = ${JSON.stringify(config, null, 2)};

export default siteConfig;
`;
}

async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return copied;
}

export function ConfigImportExport({
  config,
  issues,
  onClearDraft,
  onImport,
  onResetToPublished,
  onSaveDraft,
  onStatus
}: ConfigImportExportProps) {
  const [importText, setImportText] = useState("");
  const hasErrors = hasBlockingIssues(issues);

  function guardExport(action: () => void) {
    if (hasErrors) {
      onStatus("Fix validation errors before exporting.");
      return;
    }

    action();
  }

  function importJson(text: string) {
    try {
      const parsed = normalizeConfig(JSON.parse(text), config);
      onImport(parsed);
      onStatus("Imported config into the local editor draft.");
    } catch {
      onStatus("That JSON could not be imported. Check the formatting and try again.");
    }
  }

  return (
    <section className="editor-section panel" aria-labelledby="config-tools-title">
      <div className="editor-section-header">
        <p className="editor-kicker">Config tools</p>
        <h2 id="config-tools-title">Import, export, and draft controls</h2>
      </div>

      <div className="button-grid">
        <button className="button primary" type="button" onClick={onSaveDraft}>
          Save draft locally
        </button>
        <button
          className="button"
          type="button"
          onClick={() =>
            guardExport(() => {
              downloadTextFile("road-to-vi-config.json", JSON.stringify(config, null, 2));
              onStatus("Downloaded JSON config.");
            })
          }
        >
          Export JSON
        </button>
        <button
          className="button"
          type="button"
          onClick={() =>
            guardExport(async () => {
              const copied = await copyText(JSON.stringify(config, null, 2));
              onStatus(copied ? "Copied JSON config." : "Could not copy JSON config.");
            })
          }
        >
          Copy JSON
        </button>
        <button
          className="button"
          type="button"
          onClick={() =>
            guardExport(async () => {
              const copied = await copyText(configToTypeScript(config));
              onStatus(copied ? "Copied TypeScript config." : "Could not copy TypeScript config.");
            })
          }
        >
          Copy config as TypeScript
        </button>
        <button className="button" type="button" onClick={onResetToPublished}>
          Reset to published config
        </button>
        <button className="button danger" type="button" onClick={onClearDraft}>
          Clear local draft
        </button>
      </div>

      <div className="import-box">
        <label className="field-label">
          Import JSON config
          <textarea
            placeholder="Paste exported JSON here"
            rows={8}
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
          />
        </label>
        <div className="button-row">
          <label className="button file-button">
            Choose JSON file
            <input
              accept="application/json,.json"
              type="file"
              onChange={async (event) => {
                const file = event.target.files?.[0];

                if (!file) {
                  return;
                }

                const text = await file.text();
                setImportText(text);
                importJson(text);
              }}
            />
          </label>
          <button
            className="button"
            disabled={!importText.trim()}
            type="button"
            onClick={() => importJson(importText)}
          >
            Import pasted JSON
          </button>
        </div>
      </div>
    </section>
  );
}
