import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import { getUsers } from "../lib/mockApi";
import { useToast } from "../context/ToastContext";
import { SkeletonStatCard } from "../components/common/LoadingSkeleton";
import { Users, UserPlus, UserCheck, TrendingDown } from "lucide-react";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [stats, setStats] = useState(null);
    const { error: showError } = useToast();

    const loadUsers = async (pageNum = page) => {
        setLoading(true);
        setError("");
        try {
            const response = await getUsers(pageNum, 20);
            setUsers(response.data);
            setPagination({
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.totalPages
            });
            
            // Calculate stats
            const activeUsers = response.data.filter(u => u.status === "Active").length;
            const newUsers = response.data.filter(u => {
                const registeredDate = new Date(u.registeredAt);
                const today = new Date();
                const diffTime = Math.abs(today - registeredDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 1;
            }).length;
            
            setStats({
                totalUsers: response.total,
                newUsersToday: newUsers,
                activeUsers: activeUsers,
                churnRate: ((response.data.filter(u => u.status === "Inactive").length / response.data.length) * 100).toFixed(1) + "%"
            });
        } catch (e) {
            const errorMsg = e.message || "Failed to load users";
            setError(errorMsg);
            showError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        loadUsers(newPage);
    };

    return (
        <div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
                {loading && !stats ? (
                    <motion.div
                        className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8'
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
                        className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <StatCard name='Total Users' icon={Users} value={stats.totalUsers.toLocaleString()} color='#6366F1' />
                        <StatCard name='New Users Today' icon={UserPlus} value={stats.newUsersToday} color='#10B981' />
                        <StatCard name='Active Users' icon={UserCheck} value={stats.activeUsers.toLocaleString()} color='#8B5CF6' />
                        <StatCard name='Churn Rate' icon={TrendingDown} value={stats.churnRate} color='#EF4444' />
                    </motion.div>
                ) : null}
                
                {error ? (
                    <div className='card p-6'>
                        <div className='mb-3 text-red-500'>Error: {error}</div>
                        <button className='btn btn-primary' onClick={() => loadUsers()}>Retry</button>
                    </div>
                ) : (
                    <UsersTable 
                        users={users} 
                        setUsers={setUsers}
                        loading={loading}
                        onPageChange={handlePageChange}
                        pagination={pagination}
                    />
                )}
				{/* USER CHARTS */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
					<UserGrowthChart />
					<UserActivityHeatmap />
				</div>
			</main>
		</div>
	);
};
export default UsersPage;