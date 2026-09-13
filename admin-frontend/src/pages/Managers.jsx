import { useEffect, useMemo, useState } from "react";
import { Search, ShieldOff, ShieldCheck, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import { adminApi } from "../services/api";
import { usePageTitle } from "../utils/usePageTitle";

export default function Managers() {
  usePageTitle("Manage Team");

  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [pendingDelete, setPendingDelete] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadManagers() {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.listManagers();
      setManagers(res.managers || []);
    } catch (err) {
      setError(err.message || "Could not load manager accounts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadManagers();
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return managers;
    return managers.filter((m) => `${m.name} ${m.email}`.toLowerCase().includes(q));
  }, [managers, query]);

  async function toggleActive(manager) {
    setBusyId(manager.id);
    setActionError("");
    try {
      const updated = await adminApi.setManagerStatus(manager.id, !manager.isActive);
      setManagers((list) => list.map((m) => (m.id === manager.id ? updated.manager : m)));
      setSuccessMessage(
        `"${manager.name}" was ${updated.manager.isActive ? "activated" : "deactivated"}.`
      );
    } catch (err) {
      setActionError(err.message || "Could not update manager status.");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    setActionError("");
    try {
      await adminApi.removeManager(pendingDelete.id);
      setManagers((list) => list.filter((m) => m.id !== pendingDelete.id));
      setSuccessMessage(`"${pendingDelete.name}"'s account was deleted.`);
      setPendingDelete(null);
    } catch (err) {
      setActionError(err.message || "Could not delete manager account.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Manage Team</h1>
          <p className="muted">{managers.length} manager account(s). Managers register themselves from the Manager dashboard.</p>
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
            placeholder="Search by name or email..."
            aria-label="Search managers"
          />
        </div>
      </div>

      {loading ? (
        <LoadingState count={4} />
      ) : error ? (
        <EmptyState title="Could not load managers" message={error} tone="error" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={managers.length === 0 ? "No managers yet" : "No matching managers"}
          message={
            managers.length === 0
              ? "Managers will appear here once they register from the Manager dashboard."
              : "Try a different search."
          }
        />
      ) : (
        <div className="admin-panel admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((manager) => (
                <tr key={manager.id}>
                  <td className="admin-table-title">{manager.name}</td>
                  <td>{manager.email}</td>
                  <td>
                    <span className={`status-pill ${manager.isActive ? "" : "status-inactive"}`}>
                      {manager.isActive ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td>{manager.createdAt ? new Date(manager.createdAt).toLocaleDateString() : "—"}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="icon-btn"
                        title={manager.isActive ? "Deactivate" : "Activate"}
                        aria-label={manager.isActive ? "Deactivate manager" : "Activate manager"}
                        onClick={() => toggleActive(manager)}
                        disabled={busyId === manager.id}
                      >
                        {manager.isActive ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
                      </button>
                      <button
                        type="button"
                        className="icon-btn icon-btn-danger"
                        title="Delete"
                        aria-label="Delete manager"
                        onClick={() => setPendingDelete(manager)}
                        disabled={busyId === manager.id}
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
            <h3>Delete this manager account?</h3>
            <p>
              Are you sure you want to permanently delete "{pendingDelete.name}"'s account? This
              cannot be undone. Products they added will not be deleted.
            </p>
            <div className="confirm-dialog-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPendingDelete(null)}
                disabled={busyId === pendingDelete.id}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
                disabled={busyId === pendingDelete.id}
              >
                {busyId === pendingDelete.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
