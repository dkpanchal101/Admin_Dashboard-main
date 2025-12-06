import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";
import { getOrders } from "../lib/mockApi";
import { useToast } from "../context/ToastContext";
import { SkeletonStatCard } from "../components/common/LoadingSkeleton";

const OrdersPage = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [page, setPage] = useState(1);
	const [pagination, setPagination] = useState(null);
	const [stats, setStats] = useState(null);
	const { error: showError } = useToast();

	const loadOrders = async (pageNum = page) => {
		setLoading(true);
		setError("");
		try {
			const response = await getOrders(pageNum, 20);
			setOrders(response.data);
			setPagination({
				page: response.page,
				limit: response.limit,
				total: response.total,
				totalPages: response.totalPages
			});
			
			// Calculate stats
			const totalRevenue = response.data.reduce((sum, o) => sum + o.total, 0);
			const pendingOrders = response.data.filter(o => o.status === "Pending").length;
			const completedOrders = response.data.filter(o => o.status === "Delivered").length;
			
			setStats({
				totalOrders: response.total,
				pendingOrders,
				completedOrders,
				totalRevenue: totalRevenue.toFixed(2)
			});
		} catch (e) {
			const errorMsg = e.message || "Failed to load orders";
			setError(errorMsg);
			showError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadOrders();
	}, []);

	const handlePageChange = (newPage) => {
		setPage(newPage);
		loadOrders(newPage);
	};

	return (
		<div className='flex-1 relative z-10 overflow-auto'>
			<Header title={"Orders"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{loading && !stats ? (
					<motion.div
						className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
						<SkeletonStatCard />
						<SkeletonStatCard />
						<SkeletonStatCard />
						<SkeletonStatCard />
					</motion.div>
				) : stats ? (
					<motion.div
						className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
						<StatCard name='Total Orders' icon={ShoppingBag} value={stats.totalOrders.toLocaleString()} color='#6366F1' />
						<StatCard name='Pending Orders' icon={Clock} value={stats.pendingOrders} color='#F59E0B' />
						<StatCard
							name='Completed Orders'
							icon={CheckCircle}
							value={stats.completedOrders}
							color='#10B981'
						/>
						<StatCard name='Total Revenue' icon={DollarSign} value={`$${parseFloat(stats.totalRevenue).toLocaleString()}`} color='#EF4444' />
					</motion.div>
				) : null}

				{error ? (
					<div className='card p-6'>
						<div className='mb-3 text-red-500'>Error: {error}</div>
						<button className='btn btn-primary' onClick={() => loadOrders()}>Retry</button>
					</div>
				) : (
					<OrdersTable 
						orders={orders} 
						setOrders={setOrders}
						loading={loading}
						onPageChange={handlePageChange}
						pagination={pagination}
					/>
				)}
				
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-8'>
					<DailyOrders />
					<OrderDistribution />
				</div>
			</main>
		</div>
	);
};
export default OrdersPage;