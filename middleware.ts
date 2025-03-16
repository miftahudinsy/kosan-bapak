import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Kita perlu membuat respons baru karena header asli tidak dapat dimodifikasi
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          // Kita perlu membuat respons baru karena header asli tidak dapat dimodifikasi
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  // Periksa apakah pengguna memiliki sesi aktif
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = request.nextUrl.pathname;

  // Rute yang memerlukan autentikasi
  const authRequiredPaths = ["/dashboard", "/welcome"];
  const isAuthRequiredPath = authRequiredPaths.some(
    (authPath) => path.startsWith(authPath) || path === authPath
  );

  // Rute hanya untuk pengguna tidak terotentikasi
  const publicOnlyPaths = ["/login", "/register"];
  const isPublicOnlyPath = publicOnlyPaths.includes(path);

  // Jika rute memerlukan autentikasi tetapi pengguna tidak login
  if (isAuthRequiredPath && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika pengguna sudah login, tetapi mencoba mengakses halaman publik
  if (isPublicOnlyPath && session) {
    try {
      // Cek apakah pengguna sudah memiliki kos
      const { data: kosData } = await supabase
        .from("kos")
        .select("id")
        .eq("user_id", session.user.id);

      // Redirect ke welcome jika belum ada data kos
      if (!kosData || kosData.length === 0) {
        return NextResponse.redirect(new URL("/welcome", request.url));
      }

      // Jika sudah ada data kos, redirect ke dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      console.error("Error checking kos data in middleware:", error);
      // Tetap arahkan ke dashboard sebagai fallback
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)"],
};
