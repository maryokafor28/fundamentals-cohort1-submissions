import type React from "react";
import ProductCard from "../product_card/Index";
import type { DemoProduct } from "../../demo_data/type";

const Categories: React.FC<{
  categoryProduct: DemoProduct[];
  category: string;
}> = ({ categoryProduct, category }) => {
  return (
    <>
      <div className="w-fit mb-4">
        <h2 className="font-bold text-xl">{category}</h2>
        <hr className="border-b-2 w-[50%] mt-2" />
      </div>
      <div className="flex justify-start gap-5 flex-wrap">
        {categoryProduct.map((product, index) => (
          <ProductCard product={product} key={index} />
        ))}
      </div>
    </>
  );
};

export default Categories;
