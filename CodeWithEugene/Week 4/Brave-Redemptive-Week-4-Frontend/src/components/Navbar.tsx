import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
    </nav>
  );
};

export default Navbar;
