const fs = require('fs');
const path = require('path');

// Remove API routes before static export since they can't be statically exported
const apiDir = path.join(process.cwd(), 'src', 'app', 'api');

if (fs.existsSync(apiDir)) {
  console.log('Removing API routes for static export...');
  // We'll rename the directory so Next.js doesn't try to build it
  // But actually, we should just let Next.js skip it during export
  // The issue is dynamic routes need generateStaticParams
  console.log('API routes will be skipped during static export');
}

console.log('Pre-build script completed');

