import "./global.css";
import { createRoot } from "react-dom/client";
import { AppProviders } from "./providers/AppProviders";
import { AppRouter } from "./router/AppRouter";

const App = () => (
  <AppProviders>
    <AppRouter />
  </AppProviders>
);

createRoot(document.getElementById("root")!).render(<App />);
