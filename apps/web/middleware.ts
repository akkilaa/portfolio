import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_ADMIN_PREFIXES = ['/admin/login', '/admin/verify']

function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_PREFIXES.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (isPublicAdminPath(pathname)) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get('accessToken')?.value
  if (accessToken) {
    return NextResponse.next()
  }

  const loginUrl = new URL('/admin/login', request.url)
  const redirectTo = `${pathname}${search}`
  loginUrl.searchParams.set('next', redirectTo)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}
