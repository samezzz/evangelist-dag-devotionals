/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/samezzz/daily-devotionals/main/images/**'
      }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
}

module.exports = nextConfig
