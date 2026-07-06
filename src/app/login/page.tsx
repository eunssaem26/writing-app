"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
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

  // Supabase 서버에 아예 닿지 못할 때(프로젝트 일시정지·네트워크 장애 등) 뜨는
  // "Failed to fetch" 류 에러를 사람이 읽을 수 있는 안내로 바꿔준다.
  const CONNECTION_MESSAGE =
    "We can't reach the login server right now — please try again in a few minutes or contact your teacher.\n지금 로그인 서버에 연결할 수 없어요. 잠시 후 다시 시도하거나 선생님께 문의해 주세요.";

  function isConnectionError(message?: string) {
    return !!message && /failed to fetch|networkerror|load failed|fetch/i.test(message);
  }

  async function signInWithGoogle() {
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) {
        setError(isConnectionError(error.message) ? CONNECTION_MESSAGE : error.message);
      }
    } catch (err) {
      setError(CONNECTION_MESSAGE);
      console.error("[login] Google sign-in failed", err);
    }
  }

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          // 사전 등록제: 등록된 학생 이메일만 로그인 링크 발송 (자동 가입 차단)
          shouldCreateUser: false,
          emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      setLoading(false);
      if (error) {
        const notRegistered =
          /signups? not allowed/i.test(error.message) ||
          error.code === "otp_disabled" ||
          error.code === "signup_disabled";
        if (notRegistered) {
          setError(
            "This email isn't registered yet — please contact your teacher.\n아직 등록되지 않은 이메일이에요. 선생님께 문의해 주세요."
          );
        } else {
          setError(isConnectionError(error.message) ? CONNECTION_MESSAGE : error.message);
        }
      } else {
        setSent(true);
      }
    } catch (err) {
      setLoading(false);
      setError(CONNECTION_MESSAGE);
      console.error("[login] email sign-in failed", err);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-10 text-center">
        <Image
          src="/characters/hogi.png"
          alt="호기 — your study buddy"
          width={96}
          height={96}
          className="mx-auto mb-3 rounded-full shadow-md"
          priority
        />
        <h1 className="text-3xl font-bold text-zinc-800">생각하는 글밭</h1>
        <p className="mt-1 text-lg font-medium text-emerald-700">
          Thinking Field
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Where Thoughts Grow — Korean reading &amp; writing classes
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Hi! I&apos;m Hogi, your study buddy 🐾 안녕, 나는 호기야!
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
          <p className="mt-4 whitespace-pre-line rounded-lg bg-red-50 p-3 text-sm text-red-600">
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
