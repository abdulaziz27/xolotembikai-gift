'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-md z-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <Link href="/">
              <span className="text-white text-xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                Givva
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/experiences" className="text-white hover:text-purple-400 transition-colors">
              Experiences
            </Link>
            <Link href="/about" className="text-white hover:text-purple-400 transition-colors">
              About Us
            </Link>
            <Link href="/partner" className="text-white hover:text-purple-400 transition-colors">
              Become A Partner
            </Link>
            <Link href="/blog" className="text-white hover:text-purple-400 transition-colors">
              Blog
            </Link>
            <Link href="/faq" className="text-white hover:text-purple-400 transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-purple-400 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/experiences" className="block px-3 py-2 text-white hover:text-purple-400 transition-colors">
                Experiences
              </Link>
              <Link href="/about" className="block px-3 py-2 text-white hover:text-purple-400 transition-colors">
                About Us
              </Link>
              <Link href="/partner" className="block px-3 py-2 text-white hover:text-purple-400 transition-colors">
                Become A Partner
              </Link>
              <Link href="/blog" className="block px-3 py-2 text-white hover:text-purple-400 transition-colors">
                Blog
              </Link>
              <Link href="/faq" className="block px-3 py-2 text-white hover:text-purple-400 transition-colors">
                FAQ
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-white hover:text-purple-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 