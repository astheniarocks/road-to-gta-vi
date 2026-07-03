import { AppRoutes } from "./routes";
import { PageShell } from "../components/layout/PageShell";
import { siteConfig } from "../data/siteConfig";

export default function App() {
  return (
    <PageShell config={siteConfig}>
      <AppRoutes />
    </PageShell>
  );
}
