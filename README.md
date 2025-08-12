## Run Locally

Clone the project

```bash
git clone https://dredsoftlabs-admin@bitbucket.org/dredsoftlabs/ecommerce.git
```

Go to the project directory

```bash
cd eCommerce
```

Install dependencies

```bash
npm install --legacy-peer-deps
```

Start the server

```bash
npm start
```

The server should now be running. You can access the application by opening a web browser and entering the following URL:

```bash
http://localhost:3000
```

## Product UI Notes

Layout approach: The Product Card uses a clean card layout with a 1:1 image wrapper, concise metadata (name, price), a variant selector, and clear CTAs. The Product page mirrors these patterns with a larger gallery (thumbnails + next/prev controls) to maintain visual and behavioral consistency.

Responsiveness: The grid is mobile‑first (1/2/3/4 columns via Bootstrap), the image area scales with its container, and controls use compact sizes for small screens with accessible focus states. Touch targets and spacing are tuned for tap and pointer devices.

Enhancements implemented:
- Sorting: Relevance, price (asc/desc), newest/oldest, and name (A–Z/Z–A)
- Filtering: Multi‑select category buttons with highlighted selection state (union of selected categories)
- Images: Multiple images per product with thumbnail selector and next/prev arrows; subtle transitions
- Variants: Dropdown with availability labels; price updates per selection
- Stock state: Out‑of‑stock handling at product and variant level (overlay + disabled “Add to Cart”)
- Add to Cart: Visual fly‑to‑cart animation and consistent payloads (including selected variant)
- Similar products: Rendered using the same Product Card for consistent visuals and behavior


