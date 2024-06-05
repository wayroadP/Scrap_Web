import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
    console.log('Test Middleware')
  return NextResponse.redirect(new URL('/BagOpened', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/home/:path*',
}