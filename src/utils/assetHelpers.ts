export function isLocalPreviewReference(value?: string): boolean {
  if (!value) {
    return false;
  }

  return value.startsWith("blob:") || value.startsWith("data:") || value.startsWith("file:");
}

export function isEmptyAssetPath(value?: string): boolean {
  return typeof value === "string" && value.trim().length === 0;
}

export function imagePositionToObjectPosition(position: string): string {
  if (position === "top" || position === "bottom" || position === "center") {
    return position;
  }

  return position.trim() || "center";
}

export function downloadTextFile(filename: string, content: string, type = "application/json"): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
