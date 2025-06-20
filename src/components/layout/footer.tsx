import Link from 'next/link'
import { Heart, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                Givva
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md text-sm">
              Creating unforgettable moments through curated gift experiences. 
              Perfect for every occasion, delivered instantly, guaranteed to delight.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div>🔒 Secure Payments</div>
              <div>📅 12-Month Guarantee</div>
            </div>
          </div>

          {/* Gift Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Gift Categories</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Foodie Experiences</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Adventure & Sports</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Wellness & Spa</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Arts & Culture</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Nature & Outdoors</Link></li>
            </ul>
          </div>

          {/* Occasions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Occasions</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Birthdays</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Anniversaries</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Graduations</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Mother&apos;s Day</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Father&apos;s Day</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Gift Card Balance</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Booking Help</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Partner With Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col items-center space-y-4">
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-pink-600 to-orange-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <Twitter className="w-5 h-5 text-white" />
              </a>
            </div>
            
            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center">© 2024 Givva. All rights reserved.</p>
            
            {/* Legal Links */}
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 