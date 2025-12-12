import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware doesn't work in static export, so we'll skip it during build
// Admin routes will be handled client-side in static builds
export async function middleware(request: NextRequest) {
  // In static export, middleware is not executed, so just pass through
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
