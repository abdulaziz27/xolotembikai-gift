'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, User, Tag } from 'lucide-react'

export default function BlogPage() {
  const featuredPost = {
    id: "revolutionizing-experience-marketplace",
    title: "Revolutionizing the Experience Marketplace: The dual impact of Generative AI on Suppliers and Consumers",
    excerpt: "Gifly now offers virtual card redemption! Discover how to activate your card, add it to Apple Pay or Google Wallet, and start using your reward instantly.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    category: "Data Analytics",
    author: "Marcus Hunt and Hussain Hayat",
    date: "Apr 23, 2025",
    readTime: "8 min read"
  }

  const topArticles = [
    {
      id: "design-website-ai-2025",
      title: "How to design a website with AI in 2025",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      category: "AI Knowledge Hub",
      readTime: "6 min read"
    },
    {
      id: "domain-name-matters",
      title: "What is a domain name and why it matters",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
      category: "Website Essentials",
      readTime: "4 min read"
    },
    {
      id: "start-blog-10-steps",
      title: "How to start a blog in 10 steps: a beginner's guide",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      category: "Website Essentials",
      readTime: "10 min read"
    },
    {
      id: "web-design-guide",
      title: "What is web design? A comprehensive guide",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      category: "Website Essentials",
      readTime: "7 min read"
    },
    {
      id: "landing-page-8-steps",
      title: "How to create a powerful landing page in 8 easy steps",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
      category: "Marketing Insights",
      readTime: "5 min read"
    },
    {
      id: "wix-website-examples",
      title: "18 outstanding Wix website examples that will inspire you",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop",
      category: "Website Essentials",
      readTime: "12 min read"
    }
  ]

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section with Featured Post */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-purple-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Featured Post Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                <Tag className="w-4 h-4 mr-2" />
                {featuredPost.category}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {featuredPost.title}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {featuredPost.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {featuredPost.date}
                </div>
                <span>{featuredPost.readTime}</span>
              </div>
              
              <Link href={`/blog/${featuredPost.id}`}>
                <button className="inline-flex items-center bg-gradient-to-r from-purple-600 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Read more
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </Link>
            </div>
            
            {/* Featured Post Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Articles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Top Articles
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topArticles.map((article) => (
              <Link key={article.id} href={`/blog/${article.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative rounded-2xl overflow-hidden mb-6 shadow-lg">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors leading-tight">
                      {article.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{article.readTime}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Stay Updated with Our Latest Posts
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Get the latest articles, tips, and insights delivered straight to your inbox
          </p>
          
          <div className="flex flex-col sm:flex-row max-w-lg mx-auto space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
            <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
} 