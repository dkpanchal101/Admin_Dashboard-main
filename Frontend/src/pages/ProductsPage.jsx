import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import ProductTable from "../components/products/ProductTable";
import SalesTrendChart from "../components/products/SalesTrendChart";
import CatagoryDistributed from "../components/overview/CatagoryDistributed";
import { getProducts } from "../lib/mockApi";
import { useToast } from "../context/ToastContext";
import { SkeletonStatCard } from "../components/common/LoadingSkeleton";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({});
    const { error: showError } = useToast();

    const loadProducts = async (pageNum = page, currentFilters = filters) => {
        setLoading(true);
        setError("");
        try {
            const response = await getProducts(pageNum, 20, currentFilters);
            setProducts(response.data);
            setPagination({
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.totalPages
            });
        } catch (e) {
            const errorMsg = e.message || "Failed to load products";
            setError(errorMsg);
            showError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        loadProducts(newPage, filters);
    };

	// Dynamic Stats
	const totalProducts = pagination?.total || products.length;
	const topSelling = products.length > 0 ? Math.max(...products.map(p => p.sales)) : 0;
	const lowStock = products.filter((p) => p.stock < 20).length;
	const totalRevenue = products.reduce((sum, p) => sum + p.price * p.sales, 0);

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Products' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				{loading && !pagination ? (
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
				) : (
					<motion.div
						className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
						<StatCard name='Total Products' icon={Package} value={totalProducts} color='#6366F1' />
						<StatCard name='Top Selling' icon={TrendingUp} value={topSelling} color='#10B981' />
						<StatCard name='Low Stock' icon={AlertTriangle} value={lowStock} color='#F59E0B' />
						<StatCard name='Total Revenue' icon={DollarSign} value={`$${totalRevenue.toLocaleString()}`} color='#EF4444' />
					</motion.div>
				)}

                {/* Product Table */}
                {error ? (
                    <div className='card p-6'>
                        <div className='mb-3 text-red-500'>Error: {error}</div>
                        <button className='btn btn-primary' onClick={() => loadProducts()}>Retry</button>
                    </div>
                ) : (
                    <ProductTable 
                        products={products} 
                        setProducts={setProducts}
                        loading={loading}
                        onPageChange={handlePageChange}
                        pagination={pagination}
                    />
                )}

				{/* CHARTS */}
				<div className='grid grid-col-1 lg:grid-cols-2 gap-8 mt-8'>
					<SalesTrendChart />
					<CatagoryDistributed />
				</div>
			</main>
		</div>
	);
};

export default ProductsPage;
