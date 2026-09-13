import { Link } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle";

export default function NotFound() {
  usePageTitle("Page Not Found");

  return (
    <div className="auth-screen">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <h1>Page Not Found</h1>
        <p className="muted">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="btn btn-primary btn-block" style={{ marginTop: "20px" }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
