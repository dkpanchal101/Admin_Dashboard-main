import { createContext, useContext, useState, useEffect } from "react";
// Use real API if VITE_API_BASE_URL is set, otherwise use mock API
const useRealAPI = import.meta.env.VITE_API_BASE_URL;
import * as realAPI from "../lib/api.js";
import * as mockAPI from "../lib/mockApi.js";

// Select API based on environment
const api = useRealAPI ? realAPI : mockAPI;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // If using real API, verify token is still valid
        if (useRealAPI && api.getMe) {
          api.getMe().catch(() => {
            // Token invalid, clear session
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
          });
        }
      } catch (e) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      // Handle both real API and mock API response formats
      const user = response.user || response.data?.user;
      const token = response.token || response.data?.token;
      
      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      }
      if (token) {
        localStorage.setItem("token", token);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.register(userData);
      // Handle both real API and mock API response formats
      const user = response.user || response.data?.user;
      const token = response.token || response.data?.token;
      
      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      }
      if (token) {
        localStorage.setItem("token", token);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || "Registration failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "Admin" || user?.role === "Manager"
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
