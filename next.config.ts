import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Content images are served from the Sanity asset CDN. Scoped to that host only.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
