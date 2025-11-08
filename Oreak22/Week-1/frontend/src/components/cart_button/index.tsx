import {
  useEffect,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import type { realProduct } from "../product_card/type";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../loader/Spinner";
import type { cartDemo } from "../cart_objects/type";

type prop = {
  loading: React.Dispatch<React.SetStateAction<boolean>>;
  product: cartDemo;
};

type editProp = {
  action: "add" | "minus";
};

const EditCartBtn: FC<prop> = ({ loading, product }) => {
  const token = localStorage.getItem("brave_token");
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);
  const editURL = `http://localhost:3002/api/cart/edit-quantity/${product._id}`;

  const editQuantity = async ({ action }: editProp) => {
    loading(true);
    if (action == "minus" && product.quatity <= 1) return;
    if (action === "add") {
      setAdding(true);
    }
    if (action == "minus") setRemoving(true);
    try {
      let newQuantity =
        action == "add"
          ? product.quatity + 1
          : action == "minus" && product.quatity > 1 && product.quatity - 1;

      await axios
        .get(editURL, {
          headers: {
            Authorization: `Bearer ${token}`,
            Action: action,
            Quantity: newQuantity,
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
      setAdding(false);
      setRemoving(false);
      loading(false);
    }
  };
  return (
    <div className="flex justify-between items-center mt-5">
      <button
        className=" w-fit bg-[#766DF4] hover:bg-[#5a52c7] text-white font-semibold py-2 px-4 rounded transition-colors duration-200 text-xl cursor-pointer"
        disabled={removing}
        onClick={() => editQuantity({ action: "minus" })}
      >
        {removing ? <Spinner dimension={3} /> : "-"}
      </button>
      <div className="h-fit">
        <p className="text-lg text-center">{product.quatity}</p>
      </div>
      <button
        className="w-fit bg-[#766DF4] hover:bg-[#5a52c7] text-white font-semibold py-2 px-4 rounded transition-colors duration-200 text-xl cursor-pointer"
        disabled={adding}
        onClick={() => editQuantity({ action: "add" })}
      >
        {adding ? <Spinner dimension={3} /> : "+"}
      </button>
    </div>
  );
};

//
const CartButton: FC<{
  product: realProduct | cartDemo;
  purpose: "cart" | "product";
  stateLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ product, purpose, stateLoading }) => {
  const [loading, setLoading] = useState(false);
  const [InCart, setInCart] = useState<cartDemo>();
  const add_to_cart_url = "http://localhost:3002/api/cart/add-to-cart";

  const navigate = useNavigate();

  const add_to_cart = async (product: realProduct) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("brave_token");
      if (!token) {
        navigate(`/auth/login`);
        return;
      }

      await axios
        .post(
          `${add_to_cart_url}`,
          { productId: product._id },
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 60000,
          }
        )
        .then((res) => {
          if (res.data.success) {
            localStorage.setItem(
              "braveCart",
              JSON.stringify(res.data.usersCart)
            );
          } else {
            console.error("Adding to cart failed with status:", res.data);
          }
        });

    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const myCart = localStorage.getItem("braveCart");

  useEffect(() => {
    if (purpose == "cart") return;
    const checkCart = async () => {
      if (!myCart) return;
      const myCartList: cartDemo[] = await JSON.parse(myCart);
      const findIf = myCartList.find((cartItem) => {
        return cartItem.productId === product._id;
      });
      if (findIf) setInCart(findIf);
    };
    checkCart();
  }, [loading]);

  if (purpose === "product") {
    return (
      <>
        {!InCart ? (
          <button
            className="mt-4 w-full bg-[#766DF4] hover:bg-[#5a52c7] text-white font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:cursor-not-allowed"
            disabled={loading}
            onClick={() => add_to_cart.bind(this, product)()}
          >
            {!loading ? (
              "Add to Cart"
            ) : (
              <span className="flex gap-2 items-center justify-center">
                {" "}
                <Spinner dimension={4} /> Adding to cart
              </span>
            )}
          </button>
        ) : (
          <EditCartBtn
            loading={setLoading as Dispatch<SetStateAction<boolean>>}
            product={InCart as cartDemo}
          />
        )}
      </>
    );
  }
  if (purpose === "cart") {
    return (
      <EditCartBtn
        loading={stateLoading as Dispatch<SetStateAction<boolean>>}
        product={product as cartDemo}
      />
    );
  }
};

export default CartButton;
