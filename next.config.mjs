// const isProduction = process.env.NEXT_PUBLIC_NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
   output: "export",
   basePath: "",
   assetPrefix: "",
   trailingSlash: true,
   eslint: {
      ignoreDuringBuilds: true,
   },
   typescript: {
      ignoreBuildErrors: true,
   },
   images: {
      unoptimized: true,
   },
   experimental: {
      webpackBuildWorker: true,
      parallelServerBuildTraces: true,
      parallelServerCompiles: true,
   },
};

export default nextConfig;
