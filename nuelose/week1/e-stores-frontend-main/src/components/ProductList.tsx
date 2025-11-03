import { mockProducts } from "../data/products";
import type { Product } from "../data/products";
// import Button from "./Button";

interface ItemProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => void;
}

interface ComponentProps {
  onAddToCart: (productId: string, quantity: number) => void;
}

function ProductList(props: ComponentProps) {
  const { onAddToCart } = props;
  return (
    <>
      <h3>Featured Products</h3>
      <small>Discover our curated selection of premium products</small>
      <div className="grid grid-cols-3 gap-4">
        {mockProducts.map((product) => (
          <ul>
            <Item
              onAddToCart={onAddToCart}
              product={product}
              key={product.productId}
            
            />
          </ul>
        ))}
      </div>
    </>
  );
}

function Item({ product, onAddToCart }: ItemProps) {
  return (
    <li className="space-y-8 border border-slate-300  p-4 rounded-xl">
      <div className="">
        <img className="w-3xl h-56 rounded-2xl" src={product.image} alt="" />
      </div>
      <div>
        <div className="flex  justify-between">
          <h4>{product.name}</h4>
          {product.inStock ? (
            <small className="stock-avalibale">In Stock</small>
          ) : (
            <small className="stock-avalibale text-white bg-red-500">
              Out of Stock
            </small>
          )}
        </div>

        <p className="py-4">{product.description}</p>

        <div className="flex justify-between">
          <p className="font-bold">$ {product.price}</p>
          <button
            className={`btn ${
              product.inStock
                ? "bg-slate-900 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={() => onAddToCart(product.productId, 1)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </li>
  );
}

export default ProductList;
