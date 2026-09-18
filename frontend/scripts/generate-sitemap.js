#!/usr/bin/env node

// ============================================================
// generate-sitemap.js
//
// Generates:
//   public/sitemap.xml
//
// Includes:
//   - Static customer pages
//   - Every public product detail URL
//   - Product images where available
//
// Run:
//   npm run sitemap
//
// ============================================================

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/*
 * IMPORTANT:
 * This must be your CUSTOMER frontend URL.
 * It is NOT your Render backend URL.
 */
const SITE_URL = "https://sadhvith-creation.vercel.app";

/*
 * Your production FastAPI backend.
 */
const API_URL =
  process.env.VITE_API_URL ||
  "https://sadhvith-creation.onrender.com/api";

/*
 * Public pages that Google should be able to index.
 */
const STATIC_PAGES = [
  {
    path: "/",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    path: "/products",
    changefreq: "daily",
    priority: "0.9",
  },
  {
    path: "/about",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/contact",
    changefreq: "monthly",
    priority: "0.6",
  },
];

/*
 * Escape characters that have special meaning in XML.
 */
function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/*
 * Convert date to YYYY-MM-DD.
 */
function toW3CDate(date) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().split("T")[0];
  }

  return parsed.toISOString().split("T")[0];
}

/*
 * Normalize different possible API response structures.
 *
 * We support:
 *
 * {
 *   products: [...]
 * }
 *
 * {
 *   data: [...]
 * }
 *
 * {
 *   data: {
 *     products: [...]
 *   }
 * }
 *
 * [...]
 */
function extractProducts(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.data?.products)) {
    return data.data.products;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
}

/*
 * Fetch all public products.
 */
async function fetchAllProducts() {
  const endpoint = `${API_URL}/products?limit=100`;

  console.log(`🌐 API: ${endpoint}`);

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(
      `API returned HTTP ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  console.log(
    "📦 API response keys:",
    data && typeof data === "object" && !Array.isArray(data)
      ? Object.keys(data)
      : "array"
  );

  const products = extractProducts(data);

  return products;
}

/*
 * Create sitemap entries for static pages.
 */
function createStaticEntries(today) {
  return STATIC_PAGES.map(
    ({ path, changefreq, priority }) => `
  <url>
    <loc>${escapeXml(`${SITE_URL}${path}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  ).join("");
}

/*
 * Create sitemap entries for products.
 */
function createProductEntries(products, today) {
  return products
    .filter((product) => {
      if (!product) return false;

      /*
       * Product URL requires a slug.
       */
      if (!product.slug) {
        console.warn(
          `⚠️  Skipping product without slug: ${
            product.title || product.name || "Unknown product"
          }`
        );

        return false;
      }

      return true;
    })
    .map((product) => {
      const slug = product.slug;

      const title =
        product.title ||
        product.name ||
        slug;

      const lastmod =
        product.updatedAt ||
        product.updated_at ||
        product.createdAt ||
        product.created_at ||
        today;

      /*
       * Handle possible image structures.
       */
      let image = null;

      if (Array.isArray(product.images)) {
        image = product.images[0];
      } else if (typeof product.images === "string") {
        image = product.images;
      } else if (product.image) {
        image = product.image;
      }

      /*
       * Some image objects may contain a URL.
       */
      if (image && typeof image === "object") {
        image =
          image.url ||
          image.secure_url ||
          image.src ||
          null;
      }

      const imageXml = image
        ? `
    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
    </image:image>`
        : "";

      return `
  <url>
    <loc>${escapeXml(
      `${SITE_URL}/products/${encodeURIComponent(slug)}`
    )}</loc>
    <lastmod>${toW3CDate(lastmod)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageXml}
  </url>`;
    })
    .join("");
}

/*
 * Main sitemap generation.
 */
async function main() {
  console.log("");
  console.log("==============================================");
  console.log("   SADHVITH CREATION — Sitemap Generator");
  console.log("==============================================");
  console.log("");

  console.log("⏳ Fetching products from API...");

  let products = [];

  try {
    products = await fetchAllProducts();

    console.log(`✅ Got ${products.length} products.`);

    /*
     * IMPORTANT:
     * Do not silently generate a product-free sitemap if
     * the API unexpectedly returns zero products.
     */
    if (products.length === 0) {
      console.warn("");
      console.warn(
        "⚠️ WARNING: API returned 0 products."
      );
      console.warn(
        "⚠️ The sitemap will contain only static pages."
      );
      console.warn("");
    }
  } catch (error) {
    console.error("");
    console.error(
      "❌ Could not fetch products from the API."
    );
    console.error(`❌ ${error.message}`);
    console.error("");

    /*
     * We don't completely stop because the static pages
     * can still be generated.
     */
  }

  const today = toW3CDate(new Date());

  const staticEntries =
    createStaticEntries(today);

  const productEntries =
    createProductEntries(products, today);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${staticEntries}
${productEntries}
</urlset>
`;

  const outputPath = join(
    __dirname,
    "../public/sitemap.xml"
  );

  writeFileSync(
    outputPath,
    xml.trim(),
    "utf8"
  );

  console.log("");
  console.log("==============================================");
  console.log("✅ Sitemap generated successfully");
  console.log("==============================================");
  console.log("");
  console.log(`📄 File: ${outputPath}`);
  console.log(
    `📌 Static URLs: ${STATIC_PAGES.length}`
  );
  console.log(
    `🛍️ Product URLs: ${products.length}`
  );
  console.log(
    `🔗 Total URLs: ${
      STATIC_PAGES.length + products.length
    }`
  );
  console.log("");
}

main().catch((error) => {
  console.error("");
  console.error(
    "❌ Sitemap generation failed:"
  );
  console.error(error);
  console.error("");

  process.exit(1);
});