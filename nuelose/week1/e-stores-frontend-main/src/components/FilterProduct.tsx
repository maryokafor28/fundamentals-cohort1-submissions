import { LuPackageCheck } from "react-icons/lu";
import { IoCartOutline } from "react-icons/io5";
import ProductList from "./ProductList";
import Cart from "./Cart";
import { useEffect, useState } from "react";
import type { CartProp } from "../types";
import axios from "axios";

interface ComponentProps {
  token: string;
  setShowCart: (a:boolean) => void;
  showCart:boolean;
}

function FilterProduct(props: ComponentProps) {
  const { token, setShowCart, showCart } = props;
  const [cart, setCart] = useState<CartProp | null>(null);
  
  async function addToCart(productId: string, quantity: number) {
    if (!token) {
      alert("Please sign in to add to cart");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/add-to-cart",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data);
    } catch (e) {
      console.error("Error adding to cart: ", e);
      alert("Failed to add to cart");
    }
  }

  function handleClickCart() {
    setShowCart(true);
  }

  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        const response = await axios.get("http://localhost:3000/get-cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data);
      } catch (e) {
        console.error("Error loading cart: ", e);
        alert(" load cart");
      }
    })();
  }, [token]);

  return (
    <div className="flex flex-col justify-start mx-auto px-10 max-w-6xl  ">
      <div className=" flex justify-between  mt-30 px-1.5 py-1 w-2xs border  rounded-4xl bg-slate-200">
        <div
          onClick={() => setShowCart(false)}
          className={` ${
            showCart ? "" : "selected-product-filter"
          } product-filter`}
        >
          <LuPackageCheck />
          <p>Products</p>
        </div>
        <div
          onClick={handleClickCart}
          className={` ${
            showCart ? "selected-product-filter" : ""
          } product-filter`}
        >
          <IoCartOutline />
          <p>Cart</p>
        </div>
      </div>
      {showCart === false ? (
        <div className="my-8">
          <ProductList onAddToCart={addToCart} />
        </div>
      ) : (
        cart && (
          <div className="my-8">
            <Cart cart={cart}  />
          </div>
        )
      )}
    </div>
  );
}

export default FilterProduct;
