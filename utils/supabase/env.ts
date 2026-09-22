/**
 * Supabase connection details, with a legible failure.
 *
 * These were read with `process.env.X!` — the `!` silences TypeScript
 * but does nothing at runtime, so a missing variable reached
 * createServerClient as `undefined` and surfaced as
 * "supabaseUrl is required" from deep inside supabase-js. Because the
 * proxy runs on every request, that became a 500 on every page with no
 * hint as to the cause.
 *
 * IMPORTANT: NEXT_PUBLIC_* values are inlined at BUILD time, not read
 * at runtime. Adding them in the Vercel dashboard does nothing until
 * you redeploy.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `[supabase] ${name} is not set.\n` +
        `  Local:  add it to .env, then restart the dev server.\n` +
        `  Vercel: Settings → Environment Variables, then REDEPLOY — ` +
        `NEXT_PUBLIC_* values are baked in at build time, so a new value ` +
        `has no effect until the next build.`,
    );
  }
  return value;
}

export const supabaseUrl = () =>
  required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);

export const supabaseKey = () =>
  required(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
