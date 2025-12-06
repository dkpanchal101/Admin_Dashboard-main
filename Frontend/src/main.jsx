import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { FilterProvider } from "./context/FilterContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ErrorBoundary>
            <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || '/'}>
                <AuthProvider>
                    <ToastProvider>
                        <FilterProvider>
                            <App />
                        </FilterProvider>
                    </ToastProvider>
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>
);
