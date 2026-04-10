// import path from 'path';
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//    // 1. Prisma is now handled automatically in newer Next.js versions, 
//   // but keeping this is fine and safe.
//   serverExternalPackages: ["@prisma/client"],
//   outputFileTracingRoot: path.join(__dirname, "../../"),
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
  
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//       },
//       {
//         protocol: "https",
//         hostname: "img.clerk.com",
//       },
//     ],
//   },
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 1. Prisma is now handled automatically in newer Next.js versions, 
  // but keeping this is fine and safe.
  serverExternalPackages: ["@prisma/client"],

  // REMOVED: outputFileTracingRoot (This was causing the Vercel path error)

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ]
  }
};

export default nextConfig;