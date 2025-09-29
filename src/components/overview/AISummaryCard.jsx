import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { useFilters } from "../../context/FilterContext";

const sampleInsights = [
    "Revenue trending upward over the last 4 weeks.",
    "Mobile App channel shows strongest momentum.",
    "Electronics category outperformed site average by 12%.",
    "Low stock items are impacting potential sales in Home category.",
];

const AISummaryCard = () => {
    const { selectedCategory, selectedChannel } = useFilters();

    const summary = useMemo(() => {
        const parts = [];
        if (selectedChannel) parts.push(`Channel ${selectedChannel} is showing elevated engagement.`);
        if (selectedCategory) parts.push(`Category ${selectedCategory} conversion improved versus baseline.`);
        const generic = sampleInsights[Math.floor(Math.random() * sampleInsights.length)];
        return [generic, ...parts].join(" ");
    }, [selectedCategory, selectedChannel]);

    return (
        <div className='card p-4 flex items-start gap-3'>
            <div className='rounded-md p-2' style={{ backgroundColor: "rgba(99,102,241,0.15)", color: "rgb(var(--brand-strong))" }}>
                <Sparkles size={18} />
            </div>
            <div className='flex-1'>
                <div className='text-sm muted mb-1'>AI Summary</div>
                <div style={{ color: "rgb(var(--text))" }}>{summary}</div>
            </div>
        </div>
    );
};

export default AISummaryCard;


