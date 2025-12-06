import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const dailyOrdersData = [
	{ date: "07/01", orders: 45 },
	{ date: "07/02", orders: 52 },
	{ date: "07/03", orders: 49 },
	{ date: "07/04", orders: 60 },
	{ date: "07/05", orders: 55 },
	{ date: "07/06", orders: 58 },
	{ date: "07/07", orders: 62 },
];

const DailyOrders = () => {
	return (
		<motion.div
			className='card p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-xl font-semibold mb-4' style={{ color: "rgb(var(--text))" }}>Daily Orders</h2>

			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={dailyOrdersData}>
						<CartesianGrid strokeDasharray='3 3' stroke='rgba(156,163,175,0.3)' />
						<XAxis dataKey='date' stroke='rgb(var(--muted))' tick={{ fill: 'rgb(var(--text))' }} />
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
						<Line 
							type='monotone' 
							dataKey='orders' 
							stroke='#8B5CF6' 
							strokeWidth={2}
							dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
							activeDot={{ r: 6 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default DailyOrders;
