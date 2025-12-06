import { Moon, Sun, Search, Bell, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ title, onSearch }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("theme") || "dark";
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/Login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className='shadow-sm border-b sticky top-0 z-20' style={{ backgroundColor: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}>
      <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
        <div className="flex items-center justify-between gap-4">
          <h1 className='text-2xl font-semibold' style={{ color: "rgb(var(--text))" }}>{title}</h1>
          
          <div className="flex items-center gap-3 flex-1 max-w-md ml-4">
            {onSearch && (
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 muted" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
                  style={{ 
                    backgroundColor: "rgb(var(--bg))", 
                    color: "rgb(var(--text))", 
                    borderColor: "rgb(var(--border))" 
                  }}
                />
              </form>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
              className="btn p-2"
              aria-label="Toggle theme"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              className="btn p-2 relative"
              style={{ borderColor: "rgb(var(--border))" }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="btn flex items-center gap-2"
                style={{ borderColor: "rgb(var(--border))" }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                  style={{ backgroundColor: "rgb(var(--brand))" }}>
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:block text-sm">{user?.name || "User"}</span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 card shadow-lg"
                    style={{ backgroundColor: "rgb(var(--card))" }}
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 border-b" style={{ borderColor: "rgb(var(--border))" }}>
                        <p className="text-sm font-semibold" style={{ color: "rgb(var(--text))" }}>
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs muted">{user?.email || ""}</p>
                        <p className="text-xs mt-1" style={{ color: "rgb(var(--brand))" }}>
                          {user?.role || "Customer"}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/settings");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        style={{ color: "rgb(var(--text))" }}
                      >
                        <Settings size={16} />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;