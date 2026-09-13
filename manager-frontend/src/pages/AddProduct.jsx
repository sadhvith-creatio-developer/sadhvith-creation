import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import ProductForm from "./ProductForm";
import { usePageTitle } from "../utils/usePageTitle";

export default function AddProduct() {
  usePageTitle("Add Product");

  return (
    <DashboardLayout>
      <Link to="/products" className="back-link">
        <ArrowLeft size={16} />
        Back to Products
      </Link>
      <div className="page-header">
        <div>
          <h1>Add Product</h1>
          <p className="muted">Fill in the details below to publish a new product.</p>
        </div>
      </div>

      <ProductForm mode="create" />
    </DashboardLayout>
  );
}
