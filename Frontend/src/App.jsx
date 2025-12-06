import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/common/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";

import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrderPage from "./pages/OrderPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CalendarPage from "./pages/CalendarPage";
import AlertsPage from "./pages/AlertsPage";
import LoginRegister from "./pages/LoginRegister";

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Background surface uses design tokens via index.css */}
            <div className='fixed inset-0 z-0'>
                <div className='absolute inset-0' style={{ backgroundColor: "rgb(var(--bg))" }} />
                <div className='absolute inset-0 backdrop-blur-[2px]' />
            </div>

            <Routes>
                <Route path="/Login" element={
                    isAuthenticated ? <Navigate to="/" replace /> : <LoginRegister />
                } />
                
                <Route path="/*" element={
                    <ProtectedRoute>
                        <Sidebar />
                        <Routes>
                            <Route path='/' element={<OverviewPage />} /> 
                            <Route path='/products' element={<ProductsPage />} />
                            <Route path="/calendar" element={<CalendarPage />} />
                            <Route path='/users' element={<UsersPage />} />
                            <Route path='/sales' element={<SalesPage />} />
                            <Route path='/orders' element={<OrderPage />} />
                            <Route path='/analytics' element={<AnalyticsPage />} />
                            <Route path='/alerts' element={<AlertsPage />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
}

export default App;
