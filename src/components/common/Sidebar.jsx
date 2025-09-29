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
	{ name: "Login", icon: LogIn, color: "#8B5CF6", href: "/Login" },
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<motion.div
			animate={{ width: isSidebarOpen ? 256 : 80 }}
			transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="relative z-10 h-screen flex-shrink-0 border-r"
            style={{ backgroundColor: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}
		>
			<div className="h-full p-4 flex flex-col">
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen((prev) => !prev)}
                    className="p-2 rounded-full transition-colors max-w-fit"
                    style={{ backgroundColor: "transparent" }}
				>
					<Menu size={24} />
				</motion.button>

				<nav className="mt-8 flex-grow">
                    {SIDEBAR_ITEMS.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                                `group block rounded-lg mb-2 overflow-hidden ${isActive ? "bg-gray-700/70 border border-gray-600" : "hover:bg-gray-700"}`
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
                                    style={{ color: item.color, minWidth: "20px" }}
                                    className="transition-transform duration-300 group-hover:scale-110"
                                />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className="ml-4 whitespace-nowrap"
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
