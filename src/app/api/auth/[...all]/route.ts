// For Cloud Run (standalone), use dynamic rendering
// For static export, use force-static
export const dynamic = 'force-dynamic'

// Required for static export - catch-all routes need to return array of objects
export function generateStaticParams() {
  if (process.env.CLOUD_RUN === 'true') {
    // Not needed for standalone/dynamic
    return []
  }
  return [{ all: [] }]
}

// API routes don't work in static export, so these handlers won't be called
export async function GET() {
  return new Response('API routes not available in static export', { status: 404 })
}

export async function POST() {
  return new Response('API routes not available in static export', { status: 404 })
}
