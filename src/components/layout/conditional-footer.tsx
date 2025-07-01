'use client'

import { usePathname } from 'next/navigation'
import Footer from './footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  
  // Don't show footer on admin or account pages
  const hideFooter = pathname.startsWith('/admin') || pathname.startsWith('/account')
  
  if (hideFooter) {
    return null
  }
  
  return <Footer />
} 