export interface Product {
    _id: string;
    name: string;
    image: string;
    inStock: number;
}

export async function getProducts(): Promise<Product[]> {
    try {
        const response = await fetch(`http://localhost:5000/api/products`);
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function getProduct(id: string): Promise<Product | null> {
    try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export async function addProduct(name: string, image: string, inStock: number): Promise<Product | null> {
    try {
        const response = await fetch(`http://localhost:5000/api/products/add`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ name, image, inStock }) 
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error adding product:", error);
        return null;
    }
}

export async function removeProduct(id: string): Promise<boolean> {
    try {
        const response = await fetch(`http://localhost:5000/api/products/remove/${id}`, { method: 'DELETE' });
        return response.ok;
    } catch (error) {
        console.error("Error removing product:", error);
        return false;
    }
}
