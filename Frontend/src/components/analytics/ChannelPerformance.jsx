import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const channelData = [
	{ name: "Organic Search", value: 4000 },
	{ name: "Paid Search", value: 3000 },
	{ name: "Direct", value: 2000 },
	{ name: "Social Media", value: 2780 },
	{ name: "Referral", value: 1890 },
	{ name: "Email", value: 2390 },
];
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];

const ChannelPerformance = () => {
	return (
		<motion.div
			className='card p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-xl font-semibold mb-4' style={{ color: "rgb(var(--text))" }}>Channel Performance</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={channelData}
							cx='50%'
							cy='50%'
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
							labelLine={{ stroke: 'rgb(var(--text))', strokeWidth: 1 }}
						>
							{channelData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
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
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default ChannelPerformance;