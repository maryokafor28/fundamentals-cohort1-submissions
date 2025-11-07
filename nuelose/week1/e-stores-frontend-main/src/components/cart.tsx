import { mockProducts } from "../data/products";
import type { Product } from "../data/products";
import { RiDeleteBinLine } from "react-icons/ri";
import type { CartItem, CartProp } from "../types";

function Cart(props: { cart: CartProp;  }) {
  const { cart } = props;
  const userId = cart.userId;

  return (
    <div>
      <div>
        <h3>Shopping Cart for ${userId}</h3>
        <p>2 items</p>
      </div>

      <ul className="space-y-4 max-w-3xl mx-auto">
        {cart.items.map((item) => (
          <CartItem
            item={item}
            product={mockProducts.find(
              (product) => product.productId === item.productId
            )}
          />
        ))}
      </ul>
    </div>
  );
}

interface CartItemProps {
  item: CartItem;
  product?: Product;
}

function CartItem({ item, product }: CartItemProps) {
  if (!product) {
    return <p>No product yet</p>;
  }
  return (
    <li className="flex items-center border border-slate-300 p-4 rounded-lg gap-6">
      <img className="w-20 h-20 rounded-lg" src={product.image} alt="" />

      <div>
        <div className="flex ">
          <div>
            <h3>{product.name}</h3>
            <p className="max-w-lg">{product.description}</p>
          </div>
          <RiDeleteBinLine className="text-red-500 text-2xl cursor-pointer" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <button className="btn-pry">-</button>
            <p>{item.quantity}</p>
            <button className="btn-pry">+</button>
          </div>
          <div>
            <p className="font-bold">$ {product.price * item.quantity}</p>
            <small>$ {product.price} each</small>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Cart;
