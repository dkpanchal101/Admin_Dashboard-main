import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

const productPerformanceData = [
	{ name: "Product A", sales: 4000, revenue: 2400, profit: 2400 },
	{ name: "Product B", sales: 3000, revenue: 1398, profit: 2210 },
	{ name: "Product C", sales: 2000, revenue: 9800, profit: 2290 },
	{ name: "Product D", sales: 2780, revenue: 3908, profit: 2000 },
	{ name: "Product E", sales: 1890, revenue: 4800, profit: 2181 },
];

const ProductPerformance = () => {
	return (
		<motion.div
			className='card p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-xl font-semibold mb-4' style={{ color: "rgb(var(--text))" }}>Product Performance</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<BarChart data={productPerformanceData}>
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
						<Bar dataKey='sales' fill='#8B5CF6' />
						<Bar dataKey='revenue' fill='#10B981' />
						<Bar dataKey='profit' fill='#F59E0B' />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default ProductPerformance;