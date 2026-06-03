import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // www → wwwなし に統一（永続リダイレクト）
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.hsp.ink" }],
        destination: "https://hsp.ink/:path*",
        permanent: true,
      },
    ];
  },
  images: {
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
