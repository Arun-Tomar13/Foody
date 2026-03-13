import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant/Restaurant";
import CategoryPage from "./pages/Restaurant/CategoryPage";
import ProfilePage from "./pages/ProfilePage";
import OrderItems from "./components/OrderItems";
import Order from "./pages/customer/Order";
import Layout from "./pages/Layout";
import RestaurantDashboard from "./pages/Restaurant/RestaurantDashboard";
import Transaction from "./pages/customer/Transactions";
import Dashboard from "./components/charts/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import { useSelector } from "react-redux";
import { USER_ROLES } from "./constant";

function App() {
  const ProtectedRoute = ({ allowedRoles, children }) => {
    const userRole = useSelector((state)=>state?.users?.user?.role)
    

    if (userRole ==USER_ROLES.admin || allowedRoles.includes(userRole))
      return children;

    return <Navigate to="/unauthorized" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route
          path="restaurant"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.restaurent_owner]}>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="restaurant/:id"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.restaurent_owner]}>
              <Restaurant />
            </ProtectedRoute>
          }
        />
        <Route
          path="restaurant/:id/category/:categoryid"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.restaurent_owner]}>
              <CategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="restaurant/category/:categoryid"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.restaurent_owner]}>
              <CategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="order/:id"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.customer]}>
              <OrderItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.customer]}>
              <Order />
            </ProtectedRoute>
          }
        />
        <Route
          path="charts"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.admin]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="transactions"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.customer]}>
              <Transaction />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Unauthorized />} />
        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>
    </Routes>
  );
}

export default App;
