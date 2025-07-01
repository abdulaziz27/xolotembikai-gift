import { ArrowLeft, Calendar, User, Facebook, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function BlogDetailPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4 max-w-4xl">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-purple-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-purple-600 transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-900">
              Revolutionizing the Experience Marketplace
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link 
          href="/blog" 
          className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block bg-blue-900 text-white px-3 py-1 rounded-md text-sm font-medium">
              Data Analytics
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Revolutionizing the Experience Marketplace: The dual impact of 
            Generative AI on Suppliers and Consumers
          </h1>

          {/* Meta Information */}
          <div className="flex items-center space-x-6 text-gray-600 mb-6">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Apr 23, 2025</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>Marcus Hunt and Hussain Hayat</span>
            </div>
          </div>

          {/* Article Subtitle */}
          <p className="text-lg text-gray-700 leading-relaxed">
            Gifly now offers virtual card redemption! Discover how to activate your 
            card, add it to Apple Pay or Google Wallet, and start using your reward 
            instantly.
          </p>
        </div>

        {/* Author Section */}
        <div className="flex items-center mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 overflow-hidden">
            <Image 
              src="/api/placeholder/48/48" 
              alt="Marcus Hunt" 
              width={48} 
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Marcus Hunt and Hussain Hayat</p>
            <p className="text-sm text-gray-600">Data Analytics Team</p>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <div className="w-full h-64 md:h-96 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white text-center px-8">
              WORK WITH<br />WHAT WORKS
            </h2>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-6">
            We've already written a blog about why encouraging our team to refer their friends and 
            colleagues works so well for us. It&apos;s <a href="#" className="text-blue-600 underline">here</a> if you want to read it.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            But, to really drive the point home—and hear a little more from our lovely team about 
            what drew them to GetYourGuide in the first place—we thought we'd write another one.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why do employee referrals work within our company culture?
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            There are lots of answers to this question. Here are our top three.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Employee referrals bring immense value, often connecting us with highly aligned and 
            dedicated candidates. Every referral helps shape our workplace community, enabling us to 
            expand our skill set with trusted professionals already vetted by a team member.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Secondly, referred employees are more likely to stick around because they understand the 
            company culture from the start. When our employees feel confident enough to recommend 
            us to their friends and ex-co-workers, it's a testament to the vibrant and welcoming 
            environment we work hard to maintain.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            Lastly, giving our employees a say in the company's structure builds collaboration, 
            community, and personal investment. That's why we offer cash bonuses for every successful 
            referral, incentivizing our team to invite those they trust into the fold.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            Now, for the fun part. We interviewed a few dynamic duos to prove just how well employee 
            referrals work for both us and our team at GetYourGuide.
          </p>
        </div>

        {/* Share Section */}
        <div className="border-t pt-8 mt-12">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Share</h3>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Related Post 1 */}
            <Link href="/blog/design-website-ai-2025">
              <div className="group cursor-pointer">
                <div className="w-full h-48 bg-blue-500 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AI Design</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                  How to design a website with AI in 2025
                </h4>
                <p className="text-sm text-gray-600">
                  Discover how artificial intelligence is revolutionizing web design and streamlining the creative process.
                </p>
              </div>
            </Link>

            {/* Related Post 2 */}
            <Link href="/blog/start-blog-10-steps">
              <div className="group cursor-pointer">
                <div className="w-full h-48 bg-purple-500 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Blog Guide</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                  How to start a blog in 10 steps: a beginner's guide
                </h4>
                <p className="text-sm text-gray-600">
                  Learn the complete process of starting your own blog from scratch with this comprehensive guide.
                </p>
              </div>
            </Link>

            {/* Related Post 3 */}
            <Link href="/blog/landing-page-8-steps">
              <div className="group cursor-pointer">
                <div className="w-full h-48 bg-pink-500 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Landing Pages</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                  How to create a powerful landing page in 8 easy steps
                </h4>
                <p className="text-sm text-gray-600">
                  Build high-converting landing pages that capture leads and drive business growth effectively.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 