import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { config } from "../config";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/products", label: "Products", icon: Package },
  { to: "/products/add", label: "Add Product", icon: PlusCircle },
  { to: "/managers", label: "Managers", icon: Users },
];

export default function DashboardLayout({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const initials = (admin?.name || "A")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${mobileOpen ? "admin-sidebar-open" : ""}`}>
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-mark" aria-hidden="true" />
          <div>
            <span className="admin-sidebar-brand-name">{config.brandName}</span>
            <span className="admin-sidebar-brand-sub">{config.productName}</span>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => "admin-nav-link" + (isActive ? " admin-nav-link-active" : "")}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <span className="admin-user-avatar">{initials}</span>
            <div className="admin-user-info">
              <span className="admin-user-name">{admin?.name}</span>
              <span className="admin-user-email">{admin?.email}</span>
            </div>
          </div>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-mobile-toggle"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="admin-topbar-title">{config.productName}</span>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
