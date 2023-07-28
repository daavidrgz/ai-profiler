/** @type {import('next').NextConfig} */

host = process.env.API_HOST || "localhost";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://${host}:8000/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
