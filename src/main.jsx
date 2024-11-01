import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";
import "./style/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "./context/StoreContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
