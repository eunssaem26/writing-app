"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfig } from "@/lib/supabase/config";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { configured } = supabaseConfig();

  async function signInWithGoogle() {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) setError(error.message);
  }

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-zinc-800">생각하는 글밭</h1>
        <p className="mt-1 text-lg font-medium text-emerald-700">
          Thinking Field
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Where Thoughts Grow — Korean reading &amp; writing classes
        </p>
      </div>

      <div className="rounded-2xl border-2 border-amber-200 bg-white p-8 shadow-sm">
        <h2 className="mb-1 text-xl font-bold text-zinc-800">Log in</h2>
        <p className="mb-6 text-sm text-zinc-500">
          One account for placement tests, lessons, and progress reports.
          <br />
          <span className="text-zinc-400">
            진단평가·수업·결과 리포트를 하나의 계정으로 이용해요.
          </span>
        </p>

        {!configured && (
          <p className="mb-4 rounded-lg bg-amber-100 p-3 text-sm text-amber-800">
            Login is being set up — please check back soon.
            <br />
            로그인 기능을 준비하고 있어요.
          </p>
        )}

        <button
          onClick={signInWithGoogle}
          disabled={!configured}
          className="mb-3 w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue with Google
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-zinc-400">
          <div className="h-px flex-1 bg-zinc-200" />
          or
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        {sent ? (
          <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            Check your email — we sent you a login link!
            <br />
            이메일로 로그인 링크를 보냈어요.
          </p>
        ) : (
          <form onSubmit={signInWithEmail}>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-zinc-600"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={!configured}
              className="mb-3 w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-zinc-800 outline-none focus:border-emerald-400 disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!configured || loading}
              className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Sending..." : "Send login link"}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-zinc-400">
        No password needed — we email you a secure link.
        <br />
        비밀번호 없이 이메일 링크로 안전하게 로그인해요.
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
