// src/pages/About.jsx
// Sadhvith Creation - About Page

import { config } from "../config";
import { useSEO } from "../hooks/useSEO";

export default function About() {
  // ============================================================
  // SEO
  // ============================================================

  useSEO({
    title: `About ${config.brandName} | Custom & Personalized Products`,
    description:
      "Learn about Sadhvith Creation, a Bengaluru-based brand creating custom name plates, personalized products and thoughtfully designed creations with attention to detail and quality.",
    path: "/about",
  });

  // ============================================================
  // COMPANY INFORMATION
  // ============================================================

  const company = {
    name: config.brandName,
    email: config.contactEmail,

    location: "Bengaluru, Karnataka, India",

    address:
      "Sadhvith Creations, Bengaluru, Karnataka, India",

    googleMapsUrl:
      "https://maps.app.goo.gl/z7h5ozZ2p1HpBM6a7",

    latitude: "12.8645092",
    longitude: "77.5830326",

    whatsappNumber: config.whatsappNumber,
  };

  // ============================================================
  // SOCIAL MEDIA
  // ============================================================

  const instagramUrl =
    config.social?.instagram || "";

  const facebookUrl =
    config.social?.facebook || "";

  // ============================================================
  // WHATSAPP URL
  // ============================================================

  const whatsappUrl = company.whatsappNumber
    ? `https://wa.me/${String(
        company.whatsappNumber
      ).replace(/\D/g, "")}`
    : "";

  // ============================================================
  // GOOGLE MAP EMBED
  // ============================================================

  const mapEmbedUrl =
    `https://www.google.com/maps?q=${company.latitude},${company.longitude}&z=17&output=embed`;

  // ============================================================
  // ICONS
  // ============================================================

  const InstagramIcon = () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="17.3"
        cy="6.7"
        r="1.2"
        fill="currentColor"
      />
    </svg>
  );

  const FacebookIcon = () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 8h3V4h-3c-2.76 0-5 2.24-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.55.45-1 1-1Z"
        fill="currentColor"
      />
    </svg>
  );

  const MailIcon = () => (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );

  const WhatsappIcon = () => (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L4 20l.9-3.7A8.5 8.5 0 1 1 20.5 11.7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8.4 8.1c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4 0 .6l-.5.7c-.1.2-.1.3 0 .5.4.7 1 1.3 1.7 1.7.2.1.3.1.5 0l.7-.5c.2-.1.4-.1.6 0l1.8.8c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1.1.4-1.5.3-1-.2-2.1-.8-3.1-1.6-1-.8-1.8-1.8-2.3-2.8-.4-.8-.7-1.8-.5-2.5.1-.3.4-1 .6-1.2Z"
        fill="currentColor"
      />
    </svg>
  );

  const LocationIcon = () => (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="9"
        r="2.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );

  const QualityIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m12 3 2.2 2.2 3.1-.2.9 3 2.5 1.8-1.3 2.8.8 3-2.8 1.4-.9 3-3.1-.3L12 21l-2.2-2.3-3.1.3-.9-3-2.8-1.4.8-3-1.3-2.8L5 8l.9-3 3.1.2L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="m8.5 12 2.2 2.2 4.8-4.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const DesignIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 19.5V5.8A1.8 1.8 0 0 1 5.8 4h12.4A1.8 1.8 0 0 1 20 5.8v12.4a1.8 1.8 0 0 1-1.8 1.8H7.2A3.2 3.2 0 0 1 4 16.8v2.7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 9h8M8 13h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );

  const PersonalIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M5 20c.7-3.2 3.2-5 7-5s6.3 1.8 7 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <main
      style={{
        background: "#ffffff",
        color: "#111827",
      }}
    >

      {/* ====================================================== */}
      {/* HERO SECTION */}
      {/* ====================================================== */}

      <section
        style={{
          padding:
            "clamp(55px, 8vw, 90px) 20px 65px",
          background:
            "linear-gradient(180deg, #fffaf5 0%, #ffffff 100%)",
        }}
      >

        <div
          className="container"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >

          <div
            style={{
              maxWidth: "780px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >

            <div
              style={{
                display: "inline-block",
                padding: "7px 14px",
                marginBottom: "18px",
                borderRadius: "999px",
                background: "#fff7ed",
                color: "#F97316",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1.2px",
              }}
            >
              ABOUT US
            </div>


            <h1
              style={{
                margin: "0 0 18px",
                fontSize:
                  "clamp(34px, 6vw, 56px)",
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-1.5px",
                color: "#111827",
              }}
            >
              About{" "}
              <span style={{ color: "#F97316" }}>
                {config.brandName}
              </span>
            </h1>


            <p
              style={{
                maxWidth: "700px",
                margin: "0 auto",
                fontSize: "16px",
                lineHeight: 1.8,
                color: "#6b7280",
              }}
            >
              Thoughtfully designed products made with care,
              attention to detail and a passion for creating
              meaningful pieces for homes, workspaces and
              everyday life.
            </p>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* OUR STORY */}
      {/* ====================================================== */}

      <section
        style={{
          padding: "30px 20px 70px",
        }}
      >

        <div
          className="container"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "28px",
              alignItems: "stretch",
            }}
          >

            {/* STORY */}

            <article
              style={{
                padding: "34px",
                borderRadius: "20px",
                border: "1px solid #e5e7eb",
                background: "#ffffff",
              }}
            >

              <div
                style={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "14px",
                  background: "#fff7ed",
                  color: "#F97316",
                  fontSize: "15px",
                  fontWeight: 800,
                  marginBottom: "20px",
                }}
              >
                SC
              </div>


              <h2
                style={{
                  margin: "0 0 15px",
                  fontSize: "28px",
                  lineHeight: 1.3,
                  color: "#111827",
                }}
              >
                Our Story
              </h2>


              <p
                style={{
                  margin: "0 0 15px",
                  fontSize: "14px",
                  lineHeight: 1.85,
                  color: "#6b7280",
                }}
              >
                {config.brandName} focuses on creating
                thoughtfully designed and beautifully crafted
                products with attention to detail and quality
                in every piece.
              </p>


              <p
                style={{
                  margin: "0 0 15px",
                  fontSize: "14px",
                  lineHeight: 1.85,
                  color: "#6b7280",
                }}
              >
                Our approach is simple: create products that
                look good, feel personal and fit naturally into
                the spaces where people live and work.
              </p>


              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: 1.85,
                  color: "#6b7280",
                }}
              >
                From personalized name plates to custom
                creations, we aim to make each product
                meaningful while maintaining a clean and
                thoughtful design.
              </p>

            </article>


            {/* BRAND MESSAGE */}

            <article
              style={{
                padding: "34px",
                borderRadius: "20px",
                background: "#111827",
                color: "#ffffff",
              }}
            >

              <div
                style={{
                  display: "inline-block",
                  padding: "7px 12px",
                  marginBottom: "22px",
                  borderRadius: "8px",
                  background:
                    "rgba(249,115,22,0.15)",
                  color: "#fb923c",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.8px",
                }}
              >
                OUR APPROACH
              </div>


              <h2
                style={{
                  margin: "0 0 18px",
                  fontSize: "29px",
                  lineHeight: 1.3,
                }}
              >
                Simple products.
                <br />
                Thoughtful details.
              </h2>


              <p
                style={{
                  margin: "0 0 25px",
                  fontSize: "14px",
                  lineHeight: 1.85,
                  color: "#d1d5db",
                }}
              >
                We believe a good product does not need to be
                complicated. It needs a clear purpose, careful
                design and attention to the small details that
                make it feel right.
              </p>


              <div
                style={{
                  height: "3px",
                  width: "70px",
                  background: "#F97316",
                  borderRadius: "10px",
                }}
              />

            </article>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* WHAT WE DO */}
      {/* ====================================================== */}

      <section
        style={{
          padding: "70px 20px",
          background: "#fafafa",
        }}
      >

        <div
          className="container"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >

          <div
            style={{
              maxWidth: "680px",
              margin: "0 auto 38px",
              textAlign: "center",
            }}
          >

            <div
              style={{
                color: "#F97316",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1px",
                marginBottom: "10px",
              }}
            >
              WHAT WE DO
            </div>


            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "32px",
                lineHeight: 1.3,
                color: "#111827",
              }}
            >
              Products made with purpose
            </h2>


            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.8,
                color: "#6b7280",
              }}
            >
              We focus on creating products that combine
              personalization, practical use and thoughtful
              design.
            </p>

          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
            }}
          >

            {[
              {
                icon: <DesignIcon />,
                title: "Thoughtful Design",
                text:
                  "Clean and considered designs created with attention to appearance, usability and detail.",
              },
              {
                icon: <PersonalIcon />,
                title: "Personalisation",
                text:
                  "Personalized products that can add a unique touch to your home, workspace or special occasion.",
              },
              {
                icon: <QualityIcon />,
                title: "Quality & Care",
                text:
                  "We pay attention to the details that help each product look polished and feel carefully made.",
              },
            ].map((item) => (
              <article
                key={item.title}
                style={{
                  padding: "28px",
                  borderRadius: "17px",
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                }}
              >

                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    background: "#fff7ed",
                    color: "#F97316",
                    marginBottom: "20px",
                  }}
                >
                  {item.icon}
                </div>


                <h3
                  style={{
                    margin: "0 0 9px",
                    fontSize: "18px",
                    color: "#111827",
                  }}
                >
                  {item.title}
                </h3>


                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    lineHeight: 1.75,
                    color: "#6b7280",
                  }}
                >
                  {item.text}
                </p>

              </article>
            ))}

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* PRODUCTS */}
      {/* ====================================================== */}

      <section
        style={{
          padding: "70px 20px",
        }}
      >

        <div
          className="container"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >

          <div
            style={{
              textAlign: "center",
              marginBottom: "35px",
            }}
          >

            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "32px",
                color: "#111827",
              }}
            >
              What We Create
            </h2>


            <p
              style={{
                margin: "0 auto",
                maxWidth: "650px",
                fontSize: "14px",
                lineHeight: 1.8,
                color: "#6b7280",
              }}
            >
              Explore our range of custom and personalized
              creations designed to bring a personal touch
              to your space.
            </p>

          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >

            {[
              {
                number: "01",
                title: "Custom Name Plates",
                text:
                  "Personalized name plates designed for homes, doors and other spaces.",
              },
              {
                number: "02",
                title: "Personalized Products",
                text:
                  "Products customized with names, details and personal touches.",
              },
              {
                number: "03",
                title: "Home & Desk",
                text:
                  "Thoughtfully designed products for homes, desks and everyday spaces.",
              },
              {
                number: "04",
                title: "Custom Creations",
                text:
                  "Have a specific idea? Contact us to discuss your requirements.",
              },
            ].map((item) => (
              <article
                key={item.number}
                style={{
                  padding: "25px",
                  minHeight: "170px",
                  boxSizing: "border-box",
                  borderRadius: "16px",
                  border: "1px solid #e5e7eb",
                  background: "#ffffff",
                }}
              >

                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#F97316",
                    marginBottom: "18px",
                  }}
                >
                  {item.number}
                </div>


                <h3
                  style={{
                    margin: "0 0 9px",
                    fontSize: "17px",
                    color: "#111827",
                  }}
                >
                  {item.title}
                </h3>


                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: "#6b7280",
                  }}
                >
                  {item.text}
                </p>

              </article>
            ))}

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* LOCATION + MAP */}
      {/* ====================================================== */}

      <section
        style={{
          padding: "70px 20px",
          background: "#fafafa",
        }}
      >

        <div
          className="container"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >

          <div
            style={{
              maxWidth: "650px",
              margin: "0 auto 35px",
              textAlign: "center",
            }}
          >

            <div
              style={{
                color: "#F97316",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1px",
                marginBottom: "10px",
              }}
            >
              FIND US
            </div>


            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "32px",
                color: "#111827",
              }}
            >
              Our Location
            </h2>


            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.8,
                color: "#6b7280",
              }}
            >
              Sadhvith Creation is based in Bengaluru,
              Karnataka, India.
            </p>

          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(280px, 0.8fr) minmax(320px, 1.4fr)",
              gap: "22px",
              alignItems: "stretch",
            }}
          >

            {/* LOCATION CARD */}

            <div
              style={{
                padding: "30px",
                borderRadius: "18px",
                background: "#111827",
                color: "#ffffff",
              }}
            >

              <div
                style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  background: "#F97316",
                  color: "#ffffff",
                  marginBottom: "20px",
                }}
              >
                <LocationIcon />
              </div>


              <h3
                style={{
                  margin: "0 0 10px",
                  fontSize: "24px",
                }}
              >
                Bengaluru
              </h3>


              <p
                style={{
                  margin: "0 0 24px",
                  fontSize: "14px",
                  lineHeight: 1.8,
                  color: "#d1d5db",
                }}
              >
                {company.location}
              </p>


              <div
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  background:
                    "rgba(255,255,255,0.06)",
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                  marginBottom: "20px",
                }}
              >

                <div
                  style={{
                    marginBottom: "5px",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    color: "#9ca3af",
                  }}
                >
                  Address
                </div>


                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: "#f3f4f6",
                  }}
                >
                  {company.address}
                </div>

              </div>


              <a
                href={company.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "12px 18px",
                  borderRadius: "8px",
                  background: "#F97316",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                Open in Google Maps →
              </a>

            </div>


            {/* MAP */}

            <div
              style={{
                minHeight: "390px",
                overflow: "hidden",
                borderRadius: "18px",
                background: "#e5e7eb",
                border: "1px solid #e5e7eb",
              }}
            >

              <iframe
                title="Sadhvith Creations location on Google Maps"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{
                  display: "block",
                  width: "100%",
                  minHeight: "390px",
                  border: 0,
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* GET IN TOUCH */}
      {/* ====================================================== */}

      <section
        style={{
          padding: "70px 20px",
        }}
      >

        <div
          className="container"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >

          <div
            style={{
              maxWidth: "650px",
              margin: "0 auto 35px",
              textAlign: "center",
            }}
          >

            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "32px",
                color: "#111827",
              }}
            >
              Get in Touch
            </h2>


            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.8,
                color: "#6b7280",
              }}
            >
              Have a question about a product, customisation,
              materials or sizing? We would be happy to help.
            </p>

          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "18px",
            }}
          >

            {/* EMAIL */}

            <a
              href={`mailto:${company.email}`}
              style={{
                textDecoration: "none",
              }}
            >

              <div
                style={{
                  minHeight: "145px",
                  boxSizing: "border-box",
                  padding: "24px",
                  borderRadius: "16px",
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                }}
              >

                <div
                  style={{
                    color: "#F97316",
                    marginBottom: "17px",
                  }}
                >
                  <MailIcon />
                </div>


                <div
                  style={{
                    marginBottom: "6px",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    color: "#9ca3af",
                  }}
                >
                  EMAIL
                </div>


                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#111827",
                    wordBreak: "break-word",
                  }}
                >
                  {company.email}
                </div>

              </div>

            </a>


            {/* WHATSAPP */}

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                }}
              >

                <div
                  style={{
                    minHeight: "145px",
                    boxSizing: "border-box",
                    padding: "24px",
                    borderRadius: "16px",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                  }}
                >

                  <div
                    style={{
                      color: "#F97316",
                      marginBottom: "17px",
                    }}
                  >
                    <WhatsappIcon />
                  </div>


                  <div
                    style={{
                      marginBottom: "6px",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      color: "#9ca3af",
                    }}
                  >
                    WHATSAPP
                  </div>


                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    Chat with us
                  </div>

                </div>

              </a>
            )}


            {/* LOCATION */}

            <a
              href={company.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
              }}
            >

              <div
                style={{
                  minHeight: "145px",
                  boxSizing: "border-box",
                  padding: "24px",
                  borderRadius: "16px",
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                }}
              >

                <div
                  style={{
                    color: "#F97316",
                    marginBottom: "17px",
                  }}
                >
                  <LocationIcon />
                </div>


                <div
                  style={{
                    marginBottom: "6px",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    color: "#9ca3af",
                  }}
                >
                  LOCATION
                </div>


                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Bengaluru, Karnataka
                </div>

              </div>

            </a>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* SOCIAL MEDIA */}
      {/* ====================================================== */}

      <section
        style={{
          padding: "0 20px 70px",
        }}
      >

        <div
          className="container"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >

          <div
            style={{
              padding: "38px 25px",
              borderRadius: "20px",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              textAlign: "center",
            }}
          >

            <div
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1px",
                color: "#F97316",
                marginBottom: "9px",
              }}
            >
              STAY CONNECTED
            </div>


            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "28px",
                color: "#111827",
              }}
            >
              Follow {config.brandName}
            </h2>


            <p
              style={{
                maxWidth: "580px",
                margin: "0 auto 24px",
                fontSize: "14px",
                lineHeight: 1.7,
                color: "#6b7280",
              }}
            >
              Follow us on social media for new products,
              updates and personalized creations.
            </p>


            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >

              {/* INSTAGRAM */}

              {instagramUrl ? (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sadhvith Creation on Instagram"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "9px",
                    padding: "12px 20px",
                    borderRadius: "10px",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    color: "#111827",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  <InstagramIcon />
                  Instagram
                </a>
              ) : (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "9px",
                    padding: "12px 20px",
                    borderRadius: "10px",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    color: "#111827",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  <InstagramIcon />
                  Instagram
                </div>
              )}


              {/* FACEBOOK */}

              {facebookUrl ? (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sadhvith Creation on Facebook"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "9px",
                    padding: "12px 20px",
                    borderRadius: "10px",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    color: "#111827",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  <FacebookIcon />
                  Facebook
                </a>
              ) : (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "9px",
                    padding: "12px 20px",
                    borderRadius: "10px",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    color: "#111827",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  <FacebookIcon />
                  Facebook
                </div>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}

      <section
        style={{
          padding: "0 20px 80px",
        }}
      >

        <div
          className="container"
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >

          <div
            style={{
              padding:
                "clamp(35px, 6vw, 55px) 25px",
              borderRadius: "22px",
              background: "#111827",
              textAlign: "center",
              color: "#ffffff",
            }}
          >

            <h2
              style={{
                margin: "0 0 12px",
                fontSize:
                  "clamp(25px, 4vw, 34px)",
                lineHeight: 1.3,
              }}
            >
              Have Something in Mind?
            </h2>


            <p
              style={{
                maxWidth: "620px",
                margin: "0 auto 25px",
                fontSize: "14px",
                lineHeight: 1.8,
                color: "#d1d5db",
              }}
            >
              Looking for a custom name plate, personalized
              product or something made especially for you?
              Get in touch with us.
            </p>


            <a
              href="/contact"
              style={{
                display: "inline-block",
                padding: "13px 26px",
                borderRadius: "9px",
                background: "#F97316",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              Contact Us
            </a>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* RESPONSIVE OVERRIDES */}
      {/* ====================================================== */}

      <style>
        {`
          @media (max-width: 760px) {

            .about-page iframe {
              min-height: 300px !important;
            }

          }

          @media (max-width: 620px) {

            .about-page {
              overflow-x: hidden;
            }

          }

          @media (max-width: 560px) {

            .about-page a {
              max-width: 100%;
            }

          }
        `}
      </style>

    </main>
  );
}