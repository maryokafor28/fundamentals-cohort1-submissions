import { IoMdAdd } from "react-icons/io";
import type{ ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  showIcon?: boolean; 
}

function Button({
  children,
  showIcon = true,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`bg-pryGreen text-white text-sm px-4 py-1.5 rounded-md flex items-center gap-2 h-fit hover:bg-green-700 transition ${className}`}
    >
      {showIcon && <IoMdAdd />}
      {children}
    </button>
  );
}

export default Button;


// function Button({ children }: { children: React.ReactNode }) {
//   return (
//     <button className="bg-pryGreen text-white text-sm px-4 py-1.5  rounded-md flex items-center gap-4 h-fit">
//       <IoMdAdd />
//       {children}
//     </button>
//   );
// }

// export default Button;
