import {
  SEO_DEFAULTS,
  setStructuredData,
  removeStructuredData,
} from "./seo";

const SITE_URL = SEO_DEFAULTS.siteUrl;

export function setBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Sadhvith Creation",
        url: SITE_URL,
        description:
          "Sadhvith Creation creates custom name plates, personalized products and thoughtfully designed products.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Sadhvith Creation",
        description:
          "Custom name plates, personalized products and thoughtfully designed products.",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
    ],
  };

  setStructuredData("business-schema", schema);
}

export function removeBusinessSchema() {
  removeStructuredData("business-schema");
}