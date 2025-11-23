cd ~/Desktop/Brave-Redemptive/ecommerce-frontend

cat > README.md << 'EOF'
# E-commerce Cart Service Frontend

A Next.js frontend that demonstrates the cart service microservice functionality.

## Features

- User authentication (login/register)
- Product display with mock data
- Add items to cart functionality
- View and manage cart items
- Real-time cart updates

## Technology Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- Axios for API calls

## Setup Instructions

1. **Install dependencies:**
```bash
   npm install

2. cp .env.example .env.local

3 Update .env.local with your backend URL (default: http://localhost:5000/api)

4 npm run dev

5 Access the application:
Open http://localhost:3000 in your browser
