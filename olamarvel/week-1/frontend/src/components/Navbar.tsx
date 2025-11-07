import type { Dispatch, SetStateAction } from "react";

export default function NavBar({
  setView, viewCart
}: {
  setView: Dispatch<SetStateAction<boolean>>;
  viewCart: boolean;
}) {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white fixed t-0 l-0 w-full h-10">
      <div className="font-bold text-lg">Olamarvel&apos;s Shop</div>
      <div>
        <span
          className="cursor-pointer hover:underline"
          onClick={() => setView((v) => !v)}
        >
          Check {!viewCart?"Your cart" : "Products"}
        </span>
      </div>
    </nav>
  );
}
