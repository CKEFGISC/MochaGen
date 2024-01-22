// import node modules
import React from "react";
import ReactDOM from "react-dom/client";
import {NextUIProvider} from "@nextui-org/react";
import "bootstrap/dist/css/bootstrap.min.css";

// import main style
// import "./index.css";

// import page sections
// import Header from "./header/Header";
import App from "./App";
// import Footer from "./footer/Footer";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="mocha text-foreground bg-background">
        <App />
      </main>
    </NextUIProvider>
  </React.StrictMode>
);
