import { NextRequest, NextResponse } from 'next/server'
import { decodeJwt } from 'jose'

// UX gate only — presence + expiry check, no signature verification.
// Real authorization is enforced by the API (jwtVerify with the runtime secret)
// on every /api/admin/* call. We deliberately avoid verifying the signature here
// because Next inlines process.env at build time, which would use the build-time
// JWT_SECRET (not the runtime one) and reject valid tokens.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    try {
      const { exp } = decodeJwt(token)
      if (exp && Date.now() >= exp * 1000) throw new Error('expired')
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
