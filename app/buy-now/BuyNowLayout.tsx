import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

const BuyNowLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <div>{user && <div>{children}</div>}</div>;
};

export default BuyNowLayout;
