/** @type {import('next').NextConfig} */
const nextConfig = {
   basePath: process.env.NODE_ENV === 'production' ? '/nnp-web' : '',
   assetPrefix: process.env.NODE_ENV === 'production' ? '/nnp-web' : '',
   trailingSlash: true,
   output: 'export',
   eslint: {
      ignoreDuringBuilds: true,
   },
   typescript: {
      ignoreBuildErrors: true,
   },
   images: {
      unoptimized: true,
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
