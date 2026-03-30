import { useState } from "react";
import Editor from "./pages/Editor";
import Home from "./pages/Home";

export type AppView = "home" | "editor";

export default function App() {
  const [view, setView] = useState<AppView>("home");
  return view === "home" ? (
    <Home onOpenEditor={() => setView("editor")} />
  ) : (
    <Editor onGoHome={() => setView("home")} />
  );
}
