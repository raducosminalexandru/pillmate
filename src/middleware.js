import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthenticated = !!token
  

  const { pathname } = req.nextUrl
  

  const publicPaths = ['/', '/settings', '/signin', '/signup', '/medications']
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
  
 
  if (isPublicPath) {
    return NextResponse.next()
  }
  

  if (!isAuthenticated) {
  
    const url = new URL('/signin', req.url)
    
    url.searchParams.set('callbackUrl', encodeURI(pathname))
    return NextResponse.redirect(url)
  }
  

  return NextResponse.next()
}


export const config = { 
  matcher: [
    '/dashboard/:path*', 
    
    '/calendar/:path*',
    '/scan/:path*',
    '/history/:path*',
    '/profile/:path*',
    '/'  
  ]
};

