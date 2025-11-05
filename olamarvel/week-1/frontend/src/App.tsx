// src/App.tsx
import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import NavBar from "./components/Navbar";
import Cart from "./pages/Cart";

function App() {

  const [viewCart, setViewCart] = useState<boolean>(false);

  const userId = "guest";

  return (
    <>
      <NavBar setView={setViewCart} viewCart={viewCart}/>
      {!viewCart ? (
        <Home userId={userId} />
      ) : (
        <Cart userId={userId} />
      )}
    </>
  );
}

export default App;
