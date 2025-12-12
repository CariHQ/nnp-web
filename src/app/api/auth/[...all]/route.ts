// For Cloud Run (standalone), use dynamic rendering
export const dynamic = 'force-dynamic'

// This catch-all route should not be used - auth routes are handled by individual route files
// But we need this to exist for the route structure
export async function GET() {
  return new Response('Not found', { status: 404 })
}

export async function POST() {
  return new Response('Not found', { status: 404 })
}
