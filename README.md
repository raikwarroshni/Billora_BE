# Billora API

Node.js + Express + MongoDB (Mongoose) backend for the Billora billing app.

## Setup

```bash
npm install
cp .env.example .env   # then set MONGO_URI to your MongoDB connection string
npm run dev             # nodemon, auto-restarts on file changes
# or
npm start
```

The server starts and responds to requests even if MongoDB isn't reachable yet —
only the database-backed routes will error until `MONGO_URI` points to a running
MongoDB instance (local `mongod` or a MongoDB Atlas cluster).

## Auth

Every route except `/api/auth/*` requires a `Authorization: Bearer <token>` header.

1. `POST /api/auth/send-otp` `{ "phone": "9876543210" }` — generates a 6-digit OTP
   (valid 5 minutes) and **logs it to the server console**, since no SMS provider
   is wired up yet. Wire in Twilio/MSG91/etc. inside `src/controllers/authController.js`
   when ready.
2. `POST /api/auth/verify-otp` `{ "phone": "9876543210", "otp": "123456" }` —
   returns `{ token, phone }` on success. Send that token as
   `Authorization: Bearer <token>` on every other request.

## Endpoints

All entity routes below support the same 5 operations:

| Method | Path | Description |
|---|---|---|
| GET | `/:resource` | List all |
| GET | `/:resource/:id` | Get one |
| POST | `/:resource` | Create |
| PUT | `/:resource/:id` | Update |
| DELETE | `/:resource/:id` | Delete |

Resources: `/api/vendors`, `/api/customers`, `/api/products`,
`/api/purchase-orders`, `/api/sales-invoices`.

`/api/purchase-orders` and `/api/sales-invoices` auto-generate `poNumber`
(`PO-001`, `PO-002`, ...) and `invoiceNumber` (`INV-001`, ...) on create — don't
send those fields yourself.

`/api/business` is a singleton (one business profile per deployment):

| Method | Path | Description |
|---|---|---|
| GET | `/api/business` | Get the business profile (or `null` if unset) |
| PUT | `/api/business` | Create or update the business profile |

`GET /api/health` is unauthenticated and always returns `{ status: "ok" }` —
useful for uptime checks.

## Project structure

```
server.js               entry point (loads env, connects DB, starts Express)
src/
  app.js                 Express app: middleware + route mounting
  config/db.js           Mongoose connection
  middleware/
    auth.js               JWT "protect" middleware
    asyncHandler.js        wraps async route handlers so errors reach errorHandler
    errorHandler.js        centralized 404 + error JSON responses
  models/                 Mongoose schemas
  controllers/
    crudFactory.js          generates getAll/getOne/create/update/remove for a model
    <entity>Controller.js   built from crudFactory, with overrides where needed
  routes/                 one router per resource, mounted in app.js
```

## Notes / what's simplified for now

- `vendor` / `customer` / `item` fields on Purchase Orders and Sales Invoices are
  plain strings (matching how the current frontend sends them), not references
  to actual Vendor/Customer/Product documents. Swap to ObjectId refs + `.populate()`
  later if you want relational integrity.
- No file upload handling yet for business logo/signature — `logoUrl` /
  `signatureUrl` are plain string fields; wire up S3/Cloudinary/multer when needed.
- OTPs are stored in plaintext on the `User` document for simplicity — fine for
  a 5-minute-lived OTP, but hash them (or move to Redis) before production.
