import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { FilterProvider } from "./context/FilterContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter basename="/Admin_Dashboard">
            <FilterProvider>
                <App />
            </FilterProvider>
        </BrowserRouter>
    </React.StrictMode>
);
