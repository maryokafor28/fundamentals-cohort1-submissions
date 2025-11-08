import Catigories from "../../components/categories/Index";
import { groupedByCategory } from "../../demo_data/demo_product";

import { useEffect, useState } from "react";

const Home = () => {
  const [categories, setCategories] = useState<{ [key: string]: any[] }>({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await groupedByCategory;
      setCategories(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      {Object.keys(categories).map((category) => (
        <div key={category}>
          <Catigories
            categoryProduct={categories[category]}
            category={category}
          />
        </div>
      ))}
    </div>
  );
};

export default Home;
