import type React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-8">
      <div className="flex flex-wrap justify-between max-w-6xl mx-auto">
        <div className="flex-1 min-w-[200px] mb-4">
          <h3 className="mb-4 text-xl font-bold">BaveCommerce</h3>
          <p>Shop the best products at unbeatable prices.</p>
        </div>
        <div className="flex-1 min-w-[150px] mb-4">
          <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
          <ul className="list-none p-0">
            <li>
              <a href="/" className="text-white no-underline hover:underline">
                Home
              </a>
            </li>
            <li>
              <a
                href="/shop"
                className="text-white no-underline hover:underline"
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="text-white no-underline hover:underline"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-white no-underline hover:underline"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div className="flex-1 min-w-[200px] mb-4">
          <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
          <p>Email: support@bavecommerce.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>
        <div className="flex-1 min-w-[150px] mb-4">
          <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
          <div className="flex gap-2">
            <a
              href="#"
              aria-label="Facebook"
              className="text-white hover:underline"
            >
              FB
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-white hover:underline"
            >
              TW
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-white hover:underline"
            >
              IG
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
        &copy; {new Date().getFullYear()} BaveCommerce. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
