import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["192.168.13.104:3013", "localhost:3013", "192.168.13.104", "localhost", "*"],
    },
  },
};

export default nextConfig;
