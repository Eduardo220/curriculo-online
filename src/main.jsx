import React from "react";
import ReactDOM from "react-dom/client";
import "lenis/dist/lenis.css";
import App from "./App.jsx";
import "./styles/global.css";
import "./styles/tokens.css";
import "./styles/reset.css";
import "./styles/layout.css";
import "./styles/effects/effects.css";
import "./styles/components/header.css";
import "./styles/sections/hero.css";
import "./styles/components/footer.css";
import "./styles/responsive.css";
import "./styles/sections/content.css";
import "./styles/wayper/wayper.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
