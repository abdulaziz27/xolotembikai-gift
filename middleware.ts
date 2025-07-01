import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Get user profile to check role
  let userRole = 'user'
  if (user) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      // Fallback to user_metadata if profile not found
      userRole = profile?.role || user.user_metadata?.role || 'user'
      
      if (error && !user.user_metadata?.role) {
        console.warn('Profile not found and no role in user_metadata:', error.message)
      }
    } catch (error) {
      console.warn('Error fetching user profile in middleware:', error)
      userRole = user.user_metadata?.role || 'user'
    }
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/account', '/admin', '/api/admin', '/api/checkout']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Admin-only routes (including API routes)
  const adminRoutes = ['/admin', '/api/admin']
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  // Handle unauthenticated users
  if (isProtectedRoute && !user) {
    // For API routes, return 401 instead of redirect
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // For pages, redirect to login
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Handle non-admin users accessing admin routes
  if (isAdminRoute && user && userRole !== 'admin') {
    // For API routes, return 403 instead of redirect
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
    
    // For pages, redirect to account
    return NextResponse.redirect(new URL('/account', request.url))
  }

  // Redirect admin users away from regular account
  if (pathname.startsWith('/account') && user && userRole === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Handle legacy dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (user && userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    } else if (user) {
      return NextResponse.redirect(new URL('/account', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 