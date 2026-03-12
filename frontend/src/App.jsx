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

function App() {
  const ProtectedRoute = ({ allowedRoles, children }) => {
    const userRole = JSON.parse(localStorage.getItem("role"));
    console.log(allowedRoles.includes(userRole),allowedRoles,userRole);
    

    if (userRole == "admin" || allowedRoles.includes(userRole))
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
            <ProtectedRoute allowedRoles={["restaurant owner"]}>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="restaurant/:id"
          element={
            <ProtectedRoute allowedRoles={["restaurant owner"]}>
              <Restaurant />
            </ProtectedRoute>
          }
        />
        <Route
          path="restaurant/:id/category/:categoryid"
          element={
            <ProtectedRoute allowedRoles={["restaurant owner"]}>
              <Restaurant />
            </ProtectedRoute>
          }
        />
        <Route
          path="order/:id"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <OrderItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Order />
            </ProtectedRoute>
          }
        />
        <Route
          path="charts"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="transactions"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Transaction />
            </ProtectedRoute>
          }
        />
        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>
    </Routes>
  );
}

export default App;
