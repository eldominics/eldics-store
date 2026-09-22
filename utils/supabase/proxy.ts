import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseKey, supabaseUrl } from "./env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl(), supabaseKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value),
        );
      },
    },
  });

  // Run getUser() immediately to trigger the cookie refresh cycle.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- ROUTE PROTECTION ---
  // There is no sign-in page. Checkout and /orders handle a missing
  // session inline with an email + code prompt, so nothing is redirected
  // away for being signed out.
  //
  // /verify-payment is the exception: it turns a Paystack reference into
  // order rows and is meaningless without a session, so send that one to
  // the cart instead of showing an error.
  if (request.nextUrl.pathname.startsWith("/verify-payment") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/cart";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // /admin renders its own sign-in prompt and its own "not an admin"
  // screen, so it is not redirected here. The real protection is RLS
  // plus the is_admin() check inside every admin server action —
  // a proxy rule would only hide the UI, not the data.

  return supabaseResponse;
}
