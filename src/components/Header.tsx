import React from "react";
import { Link } from "react-router-dom";

export const Header: React.FC = () => (
  <header className="p-4 bg-gray-800 text-white flex justify-between">
    <h1 className="font-bold">DeployHub</h1>
    <nav>
      <Link to="/" className="mr-4 hover:underline">
        Home
      </Link>
      <Link to="/about" className="hover:underline">
        About
      </Link>
    </nav>
  </header>
);
