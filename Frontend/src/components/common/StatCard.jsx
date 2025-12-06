import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }) => {
	return (
    <motion.div
            className='overflow-hidden rounded-xl border card'
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)" }}
    >
			<div className='px-4 py-5 sm:p-6'>
                <span className='flex items-center text-sm font-medium muted'>
					<Icon size={20} className='mr-2' style={{ color }} />
					{name}
				</span>
                <p className='mt-1 text-3xl font-semibold' style={{ color: "rgb(var(--text))" }}>{value}</p>
			</div>
		</motion.div>
	);
};

export default StatCard;
