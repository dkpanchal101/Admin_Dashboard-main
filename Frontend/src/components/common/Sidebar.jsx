import {
	BarChart2,
	DollarSign,
	LogIn,
	Menu,
	ShoppingBag,
	ShoppingCart,
	TrendingUp,
	Users,
	CalendarIcon,
    Bell,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const SIDEBAR_ITEMS = [
	{ name: "Overview", icon: BarChart2, color: "#6366f1", href: "/" },
	{ name: "Products", icon: ShoppingBag, color: "#8B5CF6", href: "/products" },
	{ name: "Calendar", icon: CalendarIcon, color: "#F472B6", href: "/calendar" },
	{ name: "Users", icon: Users, color: "#EC4899", href: "/users" },
	{ name: "Sales", icon: DollarSign, color: "#10B981", href: "/sales" },
	{ name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
	{ name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
    { name: "Alerts", icon: Bell, color: "#F59E0B", href: "/alerts" },
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<motion.div
			animate={{ width: isSidebarOpen ? 256 : 80 }}
			transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="relative z-10 h-screen flex-shrink-0 border-r shadow-sm"
            style={{ 
				backgroundColor: "rgb(var(--card))", 
				borderColor: "rgb(var(--border))",
				boxShadow: "2px 0 8px rgba(0, 0, 0, 0.05)"
			}}
		>
			<div className="h-full p-4 flex flex-col">
				{/* Logo/Header Section */}
				<div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: "rgb(var(--border))" }}>
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => setIsSidebarOpen((prev) => !prev)}
						className="p-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
						style={{ color: "rgb(var(--text))" }}
					>
						<Menu size={24} />
					</motion.button>
					<AnimatePresence>
						{isSidebarOpen && (
							<motion.div
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								transition={{ duration: 0.2 }}
								className="flex items-center gap-2"
							>
								<div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
									style={{ backgroundColor: "rgb(var(--brand))" }}>
									AD
								</div>
								<span className="font-bold text-lg" style={{ color: "rgb(var(--text))" }}>
									Admin
								</span>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<nav className="flex-grow">
                    {SIDEBAR_ITEMS.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                                `group block rounded-lg mb-2 overflow-hidden transition-all ${
									isActive 
										? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 shadow-sm" 
										: "hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-transparent"
								}`
                            }
                            end={item.href === "/"}
                        >
                            <motion.div
                                layout
                                className="flex items-center p-4 text-sm font-medium transition-colors"
                                style={{ color: "rgb(var(--text))" }}
                            >
                                <item.icon
                                    size={20}
                                    style={{ 
										color: item.color, 
										minWidth: "20px",
										filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))"
									}}
                                    className="transition-transform duration-300 group-hover:scale-110"
                                />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className="ml-4 whitespace-nowrap font-medium"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </NavLink>
                    ))}
				</nav>
			</div>
		</motion.div>
	);
};

export default Sidebar;
