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
}

const withBundleAnalyzer = require('@next/bundle-analyzer', {
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer(nextConfig)
