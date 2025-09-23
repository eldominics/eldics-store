"use client";

import { assets } from "@/public/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import HamX from "./HamX";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3   text-white bg-black ">
      <Link href="/">
        <h1>Eldics Store</h1>
      </Link>
      <div className="flex items-center gap-6 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-400 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-400 transition">
          Shop
        </Link>
        <Link href="/about" className="hover:text-gray-400 transition">
          About Us
        </Link>
        <Link href="/contact" className="hover:text-gray-400 transition">
          Contact
        </Link>
      </div>

      <div>
        <ul className="hidden md:flex items-center gap-4 ">
          <button>
            <Image className="w-4 h-4" src={assets.search_icon} alt="search" />
          </button>

          <button className="flex items-center gap-2 hover:text-gray-400 transition">
            <Image src={assets.heart_icon} alt="favorite" className="w-4" />
          </button>

          <button className="flex items-center gap-2 hover:text-gray-400 transition">
            <Image src={assets.cart_icon} alt="cart" />
          </button>

          <button className="flex items-center gap-2 hover:text-gray-400 transition">
            <Image src={assets.user_icon} alt="user" />
          </button>
        </ul>
        {/* for mobile view */}
        <div className=" md:hidden flex items-center justify-center gap-3">
          <button>
            <Image className="w-6 h-6" src={assets.search_icon} alt="search" />
          </button>

          <button className="flex items-center gap-2 hover:text-gray-400 transition">
            <Image src={assets.cart_icon} alt="cart" className="w-6 h-6" />
          </button>
          <button className="flex items-center gap-2 hover:text-gray-400 transition">
            <Image src={assets.user_icon} alt="user" className="w-6 h-6" />
          </button>

          <HamX isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute w-[70%] h-full flex flex-col flex-full bg-black text-white top-[52px] right-0 z-10">
          <div className="flex flex-col items-center gap-6  mt-16">
            <Link href="/" className="hover:text-gray-400 transition">
              Home
            </Link>
            <Link
              href="/all-products"
              className="hover:text-gray-400 transition"
            >
              Shop
            </Link>
            <Link href="/about" className="hover:text-gray-400 transition">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-gray-400 transition">
              Contact
            </Link>

            <Link
              href="/favorites"
              className="flex items-center gap-2 hover:text-gray-400 transition"
            >
              Favorites
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
