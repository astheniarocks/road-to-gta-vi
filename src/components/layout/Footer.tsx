import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="site-footer">
      <span>Dreamfield Industries</span>
      <Link to="/privacy">Privacy Policy</Link>
    </footer>
  );
}
