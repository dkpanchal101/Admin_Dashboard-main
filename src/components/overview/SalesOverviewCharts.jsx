import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const salesData = [
	{ name: "Jul", sales: 4200 },
	{ name: "Aug", sales: 3800 },
	{ name: "Sep", sales: 5100 },
	{ name: "Oct", sales: 4600 },
	{ name: "Nov", sales: 5400 },
	{ name: "Dec", sales: 7200 },
	{ name: "Jan", sales: 6100 },
	{ name: "Feb", sales: 5900 },
	{ name: "Mar", sales: 6800 },
	{ name: "Apr", sales: 6300 },
	{ name: "May", sales: 7100 },
	{ name: "Jun", sales: 7500 },
];

const SalesOverviewChart = () => {
	return (
        <motion.div
            className='rounded-xl p-6 border card'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
            <h2 className='text-lg font-medium mb-4' style={{ color: "rgb(var(--text))" }}>Sales Overview</h2>

			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='rgba(156,163,175,0.3)' />
                        <XAxis dataKey={"name"} stroke='rgb(var(--muted))' />
                        <YAxis stroke='rgb(var(--muted))' />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgb(var(--card))",
                                borderColor: "rgb(var(--border))",
                            }}
                            itemStyle={{ color: "rgb(var(--text))" }}
                        />
                        <Line
                            type='monotone'
                            dataKey='sales'
                            stroke='rgb(var(--brand))'
                            strokeWidth={3}
                            dot={{ fill: "rgb(var(--brand))", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, strokeWidth: 2 }}
                        />
                    </LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default SalesOverviewChart;