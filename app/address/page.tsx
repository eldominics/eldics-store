import AddressCard from "@/components/AddressCard";
import { Navbar } from "@/components/Navbar";
import NewAddress from "@/components/NewAddress";
import { AddressParams } from "@/shared.types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Address() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("address")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  console.log("address data--->>", data);

  return (
    <>
      <Navbar />
      <NewAddress />

      {data && data.length > 0 && (
        <>
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center mb-4 mt-16">
              <p className="text-3xl font-medium">
                My
                <span className="font-medium text-[#043033] ">Addresses</span>
              </p>
              <div className="w-28 h-0.5 bg-[#043033] mt-2"></div>
            </div>
          </div>

          <div className=" bg-[#043033] flex flex-col md:flex-row items-center justify-center">
            {data &&
              data.map((address: AddressParams, index: number) => (
                <AddressCard address={address} key={index} />
              ))}
          </div>
        </>
      )}
    </>
  );
}
