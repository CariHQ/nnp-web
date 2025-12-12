/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const isCloudRun = process.env.CLOUD_RUN === 'true';

// For custom domain, use empty basePath. For GitHub Pages subdomain, use /nnp-web
// For Cloud Run with custom domain, use empty basePath
const basePath = isCloudRun ? '' : (isGitHubPages && !process.env.CUSTOM_DOMAIN ? '/nnp-web' : '');

const nextConfig = {
   basePath: basePath,
   assetPrefix: basePath,
   trailingSlash: true,
   // For Cloud Run, we need standalone output, not static export
   output: isCloudRun ? 'standalone' : ((isProduction || isGitHubPages) ? 'export' : undefined),
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
   // Ensure CSS is properly bundled in standalone mode
   outputFileTracingIncludes: {
      '/**': [
         'node_modules/@uiw/**/*',
      ],
   },
};

export default nextConfig;
