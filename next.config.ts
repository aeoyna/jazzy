import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/jam" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/jam" : "",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
