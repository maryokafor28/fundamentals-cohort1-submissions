import Footer from "../footer/Index";
import Navbar from "../Navbar";
import type { layout } from "./type";

const Layout = ({ children }: layout) => {
  return (
    <>
      <Navbar />
      <div className="min-h-[90dvh] max-w-7xl mx-auto my-3 px-4 sm:px-6 lg:px-8 ">
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
