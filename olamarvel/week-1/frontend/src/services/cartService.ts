export interface CartItem {
    _id: string;
    userId: string;
    products: string[];
    orderConfirmed: boolean;
}

export async function getCartItems(userId: string): Promise<CartItem | null> {
    try {
        const response = await fetch(`http://localhost:5000/api/carts/${userId}`);
        const data = await response.json();
        return data || null;
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return null;
    }
}

export async function addToCart(userId: string, productId: string): Promise<void> {
    try {
        await fetch(`http://localhost:5000/api/carts/add`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ userId, productId }) 
        });
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}

export async function removeFromCart(userId: string, productId: string): Promise<void> {
    try {
        await fetch(`http://localhost:5000/api/carts/remove`, { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ userId, productId }) 
        });
    } catch (error) {
        console.error("Error removing from cart:", error);
    }  
}
