import { siteConfig } from "./siteConfig";
import type { SiteConfig } from "../types/config";

export function cloneConfig(config: SiteConfig = siteConfig): SiteConfig {
  return JSON.parse(JSON.stringify(config)) as SiteConfig;
}

export const defaultConfig = cloneConfig(siteConfig);
