import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              🎁 Xolotembikai Gift
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/about" className="text-gray-600 hover:text-purple-600">
                About
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-purple-600">
                FAQ
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-purple-600">
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-purple-600"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
} 