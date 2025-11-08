import {} from "react";
import type { realProduct } from "./type";
import CartButton from "../cart_button";

const ProductCard = ({ product }: { product: realProduct }) => {
  return (
    <div
      key={product._id}
      className="mb-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 w-[47%] sm:w-[47%] md:w-[31%] lg:w-[23%] flex flex-col"
    >
      <img
        src={"https://placehold.net/default.svg"}
        alt={product.name}
        loading="lazy"
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      {/* <p className="text-gray-600 mb-2">{product.description}</p> */}
      <p className="text-[#766DF4] font-bold">${product.price.toFixed(2)}</p>
      <CartButton product={product} purpose="product" />
    </div>
  );
};

export default ProductCard;
