import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { SiteConfig } from "../../types/config";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";

type PageShellProps = {
  children: ReactNode;
  config: SiteConfig;
};

type ShellStyle = CSSProperties & {
  "--background-position": string;
  "--background-fit": string;
  "--background-blur": string;
  "--background-scale": string;
  "--background-overlay-color": string;
  "--background-overlay-opacity": number;
  "--accent-pink": string;
  "--accent-cyan": string;
  "--text-strong": string;
  "--text-muted": string;
};

export function PageShell({ children, config }: PageShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isWidePage = location.pathname === "/editor";
  const isTimelinePage = location.pathname === "/";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const shellStyle: ShellStyle = {
    "--background-position": config.background.position,
    "--background-fit": config.background.fit,
    "--background-blur": `${config.background.blur}px`,
    "--background-scale": config.background.blur > 0 ? "1.03" : "1",
    "--background-overlay-color": config.background.overlayColor,
    "--background-overlay-opacity": config.background.overlayOpacity,
    "--accent-pink": config.theme.accentColor,
    "--accent-cyan": "#32d8ff",
    "--text-strong": config.theme.textColor,
    "--text-muted": config.theme.mutedTextColor
  };

  return (
    <div className="app-shell" style={shellStyle}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div
        aria-hidden="true"
        className="background-layer"
        style={{ backgroundImage: config.background.image ? `url("${config.background.image}")` : undefined }}
      />
      <div aria-hidden="true" className="background-overlay" />
      <button
        aria-controls="site-sidebar"
        aria-expanded={sidebarOpen}
        aria-label="Open navigation"
        className="menu-button"
        onClick={() => setSidebarOpen(true)}
        type="button"
      >
        <span className="menu-button-lines" />
      </button>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showGamesLink={config.navigation.showGamesLink}
      />
      <div className={`page-shell ${isTimelinePage ? "is-timeline-page" : ""}`}>
        <main
          className={`main-content ${isWidePage ? "is-wide" : ""} ${
            isTimelinePage ? "is-timeline" : ""
          }`}
          id="main-content"
        >
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
