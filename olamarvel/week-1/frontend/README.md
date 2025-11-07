# E-commerce Checkout System - Frontend

I built the frontend proof of concept for the Week 1 challenge. The app shows products, lets a guest add and remove items from a cart, and reads the cart from the cart-service backend.

## What I delivered
- Home page that lists products
- Add to cart and remove from cart actions
- Cart page that displays current items
- Simple navigation without a router
- Mobile friendly layout using Tailwind CSS
- Guest user id stored in localStorage to simulate authentication

## Tech stack
- React + Vite + TypeScript
- Tailwind CSS
- Fetch API for network calls

## Repo layout
````

src/
├─ main.tsx
├─ index.css
├─ App.tsx
├─ components/
│  ├─ NavBar.tsx
│  ├─ ProductCard.tsx
│  └─ CartItem.tsx
├─ pages/
│  ├─ Home.tsx
│  └─ Cart.tsx
└─ services/
├─ productService.ts
└─ cartService.ts

````

## Local setup and run

1. Install dependencies
```bash
npm install
````

2. Run dev server

```bash
npm run dev
```

3. Build

```bash
npm run build
npm run preview
```

Default dev URL: `http://localhost:5173`

## How the guest identity works

* On first load the app generates a guest id and stores it in localStorage under `cartSession`.
* That id is used as `userId` in API calls to the cart-service endpoints.

## Services and endpoints used

* `productService.getProducts()` calls `GET http://localhost:5000/api/products`
* `productService.getProduct(id)` calls `GET http://localhost:5000/api/products/product/:id`
* `cartService.addToCart(userId, productId)` calls `POST http://localhost:5000/api/carts`
* `cartService.getCartItems(userId)` calls `GET http://localhost:5000/api/carts/:userId`
* `cartService.removeFromCart(userId, productId)` calls `DELETE http://localhost:5000/api/carts/remove`

If your backend is served from another host or port, update the endpoints in `src/services/*Service.ts`.

## UI flow

* Home page fetches products and renders product cards
* Click Add on a product to call the cart-service add endpoint
* Click Cart in the NavBar to open the Cart page which fetches cart contents
* Remove button in Cart sends a request to remove the product from the guest cart

## Notes and trade offs

* No auth service is included. The guest id stored in localStorage is enough for a demo.
* No router keeps the app small and reduces task complexity. For production I would add routing and caching.

## How to test locally end to end

1. Start backend at [http://localhost:5000](http://localhost:5000)
2. Start frontend at [http://localhost:5173](http://localhost:5173)
3. Open the frontend in a browser and use the UI to add and remove items in the cart

## Useful links

* Backend repo: [https://github.com/olamarvel/week-1](https://github.com/olamarvel/week-1)
