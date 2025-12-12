const fs = require('fs');
const path = require('path');

// Temporarily move API routes and admin routes out of app directory for static export
const apiDir = path.join(process.cwd(), 'src', 'app', 'api');
const adminDir = path.join(process.cwd(), 'src', 'app', 'admin');
const tempApiDir = path.join(process.cwd(), 'src', '_api_temp');
const tempAdminDir = path.join(process.cwd(), 'src', '_admin_temp');

if (process.env.NODE_ENV === 'production') {
  if (fs.existsSync(apiDir)) {
    console.log('Moving API routes out of app directory for static export...');
    if (fs.existsSync(tempApiDir)) {
      fs.rmSync(tempApiDir, { recursive: true, force: true });
    }
    fs.renameSync(apiDir, tempApiDir);
    console.log('API routes moved to temporary location');
  }
  
  if (fs.existsSync(adminDir)) {
    console.log('Moving admin routes out of app directory for static export...');
    if (fs.existsSync(tempAdminDir)) {
      fs.rmSync(tempAdminDir, { recursive: true, force: true });
    }
    fs.renameSync(adminDir, tempAdminDir);
    console.log('Admin routes moved to temporary location');
  }
}

console.log('Pre-build script completed');

