import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseConfig } from "@/lib/supabase/config";

const PROTECTED_PREFIXES = ["/stage", "/dashboard", "/diagnosis"];

export async function proxy(request: NextRequest) {
  const { url, anonKey, configured } = supabaseConfig();
  if (!configured) {
    // Supabase 프로젝트 연결 전에는 로그인 게이트를 끄고 전부 통과시킨다
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!user && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

// 보호 경로에서만 미들웨어를 실행한다. 공개 페이지(홈·로그인·블로그 링크 등)에는
// 인증서버 왕복을 걸지 않아 콜드스타트 지연과 요청 비용을 줄인다.
// (홈은 페이지 자체에서 로그인 상태를 확인하므로 미들웨어가 필요 없다.)
// PROTECTED_PREFIXES와 반드시 일치시킬 것.
export const config = {
  matcher: ["/stage/:path*", "/dashboard/:path*", "/diagnosis/:path*"],
};
