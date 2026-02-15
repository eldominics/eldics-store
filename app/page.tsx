import Footer from "@/components/Footer";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProduct";
import { Navbar } from "@/components/Navbar";
import { fetchProducts } from "@/utils/actions/product.action";

import React from "react";

export default async function page() {
  const allProducts = await fetchProducts();
  return (
    <div>
      <Navbar />
      <div>
        <HeaderSlider />

        <HomeProducts products={allProducts} />
      </div>

      <Footer />
    </div>
  );
}
