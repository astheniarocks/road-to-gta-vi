import type { CSSProperties } from "react";
import { TimelineBar } from "../components/timeline/TimelineBar";
import { siteConfig } from "../data/siteConfig";
import { imagePositionToObjectPosition } from "../utils/assetHelpers";

export function TimelinePage() {
  const heroStyle = {
    "--hero-max-height-desktop": `${siteConfig.hero.maxHeightDesktop}px`,
    "--hero-max-height-mobile": `${siteConfig.hero.maxHeightMobile}px`,
    objectFit: siteConfig.hero.fit,
    objectPosition: imagePositionToObjectPosition(siteConfig.hero.position)
  } as CSSProperties;

  return (
    <div className="timeline-page">
      <header className="timeline-hero">
        {siteConfig.hero.image ? (
          <img
            alt={siteConfig.hero.altText}
            className="hero-image"
            src={siteConfig.hero.image}
            style={heroStyle}
          />
        ) : (
          <div className="hero-placeholder">
            <p>Road to VI</p>
          </div>
        )}
      </header>
      <TimelineBar config={siteConfig} />
      <p className="fan-disclaimer">
        This is an unofficial fan-made project. Grand Theft Auto, GTA, GTA VI, Rockstar Games and
        related marks are the property of their respective owners.
      </p>
    </div>
  );
}
