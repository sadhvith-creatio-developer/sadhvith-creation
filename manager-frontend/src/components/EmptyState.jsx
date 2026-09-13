import { PackageSearch } from "lucide-react";

// A reusable empty/no-results/error state. Pass children for an optional
// action (e.g. an "Add Product" button).
export default function EmptyState({ title, message, children, tone = "default" }) {
  return (
    <div className={`empty-state ${tone === "error" ? "empty-state-error" : ""}`}>
      <PackageSearch size={30} strokeWidth={1.5} aria-hidden="true" />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {children}
    </div>
  );
}
