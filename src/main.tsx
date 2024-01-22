// import node modules
import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";

// import main style
import "./index.css";
import "@radix-ui/themes/styles.css";

// import page sections
import App from "./App";
import { Theme } from "@radix-ui/themes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Theme
      appearance="light"
      accentColor="bronze"
      grayColor="sand"
      radius="full"
      scaling="110%"
    >
      <App />
    </Theme>
  </React.StrictMode>
);
