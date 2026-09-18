// src/pages/Contact.jsx
// Sadhvith Creation - Professional Contact Page

import {
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Facebook,
  Clock,
  HelpCircle,
  ArrowUpRight,
  Phone,
} from "lucide-react";

import WhatsAppButton from "../components/WhatsAppButton";
import { config } from "../config";
import { useSEO } from "../hooks/useSEO";

export default function Contact() {
  // ============================================================
  // SEO
  // ============================================================

  useSEO({
    title: "Contact Us | Sadhvith Creation",
    description:
      "Contact Sadhvith Creation in Bengaluru for custom name plates, personalized products, product questions, custom orders and other enquiries. Connect with us through WhatsApp or email.",
    path: "/contact",
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
  // GOOGLE MAP EMBED
  // ============================================================

  const mapEmbedUrl =
    `https://www.google.com/maps?q=${company.latitude},${company.longitude}&z=17&output=embed`;

  // ============================================================
  // WHATSAPP URL
  // ============================================================

  const whatsappUrl = company.whatsappNumber
    ? `https://wa.me/${String(
        company.whatsappNumber
      ).replace(/\D/g, "")}`
    : "";

  // ============================================================
  // FAQ DATA
  // ============================================================

  const faqs = [
    {
      question: "How can I ask about a product?",
      answer:
        "You can contact us through WhatsApp or email. Share the product name and your question, and we will help you with the details.",
    },

    {
      question: "Do you accept custom orders?",
      answer:
        "For personalized or custom requirements, contact us with your idea and requirements. We can discuss the available options with you.",
    },

    {
      question: "Can I ask about materials and sizing?",
      answer:
        "Yes. If you need information about materials, dimensions, customization or product details, contact us before placing your order.",
    },

    {
      question: "Where is Sadhvith Creation located?",
      answer:
        "Sadhvith Creation is based in Bengaluru, Karnataka, India. You can use the map on this page to view our location.",
    },
  ];

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
              maxWidth: "760px",
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
              CONTACT US
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
              Get in{" "}
              <span style={{ color: "#F97316" }}>
                Touch
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
              Have a question about a product, customisation,
              materials, sizing or a custom order? We would
              be happy to hear from you.
            </p>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* PRIMARY CONTACT OPTIONS */}
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
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >

            {/* ================================================== */}
            {/* WHATSAPP */}
            {/* ================================================== */}

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
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "13px",
                  background: "#F97316",
                  marginBottom: "20px",
                }}
              >
                <MessageCircle
                  size={24}
                />
              </div>


              <div
                style={{
                  marginBottom: "7px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  color: "#9ca3af",
                }}
              >
                WHATSAPP
              </div>


              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "24px",
                  lineHeight: 1.3,
                }}
              >
                Chat with us
              </h2>


              <p
                style={{
                  margin: "0 0 22px",
                  fontSize: "14px",
                  lineHeight: 1.8,
                  color: "#d1d5db",
                }}
              >
                The easiest way to ask questions about
                products, customisation and orders.
              </p>


              <WhatsAppButton
                size="lg"
                label="Chat on WhatsApp"
              />

            </div>


            {/* ================================================== */}
            {/* EMAIL */}
            {/* ================================================== */}

            <div
              style={{
                padding: "30px",
                borderRadius: "18px",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
              }}
            >

              <div
                style={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "13px",
                  background: "#fff7ed",
                  color: "#F97316",
                  marginBottom: "20px",
                }}
              >
                <Mail size={24} />
              </div>


              <div
                style={{
                  marginBottom: "7px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  color: "#9ca3af",
                }}
              >
                EMAIL
              </div>


              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "24px",
                  lineHeight: 1.3,
                  color: "#111827",
                }}
              >
                Send us an email
              </h2>


              <p
                style={{
                  margin: "0 0 20px",
                  fontSize: "14px",
                  lineHeight: 1.8,
                  color: "#6b7280",
                }}
              >
                Send your questions, requirements or
                custom-order enquiries directly to us.
              </p>


              {company.email && (
                <a
                  href={`mailto:${company.email}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 16px",
                    borderRadius: "9px",
                    background: "#fff7ed",
                    color: "#F97316",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 700,
                    wordBreak: "break-word",
                  }}
                >
                  <Mail size={16} />
                  Email Us
                  <ArrowUpRight size={15} />
                </a>
              )}

            </div>


            {/* ================================================== */}
            {/* LOCATION */}
            {/* ================================================== */}

            <div
              style={{
                padding: "30px",
                borderRadius: "18px",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
              }}
            >

              <div
                style={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "13px",
                  background: "#fff7ed",
                  color: "#F97316",
                  marginBottom: "20px",
                }}
              >
                <MapPin size={24} />
              </div>


              <div
                style={{
                  marginBottom: "7px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  color: "#9ca3af",
                }}
              >
                LOCATION
              </div>


              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "24px",
                  lineHeight: 1.3,
                  color: "#111827",
                }}
              >
                Bengaluru
              </h2>


              <p
                style={{
                  margin: "0 0 20px",
                  fontSize: "14px",
                  lineHeight: 1.8,
                  color: "#6b7280",
                }}
              >
                {company.location}
              </p>


              <a
                href={company.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  borderRadius: "9px",
                  background: "#F97316",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                <MapPin size={16} />
                Open in Google Maps
                <ArrowUpRight size={15} />
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* HOW CAN WE HELP */}
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
              HOW CAN WE HELP?
            </div>


            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "32px",
                lineHeight: 1.3,
                color: "#111827",
              }}
            >
              Tell us what you need
            </h2>


            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.8,
                color: "#6b7280",
              }}
            >
              Whether you are looking for a product or have
              something specific in mind, reach out to us and
              we will help you with the next step.
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

            {[
              {
                number: "01",
                title: "Product Questions",
                text:
                  "Need more information about a product, size, material or available options?",
              },
              {
                number: "02",
                title: "Custom Orders",
                text:
                  "Have a personalized requirement or a custom idea you would like to discuss?",
              },
              {
                number: "03",
                title: "Order Enquiries",
                text:
                  "Need help with an existing enquiry or want to discuss your requirements?",
              },
              {
                number: "04",
                title: "General Questions",
                text:
                  "Have another question about Sadhvith Creation? We are happy to help.",
              },
            ].map((item) => (
              <article
                key={item.number}
                style={{
                  padding: "25px",
                  minHeight: "180px",
                  boxSizing: "border-box",
                  borderRadius: "16px",
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                }}
              >

                <div
                  style={{
                    marginBottom: "18px",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#F97316",
                    letterSpacing: "0.5px",
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
      {/* LOCATION + MAP */}
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
              Visit our location in Bengaluru or open the
              exact location in Google Maps.
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

            {/* LOCATION INFORMATION */}

            <div
              style={{
                padding: "32px",
                borderRadius: "18px",
                background: "#111827",
                color: "#ffffff",
              }}
            >

              <div
                style={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "13px",
                  background: "#F97316",
                  marginBottom: "20px",
                }}
              >
                <MapPin size={24} />
              </div>


              <h3
                style={{
                  margin: "0 0 10px",
                  fontSize: "26px",
                }}
              >
                Sadhvith Creation
              </h3>


              <p
                style={{
                  margin: "0 0 22px",
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
                  marginBottom: "20px",
                  borderRadius: "12px",
                  background:
                    "rgba(255,255,255,0.06)",
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                }}
              >

                <div
                  style={{
                    marginBottom: "6px",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.8px",
                    color: "#9ca3af",
                    textTransform: "uppercase",
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
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 17px",
                  borderRadius: "8px",
                  background: "#F97316",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                <MapPin size={16} />
                Open Google Maps
                <ArrowUpRight size={15} />
              </a>

            </div>


            {/* GOOGLE MAP */}

            <div
              style={{
                minHeight: "390px",
                overflow: "hidden",
                borderRadius: "18px",
                border: "1px solid #e5e7eb",
                background: "#e5e7eb",
              }}
            >

              <iframe
                title="Sadhvith Creation location on Google Maps"
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
      {/* BUSINESS INFORMATION */}
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

            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "32px",
                color: "#111827",
              }}
            >
              Contact Information
            </h2>


            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.8,
                color: "#6b7280",
              }}
            >
              Choose the contact method that works best for
              you.
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

            {/* EMAIL */}

            <a
              href={`mailto:${company.email}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >

              <div
                style={{
                  padding: "25px",
                  minHeight: "145px",
                  boxSizing: "border-box",
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                }}
              >

                <Mail
                  size={23}
                  color="#F97316"
                />


                <div
                  style={{
                    marginTop: "17px",
                    marginBottom: "6px",
                    fontSize: "10px",
                    fontWeight: 800,
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
                  color: "inherit",
                }}
              >

                <div
                  style={{
                    padding: "25px",
                    minHeight: "145px",
                    boxSizing: "border-box",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                  }}
                >

                  <MessageCircle
                    size={23}
                    color="#F97316"
                  />


                  <div
                    style={{
                      marginTop: "17px",
                      marginBottom: "6px",
                      fontSize: "10px",
                      fontWeight: 800,
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
                color: "inherit",
              }}
            >

              <div
                style={{
                  padding: "25px",
                  minHeight: "145px",
                  boxSizing: "border-box",
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                }}
              >

                <MapPin
                  size={23}
                  color="#F97316"
                />


                <div
                  style={{
                    marginTop: "17px",
                    marginBottom: "6px",
                    fontSize: "10px",
                    fontWeight: 800,
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
              padding: "40px 25px",
              borderRadius: "20px",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              textAlign: "center",
            }}
          >

            <div
              style={{
                marginBottom: "9px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1px",
                color: "#F97316",
              }}
            >
              STAY CONNECTED
            </div>


            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "29px",
                color: "#111827",
              }}
            >
              Follow {config.brandName}
            </h2>


            <p
              style={{
                maxWidth: "570px",
                margin: "0 auto 25px",
                fontSize: "14px",
                lineHeight: 1.8,
                color: "#6b7280",
              }}
            >
              Stay connected with us for new products,
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

              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sadhvith Creation Instagram"
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

                  <Instagram
                    size={21}
                    color="#F97316"
                  />

                  Instagram

                  <ArrowUpRight
                    size={15}
                    color="#9ca3af"
                  />

                </a>
              )}


              {/* FACEBOOK */}

              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sadhvith Creation Facebook"
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

                  <Facebook
                    size={21}
                    color="#F97316"
                  />

                  Facebook

                  <ArrowUpRight
                    size={15}
                    color="#9ca3af"
                  />

                </a>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* FAQ */}
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
            maxWidth: "900px",
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
              FAQ
            </div>


            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "32px",
                color: "#111827",
              }}
            >
              Frequently Asked Questions
            </h2>


            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.8,
                color: "#6b7280",
              }}
            >
              A few common questions before you get in touch.
            </p>

          </div>


          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >

            {faqs.map((faq) => (
              <details
                key={faq.question}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "13px",
                  padding: "18px 20px",
                }}
              >

                <summary
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    listStyle: "none",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >

                  <HelpCircle
                    size={19}
                    color="#F97316"
                    style={{
                      flexShrink: 0,
                    }}
                  />

                  {faq.question}

                </summary>


                <p
                  style={{
                    margin:
                      "15px 0 2px 31px",
                    fontSize: "13px",
                    lineHeight: 1.8,
                    color: "#6b7280",
                  }}
                >
                  {faq.answer}
                </p>

              </details>
            ))}

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}

      <section
        style={{
          padding: "70px 20px 85px",
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

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                marginBottom: "18px",
                borderRadius: "12px",
                background: "#F97316",
              }}
            >
              <Phone size={22} />
            </div>


            <h2
              style={{
                margin: "0 0 12px",
                fontSize:
                  "clamp(25px, 4vw, 34px)",
                lineHeight: 1.3,
              }}
            >
              Ready to Get Started?
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
              Contact us with your product question,
              customization requirement or idea. We would
              be happy to hear from you.
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

              <WhatsAppButton
                size="lg"
                label="Chat on WhatsApp"
              />


              {company.email && (
                <a
                  href={`mailto:${company.email}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "13px 22px",
                    borderRadius: "9px",
                    background: "#ffffff",
                    color: "#111827",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  <Mail size={17} />
                  Email Us
                </a>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================== */}
      {/* MOBILE RESPONSIVE STYLES */}
      {/* ====================================================== */}

      <style>
        {`

          @media (max-width: 800px) {

            .contact-page-map {
              grid-template-columns: 1fr !important;
            }

          }


          @media (max-width: 600px) {

            .contact-page-social {
              flex-direction: column;
            }

          }


          @media (max-width: 520px) {

            .contact-page-buttons {
              flex-direction: column;
            }

            .contact-page-buttons a {
              width: 100%;
              box-sizing: border-box;
              justify-content: center;
            }

          }

        `}
      </style>

    </main>
  );
}