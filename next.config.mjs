/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.digitaloceanspaces.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
