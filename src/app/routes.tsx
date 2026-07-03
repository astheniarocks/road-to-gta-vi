import { Navigate, Route, Routes } from "react-router-dom";
import { TimelinePage } from "../pages/TimelinePage";
import { EditorPage } from "../pages/EditorPage";
import { PrivacyPage } from "../pages/PrivacyPage";
import { GamesPage } from "../pages/GamesPage";
import { BowlingPage } from "../pages/BowlingPage";

const editorEnabled = import.meta.env.VITE_ENABLE_EDITOR !== "false";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TimelinePage />} />
      <Route path="/editor" element={editorEnabled ? <EditorPage /> : <Navigate replace to="/" />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="/games/bowling" element={<BowlingPage />} />
    </Routes>
  );
}
