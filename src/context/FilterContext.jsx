import { createContext, useContext, useMemo, useState } from "react";

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [dateRange, setDateRange] = useState({ preset: "last_90_days" });

    const value = useMemo(() => ({
        selectedCategory,
        setSelectedCategory,
        selectedChannel,
        setSelectedChannel,
        dateRange,
        setDateRange,
        clearFilters: () => { setSelectedCategory(null); setSelectedChannel(null); },
    }), [selectedCategory, selectedChannel, dateRange]);

    return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilters = () => {
    const ctx = useContext(FilterContext);
    if (!ctx) throw new Error("useFilters must be used within FilterProvider");
    return ctx;
};


