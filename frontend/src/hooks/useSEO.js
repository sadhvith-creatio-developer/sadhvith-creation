// ============================================================
//  useSEO.js  — Replace your current usePageTitle hook with this.
//  Location:  src/hooks/useSEO.js
//
//  Usage examples:
//
//  // Home page
//  useSEO({ path: "/" });
//
//  // Products listing
//  useSEO({ title: "Our Products", description: "Browse handcrafted …", path: "/products" });
//
//  // Product detail (dynamic)
//  useSEO({
//    title: product.title,
//    description: product.description,
//    path: `/products/${product.slug}`,
//    image: product.images?.[0],
//    isProduct: true,
//    schemas: [buildProductSchema(product), buildBreadcrumbSchema([…])],
//  });
// ============================================================

import { useEffect } from "react";
import {
  buildPageMeta,
  buildWebsiteSchema,
  buildOrganizationSchema,
  SEO_DEFAULTS,
} from "../utils/seo";

/**
 * Helper: upsert a <meta> tag in <head>.
 * Uses name= for standard metas, property= for og:, twitter is name=.
 */
function setMeta(attr, value, content) {
  let el = document.querySelector(`meta[${attr}="${value}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Helper: upsert a <link> tag (rel="canonical" etc.) */
function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Helper: inject / replace a JSON-LD <script> block by a data-id key */
function setJsonLd(id, data) {
  let el = document.querySelector(`script[type="application/ld+json"][data-id="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-id", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data, null, 2);
}

/** Helper: remove a JSON-LD block (called on unmount for product schemas) */
function removeJsonLd(id) {
  const el = document.querySelector(`script[type="application/ld+json"][data-id="${id}"]`);
  if (el) el.remove();
}

/**
 * Main hook.
 *
 * @param {object} opts
 * @param {string}   opts.title        - Page title (omit for homepage)
 * @param {string}   opts.description  - Meta description
 * @param {string}   opts.path         - URL path, e.g. "/products/wooden-name-plate"
 * @param {string}   opts.image        - Full OG image URL
 * @param {boolean}  opts.isProduct    - Enables product-specific OG type
 * @param {object}   opts.productData  - { price, currency, availability } for og:product
 * @param {object[]} opts.schemas      - Extra JSON-LD objects (product, breadcrumb, etc.)
 * @param {boolean}  opts.noIndex      - Set robots noindex
 */
export function useSEO({
  title = "",
  description = "",
  path = "",
  image = "",
  isProduct = false,
  productData = null,
  schemas = [],
  noIndex = false,
} = {}) {
  useEffect(() => {
    const meta = buildPageMeta({ title, description, path, image, isProduct, product: productData, noIndex });

    // ---- <title> ----
    document.title = meta.title;

    // ---- Core meta ----
    setMeta("name", "description", meta.description);
    setMeta("name", "robots", meta.robots);
    setMeta("name", "theme-color", SEO_DEFAULTS.themeColor);

    // ---- Canonical ----
    setLink("canonical", meta.canonical);

    // ---- Open Graph ----
    setMeta("property", "og:title", meta.og.title);
    setMeta("property", "og:description", meta.og.description);
    setMeta("property", "og:url", meta.og.url);
    setMeta("property", "og:image", meta.og.image);
    setMeta("property", "og:type", meta.og.type);
    setMeta("property", "og:site_name", meta.og.siteName);
    setMeta("property", "og:locale", meta.og.locale);

    // Product-specific OG tags
    if (isProduct && meta.product) {
      setMeta("property", "product:price:amount", meta.product.price);
      setMeta("property", "product:price:currency", meta.product.currency);
      setMeta("property", "product:availability", meta.product.availability);
      setMeta("property", "product:condition", meta.product.condition);
    }

    // ---- Twitter Card ----
    setMeta("name", "twitter:card", meta.twitter.card);
    setMeta("name", "twitter:site", meta.twitter.site);
    setMeta("name", "twitter:title", meta.twitter.title);
    setMeta("name", "twitter:description", meta.twitter.description);
    setMeta("name", "twitter:image", meta.twitter.image);

    // ---- Persistent site-wide JSON-LD (never removed) ----
    setJsonLd("website", buildWebsiteSchema());
    setJsonLd("organization", buildOrganizationSchema());

    // ---- Page-specific JSON-LD schemas ----
    schemas.forEach((schema, i) => {
      if (schema) setJsonLd(`page-schema-${i}`, schema);
    });

    // Cleanup: remove page-specific schemas when navigating away
    return () => {
      schemas.forEach((_, i) => removeJsonLd(`page-schema-${i}`));
    };
  }, [title, description, path, image, isProduct, productData, schemas, noIndex]);
}

// Convenience re-export so existing code can do:
//   import { usePageTitle } from "../hooks/useSEO";
// and not break.
export function usePageTitle(title) {
  useSEO({ title, path: window.location.pathname });
}
