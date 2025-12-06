import { useState, useMemo } from "react";
import { Pencil, Trash, Plus, Download, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { SkeletonTable } from "../common/LoadingSkeleton";

const ProductTable = ({ products, setProducts, loading, onPageChange, pagination }) => {
	const [name, setName] = useState("");
	const [category, setCategory] = useState("");
	const [price, setPrice] = useState("");
	const [stock, setStock] = useState("");
	const [sales, setSales] = useState("");
	const [editId, setEditId] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [sortField, setSortField] = useState(null);
	const [sortDirection, setSortDirection] = useState("asc");
	const [searchQuery, setSearchQuery] = useState("");
	const { success, error } = useToast();

	const clearForm = () => {
		setName("");
		setCategory("");
		setPrice("");
		setStock("");
		setSales("");
		setEditId(null);
		setShowForm(false);
	};

	const handleAdd = () => {
		if (!showForm) {
			setShowForm(true);
			return;
		}

		if (!name || !category || !price || !stock || !sales) {
			error("Please fill all fields");
			return;
		}

		if (editId !== null) {
			setProducts((prev) =>
				prev.map((p) =>
					p.id === editId
						? {
							...p,
							name,
							category,
							price: parseFloat(price),
							stock: parseInt(stock),
							sales: parseInt(sales),
						}
						: p
				)
			);
			success("Product updated successfully");
		} else {
			const newProduct = {
				id: Date.now(),
				name,
				category,
				price: parseFloat(price),
				stock: parseInt(stock),
				sales: parseInt(sales),
			};
			setProducts((prev) => [...prev, newProduct]);
			success("Product added successfully");
		}

		clearForm();
	};

	const handleEdit = (product) => {
		setEditId(product.id);
		setName(product.name);
		setCategory(product.category);
		setPrice(product.price);
		setStock(product.stock);
		setSales(product.sales);
		setShowForm(true);
	};

	const handleDelete = (id) => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			setProducts((prev) => prev.filter((p) => p.id !== id));
			if (editId === id) clearForm();
			success("Product deleted successfully");
		}
	};

	const handleSort = (field) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const sortedProducts = useMemo(() => {
		if (!sortField) return products;
		
		return [...products].sort((a, b) => {
			let aVal = a[sortField];
			let bVal = b[sortField];
			
			if (typeof aVal === "string") {
				aVal = aVal.toLowerCase();
				bVal = bVal.toLowerCase();
			}
			
			if (sortDirection === "asc") {
				return aVal > bVal ? 1 : -1;
			} else {
				return aVal < bVal ? 1 : -1;
			}
		});
	}, [products, sortField, sortDirection]);

	const filteredProducts = useMemo(() => {
		if (!searchQuery) return sortedProducts;
		const query = searchQuery.toLowerCase();
		return sortedProducts.filter(p => 
			p.name.toLowerCase().includes(query) ||
			p.category.toLowerCase().includes(query)
		);
	}, [sortedProducts, searchQuery]);

	const exportToCSV = () => {
		const headers = ["Name", "Category", "Price", "Stock", "Sales"];
		const rows = filteredProducts.map(p => [
			p.name, p.category, p.price, p.stock, p.sales
		]);
		
		const csv = [
			headers.join(","),
			...rows.map(row => row.join(","))
		].join("\n");
		
		const blob = new Blob([csv], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "products.csv";
		a.click();
		success("Products exported to CSV");
	};

	const SortIcon = ({ field }) => {
		if (sortField !== field) return <ArrowUpDown size={14} className="muted" />;
		return sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
	};

	if (loading) {
		return <SkeletonTable rows={5} cols={6} />;
	}

	return (
		<div className='card p-6'>
			<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
				<h2 className='text-xl font-semibold' style={{ color: "rgb(var(--text))" }}>Product List</h2>
				
				<div className="flex items-center gap-2">
					<div className="relative">
						<Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 muted" />
						<input
							type="text"
							placeholder="Search products..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 pr-4 py-2 rounded-lg border text-sm"
							style={{ 
								backgroundColor: "rgb(var(--bg))", 
								color: "rgb(var(--text))", 
								borderColor: "rgb(var(--border))" 
							}}
						/>
					</div>
					<button onClick={exportToCSV} className="btn" style={{ borderColor: "rgb(var(--border))" }}>
						<Download size={16} />
						<span className="hidden sm:inline">Export</span>
					</button>
				</div>
			</div>

			<div className='flex flex-wrap items-start gap-3 mb-6'>
				<AnimatePresence>
					{showForm && (
						<motion.div
							className='flex flex-wrap gap-3 w-full'
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.4 }}
						>
							<input
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder='Name'
								className='px-3 py-2 rounded border flex-1 min-w-[150px]'
								style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
							/>
							<input
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								placeholder='Category'
								className='px-3 py-2 rounded border flex-1 min-w-[150px]'
								style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
							/>
							<input
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								type='number'
								step="0.01"
								placeholder='Price'
								className='px-3 py-2 rounded border flex-1 min-w-[120px]'
								style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
							/>
							<input
								value={stock}
								onChange={(e) => setStock(e.target.value)}
								type='number'
								placeholder='Stock'
								className='px-3 py-2 rounded border flex-1 min-w-[100px]'
								style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
							/>
							<input
								value={sales}
								onChange={(e) => setSales(e.target.value)}
								type='number'
								placeholder='Sales'
								className='px-3 py-2 rounded border flex-1 min-w-[100px]'
								style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
							/>
						</motion.div>
					)}
				</AnimatePresence>

				<div className='flex gap-2'>
					<button
						onClick={handleAdd}
						className="btn btn-primary"
					>
						{editId !== null ? "Save" : showForm ? "Add Product" : (
							<>
								<Plus size={16} />
								Add Product
							</>
						)}
					</button>

					{showForm && (
						<button onClick={clearForm} className='btn'>
							Cancel
						</button>
					)}
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className='w-full text-sm text-left' style={{ color: "rgb(var(--text))" }}>
					<thead className='text-xs uppercase' style={{ backgroundColor: "rgb(var(--bg))", color: "rgb(var(--muted))" }}>
						<tr>
							<th 
								className='px-4 py-3 border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' 
								style={{ borderColor: "rgb(var(--border))" }}
								onClick={() => handleSort("name")}
							>
								<div className="flex items-center gap-2">
									Name
									<SortIcon field="name" />
								</div>
							</th>
							<th 
								className='px-4 py-3 border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' 
								style={{ borderColor: "rgb(var(--border))" }}
								onClick={() => handleSort("category")}
							>
								<div className="flex items-center gap-2">
									Category
									<SortIcon field="category" />
								</div>
							</th>
							<th 
								className='px-4 py-3 border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' 
								style={{ borderColor: "rgb(var(--border))" }}
								onClick={() => handleSort("price")}
							>
								<div className="flex items-center gap-2">
									Price
									<SortIcon field="price" />
								</div>
							</th>
							<th 
								className='px-4 py-3 border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' 
								style={{ borderColor: "rgb(var(--border))" }}
								onClick={() => handleSort("stock")}
							>
								<div className="flex items-center gap-2">
									Stock
									<SortIcon field="stock" />
								</div>
							</th>
							<th 
								className='px-4 py-3 border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' 
								style={{ borderColor: "rgb(var(--border))" }}
								onClick={() => handleSort("sales")}
							>
								<div className="flex items-center gap-2">
									Sales
									<SortIcon field="sales" />
								</div>
							</th>
							<th className='px-4 py-3 border' style={{ borderColor: "rgb(var(--border))" }}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredProducts.length === 0 ? (
							<tr>
								<td colSpan={6} className="px-4 py-8 text-center muted">
									No products found
								</td>
							</tr>
						) : (
							filteredProducts.map((product) => (
								<tr key={product.id} className='hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
									<td className='px-4 py-3 border' style={{ borderColor: "rgb(var(--border))" }}>{product.name}</td>
									<td className='px-4 py-3 border' style={{ borderColor: "rgb(var(--border))" }}>
										<span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: "rgb(var(--bg))" }}>
											{product.category}
										</span>
									</td>
									<td className='px-4 py-3 border' style={{ borderColor: "rgb(var(--border))" }}>
										${product.price.toFixed(2)}
									</td>
									<td className='px-4 py-3 border' style={{ borderColor: "rgb(var(--border))" }}>
										<span className={product.stock < 20 ? "text-red-500 font-semibold" : ""}>
											{product.stock}
										</span>
									</td>
									<td className='px-4 py-3 border' style={{ borderColor: "rgb(var(--border))" }}>{product.sales}</td>
									<td className='px-4 py-3 border' style={{ borderColor: "rgb(var(--border))" }}>
										<div className="flex gap-2">
											<button 
												className='btn p-2' 
												onClick={() => handleEdit(product)}
												style={{ borderColor: "rgb(var(--border))" }}
											>
												<Pencil size={16} />
											</button>
											<button 
												className='btn p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' 
												onClick={() => handleDelete(product.id)}
												style={{ borderColor: "rgb(var(--border))" }}
											>
												<Trash size={16} />
											</button>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{pagination && (
				<div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: "rgb(var(--border))" }}>
					<div className="text-sm muted">
						Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => onPageChange(pagination.page - 1)}
							disabled={pagination.page === 1}
							className="btn disabled:opacity-50 disabled:cursor-not-allowed"
							style={{ borderColor: "rgb(var(--border))" }}
						>
							Previous
						</button>
						<span className="px-4 py-2 text-sm" style={{ color: "rgb(var(--text))" }}>
							Page {pagination.page} of {pagination.totalPages}
						</span>
						<button
							onClick={() => onPageChange(pagination.page + 1)}
							disabled={pagination.page >= pagination.totalPages}
							className="btn disabled:opacity-50 disabled:cursor-not-allowed"
							style={{ borderColor: "rgb(var(--border))" }}
						>
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductTable;
