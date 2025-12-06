import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const userRetentionData = [
	{ name: "Week 1", retention: 100 },
	{ name: "Week 2", retention: 75 },
	{ name: "Week 3", retention: 60 },
	{ name: "Week 4", retention: 50 },
	{ name: "Week 5", retention: 45 },
	{ name: "Week 6", retention: 40 },
	{ name: "Week 7", retention: 38 },
	{ name: "Week 8", retention: 35 },
];

const UserRetention = () => {
	return (
		<motion.div
			className='card p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
		>
			<h2 className='text-xl font-semibold mb-4' style={{ color: "rgb(var(--text))" }}>User Retention</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={userRetentionData}>
						<CartesianGrid strokeDasharray='3 3' stroke='rgba(156,163,175,0.3)' />
						<XAxis dataKey='name' stroke='rgb(var(--muted))' tick={{ fill: 'rgb(var(--text))' }} />
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
							dataKey='retention' 
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
export default UserRetention;