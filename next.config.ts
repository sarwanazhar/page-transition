import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.100.9"],
  output: "export", // Forces Next.js to build a purely client-side static site
  images: {
    unoptimized: true, // Required if you ever use Next.js <Image /> components in static mode
  },
};

export default nextConfig;
