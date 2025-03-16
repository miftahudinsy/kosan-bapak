import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Tipe untuk opsi cookie
type CookieOptions = {
  name?: string;
  value?: string;
  maxAge?: number;
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
};

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(_name: string, _value: string, _options: Record<string, unknown>) {
          // Cookies di next/headers tidak dapat diatur langsung di server component
          // Tapi masih diperlukan untuk createServerClient
        },
        remove(_name: string, _options: Record<string, unknown>) {
          // Cookies di next/headers tidak dapat dihapus langsung di server component
          // Tapi masih diperlukan untuk createServerClient
        },
      },
    }
  );
}
