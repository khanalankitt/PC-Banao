import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external image hostnames used across the app
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
