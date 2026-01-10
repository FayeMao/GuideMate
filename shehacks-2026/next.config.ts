import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Headers for WebAR and camera access
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=*, microphone=*, geolocation=*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
