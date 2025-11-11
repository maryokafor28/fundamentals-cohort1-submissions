// src/modules/products/controller.ts
import { Request, Response } from "express";
import * as ProductService from "./service";

// 👤 request type including logged-in user
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

// ✅ Create product
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const data = { ...req.body, createdBy: req.user.id };
    const product = await ProductService.createProduct(data);

    res.status(201).json({ message: "Product created", data: product });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getAllProducts();
    res.json({ data: products });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single product
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ data: product });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update product
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const product = await ProductService.updateProduct(req.params.id, req.body);
    res.json({ message: "Product updated", data: product });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete product
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    await ProductService.deleteProduct(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
