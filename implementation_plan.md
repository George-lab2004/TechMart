# TechMart Polish — Implementation Plan

## Scope

8 tasks from the review's recommendations list. Items explicitly excluded by you:
- ~~WebSocket~~ — skip
- ~~Image upload~~ — skip
- ~~Stripe/PayPal~~ — already done
- ~~Error boundaries~~ — no need

---

## Task 1: Remove Unused `currentUserId` in `main.tsx`

**⏱️ ~1 minute**

#### [MODIFY] [main.tsx](file:///d:/Main/CV%20Projects/TechMart-%20E-Commerce/Frontend/src/main.tsx)
- Delete line 12: `const currentUserId = "your-user-id";`

---

## Task 2: Loading Skeletons

**⏱️ ~30 minutes**

Instead of `<Suspense fallback={null}>` showing a blank screen while lazy-loaded pages download, we'll create a reusable skeleton component and use it as the fallback.

#### [NEW] `Frontend/src/Components/PageSkeleton.tsx`
- A full-page skeleton with animated shimmer bars matching the TechMart design system (`bg-surf`, `bg-gb`, rounded corners).
- Includes a header skeleton, content area with 3-4 pulse bars, and a faint grid hint.

#### [MODIFY] [App.tsx](file:///d:/Main/CV%20Projects/TechMart-%20E-Commerce/Frontend/src/App.tsx)
- Replace all `<Suspense fallback={null}>` with `<Suspense fallback={<PageSkeleton />}>` (~14 instances).

---

## Task 3: Joi Validation Middleware

**⏱️ ~1 hour**

Joi is already in `package.json` but not used. We'll create a reusable validation middleware and validation schemas.

#### [NEW] `Backend/Middleware/validate.ts`
- A generic Express middleware factory: `validate(schema)` that validates `req.body` against a Joi schema and returns 400 with structured errors on failure.

#### [NEW] `Backend/Middleware/schemas.ts`
- Joi schemas for all POST/PUT routes:
  - `signUpSchema` — name (required, 2-50 chars), email (valid email), password (min 8 chars)
  - `signInSchema` — email (required), password (required)
  - `resetPasswordSchema` — email, otp, newPassword
  - `addOrderSchema` — orderItems (array, min 1), shippingAddress, paymentMethod, prices
  - `addAddressSchema` — title, city, country required
  - `updateProfileSchema` — name, email optional but validated if present

#### [MODIFY] Routes files to attach `validate(schema)` before controllers:
- [user.routes.ts](file:///d:/Main/CV%20Projects/TechMart-%20E-Commerce/Backend/routes/user.routes.ts) — signUp, signIn, forgetPassword, verifyOtp, resetPassword, addAddress, updateAddress
- [order.routes.ts](file:///d:/Main/CV%20Projects/TechMart-%20E-Commerce/Backend/routes/order.routes.ts) — addOrderItems

---

## Task 4: Rate Limiting

**⏱️ ~20 minutes**

#### Install `express-rate-limit`

#### [NEW] `Backend/Middleware/rateLimiter.ts`
- `authLimiter`: 10 requests per 15 minutes per IP (for login, signUp, forgotPassword, OTP)
- `aiLimiter`: 20 requests per minute per IP (for consumer and admin AI chat)

#### [MODIFY] [user.routes.ts](file:///d:/Main/CV%20Projects/TechMart-%20E-Commerce/Backend/routes/user.routes.ts)
- Apply `authLimiter` to signUp, signIn, forgetPassword, verifyOtp, resetPassword routes

#### [MODIFY] AI route files
- [ai.route.ts](file:///d:/Main/CV%20Projects/TechMart-%20E-Commerce/Backend/ai/ai.route.ts) — apply `aiLimiter`
- [admin.ai.route.ts](file:///d:/Main/CV%20Projects/TechMart-%20E-Commerce/Backend/adminAi/admin.ai.route.ts) — apply `aiLimiter`

---

## Task 5: Product Reviews Feature

**⏱️ ~2-3 hours** (largest task)

This adds user-submitted reviews to products, with full backend CRUD and frontend UI.

### Backend

#### [MODIFY] [productModel.ts](file:///d:/Main/CV%20Projects/TechMart-%20E-Commerce/Backend/Models/productModel.ts)
- Add `ReviewSchema` sub-schema: `{ user (ObjectId ref User), name, rating (1-5), comment, createdAt }`
- Add `reviews: [ReviewSchema]` to the main product schema
- Add `reviews` to the `IProduct` interface

#### [MODIFY] [products.ts (controller)](file:///d:/Main/CV%20Projects/TechMart-%20E-Commerce/Backend/controller/products.ts)
- Add `createProductReview` — POST, checks if user already reviewed, pushes review, recalculates `rating` and `numReviews` with aggregation
- Add `getProductReviews` — GET, returns reviews for a product

#### [MODIFY] [products.routes.ts](file:///d:/Main/CV%20Projects/TechMart-%20E-Commerce/Backend/routes/products.routes.ts)
- Add `POST /products/:id/reviews` (protect)
- Add `GET /products/:id/reviews`

#### [NEW] `Backend/Middleware/schemas.ts` (addition)
- `reviewSchema` — rating (required, 1-5), comment (required, 3-500 chars)

### Frontend

#### [MODIFY] [productApiSlice.ts](file:///d:/Main/CV%20Projects/TechMart-%20E-Commerce/Frontend/src/slices/productApiSlice.ts)
- Add `createReview` mutation
- Add `getProductReviews` query

#### [NEW] `Frontend/src/pages/ProductDetails/components/ReviewSection.tsx`
- Review form (star picker + comment textarea) — only shown if user is logged in
- Review list with user name, date, star rating, comment
- "Already reviewed" message if the user has already submitted
- Styled to match the TechMart design system (glassmorphism cards, mono labels)

#### [MODIFY] [productDetails.tsx](file:///d:/Main/CV%20Projects/TechMart-%20E-Commerce/Frontend/src/pages/ProductDetails/productDetails.tsx)
- Import and render `<ReviewSection />` below the rating breakdown section

---

## Task 6: Integration Tests

**⏱️ ~1-2 hours**

> [!IMPORTANT]
> Do you prefer **Vitest** (faster, Vite-native) or **Jest** for the tests? I'll default to **Vitest** since your frontend already uses Vite, and we can use it for backend tests too.

#### Install `vitest` + `supertest` in Backend

#### [NEW] `Backend/tests/auth.test.ts`
- Test signUp (success + duplicate email)
- Test signIn (success + wrong password)
- Test protected route without token returns 401

#### [NEW] `Backend/tests/products.test.ts`
- Test GET /api/products returns array
- Test GET /api/products/:id returns product
- Test POST /api/products/:id/reviews requires auth

#### [NEW] `Backend/tests/orders.test.ts`
- Test POST /api/orders requires auth
- Test GET /api/orders/mine returns user's orders

#### [NEW] `Backend/vitest.config.ts`
- Configure vitest for Node environment with TypeScript

#### [MODIFY] [package.json](file:///d:/Main/CV%20Projects/TechMart-%20E-Commerce/Backend/package.json)
- Add `"test": "vitest run"` script

---

## Task 7: README.md

**⏱️ ~30 minutes**

#### [NEW] `README.md` (project root)
- Project title + badge (Tech Stack)
- 1-2 sentence description
- **Features** list (grouped: Shopping, Admin, AI, Auth)
- **Tech Stack** table (Frontend, Backend, AI, DevOps)
- **Getting Started** (clone, env setup, install, seed, run)
- **Project Structure** tree diagram
- **Screenshots** section (placeholder paths — you can add real screenshots later)
- **Environment Variables** reference table
- **Deployment** (Vercel instructions)
- **License**

---

## Task 8: Clean Commit Messages

This is a workflow change, not a code change. Going forward:
- `feat: add product reviews`
- `fix: resolve cart sync issue`  
- `refactor: extract validation middleware`
- `chore: add rate limiting`
- `docs: add README`

---

## Execution Order

| Order | Task | Reason |
|---|---|---|
| 1 | Remove `currentUserId` | 1-minute warmup |
| 2 | Joi validation middleware | Backend foundation — needed before reviews |
| 3 | Rate limiting | quick backend safety net |
| 4 | Product reviews (backend + frontend) | largest feature — benefits from validation being ready |
| 5 | Loading skeletons | frontend polish |
| 6 | Integration tests | test everything we just built |
| 7 | README | document the final state |
| 8 | Commit messages | ongoing practice |

---

## Open Questions

> [!IMPORTANT]
> 1. **Vitest vs Jest** — I recommend Vitest since you're already on Vite. Is that OK?
> 2. **Review moderation** — Should reviews be auto-published, or should admin approval be required before they appear?
> 3. **Should I execute all 7 tasks in sequence right now**, or do you want to tackle them in separate sessions?
