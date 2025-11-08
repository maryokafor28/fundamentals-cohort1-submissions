import type React from "react";
import { Link } from "react-router-dom";
import { type FC } from "react";
import type { cartDemo } from "./type";
import axios from "axios";
import CartButton from "../cart_button";
const CartCard: FC<{
  product: cartDemo;
  loading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ product, loading }) => {
  const token = localStorage.getItem("brave_token");

  const deleteURL = `http://localhost:3002/api/cart/delete-cart/${product._id}`;
  const delete_cart = async () => {
    loading(true);
    try {
      await axios
        .delete(deleteURL, {
          headers: {
            Authorization: `Bearer ${token}`,
            Id: product._id,
          },
          timeout: 60000,
        })
        .then((res) => {
          if (res.data.success) {
            localStorage.setItem(
              "braveCart",
              JSON.stringify(res.data.userCart)
            );
          }
        })
        .catch(() => {});
    } catch (error) {
    } finally {
      loading(false);
    }
  };

  return (
    <div
      key={product._id}
      className="mb-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 w-[47%] sm:w-[47%] md:w-[31%] lg:w-[23%] flex flex-col relative"
    >
      <button
        className="absolute right-4 cursor-pointer "
        onClick={() => delete_cart()}
      >
        <span className="material-symbols-outlined text-red-700 text-2xl">
          delete
        </span>
      </button>
      <img
        src={"https://placehold.net/default.svg"}
        alt={product.name}
        loading="lazy"
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-[#766DF4] font-bold">${product.price.toFixed(2)}</p>

      <CartButton stateLoading={loading} product={product} purpose="cart" />
    </div>
  );
};
const CartItems: React.FC<{
  cartItems: cartDemo[];
  loading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ cartItems, loading }) => {
  return (
    <>
      <div className="w-fit mb-4">
        <h2 className="font-bold text-xl">
          My Cart{" "}
          <span className="bg-red-400 rounded-full p-2">
            {cartItems.length}
          </span>
        </h2>
        <hr className="border-b-2 w-[50%] mt-2" />
      </div>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">
          Your cart is empty{" "}
          <span>
            <Link to="/" className="italic text-indigo-600">
              shop and add to cart
            </Link>
          </span>
        </p>
      ) : (
        <div className="flex justify-start gap-5 flex-wrap">
          {cartItems.map((product, index) => (
            <CartCard product={product} loading={loading} key={index} />
          ))}
        </div>
      )}
    </>
  );
};

export default CartItems;
