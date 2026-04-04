/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental appDir as it's now stable in Next.js 14
  images: {
    domains: [
      'localhost',
      'traffeye.vercel.app',
      'your-api-domain.com',
      'lh3.googleusercontent.com', // For Google profile pictures
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
