import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pnpm workspace: packages live in ../node_modules, so Turbopack's root must be the repo root
  outputFileTracingRoot: path.join(__dirname, ".."),
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "via.placeholder.com", pathname: "/**" },
      { protocol: "https", hostname: "via.placeholder.com", pathname: "/**" },
      { protocol: "http", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
    ],
  },
  async rewrites() {
    const backendUrl = (process.env.BACKEND_API_URL || "http://localhost:5000").replace(/\/+$/, "");

    return [
      { source: "/api/:path*", destination: `${backendUrl}/api/:path*` },
      { source: "/uploads/:path*", destination: `${backendUrl}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
