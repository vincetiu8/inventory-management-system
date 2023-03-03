import React from "react";
import ReactDOM from "react-dom/client";
import { CssVarsProvider } from "@mui/joy";
import App from "./App";
import theme from "./Assets/theme";
import "react-vis/dist/style.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <App />
    </CssVarsProvider>
  </React.StrictMode>
);
