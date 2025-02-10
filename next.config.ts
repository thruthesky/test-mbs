import type { NextConfig } from "next";

const nextConfig = {
    output: "export", // Enables static export
    basePath: "/MyBlogSpot", // Replace with your GitHub repo name
    images: {
      unoptimized: true, // GitHub Pages does not support Next.js image optimization
    },
  };
  
  export default nextConfig;
  