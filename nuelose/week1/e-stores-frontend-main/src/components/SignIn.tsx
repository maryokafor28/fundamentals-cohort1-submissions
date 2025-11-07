import { FaTimes } from "react-icons/fa";
import React, { useRef } from "react";
import axios from "axios";

export interface SignInProps {
  setSignIn: React.Dispatch<React.SetStateAction<boolean>>;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

function SignIn(props: SignInProps) {
  const { setSignIn, setToken } = props;

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  async function handleSignIn(e: React.MouseEvent) {
    e.preventDefault();
    const response = await axios.post<{
      user: { email: string };
      token: string;
    }>("http://localhost:3000/signin", {
      email: emailRef.current!.value,
      password: passwordRef.current!.value,
    });

    if (response.status === 200) {
      alert("Signed Successfuly");
      setSignIn((sign) => !sign);
      setToken(response.data.token);
    }
  }

  async function handleSignUp(e: React.MouseEvent) {
    e.preventDefault();
    const response = await axios.post<{
      user: { email: string };
      token: string;
    }>("http://localhost:3000/signup", {
      email: emailRef.current!.value,
      password: passwordRef.current!.value,
    });

    if (response.status.toString().startsWith("2")) {
      alert("Signed Successfuly");
      setSignIn((sign) => !sign);
      setToken(response.data.token);
    }
  }

  return (
    <div className="absolute bg-slate-700/30 w-full h-screen">
      <form className="fixed top-1/3 left-1/3 bg-slate-50 p-4 rounded-2xl space-y-4  ">
        <div
          onClick={() => setSignIn((sign) => !sign)}
          className="flex justify-end cursor-pointer"
        >
          <FaTimes />
        </div>
        <div>
          <h3>Sign in to your accout</h3>
          <p>Access your personal shopping cart and order history</p>
        </div>

        <div className="flex flex-col ">
          <label htmlFor="email">Email</label>
          <input
            required
            type="text"
            placeholder="Enter your email"
            className="cursor-not-allowed"
            ref={emailRef}
          />

          <label htmlFor="email">Password</label>
          <input
            required
            type="password"
            placeholder="Enter your password"
            className="cursor-not-allowed"
            ref={passwordRef}
          />
        </div>
        <button
          onClick={handleSignIn}
          className="w-full text-slate-50 bg-slate-800 py-2 rounded-lg cursor-not-allowed"
        >
          Sign In
        </button>

        <button
          onClick={handleSignUp}
          className="w-full  border border-slate-300 py-2 rounded-lg cursor-pointer"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignIn;
