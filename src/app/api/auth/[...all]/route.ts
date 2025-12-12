// Required for static export - catch-all routes need to return array of objects
export const dynamic = 'force-static'
export async function generateStaticParams() {
  return [{ all: [] }]
}

// API routes don't work in static export, so these handlers won't be called
export async function GET() {
  return new Response('API routes not available in static export', { status: 404 })
}

export async function POST() {
  return new Response('API routes not available in static export', { status: 404 })
}
