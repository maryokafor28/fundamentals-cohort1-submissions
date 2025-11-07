import { Response, Request } from "express";
import Product from "../models/Product";


export async function addProduct(req: Request, res: Response) {
    try {
        const { name, image, inStock } = req.body;
        if (!name || !image) {
            return res.status(400).json({ message: "Name and image are required" });
        }
        const product = new Product({ name, image, inStock });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error saving product", error });
    }
}


export async function removeProduct(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product removed", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error removing product", error });
    }
}



export async function getProduct(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
}

export async function getProducts(req: Request, res: Response) {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    } 
}
