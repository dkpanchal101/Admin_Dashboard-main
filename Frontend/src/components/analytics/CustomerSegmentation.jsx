import { motion } from "framer-motion";
import {
	ResponsiveContainer,
	Radar,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Legend,
	Tooltip,
} from "recharts";

const customerSegmentationData = [
	{ subject: "Engagement", A: 120, B: 110, fullMark: 150 },
	{ subject: "Loyalty", A: 98, B: 130, fullMark: 150 },
	{ subject: "Satisfaction", A: 86, B: 130, fullMark: 150 },
	{ subject: "Spend", A: 99, B: 100, fullMark: 150 },
	{ subject: "Frequency", A: 85, B: 90, fullMark: 150 },
	{ subject: "Recency", A: 65, B: 85, fullMark: 150 },
];

const CustomerSegmentation = () => {
	return (
		<motion.div
			className='card p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.6 }}
		>
			<h2 className='text-xl font-semibold mb-4' style={{ color: "rgb(var(--text))" }}>Customer Segmentation</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<RadarChart cx='50%' cy='50%' outerRadius='80%' data={customerSegmentationData}>
						<PolarGrid stroke='rgba(156,163,175,0.3)' />
						<PolarAngleAxis dataKey='subject' stroke='rgb(var(--muted))' tick={{ fill: 'rgb(var(--text))' }} />
						<PolarRadiusAxis angle={30} domain={[0, 150]} stroke='rgb(var(--muted))' tick={{ fill: 'rgb(var(--text))' }} />
						<Radar name='Segment A' dataKey='A' stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.6} />
						<Radar name='Segment B' dataKey='B' stroke='#10B981' fill='#10B981' fillOpacity={0.6} />
						<Legend wrapperStyle={{ color: "rgb(var(--text))" }} />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgb(var(--card))",
								borderColor: "rgb(var(--border))",
								boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
							}}
							itemStyle={{ color: "rgb(var(--text))" }}
							labelStyle={{ color: "rgb(var(--text))" }}
						/>
					</RadarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default CustomerSegmentation;