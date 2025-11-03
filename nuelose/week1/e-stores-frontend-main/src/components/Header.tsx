import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { IoIosLogOut } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import type React from "react";

interface ComponentProps {
  token: string;
  setSignIn: React.Dispatch<React.SetStateAction<boolean>>;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
}

function Header(props: ComponentProps) {

    const {token, setSignIn, setToken, setShowCart} = props

     function handleClickCart() {
       setShowCart(true);
     }
    

  return (
    <div className="fixed w-full top-0 bg-slate-100 border-b py-5 ">
      <div className="flex justify-between mx-auto max-w-6xl px-10">
        <div className="flex items-center gap-2">
          <div className="bg-slate-700 text-slate-50 py-3 px-2 rounded-lg">
            <HiOutlineBuildingStorefront className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold ">E-Stores</h1>
            <small>Your favorite online store</small>
          </div>
        </div>

        <div onClick={handleClickCart} className="flex items-center gap-4">
          <div className="header-item">
            <IoCartOutline />
            <p>Cart</p>
          </div>
          {token ? (
            <button
              onClick={() => setToken("")}
              className="header-item text-white bg-slate-700 "
            >
              <IoIosLogOut />
              <p>Log out</p>
            </button>
          ) : (
            <button
              onClick={() => setSignIn((sign) => !sign)}
              className="header-item text-white bg-slate-700 "
            >
              <FaRegUser />
              <p>Sign In</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
