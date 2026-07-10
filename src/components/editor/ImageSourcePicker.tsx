import { useMemo, useState } from "react";
import { imageAssetOptions } from "../../data/assetManifest";

type ImageSourcePickerProps = {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  previewAlt: string;
  suggestedAssetPath: string;
};

type ImageSourceType = "asset" | "url" | "local-preview";

function inferSourceType(value?: string): ImageSourceType {
  if (!value) {
    return "asset";
  }

  if (value.startsWith("blob:") || value.startsWith("data:") || value.startsWith("file:")) {
    return "local-preview";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return "url";
  }

  return "asset";
}

export function ImageSourcePicker({
  label,
  value,
  onChange,
  previewAlt,
  suggestedAssetPath
}: ImageSourcePickerProps) {
  const [sourceType, setSourceType] = useState<ImageSourceType>(() => inferSourceType(value));
  const [localFileName, setLocalFileName] = useState("");
  const helperText = useMemo(() => {
    if (sourceType === "asset") {
      return `Use a committed public path such as ${suggestedAssetPath}.`;
    }

    if (sourceType === "url") {
      return "External image URLs can work, but committed assets are safer for publishing.";
    }

    return "This image is currently a local browser preview. To publish it, add the image file to public/assets and update the config to use its asset path.";
  }, [sourceType, suggestedAssetPath]);

  return (
    <div className="image-source-picker">
      <label className="field-label">
        {label}
        <select
          value={sourceType}
          onChange={(event) => setSourceType(event.target.value as ImageSourceType)}
        >
          <option value="asset">Public asset path</option>
          <option value="url">External URL</option>
          <option value="local-preview">Local upload preview</option>
        </select>
      </label>

      {sourceType === "local-preview" ? (
        <label className="field-label">
          Local image file
          <input
            accept="image/*"
            type="file"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (!file) {
                return;
              }

              const previewUrl = URL.createObjectURL(file);
              setLocalFileName(file.name);
              onChange(previewUrl);
            }}
          />
        </label>
      ) : (
        <>
          {sourceType === "asset" && imageAssetOptions.length ? (
            <label className="field-label">
              Committed asset
              <select
                value={imageAssetOptions.some((option) => option.path === value) ? value : ""}
                onChange={(event) => {
                  if (event.target.value) {
                    onChange(event.target.value);
                  }
                }}
              >
                <option value="">Choose an image...</option>
                {imageAssetOptions.map((option) => (
                  <option key={option.path} value={option.path}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="field-label">
            {sourceType === "asset" ? "Asset path" : "Image URL"}
            <input
              placeholder={sourceType === "asset" ? suggestedAssetPath : "https://example.com/image.jpg"}
              type="text"
              value={value ?? ""}
              onChange={(event) => onChange(event.target.value)}
            />
          </label>
        </>
      )}

      <p className={`field-help ${sourceType === "local-preview" ? "warning-text" : ""}`}>
        {helperText}
        {localFileName ? ` Selected file: ${localFileName}.` : ""}
      </p>

      {value ? (
        <div className="image-preview">
          <img alt={previewAlt} src={value} />
        </div>
      ) : null}
    </div>
  );
}
