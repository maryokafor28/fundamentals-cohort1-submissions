// controllers/orderController.js
import Order from "../models/order.js";
import Product from "../models/product.js";
import CartItem from "../models/CartItem.js";

// Place an order from user's cart
export const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id; // from auth middleware
        const cartItems = await CartItem.find({ user: userId }).populate("product");

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        // Calculate total price
        let total = 0;
        const orderItems = cartItems.map(item => {
            total += item.quantity * item.product.price;
            return {
                product: item.product._id,
                quantity: item.quantity,
            };
        });

        const order = new Order({
            user: userId,
            items: orderItems,
            totalPrice: total,
        });

        await order.save();

        // Clear cart after placing order
        await CartItem.deleteMany({ user: userId });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
};

// Get all orders for logged-in user
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate("items.product");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

// Admin: get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user").populate("items.product");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};
