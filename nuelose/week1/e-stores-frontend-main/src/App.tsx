import { useState } from "react";
import FilterProduct from "./components/FilterProduct";
import Header from "./components/Header";
import SignIn from "./components/SignIn";

function App() {
  const [token, setToken] = useState<string>("");
  const [signIn, setSignIn] = useState<boolean>(false);
    const [showCart, setShowCart] = useState(false);
  

  console.log({token})

  return (
    <div className="relative">
      <Header
        setShowCart={setShowCart}
        token={token}
        setToken={setToken}
        setSignIn={setSignIn}
      />

      {signIn ? <SignIn setToken={setToken} setSignIn={setSignIn} /> : ""}

      <FilterProduct
        showCart={showCart}
        setShowCart={setShowCart}
        token={token}
      />
    </div>
  );
}

export default App;
