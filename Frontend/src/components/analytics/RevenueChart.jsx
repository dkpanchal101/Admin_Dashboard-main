import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const revenueData = [
	{ month: "Jan", revenue: 4000, target: 3800 },
	{ month: "Feb", revenue: 3000, target: 3200 },
	{ month: "Mar", revenue: 5000, target: 4500 },
	{ month: "Apr", revenue: 4500, target: 4200 },
	{ month: "May", revenue: 6000, target: 5500 },
	{ month: "Jun", revenue: 5500, target: 5800 },
	{ month: "Jul", revenue: 7000, target: 6500 },
];

const RevenueChart = () => {
	const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");

	return (
		<motion.div
			className='card p-6 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold' style={{ color: "rgb(var(--text))" }}>Revenue vs Target</h2>
				<select
					className='px-3 py-1 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
					style={{ 
						backgroundColor: "rgb(var(--bg))", 
						color: "rgb(var(--text))", 
						borderColor: "rgb(var(--border))" 
					}}
					value={selectedTimeRange}
					onChange={(e) => setSelectedTimeRange(e.target.value)}
				>
					<option>This Week</option>
					<option>This Month</option>
					<option>This Quarter</option>
					<option>This Year</option>
				</select>
			</div>

			<div style={{ width: "100%", height: 400 }}>
				<ResponsiveContainer>
					<AreaChart data={revenueData}>
						<CartesianGrid strokeDasharray='3 3' stroke='rgba(156,163,175,0.3)' />
						<XAxis dataKey='month' stroke='rgb(var(--muted))' tick={{ fill: 'rgb(var(--text))' }} />
						<YAxis stroke='rgb(var(--muted))' tick={{ fill: 'rgb(var(--text))' }} />
						<Tooltip
							contentStyle={{ 
								backgroundColor: "rgb(var(--card))", 
								borderColor: "rgb(var(--border))",
								boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
							}}
							itemStyle={{ color: "rgb(var(--text))" }}
							labelStyle={{ color: "rgb(var(--text))" }}
						/>
						<Legend wrapperStyle={{ color: "rgb(var(--text))" }} />
						<Area type='monotone' dataKey='revenue' stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.3} />
						<Area type='monotone' dataKey='target' stroke='#10B981' fill='#10B981' fillOpacity={0.3} />
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default RevenueChart;