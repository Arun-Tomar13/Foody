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
import { useDispatch, useSelector } from "react-redux";
import { USER_ROLES } from "./constant";
import { useEffect } from "react";
import { getProfile } from "./store/slices/userSlice";
import ProtectedRoute from "./pages/ProtectedRoute";
import PageNotFound from "./components/PageNotFound";

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // error
  useEffect(() => {
     dispatch(getProfile());
     
    if(localStorage.getItem('Bearer')?.trim()=='' || !localStorage.getItem('Bearer')) navigate("/login");
  }, []);

  return (
    <Routes>
      <Route index path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route
          path="restaurant"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.admin]}>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="restaurant/:id"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.admin]}>
              <Restaurant />
            </ProtectedRoute>
          }
        />
        <Route
          path="restaurant/:id/category/:categoryid"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.admin]}>
              <CategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="restaurant/category/:categoryid"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.restaurent_owner,USER_ROLES.admin]}>
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
      </Route>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}

export default App;
