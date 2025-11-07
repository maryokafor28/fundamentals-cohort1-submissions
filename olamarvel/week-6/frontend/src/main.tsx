import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { UserProvider } from "@/context/user";
import Navbar from "@/components/Navbar";
import { BrowserRouter, } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans text-black">
          <main className="min-h-screen w-full max-w-3xl  bg-white sm:items-start">
            <Navbar />
            <App />
          </main>
        </div>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)