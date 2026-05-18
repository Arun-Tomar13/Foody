import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { USER_ROLES } from "../constant";
import { useEffect, useMemo } from "react";
import { getAllOrder } from "../store/slices/orderSlice";
import {
  BadgeIndianRupee,
  BookCheck,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutGrid,
  UtensilsCrossed,
  X,
} from "lucide-react";

const Sidebar = ({
  viewport = "desktop",
  collapsed,
  showToggle,
  onToggleCollapse,
  onNavigate,
  onCloseMobile,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.users?.user);
  const role = user?.role;
  const orders = useSelector((state) => state?.order?.orderList);

  const isMobile = viewport === "mobile";
  const isIconOnly = collapsed && !isMobile;

  useEffect(() => {
    if (role === USER_ROLES.customer) dispatch(getAllOrder());
  }, [dispatch, role]);

  const roleLabel = useMemo(() => {
    if (role === USER_ROLES.admin) return "Administrator";
    if (role === USER_ROLES.customer) return "Customer";
    if (role === USER_ROLES.restaurent_owner) return "Restaurant owner";
    return "User";
  }, [role]);

  const navItems = useMemo(
    () => [
      { to: "/", end: true, icon: Home, label: "Home", },
      ...(role === USER_ROLES.admin
        ? [
            {
              to: "/restaurant",
              icon: UtensilsCrossed,
              label: "Restaurants",
            },
          ]
        : []),
      ...(orders?.length > 0 && role === USER_ROLES.customer
        ? [{ to: "/orders", icon: BookCheck, label: "Orders" }]
        : []),
      ...(role === USER_ROLES.customer
        ? [
            {
              to: "/transactions",
              icon: BadgeIndianRupee,
              label: "Wallet",
            },
          ]
        : []),
    ],
    [role, orders?.length],
  );

  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "sidebar-link--active" : ""}`;

  return (
    <nav
      className={`app-sidebar ${isIconOnly ? "app-sidebar--icon-only" : ""}`}
      aria-label="Main navigation"
    >

      <div className="sidebar-toolbar">
        {!isIconOnly && (
          <span className="sidebar-section-label">
            <LayoutGrid size={14} />
            Navigation
          </span>
        )}
        {showToggle && (
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>

      <ul className="sidebar-list">
        {navItems.map(({ to, end, icon: Icon, label, hint }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={linkClass}
              title={isIconOnly ? label : undefined}
              onClick={() => onNavigate?.()}
            >
              <span className="sidebar-link-icon" aria-hidden="true">
                <Icon size={19} strokeWidth={2.2} />
              </span>
              {!isIconOnly && (
                <span className="sidebar-link-content">
                  <span className="sidebar-link-label">{label}</span>
                  <span className="sidebar-link-hint">{hint}</span>
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {!isIconOnly && (
        <div className="sidebar-footer">
          <p>© {new Date().getFullYear()} Foody</p>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;
