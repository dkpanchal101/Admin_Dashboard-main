import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { useFilters } from "../../context/FilterContext";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const SALES_CHANNEL_DATA = [
	{ name: "Website", value: 45600 },
	{ name: "Mobile App", value: 38200 },
	{ name: "Marketplace", value: 29800 },
	{ name: "Social Media", value: 18700 },
];

const SalesChannelChart = () => {
    const { selectedChannel, setSelectedChannel } = useFilters();
	return (
        <motion.div
            className='rounded-xl p-6 lg:col-span-2 border card'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
            <h2 className='text-lg font-medium mb-4' style={{ color: "rgb(var(--text))" }}>Sales by Channel</h2>

			<div className='h-80'>
				<ResponsiveContainer>
                    <BarChart data={SALES_CHANNEL_DATA}>
                        <CartesianGrid strokeDasharray='3 3' stroke='rgba(156,163,175,0.3)' />
                        <XAxis dataKey='name' stroke='rgb(var(--muted))' />
                        <YAxis stroke='rgb(var(--muted))' />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgb(var(--card))",
                                borderColor: "rgb(var(--border))",
                            }}
                            itemStyle={{ color: "rgb(var(--text))" }}
                        />
						<Legend />
                        <Bar dataKey={"value"} onClick={(data) => setSelectedChannel(data.name)} cursor="pointer">
                            {SALES_CHANNEL_DATA.map((entry, index) => {
                                const isActive = selectedChannel === entry.name;
                                const base = COLORS[index % COLORS.length];
                                const fill = isActive ? base : `${base}55`;
                                return (
                                    <Cell key={`cell-${index}`} fill={fill} />
                                );
                            })}
                        </Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default SalesChannelChart;
