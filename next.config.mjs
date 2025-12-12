/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
// For custom domain, use empty basePath. For GitHub Pages subdomain, use /nnp-web
const basePath = isGitHubPages && !process.env.CUSTOM_DOMAIN ? '/nnp-web' : '';

const nextConfig = {
   basePath: basePath,
   assetPrefix: basePath,
   trailingSlash: true,
   // For Cloud Run, we need standalone output, not static export
   output: process.env.CLOUD_RUN === 'true' ? 'standalone' : ((isProduction || isGitHubPages) ? 'export' : undefined),
   // Exclude admin routes from static export (they require auth and API routes)
   generateBuildId: async () => {
     return 'static-build'
   },
   eslint: {
      ignoreDuringBuilds: true,
   },
   typescript: {
      ignoreBuildErrors: true,
   },
   images: {
      unoptimized: isProduction || isGitHubPages,
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
