import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Enable support for subdomains in development
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3001", "*.localhost:3001"],
    },
  },

  images: {
    domains: ["images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "admin.hehehihi.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
