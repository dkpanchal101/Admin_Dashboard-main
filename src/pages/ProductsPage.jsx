import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import ProductTable from "../components/products/ProductTable";
import SalesTrendChart from "../components/products/SalesTrendChart";
import CatagoryDistributed from "../components/overview/CatagoryDistributed";
import { getProducts } from "../lib/mockApi";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const data = await getProducts();
                if (isMounted) setProducts(data);
            } catch (e) {
                if (isMounted) setError(e.message || "Failed to load products");
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, []);

	// Dynamic Stats
	const totalProducts = products.length;
	const topSelling = products.reduce((max, p) => (p.sales > max ? p.sales : max), 0);
	const lowStock = products.filter((p) => p.stock < 20).length;
	const totalRevenue = products.reduce((sum, p) => sum + p.price * p.sales, 0);

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Products' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
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

                {/* Product Table */}
                {loading ? (
                    <div className='card p-6'>Loading products…</div>
                ) : error ? (
                    <div className='card p-6'>
                        <div className='mb-3'>Error: {error}</div>
                        <button className='btn' onClick={() => { setLoading(true); setError(""); (async()=>{ try{ const data = await getProducts(); setProducts(data);} catch(e){ setError(e.message||"Failed to load products"); } finally{ setLoading(false);} })(); }}>Retry</button>
                    </div>
                ) : (
                    <ProductTable products={products} setProducts={setProducts} />
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
