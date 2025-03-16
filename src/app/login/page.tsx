"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Cek parameter demo saat komponen dimuat
  useEffect(() => {
    const isDemo = searchParams.get("demo") === "true";
    if (isDemo) {
      setEmail("demo@kosanbapak.com");
      setPassword("kosanbapak132");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Clear any existing session cookies first to prevent issues
      await supabase.auth.signOut();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: "select_account",
            access_type: "offline", // Request refresh token
          },
        },
      });

      if (error) {
        setError(error.message);
        console.error("Google login error:", error);
      } else if (data?.url) {
        // Redirect manually to Google's auth page
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      setError("Terjadi kesalahan saat login dengan Google");
    } finally {
      // We don't set loading to false here because we're redirecting away
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Masukkan email Anda terlebih dahulu");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage("Link reset password telah dikirim ke email Anda");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Masuk Kosan Bapak
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <button
            type="button"
            onClick={handleResetPassword}
            className="w-full text-blue-500 font-medium hover:text-blue-600 hover:cursor-pointer"
          >
            Lupa Password?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-xl bg-blue-500 text-white p-4 mt-7 font-medium rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Loading..." : "Masuk"}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 p-4 rounded-md hover:bg-gray-50 flex items-center justify-center"
          >
            <Image
              src="/google-icon.png"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            Masuk dengan Google
          </button>
        </div>

        <p className="mt-4 text-center text-lg text-gray-600">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-blue-500 font-medium hover:text-blue-600"
          >
            Daftar
          </a>
        </p>
      </div>
    </div>
  );
}
