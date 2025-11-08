import { useEffect, useState } from "react";
import Footer from "../../../components/footer/Index";
import Spinner from "../../../components/loader/Spinner";
import axios from "axios";

const Addproduct = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | undefined>();
  const [stock, setStock] = useState<number | undefined>();
  const [category, setCategory] = useState("");
  const [vendor, setVendor] = useState("");
  const getUserInfo = localStorage.getItem("brave_user");

  const url = "http://localhost:3003/api/admin/add-to-product";
  const productInfo = { name, description, price, stock, category, vendor };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(url, productInfo, { timeout: 60000 }).then((res) => {
        if (res.status === 201) {
        } else {
          console.error("product adding failed with status:", res.status);
        }
      });
    } catch (error) {
      console.error("product adding failed:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (getUserInfo) {
      setVendor(JSON.parse(getUserInfo).id);
    }
  }, []);

  return (
    <>
      <nav className="p-4 w-full bg-white shadow-sm sticky top-0 left-0 z-50 max">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="font-bold text-2xl text-indigo-600">BrandLogo</span>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[85dvh]">
        <h1 className="text-2xl font-bold my-6">Add New Product</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 lg:gap-0 lg:flex-row w-full justify-between"
        >
          <div className="">
            <label className="border-3 rounded-lg flex flex-col justify-center items-center border-dotted h-2xl mx-auto text-center p-8 lg:p-20 cursor-pointer">
              <span className="material-symbols-outlined">add_2</span>
              <input
                type="file"
                accept="image/*"
                name="image"
                className="hidden"
              />
              <p className="text-sm">add product image</p>
            </label>
          </div>
          {/*  */}
          <div className="w-full lg:w-[65%]">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Product Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Product Price"
                id="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Stock "
                id="stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value=""></option>
                <option value="Accessories">Accessories</option>
                <option value="Electronics">Electronics</option>
                <option value="Fitness">Fitness</option>
                <option value="Footwear">Footwear</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Office">Office</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Personal Care">Personal Care</option>
              </select>
            </div>
            <div className="mb-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Product name"
                id="discription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </div>
            <div className="w-full flex lg:justify-end mt-5">
              <button
                className="bg-indigo-600 text-center px-3 py-2 text-white rounded-lg cursor-pointer transform duration-100 hover:bg-indigo-900 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner dimension={5} /> : "Add product"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Addproduct;
