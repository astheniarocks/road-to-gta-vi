// @ts-nocheck
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const configDirectory = dirname(fileURLToPath(import.meta.url));

const imageExtensions = new Set([".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);

function collectImageAssets(directory: string, root = directory): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return collectImageAssets(fullPath, root);
    }

    const extension = entry.slice(entry.lastIndexOf(".")).toLowerCase();

    if (!imageExtensions.has(extension)) {
      return [];
    }

    return [`/assets/${relative(root, fullPath).split(sep).join("/")}`];
  });
}

function imageAssetManifestPlugin() {
  const virtualId = "virtual:image-assets";
  const resolvedVirtualId = `\0${virtualId}`;

  return {
    name: "image-asset-manifest",
    resolveId(id: string) {
      return id === virtualId ? resolvedVirtualId : null;
    },
    load(id: string) {
      if (id !== resolvedVirtualId) {
        return null;
      }

      const assets = collectImageAssets(join(configDirectory, "public", "assets")).sort((first, second) =>
        first.localeCompare(second)
      );

      return `export default ${JSON.stringify(assets)};`;
    }
  };
}

export default defineConfig({
  plugins: [react(), imageAssetManifestPlugin()],
  build: {
    sourcemap: true
  }
});
