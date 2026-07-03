import { NavLink } from "react-router-dom";

type SidebarProps = {
  isOpen: boolean;
  showGamesLink: boolean;
  onClose: () => void;
};

const navigationItems = [
  { label: "Timeline", to: "/", group: "main" },
  { label: "Minigames", to: "/games", group: "games" },
  { label: "Privacy Policy", to: "/privacy", group: "main" }
];

export function Sidebar({ isOpen, showGamesLink, onClose }: SidebarProps) {
  const visibleItems = navigationItems.filter((item) => {
    if (item.group === "games") {
      return showGamesLink;
    }

    return true;
  });

  return (
    <>
      <button
        aria-label="Close navigation"
        className={`sidebar-backdrop ${isOpen ? "is-open" : ""}`}
        onClick={onClose}
        type="button"
      />
      <aside
        aria-label="Site navigation"
        aria-hidden={!isOpen}
        className={`sidebar ${isOpen ? "is-open" : ""}`}
        id="site-sidebar"
      >
        <div className="sidebar-header">
          <p className="sidebar-title">Road to VI</p>
          <button className="icon-button" type="button" aria-label="Close navigation" onClick={onClose}>
            X
          </button>
        </div>
        <nav className="sidebar-nav">
          {visibleItems.map((item) => (
            <NavLink
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              end={item.to === "/"}
              key={item.to}
              onClick={onClose}
              to={item.to}
            >
              <span>{item.label}</span>
              <span aria-hidden="true">/</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
