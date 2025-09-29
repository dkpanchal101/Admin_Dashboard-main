import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const salesData = [
	{ month: "Jan", sales: 4000 },
	{ month: "Feb", sales: 3000 },
	{ month: "Mar", sales: 5000 },
	{ month: "Apr", sales: 4500 },
	{ month: "May", sales: 6000 },
	{ month: "Jun", sales: 5500 },
];

const SalesTrendChart = () => {
	return (
    <motion.div
            className='rounded-xl p-6 border card '
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
            <h2 className='text-xl font-semibold mb-4' style={{ color: "rgb(var(--text))" }}>Sales Trend</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
                    <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='rgba(156,163,175,0.3)' />
                        <XAxis dataKey='month' stroke='rgb(var(--muted))' />
                        <YAxis stroke='rgb(var(--muted))' />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgb(var(--card))",
                                borderColor: "rgb(var(--border))",
                            }}
                            itemStyle={{ color: "rgb(var(--text))" }}
                        />
						<Legend />
                        <Line type='monotone' dataKey='sales' stroke='rgb(var(--brand))' strokeWidth={2} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default SalesTrendChart;