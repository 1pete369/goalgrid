import { headers } from "next/headers";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Define the protocol
        hostname: 'lh3.googleusercontent.com', // Define the hostname
        pathname: '/**', // Define the path (wildcard to allow any image from the domain)
      },
      {
        protocol : 'https',
        hostname : 'transform.gammacdn.com',
        pathname : '/**'
      },{
        protocol : 'https',
        hostname : '**',
        pathname : '**'
      }
    ],
   domains: ['picsum.photos','images.pexels.com'],
  },
  poweredByHeader : false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config : any) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
