/** @type {import('next').NextConfig} */
const nextConfig = {
   basePath: "",
   assetPrefix: "",
   trailingSlash: false,
   eslint: {
      ignoreDuringBuilds: true,
   },
   typescript: {
      ignoreBuildErrors: true,
   },
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: '**',
         },
         {
            protocol: 'http',
            hostname: 'localhost',
         },
      ],
   },
   experimental: {
      webpackBuildWorker: true,
      parallelServerBuildTraces: true,
      parallelServerCompiles: true,
   },
};

export default nextConfig;
