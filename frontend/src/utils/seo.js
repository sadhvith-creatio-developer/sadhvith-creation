// ============================================================
//  seo.js — Centralised SEO / metadata helper
//  Drop this file into:  src/utils/seo.js
// ============================================================

export const SEO_DEFAULTS = {
  siteName: "Sadhvith Creation",
  siteUrl: "https://sadhvith-creation.vercel.app",
  defaultTitle: "Sadhvith Creation | Handcrafted Products Made with Care",
  defaultDescription:
    "Shop handcrafted, thoughtfully designed products from Sadhvith Creation. Wooden name plates, custom gifts, and more — made with care and delivered across India.",
  defaultKeywords:
    "sadhvith creation, handcrafted products, wooden name plates, custom gifts, handmade india",
  twitterHandle: "@sadhvithcreation", // update if you have one
  locale: "en_IN",
  themeColor: "#F97316",
  // OG image used when a page / product has no image of its own
  defaultOgImage: "https://sadhvith-creation.vercel.app/og-default.jpg",
};

/**
 * Build a full <title> string.
 *   buildTitle("")            → "Sadhvith Creation | Handcrafted…"
 *   buildTitle("Products")   → "Products | Sadhvith Creation"
 *   buildTitle("Wooden Name Plate", true)  → "Wooden Name Plate – Buy Online | Sadhvith Creation"
 */
export function buildTitle(pageTitle = "", isProduct = false) {
  if (!pageTitle) return SEO_DEFAULTS.defaultTitle;
  const suffix = isProduct
    ? `${pageTitle} – Buy Online | ${SEO_DEFAULTS.siteName}`
    : `${pageTitle} | ${SEO_DEFAULTS.siteName}`;
  return suffix;
}

/**
 * Build a canonical URL for the current page.
 *   buildCanonical("/products/wooden-name-plate")
 *   → "https://sadhvith-creation.vercel.app/products/wooden-name-plate"
 */
export function buildCanonical(path = "") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SEO_DEFAULTS.siteUrl}${clean}`;
}

/**
 * Return all <meta> tag objects for a given page.
 * Pass only the fields relevant to that page; everything else falls back
 * to the site defaults.
 *
 * Usage:
 *   const meta = buildPageMeta({
 *     title: "Wooden Name Plate",
 *     description: "Custom engraved wooden name plates …",
 *     path: "/products/wooden-name-plate",
 *     image: product.images[0],
 *     isProduct: true,
 *     product: { price: 499, currency: "INR", availability: "in stock" },
 *   });
 */
export function buildPageMeta({
  title = "",
  description = "",
  path = "",
  image = "",
  isProduct = false,
  product = null,
  noIndex = false,
} = {}) {
  const fullTitle = buildTitle(title, isProduct);
  const desc = description || SEO_DEFAULTS.defaultDescription;
  const canonical = buildCanonical(path);
  const ogImage = image || SEO_DEFAULTS.defaultOgImage;

  return {
    // ---- Core ----
    title: fullTitle,
    description: desc,
    canonical,
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    // ---- Open Graph ----
    og: {
      title: fullTitle,
      description: desc,
      url: canonical,
      image: ogImage,
      type: isProduct ? "product" : "website",
      siteName: SEO_DEFAULTS.siteName,
      locale: SEO_DEFAULTS.locale,
    },
    // ---- Twitter Card ----
    twitter: {
      card: "summary_large_image",
      site: SEO_DEFAULTS.twitterHandle,
      title: fullTitle,
      description: desc,
      image: ogImage,
    },
    // ---- Product-specific (og:product / schema hints) ----
    ...(isProduct && product
      ? {
          product: {
            price: product.price,
            currency: product.currency || "INR",
            availability: product.availability || "in stock",
            condition: "new",
          },
        }
      : {}),
  };
}

/**
 * Build JSON-LD structured data for a product page.
 * Paste the returned object into a <script type="application/ld+json"> tag.
 */
export function buildProductSchema(product, siteUrl = SEO_DEFAULTS.siteUrl) {
  if (!product) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.shortDescription || "",
    image: product.images || [],
    sku: product.id || product.slug,
    brand: {
      "@type": "Brand",
      name: SEO_DEFAULTS.siteName,
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.finalPrice,
      availability:
        product.inStock === false
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: SEO_DEFAULTS.siteName,
      },
    },
    ...(product.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount || 1,
          },
        }
      : {}),
  };
}

/**
 * Build JSON-LD for the website itself (used on the homepage).
 */
export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO_DEFAULTS.siteName,
    url: SEO_DEFAULTS.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SEO_DEFAULTS.siteUrl}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Build JSON-LD for the local business / organisation.
 */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SEO_DEFAULTS.siteName,
    url: SEO_DEFAULTS.siteUrl,
    logo: `${SEO_DEFAULTS.siteUrl}/favicon.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Telugu", "Kannada"],
    },
    sameAs: [
      // Add real social URLs when available
      // "https://www.instagram.com/sadhvithcreation",
    ],
  };
}

/**
 * Build JSON-LD BreadcrumbList for a product page.
 */
export function buildBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildCanonical(item.path),
    })),
  };
}
