import type { NextConfig } from "next";

// Static export served from private S3 behind CloudFront (langler.rtrydev.com).
// trailingSlash is required for the CloudFront /path/ -> /path/index.html rewrite.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
