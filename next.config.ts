import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["192.168.13.104:3013", "localhost:3013", "192.168.13.104", "localhost", "*"],
    },
  },
  async rewrites() {
    return [
      {
        source: '/media/:path*',
        destination: 'https://onglao.giac.ngo/media/:path*',
      },
      {
        source: '/lao_co_nen/:path*',
        destination: 'https://onglao.giac.ngo/lao_co_nen/:path*',
      },
    ];
  },
};

export default nextConfig;
