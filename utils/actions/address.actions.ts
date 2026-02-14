"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

interface AddressDBParams {
  region: string;
  title: string;
  address: string;
  state: string;
  city: string;
  phone: string;
  countryCode: string;
  flag: string;
}
export async function fetchAddresses() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;

  if (!userId) {
    console.log("User not authenticated-->>cartActions.ts");
    redirect("/login");
    // throw new Error("User not authenticated-->>cartActions.ts");
  }

  const { data: addresses, error } = await supabase
    .from("address")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching addresses in address action :", error);
    throw new Error("Error fetching addresses from address action  ");
  }

  return addresses;
}

export async function saveAddressDB(formData: AddressDBParams) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;

  if (!userId) {
    console.log("User not authenticated-->>cartActions.ts");
    redirect("/login");
  }
  console.log("address params--====>", formData);

  const { data: address, error } = await supabase
    .from("address")
    .insert([
      {
        user_id: userId,
        region: formData.region,
        title: formData.title,
        address: formData.address,
        state: formData.state,
        city: formData.city,
        country_code: `${formData.countryCode}`,
        flag: `${formData.flag}`,
        phone: `${formData.phone}`,
      },
    ])
    .eq("user_id", userId)
    .select();

  if (error) {
    console.error("Error fetching addresses in address action :", error);
    revalidatePath("/address");
    return { success: false };
  }

  console.log("address sent to DB====-->", address);
  revalidatePath("/address");
  return { success: true };
}

export async function makeDefaultAddress(addressId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;

  if (!userId) {
    console.log("User not authenticated-->>cartActions.ts");
    redirect("/login");
    // throw new Error("User not authenticated-->>cartActions.ts");
  }

  const { error } = await supabase
    .from("address")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", userId)
    .select();

  if (error) {
    console.log("error deleting user", error);
    return false;
  }

  revalidatePath("/address");
  return true;
}
