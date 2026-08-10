# AREA 51 ARCHIVES — E-Commerce Frontend

A premium, modern, streetwear e-commerce web application built for **AREA 51 ARCHIVES**. Inspired by contemporary urban aesthetics, featuring a sleek dark mode palette with vibrant purple and magenta accents, custom typography, dynamic filtering, state persistence, responsive layouts, and production-ready Next.js architecture.

---

## 🚀 Features

- **Homepage**:
  - Full-screen animated Hero section with custom UFO logo branding & gradient glows.
  - **Featured Collection** grid with instant Add to Cart & Wishlist integration.
  - **New Arrivals** showcase.
  - **Shop by Category** visual grid with smooth zoom hover effects.
  - **Editorial Section** ("The New Archive") highlighting brand storytelling.
  - **Why Us** values grid with clean minimalist vector icons.
  - **Lookbook Gallery** (Instagram-style visual grid).
  - **Newsletter** subscription form with interactive success feedback.
  - Comprehensive Footer with quick navigation, brand story, and social links.

- **Shop & Catalogue**:
  - Complete catalogue featuring 16 realistic products with Indian Rupee pricing (₹).
  - Multi-category filtering (`All`, `T-Shirts`, `Hoodies`, `Shirts`, `Pants`, `Accessories`).
  - Sorting options (`Featured`, `Newest`, `Price: Low → High`, `Price: High → Low`).
  - Real-time product search with search input overlay.
  - Suspense-wrapped URL parameter synchronization for fast SEO-friendly navigation.

- **Product Detail Page (`/products/[id]`)**:
  - Multi-angle thumbnail gallery.
  - Dynamic size (`S`, `M`, `L`, `XL`) and color selector.
  - Quantity control with subtotal estimation.
  - Quick **Add to Cart** and **Buy Now** actions.
  - Tabbed product specs (Details, Material & Care, Shipping & Returns).
  - "You May Also Like" related product recommendations.

- **Interactive Cart (`/cart`)**:
  - Item listing with size/color/quantity options.
  - Real-time quantity adjustment and instant line-item subtotal calculation.
  - Order summary breakdown (Subtotal, Free Shipping threshold > ₹1,999, Total).
  - Full `localStorage` state persistence.

- **Wishlist (`/wishlist`)**:
  - Toggle heart icons across all product cards and product detail pages.
  - Dedicated wishlist view with single-click `localStorage` synchronization.

- **Brand & Contact Pages**:
  - **About Page**: Editorial layout covering Brand Story, Philosophy, Quality, and Community.
  - **Contact Page**: Interactive contact form with subject selection, success state, and business info.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/) + Custom SVGs
- **Fonts**: Google Inter (`next/font/google`)

---

## 📁 Project Structure

```
textile-shop/
├── public/
│   └── images/
│       └── products/           # Drop client product images here
├── src/
│   ├── app/
│   │   ├── about/              # Brand story page
│   │   ├── cart/               # Cart page
│   │   ├── contact/            # Contact page
│   │   ├── products/[id]/      # Dynamic product detail page
│   │   ├── shop/               # Shop & filtering page
│   │   ├── wishlist/           # Wishlist page
│   │   ├── globals.css         # Tailwind v4 theme & custom utilities
│   │   ├── layout.tsx          # Root layout & providers
│   │   └── page.tsx            # Homepage
│   ├── components/             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── CartItem.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── EditorialSection.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── Newsletter.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── SocialGallery.tsx
│   │   └── WhyUs.tsx
│   ├── context/                # React State Contexts
│   │   ├── CartContext.tsx     # Cart state + localStorage
│   │   └── WishlistContext.tsx # Wishlist state + localStorage
│   ├── data/
│   │   └── products.ts         # Product dataset & helper functions
│   └── types/
│       └── product.ts          # TypeScript interfaces
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore definitions
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies & scripts
└── tsconfig.json               # TypeScript configuration
```

---

## 💻 Local Development

### 1. Installation
```bash
npm install
```

### 2. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build Test
```bash
npm run build
npm run start
```

---

## 🎨 Customization Guide

### How to Update Products & Prices
All products are stored centrally in [`src/data/products.ts`](src/data/products.ts).

To add or modify a product, update the `products` array:
```typescript
{
  id: 'new-product-id',
  name: 'New Product Name',
  price: 1999, // In INR (₹)
  description: 'Detailed description...',
  category: 'Hoodies', // 'T-Shirts' | 'Hoodies' | 'Shirts' | 'Pants' | 'Accessories'
  colors: [
    { name: 'Obsidian Black', hex: '#1a1a1a' }
  ],
  sizes: ['S', 'M', 'L', 'XL'],
  images: [
    'https://images.unsplash.com/...', // Or '/images/products/item.jpg'
  ],
  badge: 'Limited', // Optional badge
  isFeatured: true,
  isNewArrival: true,
}
```

### How to Replace Product Images
1. Save high-resolution product photos in `public/images/products/` (e.g., `public/images/products/tee-1.jpg`).
2. In [`src/data/products.ts`](src/data/products.ts), update the `images` array path:
   ```typescript
   images: ['/images/products/tee-1.jpg']
   ```

### How to Change Color Palette
Color design tokens are declared in [`src/app/globals.css`](src/app/globals.css):
```css
@theme {
  --color-bg-primary: #08090C;
  --color-bg-secondary: #0D0E13;
  --color-bg-card: #13141B;
  --color-purple: #8B3DFF;
  --color-purple-bright: #B84DFF;
  --color-magenta: #E23DFF;
  --color-[#A6A6B0]: #A6A6B0;
}
```

---

## 🌐 Phase 2 Deployment (GitHub + Vercel)

### Step 1: Push Project to GitHub

1. Open your terminal in the project directory (`d:\Area51\textile-shop`).
2. Create a new repository on [GitHub](https://github.com/new) named `textile-shop` (keep it Public or Private).
3. Run the following commands in terminal:

```bash
git init
git add .
git commit -m "Initial commit: AREA 51 ARCHIVES frontend"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/textile-shop.git
git push -u origin main
```

---

### Step 2: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** → **"Project"**.
3. Import your **`textile-shop`** GitHub repository.
4. Framework Preset will automatically be detected as **Next.js**.
5. Keep default settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
6. Click **"Deploy"**.
7. In ~60 seconds, your website will be live with a `.vercel.app` domain!

---

### Step 3: Future Automatic Deployments

Once connected to Vercel, every future update is automatic:
```bash
git add .
git commit -m "Update product catalog"
git push
```
Vercel will build and deploy the changes automatically!

---

### Step 4: Connecting a Custom Domain Later

When your customer purchases a custom domain (e.g., `www.area51archives.com`):

1. Go to your Vercel Project Dashboard → **Settings** → **Domains**.
2. Type in your custom domain (e.g., `area51archives.com`) and click **Add**.
3. Vercel will provide DNS records:
   - **A Record**: Point `@` to `76.76.21.21`
   - **CNAME Record**: Point `www` to `cname.vercel-dns.com`
4. Update these DNS records in your domain registrar (GoDaddy, Namecheap, Google Domains, etc.).
5. Vercel will automatically issue free SSL/TLS certificates for HTTPS.

---

## 🔮 Future Phases (Backend & Database)

This frontend prototype is engineered for easy backend integration:
- **Backend API**: Can be hosted on Netlify / Node.js / Spring Boot. Set `NEXT_PUBLIC_API_URL` in `.env.local`.
- **Database**: Supabase / PostgreSQL can plug into the existing data structures in `src/types/product.ts`.
- **Payments**: Razorpay / Stripe SDKs can be dropped into the Checkout handler in `src/app/cart/page.tsx`.
