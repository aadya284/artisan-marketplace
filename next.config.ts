import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "https://96019316915249fd93e21677f8c6e329-b2082856-7703-4295-ad61-ba9c21.projects.builder.codes"
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  // Temporarily disabled component-tagger-loader due to missing magic-string dependency
  // turbopack: {
  //   rules: {
  //     "*.{jsx,tsx}": {
  //       loaders: [LOADER]
  //     }
  //   }
  // }
};

export default nextConfig;
