// controllers/cartController.js
import CartItem from "../models/CartItem.js";

// Get all cart items for the logged-in user
export const getCartItems = async (req, res) => {
    try {
        const items = await CartItem.find({ user: req.user.id });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart items", error: error.message });
    }
};

// Add a new cart item for the logged-in user
export const addCartItem = async (req, res) => {
    try {
        const { productId, productName, quantity } = req.body;

        const cartItem = new CartItem({
            user: req.user.id,
            productId,
            productName,
            quantity,
        });

        await cartItem.save();
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: "Error adding cart item", error: error.message });
    }
};

// Update quantity of a cart item for the logged-in user
export const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const updatedItem = await CartItem.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { quantity },
            { new: true }
        );

        if (!updatedItem) return res.status(404).json({ message: "Cart item not found" });

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Error updating cart item", error: error.message });
    }
};

// Delete a cart item for the logged-in user
export const deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedItem = await CartItem.findOneAndDelete({ _id: id, user: req.user.id });

        if (!deletedItem) return res.status(404).json({ message: "Cart item not found" });

        res.json({ message: "Cart item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting cart item", error: error.message });
    }
};
