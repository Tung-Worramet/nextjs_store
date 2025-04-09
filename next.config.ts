import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true, // เพื่อเปิดใช้งานการแคช
  }
};

export default nextConfig;
