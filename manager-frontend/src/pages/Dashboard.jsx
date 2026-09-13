import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, CheckCircle2, AlertTriangle, Star, Plus, List } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { managerApi } from "../services/api";
import { usePageTitle } from "../utils/usePageTitle";

export default function Dashboard() {
  usePageTitle("Dashboard");
  const { manager } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    managerApi
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

  const cards = [
    { label: "Total Products", value: stats?.totalProducts, icon: Package, tone: "neutral" },
    { label: "Active Products", value: stats?.activeProducts, icon: CheckCircle2, tone: "success" },
    { label: "Out of Stock", value: stats?.outOfStock, icon: AlertTriangle, tone: "warning" },
    { label: "Featured Products", value: stats?.featuredProducts, icon: Star, tone: "accent" },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Welcome back, {manager?.name?.split(" ")[0] || "Manager"}</h1>
          <p className="muted">Here's how your catalogue is doing today.</p>
        </div>
        <div className="page-header-actions">
          <Link to="/products/add" className="btn btn-primary">
            <Plus size={16} /> Add Product
          </Link>
          <Link to="/products" className="btn btn-secondary">
            <List size={16} /> Manage Products
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingState count={4} />
      ) : error ? (
        <EmptyState title="Could not load dashboard" message={error} tone="error" />
      ) : (
        <div className="stats-grid">
          {cards.map(({ label, value, icon: Icon, tone }) => (
            <div className={`stat-card stat-card-${tone}`} key={label}>
              <div className="stat-card-icon">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <div className="stat-value">{value ?? 0}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="dashboard-panel">
        <h2>Quick tips</h2>
        <ul className="tips-list">
          <li>Every product needs at least one image — up to five are supported, uploaded to Cloudinary.</li>
          <li>Set an offer percentage and the final price is calculated automatically by the server.</li>
          <li>Mark a product "Inactive" to hide it from the customer site without deleting it.</li>
          <li>Changes you save here appear on the customer website immediately — there is one shared database.</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
