import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import DashboardPage from "./features/dashboard/DashboardPage";
import RoomsPage from "./features/rooms/RoomsPage";
import ProductsPage from "./features/products/ProductsPage";
import SuppliersPage from "./features/suppliers/SuppliersPage";
import AlertsPage from "./features/alerts/AlertsPage";
import OrdersPage from "./features/orders/OrdersPage";
import BranchesPage from "./features/branches/BranchesPage";
import ScaleInfoPage from "./features/rooms/ScaleInfoPage";
import ProductDetailsPage from "./features/products/ProductDetailsPage";
import CalibrationPage from "./features/calibration/CalibrationPage";
import ScaleSimulationPage from "./features/simulation/ScaleSimulationPage";
import "./styles/global.css";

export default function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:id/*" element={<ScaleInfoPage />} />
            <Route path="/inventory/*" element={<ProductsPage />} />
            <Route path="/inventory/:id" element={<ProductDetailsPage />} />
            <Route path="/suppliers/*" element={<SuppliersPage />} />
            <Route path="/alerts/*" element={<AlertsPage />} />
            <Route path="/orders/*" element={<OrdersPage />} />
            <Route path="/branches/*" element={<BranchesPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/calibration" element={<CalibrationPage />} />
            <Route path="/simulation" element={<ScaleSimulationPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
