const fs = require('fs');
const path = require('path');

// Move API routes and admin routes back after build
const apiDir = path.join(process.cwd(), 'src', 'app', 'api');
const adminDir = path.join(process.cwd(), 'src', 'app', 'admin');
const tempApiDir = path.join(process.cwd(), 'src', '_api_temp');
const tempAdminDir = path.join(process.cwd(), 'src', '_admin_temp');

// Only restore routes for static export (GitHub Pages), not for Cloud Run
if (process.env.NODE_ENV === 'production' && !process.env.CLOUD_RUN) {
  if (fs.existsSync(tempApiDir)) {
    console.log('Restoring API routes after build...');
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true, force: true });
    }
    fs.renameSync(tempApiDir, apiDir);
    console.log('API routes restored');
  }
  
  if (fs.existsSync(tempAdminDir)) {
    console.log('Restoring admin routes after build...');
    if (fs.existsSync(adminDir)) {
      fs.rmSync(adminDir, { recursive: true, force: true });
    }
    fs.renameSync(tempAdminDir, adminDir);
    console.log('Admin routes restored');
  }
}

console.log('Post-build script completed');

