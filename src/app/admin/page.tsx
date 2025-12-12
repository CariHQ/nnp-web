import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminDashboardClient } from './admin-dashboard-client'

export default async function AdminDashboard() {
  // Server-side authentication check
  const session = await getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  return <AdminDashboardClient />
}
