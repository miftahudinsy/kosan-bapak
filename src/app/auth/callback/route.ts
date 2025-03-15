import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });

    // Menukar code dengan session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL berisi action=resetPassword untuk kasus reset password
  if (requestUrl.searchParams.get("type") === "recovery") {
    return NextResponse.redirect(new URL("/reset-password", requestUrl.origin));
  }

  // Mengarahkan ke halaman setelah login
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
