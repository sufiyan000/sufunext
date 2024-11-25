/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ["drive.google.com"],
        remotePatterns: [
          {
            protocol: "https",
            hostname: "drive.google.com",
            pathname: "**",
          },
        ],
      },
};

export default nextConfig;
