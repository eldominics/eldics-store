import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseKey, supabaseUrl } from "./env";
import { cache } from "react";

export async function createClient() {
  const cookieStore = await cookies();

  // Server-side Supabase client wired to Next's cookie store so the
  // user's session is maintained across server components and actions.
  return createServerClient(supabaseUrl(), supabaseKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // `setAll` was called from a Server Component. Safe to ignore
          // because the proxy refreshes user sessions on every request.
        }
      },
    },
  });
}

/**
 * Wrapping in `cache()` means this runs exactly once per request even if
 * several server components ask for the user at the same time.
 */
export const getCachedUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
