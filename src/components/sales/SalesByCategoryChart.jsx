import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const salesByCategory = [
  { name: "Electronics", value: 6500 },
  { name: "Clothing", value: 4800 },
  { name: "Home & Garden", value: 3200 },
  { name: "Books", value: 2100 },
  { name: "Others", value: 1800 },
];

const COLORS = ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

const SalesByCategoryChart = () => {
  return (
    <motion.div
      className="rounded-xl p-6 border card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4" style={{ color: "rgb(var(--text))" }}>Sales by Category</h2>

      <div className="w-full h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={salesByCategory}
              cx="50%"
              cy="50%"
              outerRadius={85}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {salesByCategory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}
              itemStyle={{ color: "rgb(var(--text))" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesByCategoryChart;
