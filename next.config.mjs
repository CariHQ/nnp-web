/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
// For custom domain, use empty basePath. For GitHub Pages subdomain, use /nnp-web
const basePath = isGitHubPages && !process.env.CUSTOM_DOMAIN ? '/nnp-web' : '';

const nextConfig = {
   basePath: basePath,
   assetPrefix: basePath,
   trailingSlash: true,
   output: (isProduction || isGitHubPages) ? 'export' : undefined,
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
