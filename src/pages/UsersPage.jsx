import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import Header from "../components/common/Header";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import { getUsers } from "../lib/mockApi";

const userStats = {
	totalUsers: 152845,
	newUsersToday: 243,
	activeUsers: 98520,
	churnRate: "2.4%",
};

const UsersPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                await getUsers();
            } catch (e) {
                if (isMounted) setError(e.message || "Failed to load users");
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users' />

      <main className='max-w-7xl mx-auto lg:px-8 ml-12'>
				{/* STATS */}
                <motion.div
					className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
				</motion.div>
                {loading ? (
                    <div className='card p-6'>Loading users…</div>
                ) : error ? (
                    <div className='card p-6'>
                        <div className='mb-3'>Error: {error}</div>
                        <button className='btn' onClick={() => { setLoading(true); setError(""); (async()=>{ try{ await getUsers(); } catch(e){ setError(e.message||"Failed to load users"); } finally{ setLoading(false);} })(); }}>Retry</button>
                    </div>
                ) : (
                    <UsersTable />
                )}
				{/* USER CHARTS */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-6'>
					<UserGrowthChart />
					<UserActivityHeatmap />
				</div>
			</main>
		</div>
	);
};
export default UsersPage;