import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Powered-By", value: "" },
          { key: "Server", value: "" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  /* config options here */

  // Enable support for subdomains in development
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3001",
        "*.localhost:3001",
        "admin.houseofsenses.vn",
        "https://admin.houseofsenses.vn",
      ],
    },
  },

  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "admin.houseofsenses.vn",
        pathname: "/**",
      },
    ],
    // Allow Next.js image optimization to fetch from localhost (private IP) in development
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
