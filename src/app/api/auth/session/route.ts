import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ authenticated: false, session: null })
  }

  return NextResponse.json({ authenticated: true, session })
}

