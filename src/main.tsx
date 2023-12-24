import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

async function enableMocking() {
  if (process.env.NODE_ENV !== "mock") {
    return;
  }
  const { worker } = await import("../mock/browser");
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
