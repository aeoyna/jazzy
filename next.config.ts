import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/jazzy",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
