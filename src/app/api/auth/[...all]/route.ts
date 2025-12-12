// For Cloud Run (standalone), use dynamic rendering
export const dynamic = 'force-dynamic'

// API route handlers
export async function GET() {
  return new Response('API routes not available in static export', { status: 404 })
}

export async function POST() {
  return new Response('API routes not available in static export', { status: 404 })
}
