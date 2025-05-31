/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000', // kosongkan jika tidak ada port khusus
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '',
        pathname: '/storage/**',
      },
      // Jika menggunakan domain lain untuk production
      {
        protocol: 'https',
        hostname: 'yourdomain.com',
        pathname: '/storage/**',
      }
    ],
  },
}

module.exports = nextConfig