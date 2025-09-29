import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductTable = ({ products, setProducts }) => {
	const [name, setName] = useState("");
	const [category, setCategory] = useState("");
	const [price, setPrice] = useState("");
	const [stock, setStock] = useState("");
	const [sales, setSales] = useState("");
	const [editId, setEditId] = useState(null);
	const [showForm, setShowForm] = useState(false);

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

		if (!name || !category || !price || !stock || !sales) return;

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
		setProducts((prev) => prev.filter((p) => p.id !== id));
		if (editId === id) clearForm();
	};

    return (
        <div className='card p-6'>
            <h2 className='text-xl font-semibold mb-4' style={{ color: "rgb(var(--text))" }}>Product List</h2>

			<div className='flex flex-wrap items-start gap-3 mb-6'>
				<AnimatePresence>
					{showForm && (
						<motion.div
							className='flex flex-wrap gap-3'
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.4 }}
						>
                            <input
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder='Name'
                                className='px-3 py-2 rounded border'
                                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
							/>
                            <input
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								placeholder='Category'
                                className='px-3 py-2 rounded border'
                                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
							/>
                            <input
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								type='number'
								placeholder='Price'
                                className='px-3 py-2 rounded border'
                                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
							/>
                            <input
								value={stock}
								onChange={(e) => setStock(e.target.value)}
								type='number'
								placeholder='Stock'
                                className='px-3 py-2 rounded border'
                                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
							/>
                            <input
								value={sales}
								onChange={(e) => setSales(e.target.value)}
								type='number'
								placeholder='Sales'
                                className='px-3 py-2 rounded border'
                                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
							/>
						</motion.div>
					)}
				</AnimatePresence>

                <div className='flex gap-2 mt-2'>
					<button
						onClick={handleAdd}
                        className={`btn ${editId !== null ? "btn-primary" : "btn-primary"}`}
					>
						{editId !== null ? "Save" : showForm ? "Add Product" : "+ Add"}
					</button>

					{showForm && (
                        <button onClick={clearForm} className='btn'>
							Cancel
						</button>
					)}
				</div>
			</div>

            <table className='w-full text-sm text-left' style={{ color: "rgb(var(--text))" }}>
                <thead className='text-xs uppercase' style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--muted))" }}>
					<tr>
                        <th className='px-4 py-2 border' style={{ borderColor: "rgb(var(--border))" }}>Name</th>
                        <th className='px-4 py-2 border' style={{ borderColor: "rgb(var(--border))" }}>Category</th>
                        <th className='px-4 py-2 border' style={{ borderColor: "rgb(var(--border))" }}>Price</th>
                        <th className='px-4 py-2 border' style={{ borderColor: "rgb(var(--border))" }}>Stock</th>
                        <th className='px-4 py-2 border' style={{ borderColor: "rgb(var(--border))" }}>Sales</th>
                        <th className='px-4 py-2 border' style={{ borderColor: "rgb(var(--border))" }}>Actions</th>
					</tr>
				</thead>
                <tbody>
					{products.map((product) => (
                        <tr key={product.id} className='hover:opacity-90'>
                            <td className='px-4 py-2 border' style={{ borderColor: "rgb(var(--border))" }}>{product.name}</td>
                            <td className='px-4 py-2 border' style={{ borderColor: "rgb(var(--border))" }}>{product.category}</td>
                            <td className='px-4 py-2 border' style={{ borderColor: "rgb(var(--border))" }}>${product.price.toFixed(2)}</td>
                            <td className='px-4 py-2 border' style={{ borderColor: "rgb(var(--border))" }}>{product.stock}</td>
                            <td className='px-4 py-2 border' style={{ borderColor: "rgb(var(--border))" }}>{product.sales}</td>
                            <td className='px-4 py-2 border flex gap-2' style={{ borderColor: "rgb(var(--border))" }}>
                                <button className='btn' onClick={() => handleEdit(product)}>
									<Pencil size={16} />
								</button>
                                <button className='btn' onClick={() => handleDelete(product.id)}>
									<Trash size={16} />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ProductTable;
