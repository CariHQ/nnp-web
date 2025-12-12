'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// Session check removed - handled by middleware
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

type Payment = {
  id: number
  stripePaymentId: string
  amount: number
  currency: string
  status: string
  customerEmail: string | null
  customerName: string | null
  createdAt: number
}

export default function PaymentsPage() {
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/admin/payments')
      const data = await res.json()
      setPayments(data.payments || [])
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline">← Back</Button>
            </Link>
            <h1 className="text-2xl font-bold">Stripe Payments</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div>Loading payments...</div>
        ) : payments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No payments found.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>{formatAmount(payment.amount, payment.currency)}</span>
                    <span
                      className={`text-sm px-3 py-1 rounded ${
                        payment.status === 'succeeded'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <strong>Customer:</strong> {payment.customerName || 'N/A'}
                      </p>
                      <p>
                        <strong>Email:</strong> {payment.customerEmail || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Payment ID:</strong> {payment.stripePaymentId}
                      </p>
                      <p>
                        <strong>Date:</strong> {formatDate(payment.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
