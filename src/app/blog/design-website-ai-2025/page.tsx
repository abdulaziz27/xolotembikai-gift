import { ArrowLeft, Calendar, User, Facebook, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'

export default function BlogDetailPage() {
  return (
    <div className="min-h-screen bg-white">
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
              How to design a website with AI in 2025
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
            <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
              AI Knowledge Hub
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How to design a website with AI in 2025
          </h1>

          {/* Meta Information */}
          <div className="flex items-center space-x-6 text-gray-600 mb-6">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Dec 10, 2024</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>Sarah Chen</span>
            </div>
          </div>

          {/* Article Subtitle */}
          <p className="text-lg text-gray-700 leading-relaxed">
            Discover how artificial intelligence is revolutionizing web design, making it faster, 
            smarter, and more accessible than ever before.
          </p>
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <div className="w-full h-64 md:h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white text-center px-8">
              AI DESIGN<br />REVOLUTION
            </h2>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-6">
            The landscape of web design is evolving rapidly, and artificial intelligence is at the 
            forefront of this transformation. In 2025, AI tools have become sophisticated enough to 
            assist designers in creating stunning, functional websites with unprecedented speed and precision.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            The AI Design Advantage
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            AI-powered design tools are no longer just concept generators—they&apos;re comprehensive 
            solutions that can handle everything from layout optimization to color palette selection. 
            These tools learn from millions of design patterns to suggest the most effective solutions 
            for your specific needs.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Modern AI design platforms can analyze your content, understand your brand identity, 
            and generate multiple design variations in minutes. This allows designers to focus on 
            strategic thinking and creative direction rather than repetitive tasks.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Key AI Tools for Web Design
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Several AI tools have emerged as game-changers in the web design industry. From automated 
            layout generators to intelligent image optimization, these tools are making professional 
            design accessible to everyone.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            The integration of AI in web design isn&apos;t about replacing human creativity—it&apos;s about 
            amplifying it. Designers can now iterate faster, explore more possibilities, and deliver 
            better results in less time.
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
            <Link href="/blog/revolutionizing-experience-marketplace">
              <div className="group cursor-pointer">
                <div className="w-full h-48 bg-orange-500 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Data Analytics</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                  Revolutionizing the Experience Marketplace
                </h4>
                <p className="text-sm text-gray-600">
                  Explore the dual impact of Generative AI on suppliers and consumers in the experience marketplace.
                </p>
              </div>
            </Link>

            {/* Related Post 2 */}
            <Link href="/blog/web-design-guide">
              <div className="group cursor-pointer">
                <div className="w-full h-48 bg-green-500 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Web Design</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                  What is web design? A comprehensive guide
                </h4>
                <p className="text-sm text-gray-600">
                  Understanding the fundamentals of web design and its impact on user experience.
                </p>
              </div>
            </Link>

            {/* Related Post 3 */}
            <Link href="/blog/domain-name-matters">
              <div className="group cursor-pointer">
                <div className="w-full h-48 bg-indigo-500 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Domains</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                  What is a domain name and why it matters
                </h4>
                <p className="text-sm text-gray-600">
                  Learn about domain names and their crucial role in establishing your online presence.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 