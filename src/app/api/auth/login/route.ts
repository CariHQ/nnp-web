import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { signIn } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Login request body:', body)
    
    const { email, password } = body

    if (!email || !password) {
      console.log('Missing email or password:', { email, password })
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const result = await signIn(email, password)

    if (result.error) {
      console.log('Sign in error:', result.error)
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    console.log('Sign in successful:', result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

