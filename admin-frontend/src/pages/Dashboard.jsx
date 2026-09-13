import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, CheckCircle2, AlertTriangle, Star, Users, ShieldCheck, Plus, List } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { adminApi } from "../services/api";
import { usePageTitle } from "../utils/usePageTitle";

export default function Dashboard() {
  usePageTitle("Dashboard");
  const { admin } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    adminApi
      .dashboard()
      .then((res) => {
        if (!cancelled) setStats(res.stats);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load dashboard stats.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const productCards = [
    { label: "Total Products", value: stats?.totalProducts, icon: Package, tone: "neutral" },
    { label: "Active Products", value: stats?.activeProducts, icon: CheckCircle2, tone: "success" },
    { label: "Out of Stock", value: stats?.outOfStock, icon: AlertTriangle, tone: "warning" },
    { label: "Featured Products", value: stats?.featuredProducts, icon: Star, tone: "accent" },
  ];

  const accountCards = [
    { label: "Total Managers", value: stats?.totalManagers, icon: Users, tone: "neutral" },
    { label: "Active Managers", value: stats?.activeManagers, icon: CheckCircle2, tone: "success" },
    { label: "Total Admins", value: stats?.totalAdmins, icon: ShieldCheck, tone: "accent" },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Welcome back, {admin?.name?.split(" ")[0] || "Admin"}</h1>
          <p className="muted">Full overview of the product catalogue and manager accounts.</p>
        </div>
        <div className="page-header-actions">
          <Link to="/products/add" className="btn btn-primary">
            <Plus size={16} /> Add Product
          </Link>
          <Link to="/managers" className="btn btn-secondary">
            <List size={16} /> Manage Team
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingState count={4} />
      ) : error ? (
        <EmptyState title="Could not load dashboard" message={error} tone="error" />
      ) : (
        <>
          <h2 className="dashboard-section-title">Catalogue</h2>
          <div className="stats-grid">
            {productCards.map(({ label, value, icon: Icon, tone }) => (
              <div className={`stat-card stat-card-${tone}`} key={label}>
                <div className="stat-card-icon">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <div className="stat-value">{value ?? 0}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>

          <h2 className="dashboard-section-title">Team</h2>
          <div className="stats-grid stats-grid-3">
            {accountCards.map(({ label, value, icon: Icon, tone }) => (
              <div className={`stat-card stat-card-${tone}`} key={label}>
                <div className="stat-card-icon">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <div className="stat-value">{value ?? 0}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="dashboard-panel">
        <h2>Admin has full access</h2>
        <ul className="tips-list">
          <li>Manage products exactly like a Manager can — add, edit, delete, upload images.</li>
          <li>View and manage every Manager account from the Managers page — activate, deactivate, or remove one.</li>
          <li>Deactivating a Manager blocks their login immediately, without deleting their account or history.</li>
          <li>Changes you make here appear on the customer website immediately — there is one shared database.</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
