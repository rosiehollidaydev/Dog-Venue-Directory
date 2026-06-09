import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  serverActions: {
    allowedOrigins: ["*"],
  },
};

export default nextConfig;
