# SADHVITH CREATION — Full-Stack Application

A complete full-stack product catalogue for **Sadhvith Creation**, with
**three separate React/Vite frontends** — a public customer storefront, a
manager/uploader dashboard, and a full-access admin dashboard — sharing
**one** FastAPI backend, **one** MongoDB Atlas database, and **one**
Cloudinary account.

```
sadhvith-creation-fullstack/
├── backend/            FastAPI + PyMongo + JWT + Cloudinary + SMTP (the ONLY backend)
├── frontend/            Customer storefront — React + Vite → Vercel project #1
├── manager-frontend/    Manager/uploader dashboard — React + Vite → Vercel project #2
├── admin-frontend/      Admin dashboard (full access) — React + Vite → Vercel project #3
├── README.md             (this file)
└── .gitignore
```

```
       CUSTOMER FRONTEND  ──┐
                             ├──►  FASTAPI BACKEND  ──►  MONGODB ATLAS
  MANAGER FRONTEND (admin)  ─┤              │
                             │              ├──►  CLOUDINARY (images)
    ADMIN FRONTEND (admin)  ─┘              └──►  SMTP (OTP emails)
```

Every frontend calls the same REST API and reads/writes the same
database — there's no separate database per role. When a manager or an
admin adds/edits a product, it appears on the customer site immediately.

## Roles at a glance

|                         | Customer site | Manager dashboard             | Admin dashboard                  |
| ----------------------- | ------------- | ----------------------------- | -------------------------------- |
| Login required          | No            | Yes                           | Yes                              |
| Product management      | View only     | Full (add/edit/delete/upload) | Full (add/edit/delete/upload)    |
| Manage manager accounts | —            | —                            | Yes (activate/deactivate/delete) |
| Registration            | —            | Self-service, OTP-verified    | Self-service, OTP-verified       |

Admin has **full access**: everything a Manager can do, plus visibility
and control over every Manager account. This is enforced **on the
backend** — an admin JWT is accepted anywhere a manager JWT is, but not
the other way around.

## What's included

- **OTP-verified registration** for both Manager and Admin accounts: submit
  your details → a 6-digit code is emailed to you → enter the code → your
  account is created and you're logged in. Nothing is written to the
  database until the email is verified.
- **Forgot password**, also OTP-based: request a code by email → enter the
  code with a new password → done. Codes expire after 10 minutes, are
  rate-limited, and are stored hashed (never in plain text).
- Manager-only and Admin-only API endpoints are protected **on the
  backend** with JWTs — hiding a frontend route is never the only
  protection. A deactivated account is rejected immediately, even with a
  still-valid JWT, because every request re-checks the account's status.
- A dedicated Admin dashboard (separate app, separate deployment) with a
  "Managers" page: search, activate/deactivate, and delete manager
  accounts, plus combined stats (products + managers + admins).
- A dedicated Manager dashboard: stats cards, a searchable/filterable
  product table, add/edit forms with image upload, delete confirmation.
- Full product CRUD, protected by JWT, usable by either role.
- Up to 5 images per product, uploaded to Cloudinary.
- Automatic offer/discount calculation — the backend is the single source
  of truth for pricing.
- A polished public customer catalogue: home page, product listing with
  search/filter/sort, product details with a gallery, about/contact pages,
  and a WhatsApp enquiry button.
- Consistent loading/empty/error states across all three frontends.
- Swagger API docs at `/docs`.

---

## 1. Requirements

- [Node.js](https://nodejs.org/) 18+
- [Python](https://www.python.org/) 3.10+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- A free [Cloudinary](https://cloudinary.com/) account
- An SMTP provider to send OTP emails (see section 4) — optional for local
  development, required in production

---

## 2. MongoDB Atlas setup

1. Create a free account at https://www.mongodb.com/cloud/atlas.
2. Create a new cluster (the free M0 tier is enough).
3. Under **Database Access**, create a database user with a username and
   password.
4. Under **Network Access**, add your IP address (or `0.0.0.0/0` while
   developing, then restrict it later).
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority`
6. Paste it into `backend/.env` as `MONGODB_URI` (see step 5 below).

> **Important:** if this project (or an earlier version of it) ever had
> real credentials committed to a `.env` or `.env.example` file, treat
> them as compromised and rotate them immediately.

## 3. Cloudinary setup

1. Create a free account at https://cloudinary.com/.
2. On your [Cloudinary console](https://cloudinary.com/console), copy:
   **Cloud Name**, **API Key**, **API Secret**.
3. Paste them into `backend/.env`. The API secret is backend-only — it's
   never sent to, or stored in, any frontend.

## 4. SMTP setup (for OTP emails)

Any SMTP provider works — Gmail, Outlook, SendGrid, Mailgun, Brevo, your
hosting provider, etc. For Gmail specifically:

1. Enable 2-Step Verification on the Google account.
2. Create an **App Password** (Google Account → Security → App Passwords).
3. Use:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your.email@gmail.com
   SMTP_PASSWORD=<the 16-character app password>
   SMTP_USE_TLS=true
   ```

**Local development without SMTP:** leave `SMTP_HOST` blank in
`backend/.env`. OTP codes will be printed to the backend console/log
instead of emailed, so you can still test the full registration and
password-reset flow — just copy the code from the terminal.

---

## 5. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# now edit .env and fill in real values
```

`backend/.env` (all values are read by `app/config.py`):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
MONGODB_DB_NAME=sadhvith_creation

JWT_SECRET=<a long random string — generate with: openssl rand -hex 32>
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

CLOUDINARY_CLOUD_NAME=<your cloud name>
CLOUDINARY_API_KEY=<your api key>
CLOUDINARY_API_SECRET=<your api secret>

# CORS — one origin per frontend
FRONTEND_URL=http://localhost:5173
MANAGER_FRONTEND_URL=http://localhost:5174
ADMIN_FRONTEND_URL=http://localhost:5175

PORT=8000
ENV=development

WHATSAPP_NUMBER=91XXXXXXXXXX
MAX_IMAGE_SIZE_MB=5

# SMTP (leave SMTP_HOST blank for local dev — see section 4)
SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_USE_TLS=true
SMTP_FROM_EMAIL=no-reply@sadhvithcreation.example
SMTP_FROM_NAME=SADHVITH CREATION

OTP_EXPIRE_MINUTES=10
OTP_MAX_ATTEMPTS=5
OTP_RESEND_COOLDOWN_SECONDS=45
```

Run the API:

```bash
uvicorn app.main:app --reload --port 8000
```

Visit http://localhost:8000/docs for interactive API docs, and
http://localhost:8000/api/health to check the health endpoint.

Optionally seed a handful of sample products:

```bash
python seed.py
```

There is no seed step for accounts — register your first Manager and
Admin accounts through their respective frontends (see below).

---

## 6. Customer frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

`frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_WHATSAPP_NUMBER=91XXXXXXXXXX
```

```bash
npm run dev       # http://localhost:5173
npm run build     # production build → frontend/dist
```

This app only calls public, unauthenticated product endpoints — no login,
no admin code.

---

## 7. Manager frontend setup

```bash
cd manager-frontend
npm install
cp .env.example .env
```

`manager-frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_CUSTOMER_SITE_URL=http://localhost:5173
```

```bash
npm run dev       # http://localhost:5174
npm run build     # production build → manager-frontend/dist
```

Open http://localhost:5174/register, enter your details, check the
backend console (or your inbox, if SMTP is configured) for the 6-digit
code, enter it, and you're in.

---

## 8. Admin frontend setup

```bash
cd admin-frontend
npm install
cp .env.example .env
```

`admin-frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_CUSTOMER_SITE_URL=http://localhost:5173
```

```bash
npm run dev       # http://localhost:5175
npm run build     # production build → admin-frontend/dist
```

Register the same way as a Manager (http://localhost:5175/register), via
OTP. Once logged in, an Admin can manage products (same as a Manager) and
also open **Managers** in the sidebar to see every Manager account and
activate, deactivate, or delete one.

There is no public link to either dashboard from the customer storefront —
share their URLs only with the people who need them.

---

## 9. How the three frontends share one database/API

- All three frontends call the same `VITE_API_URL` (the one FastAPI
  backend).
- The backend talks to **one** MongoDB Atlas database
  (`MONGODB_DB_NAME`). Manager and Admin accounts live in one `accounts`
  collection, distinguished by a `role` field — there's no separate
  database per role.
- Manager-only endpoints (product create/update/delete,
  `/api/products/manager/all`, `/api/manager/dashboard`) accept **either**
  a Manager or an Admin JWT. Admin-only endpoints
  (`/api/admin/managers`, `/api/admin/dashboard`, etc.) accept **only** an
  Admin JWT. Both are enforced server-side, re-checked on every request.
- When a manager or admin saves a product, it's written straight to
  `products` in MongoDB. The customer site's product pages fetch straight
  from `GET /api/products`, so the change is visible immediately.

---

## 10. Deployment

### Backend → Render

1. Push this repo to GitHub.
2. In Render, create a **Web Service** pointing at the `backend/` folder.
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables from `backend/.env.example` (with real
   values) in Render's dashboard, including your SMTP credentials. Set
   `FRONTEND_URL`, `MANAGER_FRONTEND_URL`, and `ADMIN_FRONTEND_URL` to
   your three Vercel URLs once you have them, and `ENV=production`.

### Customer frontend → Vercel (project #1)

1. Import this repo into Vercel, root directory `frontend`.
2. Env vars: `VITE_API_URL`, `VITE_WHATSAPP_NUMBER`.
3. `frontend/vercel.json` is already included for SPA routing.

### Manager frontend → Vercel (project #2)

1. Import the same repo again, root directory `manager-frontend`.
2. Env vars: `VITE_API_URL`, `VITE_CUSTOMER_SITE_URL`.
3. `manager-frontend/vercel.json` is already included.

### Admin frontend → Vercel (project #3)

1. Import the same repo again, root directory `admin-frontend`.
2. Env vars: `VITE_API_URL`, `VITE_CUSTOMER_SITE_URL`.
3. `admin-frontend/vercel.json` is already included.
4. Once deployed, set `ADMIN_FRONTEND_URL` (and `MANAGER_FRONTEND_URL`) on
   the Render backend and redeploy it so CORS allows both.

### Database → MongoDB Atlas / Images → Cloudinary

Covered in sections 2–3 — make sure Atlas's Network Access allow-list
includes Render's outbound IPs (or `0.0.0.0/0`).

---

## 11. Security notes

- Passwords are hashed with bcrypt — never stored in plain text.
- OTP codes are hashed (with a server-side pepper) before being stored,
  expire after `OTP_EXPIRE_MINUTES`, and are rate-limited (max attempts,
  resend cooldown). A MongoDB TTL index removes expired codes
  automatically.
- JWTs are signed with `JWT_SECRET`, carry a `role` claim, and expire
  after `JWT_EXPIRE_MINUTES`.
- `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_API_SECRET`, and SMTP
  credentials live **only** in `backend/.env` — never in any frontend's
  `VITE_*` variables.
- CORS is restricted to exactly the three configured frontend origins
  (plus localhost dev ports) — no wildcard, since requests are
  credentialed.
- Every protected endpoint re-verifies the JWT and re-fetches the account
  from the database on each request, so a deactivated account is blocked
  immediately even with a still-valid token.
- Forgot-password responses don't reveal whether an email is registered.

---

## 12. Project structure reference

```
backend/
  app/
    routes/        auth.py (OTP register/login/forgot-password, per role),
                    products.py, manager.py, admin.py
    services/       account_service.py (accounts + OTP), product_service.py,
                    cloudinary_service.py
    schemas/        account.py, product.py  (pydantic validation)
    utils/          security.py (JWT + bcrypt), otp.py, email_service.py (SMTP),
                    deps.py (role-aware auth guards), errors.py
    config.py       reads all settings from environment variables
    database.py     MongoDB Atlas connection + indexes (incl. OTP TTL index)
    main.py         FastAPI app, CORS (3 origins), routers
  requirements.txt
  seed.py           optional sample product seeding script
  .env.example

frontend/                    (customer storefront — no login)
  src/pages/          Home, Products, ProductDetails, About, Contact, NotFound
  src/components/     Navbar, Footer, ProductCard, ProductGrid, Hero, ...
  src/services/api.js  public product endpoints only
  vercel.json / .env.example

manager-frontend/            (manager dashboard)
  src/pages/          Login, Register (OTP), ForgotPassword (OTP),
                       Dashboard, Products, AddProduct, EditProduct, ProductForm
  src/components/     DashboardLayout (sidebar), ProtectedRoute, ...
  src/context/AuthContext.jsx
  src/services/api.js  auth (OTP) + protected manager product endpoints
  vercel.json / .env.example

admin-frontend/              (admin dashboard — full access)
  src/pages/          Login, Register (OTP), ForgotPassword (OTP),
                       Dashboard, Products, AddProduct, EditProduct, ProductForm,
                       Managers (list/activate/deactivate/delete manager accounts)
  src/components/     DashboardLayout (sidebar incl. "Managers"), ProtectedRoute, ...
  src/context/AuthContext.jsx
  src/services/api.js  auth (OTP) + product endpoints + admin-only endpoints
  vercel.json / .env.example
```
#   s a d h v i t h - c r e a t i o n  
 