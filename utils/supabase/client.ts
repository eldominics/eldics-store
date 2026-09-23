import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";

export const createClient = () =>
  createBrowserClient(supabaseUrl(), supabaseKey());
