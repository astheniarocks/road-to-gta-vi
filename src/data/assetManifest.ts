import imageAssetPaths from "virtual:image-assets";

export type ImageAssetOption = {
  label: string;
  path: string;
};

function toLabel(path: string): string {
  const parts = path.split("/");
  const fileName = parts[parts.length - 1] ?? path;
  const folderName = parts[parts.length - 2];
  const readableName = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());

  return folderName ? `${folderName} / ${readableName}` : readableName;
}

export const imageAssetOptions: ImageAssetOption[] = imageAssetPaths.map((path) => ({
    label: toLabel(path),
    path
  }));
