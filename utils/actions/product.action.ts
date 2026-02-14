"use server";
import { ProductParams } from "@/shared.types";
import { createClient } from "../supabase/server";

export async function fetchProducts(): Promise<ProductParams[]> {
  const supabase = await createClient();
  const { data: products, error } = await supabase.from("products").select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return products;
}

export async function fetchProductById(id: string) {
  const supabase = await createClient();
  try {
    const { data: product, error } = await supabase
      .from("products")
      .select("*,category:categories!fk_category(name)")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      return null;
    }

    return product;
  } catch (error) {
    console.log(error);
    return null;
  }
}
