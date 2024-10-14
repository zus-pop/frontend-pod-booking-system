import { StoreContext } from "./context/StoreContext";
import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";
import "./style/index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
    <StoreContext>
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </React.StrictMode>
    </StoreContext>
);
