import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Download, ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { SkeletonTable } from "../common/LoadingSkeleton";

const UsersTable = ({ users, setUsers, loading, onPageChange, pagination }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [editingUser, setEditingUser] = useState(null);
	const [newUser, setNewUser] = useState({ name: "", email: "", role: "", status: "Active" });
	const [sortField, setSortField] = useState(null);
	const [sortDirection, setSortDirection] = useState("asc");
	const { success, error } = useToast();

	const handleSort = (field) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const sortedUsers = useMemo(() => {
		if (!sortField) return users;
		
		return [...users].sort((a, b) => {
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
	}, [users, sortField, sortDirection]);

	const filteredUsers = useMemo(() => {
		if (!searchTerm) return sortedUsers;
		const query = searchTerm.toLowerCase();
		return sortedUsers.filter(
			(user) =>
				user.name.toLowerCase().includes(query) ||
				user.email.toLowerCase().includes(query)
		);
	}, [sortedUsers, searchTerm]);

	const SortIcon = ({ field }) => {
		if (sortField !== field) return <ArrowUpDown size={14} className="muted" />;
		return sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
	};

	const exportToCSV = () => {
		const headers = ["Name", "Email", "Role", "Status", "Orders", "Total Spent"];
		const rows = filteredUsers.map(u => [
			u.name, u.email, u.role, u.status, u.orders || 0, u.totalSpent || 0
		]);
		
		const csv = [
			headers.join(","),
			...rows.map(row => row.join(","))
		].join("\n");
		
		const blob = new Blob([csv], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "users.csv";
		a.click();
		success("Users exported to CSV");
	};

	const handleDelete = (id) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			setUsers(users.filter((user) => user.id !== id));
			success("User deleted successfully");
		}
	};

	const handleEditClick = (user) => {
		setEditingUser(user);
	};

	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditingUser({ ...editingUser, [name]: value });
	};

	const handleEditSave = () => {
		setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
		setEditingUser(null);
		success("User updated successfully");
	};

	const handleNewUserChange = (e) => {
		const { name, value } = e.target;
		setNewUser({ ...newUser, [name]: value });
	};

	const handleAddUser = () => {
		if (newUser.name && newUser.email && newUser.role) {
			const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
			setUsers([...users, { ...newUser, id, orders: 0, totalSpent: 0, registeredAt: new Date().toISOString().split('T')[0] }]);
			setNewUser({ name: "", email: "", role: "", status: "Active" });
			success("User added successfully");
		} else {
			error("Please fill all required fields");
		}
	};

	if (loading) {
		return <SkeletonTable rows={5} cols={6} />;
	}

	return (
		<motion.div
			className='card p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
				<h2 className='text-xl font-semibold' style={{ color: "rgb(var(--text))" }}>Users List</h2>
				
				<div className="flex items-center gap-2">
					<div className="relative">
						<Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 muted" />
						<input
							type="text"
							placeholder="Search users..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
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


				{/* Add New User Form */}
				<div className='mb-6 grid grid-cols-1 md:grid-cols-4 gap-4'>
                    <input
						type='text'
						name='name'
						placeholder='Name'
						value={newUser.name}
						onChange={handleNewUserChange}
                        className='px-3 py-2 rounded border'
                        style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
					/>
                    <input
						type='email'
						name='email'
						placeholder='Email'
						value={newUser.email}
						onChange={handleNewUserChange}
                        className='px-3 py-2 rounded border'
                        style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
					/>
                    <input
						type='text'
						name='role'
						placeholder='Role'
						value={newUser.role}
						onChange={handleNewUserChange}
                        className='px-3 py-2 rounded border'
                        style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
					/>
                    <button
                        onClick={handleAddUser}
                        className='btn btn-primary'
                    >
						Add User
					</button>
				</div>

			{/* Users Table */}
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y' style={{ color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}>
					<thead>
						<tr>
							<th 
								className='px-6 py-3 text-left text-xs font-medium uppercase muted cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
								onClick={() => handleSort("name")}
							>
								<div className="flex items-center gap-2">
									Name
									<SortIcon field="name" />
								</div>
							</th>
							<th 
								className='px-6 py-3 text-left text-xs font-medium uppercase muted cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
								onClick={() => handleSort("email")}
							>
								<div className="flex items-center gap-2">
									Email
									<SortIcon field="email" />
								</div>
							</th>
							<th 
								className='px-6 py-3 text-left text-xs font-medium uppercase muted cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
								onClick={() => handleSort("role")}
							>
								<div className="flex items-center gap-2">
									Role
									<SortIcon field="role" />
								</div>
							</th>
							<th 
								className='px-6 py-3 text-left text-xs font-medium uppercase muted cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
								onClick={() => handleSort("status")}
							>
								<div className="flex items-center gap-2">
									Status
									<SortIcon field="status" />
								</div>
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium uppercase muted'>Actions</th>
						</tr>
					</thead>
                        <tbody className='divide-y' style={{ borderColor: "rgb(var(--border))" }}>
							{filteredUsers.map((user) =>
								editingUser?.id === user.id ? (
									<tr key={user.id}>
										<td className='px-6 py-2'>
											<input
												name='name'
												value={editingUser.name}
												onChange={handleEditChange}
                                                className='px-2 py-1 rounded border'
                                                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
											/>
										</td>
										<td className='px-6 py-2'>
											<input
												name='email'
												value={editingUser.email}
												onChange={handleEditChange}
                                                className='px-2 py-1 rounded border'
                                                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
											/>
										</td>
										<td className='px-6 py-2'>
											<input
												name='role'
												value={editingUser.role}
												onChange={handleEditChange}
                                                className='px-2 py-1 rounded border'
                                                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
											/>
										</td>
										<td className='px-6 py-2'>
											<select
												name='status'
												value={editingUser.status}
												onChange={handleEditChange}
                                                className='px-2 py-1 rounded border'
                                                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
											>
												<option value='Active'>Active</option>
												<option value='Inactive'>Inactive</option>
											</select>
										</td>
										<td className='px-6 py-2'>
                                            <button onClick={handleEditSave} className='btn btn-primary mr-2'>Save</button>
                                            <button onClick={() => setEditingUser(null)} className='btn'>Cancel</button>
										</td>
									</tr>
								) : (
									<motion.tr
										key={user.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
									>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
                                                <div className='h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-semibold'>
													{user.name.charAt(0)}
												</div>
                                                <div className='ml-4 text-sm font-medium' style={{ color: "rgb(var(--text))" }}>{user.name}</div>
											</div>
										</td>
                                        <td className='px-6 py-4 text-sm' style={{ color: "rgb(var(--text))" }}>{user.email}</td>
										<td className='px-6 py-4'>
                                            <span className='px-2 inline-flex text-xs font-semibold rounded-full' style={{ backgroundColor: "rgba(99,102,241,0.15)", color: "rgb(var(--brand-strong))" }}>
												{user.role}
											</span>
										</td>
										<td className='px-6 py-4'>
											<span
                                                className={`px-2 inline-flex text-xs font-semibold rounded-full`}
                                                style={{
                                                    backgroundColor: user.status === "Active" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                                                    color: user.status === "Active" ? "rgb(var(--accent))" : "rgb(var(--danger))",
                                                }}
											>
												{user.status}
											</span>
										</td>
										<td className='px-6 py-4 text-sm'>
											<div className="flex gap-2">
												<button 
													onClick={() => handleEditClick(user)} 
													className='btn p-2'
													style={{ borderColor: "rgb(var(--border))" }}
												>
													<Pencil size={16} />
												</button>
												<button 
													onClick={() => handleDelete(user.id)} 
													className='btn p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
													style={{ borderColor: "rgb(var(--border))" }}
												>
													<Trash size={16} />
												</button>
											</div>
										</td>
									</motion.tr>
								)
							)}
						</tbody>
					</table>
				</div>

			{pagination && (
				<div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: "rgb(var(--border))" }}>
					<div className="text-sm muted">
						Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
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
		</motion.div>
	);
};

export default UsersTable;
