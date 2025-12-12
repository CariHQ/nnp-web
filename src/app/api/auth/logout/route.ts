import { NextResponse } from 'next/server'
export const dynamic = 'force-static'
import { signOut } from '@/lib/auth'

export async function POST() {
  await signOut()
  return NextResponse.json({ success: true })
}

