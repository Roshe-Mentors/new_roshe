import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['totfmiywcmwjjblhrjdw.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'totfmiywcmwjjblhrjdw.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
