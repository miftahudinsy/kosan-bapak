import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    try {
      // Pastikan cookies di-await
      const cookieStore = await cookies();

      // Gunakan createServerClient bukan createRouteHandlerClient
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              cookieStore.set(name, value, options);
            },
            remove(name: string, options: any) {
              cookieStore.set(name, "", options);
            },
          },
        }
      );

      // Menukar code dengan session
      const { error: sessionError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (sessionError) {
        console.error("Error exchanging code for session:", sessionError);
        return NextResponse.redirect(
          new URL("/login?error=auth", requestUrl.origin)
        );
      }

      // Cek jika user sudah login
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error getting user:", userError);
        return NextResponse.redirect(
          new URL("/login?error=user", requestUrl.origin)
        );
      }

      // Cek apakah user sudah memiliki data kos
      const { data: kosData, error: kosError } = await supabase
        .from("kos")
        .select("id")
        .eq("user_id", user.id);

      if (kosError) {
        console.error("Error checking kos data:", kosError);
      }

      // Jika belum ada data kos, redirect ke halaman welcome
      if (!kosData || kosData.length === 0) {
        // Sesi seharusnya sudah tersimpan, redirect ke welcome
        return NextResponse.redirect(new URL("/welcome", requestUrl.origin));
      }

      // Jika sudah ada data kos, redirect ke dashboard
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
    } catch (error) {
      console.error("Unexpected error in auth callback:", error);
      return NextResponse.redirect(
        new URL("/login?error=unexpected", requestUrl.origin)
      );
    }
  }

  // URL berisi action=resetPassword untuk kasus reset password
  if (requestUrl.searchParams.get("type") === "recovery") {
    return NextResponse.redirect(new URL("/reset-password", requestUrl.origin));
  }

  // Fallback jika tidak ada kondisi yang terpenuhi, arahkan ke login
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
