import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { db } from './db'
import { users, accounts } from './db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'default-secret-key')

export async function signIn(email: string, password: string) {
  // Find user
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!user) {
    return { error: 'Invalid credentials' }
  }

  // Find account with password
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, user.id),
  })

  if (!account || !account.password) {
    return { error: 'Invalid credentials' }
  }

  // Verify password
  const valid = await bcrypt.compare(password, account.password)
  
  if (!valid) {
    return { error: 'Invalid credentials' }
  }

  // Create JWT token
  const token = await new SignJWT({ userId: user.id, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return { success: true, user: { id: user.id, email: user.email, name: user.name } }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token.value, secret)
    return {
      userId: payload.userId as string,
      email: payload.email as string,
    }
  } catch {
    return null
  }
}
