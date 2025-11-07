"use client"
import React from 'react';
import Link from 'next/link';
import { useUser } from '@/context/user';

const Navbar: React.FC = () => {
  const { user } = useUser();

  return (
    <nav className="bg-zinc-50 p-4 flex justify-between items-center w-full">
      <Link href="/" className="hover:text-blue-500">
        Home
      </Link>
      <div>
        {!user ? <ul className="flex space-x-4">
          <li>
            <Link href="/register" className="hover:text-blue-500">
              register
            </Link>
          </li>
          <li>
            <Link href="/login" className="hover:text-blue-500">
              Login.
            </Link>
          </li>
        </ul> : <span>Hello, {user?.name}! <Link href="/logout" className="hover:text-blue-500">
          Logout
        </Link>
        </span>}


      </div>
    </nav>
  );
};

export default Navbar;
