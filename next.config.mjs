/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["acdwmmzaeuxuxldwjrpl.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "acdwmmzaeuxuxldwjrpl.supabase.co",
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
