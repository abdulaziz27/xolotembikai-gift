/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https', 
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https', 
        hostname: 'via.placeholder.com',
      },
    ],
    domains: [
      'xolotembikai.sgp1.cdn.digitaloceanspaces.com',
      'xolotembikai.sgp1.digitaloceanspaces.com',
      'images.unsplash.com'
    ],
  },

  output: 'standalone',
}

module.exports = nextConfig
