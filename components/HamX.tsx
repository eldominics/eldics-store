"use client";

import { assets } from "@/public/assets/assets";
import Image from "next/image";
import React from "react";

interface HamXParams {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const HamX = (params: HamXParams) => {
  const { isOpen, setIsOpen } = params;

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      {!isOpen && (
        <button
          onClick={toggleMenu}
          className="flex items-center gap-2 hover:text-gray-400"
        >
          <Image src={assets.hamIcon} alt="Toggle" className=" w-6 h-6" />
        </button>
      )}
      {isOpen && (
        <button onClick={toggleMenu} className="text-gray-500 text-2xl">
          X
        </button>
      )}
    </div>
  );
};

export default HamX;
