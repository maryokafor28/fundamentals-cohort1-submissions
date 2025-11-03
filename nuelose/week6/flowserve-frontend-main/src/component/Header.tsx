import { LuUser } from "react-icons/lu";
import { LuWallet } from "react-icons/lu";

const Header = () => {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="bg-pryGreen w-fit p-3 rounded-md">
          <LuWallet className="text-white text-2xl" />
        </div>
        <h1 className="text-xl font-semibold text-darkGreen">FlowServe</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-lightGreen p-3 rounded-full">
          <LuUser className="text-2xl" />
        </div>
        <span className="text-gray-500">Admin User</span>
      </div>
    </header>
  );
};

export default Header;

