import HeaderSlider from "@/components/HeaderSlider";
import { Navbar } from "@/components/Navbar";
import React from "react";

export default function page() {
  return (
    <div>
      <Navbar />
      <div>
        <HeaderSlider />
      </div>
    </div>
  );
}
