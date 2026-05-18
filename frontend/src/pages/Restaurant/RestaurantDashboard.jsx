import { Box } from "@mui/material";
import { ClipboardList, Store, UtensilsCrossed } from "lucide-react";
import AllRestaurantList from "../../components/AllRestaurantList";
import RestroOwner from "./Restaurant";
import { useSelector } from "react-redux";
import { USER_ROLES } from "../../constant";

const RestaurantDashboard = () => {
  const user = useSelector((state) => state?.users?.user);
  const role = user?.role;
  const isAdmin = role === USER_ROLES.admin;

  return (
    <Box className="foody-page restaurant-dashboard">
      <section className="restaurant-dashboard-hero">
        <div>
          <p className="dashboard-eyebrow">
            {isAdmin ? "Admin workspace" : "Restaurant workspace"}
          </p>
          <h1>
            {isAdmin
              ? "Restaurant operations"
              : "Run today from one counter"}
          </h1>
          <p className="foody-muted" style={{ maxWidth: 620 }}>
            {isAdmin
              ? "Manage restaurants, bulk uploads, menus, categories, and daily availability from a cleaner control room."
              : "Keep your store profile, menu, categories, and availability easy to scan and update."}
          </p>
        </div>

        <div className="restaurant-status-strip">
          <span className="operator-chip">
            <Store size={16} />
            {isAdmin ? "All restaurants" : "My restaurant"}
          </span>
          <span className="operator-chip">
            <UtensilsCrossed size={16} />
            Menu control
          </span>
          <span className="operator-chip">
            <ClipboardList size={16} />
            Bulk tools
          </span>
        </div>
      </section>

      <section className="restaurant-dashboard-shell">
        {isAdmin && <AllRestaurantList />}
        {role === USER_ROLES.restaurent_owner && <RestroOwner />}
      </section>
    </Box>
  );
};

export default RestaurantDashboard;
