import { useEffect, useState } from "react";
import CartItems from "../../components/cart_objects/Index";
import type { DemoCart } from "../../demo_data/type";

const Cart = () => {
  const [loading, setLoading] = useState(false);
  //   const cartItems = JSON.parse(localStorage.getItem("brave_cartItems") || "[]");
  const [mycart, setMycart] = useState<DemoCart[]>([]);

  const total_price = mycart
    .map((product) => product.price * product.quatity)
    .reduce((a, b) => a + b, 0);
  useEffect(() => {
    const getCart = async () => {
      const cart = localStorage.getItem("braveCart");
      try {
        if (cart) {
          const myCart = await JSON.parse(cart);
          setMycart(myCart);
        }
      } catch (error) {
      }
    };
    getCart();
  }, [loading]);

  return (
    <div className="mt-10">
      <CartItems loading={setLoading} cartItems={mycart} />
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between mt-5">
        <div className="w-fit py-0">
          <p>
            <span className="font-bold text-lg ">Discount:</span>{" "}
            <span className="font-bold text-indigo-600">${0}</span>
          </p>
          <p>
            <span className="font-bold text-lg ">Delivery:</span>{" "}
            <span className="font-bold text-indigo-600">${0}</span>
          </p>
          <p>
            <span className="font-bold text-lg ">Total Price:</span>{" "}
            <span className="font-bold text-indigo-600">${total_price}</span>
          </p>
        </div>
        <div className="w-fit">
          <button className="cursor-pointer text-shadow-white bg-indigo-600 text-white text-sm px-6 py-3 rounded-md hover:bg-indigo-700 transition-all">
            Checkout (${total_price})
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
