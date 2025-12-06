import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useFilters } from "../../context/FilterContext";

const categoryData = [
	{ name: "Electronics", value: 4500 },
	{ name: "Clothing", value: 3200 },
	{ name: "Home & Garden", value: 2800 },
	{ name: "Books", value: 2100 },
	{ name: "Sports & Outdoors", value: 1900 },
];

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const CategoryDistributionChart = () => {
    const { selectedCategory, setSelectedCategory } = useFilters();
	return (
        <motion.div
            className='rounded-xl p-6 border card'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
            <h2 className='text-lg font-medium mb-4' style={{ color: "rgb(var(--text))" }}>Category Distribution</h2>
			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<PieChart>
                        <Pie
							data={categoryData}
							cx={"50%"}
							cy={"50%"}
							labelLine={false}
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {categoryData.map((entry, index) => {
                                const isActive = selectedCategory === entry.name;
                                const base = COLORS[index % COLORS.length];
                                const fill = isActive ? base : `${base}55`;
                                return (
                                    <Cell key={`cell-${index}`} fill={fill} onClick={() => setSelectedCategory(entry.name)} cursor="pointer" />
                                );
                            })}
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
export default CategoryDistributionChart;
