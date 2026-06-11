import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./config";

// 서버 전용 관리자 클라이언트 — 학생 계정 생성 등 admin 작업에만 사용.
// SUPABASE_SECRET_KEY는 절대 NEXT_PUBLIC_ 접두사를 붙이면 안 된다 (브라우저 노출 금지).
export function createAdminClient() {
  const { url, configured } = supabaseConfig();
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!configured || !secretKey) return null;
  return createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
