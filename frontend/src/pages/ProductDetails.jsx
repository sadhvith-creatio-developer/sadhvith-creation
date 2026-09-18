// src/pages/ProductDetails.jsx

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Tag,
  MapPin,
  CheckCircle2,
  Package,
  Info,
} from "lucide-react";

import ProductGallery from "../components/ProductGallery";
import WhatsAppButton from "../components/WhatsAppButton";
import SectionHeading from "../components/SectionHeading";
import ProductGrid from "../components/ProductGrid";
import LoadingState from "../components/LoadingState";

import { productsApi } from "../services/api";
import { formatPrice } from "../utils/formatPrice";
import { useSEO } from "../hooks/useSEO";
import {
  buildProductSchema,
  buildBreadcrumbSchema,
} from "../utils/seo";

export default function ProductDetails() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* ------------------------------------------------------------------------
     SEO SCHEMAS
     ------------------------------------------------------------------------ */

  const schemas = useMemo(() => {
    if (!product) return [];

    return [
      buildProductSchema(product),

      buildBreadcrumbSchema([
        {
          name: "Home",
          path: "/",
        },
        {
          name: "Products",
          path: "/products",
        },
        {
          name: product.title,
          path: `/products/${product.slug}`,
        },
      ]),
    ];
  }, [product]);

  /* ------------------------------------------------------------------------
     SEO
     ------------------------------------------------------------------------ */

  useSEO({
    title: product ? product.title : "Product",
    description: product
      ? (
          product.shortDescription ||
          product.description ||
          `Buy ${product.title} from Sadhvith Creation. Handcrafted with care.`
        ).slice(0, 160)
      : "",
    path: `/products/${slug}`,
    image: product?.images?.[0] || "",
    isProduct: !!product,
    productData: product
      ? {
          price: product.finalPrice,
          currency: "INR",
          availability:
            product.inStock === false
              ? "out of stock"
              : "in stock",
        }
      : null,
    schemas,
  });

  /* ------------------------------------------------------------------------
     LOAD PRODUCT
     ------------------------------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setNotFound(false);

      try {
        const res = await productsApi.getBySlug(slug);

        if (!cancelled) {
          setProduct(res?.product || null);
          setRelated(res?.relatedProducts || []);

          if (!res?.product) {
            setNotFound(true);
          }
        }
      } catch (err) {
        if (!cancelled) {
          if (err?.status === 404) {
            setNotFound(true);
          }

          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  /* ------------------------------------------------------------------------
     LOADING
     ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <LoadingState count={1} />
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------------------------
     NOT FOUND
     ------------------------------------------------------------------------ */

  if (notFound || !product) {
    return (
      <section className="section">
        <div className="container not-found">
          <h1>Product Not Found</h1>

          <p>
            The product you're looking for could not be found.
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------------------------
     SAFE PRODUCT VALUES
     ------------------------------------------------------------------------ */

  const discount =
    Number(product.offerPercentage) > 0
      ? Math.round(Number(product.offerPercentage))
      : 0;

  const specifications =
    product.specifications &&
    typeof product.specifications === "object" &&
    !Array.isArray(product.specifications)
      ? product.specifications
      : {};

  const specificationEntries =
    Object.entries(specifications).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    );

  const tags = Array.isArray(product.tags)
    ? product.tags
    : typeof product.tags === "string"
      ? product.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

  const images = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : [];

  const hasBasicInformation =
    product.material ||
    product.size ||
    product.finish ||
    product.availability ||
    product.location;

  return (
    <section className="section product-details-page">
      <div className="container">

        {/* ------------------------------------------------------------------
            BREADCRUMB
            ------------------------------------------------------------------ */}

        <nav
          aria-label="Breadcrumb"
          className="breadcrumb product-breadcrumb"
        >
          <Link to="/">Home</Link>

          <span aria-hidden="true">/</span>

          <Link to="/products">Products</Link>

          <span aria-hidden="true">/</span>

          <span aria-current="page">
            {product.title}
          </span>
        </nav>

        {/* ------------------------------------------------------------------
            BACK
            ------------------------------------------------------------------ */}

        <Link
          to="/products"
          className="back-link product-back-link"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        {/* ------------------------------------------------------------------
            MAIN PRODUCT
            ------------------------------------------------------------------ */}

        <div className="product-details">

          {/* LEFT — GALLERY */}

          <div className="product-details-gallery">
            <ProductGallery
              images={images}
              productName={product.title}
            />
          </div>

          {/* RIGHT — SUMMARY */}

          <div className="product-info">

            {/* Badge / Featured */}

            {(product.badge || product.featured) && (
              <div className="product-badges">

                {product.badge && (
                  <span className="product-badge">
                    <Tag size={14} />
                    {product.badge}
                  </span>
                )}

                {product.featured && (
                  <span className="product-featured-badge">
                    Featured Product
                  </span>
                )}

              </div>
            )}

            {/* Category */}

            {product.category && (
              <span className="product-info-category">
                {product.category}
              </span>
            )}

            {/* Title */}

            <h1>{product.title}</h1>

            {/* Rating */}

            {typeof product.rating === "number" && (
              <div className="product-info-rating">

                <Star
                  size={16}
                  fill="currentColor"
                  strokeWidth={0}
                />

                <span>
                  {product.rating.toFixed(1)}
                </span>

                {typeof product.reviewCount === "number" && (
                  <span className="muted">
                    ({product.reviewCount} reviews)
                  </span>
                )}

              </div>
            )}

            {/* Price */}

            <div className="product-info-price">

              <span className="price-current">
                {formatPrice(product.finalPrice)}
              </span>

              {discount > 0 && (
                <>
                  <span className="price-original">
                    {formatPrice(product.originalPrice)}
                  </span>

                  <span className="price-discount">
                    {discount}% OFF
                  </span>
                </>
              )}

            </div>

            {/* Short Description */}

            {product.shortDescription && (
              <p className="product-short-description">
                {product.shortDescription}
              </p>
            )}

            {/* Availability */}

            {product.availability && (
              <div className="product-availability">
                <CheckCircle2 size={17} />

                <span>
                  {product.availability}
                </span>
              </div>
            )}

            {/* WhatsApp */}

            <div className="product-info-actions">
              <WhatsAppButton
                product={product}
                label="WhatsApp Enquire"
                size="lg"
              />
            </div>

          </div>
        </div>

        {/* ------------------------------------------------------------------
            FULL DESCRIPTION
            ------------------------------------------------------------------ */}

        <div className="product-content-section">

          <div className="product-content-card">

            <div className="product-content-heading">
              <div className="product-content-icon">
                <Info size={19} />
              </div>

              <div>
                <h2>About This Product</h2>

                <p>
                  Product details and information
                </p>
              </div>
            </div>

            {product.description ? (
              <div className="product-full-description">
                {product.description
                  .split("\n")
                  .map((paragraph, index) => (
                    <p key={index}>
                      {paragraph || "\u00A0"}
                    </p>
                  ))}
              </div>
            ) : (
              <p className="product-no-content">
                No additional description available.
              </p>
            )}

          </div>

        </div>

        {/* ------------------------------------------------------------------
            PRODUCT INFORMATION
            ------------------------------------------------------------------ */}

        {hasBasicInformation && (
          <div className="product-content-section">

            <div className="product-content-card">

              <div className="product-content-heading">
                <div className="product-content-icon">
                  <Package size={19} />
                </div>

                <div>
                  <h2>Product Information</h2>

                  <p>
                    Important product details
                  </p>
                </div>
              </div>

              <div className="product-information-grid">

                {product.category && (
                  <div className="product-information-item">
                    <span>Category</span>
                    <strong>{product.category}</strong>
                  </div>
                )}

                {product.material && (
                  <div className="product-information-item">
                    <span>Material</span>
                    <strong>{product.material}</strong>
                  </div>
                )}

                {product.size && (
                  <div className="product-information-item">
                    <span>Size</span>
                    <strong>{product.size}</strong>
                  </div>
                )}

                {product.finish && (
                  <div className="product-information-item">
                    <span>Finish</span>
                    <strong>{product.finish}</strong>
                  </div>
                )}

                {product.availability && (
                  <div className="product-information-item">
                    <span>Availability</span>
                    <strong>{product.availability}</strong>
                  </div>
                )}

                {product.location && (
                  <div className="product-information-item">
                    <span>Location</span>

                    <strong className="product-location-value">
                      <MapPin size={15} />
                      {product.location}
                    </strong>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------
            SPECIFICATIONS
            ------------------------------------------------------------------ */}

        {specificationEntries.length > 0 && (
          <div className="product-content-section">

            <div className="product-content-card">

              <div className="product-content-heading">
                <div className="product-content-icon">
                  <Package size={19} />
                </div>

                <div>
                  <h2>Specifications</h2>

                  <p>
                    Detailed product specifications
                  </p>
                </div>
              </div>

              <div className="spec-table product-detail-spec-table">

                {specificationEntries.map(
                  ([label, value], index) => (
                    <div
                      className="spec-row"
                      key={`${label}-${index}`}
                    >
                      <dt>{label}</dt>

                      <dd>
                        {String(value)}
                      </dd>
                    </div>
                  )
                )}

              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------
            TAGS
            ------------------------------------------------------------------ */}

        {tags.length > 0 && (
          <div className="product-content-section">

            <div className="product-content-card">

              <div className="product-content-heading">
                <div className="product-content-icon">
                  <Tag size={19} />
                </div>

                <div>
                  <h2>Tags</h2>

                  <p>
                    Product categories and keywords
                  </p>
                </div>
              </div>

              <div className="product-tags-list">

                {tags.map((tag, index) => (
                  <span
                    className="product-detail-tag"
                    key={`${tag}-${index}`}
                  >
                    {tag}
                  </span>
                ))}

              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------
            ALL PRODUCT IMAGES
            ------------------------------------------------------------------ */}

        {images.length > 1 && (
          <div className="product-content-section">

            <div className="product-content-card">

              <div className="product-content-heading">
                <div className="product-content-icon">
                  <Package size={19} />
                </div>

                <div>
                  <h2>Product Images</h2>

                  <p>
                    View all available product images
                  </p>
                </div>
              </div>

              <div className="product-detail-image-grid">

                {images.map((image, index) => (
                  <div
                    className="product-detail-image"
                    key={`${image}-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} - Image ${index + 1}`}
                      loading="lazy"
                    />
                  </div>
                ))}

              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------
            BOTTOM CTA
            ------------------------------------------------------------------ */}

        <div className="product-detail-cta">

          <div>
            <h2>Interested in this product?</h2>

            <p>
              Contact us on WhatsApp for more information,
              availability and enquiries.
            </p>
          </div>

          <WhatsAppButton
            product={product}
            label="WhatsApp Enquire"
            size="lg"
          />

        </div>

        {/* ------------------------------------------------------------------
            RELATED PRODUCTS
            ------------------------------------------------------------------ */}

        {related.length > 0 && (
          <div className="related-products">

            <SectionHeading
              title="You May Also Like"
            />

            <ProductGrid
              products={related}
            />

          </div>
        )}

      </div>
    </section>
  );
}