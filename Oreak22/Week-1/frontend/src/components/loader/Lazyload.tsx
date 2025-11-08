import type React from "react";

const Lazyload: React.FC = () => {
  return (
    <div className="w-[100dvw] h-[100dvh] items-center flex justify-center">
      <div className="custom-loader"></div>
    </div>
  );
};

export default Lazyload;
