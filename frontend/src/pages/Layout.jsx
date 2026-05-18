import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { USER_ROLES } from "../constant";
import useAppViewport from "../hooks/useAppViewport";

const Layout = ({ showNavbar = true, showSidebar = true }) => {
  const user = useSelector((state) => state?.users?.user);
  const location = useLocation();
  const viewport = useAppViewport();

  const hasSidebar =
    showSidebar && user?.role !== USER_ROLES.restaurent_owner;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileSidebar = () => setMobileOpen((prev) => !prev);
  const closeMobileSidebar = () => setMobileOpen(false);
  const toggleTabletSidebar = () => setSidebarCollapsed((prev) => !prev);

  useEffect(() => {
    closeMobileSidebar();
  }, [location.pathname]);

  useEffect(() => {
    if (viewport === "desktop") {
      setSidebarCollapsed(false);
      setMobileOpen(false);
    }
    if (viewport === "tablet") {
      setMobileOpen(false);
    }
    if (viewport === "mobile") {
      setSidebarCollapsed(false);
    }
  }, [viewport]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return undefined;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (user?.error) {
    return <Navigate to="/login" />;
  }

  const shellClass = [
    "app-shell",
    hasSidebar ? "app-shell--with-sidebar" : "app-shell--no-sidebar",
    hasSidebar ? `app-shell--${viewport}` : "",
    hasSidebar && viewport === "tablet" && sidebarCollapsed
      ? "sidebar-collapsed"
      : "",
    hasSidebar && viewport === "mobile" && mobileOpen ? "sidebar-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shellClass}>
      {showNavbar && (
        <header className="app-navbar-wrap">
          <Navbar
            showMenuButton={hasSidebar && viewport === "mobile"}
            onMenuClick={toggleMobileSidebar}
          />
        </header>
      )}

      <div className="app-body">
        {hasSidebar && (
          <>
            <button
              type="button"
              className="sidebar-backdrop"
              aria-label="Close navigation menu"
              onClick={closeMobileSidebar}
            />
            <aside className="app-sidebar-panel" aria-label="Sidebar">
              <Sidebar
                viewport={viewport}
                collapsed={viewport === "tablet" && sidebarCollapsed}
                showToggle={viewport === "tablet"}
                onToggleCollapse={toggleTabletSidebar}
                onNavigate={closeMobileSidebar}
                onCloseMobile={closeMobileSidebar}
              />
            </aside>
          </>
        )}

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
