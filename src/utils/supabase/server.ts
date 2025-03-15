import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Cookies di next/headers tidak dapat diatur langsung di server component
          // Tapi masih diperlukan untuk createServerClient
        },
        remove(name: string, options: any) {
          // Cookies di next/headers tidak dapat dihapus langsung di server component
          // Tapi masih diperlukan untuk createServerClient
        },
      },
    }
  );
}
