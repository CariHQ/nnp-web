import { NextResponse } from 'next/server'
export const dynamic = 'force-static'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ session: null })
  }

  return NextResponse.json({ session })
}

