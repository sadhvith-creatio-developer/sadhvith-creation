import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2, Plus, Search } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ProductImage from "../components/ProductImage";
import { managerProductsApi } from "../services/api";
import { formatPrice } from "../utils/formatPrice";
import { usePageTitle } from "../utils/usePageTitle";

function statusClass(availability) {
  if (availability === "Out of Stock") return "status-out";
  if (availability === "Inactive") return "status-inactive";
  if (availability === "Made to Order") return "status-order";
  return "status-available";
}

const CUSTOMER_SITE_URL = import.meta.env.VITE_CUSTOMER_SITE_URL || "";

export default function Products() {
  usePageTitle("Manage Products");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      const res = await managerProductsApi.list({ sort: "newest" });
      setProducts(res.products || []);
    } catch (err) {
      setError(err.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const statuses = useMemo(() => {
    const unique = new Set(products.map((p) => p.availability).filter(Boolean));
    return ["All", ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesStatus = statusFilter === "All" || product.availability === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      const haystack = [product.title, product.category, product.material].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [products, query, statusFilter]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setActionError("");
    try {
      await managerProductsApi.remove(pendingDelete.id);
      setProducts((list) => list.filter((p) => p.id !== pendingDelete.id));
      setSuccessMessage(`"${pendingDelete.title}" was deleted.`);
      setPendingDelete(null);
    } catch (err) {
      setActionError(err.message || "Could not delete product.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Manage Products</h1>
          <p className="muted">{products.length} product(s) in your catalogue.</p>
        </div>
        <div className="page-header-actions">
          <Link to="/products/add" className="btn btn-primary">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {successMessage && <div className="form-success">{successMessage}</div>}
      {actionError && <div className="form-error">{actionError}</div>}

      <div className="table-toolbar">
        <div className="search-bar">
          <Search size={16} className="search-bar-icon" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, category, or material..."
            aria-label="Search products"
          />
        </div>
        {statuses.length > 1 && (
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All statuses" : s}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <LoadingState count={5} />
      ) : error ? (
        <EmptyState title="Could not load products" message={error} tone="error" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={products.length === 0 ? "No products yet" : "No matching products"}
          message={
            products.length === 0
              ? "Add your first product to get started."
              : "Try a different search or filter."
          }
        >
          {products.length === 0 && (
            <Link to="/products/add" className="btn btn-primary" style={{ marginTop: "12px" }}>
              <Plus size={16} /> Add Product
            </Link>
          )}
        </EmptyState>
      ) : (
        <div className="admin-panel admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Original Price</th>
                <th>Offer</th>
                <th>Final Price</th>
                <th>Availability</th>
                <th>Featured</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <ProductImage
                      src={product.images?.[0]}
                      alt={product.title}
                      className="admin-table-thumb"
                    />
                  </td>
                  <td>
                    <span className="admin-table-title">{product.title}</span>
                    {product.badge && <span className="admin-table-badge">{product.badge}</span>}
                  </td>
                  <td>{product.category || "—"}</td>
                  <td>{formatPrice(product.originalPrice)}</td>
                  <td>{product.offerPercentage > 0 ? `${Math.round(product.offerPercentage)}%` : "—"}</td>
                  <td className="admin-table-strong">{formatPrice(product.finalPrice)}</td>
                  <td>
                    <span className={`status-pill ${statusClass(product.availability)}`}>
                      {product.availability}
                    </span>
                  </td>
                  <td>{product.featured ? <span className="featured-dot" title="Featured" /> : "—"}</td>
                  <td>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "—"}</td>
                  <td>
                    <div className="table-actions">
                      <a
                        href={`${CUSTOMER_SITE_URL}/products/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-btn"
                        title="View on customer site"
                        aria-label="View product"
                      >
                        <Eye size={15} />
                      </a>
                      <Link
                        to={`/products/edit/${product.id}`}
                        className="icon-btn"
                        title="Edit"
                        aria-label="Edit product"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        type="button"
                        className="icon-btn icon-btn-danger"
                        title="Delete"
                        aria-label="Delete product"
                        onClick={() => setPendingDelete(product)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pendingDelete && (
        <div className="confirm-dialog-backdrop" role="dialog" aria-modal="true">
          <div className="confirm-dialog">
            <h3>Delete this product?</h3>
            <p>
              Are you sure you want to delete "{pendingDelete.title}"? This will remove it from the
              customer site immediately and cannot be undone.
            </p>
            <div className="confirm-dialog-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPendingDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
