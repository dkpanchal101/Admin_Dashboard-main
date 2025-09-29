import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const dailySalesData = [
  { name: "Mon", sales: 3200 },
  { name: "Tue", sales: 4000 },
  { name: "Wed", sales: 3600 },
  { name: "Thu", sales: 4300 },
  { name: "Fri", sales: 5000 },
  { name: "Sat", sales: 6200 },
  { name: "Sun", sales: 5800 },
];

const DailySalesTrend = () => {
  return (
    <motion.div
      className="rounded-xl p-6 border card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold mb-4" style={{ color: "rgb(var(--text))" }}>Daily Sales Trend</h2>

      <div className="w-full h-72">
        <ResponsiveContainer>
          <BarChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.3)" />
            <XAxis dataKey="name" stroke="rgb(var(--muted))" />
            <YAxis stroke="rgb(var(--muted))" />
            <Tooltip
              contentStyle={{ backgroundColor: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}
              itemStyle={{ color: "rgb(var(--text))" }}
            />
            <Bar dataKey="sales" fill="rgb(var(--accent))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailySalesTrend;
